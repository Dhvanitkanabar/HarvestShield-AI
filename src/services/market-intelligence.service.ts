import { MarketIntelligenceRepository } from '../repositories/market-intelligence.repository.js';
import { CreatePredictionInput } from '../validators/market-intelligence.validator.js';
import { prisma } from '../prisma/client.js';
import { Market } from '@prisma/client';
import createError from 'http-errors';
import { HTTP_STATUS } from '../constants/index.js';

export class MarketIntelligenceService {
  constructor(private readonly marketIntelligenceRepository: MarketIntelligenceRepository) {}

  async getHistoricalPrices(cropId: string, marketId: string) {
    return this.marketIntelligenceRepository.getHistoricalPrices(cropId, marketId);
  }

  async getPricePredictions(cropId: string, marketId: string) {
    return this.marketIntelligenceRepository.getPricePredictions(cropId, marketId);
  }

  async getMarketDemand(cropId: string, marketId: string) {
    return this.marketIntelligenceRepository.getMarketDemand(cropId, marketId);
  }

  async getMarketRecommendations(batchId: string, _radius: number) {
    // 1. Get the batch
    const batch = await prisma.harvestBatch.findUnique({
      where: { id: batchId },
      include: {
        crop: true,
        farmer: true,
      }
    });

    if (!batch) {
      throw createError(HTTP_STATUS.NOT_FOUND, 'Harvest batch not found');
    }

    // 2. Fetch nearby markets (mocking radius check for simplicity without PostGIS)
    const markets = await prisma.market.findMany({
      take: 10
    });

    // 3. Compare profit and transport cost for each market
    const recommendations = await Promise.all(markets.map(async (market: Market) => {
      // Fetch latest price or prediction for this market and crop
      const prediction = await prisma.pricePrediction.findFirst({
        where: { cropId: batch.cropId, marketId: market.id },
        orderBy: { predictedDate: 'asc' }
      });

      const expectedPricePerUnit = prediction ? prediction.predictedModalPrice : 0;
      const expectedRevenue = expectedPricePerUnit * batch.quantity;
      
      // Mock transport cost: $2 per km, mock distance 10-50km
      const estimatedDistance = Math.floor(Math.random() * 40) + 10;
      const transportCost = estimatedDistance * 2;
      const expectedProfit = expectedRevenue - transportCost;

      return {
        marketId: market.id,
        marketName: market.marketName,
        distanceKm: estimatedDistance,
        expectedPricePerUnit,
        transportCost,
        expectedProfit,
        confidenceScore: prediction?.confidenceScore || 0,
        recommendedDate: prediction?.predictedDate || new Date()
      };
    }));

    // 4. Sort by expected profit descending
    return recommendations.sort((a: { expectedProfit: number }, b: { expectedProfit: number }) => b.expectedProfit - a.expectedProfit);
  }

  async createPrediction(data: CreatePredictionInput) {
    return prisma.pricePrediction.create({
      data: {
        marketId: data.marketId,
        cropId: data.cropId,
        predictedDate: new Date(data.predictedDate),
        predictedMinPrice: data.predictedMinPrice,
        predictedMaxPrice: data.predictedMaxPrice,
        predictedModalPrice: data.predictedModalPrice,
        confidenceScore: data.confidenceScore,
      }
    });
  }
}
