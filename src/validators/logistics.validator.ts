import { z } from 'zod';
import { TransportStatus } from '@prisma/client';

export const createTransportRequestSchema = z.object({
  body: z.object({
    batchId: z.string().uuid(),
    pickupLocation: z.string().min(1, 'Pickup location is required'),
    dropoffLocation: z.string().min(1, 'Dropoff location is required'),
    scheduledDate: z.string().datetime().optional(),
    requiresColdChain: z.boolean().default(false),
  }),
});

export const assignTransportSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    vehicleId: z.string().uuid(),
    driverId: z.string().uuid(),
  }),
});

export const updateTransportStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.nativeEnum(TransportStatus),
    fuelConsumed: z.number().nonnegative().optional(),
  }),
});

export const addColdChainLogSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    temperature: z.number(),
    humidity: z.number().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
});
