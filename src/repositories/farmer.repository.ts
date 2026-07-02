import { Farmer, Prisma } from '@prisma/client';
import { prisma } from '../prisma/client.js';
import type { CreateFarmerInput, UpdateFarmerInput, QueryFarmerInput } from '../validators/farmer.validator.js';
import { getPaginationArgs } from '../utils/pagination.js';
import { calculateDistance } from '../utils/geo.js';

export class FarmerRepository {
  async create(data: CreateFarmerInput): Promise<Farmer> {
    return prisma.farmer.create({ data });
  }

  async findById(id: string): Promise<Farmer | null> {
    return prisma.farmer.findUnique({ where: { id }, include: { user: true, fpo: true } });
  }
  
  async findByUserId(userId: string): Promise<Farmer | null> {
    return prisma.farmer.findUnique({ where: { userId } });
  }

  async update(id: string, data: UpdateFarmerInput): Promise<Farmer> {
    return prisma.farmer.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Farmer> {
    return prisma.farmer.delete({ where: { id } });
  }

  async findAll(query: QueryFarmerInput): Promise<{ data: Farmer[]; total: number }> {
    const { skip, take } = getPaginationArgs(query);
    const where: Prisma.FarmerWhereInput = {};

    if (query.district) where.district = { equals: query.district, mode: 'insensitive' };
    if (query.state) where.state = { equals: query.state, mode: 'insensitive' };
    if (query.fpoId) where.fpoId = query.fpoId;

    if (query.search) {
      where.OR = [
        { farmName: { contains: query.search, mode: 'insensitive' } },
        { village: { contains: query.search, mode: 'insensitive' } },
        { user: { fullName: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    let [data, total] = await Promise.all([
      prisma.farmer.findMany({ where, skip, take, include: { user: true } }),
      prisma.farmer.count({ where }),
    ]);

    if (query.latitude && query.longitude && query.radius) {
      const userCoords = { latitude: query.latitude, longitude: query.longitude };
      const allData = await prisma.farmer.findMany({ where, include: { user: true } });
      const filtered = allData.filter((farmer) => {
        if (!farmer.latitude || !farmer.longitude) return false;
        const dist = calculateDistance(userCoords, { latitude: farmer.latitude, longitude: farmer.longitude });
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

export const farmerRepository = new FarmerRepository();
