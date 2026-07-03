import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/index.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

export const getDemoCredentials = (_req: Request, res: Response) => {
  sendSuccess(res, HTTP_STATUS.OK, 'Demo credentials', {
    credentials: [
      { role: 'ADMIN', email: 'admin@harvestshield.ai', password: 'admin123', description: 'Full platform access' },
      { role: 'FARMER', email: 'ramesh.farmer@harvestshield.ai', password: 'farmer123', description: 'Farmer with 2 batches' },
      { role: 'FARMER', email: 'sunita.farmer@harvestshield.ai', password: 'farmer123', description: 'Farmer with soybean & onion' },
      { role: 'FPO', email: 'fpo@harvestshield.ai', password: 'fpo123', description: 'Maha Farmers FPO manager' },
      { role: 'WAREHOUSE', email: 'warehouse@harvestshield.ai', password: 'warehouse123', description: 'Pune Cold Storage operator' },
      { role: 'PROCESSOR', email: 'processor@harvestshield.ai', password: 'processor123', description: 'Kisan Agro Processing manager' },
      { role: 'MARKET', email: 'market@harvestshield.ai', password: 'market123', description: 'Pune APMC market operator' },
      { role: 'DRIVER', email: 'driver@harvestshield.ai', password: 'driver123', description: 'Logistics driver' },
    ],
  });
};

export const resetDemoData = async (_req: Request, res: Response) => {
  try {
    // Run the seed script
    const { stdout, stderr } = await execAsync('npx tsx prisma/seed.ts', {
      cwd: process.cwd(),
      timeout: 120000, // 2 minute timeout
    });

    if (stderr && !stderr.includes('warn')) {
      console.error('Seed stderr:', stderr);
    }

    sendSuccess(res, HTTP_STATUS.OK, 'Demo data reset successfully. All sample data re-seeded.', {
      output: stdout,
      credentials: [
        { role: 'ADMIN', email: 'admin@harvestshield.ai', password: 'admin123' },
        { role: 'FARMER', email: 'ramesh.farmer@harvestshield.ai', password: 'farmer123' },
        { role: 'WAREHOUSE', email: 'warehouse@harvestshield.ai', password: 'warehouse123' },
      ],
    });
  } catch (error) {
    const err = error as { message?: string };
    sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, `Demo reset failed: ${err.message || 'Unknown error'}`);
  }
};

export const getSystemStats = async (_req: Request, res: Response) => {
  try {
    const [
      userCount,
      farmerCount,
      warehouseCount,
      batchCount,
      alertCount,
      recommendationCount,
      transportCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.farmer.count(),
      prisma.warehouse.count(),
      prisma.harvestBatch.count(),
      prisma.alert.count(),
      prisma.recommendation.count(),
      prisma.transportRequest.count(),
    ]);

    sendSuccess(res, HTTP_STATUS.OK, 'System stats', {
      users: userCount,
      farmers: farmerCount,
      warehouses: warehouseCount,
      harvestBatches: batchCount,
      alerts: alertCount,
      recommendations: recommendationCount,
      transportRequests: transportCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const err = error as { message?: string };
    sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, err.message || 'Failed to fetch stats');
  }
};
