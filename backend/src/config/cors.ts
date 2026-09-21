import { CorsOptions } from 'cors';

const productionOrigins = [
    'https://khcrf.org',
    'https://www.khcrf.org',
];

const developmentOrigins = [
    'http://localhost:3000',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:4000',
    'http://192.168.29.77:3000',
    'http://192.168.29.77:5000',
];

// Robust environment check
const isProd = process.env.NODE_ENV?.trim() === 'production';
export const allowedOrigins = isProd ? productionOrigins : developmentOrigins;

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);


        // Remove trailing slashes from both to ensure a perfect match
        const cleanOrigin = origin.replace(/\/$/, "");
        const sanitizedAllowed = allowedOrigins.map(o => o.replace(/\/$/, ""));

        const isAllowed = sanitizedAllowed.includes(cleanOrigin);
        if (isAllowed || !isProd) {
            callback(null, true);
        } else {
            console.error(`--- CORS BLOCK ---`);
            console.error(`Blocked Origin: "${origin}"`);
            console.error(`Expected one of: ${sanitizedAllowed.join(', ')}`);
            console.error(`------------------`);
            callback(new Error(`CORS blocked: ${origin}`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'Accept']
};