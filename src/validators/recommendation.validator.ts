import { z } from 'zod';

export const generateRecommendationSchema = z.object({
  batchId: z.string().uuid(),
});

export const queryRecommendationSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  batchId: z.string().uuid().optional(),
});

export type GenerateRecommendationInput = z.infer<typeof generateRecommendationSchema>;
export type QueryRecommendationInput = z.infer<typeof queryRecommendationSchema>;
