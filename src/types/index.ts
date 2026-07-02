// ==================================================
// Application Type Definitions
// ==================================================

import { Request } from 'express';
import { Role } from '@prisma/client';

// --------------------------------------------------
// API Response Types
// --------------------------------------------------

/** Standardized success response */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

/** Standardized error response */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: string[];
  timestamp: string;
}

// --------------------------------------------------
// Auth Types
// --------------------------------------------------

/** JWT token payload */
export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

/** Express Request augmented with authenticated user */
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// --------------------------------------------------
// User Types (safe — no password)
// --------------------------------------------------

export interface SafeUser {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: Role;
  language: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// --------------------------------------------------
// Auth Service Return Types
// --------------------------------------------------

export interface AuthResult {
  user: SafeUser;
  token: string;
}
