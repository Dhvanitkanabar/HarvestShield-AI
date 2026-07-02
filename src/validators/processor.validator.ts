import { z } from 'zod';

export const createProcessorSchema = z.object({
  companyName: z.string().min(2).max(100),
  acceptedCrops: z.array(z.string()).min(1),
  processingType: z.string().min(2).max(100),
  capacityPerDay: z.number().positive(),
  district: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  contactPerson: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
});

export const updateProcessorSchema = createProcessorSchema.partial();

export const queryProcessorSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  acceptedCrop: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  radius: z.coerce.number().optional(),
});

export type CreateProcessorInput = z.infer<typeof createProcessorSchema>;
export type UpdateProcessorInput = z.infer<typeof updateProcessorSchema>;
export type QueryProcessorInput = z.infer<typeof queryProcessorSchema>;
