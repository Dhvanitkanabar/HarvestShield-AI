import { Router } from 'express';
import { createCrop, getCropById, updateCrop, deleteCrop, getCrops } from '../controllers/crop.controller.js';
import { authenticate, authorize, validate } from '../middleware/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createCropSchema, updateCropSchema, queryCropSchema } from '../validators/crop.validator.js';

const router = Router();

// Public routes (or authenticated for all)
router.get('/', validate(queryCropSchema, 'query'), asyncHandler(getCrops));
router.get('/:id', asyncHandler(getCropById));

// Admin only routes
router.use(authenticate, authorize('ADMIN'));
router.post('/', validate(createCropSchema, 'body'), asyncHandler(createCrop));
router.put('/:id', validate(updateCropSchema, 'body'), asyncHandler(updateCrop));
router.delete('/:id', asyncHandler(deleteCrop));

export default router;
