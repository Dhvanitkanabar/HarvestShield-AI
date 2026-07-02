import { Request, Response } from 'express';
import { MovementService } from '../services/movement.service.js';
import { movementRepository } from '../repositories/movement.repository.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/index.js';

const movementService = new MovementService(movementRepository);

export async function createMovement(req: Request, res: Response) {
  const result = await movementService.createMovement(req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, 'Movement recorded successfully', result);
}

export async function getMovementById(req: Request, res: Response) {
  const result = await movementService.getMovementById(req.params.id as string);
  sendSuccess(res, HTTP_STATUS.OK, 'Movement retrieved successfully', result);
}

export async function getMovements(req: Request, res: Response) {
  const result = await movementService.getMovements(req.query);
  sendSuccess(res, HTTP_STATUS.OK, 'Movements retrieved successfully', result);
}
