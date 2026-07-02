import { Request, Response } from 'express';
import { MarketService } from '../services/market.service.js';
import { marketRepository } from '../repositories/market.repository.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/index.js';

const marketService = new MarketService(marketRepository);

export async function createMarket(req: Request, res: Response) {
  const result = await marketService.createMarket(req.body);
  sendSuccess(res, HTTP_STATUS.CREATED, 'Market created successfully', result);
}

export async function getMarketById(req: Request, res: Response) {
  const result = await marketService.getMarketById((req.params.id as string));
  sendSuccess(res, HTTP_STATUS.OK, 'Market retrieved successfully', result);
}

export async function updateMarket(req: Request, res: Response) {
  const result = await marketService.updateMarket((req.params.id as string), req.body);
  sendSuccess(res, HTTP_STATUS.OK, 'Market updated successfully', result);
}

export async function deleteMarket(req: Request, res: Response) {
  await marketService.deleteMarket((req.params.id as string));
  sendSuccess(res, HTTP_STATUS.OK, 'Market deleted successfully', null);
}

export async function getMarkets(req: Request, res: Response) {
  const result = await marketService.getMarkets(req.query);
  sendSuccess(res, HTTP_STATUS.OK, 'Markets retrieved successfully', result);
}
