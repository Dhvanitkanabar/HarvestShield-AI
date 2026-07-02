import { Router } from 'express';
import { 
  getHistoricalPrices, 
  getPricePredictions, 
  getMarketRecommendations, 
  getMarketDemand,
  createPrediction 
} from '../controllers/market-intelligence.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { Role } from '@prisma/client';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// Routes for external ML services (require Admin/Internal Role in real scenario, using Admin for now)
router.post('/predictions', authenticate, authorize(Role.ADMIN), asyncHandler(createPrediction));

// Public/Farmer/Market endpoints
router.get('/history', authenticate, asyncHandler(getHistoricalPrices));
router.get('/predictions', authenticate, asyncHandler(getPricePredictions));
router.get('/recommendations/:batchId', authenticate, asyncHandler(getMarketRecommendations));
router.get('/demand', authenticate, asyncHandler(getMarketDemand));

export default router;
