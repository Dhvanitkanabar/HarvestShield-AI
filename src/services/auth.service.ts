// ==================================================
// Auth Service
// ==================================================
// Contains ALL business logic for authentication.
// Framework-agnostic — no Express imports.
// Depends on UserRepository (injected) and utility fns.
// ==================================================

import { User } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository.js';
import { hashPassword, comparePassword, generateToken, AppError } from '../utils/index.js';
import { HTTP_STATUS, MESSAGES } from '../constants/index.js';
import type { SafeUser, AuthResult, JwtPayload } from '../types/index.js';
import type { RegisterInput, LoginInput } from '../validators/auth.validator.js';

export class AuthService {
  constructor(private readonly userRepo: UserRepository) {}

  // --------------------------------------------------
  // Register
  // --------------------------------------------------

  async register(input: RegisterInput): Promise<AuthResult> {
    // Check for existing user
    const existingUser = await this.userRepo.findByEmail(input.email);
    if (existingUser) {
      throw new AppError(
        MESSAGES.AUTH.EMAIL_EXISTS,
        HTTP_STATUS.CONFLICT,
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(input.password);

    // Create user
    const user = await this.userRepo.create({
      ...input,
      password: hashedPassword,
    });

    // Generate token
    const token = this.createToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  // --------------------------------------------------
  // Login
  // --------------------------------------------------

  async login(input: LoginInput): Promise<AuthResult> {
    // Find user
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) {
      throw new AppError(
        MESSAGES.AUTH.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    // Verify password
    const isMatch = await comparePassword(input.password, user.password);
    if (!isMatch) {
      throw new AppError(
        MESSAGES.AUTH.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED,
      );
    }

    // Generate token
    const token = this.createToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  // --------------------------------------------------
  // Get Profile
  // --------------------------------------------------

  async getProfile(userId: string): Promise<SafeUser> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError(
        MESSAGES.AUTH.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
      );
    }

    return this.sanitizeUser(user);
  }

  // --------------------------------------------------
  // Private Helpers
  // --------------------------------------------------

  /**
   * Creates a JWT payload and signs it.
   */
  private createToken(user: User): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    return generateToken(payload);
  }

  /**
   * Strips sensitive fields (password) from the user object.
   */
  private sanitizeUser(user: User): SafeUser {
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }
}
