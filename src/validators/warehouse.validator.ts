import { z } from 'zod';
import { WarehouseType } from '@prisma/client';

export const createWarehouseSchema = z.object({
  warehouseName: z.string().min(2).max(100),
  warehouseType: z.nativeEnum(WarehouseType),
  ownerName: z.string().min(2).max(100),
  capacity: z.number().positive(),
  availableCapacity: z.number().nonnegative(),
  temperatureSupported: z.boolean().default(false),
  humiditySupported: z.boolean().default(false),
  district: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  contactNumber: z.string().min(10).max(15),
});

export const updateWarehouseSchema = createWarehouseSchema.partial();

export const queryWarehouseSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  warehouseType: z.nativeEnum(WarehouseType).optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  radius: z.coerce.number().optional(),
});

export type CreateWarehouseInput = z.infer<typeof createWarehouseSchema>;
export type UpdateWarehouseInput = z.infer<typeof updateWarehouseSchema>;
export type QueryWarehouseInput = z.infer<typeof queryWarehouseSchema>;
