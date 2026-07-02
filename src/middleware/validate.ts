// ==================================================
// Zod Validation Middleware
// ==================================================
// Generic middleware factory that validates request
// body, query, or params against a Zod schema.
// On failure, throws a ZodError caught by the global
// error handler.
// ==================================================

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Creates middleware that validates the specified part
 * of the request against a Zod schema.
 *
 * @example
 *   router.post('/register', validate(registerSchema, 'body'), handler);
 */
export function validate(schema: AnyZodObject, target: ValidationTarget = 'body') {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req[target]);
      // Replace raw input with parsed & sanitized data
      req[target] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(error);
      }
    }
  };
}
