// ==================================================
// Async Handler Wrapper
// ==================================================
// Eliminates try-catch boilerplate in every route handler.
// Catches any rejected promise and forwards it to the
// Express global error middleware.
// ==================================================

import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
