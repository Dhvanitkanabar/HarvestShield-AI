// ==================================================
// Custom Application Error Class
// ==================================================
// Extends the native Error class with HTTP status codes
// and structured error details for the global error
// handler to consume.
// ==================================================

import { HttpStatusCode } from '../constants/index.js';

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly isOperational: boolean;
  public readonly errors: string[];

  constructor(
    message: string,
    statusCode: HttpStatusCode,
    errors: string[] = [],
    isOperational = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, AppError.prototype);

    // Capture stack trace (excludes constructor call from trace)
    Error.captureStackTrace(this, this.constructor);
  }
}
