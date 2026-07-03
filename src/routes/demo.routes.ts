import { Router } from 'express';
import { getDemoCredentials, resetDemoData, getSystemStats } from '../controllers/demo.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

// Public: Get demo credentials list
router.get('/credentials', getDemoCredentials);

// Public: System stats for health check / demo display
router.get('/stats', getSystemStats);

// Admin only: Reset demo data
router.post('/reset', authenticate, authorize('ADMIN'), resetDemoData);

export default router;
