import { Router } from 'express';
import { createProcessor, getProcessorById, updateProcessor, deleteProcessor, getProcessors } from '../controllers/processor.controller.js';
import { authenticate, authorize, validate } from '../middleware/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createProcessorSchema, updateProcessorSchema, queryProcessorSchema } from '../validators/processor.validator.js';

const router = Router();

// Public / Authenticated read routes
router.get('/', validate(queryProcessorSchema, 'query'), asyncHandler(getProcessors));
router.get('/:id', asyncHandler(getProcessorById));

// Only PROCESSOR or ADMIN can manage processors
router.use(authenticate, authorize('ADMIN', 'PROCESSOR'));
router.post('/', validate(createProcessorSchema, 'body'), asyncHandler(createProcessor));
router.put('/:id', validate(updateProcessorSchema, 'body'), asyncHandler(updateProcessor));
router.delete('/:id', authorize('ADMIN'), asyncHandler(deleteProcessor));

export default router;
