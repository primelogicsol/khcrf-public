import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Global Rate Limiter
// Limits each IP to 200 requests per 15 minutes
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per `window` (here, per 15 minutes)
    message: {
        status: 429,
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: (req: Request) => {
        // Skip rate limiting in development/test environment
        const env = process.env.NODE_ENV?.trim();
        if (env === 'development' || env === 'test' || !env) {
            return true;
        }
        // Exempt public read-only publications routes from the strict globalLimiter
        if (req.method === 'GET' && req.originalUrl.startsWith('/api/publications')) {
            return true; 
        }
        const ip = req.ip || req.socket.remoteAddress || '';
        return ip.includes('127.0.0.1') || ip.includes('::1') || ip === '::ffff:127.0.0.1';
    }
});

// Public Content Limiter for Knowledge base & Publications (max 500 per 15m)
export const publicContentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: {
        status: 429,
        success: false,
        message: 'Too many requests for public content, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request) => {
        const env = process.env.NODE_ENV?.trim();
        if (env === 'development' || env === 'test' || !env) {
            return true;
        }
        const ip = req.ip || req.socket.remoteAddress || '';
        return ip.includes('127.0.0.1') || ip.includes('::1') || ip === '::ffff:127.0.0.1';
    }
});

// Stricter Rate Limiter for Authentication routes
// Limits each IP to 20 requests per 15 minutes
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per `window` for auth routes
    message: {
        status: 429,
        success: false,
        message: 'Too many login attempts from this IP, please try again after 15 minutes',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request) => {
        const env = process.env.NODE_ENV?.trim();
        if (env === 'development' || env === 'test' || !env) {
            return true;
        }
        const ip = req.ip || req.socket.remoteAddress || '';
        return ip.includes('127.0.0.1') || ip.includes('::1') || ip === '::ffff:127.0.0.1';
    }
});

// GraphQL Rate Limiter
// Prevents query batching attacks by limiting the Apollo server endpoint
export const graphqlLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: {
        status: 429,
        success: false,
        message: 'Too many GraphQL requests from this IP, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request) => {
        const env = process.env.NODE_ENV?.trim();
        if (env === 'development' || env === 'test' || !env) {
            return true;
        }
        const ip = req.ip || req.socket.remoteAddress || '';
        return ip.includes('127.0.0.1') || ip.includes('::1') || ip === '::ffff:127.0.0.1';
    }
});
