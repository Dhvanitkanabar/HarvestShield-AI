import { z } from 'zod';

export const queryHistorySchema = z.object({
  cropId: z.string().uuid(),
  marketId: z.string().uuid(),
});

export const queryPredictionsSchema = z.object({
  cropId: z.string().uuid(),
  marketId: z.string().uuid(),
});

export const queryRecommendationsSchema = z.object({
  radius: z.coerce.number().min(1).max(500).optional().default(50),
});

export const queryDemandSchema = z.object({
  cropId: z.string().uuid(),
  marketId: z.string().uuid(),
});

export const createPredictionSchema = z.object({
  marketId: z.string().uuid(),
  cropId: z.string().uuid(),
  predictedDate: z.string().datetime(),
  predictedMinPrice: z.number().min(0),
  predictedMaxPrice: z.number().min(0),
  predictedModalPrice: z.number().min(0),
  confidenceScore: z.number().min(0).max(100),
});

export type QueryHistoryInput = z.infer<typeof queryHistorySchema>;
export type QueryPredictionsInput = z.infer<typeof queryPredictionsSchema>;
export type QueryRecommendationsInput = z.infer<typeof queryRecommendationsSchema>;
export type QueryDemandInput = z.infer<typeof queryDemandSchema>;
export type CreatePredictionInput = z.infer<typeof createPredictionSchema>;
