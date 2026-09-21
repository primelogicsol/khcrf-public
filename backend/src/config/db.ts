import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { logger } from './logger.js';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in .env');
}

// 1. Define a global type to prevent TS errors
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// 2. Reuse the pool if it exists, otherwise create it
const pool = globalForPrisma.pool || new Pool({
  connectionString,
  max: 20, // CRITICAL: Limit each node process to 20 connections max
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);

// 3. Reuse the Prisma instance if it exists
export const prisma = globalForPrisma.prisma || new PrismaClient({
    adapter,
    log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
    ],
});

// Detect and log slow queries (N+1 issues or missing indexes)
(prisma as any).$on('query', (e: any) => {
    if (e.duration >= 100) {
        logger.warn(`SLOW QUERY DETECTED: [${e.duration}ms] ${e.query}`);
    } else if (process.env.NODE_ENV === 'development') {
        logger.debug(`QUERY: [${e.duration}ms] ${e.query}`);
    }
});

// 4. Save to global object in development (prevents leaks during hot-reloads)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}