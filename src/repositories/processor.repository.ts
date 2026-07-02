import { Processor, Prisma } from '@prisma/client';
import { prisma } from '../prisma/client.js';
import type { CreateProcessorInput, UpdateProcessorInput, QueryProcessorInput } from '../validators/processor.validator.js';
import { getPaginationArgs } from '../utils/pagination.js';
import { calculateDistance } from '../utils/geo.js';

export class ProcessorRepository {
  async create(data: CreateProcessorInput): Promise<Processor> {
    return prisma.processor.create({ data });
  }

  async findById(id: string): Promise<Processor | null> {
    return prisma.processor.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateProcessorInput): Promise<Processor> {
    return prisma.processor.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Processor> {
    return prisma.processor.delete({ where: { id } });
  }

  async findAll(query: QueryProcessorInput): Promise<{ data: Processor[]; total: number }> {
    const { skip, take } = getPaginationArgs(query);
    const where: Prisma.ProcessorWhereInput = {};

    if (query.district) where.district = { equals: query.district, mode: 'insensitive' };
    if (query.state) where.state = { equals: query.state, mode: 'insensitive' };
    
    if (query.acceptedCrop) {
      where.acceptedCrops = { has: query.acceptedCrop };
    }

    if (query.search) {
      where.OR = [
        { companyName: { contains: query.search, mode: 'insensitive' } },
        { processingType: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    let [data, total] = await Promise.all([
      prisma.processor.findMany({ where, skip, take, orderBy: { companyName: 'asc' } }),
      prisma.processor.count({ where }),
    ]);

    if (query.latitude && query.longitude && query.radius) {
      const userCoords = { latitude: query.latitude, longitude: query.longitude };
      const allData = await prisma.processor.findMany({ where });
      const filtered = allData.filter((p) => {
        if (!p.latitude || !p.longitude) return false;
        const dist = calculateDistance(userCoords, { latitude: p.latitude, longitude: p.longitude });
        return dist <= query.radius!;
      });
      total = filtered.length;
      data = filtered.sort((a, b) => {
         const distA = calculateDistance(userCoords, { latitude: a.latitude!, longitude: a.longitude! });
         const distB = calculateDistance(userCoords, { latitude: b.latitude!, longitude: b.longitude! });
         return distA - distB;
      }).slice(skip, skip + take);
    }

    return { data, total };
  }
}

export const processorRepository = new ProcessorRepository();
