import { z } from 'zod';

export const createFarmerSchema = z.object({
  userId: z.string().uuid(),
  aadhaarNumber: z.string().length(12).optional(),
  farmName: z.string().max(100).optional(),
  farmSize: z.number().positive(),
  soilType: z.string().max(50).optional(),
  irrigationType: z.string().max(50).optional(),
  village: z.string().min(2).max(100),
  taluka: z.string().min(2).max(100),
  district: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  country: z.string().max(50).default('India'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  fpoId: z.string().uuid().optional(),
});

export const updateFarmerSchema = createFarmerSchema.omit({ userId: true }).partial();

export const queryFarmerSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  fpoId: z.string().uuid().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  radius: z.coerce.number().optional(),
});

export type CreateFarmerInput = z.infer<typeof createFarmerSchema>;
export type UpdateFarmerInput = z.infer<typeof updateFarmerSchema>;
export type QueryFarmerInput = z.infer<typeof queryFarmerSchema>;
