import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { logger } from '../config/logger.js';

export const validateRequest = (schema: ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn(`Validation failed for ${req.method} ${req.originalUrl}`);
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.format(),
        });
        return;
      }
      next(error);
    }
  };
};
