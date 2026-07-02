// ==================================================
// Server Entry Point
// ==================================================
// Connects to the database, starts the HTTP server,
// and sets up graceful shutdown handlers.
// ==================================================

import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectDatabase, disconnectDatabase } from './prisma/client.js';

async function bootstrap(): Promise<void> {
  // 1. Connect to database
  await connectDatabase();

  // 2. Start HTTP server
  const server = app.listen(env.PORT, () => {
    logger.info(`
    ╔══════════════════════════════════════════════╗
    ║         🌾 HarvestShield AI API 🌾          ║
    ╠══════════════════════════════════════════════╣
    ║  Environment : ${env.NODE_ENV.padEnd(28)}║
    ║  Port        : ${String(env.PORT).padEnd(28)}║
    ║  URL         : http://localhost:${String(env.PORT).padEnd(13)}║
    ║  API Base    : /api/v1                       ║
    ╚══════════════════════════════════════════════╝
    `);
  });

  // 3. Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`\n${signal} received. Shutting down gracefully...`);

    server.close(async () => {
      logger.info('HTTP server closed');
      await disconnectDatabase();
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown — could not close connections in time');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: unknown) => {
    logger.error('Unhandled Rejection:', reason);
    shutdown('UNHANDLED_REJECTION');
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    shutdown('UNCAUGHT_EXCEPTION');
  });
}

bootstrap().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
