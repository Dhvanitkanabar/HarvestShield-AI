import { HarvestBatch, Prisma } from '@prisma/client';
import { prisma } from '../prisma/client.js';
import type { UpdateHarvestInput, QueryHarvestInput } from '../validators/harvest.validator.js';
import { getPaginationArgs } from '../utils/pagination.js';

export class HarvestRepository {
  async create(data: Prisma.HarvestBatchUncheckedCreateInput): Promise<HarvestBatch> {
    return prisma.harvestBatch.create({ data });
  }

  async findById(id: string): Promise<HarvestBatch | null> {
    return prisma.harvestBatch.findUnique({ 
      where: { id },
      include: { crop: true, farmer: { include: { user: true } }, fpo: true }
    });
  }

  async update(id: string, data: UpdateHarvestInput): Promise<HarvestBatch> {
    return prisma.harvestBatch.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<HarvestBatch> {
    return prisma.harvestBatch.delete({ where: { id } });
  }

  async findAll(query: QueryHarvestInput): Promise<{ data: HarvestBatch[]; total: number }> {
    const { skip, take } = getPaginationArgs(query);
    const where: Prisma.HarvestBatchWhereInput = {};

    if (query.farmerId) where.farmerId = query.farmerId;
    if (query.cropId) where.cropId = query.cropId;
    if (query.fpoId) where.fpoId = query.fpoId;
    if (query.status) where.currentStatus = query.status;
    if (query.grade) where.qualityGrade = query.grade;

    if (query.search) {
      where.batchNumber = { contains: query.search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      prisma.harvestBatch.findMany({ 
        where, 
        skip, 
        take,
        orderBy: { createdAt: 'desc' },
        include: { crop: true, farmer: true }
      }),
      prisma.harvestBatch.count({ where }),
    ]);

    return { data, total };
  }

  // Dashboard Aggregations
  async getTotalHarvestQuantity(): Promise<number> {
    const agg = await prisma.harvestBatch.aggregate({ _sum: { quantity: true } });
    return agg._sum.quantity || 0;
  }
  
  async getHarvestTodayQuantity(): Promise<number> {
    const today = new Date();
    today.setHours(0,0,0,0);
    const agg = await prisma.harvestBatch.aggregate({
      _sum: { quantity: true },
      where: { harvestDate: { gte: today } }
    });
    return agg._sum.quantity || 0;
  }
}

export const harvestRepository = new HarvestRepository();
