import { IDecisionStrategy, DecisionContext, StrategyResult } from '../types.js';

export class ProcessorStrategy implements IDecisionStrategy {
    name = 'PROCESSOR_STRATEGY';

    evaluate(context: DecisionContext): StrategyResult {
        if (context.batch.qualityGrade === 'C' && context.currentRiskScore < 80) {
            return {
                action: 'SEND_TO_PROCESSOR',
                score: 80,
                reason: 'Grade C produce is best sent to processors for maximum salvage value.',
                priority: 'MEDIUM',
                confidence: 90
            };
        }

        return {
            action: 'SEND_TO_PROCESSOR',
            score: 40,
            reason: 'Processing is a viable alternative if fresh market prices drop.',
            priority: 'LOW',
            confidence: 70
        };
    }
}
