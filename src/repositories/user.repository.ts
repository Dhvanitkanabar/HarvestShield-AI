// ==================================================
// User Repository
// ==================================================
// Data access layer for the User model.
// Contains NO business logic — only Prisma queries.
// Services depend on this abstraction.
// ==================================================

import { User } from '@prisma/client';
import { prisma } from '../prisma/client.js';
import type { RegisterInput } from '../validators/auth.validator.js';

export class UserRepository {
  /**
   * Find a user by their email address.
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find a user by their UUID.
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new user record.
   */
  async create(data: RegisterInput & { password: string }): Promise<User> {
    return prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        password: data.password,
        role: data.role,
        language: data.language,
      },
    });
  }
}

// Singleton instance for dependency injection
export const userRepository = new UserRepository();
