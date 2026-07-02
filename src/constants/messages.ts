// ==================================================
// Centralized Application Messages
// ==================================================
// Single source of truth for all user-facing messages.
// Keeps controllers and services free of hardcoded strings.
// ==================================================

export const MESSAGES = {
  // Auth
  AUTH: {
    REGISTER_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    PROFILE_FETCHED: 'Profile retrieved successfully',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'An account with this email already exists',
    USER_NOT_FOUND: 'User not found',
    UNAUTHORIZED: 'Authentication required. Please log in',
    FORBIDDEN: 'You do not have permission to access this resource',
    TOKEN_EXPIRED: 'Session expired. Please log in again',
    TOKEN_INVALID: 'Invalid authentication token',
  },

  // Validation
  VALIDATION: {
    FAILED: 'Validation failed',
    INVALID_EMAIL: 'Please provide a valid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
    FULL_NAME_REQUIRED: 'Full name is required',
    INVALID_ROLE: 'Invalid role specified',
  },

  // Server
  SERVER: {
    INTERNAL_ERROR: 'An unexpected error occurred. Please try again later',
    NOT_FOUND: 'The requested resource was not found',
    HEALTH_OK: 'HarvestShield AI API is running',
  },
} as const;
