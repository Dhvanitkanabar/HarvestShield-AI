import { Request, Response } from 'express';
import { FpoService } from '../services/fpo.service.js';
import { fpoRepository } from '../repositories/fpo.repository.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/index.js';

const fpoService = new FpoService(fpoRepository);

export async function createFpo(req: Request, res: Response) {
  const result = await fpoService.createFpo(req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, 'FPO created successfully', result);
}

export async function getFpoById(req: Request, res: Response) {
  const result = await fpoService.getFpoById((req.params.id as string));
  sendSuccess(res, HTTP_STATUS.OK, 'FPO retrieved successfully', result);
}

export async function updateFpo(req: Request, res: Response) {
  const result = await fpoService.updateFpo((req.params.id as string), req.body);
  sendSuccess(res, HTTP_STATUS.OK, 'FPO updated successfully', result);
}

export async function deleteFpo(req: Request, res: Response) {
  await fpoService.deleteFpo((req.params.id as string));
  sendSuccess(res, HTTP_STATUS.OK, 'FPO deleted successfully', null);
}

export async function getFpos(req: Request, res: Response) {
  const result = await fpoService.getFpos(req.query);
  sendSuccess(res, HTTP_STATUS.OK, 'FPOs retrieved successfully', result);
}
