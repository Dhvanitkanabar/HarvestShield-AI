import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes.js';
import cropRoutes from './crop.routes.js';
import fpoRoutes from './fpo.routes.js';
import farmerRoutes from './farmer.routes.js';
import warehouseRoutes from './warehouse.routes.js';
import marketRoutes from './market.routes.js';
import processorRoutes from './processor.routes.js';
import harvestRoutes from './harvest.routes.js';
import inventoryRoutes from './inventory.routes.js';
import movementRoutes from './movement.routes.js';
import recommendationRoutes from './recommendation.routes.js';
import marketIntelligenceRoutes from './market-intelligence.routes.js';
import logisticsRoutes from './logistics.routes.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';

const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.SERVER.HEALTH_OK, {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ── Phase 1 & 2 Module Routes ──
router.use('/auth', authRoutes);
router.use('/crops', cropRoutes);
router.use('/fpos', fpoRoutes);
router.use('/farmers', farmerRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/markets', marketRoutes);
router.use('/processors', processorRoutes);

// ── Phase 3 Module Routes ──
router.use('/harvest', harvestRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/movement', movementRoutes);

// ── Phase 4 AI Module Routes ──
router.use('/recommendations', recommendationRoutes);

// ── Phase 5 Market Intelligence Routes ──
router.use('/market-intelligence', marketIntelligenceRoutes);
router.use('/logistics', logisticsRoutes);

export default router;
