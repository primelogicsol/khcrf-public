import { Request, Response, NextFunction } from 'express';
import xss from 'xss';

/**
 * Recursively sanitizes an object or array to remove malicious scripts.
 */
const sanitizeData = (data: any): any => {
    if (typeof data === 'string') {
        const cleaned = xss(data);
        // Sometimes xss trims or alters harmless strings in nuanced ways,
        // but it is very effective at stripping `<script>` and `javascript:`
        return cleaned;
    }
    
    if (Array.isArray(data)) {
        return data.map((item) => sanitizeData(item));
    }
    
    if (typeof data === 'object' && data !== null) {
        const sanitizedObject: any = {};
        for (const [key, value] of Object.entries(data)) {
            sanitizedObject[key] = sanitizeData(value);
        }
        return sanitizedObject;
    }
    
    return data; // Numbers, booleans, nulls, etc.
};

/**
 * Middleware to sanitize deeply nested properties inside req.body, req.query, and req.params.
 * Protects against Stored and Reflected XSS when data is later rendered on the frontend.
 */
export const xssSanitizer = (req: Request, res: Response, next: NextFunction) => {
    if (req.body && Object.keys(req.body).length > 0) {
        for (const key in req.body) {
            req.body[key] = sanitizeData(req.body[key]);
        }
    }
    if (req.query && Object.keys(req.query).length > 0) {
        for (const key in req.query) {
            req.query[key] = sanitizeData(req.query[key]);
        }
    }
    if (req.params && Object.keys(req.params).length > 0) {
        for (const key in req.params) {
            req.params[key] = sanitizeData(req.params[key]);
        }
    }
    next();
};
