import { Fpo, Prisma } from '@prisma/client';
import { prisma } from '../prisma/client.js';
import type { CreateFpoInput, UpdateFpoInput, QueryFpoInput } from '../validators/fpo.validator.js';
import { getPaginationArgs } from '../utils/pagination.js';
import { calculateDistance } from '../utils/geo.js';

export class FpoRepository {
  async create(data: CreateFpoInput): Promise<Fpo> {
    return prisma.fpo.create({ data });
  }

  async findById(id: string): Promise<Fpo | null> {
    return prisma.fpo.findUnique({ where: { id } });
  }

  async findByRegistration(registrationNumber: string): Promise<Fpo | null> {
    return prisma.fpo.findUnique({ where: { registrationNumber } });
  }

  async update(id: string, data: UpdateFpoInput): Promise<Fpo> {
    return prisma.fpo.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Fpo> {
    return prisma.fpo.delete({ where: { id } });
  }

  async findAll(query: QueryFpoInput): Promise<{ data: Fpo[]; total: number }> {
    const { skip, take } = getPaginationArgs(query);
    const where: Prisma.FpoWhereInput = {};

    if (query.state) {
      where.state = { equals: query.state, mode: 'insensitive' };
    }

    if (query.district) {
      where.district = { equals: query.district, mode: 'insensitive' };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { registrationNumber: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    let [data, total] = await Promise.all([
      prisma.fpo.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
      prisma.fpo.count({ where }),
    ]);

    // Apply Haversine distance filtering if coordinates are provided
    if (query.latitude && query.longitude && query.radius) {
      const userCoords = { latitude: query.latitude, longitude: query.longitude };
      
      // We must fetch all matching (or a large enough subset) to calculate distance properly if we want accurate pagination.
      // For Phase 2, doing in-memory filter of the current page data is acceptable, but better is filtering *all* matching data.
      const allData = await prisma.fpo.findMany({ where });
      const filtered = allData.filter((fpo) => {
        if (!fpo.latitude || !fpo.longitude) return false;
        const dist = calculateDistance(userCoords, { latitude: fpo.latitude, longitude: fpo.longitude });
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

export const fpoRepository = new FpoRepository();
