import { Request, Response } from 'express';
import { HarvestService } from '../services/harvest.service.js';
import { harvestRepository } from '../repositories/harvest.repository.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/index.js';
import type { AuthenticatedRequest } from '../types/index.js';

const harvestService = new HarvestService(harvestRepository);

export async function createHarvest(req: Request, res: Response) {
  const authReq = req as AuthenticatedRequest;
  const result = await harvestService.createHarvest(authReq.user!.userId, req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, 'Harvest batch created successfully', result);
}

export async function getHarvestById(req: Request, res: Response) {
  const result = await harvestService.getHarvestById(req.params.id as string);
  sendSuccess(res, HTTP_STATUS.OK, 'Harvest batch retrieved successfully', result);
}

export async function updateHarvest(req: Request, res: Response) {
  const result = await harvestService.updateHarvest(req.params.id as string, req.body);
  sendSuccess(res, HTTP_STATUS.OK, 'Harvest batch updated successfully', result);
}

export async function deleteHarvest(req: Request, res: Response) {
  await harvestService.deleteHarvest(req.params.id as string);
  sendSuccess(res, HTTP_STATUS.OK, 'Harvest batch deleted successfully', null);
}

export async function getHarvests(req: Request, res: Response) {
  const result = await harvestService.getHarvests(req.query);
  sendSuccess(res, HTTP_STATUS.OK, 'Harvest batches retrieved successfully', result);
}

// Dashboard APIs
export async function getDashboardStats(_req: Request, res: Response) {
    const [totalQuantity, todayQuantity] = await Promise.all([
        harvestRepository.getTotalHarvestQuantity(),
        harvestRepository.getHarvestTodayQuantity()
    ]);
    
    sendSuccess(res, HTTP_STATUS.OK, 'Harvest stats retrieved', {
        totalQuantity,
        todayQuantity
    });
}
