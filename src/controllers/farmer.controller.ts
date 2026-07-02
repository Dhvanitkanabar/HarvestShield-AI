import { Request, Response } from 'express';
import { FarmerService } from '../services/farmer.service.js';
import { farmerRepository } from '../repositories/farmer.repository.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../utils/index.js';
import { HTTP_STATUS } from '../constants/index.js';
import type { AuthenticatedRequest } from '../types/index.js';

const farmerService = new FarmerService(farmerRepository);

export async function createFarmer(req: Request, res: Response) {
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.user!.userId;
  
  // Ensure the user creates a profile for themselves unless they are admin
  if (authReq.user!.role !== 'ADMIN' && req.body.userId !== userId) {
      throw new AppError('You can only create a profile for yourself', HTTP_STATUS.FORBIDDEN);
  }
  
  const result = await farmerService.createFarmer(req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, 'Farmer profile created successfully', result);
}

export async function getFarmerById(req: Request, res: Response) {
  const result = await farmerService.getFarmerById((req.params.id as string));
  sendSuccess(res, HTTP_STATUS.OK, 'Farmer retrieved successfully', result);
}

export async function getMyProfile(req: Request, res: Response) {
  const authReq = req as AuthenticatedRequest;
  const result = await farmerService.getFarmerByUserId(authReq.user!.userId);
  sendSuccess(res, HTTP_STATUS.OK, 'Farmer profile retrieved successfully', result);
}

export async function updateFarmer(req: Request, res: Response) {
  const authReq = req as AuthenticatedRequest;
  const farmer = await farmerService.getFarmerById((req.params.id as string));
  
  if (authReq.user!.role !== 'ADMIN' && farmer.userId !== authReq.user!.userId) {
     throw new AppError('You can only update your own profile', HTTP_STATUS.FORBIDDEN);
  }
  
  const result = await farmerService.updateFarmer((req.params.id as string), req.body);
  sendSuccess(res, HTTP_STATUS.OK, 'Farmer updated successfully', result);
}

export async function deleteFarmer(req: Request, res: Response) {
  const authReq = req as AuthenticatedRequest;
  const farmer = await farmerService.getFarmerById((req.params.id as string));
  
  if (authReq.user!.role !== 'ADMIN' && farmer.userId !== authReq.user!.userId) {
     throw new AppError('You can only delete your own profile', HTTP_STATUS.FORBIDDEN);
  }
  
  await farmerService.deleteFarmer((req.params.id as string));
  sendSuccess(res, HTTP_STATUS.OK, 'Farmer deleted successfully', null);
}

export async function getFarmers(req: Request, res: Response) {
  const result = await farmerService.getFarmers(req.query);
  sendSuccess(res, HTTP_STATUS.OK, 'Farmers retrieved successfully', result);
}
