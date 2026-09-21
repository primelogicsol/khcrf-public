import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { logger } from '../config/logger';

const REDIS_URL = process.env.REDIS_URL || '';
const redis = REDIS_URL ? new Redis(REDIS_URL) : null;

if (redis) {
  redis.on('error', (err) => logger.warn({ err }, 'Redis Cache Error'));
}

// In-memory fallback
const fallbackCache = new Map<string, { expiry: number; data: any }>();

export const cacheMiddleware = (durationSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;

    try {
      if (redis && redis.status === 'ready') {
        const cachedResponse = await redis.get(key);
        if (cachedResponse) {
          res.setHeader('X-Cache', 'HIT');
          return res.json(JSON.parse(cachedResponse));
        }
      } else {
        const cachedResponse = fallbackCache.get(key);
        if (cachedResponse && cachedResponse.expiry > Date.now()) {
          res.setHeader('X-Cache', 'HIT');
          return res.json(cachedResponse.data);
        }
      }
    } catch (err) {
      logger.error({ err }, 'Cache Retrieval Error');
    }

    res.setHeader('X-Cache', 'MISS');

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      try {
        if (redis && redis.status === 'ready') {
          redis.setex(key, durationSeconds, JSON.stringify(body));
        } else {
          fallbackCache.set(key, {
            expiry: Date.now() + durationSeconds * 1000,
            data: body,
          });
        }
      } catch (err) {
        logger.error({ err }, 'Cache Storage Error');
      }
      return originalJson(body);
    };

    next();
  };
};

export const flushCache = async () => {
  if (redis && redis.status === 'ready') {
    const keys = await redis.keys('cache:*');
    if (keys.length > 0) await redis.del(...keys);
  } else {
    fallbackCache.clear();
  }
};
