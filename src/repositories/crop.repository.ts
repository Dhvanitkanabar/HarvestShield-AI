import { Crop, Prisma } from '@prisma/client';
import { prisma } from '../prisma/client.js';
import type { CreateCropInput, UpdateCropInput, QueryCropInput } from '../validators/crop.validator.js';
import { getPaginationArgs } from '../utils/pagination.js';

export class CropRepository {
  async create(data: CreateCropInput): Promise<Crop> {
    return prisma.crop.create({ data });
  }

  async findById(id: string): Promise<Crop | null> {
    return prisma.crop.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateCropInput): Promise<Crop> {
    return prisma.crop.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Crop> {
    return prisma.crop.delete({ where: { id } });
  }

  async findAll(query: QueryCropInput): Promise<{ data: Crop[]; total: number }> {
    const { skip, take } = getPaginationArgs(query);

    const where: Prisma.CropWhereInput = {};
    
    if (query.category) {
      where.category = query.category;
    }
    
    if (query.search) {
      where.OR = [
        { cropName: { contains: query.search, mode: 'insensitive' } },
        { scientificName: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.crop.findMany({
        where,
        skip,
        take,
        orderBy: { cropName: 'asc' },
      }),
      prisma.crop.count({ where }),
    ]);

    return { data, total };
  }
}

export const cropRepository = new CropRepository();
