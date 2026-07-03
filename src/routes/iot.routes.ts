import { Router } from 'express';
import { getDevices, triggerSimulation, getDigitalTwin } from '../controllers/iot.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { Role } from '@prisma/client';

const router = Router();

// Protect all IoT routes
router.use(authenticate);

// Get all devices
router.get('/devices', getDevices);

// Get digital twin status
router.get('/twins/:id', getDigitalTwin);

// Trigger a simulation (Admin only)
router.post('/simulation', authorize(Role.ADMIN), triggerSimulation);

export default router;
