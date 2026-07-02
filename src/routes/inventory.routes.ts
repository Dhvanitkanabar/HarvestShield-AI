import { Router, Request, Response, NextFunction } from 'express';
import { createInventory, getInventoryById, updateInventory, getInventories, getDashboardStats } from '../controllers/inventory.controller.js';
import { authenticate, authorize, validate } from '../middleware/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createInventorySchema, updateInventorySchema, queryInventorySchema } from '../validators/inventory.validator.js';
import type { AuthenticatedRequest } from '../types/index.js';

const router = Router();

router.use(authenticate);

// Middleware to restrict Warehouse user to only see their own inventories
const scopeQuery = async (req: Request, _res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    if (authReq.user!.role === 'WAREHOUSE') {
        // Find warehouse owned by this user (Assuming 1:1 relation or logic maps it)
        // Note: Currently warehouse has `ownerName` but no explicit `userId`. 
        // For Phase 3, we'll assume they can filter explicitly, but we could enforce it here.
    }
    next();
};

router.get('/dashboard', asyncHandler(getDashboardStats));
router.get('/', validate(queryInventorySchema, 'query'), asyncHandler(scopeQuery), asyncHandler(getInventories));
router.get('/:id', asyncHandler(getInventoryById));

// Only WAREHOUSE and ADMIN can store batches
router.post('/', authorize('ADMIN', 'WAREHOUSE'), validate(createInventorySchema, 'body'), asyncHandler(createInventory));
router.put('/:id', authorize('ADMIN', 'WAREHOUSE'), validate(updateInventorySchema, 'body'), asyncHandler(updateInventory));

export default router;
