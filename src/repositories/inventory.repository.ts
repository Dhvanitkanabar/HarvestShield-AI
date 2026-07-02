import { Inventory, Prisma } from '@prisma/client';
import { prisma } from '../prisma/client.js';
import type { UpdateInventoryInput, QueryInventoryInput } from '../validators/inventory.validator.js';
import { getPaginationArgs } from '../utils/pagination.js';

export class InventoryRepository {
  async create(data: Prisma.InventoryUncheckedCreateInput): Promise<Inventory> {
    return prisma.inventory.create({ data });
  }

  async findById(id: string): Promise<Inventory | null> {
    return prisma.inventory.findUnique({ 
      where: { id },
      include: { harvestBatch: true, warehouse: true }
    });
  }
  
  async findByBatchId(batchId: string): Promise<Inventory | null> {
    return prisma.inventory.findFirst({ where: { batchId } });
  }

  async update(id: string, data: UpdateInventoryInput | { remainingQuantity: number }): Promise<Inventory> {
    return prisma.inventory.update({
      where: { id },
      data,
    });
  }

  async findAll(query: QueryInventoryInput): Promise<{ data: Inventory[]; total: number }> {
    const { skip, take } = getPaginationArgs(query);
    const where: Prisma.InventoryWhereInput = {};

    if (query.warehouseId) where.warehouseId = query.warehouseId;
    if (query.batchId) where.batchId = query.batchId;
    
    // Only show active inventory by default
    where.remainingQuantity = { gt: 0 };

    if (query.expiringSoon) {
      const now = new Date();
      const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);
      where.expiryDate = {
          gte: now,
          lte: in48Hours
      };
    }

    const [data, total] = await Promise.all([
      prisma.inventory.findMany({ 
        where, 
        skip, 
        take,
        orderBy: { expiryDate: 'asc' },
        include: { harvestBatch: true, warehouse: true }
      }),
      prisma.inventory.count({ where }),
    ]);

    return { data, total };
  }

  // Dashboard Aggregations
  async getActiveInventoryStats(): Promise<{ activeBatches: number; totalStored: number }> {
    const agg = await prisma.inventory.aggregate({
      _sum: { remainingQuantity: true },
      _count: { id: true },
      where: { remainingQuantity: { gt: 0 } }
    });
    return {
        activeBatches: agg._count.id,
        totalStored: agg._sum.remainingQuantity || 0
    };
  }
}

export const inventoryRepository = new InventoryRepository();
