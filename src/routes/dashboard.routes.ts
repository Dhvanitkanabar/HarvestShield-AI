import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/index.js';
import { authorize } from '../middleware/index.js';
import { Role } from '@prisma/client';

const router = Router();
const dashboardController = new DashboardController();

router.use(authenticate);
router.use(authorize(Role.ADMIN));

router.get('/executive', dashboardController.getDashboard.bind(dashboardController));

export default router;
