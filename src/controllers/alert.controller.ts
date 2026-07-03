import { Request, Response } from 'express';
import { AlertService } from '../services/alert.service.js';
import { AlertType, AlertPriority, AlertStatus } from '@prisma/client';

const alertService = new AlertService();

export class AlertController {
  async createAlert(req: Request, res: Response) {
    try {
      const { title, description, type, priority, batchId, warehouseId, notifyUserId } = req.body;
      const alert = await alertService.createAlert({ title, description, type: type as AlertType, priority: priority as AlertPriority, batchId, warehouseId, notifyUserId });
      res.status(201).json({ success: true, data: alert });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAlerts(req: Request, res: Response) {
    try {
      const { status, priority, type } = req.query;
      const alerts = await alertService.getAlerts({
        status: status as AlertStatus,
        priority: priority as AlertPriority,
        type: type as AlertType
      });
      res.status(200).json({ success: true, data: alerts });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async acknowledgeAlert(req: Request, res: Response) {
    try {
      const alert = await alertService.acknowledgeAlert(req.params.id as string);
      res.status(200).json({ success: true, data: alert });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async resolveAlert(req: Request, res: Response) {
    try {
      const alert = await alertService.resolveAlert(req.params.id as string);
      res.status(200).json({ success: true, data: alert });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
