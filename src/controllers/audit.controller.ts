import { Request, Response } from 'express';
import { AuditService } from '../services/audit.service.js';

const auditService = new AuditService();

export class AuditController {
  async getLogs(req: Request, res: Response) {
    try {
      const { userId, module } = req.query;
      const logs = await auditService.getLogs({ userId: userId as string, module: module as string });
      res.status(200).json({ success: true, data: logs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createLog(req: Request, res: Response) {
    try {
      const { module, action, before, after } = req.body;
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userId = (req as any).user?.id;
      const log = await auditService.logAction({
        userId,
        module,
        action,
        before,
        after,
        ipAddress
      });
      res.status(201).json({ success: true, data: log });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
