import { z } from 'zod';
import { MarketType } from '@prisma/client';

export const createMarketSchema = z.object({
  marketName: z.string().min(2).max(100),
  marketType: z.nativeEnum(MarketType),
  district: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  contactNumber: z.string().min(10).max(15).optional(),
  operatingDays: z.string().max(100).optional(),
});

export const updateMarketSchema = createMarketSchema.partial();

export const queryMarketSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  marketType: z.nativeEnum(MarketType).optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  radius: z.coerce.number().optional(),
});

export type CreateMarketInput = z.infer<typeof createMarketSchema>;
export type UpdateMarketInput = z.infer<typeof updateMarketSchema>;
export type QueryMarketInput = z.infer<typeof queryMarketSchema>;
