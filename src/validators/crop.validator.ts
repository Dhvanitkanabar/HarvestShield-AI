import { z } from 'zod';
import { CropCategory } from '@prisma/client';

export const createCropSchema = z.object({
  cropName: z.string().min(2).max(100),
  category: z.nativeEnum(CropCategory),
  scientificName: z.string().max(100).optional(),
  averageShelfLife: z.number().int().positive().optional(),
  idealTemperatureMin: z.number().optional(),
  idealTemperatureMax: z.number().optional(),
  idealHumidityMin: z.number().min(0).max(100).optional(),
  idealHumidityMax: z.number().min(0).max(100).optional(),
  storageRecommendation: z.string().max(500).optional(),
  processingOptions: z.string().max(500).optional(),
});

export const updateCropSchema = createCropSchema.partial();

export const queryCropSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
  category: z.nativeEnum(CropCategory).optional(),
});

export type CreateCropInput = z.infer<typeof createCropSchema>;
export type UpdateCropInput = z.infer<typeof updateCropSchema>;
export type QueryCropInput = z.infer<typeof queryCropSchema>;
