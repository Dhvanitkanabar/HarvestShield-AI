import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DashboardService {
  async getExecutiveDashboard() {
    // Collect aggregated metrics
    const [
      totalFarmers,
      totalHarvests,
      totalWarehouses,
      totalInventories,
      activeAlerts,
      pendingRecommendations
    ] = await Promise.all([
      prisma.farmer.count(),
      prisma.harvestBatch.count(),
      prisma.warehouse.count(),
      prisma.inventory.count(),
      prisma.alert.count({ where: { status: { in: ['NEW', 'ACKNOWLEDGED', 'IN_PROGRESS'] } } }),
      prisma.recommendation.count({ where: { /* maybe add status field to recommendation later? */ } })
    ]);

    const metrics = {
      totalFarmers,
      totalHarvests,
      totalWarehouses,
      totalInventories,
      activeAlerts,
      pendingRecommendations
    };

    // Store a snapshot for historical trend analysis
    await prisma.dashboardSnapshot.create({
      data: {
        metrics
      }
    });

    return metrics;
  }
}
