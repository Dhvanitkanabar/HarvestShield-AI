// ==================================================
// JWT Authentication Middleware
// ==================================================
// Extracts JWT from Authorization header (Bearer) or
// from a signed cookie. Attaches decoded payload to
// req.user for downstream handlers.
// ==================================================

import { Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';
import { verifyToken } from '../utils/jwt.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';
import type { AuthenticatedRequest } from '../types/index.js';

export function authenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  try {
    let token: string | undefined;

    // 1. Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2. Fallback to cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token as string;
    }

    // 3. No token found
    if (!token) {
      throw new AppError(
        MESSAGES.AUTH.UNAUTHORIZED,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    // 4. Verify and attach payload
    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    // Re-throw AppError as-is; wrap JWT errors
    if (error instanceof AppError) {
      next(error);
    } else {
      next(
        new AppError(
          MESSAGES.AUTH.TOKEN_INVALID,
          HTTP_STATUS.UNAUTHORIZED,
        ),
      );
    }
  }
}
