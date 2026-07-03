import { Request, Response } from 'express';
import { ReportService } from '../services/report.service.js';

const reportService = new ReportService();

export class ReportController {
  async generateReport(req: Request, res: Response) {
    try {
      const { type, format } = req.body;
      const userId = (req as any).user?.id;
      const report = await reportService.generateReport(type, format as 'PDF' | 'EXCEL' | 'CSV', userId);
      res.status(201).json({ success: true, data: report });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
