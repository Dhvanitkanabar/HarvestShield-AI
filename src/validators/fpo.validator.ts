import { z } from 'zod';

export const createFpoSchema = z.object({
  name: z.string().min(2).max(100),
  registrationNumber: z.string().min(2).max(50),
  contactPerson: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().min(5).max(255),
  district: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const updateFpoSchema = createFpoSchema.partial();

export const queryFpoSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  radius: z.coerce.number().optional(), // in km
});

export type CreateFpoInput = z.infer<typeof createFpoSchema>;
export type UpdateFpoInput = z.infer<typeof updateFpoSchema>;
export type QueryFpoInput = z.infer<typeof queryFpoSchema>;
