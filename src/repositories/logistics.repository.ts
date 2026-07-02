import { prisma } from '../prisma/client.js';
import { VehicleType, TransportStatus } from '@prisma/client';

export class LogisticsRepository {
  async getVehicles(filter?: { vehicleType?: VehicleType; isAvailable?: boolean }) {
    return prisma.vehicle.findMany({
      where: filter,
      include: { drivers: true },
    });
  }

  async getDrivers(filter?: { isAvailable?: boolean }) {
    return prisma.driver.findMany({
      where: filter,
      include: { user: { select: { fullName: true, phone: true } }, vehicle: true },
    });
  }

  async createTransportRequest(data: {
    batchId: string;
    pickupLocation: string;
    dropoffLocation: string;
    scheduledDate: Date;
    distanceKm: number;
    estimatedTimeMins: number;
    estimatedCost: number;
  }) {
    return prisma.transportRequest.create({
      data: {
        ...data,
        status: TransportStatus.PENDING,
      },
    });
  }

  async getTransportRequests(filter?: { status?: TransportStatus; batchId?: string }) {
    return prisma.transportRequest.findMany({
      where: filter,
      include: {
        harvestBatch: true,
        vehicle: true,
        driver: { include: { user: { select: { fullName: true, phone: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async assignTransport(requestId: string, vehicleId: string, driverId: string) {
    return prisma.transportRequest.update({
      where: { id: requestId },
      data: {
        vehicleId,
        driverId,
        status: TransportStatus.ASSIGNED,
      },
    });
  }

  async updateTransportStatus(
    requestId: string,
    status: TransportStatus,
    extraData?: {
      actualPickupTime?: Date;
      actualDeliveryTime?: Date;
      fuelConsumed?: number;
    }
  ) {
    return prisma.transportRequest.update({
      where: { id: requestId },
      data: {
        status,
        ...extraData,
      },
    });
  }

  async addColdChainLog(data: {
    transportRequestId: string;
    temperature: number;
    humidity?: number;
    latitude?: number;
    longitude?: number;
  }) {
    return prisma.coldChainLog.create({ data });
  }

  async getColdChainLogs(transportRequestId: string) {
    return prisma.coldChainLog.findMany({
      where: { transportRequestId },
      orderBy: { timestamp: 'desc' },
    });
  }

  async getLogisticsDashboardMetrics() {
    const totalVehicles = await prisma.vehicle.count();
    const availableVehicles = await prisma.vehicle.count({ where: { isAvailable: true } });
    const activeTrips = await prisma.transportRequest.count({
      where: { status: TransportStatus.IN_TRANSIT },
    });
    
    // Group requests by status
    const requestsByStatus = await prisma.transportRequest.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    return { totalVehicles, availableVehicles, activeTrips, requestsByStatus };
  }
}

export const logisticsRepository = new LogisticsRepository();
