import { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Wraps an async route handler so any rejection is forwarded to globalErrorHandler.
 * Express 5 forwards rejected promises on its own, but every handler goes through this
 * wrapper so the behaviour stays explicit and identical across the codebase.
 */
const catchAsync =
  (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default catchAsync;
