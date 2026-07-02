import { Warehouse, Prisma } from '@prisma/client';
import { prisma } from '../prisma/client.js';
import type { CreateWarehouseInput, UpdateWarehouseInput, QueryWarehouseInput } from '../validators/warehouse.validator.js';
import { getPaginationArgs } from '../utils/pagination.js';
import { calculateDistance } from '../utils/geo.js';

export class WarehouseRepository {
  async create(data: CreateWarehouseInput): Promise<Warehouse> {
    return prisma.warehouse.create({ data });
  }

  async findById(id: string): Promise<Warehouse | null> {
    return prisma.warehouse.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateWarehouseInput): Promise<Warehouse> {
    return prisma.warehouse.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Warehouse> {
    return prisma.warehouse.delete({ where: { id } });
  }

  async findAll(query: QueryWarehouseInput): Promise<{ data: Warehouse[]; total: number }> {
    const { skip, take } = getPaginationArgs(query);
    const where: Prisma.WarehouseWhereInput = {};

    if (query.district) where.district = { equals: query.district, mode: 'insensitive' };
    if (query.state) where.state = { equals: query.state, mode: 'insensitive' };
    if (query.warehouseType) where.warehouseType = query.warehouseType;

    if (query.search) {
      where.OR = [
        { warehouseName: { contains: query.search, mode: 'insensitive' } },
        { ownerName: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    let [data, total] = await Promise.all([
      prisma.warehouse.findMany({ where, skip, take, orderBy: { warehouseName: 'asc' } }),
      prisma.warehouse.count({ where }),
    ]);

    if (query.latitude && query.longitude && query.radius) {
      const userCoords = { latitude: query.latitude, longitude: query.longitude };
      const allData = await prisma.warehouse.findMany({ where });
      const filtered = allData.filter((w) => {
        if (!w.latitude || !w.longitude) return false;
        const dist = calculateDistance(userCoords, { latitude: w.latitude, longitude: w.longitude });
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

export const warehouseRepository = new WarehouseRepository();
