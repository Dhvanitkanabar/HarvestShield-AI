// ==================================================
// Standardized API Response Helpers
// ==================================================
// Ensures every endpoint returns a consistent shape:
//   Success: { success: true,  message, data, timestamp }
//   Error:   { success: false, message, errors, timestamp }
// ==================================================

import { Response } from 'express';
import type { ApiSuccessResponse, ApiErrorResponse } from '../types/index.js';

/**
 * Sends a standardized success response.
 */
export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
): void {
  const response: ApiSuccessResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
}

/**
 * Sends a standardized error response.
 */
export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors: string[] = [],
): void {
  const response: ApiErrorResponse = {
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
}
