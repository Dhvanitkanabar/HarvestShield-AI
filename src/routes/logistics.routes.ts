import { Router } from 'express';
import {
  getDashboardMetrics,
  createTransportRequest,
  getTransportRequests,
  assignTransport,
  updateTransportStatus,
  addColdChainLog,
  getColdChainLogs,
} from '../controllers/logistics.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { Role } from '@prisma/client';
import {
  createTransportRequestSchema,
  assignTransportSchema,
  updateTransportStatusSchema,
  addColdChainLogSchema,
} from '../validators/logistics.validator.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// Protect all routes
router.use(authenticate);

// Dashboard metrics (Accessible by Admin and FPO)
router.get(
  '/dashboard',
  authorize(Role.ADMIN),
  asyncHandler(getDashboardMetrics)
);

// Transport Requests (Accessible by Admin, FPO, and Farmers)
router.post(
  '/requests',
  validate(createTransportRequestSchema),
  asyncHandler(createTransportRequest)
);

router.get('/requests', asyncHandler(getTransportRequests));

// Assign Transport (Admin only)
router.post(
  '/requests/:id/assign',
  authorize(Role.ADMIN),
  validate(assignTransportSchema),
  asyncHandler(assignTransport)
);

// Update Status (Admin or Driver)
router.patch(
  '/requests/:id/status',
  // In a real scenario, you would allow Role.DRIVER here, but we will allow Admin for now
  authorize(Role.ADMIN),
  validate(updateTransportStatusSchema),
  asyncHandler(updateTransportStatus)
);

// Cold Chain IoT logs
router.post(
  '/requests/:id/cold-chain',
  validate(addColdChainLogSchema),
  asyncHandler(addColdChainLog)
);

router.get('/requests/:id/cold-chain', asyncHandler(getColdChainLogs));

export default router;
