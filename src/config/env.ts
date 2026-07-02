// ==================================================
// Environment Configuration
// ==================================================
// Validates all environment variables at startup using
// Zod. The server will fail fast with clear errors if
// any required variable is missing or malformed.
// ==================================================

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().positive().default(5000),

  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid connection string'),

  // JWT
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  // Cookie
  COOKIE_SECRET: z.string().min(16, 'COOKIE_SECRET must be at least 16 characters'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.format();
  console.error('❌ Invalid environment variables:', JSON.stringify(formatted, null, 2));
  process.exit(1);
}

export const env = Object.freeze(parsed.data);
