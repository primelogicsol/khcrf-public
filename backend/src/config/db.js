"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
var client_1 = require("@prisma/client");
var adapter_pg_1 = require("@prisma/adapter-pg");
var pg_1 = require("pg");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in .env');
}
// 1. Define a global type to prevent TS errors
var globalForPrisma = global;
// 2. Reuse the pool if it exists, otherwise create it
var pool = globalForPrisma.pool || new pg_1.Pool({
    connectionString: connectionString,
    max: 20, // CRITICAL: Limit each node process to 20 connections max
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 10000,
});
var adapter = new adapter_pg_1.PrismaPg(pool);
// 3. Reuse the Prisma instance if it exists
exports.prisma = globalForPrisma.prisma || new client_1.PrismaClient({ adapter: adapter });
// 4. Save to global object in development (prevents leaks during hot-reloads)
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
    globalForPrisma.pool = pool;
}
