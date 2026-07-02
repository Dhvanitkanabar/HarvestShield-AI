import { z } from 'zod';
import { MovementType } from '@prisma/client';

export const createMovementSchema = z.object({
  batchId: z.string().uuid(),
  fromLocation: z.string().optional(),
  toLocation: z.string().optional(),
  movementType: z.nativeEnum(MovementType),
  transportCost: z.number().nonnegative().optional(),
  remarks: z.string().max(500).optional(),
});

export const queryMovementSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  batchId: z.string().uuid().optional(),
  movementType: z.nativeEnum(MovementType).optional(),
});

export type CreateMovementInput = z.infer<typeof createMovementSchema>;
export type QueryMovementInput = z.infer<typeof queryMovementSchema>;
