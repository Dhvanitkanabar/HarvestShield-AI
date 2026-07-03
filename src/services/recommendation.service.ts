import { RecommendationRepository } from '../repositories/recommendation.repository.js';
import { harvestRepository } from '../repositories/harvest.repository.js';
import { inventoryRepository } from '../repositories/inventory.repository.js';
import { cropRepository } from '../repositories/crop.repository.js';
import { AppError, formatPaginatedResponse } from '../utils/index.js';
import { HTTP_STATUS } from '../constants/index.js';
import { RiskEngine } from '../engines/risk.engine.js';
import { ProfitEngine } from '../engines/profit.engine.js';
import { decisionEngine } from '../engines/decision.engine.js';
import type { QueryRecommendationInput } from '../validators/recommendation.validator.js';
import { env } from '../config/env.js';

export class RecommendationService {
  constructor(private readonly recommendationRepo: RecommendationRepository) {}

  async generateRecommendation(batchId: string) {
    const batch = await harvestRepository.findById(batchId);
    if (!batch) throw new AppError('Batch not found', HTTP_STATUS.NOT_FOUND);

    const crop = await cropRepository.findById(batch.cropId);
    if (!crop) throw new AppError('Crop not found', HTTP_STATUS.NOT_FOUND);

    const inventory = await inventoryRepository.findByBatchId(batch.id);

    // 1. Calculate Risk
    const remainingShelfLife = batch.expectedShelfLifeDays || 1; // Simplify diff calculation
    const riskScore = RiskEngine.calculateRiskScore(batch, remainingShelfLife);
    const riskCategory = RiskEngine.getRiskCategory(riskScore);

    // 2. Estimate Profit
    const expectedProfit = ProfitEngine.estimateProfit(batch, crop, riskScore);

    // 3. Run Decision Engine
    const context = { batch, inventory, crop, currentRiskScore: riskScore, expectedProfit };
    const { bestRecommendation, allResults } = decisionEngine.evaluateAll(context);

    // Call Python AI Microservice
    let aiRecommendation: any = null;
    try {
        const aiUrl = env.AI_SERVICE_URL || 'http://localhost:8000';
        const response = await fetch(`${aiUrl}/recommend`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                batch_id: batch.id,
                crop: crop.cropName,
                quantity: batch.quantity,
                storage_days: 0, // Simplify
                shelf_life: batch.expectedShelfLifeDays || 1,
                temperature: inventory?.temperature || 25,
                humidity: inventory?.humidity || 60,
                quality_grade: batch.qualityGrade || 'A',
                current_price: 0 // Mock price or get from market service
            })
        });
        
        if (response.ok) {
            aiRecommendation = await response.json();
        }
    } catch (err) {
        console.warn("AI Service unavailable, falling back to local rule-based Decision Engine.");
    }

    let finalAction, finalConfidence, finalReason, finalPriority;

    if (aiRecommendation && aiRecommendation.best_action) {
        finalAction = aiRecommendation.best_action.action;
        finalConfidence = aiRecommendation.best_action.confidence;
        finalReason = aiRecommendation.best_action.reason;
        finalPriority = aiRecommendation.best_action.priority;
    } else {
        finalAction = bestRecommendation.action;
        finalConfidence = bestRecommendation.confidence;
        finalReason = bestRecommendation.reason;
        finalPriority = bestRecommendation.priority;
    }

    // 4. Save everything via Transaction
    const savedRec = await this.recommendationRepo.saveRecommendationTransaction({
        recommendation: {
            batchId,
            recommendedAction: finalAction,
            reason: finalReason,
            confidenceScore: finalConfidence,
            priority: finalPriority,
            expectedProfit,
            spoilageRiskScore: riskScore
        },
        histories: allResults.map(res => ({
            actionEvaluated: res.action,
            score: res.score,
            reasoning: res.reason
        })),
        riskAssessment: {
            batchId,
            riskScore,
            riskCategory,
            factors: { remainingShelfLife, storageQuality: inventory?.storageCondition || 'None' }
        },
        predictionSnapshot: {
            batchId,
            shelfLifeRemaining: remainingShelfLife,
            storageQuality: inventory?.storageCondition || 'None',
            environmentalConditions: { temp: inventory?.temperature, humidity: inventory?.humidity }
        }
    });

    return savedRec;
  }

  async getRecommendationById(id: string) {
    const rec = await this.recommendationRepo.findById(id);
    if (!rec) throw new AppError('Recommendation not found', HTTP_STATUS.NOT_FOUND);
    return rec;
  }

  async getHistoryByBatch(batchId: string) {
    return this.recommendationRepo.findHistoryByBatch(batchId);
  }

  async getRecommendations(query: QueryRecommendationInput) {
    const { data, total } = await this.recommendationRepo.findAll(query);
    return formatPaginatedResponse(data, total, query.page || 1, query.limit || 10);
  }

  async getDashboardSummary() {
    return this.recommendationRepo.getSummaryStats();
  }

  async getHighRiskBatches() {
    return this.recommendationRepo.getHighRiskBatches();
  }
}
