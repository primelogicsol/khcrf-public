import { Request, Response, NextFunction } from 'express';

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  meta?: any;
}

export function responseFormatter(req: Request, res: Response, next: NextFunction) {
  // Store the original json method
  const originalJson = res.json;

  // Override the json method
  res.json = function (body: any): Response {
    console.log("FORMATTER BODY status:", body?.status, "keys:", body ? Object.keys(body) : null);
    // If the body is already formatted, or it's an error response (usually handled elsewhere), skip
    if (body && (body.status === 'success' || body.status === 'error')) {
      return originalJson.call(this, body);
    }

    // Skip formatting for versioned API endpoints (/api/v1/*) to preserve raw array formatting for frontend fetchers
    if (req.originalUrl && req.originalUrl.includes('/api/v1/')) {
      return originalJson.call(this, body);
    }

    const formattedBody: any = {
      status: res.statusCode >= 400 ? 'error' : 'success',
    };

    // If body is an object representing a paginated result (having total and data as array),
    // flatten the payload so frontend data.data references the actual array of results
    if (
      body &&
      typeof body === 'object' &&
      'data' in body &&
      Array.isArray(body.data) &&
      ('total' in body || 'totalPages' in body)
    ) {
      formattedBody.data = body.data;
      formattedBody.total = body.total;
      formattedBody.skip = body.skip;
      formattedBody.take = body.take;
      if ('page' in body) formattedBody.page = body.page;
      if ('limit' in body) formattedBody.limit = body.limit;
      if ('totalPages' in body) formattedBody.totalPages = body.totalPages;
    } else {
      formattedBody.data = body;
    }

    return originalJson.call(this, formattedBody);
  };

  next();
}
