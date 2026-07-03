import { Router } from 'express';
import { ReportController } from '../controllers/report.controller.js';
import { authenticate } from '../middleware/index.js';
import { authorize } from '../middleware/index.js';
import { Role } from '@prisma/client';

const router = Router();
const reportController = new ReportController();

router.use(authenticate);

router.post('/generate', authorize(Role.ADMIN, Role.FPO, Role.PROCESSOR), reportController.generateReport.bind(reportController));

export default router;
