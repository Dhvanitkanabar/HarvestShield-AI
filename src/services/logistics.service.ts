import { logisticsRepository } from '../repositories/logistics.repository.js';
import { TransportStatus } from '@prisma/client';
import { AppError } from '../utils/appError.js';

export class LogisticsService {
  async getDashboardMetrics() {
    return logisticsRepository.getLogisticsDashboardMetrics();
  }

  async listTransportRequests(query: any) {
    return logisticsRepository.getTransportRequests(query);
  }

  async createTransportRequest(data: {
    batchId: string;
    pickupLocation: string;
    dropoffLocation: string;
    scheduledDate?: string;
    requiresColdChain?: boolean;
  }) {
    // Mock Route Optimization & Estimation Logic
    // In the future, this would call Python ML Microservices or Google Maps API
    const distanceKm = Math.random() * 200 + 10; // Random 10 - 210 KM
    const estimatedTimeMins = Math.round(distanceKm * 1.5); // Roughly 40km/hr
    const baseRatePerKm = data.requiresColdChain ? 30 : 15;
    const estimatedCost = Math.round(distanceKm * baseRatePerKm);

    return logisticsRepository.createTransportRequest({
      batchId: data.batchId,
      pickupLocation: data.pickupLocation,
      dropoffLocation: data.dropoffLocation,
      scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : new Date(),
      distanceKm: parseFloat(distanceKm.toFixed(2)),
      estimatedTimeMins,
      estimatedCost,
    });
  }

  async assignVehicle(requestId: string, vehicleId: string, driverId: string) {
    const request = (await logisticsRepository.getTransportRequests({ batchId: undefined })).find(
      (r: any) => r.id === requestId
    );
    if (!request) {
      throw new AppError('Transport request not found', 404);
    }

    if (request.status !== TransportStatus.PENDING) {
      throw new AppError('Only PENDING requests can be assigned', 400);
    }

    return logisticsRepository.assignTransport(requestId, vehicleId, driverId);
  }

  async updateTransportStatus(
    requestId: string,
    status: TransportStatus,
    fuelConsumed?: number
  ) {
    const extraData: any = {};
    if (status === TransportStatus.IN_TRANSIT) {
      extraData.actualPickupTime = new Date();
    } else if (status === TransportStatus.DELIVERED) {
      extraData.actualDeliveryTime = new Date();
      extraData.fuelConsumed = fuelConsumed;
    }

    return logisticsRepository.updateTransportStatus(requestId, status, extraData);
  }

  async addColdChainLog(
    requestId: string,
    data: { temperature: number; humidity?: number; latitude?: number; longitude?: number }
  ) {
    // Basic Alerting Logic for cold chain monitoring
    if (data.temperature > 8 || data.temperature < 0) {
      console.warn(`[COLD CHAIN ALERT] Request ${requestId} temperature out of bounds: ${data.temperature}°C`);
      // Here we could trigger a push notification or email
    }

    return logisticsRepository.addColdChainLog({
      transportRequestId: requestId,
      ...data,
    });
  }

  async getColdChainLogs(requestId: string) {
    return logisticsRepository.getColdChainLogs(requestId);
  }
}

export const logisticsService = new LogisticsService();
