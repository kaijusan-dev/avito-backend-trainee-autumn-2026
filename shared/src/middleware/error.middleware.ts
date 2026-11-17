import { type Request, type Response, type NextFunction  } from 'express';
import { env } from '../config/env.js';
import { HttpError } from '../errors/http.errors.js';
import type { ErrorCode, ErrorResponse } from '../errors/error.schema.js';
import { toPermISOString } from '../utils/local-time.js';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err instanceof HttpError ? err.statusCode : 500;
  const code: ErrorCode = err instanceof HttpError ? err.code : 'INTERNAL_SERVER_ERROR';
  // Стек вызовов только в режиме разработки
  const stack = env.NODE_ENV === 'development' ? err.stack : undefined;

  const response: ErrorResponse = {
    success: false,
    status,
    code,
    message: err.message,
    timestamp: toPermISOString(),
    stack
  }

  res.status(status).json(response);
};