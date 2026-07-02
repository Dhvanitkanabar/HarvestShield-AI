import { IDecisionStrategy, DecisionContext, StrategyResult } from './types.js';
import { SellStrategy } from './strategies/sell.strategy.js';
import { StoreStrategy } from './strategies/store.strategy.js';
import { ProcessorStrategy } from './strategies/processor.strategy.js';
import { DiscardStrategy } from './strategies/discard.strategy.js';

export class DecisionEngine {
    private strategies: IDecisionStrategy[];

    constructor() {
        this.strategies = [
            new SellStrategy(),
            new StoreStrategy(),
            new ProcessorStrategy(),
            new DiscardStrategy()
        ];
    }

    public evaluateAll(context: DecisionContext): { bestRecommendation: StrategyResult, allResults: StrategyResult[] } {
        const results = this.strategies.map(strategy => strategy.evaluate(context));
        
        // Sort descending by score
        results.sort((a, b) => b.score - a.score);

        return {
            bestRecommendation: results[0],
            allResults: results
        };
    }
}

export const decisionEngine = new DecisionEngine();
