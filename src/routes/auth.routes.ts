// ==================================================
// Auth Routes
// ==================================================
// Defines authentication endpoints and wires together
// validation middleware → controller handlers.
// ==================================================

import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller.js';
import { authenticate, validate } from '../middleware/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = Router();

// POST /api/v1/auth/register
router.post(
  '/register',
  validate(registerSchema, 'body'),
  asyncHandler(register),
);

// POST /api/v1/auth/login
router.post(
  '/login',
  validate(loginSchema, 'body'),
  asyncHandler(login),
);

// GET /api/v1/auth/profile (protected)
router.get(
  '/profile',
  authenticate,
  asyncHandler(getProfile),
);

export default router;
