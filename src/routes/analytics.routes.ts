import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/index.js';
import { authorize } from '../middleware/index.js';
import { Role } from '@prisma/client';

const router = Router();
const analyticsController = new AnalyticsController();

router.use(authenticate);
router.use(authorize(Role.ADMIN));

router.get('/trends', analyticsController.getTrends.bind(analyticsController));
router.post('/snapshots', analyticsController.generateSnapshot.bind(analyticsController));

export default router;
