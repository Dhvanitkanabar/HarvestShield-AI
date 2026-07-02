import { Request, Response } from 'express';
import { CropService } from '../services/crop.service.js';
import { cropRepository } from '../repositories/crop.repository.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/index.js';

const cropService = new CropService(cropRepository);

export async function createCrop(req: Request, res: Response) {
  const result = await cropService.createCrop(req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, 'Crop created successfully', result);
}

export async function getCropById(req: Request, res: Response) {
  const result = await cropService.getCropById((req.params.id as string));
  sendSuccess(res, HTTP_STATUS.OK, 'Crop retrieved successfully', result);
}

export async function updateCrop(req: Request, res: Response) {
  const result = await cropService.updateCrop((req.params.id as string), req.body);
  sendSuccess(res, HTTP_STATUS.OK, 'Crop updated successfully', result);
}

export async function deleteCrop(req: Request, res: Response) {
  await cropService.deleteCrop((req.params.id as string));
  sendSuccess(res, HTTP_STATUS.OK, 'Crop deleted successfully', null);
}

export async function getCrops(req: Request, res: Response) {
  const result = await cropService.getCrops(req.query);
  sendSuccess(res, HTTP_STATUS.OK, 'Crops retrieved successfully', result);
}
