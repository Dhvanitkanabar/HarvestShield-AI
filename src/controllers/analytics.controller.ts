import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';

const analyticsService = new AnalyticsService();

export class AnalyticsController {
  async getTrends(req: Request, res: Response) {
    try {
      const { period } = req.query; // DAILY, WEEKLY, MONTHLY
      const data = await analyticsService.getHarvestGrowth(period as 'DAILY' | 'WEEKLY' | 'MONTHLY' || 'DAILY');
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async generateSnapshot(req: Request, res: Response) {
    try {
      const { periodStart, periodEnd, periodType } = req.body;
      const snapshot = await analyticsService.generateAnalyticsSnapshot(new Date(periodStart), new Date(periodEnd), periodType);
      res.status(201).json({ success: true, data: snapshot });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
