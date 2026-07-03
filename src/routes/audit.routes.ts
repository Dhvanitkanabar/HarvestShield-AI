import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller.js';
import { authenticate } from '../middleware/index.js';
import { authorize } from '../middleware/index.js';
import { Role } from '@prisma/client';

const router = Router();
const auditController = new AuditController();

router.use(authenticate);

// Everyone authenticated might need to create logs implicitly, but exposing an API to create logs is usually internal.
// We'll allow ADMIN to fetch logs.
router.get('/', authorize(Role.ADMIN), auditController.getLogs.bind(auditController));
router.post('/', auditController.createLog.bind(auditController));

export default router;
