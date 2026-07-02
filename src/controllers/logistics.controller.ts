import { Request, Response } from 'express';
import { logisticsService } from '../services/logistics.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getDashboardMetrics = async (_req: Request, res: Response) => {
  const metrics = await logisticsService.getDashboardMetrics();
  sendSuccess(res, 200, 'Dashboard metrics fetched successfully', metrics);
};

export const createTransportRequest = async (req: Request, res: Response) => {
  const request = await logisticsService.createTransportRequest(req.body);
  sendSuccess(res, 201, 'Transport request created successfully', request);
};

export const getTransportRequests = async (req: Request, res: Response) => {
  const requests = await logisticsService.listTransportRequests(req.query);
  sendSuccess(res, 200, 'Transport requests fetched successfully', requests);
};

export const assignTransport = async (req: Request, res: Response) => {
  const { vehicleId, driverId } = req.body;
  const request = await logisticsService.assignVehicle(req.params.id as string, vehicleId, driverId);
  sendSuccess(res, 200, 'Transport assigned successfully', request);
};

export const updateTransportStatus = async (req: Request, res: Response) => {
  const { status, fuelConsumed } = req.body;
  const request = await logisticsService.updateTransportStatus(req.params.id as string, status, fuelConsumed);
  sendSuccess(res, 200, 'Transport status updated successfully', request);
};

export const addColdChainLog = async (req: Request, res: Response) => {
  const log = await logisticsService.addColdChainLog(req.params.id as string, req.body);
  sendSuccess(res, 201, 'Cold chain log added successfully', log);
};

export const getColdChainLogs = async (req: Request, res: Response) => {
  const logs = await logisticsService.getColdChainLogs(req.params.id as string);
  sendSuccess(res, 200, 'Cold chain logs fetched successfully', logs);
};
