// ==================================================
// Request Logger Middleware
// ==================================================
// Pipes Morgan HTTP request logs through the Winston
// logger so all output goes to the same transports.
// ==================================================

import morgan, { StreamOptions } from 'morgan';
import { logger } from '../config/logger.js';

const stream: StreamOptions = {
  write: (message: string) => {
    // Remove trailing newline from Morgan output
    logger.info(message.trim());
  },
};

/**
 * Morgan middleware configured for:
 * - 'dev' format in development (concise, colored status)
 * - 'combined' format in production (Apache-style)
 */
export const requestLogger = morgan(
  process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  { stream },
);
