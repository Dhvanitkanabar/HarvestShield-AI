import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AnalyticsService {
  async getHarvestGrowth(periodType: 'DAILY' | 'WEEKLY' | 'MONTHLY') {
    // Generate mock trend analysis
    return await prisma.analyticsSnapshot.findMany({
      where: { periodType },
      orderBy: { periodStart: 'asc' }
    });
  }

  async generateAnalyticsSnapshot(periodStart: Date, periodEnd: Date, periodType: 'DAILY' | 'WEEKLY' | 'MONTHLY') {
    const harvests = await prisma.harvestBatch.count({
      where: {
        createdAt: {
          gte: periodStart,
          lte: periodEnd
        }
      }
    });

    const metrics = { harvestGrowth: harvests, spoilageRate: 2.5 /* placeholder */ };
    
    return prisma.analyticsSnapshot.create({
      data: {
        periodStart,
        periodEnd,
        periodType,
        metrics
      }
    });
  }
}
