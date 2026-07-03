import { Router } from 'express';
import { AlertController } from '../controllers/alert.controller.js';
import { authenticate } from '../middleware/index.js';
import { authorize } from '../middleware/index.js';
import { Role } from '@prisma/client';

const router = Router();
const alertController = new AlertController();

router.use(authenticate);

router.post('/', authorize(Role.ADMIN), alertController.createAlert.bind(alertController));
router.get('/', alertController.getAlerts.bind(alertController));
router.patch('/:id/acknowledge', alertController.acknowledgeAlert.bind(alertController));
router.patch('/:id/resolve', alertController.resolveAlert.bind(alertController));

export default router;
