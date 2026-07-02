// ==================================================
// Auth Module Barrel Export
// ==================================================
// Re-exports all auth module components for clean imports.
// As the module grows, add exports here.
// ==================================================

export { default as authRoutes } from '../../routes/auth.routes.js';
export * from '../../validators/auth.validator.js';
export { AuthService } from '../../services/auth.service.js';
export { UserRepository } from '../../repositories/user.repository.js';
