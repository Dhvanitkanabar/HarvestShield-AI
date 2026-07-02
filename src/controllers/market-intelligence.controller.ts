import { Request, Response } from 'express';
import { MarketIntelligenceService } from '../services/market-intelligence.service.js';
import { marketIntelligenceRepository } from '../repositories/market-intelligence.repository.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/index.js';
import { 
  queryHistorySchema, 
  queryPredictionsSchema, 
  queryRecommendationsSchema, 
  queryDemandSchema,
  createPredictionSchema 
} from '../validators/market-intelligence.validator.js';

const marketIntelligenceService = new MarketIntelligenceService(marketIntelligenceRepository);

export async function getHistoricalPrices(req: Request, res: Response) {
  const query = queryHistorySchema.parse(req.query);
  const result = await marketIntelligenceService.getHistoricalPrices(query.cropId, query.marketId);
  sendSuccess(res, HTTP_STATUS.OK, 'Historical prices retrieved successfully', result);
}

export async function getPricePredictions(req: Request, res: Response) {
  const query = queryPredictionsSchema.parse(req.query);
  const result = await marketIntelligenceService.getPricePredictions(query.cropId, query.marketId);
  sendSuccess(res, HTTP_STATUS.OK, 'Price predictions retrieved successfully', result);
}

export async function getMarketRecommendations(req: Request, res: Response) {
  const query = queryRecommendationsSchema.parse(req.query);
  const result = await marketIntelligenceService.getMarketRecommendations(req.params.batchId as string, query.radius);
  sendSuccess(res, HTTP_STATUS.OK, 'Market recommendations retrieved successfully', result);
}

export async function getMarketDemand(req: Request, res: Response) {
  const query = queryDemandSchema.parse(req.query);
  const result = await marketIntelligenceService.getMarketDemand(query.cropId, query.marketId);
  sendSuccess(res, HTTP_STATUS.OK, 'Market demand retrieved successfully', result);
}

export async function createPrediction(req: Request, res: Response) {
  const body = createPredictionSchema.parse(req.body);
  const result = await marketIntelligenceService.createPrediction(body);
  sendSuccess(res, HTTP_STATUS.CREATED, 'Price prediction created successfully', result);
}
