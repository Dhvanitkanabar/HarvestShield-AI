// ==================================================
// Global Error Handler Middleware
// ==================================================
// Catches all errors thrown or forwarded via next(err).
// Handles: AppError, ZodError, Prisma errors, and
// unknown errors — always returning the standard shape.
// ==================================================

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/appError.js';
import { sendError } from '../utils/apiResponse.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';
import { logger } from '../config/logger.js';

export function globalErrorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // ── Known operational error ──
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message, err.errors);
    return;
  }

  // ── Zod validation error ──
  if (err instanceof ZodError) {
    const errors = err.errors.map(
      (e) => `${e.path.join('.')}: ${e.message}`,
    );
    sendError(
      res,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      MESSAGES.VALIDATION.FAILED,
      errors,
    );
    return;
  }

  // ── Prisma known request error ──
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        // Unique constraint violation
        const target = (err.meta?.target as string[]) || ['field'];
        sendError(
          res,
          HTTP_STATUS.CONFLICT,
          `A record with this ${target.join(', ')} already exists`,
        );
        return;
      }
      case 'P2025': {
        // Record not found
        sendError(res, HTTP_STATUS.NOT_FOUND, MESSAGES.SERVER.NOT_FOUND);
        return;
      }
      default: {
        logger.error(`Prisma error ${err.code}:`, err);
        sendError(
          res,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          MESSAGES.SERVER.INTERNAL_ERROR,
        );
        return;
      }
    }
  }

  // ── JWT errors ──
  if (err.name === 'JsonWebTokenError') {
    sendError(res, HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.TOKEN_INVALID);
    return;
  }
  if (err.name === 'TokenExpiredError') {
    sendError(res, HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.TOKEN_EXPIRED);
    return;
  }

  // ── Unknown / unexpected error ──
  logger.error('Unhandled error:', err);
  sendError(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    MESSAGES.SERVER.INTERNAL_ERROR,
  );
}
