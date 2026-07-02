import { Router } from 'express';
import { createMarket, getMarketById, updateMarket, deleteMarket, getMarkets } from '../controllers/market.controller.js';
import { authenticate, authorize, validate } from '../middleware/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createMarketSchema, updateMarketSchema, queryMarketSchema } from '../validators/market.validator.js';

const router = Router();

// Public / Authenticated read routes
router.get('/', validate(queryMarketSchema, 'query'), asyncHandler(getMarkets));
router.get('/:id', asyncHandler(getMarketById));

// Only MARKET or ADMIN can manage markets
router.use(authenticate, authorize('ADMIN', 'MARKET'));
router.post('/', validate(createMarketSchema, 'body'), asyncHandler(createMarket));
router.put('/:id', validate(updateMarketSchema, 'body'), asyncHandler(updateMarket));
router.delete('/:id', authorize('ADMIN'), asyncHandler(deleteMarket));

export default router;
