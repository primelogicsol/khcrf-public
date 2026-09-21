import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

/**
 * Global Prisma Error Handler Middleware
 * 
 * Intercepts uncaught Prisma ORM exceptions and formats them into
 * standard JSON REST API responses, preventing unhandled server crashes
 * and exposing too much database internal state to the client.
 */
export function prismaErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint failed
    if (err.code === 'P2002') {
      const target = err.meta?.target as string[];
      return res.status(409).json({
        error: 'Conflict',
        message: `Unique constraint violation on field(s): ${target?.join(', ')}`,
      });
    }

    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found in the database.',
      });
    }

    // Foreign key constraint failed
    if (err.code === 'P2003') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Foreign key constraint failed. Related record does not exist or cannot be deleted.',
      });
    }

    // Fallback for other known Prisma errors
    return res.status(400).json({
      error: 'Database Error',
      message: err.message,
      code: err.code
    });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid data payload provided to the database.',
    });
  }

  // Pass non-Prisma errors down the middleware chain
  next(err);
}
