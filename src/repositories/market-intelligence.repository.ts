import { prisma } from '../prisma/client.js';

export class MarketIntelligenceRepository {
  async getHistoricalPrices(cropId: string, marketId: string) {
    return prisma.marketPriceHistory.findMany({
      where: {
        cropId,
        marketId,
      },
      orderBy: {
        date: 'desc'
      },
      take: 30
    });
  }

  async getPricePredictions(cropId: string, marketId: string) {
    return prisma.pricePrediction.findMany({
      where: {
        cropId,
        marketId,
        predictedDate: {
          gte: new Date()
        }
      },
      orderBy: {
        predictedDate: 'asc'
      }
    });
  }

  async getMarketDemand(cropId: string, marketId: string) {
    return prisma.marketDemand.findFirst({
      where: {
        cropId,
        marketId,
      },
      orderBy: {
        date: 'desc'
      }
    });
  }
}

export const marketIntelligenceRepository = new MarketIntelligenceRepository();
