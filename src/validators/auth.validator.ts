// ==================================================
// Auth Validation Schemas (Zod)
// ==================================================

import { z } from 'zod';

/**
 * Registration request validation schema.
 * Enforces required fields, email format, password
 * strength, and valid role enum.
 */
export const registerSchema = z.object({
  fullName: z
    .string({ required_error: 'Full name is required' })
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters'),

  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email address')
    .toLowerCase(),

  phone: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number')
    .optional()
    .or(z.literal('')),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one digit',
    ),

  role: z
    .enum(['ADMIN', 'FARMER', 'FPO', 'WAREHOUSE', 'PROCESSOR', 'MARKET'], {
      errorMap: () => ({ message: 'Invalid role. Must be one of: ADMIN, FARMER, FPO, WAREHOUSE, PROCESSOR, MARKET' }),
    })
    .default('FARMER'),

  language: z
    .string()
    .trim()
    .min(2, 'Language code must be at least 2 characters')
    .max(5, 'Language code must not exceed 5 characters')
    .default('en'),
});

/**
 * Login request validation schema.
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email address')
    .toLowerCase(),

  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

// Export inferred types for use in services/controllers
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
