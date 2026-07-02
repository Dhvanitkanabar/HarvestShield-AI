import { InventoryRepository } from '../repositories/inventory.repository.js';
import { harvestRepository } from '../repositories/harvest.repository.js';
import { warehouseRepository } from '../repositories/warehouse.repository.js';
import { AppError, formatPaginatedResponse } from '../utils/index.js';
import { HTTP_STATUS } from '../constants/index.js';
import { validateInventoryCapacity } from '../utils/inventory.js';
import { calculateExpiryDate } from '../utils/batch.js';
import type { CreateInventoryInput, UpdateInventoryInput, QueryInventoryInput } from '../validators/inventory.validator.js';
import { prisma } from '../prisma/client.js';

export class InventoryService {
  constructor(private readonly inventoryRepo: InventoryRepository) {}

  async createInventory(input: CreateInventoryInput) {
    const batch = await harvestRepository.findById(input.batchId);
    if (!batch) throw new AppError('Harvest batch not found', HTTP_STATUS.NOT_FOUND);
    
    if (batch.currentStatus !== 'FRESH' && batch.currentStatus !== 'IN_TRANSIT') {
        throw new AppError(`Cannot store batch with status: ${batch.currentStatus}`, HTTP_STATUS.BAD_REQUEST);
    }

    const warehouse = await warehouseRepository.findById(input.warehouseId);
    if (!warehouse) throw new AppError('Warehouse not found', HTTP_STATUS.NOT_FOUND);

    validateInventoryCapacity(warehouse.availableCapacity, input.storedQuantity);

    const expiryDate = calculateExpiryDate(batch.harvestDate, batch.expectedShelfLifeDays || 14);

    // Transaction to create inventory, update warehouse capacity, log movement, update batch
    const result = await prisma.$transaction(async (tx) => {
        // 1. Create Inventory
        const inventory = await tx.inventory.create({
            data: {
                batchId: input.batchId,
                warehouseId: input.warehouseId,
                storedQuantity: input.storedQuantity,
                remainingQuantity: input.storedQuantity,
                expiryDate,
                temperature: input.temperature,
                humidity: input.humidity,
                storageCondition: input.storageCondition
            }
        });

        // 2. Reduce warehouse capacity
        await tx.warehouse.update({
            where: { id: input.warehouseId },
            data: { availableCapacity: { decrement: input.storedQuantity } }
        });

        // 3. Update Harvest Batch
        await tx.harvestBatch.update({
            where: { id: input.batchId },
            data: { 
                currentStatus: 'STORED',
                currentLocation: warehouse.warehouseName
            }
        });

        // 4. Log Movement
        await tx.movement.create({
            data: {
                batchId: input.batchId,
                movementType: 'STORAGE',
                toLocation: warehouse.warehouseName,
                remarks: `Stored ${input.storedQuantity} ${batch.unit}`,
            }
        });

        return inventory;
    });

    return result;
  }

  async getInventoryById(id: string) {
    const inventory = await this.inventoryRepo.findById(id);
    if (!inventory) throw new AppError('Inventory not found', HTTP_STATUS.NOT_FOUND);
    return inventory;
  }

  async updateInventory(id: string, input: UpdateInventoryInput) {
    await this.getInventoryById(id);
    return this.inventoryRepo.update(id, input);
  }

  async getInventories(query: QueryInventoryInput) {
    const { data, total } = await this.inventoryRepo.findAll(query);
    const page = query.page || 1;
    const limit = query.limit || 10;
    return formatPaginatedResponse(data, total, page, limit);
  }
}
