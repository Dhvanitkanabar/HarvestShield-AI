import { IDecisionStrategy, DecisionContext, StrategyResult } from '../types.js';

export class SellStrategy implements IDecisionStrategy {
    name = 'SELL_STRATEGY';

    evaluate(context: DecisionContext): StrategyResult {
        let score = 0;
        let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
        let confidence = 50;

        // Sell is highly recommended if risk is getting high but not totally spoiled yet
        if (context.currentRiskScore > 60 && context.currentRiskScore < 90) {
            score = 85;
            priority = 'HIGH';
            confidence = 88;
            return {
                action: 'SELL_NOW',
                score,
                reason: `Spoilage risk is ${context.currentRiskScore.toFixed(0)}%. Highly recommended to sell before complete loss.`,
                priority,
                confidence
            };
        }

        if (context.batch.currentStatus === 'FRESH') {
            score = 60;
            priority = 'MEDIUM';
            confidence = 75;
            return {
                action: 'SELL_NOW',
                score,
                reason: 'Batch is fresh. Selling now yields standard market value.',
                priority,
                confidence
            };
        }

        return {
            action: 'SELL_NOW',
            score: 30,
            reason: 'Holding or processing might be better than selling in current state.',
            priority: 'LOW',
            confidence: 60
        };
    }
}
