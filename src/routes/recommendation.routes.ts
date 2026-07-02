import { Router } from 'express';
import { 
    generateRecommendation, 
    getRecommendationById, 
    getHistoryByBatch, 
    getRecommendations, 
    getDashboardSummary, 
    getHighRiskBatches 
} from '../controllers/recommendation.controller.js';
import { authenticate, authorize, validate } from '../middleware/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { queryRecommendationSchema } from '../validators/recommendation.validator.js';

const router = Router();

router.use(authenticate);

// Global Dashboards
router.get('/dashboard/decision-summary', asyncHandler(getDashboardSummary));
router.get('/risk/high', asyncHandler(getHighRiskBatches));

// Engine triggers
router.post('/generate/:batchId', authorize('ADMIN', 'FARMER', 'FPO', 'WAREHOUSE'), asyncHandler(generateRecommendation));

// Standard APIs
router.get('/', validate(queryRecommendationSchema, 'query'), asyncHandler(getRecommendations));
router.get('/:id', asyncHandler(getRecommendationById));
router.get('/history/:batchId', asyncHandler(getHistoryByBatch));

export default router;
