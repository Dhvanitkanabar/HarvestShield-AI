import { z } from 'zod';

export const createInventorySchema = z.object({
  batchId: z.string().uuid(),
  warehouseId: z.string().uuid(),
  storedQuantity: z.number().positive(),
  temperature: z.number().optional(),
  humidity: z.number().optional(),
  storageCondition: z.string().max(200).optional(),
});

export const updateInventorySchema = z.object({
  temperature: z.number().optional(),
  humidity: z.number().optional(),
  storageCondition: z.string().max(200).optional(),
});

export const queryInventorySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  warehouseId: z.string().uuid().optional(),
  batchId: z.string().uuid().optional(),
  expiringSoon: z.coerce.boolean().optional(),
});

export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
export type QueryInventoryInput = z.infer<typeof queryInventorySchema>;
