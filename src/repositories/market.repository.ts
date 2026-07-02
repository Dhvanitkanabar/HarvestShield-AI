import { Market, Prisma } from '@prisma/client';
import { prisma } from '../prisma/client.js';
import type { CreateMarketInput, UpdateMarketInput, QueryMarketInput } from '../validators/market.validator.js';
import { getPaginationArgs } from '../utils/pagination.js';
import { calculateDistance } from '../utils/geo.js';

export class MarketRepository {
  async create(data: CreateMarketInput): Promise<Market> {
    return prisma.market.create({ data });
  }

  async findById(id: string): Promise<Market | null> {
    return prisma.market.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateMarketInput): Promise<Market> {
    return prisma.market.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Market> {
    return prisma.market.delete({ where: { id } });
  }

  async findAll(query: QueryMarketInput): Promise<{ data: Market[]; total: number }> {
    const { skip, take } = getPaginationArgs(query);
    const where: Prisma.MarketWhereInput = {};

    if (query.district) where.district = { equals: query.district, mode: 'insensitive' };
    if (query.state) where.state = { equals: query.state, mode: 'insensitive' };
    if (query.marketType) where.marketType = query.marketType;

    if (query.search) {
      where.OR = [
        { marketName: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    let [data, total] = await Promise.all([
      prisma.market.findMany({ where, skip, take, orderBy: { marketName: 'asc' } }),
      prisma.market.count({ where }),
    ]);

    if (query.latitude && query.longitude && query.radius) {
      const userCoords = { latitude: query.latitude, longitude: query.longitude };
      const allData = await prisma.market.findMany({ where });
      const filtered = allData.filter((m) => {
        if (!m.latitude || !m.longitude) return false;
        const dist = calculateDistance(userCoords, { latitude: m.latitude, longitude: m.longitude });
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

export const marketRepository = new MarketRepository();
