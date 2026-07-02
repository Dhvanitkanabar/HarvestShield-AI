import { IDecisionStrategy, DecisionContext, StrategyResult } from '../types.js';

export class StoreStrategy implements IDecisionStrategy {
    name = 'STORE_STRATEGY';

    evaluate(context: DecisionContext): StrategyResult {
        // Only recommend store if risk is low and batch is fresh
        if (context.currentRiskScore < 30 && context.batch.currentStatus === 'FRESH' && context.batch.qualityGrade === 'A') {
            return {
                action: 'STORE',
                score: 90,
                reason: 'Batch is fresh and high quality. Storing will allow selling during peak market prices later.',
                priority: 'HIGH',
                confidence: 92
            };
        }

        return {
            action: 'STORE',
            score: 20,
            reason: 'Risk is too high or quality too low for long-term storage.',
            priority: 'LOW',
            confidence: 85
        };
    }
}
