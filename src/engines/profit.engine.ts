import { HarvestBatch, Crop } from '@prisma/client';

export class ProfitEngine {
    /**
     * Highly simplified dummy profit estimation engine.
     * In a real ML context, this uses dynamic market prices.
     */
    static estimateProfit(batch: HarvestBatch, _crop: Crop, riskScore: number): number {
        // Base value assumes 50 INR per unit roughly
        const baseValue = batch.quantity * 50; 
        
        // Degrade value based on quality
        let multiplier = 1.0;
        if (batch.qualityGrade === 'B') multiplier = 0.8;
        if (batch.qualityGrade === 'C') multiplier = 0.6;
        
        // Degrade value heavily if risk is high (spoilage loss)
        if (riskScore > 80) multiplier *= 0.2;
        else if (riskScore > 60) multiplier *= 0.6;
        
        // Deduct dummy storage/transport cost (10%)
        const grossValue = baseValue * multiplier;
        const costs = grossValue * 0.1;

        return grossValue - costs;
    }
}
