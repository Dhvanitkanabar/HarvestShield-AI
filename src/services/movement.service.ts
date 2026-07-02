import { MovementRepository } from '../repositories/movement.repository.js';
import { harvestRepository } from '../repositories/harvest.repository.js';
import { inventoryRepository } from '../repositories/inventory.repository.js';
import { AppError, formatPaginatedResponse } from '../utils/index.js';
import { HTTP_STATUS } from '../constants/index.js';
import { calculateRemainingQuantity } from '../utils/inventory.js';
import type { CreateMovementInput, QueryMovementInput } from '../validators/movement.validator.js';
import { prisma } from '../prisma/client.js';

export class MovementService {
  constructor(private readonly movementRepo: MovementRepository) {}

  async createMovement(input: CreateMovementInput) {
    const batch = await harvestRepository.findById(input.batchId);
    if (!batch) throw new AppError('Harvest batch not found', HTTP_STATUS.NOT_FOUND);

    // If movement is SOLD or SPOILED, we must deduct from inventory
    if (input.movementType === 'SOLD' || input.movementType === 'SPOILED') {
        const inventory = await inventoryRepository.findByBatchId(input.batchId);
        if (inventory) {
            // For simplicity, assuming the entire remaining batch is marked. 
            // In a real scenario, quantity would be part of movement.
            const newRemaining = calculateRemainingQuantity(inventory.remainingQuantity, inventory.remainingQuantity);
            
            await prisma.$transaction([
                prisma.movement.create({ data: input }),
                prisma.harvestBatch.update({ where: { id: input.batchId }, data: { currentStatus: input.movementType, currentLocation: input.toLocation } }),
                prisma.inventory.update({ where: { id: inventory.id }, data: { remainingQuantity: newRemaining } })
            ]);
            return;
        }
    }
    
    // Default standard movement update
    const result = await prisma.$transaction([
        prisma.movement.create({ data: input }),
        prisma.harvestBatch.update({ 
            where: { id: input.batchId }, 
            data: { 
                currentStatus: input.movementType === 'TRANSPORT' ? 'IN_TRANSIT' : 
                               input.movementType === 'MARKET' ? 'AT_MARKET' :
                               input.movementType === 'PROCESSOR' ? 'PROCESSING' : batch.currentStatus,
                currentLocation: input.toLocation 
            }
        })
    ]);

    return result[0];
  }

  async getMovementById(id: string) {
    const movement = await this.movementRepo.findById(id);
    if (!movement) throw new AppError('Movement record not found', HTTP_STATUS.NOT_FOUND);
    return movement;
  }

  async getMovements(query: QueryMovementInput) {
    const { data, total } = await this.movementRepo.findAll(query);
    const page = query.page || 1;
    const limit = query.limit || 10;
    return formatPaginatedResponse(data, total, page, limit);
  }
}
