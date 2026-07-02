// ==================================================
// Prisma Client Singleton
// ==================================================
// Prevents multiple Prisma Client instances in dev
// (caused by hot-reloading) and provides a centralized
// connection point with lifecycle management.
// ==================================================

import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.js';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Connects to the database and logs the result.
 * Called once during server startup.
 */
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

/**
 * Gracefully disconnects from the database.
 * Called during server shutdown.
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  logger.info('🔌 Database disconnected');
}
