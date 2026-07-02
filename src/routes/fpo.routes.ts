import { Router } from 'express';
import { createFpo, getFpoById, updateFpo, deleteFpo, getFpos } from '../controllers/fpo.controller.js';
import { authenticate, authorize, validate } from '../middleware/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createFpoSchema, updateFpoSchema, queryFpoSchema } from '../validators/fpo.validator.js';

const router = Router();

// Public / Authenticated read routes
router.get('/', validate(queryFpoSchema, 'query'), asyncHandler(getFpos));
router.get('/:id', asyncHandler(getFpoById));

// Only FPO and ADMIN can create FPOs (Assuming FPO creates their own profile or ADMIN creates)
router.use(authenticate, authorize('ADMIN', 'FPO'));
router.post('/', validate(createFpoSchema, 'body'), asyncHandler(createFpo));

// For update and delete, ideally FPO can only edit themselves. We'll simplify to just role check for now, service could do ownership check.
router.put('/:id', validate(updateFpoSchema, 'body'), asyncHandler(updateFpo));
router.delete('/:id', authorize('ADMIN'), asyncHandler(deleteFpo));

export default router;
