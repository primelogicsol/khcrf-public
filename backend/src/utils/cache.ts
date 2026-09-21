import Redis from 'ioredis';
import { logger } from '../config/logger.js';

// Use REDIS_URL or fallback to localhost
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisClient = new Redis(redisUrl, {
  lazyConnect: true,
  maxRetriesPerRequest: 1, // Don't hang indefinitely if Redis is down
  retryStrategy(times) {
    // Only retry connection up to 3 times before giving up to prevent blocking the event loop
    if (times > 3) {
      logger.error('Redis connection retries exhausted. Disabling caching layer.');
      return null; // Stop retrying
    }
    return Math.min(times * 50, 2000);
  }
});

let isRedisConnected = false;

redisClient.on('connect', () => {
  isRedisConnected = true;
  logger.info('Redis caching layer connected successfully.');
});

redisClient.on('error', (err) => {
  isRedisConnected = false;
  logger.warn(`Redis connection error (Cache Disabled): ${err.message}`);
});

/**
 * Retrieve parsed JSON from cache safely.
 */
export async function getCache<T>(key: string): Promise<T | null> {
  if (!isRedisConnected) return null;
  try {
    const data = await redisClient.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    logger.error({ err: error }, `Cache GET error for key: ${key}`);
    return null;
  }
}

/**
 * Set JSON data in cache with a TTL (default 1 hour).
 */
export async function setCache(key: string, data: any, ttlSeconds: number = 3600): Promise<void> {
  if (!isRedisConnected) return;
  try {
    await redisClient.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch (error) {
    logger.error({ err: error }, `Error writing to cache for key ${key}`);
  }
}

/**
 * Delete a cache key or multiple keys.
 */
export async function clearCache(pattern: string): Promise<void> {
  if (!isRedisConnected) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  } catch (error) {
    logger.error({ err: error }, `Error clearing cache for pattern ${pattern}`);
  }
}
