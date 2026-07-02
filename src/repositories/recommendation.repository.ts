import { Recommendation, Prisma } from '@prisma/client';
import { prisma } from '../prisma/client.js';
import { getPaginationArgs } from '../utils/pagination.js';
import type { QueryRecommendationInput } from '../validators/recommendation.validator.js';

export class RecommendationRepository {
  async saveRecommendationTransaction(data: {
      recommendation: Prisma.RecommendationUncheckedCreateInput,
      histories: Prisma.DecisionHistoryUncheckedCreateWithoutRecommendationInput[],
      riskAssessment: Prisma.RiskAssessmentUncheckedCreateInput,
      predictionSnapshot: Prisma.PredictionSnapshotUncheckedCreateInput
  }): Promise<Recommendation> {
      return prisma.$transaction(async (tx) => {
          const rec = await tx.recommendation.create({
              data: {
                  ...data.recommendation,
                  decisionHistories: {
                      create: data.histories
                  }
              },
              include: { decisionHistories: true }
          });

          await tx.riskAssessment.create({ data: data.riskAssessment });
          await tx.predictionSnapshot.create({ data: data.predictionSnapshot });

          return rec;
      });
  }

  async findById(id: string): Promise<Recommendation | null> {
    return prisma.recommendation.findUnique({
        where: { id },
        include: { decisionHistories: true }
    });
  }

  async findHistoryByBatch(batchId: string): Promise<Recommendation[]> {
      return prisma.recommendation.findMany({
          where: { batchId },
          include: { decisionHistories: true },
          orderBy: { createdAt: 'desc' }
      });
  }

  async findAll(query: QueryRecommendationInput): Promise<{ data: Recommendation[]; total: number }> {
      const { skip, take } = getPaginationArgs(query);
      const where: Prisma.RecommendationWhereInput = {};
      if (query.batchId) where.batchId = query.batchId;

      const [data, total] = await Promise.all([
          prisma.recommendation.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
          prisma.recommendation.count({ where })
      ]);
      return { data, total };
  }

  // Dashboard APIs
  async getSummaryStats() {
      const [total, sell, store, criticalRisk] = await Promise.all([
          prisma.recommendation.count(),
          prisma.recommendation.count({ where: { recommendedAction: 'SELL_NOW' } }),
          prisma.recommendation.count({ where: { recommendedAction: 'STORE' } }),
          prisma.riskAssessment.count({ where: { riskCategory: 'CRITICAL' } })
      ]);
      return { total, sell, store, criticalRisk };
  }

  async getHighRiskBatches() {
      return prisma.riskAssessment.findMany({
          where: { riskCategory: { in: ['HIGH', 'CRITICAL'] } },
          include: { harvestBatch: true },
          orderBy: { riskScore: 'desc' },
          take: 10
      });
  }
}

export const recommendationRepository = new RecommendationRepository();
