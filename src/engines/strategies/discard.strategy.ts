import { IDecisionStrategy, DecisionContext, StrategyResult } from '../types.js';

export class DiscardStrategy implements IDecisionStrategy {
    name = 'DISCARD_STRATEGY';

    evaluate(context: DecisionContext): StrategyResult {
        if (context.currentRiskScore >= 95 || context.batch.currentStatus === 'SPOILED') {
            return {
                action: 'DISCARD',
                score: 100,
                reason: 'Produce is fully spoiled or risk is critical. Discard to prevent contamination.',
                priority: 'CRITICAL',
                confidence: 99
            };
        }

        return {
            action: 'DISCARD',
            score: 0,
            reason: 'Produce is still viable.',
            priority: 'LOW',
            confidence: 100
        };
    }
}
