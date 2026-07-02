import { Movement, Prisma } from '@prisma/client';
import { prisma } from '../prisma/client.js';
import type { QueryMovementInput } from '../validators/movement.validator.js';
import { getPaginationArgs } from '../utils/pagination.js';

export class MovementRepository {
  async create(data: Prisma.MovementUncheckedCreateInput): Promise<Movement> {
    return prisma.movement.create({ data });
  }

  async findById(id: string): Promise<Movement | null> {
    return prisma.movement.findUnique({ 
      where: { id },
      include: { harvestBatch: true }
    });
  }

  async findAll(query: QueryMovementInput): Promise<{ data: Movement[]; total: number }> {
    const { skip, take } = getPaginationArgs(query);
    const where: Prisma.MovementWhereInput = {};

    if (query.batchId) where.batchId = query.batchId;
    if (query.movementType) where.movementType = query.movementType;

    const [data, total] = await Promise.all([
      prisma.movement.findMany({ 
        where, 
        skip, 
        take,
        orderBy: { movementDate: 'desc' },
      }),
      prisma.movement.count({ where }),
    ]);

    return { data, total };
  }
}

export const movementRepository = new MovementRepository();
