import { Router } from 'express';
import { createMovement, getMovementById, getMovements } from '../controllers/movement.controller.js';
import { authenticate, authorize, validate } from '../middleware/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createMovementSchema, queryMovementSchema } from '../validators/movement.validator.js';

const router = Router();

router.use(authenticate);

// Publicly readable by authenticated users (tracking history)
router.get('/', validate(queryMovementSchema, 'query'), asyncHandler(getMovements));
router.get('/:id', asyncHandler(getMovementById));

// Any stakeholder dealing with the batch can create a movement log
// In a fully strictly RBAC app, we would verify ownership of the batch.
router.post('/', authorize('ADMIN', 'FARMER', 'WAREHOUSE', 'PROCESSOR', 'MARKET', 'FPO'), validate(createMovementSchema, 'body'), asyncHandler(createMovement));

export default router;
