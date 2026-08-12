import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

/**
 * Validates { body, query, params } against a zod schema.
 * A ZodError is passed to globalErrorHandler, which turns it into a 422 with field errors.
 */
const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body !== undefined) {
        req.body = parsed.body;
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
