// ==================================================
// Password Hashing Utilities
// ==================================================

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

/**
 * Hashes a plaintext password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plaintext password against a bcrypt hash.
 */
export async function comparePassword(
  plaintext: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(plaintext, hashed);
}
