// ==================================================
// Auth Controller
// ==================================================
// Thin controller layer — NO business logic here.
// Responsibilities:
//   1. Extract validated data from request
//   2. Call the appropriate service method
//   3. Send standardized response
// ==================================================

import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { userRepository } from '../repositories/user.repository.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';
import type { AuthenticatedRequest } from '../types/index.js';
import type { RegisterInput, LoginInput } from '../validators/auth.validator.js';

// Instantiate service with repository (dependency injection)
const authService = new AuthService(userRepository);

/**
 * POST /api/v1/auth/register
 * Creates a new user account and returns a JWT.
 */
export async function register(req: Request, res: Response): Promise<void> {
  const input = req.body as RegisterInput;
  const result = await authService.register(input);

  // Set token in HTTP-only cookie as well
  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.AUTH.REGISTER_SUCCESS, result);
}

/**
 * POST /api/v1/auth/login
 * Authenticates a user and returns a JWT.
 */
export async function login(req: Request, res: Response): Promise<void> {
  const input = req.body as LoginInput;
  const result = await authService.login(input);

  // Set token in HTTP-only cookie
  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.AUTH.LOGIN_SUCCESS, result);
}

/**
 * GET /api/v1/auth/profile
 * Returns the authenticated user's profile.
 * Requires: authenticate middleware.
 */
export async function getProfile(req: Request, res: Response): Promise<void> {
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.user!.userId;
  const profile = await authService.getProfile(userId);

  sendSuccess(res, HTTP_STATUS.OK, MESSAGES.AUTH.PROFILE_FETCHED, profile);
}
