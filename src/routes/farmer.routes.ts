import { Router } from 'express';
import { createFarmer, getFarmerById, updateFarmer, deleteFarmer, getFarmers, getMyProfile } from '../controllers/farmer.controller.js';
import { authenticate, authorize, validate } from '../middleware/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createFarmerSchema, updateFarmerSchema, queryFarmerSchema } from '../validators/farmer.validator.js';

const router = Router();

// Protect all farmer routes
router.use(authenticate);

// Profile endpoint (for the logged in farmer)
router.get('/me', authorize('FARMER'), asyncHandler(getMyProfile));

// Standard CRUD
router.get('/', validate(queryFarmerSchema, 'query'), asyncHandler(getFarmers));
router.get('/:id', asyncHandler(getFarmerById));

// Only Admin or Farmer can create a farmer profile
router.post('/', authorize('ADMIN', 'FARMER'), validate(createFarmerSchema, 'body'), asyncHandler(createFarmer));

router.put('/:id', authorize('ADMIN', 'FARMER'), validate(updateFarmerSchema, 'body'), asyncHandler(updateFarmer));
router.delete('/:id', authorize('ADMIN', 'FARMER'), asyncHandler(deleteFarmer));

export default router;
