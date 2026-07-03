import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service.js';

const dashboardService = new DashboardService();

export class DashboardController {
  async getDashboard(_req: Request, res: Response) {
    try {
      const metrics = await dashboardService.getExecutiveDashboard();
      res.status(200).json({ success: true, data: metrics });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
