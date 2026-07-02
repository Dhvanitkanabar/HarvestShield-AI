import { Request, Response } from 'express';
import { RecommendationService } from '../services/recommendation.service.js';
import { recommendationRepository } from '../repositories/recommendation.repository.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/index.js';

const recommendationService = new RecommendationService(recommendationRepository);

export async function generateRecommendation(req: Request, res: Response) {
  const result = await recommendationService.generateRecommendation(req.params.batchId as string);
  sendSuccess(res, HTTP_STATUS.CREATED, 'Recommendation generated successfully', result);
}

export async function getRecommendationById(req: Request, res: Response) {
  const result = await recommendationService.getRecommendationById(req.params.id as string);
  sendSuccess(res, HTTP_STATUS.OK, 'Recommendation retrieved successfully', result);
}

export async function getHistoryByBatch(req: Request, res: Response) {
  const result = await recommendationService.getHistoryByBatch(req.params.batchId as string);
  sendSuccess(res, HTTP_STATUS.OK, 'Recommendation history retrieved', result);
}

export async function getRecommendations(req: Request, res: Response) {
  const result = await recommendationService.getRecommendations(req.query);
  sendSuccess(res, HTTP_STATUS.OK, 'Recommendations retrieved', result);
}

export async function getDashboardSummary(_req: Request, res: Response) {
  const result = await recommendationService.getDashboardSummary();
  sendSuccess(res, HTTP_STATUS.OK, 'Dashboard summary retrieved', result);
}

export async function getHighRiskBatches(_req: Request, res: Response) {
  const result = await recommendationService.getHighRiskBatches();
  sendSuccess(res, HTTP_STATUS.OK, 'High risk batches retrieved', result);
}
