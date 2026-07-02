import { HarvestBatch, Inventory, Crop, RecommendationAction, PriorityLevel } from '@prisma/client';

export interface DecisionContext {
    batch: HarvestBatch;
    inventory?: Inventory | null;
    crop: Crop;
    currentRiskScore: number;
    expectedProfit: number;
}

export interface StrategyResult {
    action: RecommendationAction;
    score: number;       // 0 to 100
    reason: string;
    priority: PriorityLevel;
    confidence: number;  // 0 to 100
}

export interface IDecisionStrategy {
    name: string;
    evaluate(context: DecisionContext): StrategyResult;
}
