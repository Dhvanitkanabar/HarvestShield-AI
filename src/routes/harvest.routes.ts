import { Router, Request, Response, NextFunction } from 'express';
import { createHarvest, getHarvestById, updateHarvest, deleteHarvest, getHarvests, getDashboardStats } from '../controllers/harvest.controller.js';
import { authenticate, authorize, validate } from '../middleware/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createHarvestSchema, updateHarvestSchema, queryHarvestSchema } from '../validators/harvest.validator.js';
import type { AuthenticatedRequest } from '../types/index.js';
import { farmerRepository } from '../repositories/farmer.repository.js';

const router = Router();

// Protect all routes
router.use(authenticate);

// Middleware to scope queries based on role
const scopeQuery = async (req: Request, _res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    if (authReq.user!.role === 'FARMER') {
        const farmer = await farmerRepository.findByUserId(authReq.user!.userId);
        if (farmer) req.query.farmerId = farmer.id;
    } else if (authReq.user!.role === 'FPO') {
        // Assume FPO can see all their members' harvests. 
        // Need to get fpo ID linked to this user. 
        // For simplicity, passing a parameter or decoding from user profile if FPO is linked to user.
    }
    next();
};

router.get('/dashboard', asyncHandler(getDashboardStats));
router.get('/', validate(queryHarvestSchema, 'query'), asyncHandler(scopeQuery), asyncHandler(getHarvests));
router.get('/:id', asyncHandler(getHarvestById));

router.post('/', authorize('ADMIN', 'FARMER'), validate(createHarvestSchema, 'body'), asyncHandler(createHarvest));
router.put('/:id', authorize('ADMIN', 'FARMER'), validate(updateHarvestSchema, 'body'), asyncHandler(updateHarvest));
router.delete('/:id', authorize('ADMIN'), asyncHandler(deleteHarvest));

export default router;
