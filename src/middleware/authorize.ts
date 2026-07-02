// ==================================================
// Role-Based Authorization Middleware
// ==================================================
// Must be used AFTER the authenticate middleware.
// Checks if the authenticated user's role is in the
// allowed list.
// ==================================================

import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AppError } from '../utils/appError.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';
import type { AuthenticatedRequest } from '../types/index.js';

/**
 * Returns middleware that restricts access to the
 * specified roles. Pass no arguments to allow any
 * authenticated user.
 *
 * @example
 *   router.get('/admin', authenticate, authorize('ADMIN'), handler);
 *   router.get('/dashboard', authenticate, authorize('ADMIN', 'FPO'), handler);
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(
        new AppError(MESSAGES.AUTH.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED),
      );
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(MESSAGES.AUTH.FORBIDDEN, HTTP_STATUS.FORBIDDEN),
      );
    }

    next();
  };
}
