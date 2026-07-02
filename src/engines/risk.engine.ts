import { HarvestBatch, RiskCategory } from '@prisma/client';

export class RiskEngine {
    
    /**
     * Calculates spoilage risk score from 0 to 100
     */
    static calculateRiskScore(batch: HarvestBatch, remainingShelfLifeDays: number): number {
        let riskScore = 0;

        // Base risk on remaining shelf life percentage (lower = higher risk)
        const expectedLife = batch.expectedShelfLifeDays || 1;
        const remainingPercentage = Math.max(0, remainingShelfLifeDays / expectedLife);
        
        if (remainingPercentage <= 0.1) riskScore += 50;
        else if (remainingPercentage <= 0.3) riskScore += 30;
        else if (remainingPercentage <= 0.6) riskScore += 15;

        // Quality grade factors
        if (batch.qualityGrade === 'C') riskScore += 25;
        else if (batch.qualityGrade === 'B') riskScore += 10;
        
        // Status factor
        if (batch.currentStatus === 'FRESH' && remainingPercentage < 0.8) riskScore += 10;
        else if (batch.currentStatus === 'IN_TRANSIT') riskScore += 5;

        return Math.min(100, Math.max(0, riskScore));
    }

    static getRiskCategory(score: number): RiskCategory {
        if (score >= 80) return 'CRITICAL';
        if (score >= 60) return 'HIGH';
        if (score >= 30) return 'MEDIUM';
        return 'LOW';
    }
}
