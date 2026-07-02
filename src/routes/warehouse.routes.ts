import { Router } from 'express';
import { createWarehouse, getWarehouseById, updateWarehouse, deleteWarehouse, getWarehouses } from '../controllers/warehouse.controller.js';
import { authenticate, authorize, validate } from '../middleware/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createWarehouseSchema, updateWarehouseSchema, queryWarehouseSchema } from '../validators/warehouse.validator.js';

const router = Router();

// Public / Authenticated read routes
router.get('/', validate(queryWarehouseSchema, 'query'), asyncHandler(getWarehouses));
router.get('/:id', asyncHandler(getWarehouseById));

// Only WAREHOUSE and ADMIN can manage
router.use(authenticate, authorize('ADMIN', 'WAREHOUSE'));
router.post('/', validate(createWarehouseSchema, 'body'), asyncHandler(createWarehouse));
router.put('/:id', validate(updateWarehouseSchema, 'body'), asyncHandler(updateWarehouse));
router.delete('/:id', authorize('ADMIN'), asyncHandler(deleteWarehouse)); // Delete admin only

export default router;
