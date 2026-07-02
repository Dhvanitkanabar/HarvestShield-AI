import { z } from 'zod';
import { QualityGrade, Unit, BatchStatus } from '@prisma/client';

export const createHarvestSchema = z.object({
  cropId: z.string().uuid(),
  fpoId: z.string().uuid().optional(),
  quantity: z.number().positive(),
  unit: z.nativeEnum(Unit).optional().default(Unit.KG),
  qualityGrade: z.nativeEnum(QualityGrade),
  harvestDate: z.string().datetime().or(z.date()),
  remarks: z.string().max(500).optional(),
});

export const updateHarvestSchema = z.object({
  quantity: z.number().positive().optional(),
  qualityGrade: z.nativeEnum(QualityGrade).optional(),
  currentStatus: z.nativeEnum(BatchStatus).optional(),
  currentLocation: z.string().optional(),
  remarks: z.string().max(500).optional(),
});

export const queryHarvestSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(), // batch number
  farmerId: z.string().uuid().optional(),
  cropId: z.string().uuid().optional(),
  fpoId: z.string().uuid().optional(),
  status: z.nativeEnum(BatchStatus).optional(),
  grade: z.nativeEnum(QualityGrade).optional(),
});

export type CreateHarvestInput = z.infer<typeof createHarvestSchema>;
export type UpdateHarvestInput = z.infer<typeof updateHarvestSchema>;
export type QueryHarvestInput = z.infer<typeof queryHarvestSchema>;
