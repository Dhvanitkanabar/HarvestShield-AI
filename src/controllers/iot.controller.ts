import { Request, Response } from 'express';
import { prisma } from '../prisma/client.js';
import { logger } from '../config/logger.js';
import { getIO } from '../socket.js';

export const getDevices = async (_req: Request, res: Response): Promise<void> => {
  try {
    const devices = await prisma.device.findMany({
      include: {
        sensors: true,
      },
    });
    res.json({ success: true, data: devices });
  } catch (error) {
    logger.error('Error fetching devices', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const triggerSimulation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { scenario, targetId, targetType } = req.body;
    
    // Validate target
    if (targetType === 'WAREHOUSE') {
      const warehouse = await prisma.warehouse.findUnique({ where: { id: targetId } });
      if (!warehouse) { res.status(404).json({ success: false, message: 'Warehouse not found' }); return; }
    } else if (targetType === 'VEHICLE') {
      const vehicle = await prisma.vehicle.findUnique({ where: { id: targetId } });
      if (!vehicle) { res.status(404).json({ success: false, message: 'Vehicle not found' }); return; }
    }

    // A real simulation engine would handle this over time, 
    // for this demo we'll emit an immediate event and update twin.
    let newStatus = {};
    if (scenario === 'TEMPERATURE_SPIKE') {
      newStatus = { temperature: 35.5, humidity: 40.0, status: 'CRITICAL', message: 'Temperature spike detected' };
    } else if (scenario === 'NETWORK_FAILURE') {
      newStatus = { status: 'OFFLINE', message: 'Connection lost' };
    } else {
      newStatus = { temperature: 18.0, humidity: 60.0, status: 'NORMAL', message: 'All systems normal' };
    }

    const twin = await prisma.digitalTwin.upsert({
      where: { entityId: targetId },
      create: {
        entityId: targetId,
        entityType: targetType,
        currentStatus: newStatus,
      },
      update: {
        currentStatus: newStatus,
        lastUpdatedAt: new Date(),
      },
    });

    // Broadcast update
    getIO().to(targetId).emit('twin_update', twin);
    getIO().emit('simulation_event', { scenario, targetId, targetType, newStatus });

    // In a real scenario, this would also trigger an Alert if critical
    if ((newStatus as any).status === 'CRITICAL') {
      await prisma.alert.create({
        data: {
          title: 'Critical IoT Alert',
          description: `Simulation ${scenario} triggered a critical status for ${targetType} ${targetId}`,
          priority: 'HIGH',
          type: 'EMERGENCY_ACTION_REQUIRED',
          ...(targetType === 'WAREHOUSE' ? { warehouseId: targetId } : {})
        }
      });
    }

    res.json({ success: true, data: twin });
  } catch (error) {
    logger.error('Error triggering simulation', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getDigitalTwin = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const twin = await prisma.digitalTwin.findUnique({
      where: { entityId: id }
    });
    
    if (!twin) {
      res.status(404).json({ success: false, message: 'Digital twin not found' });
      return;
    }
    
    res.json({ success: true, data: twin });
  } catch (error) {
    logger.error('Error fetching digital twin', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
