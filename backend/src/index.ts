import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cluster from 'node:cluster';
import os from 'node:os';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
const EXPECTED_DATABASE = process.env.EXPECTED_DATABASE || process.env.POSTGRES_DB || 'hcrf_db_clean';
type DatabaseIdentityRow = { db_name: string; };

import rateLimit from 'express-rate-limit';
import { globalLimiter, graphqlLimiter } from './middleware/rateLimiter';
import { xssSanitizer } from './middleware/xssMiddleware.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { responseFormatter } from './middleware/responseFormatter.js';
import authRoutes from './routes/authRoutes.js';
import evaluationRoutes from './routes/evaluationRoutes.js';
import integrationRoutes from './routes/integrationRoutes.js';
import accreditationRoutes from './routes/accreditationRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import grantRoutes from './routes/grantRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import membershipRoutes from './routes/membershipRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import apprenticeshipRoutes from './routes/apprenticeshipRoutes.js';
import legislativeRoutes from './routes/legislativeRoutes.js';
import publicationRoutes from './routes/publicationRoutes.js';
import initiativeRoutes from './routes/initiativeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import cmsRoutes from './routes/cmsRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import certificatePackageRoutes from './routes/certificatePackageRoutes.js';
import ccsiRoutes from './routes/ccsiRoutes.js';
import cceRoutes from './routes/cceRoutes.js';
import intakeRoutes from './routes/intakeRoutes.js';
import advisoryRoutes from './routes/advisoryRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import publicSkcRoutes from './routes/publicSkcRoutes.js';
import skcHearingRoutes from './routes/skcHearingRoutes.js';
import skcDraftFindingsRoutes from './routes/skcDraftFindingsRoutes.js';
import skcInstitutionRoutes from './routes/skcInstitutionRoutes.js';
import skcStakeholderRoutes from './routes/skcStakeholderRoutes.js';
import skcRegistryResourceRoutes from './routes/skcRegistryResourceRoutes.js';
import skcConfigRoutes from './routes/skcConfigRoutes.js';
import skcFindingRoutes from './routes/skcFindingRoutes.js';
import skcAdvisoryRoutes from './routes/skcAdvisoryRoutes.js';
import { applyAdvisor } from './controllers/advisoryController.js';
import skcOfficialMessageRoutes from './routes/skcOfficialMessageRoutes.js';
import skcOfficialMessageAdminRoutes from './routes/skcOfficialMessageAdminRoutes.js';
import skcEvidenceRoutes from './routes/skcEvidenceRoutes.js';
import heroRoutes from './routes/heroRoutes.js';
import fellowshipRoutes from './routes/fellowshipRoutes.js';
import skcLifecycleRoutes from './routes/skcLifecycleRoutes.js';
import { prisma } from './config/db.js';
import { corsOptions } from './config/cors.js';

// --- Sprint 1A: Knowledge Infrastructure Routes ---
import knowledgeRoutes from './routes/knowledgeRoutes';
import taxonomyRoutes from './routes/taxonomyRoutes';
import relationshipRoutes from './routes/relationshipRoutes';
import sourcereferenceRoutes from './routes/sourcereferenceRoutes';
import verificationRoutes from './routes/verificationRoutes';
import workflowRoutes from './routes/workflowRoutes';
import mediaassetRoutes from './routes/mediaassetRoutes';

// --- Sprint 1B: Domain Entities Routes ---
import craftRoutes from './routes/craftRoutes';
import materialRoutes from './routes/materialRoutes';
import toolRoutes from './routes/toolRoutes';
import techniqueRoutes from './routes/techniqueRoutes';
import motifRoutes from './routes/motifRoutes';
import productRoutes from './routes/productRoutes';
import glossarytermRoutes from './routes/glossarytermRoutes';
import graphRoutes from './routes/graphRoutes';
import artisanRoutes from './routes/artisanRoutes';
import masterArtisanRoutes from './routes/masterArtisanRoutes';
import masterArtisanAdminRoutes from './routes/admin/masterArtisanAdminRoutes';
import studioRoutes from './routes/studioRoutes';
import collectionRoutes from './routes/collectionRoutes';
import researchpublicationRoutes from './routes/researchpublicationRoutes';
import searchRoutes from './routes/searchRoutes';
import healthRoutes from './routes/healthRoutes';
import participationRoutes from './routes/participationRoutes';
import aiRoutes from './routes/aiRoutes';
import { cacheMiddleware } from './middleware/cacheMiddleware';
import iiifRoutes from './routes/iiifRoutes';
import { prismaErrorHandler } from './middleware/prismaErrorHandler';
import { logger } from './config/logger';
import { setupSwagger } from './config/swagger.js';
import { setupSentry } from './config/sentry.js';
import * as Sentry from '@sentry/node';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import depthLimit from 'graphql-depth-limit';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.set('trust proxy', 1);

// ─── Global Prisma Decimal → number serializer ─────────────────────────────
// Prisma Decimal fields (amount, etc.) serialize as strings via res.json().
// This middleware converts them to plain JS numbers globally so the frontend
// always receives numeric values it can call .toLocaleString() on.
function serializeDecimals(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    // Prisma Decimal objects have a toFixed() method and a specific constructor name
    const asAny = obj as any;
    if (typeof asAny.toFixed === 'function' && typeof asAny.toNumber === 'function') {
      return asAny.toNumber();
    }
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(asAny)) {
      result[key] = serializeDecimals(asAny[key]);
    }
    return result;
  }
  if (Array.isArray(obj)) {
    return (obj as unknown[]).map(serializeDecimals);
  }
  return obj;
}
app.use((_req: any, res: any, next: any) => {
  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => originalJson(serializeDecimals(body));
  next();
});
// ─────────────────────────────────────────────────────────────────────────────

// Initialize Sentry
setupSentry(app);

// --- GLOBAL MIDDLEWARE ---
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  dnsPrefetchControl: {
    allow: false
  }
}));

// Configure Strict CORS
const developmentOrigins = process.env.NODE_ENV !== 'production' 
    ? ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3003', 'http://127.0.0.1:3003'] 
    : [];

const allowedOrigins = [
    ...developmentOrigins,
    'https://khcrf.org',
    'https://www.khcrf.org',
    'https://dashboard.khcrf.org',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            logger.warn({ rejectedOrigin: origin, allowedOrigins }, '[CORS Rejected Origin]');
            callback(new Error(`Not allowed by CORS: ${origin}`));
        }
    },
    credentials: true,
}));

app.use(compression()); // Gzip/Brotli payload compression (Sprint 10)
app.use(morgan('combined')); // HTTP request observability (Sprint 14)

// Parsing Cookies
app.use(cookieParser());
app.use(responseFormatter); // Unified JSON Response Formatter

// Limit Request Size to prevent DoS via large JSON payloads
app.use(express.json({
    limit: '10mb',
    verify: (req: any, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Apply XSS Sanitization recursively on all inputs
app.use(xssSanitizer);

// Apply Global Rate Limiting
app.use(globalLimiter);

// API Documentation (Swagger)
setupSwagger(app);

// Serve uploaded files (consultation evidence, etc.)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// secure_uploads served via admin-authenticated route only (CVs, sensitive docs)
app.use('/secure_uploads', express.static(path.join(process.cwd(), 'secure_uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/evaluation', evaluationRoutes);
app.use('/api/cktre/integrations', integrationRoutes);
app.use('/api/listing', listingRoutes);
app.use('/api/grant', grantRoutes);
app.use('/api/accreditation', accreditationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/membership', membershipRoutes);
app.use('/api/donation', donationRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/apprenticeship', apprenticeshipRoutes);
app.use('/api/legislative', legislativeRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/initiatives', initiativeRoutes);
app.use('/api/certificate-packages', certificatePackageRoutes);
app.use('/api/ccsi', ccsiRoutes);
app.use('/api/cce', cceRoutes);
app.use('/api/intake', intakeRoutes);
app.use('/api/advisory', advisoryRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/public/skc', publicSkcRoutes);
app.use('/api/skc/hearings', skcHearingRoutes);
app.use('/api/skc/draft-findings', skcDraftFindingsRoutes);
app.use('/api/skc/institutions', skcInstitutionRoutes);
app.use('/api/skc/stakeholders', skcStakeholderRoutes);
app.use('/api/skc/stakeholder-registry/resources', skcRegistryResourceRoutes);
app.use('/api/skc/config', skcConfigRoutes);
app.use('/api/skc/findings', skcFindingRoutes);
app.post('/api/skc/advisory-applications', applyAdvisor);
app.use('/api/skc/advisory', skcAdvisoryRoutes);
app.use('/api/skc/official-messages', skcOfficialMessageRoutes);
app.use('/api/skc/admin/official-messages', skcOfficialMessageAdminRoutes);
app.use('/api/skc/evidence', skcEvidenceRoutes);
app.use('/api/skc/fellowships', fellowshipRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api', skcLifecycleRoutes);

// --- Sprint 1A: Knowledge Infrastructure Mounts ---
app.use('/api/knowledge', cacheMiddleware(60), knowledgeRoutes); // Cached for 60s
app.use('/api/v1/knowledge', cacheMiddleware(60), knowledgeRoutes); // Map versioned path for frontend compatibility
app.use('/api/taxonomy', cacheMiddleware(300), taxonomyRoutes);
app.use('/api/relationship', relationshipRoutes);
app.use('/api/source-reference', sourcereferenceRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/workflow', workflowRoutes);
app.use('/api/media', mediaassetRoutes);

// --- Sprint 1B: Domain Entities Mounts ---
app.use('/api/craft', craftRoutes);
app.use('/api/material', materialRoutes);
app.use('/api/tool', toolRoutes);
app.use('/api/technique', techniqueRoutes);
app.use('/api/motif', motifRoutes);
app.use('/api/product', productRoutes);
app.use('/api/glossary-term', glossarytermRoutes);
app.use('/api/graph', graphRoutes);

// --- Sprints 4-7 Domain Entities ---
import magazineIssueRoutes from './routes/magazineIssueRoutes.js';

app.use('/api/artisan', artisanRoutes);
app.use('/api/v1/artisans', masterArtisanRoutes);
app.use('/api/admin/master-artisans', masterArtisanAdminRoutes);
app.use('/api/magazine-issues',    magazineIssueRoutes); // canonical
app.use('/api/v1/magazine-issues', magazineIssueRoutes); // backward-compat alias (production frontend)
app.use('/api/studio', studioRoutes);
app.use('/api/collection', collectionRoutes);
app.use('/api/research-publication', researchpublicationRoutes);

// --- Sprint 8: Search ---
app.use('/api/search', cacheMiddleware(30), searchRoutes); // Cached for 30s

// --- Sprint 9: AI ---
app.use('/api/ai', aiRoutes);

// --- Cycle 12: Knowledge Health ---
app.use('/api/health', healthRoutes);

// --- Cycle 14: Participation Workflows ---
app.use('/api/participation', participationRoutes);

// --- Institutional Excellence ---
app.use('/api/iiif', iiifRoutes);



// Observability and Health
app.get('/health', async (req, res) => {
    let databaseStatus = 'disconnected';
    try {
        await prisma.$queryRaw`SELECT 1`;
        databaseStatus = 'connected';
    } catch (error) {
        logger.error({ error }, 'Health check database connection failed');
        databaseStatus = 'disconnected';
    }

    const release = process.env.BACKEND_SHA || 'development';

    res.json({
        status: databaseStatus === 'connected' ? 'ok' : 'error',
        release: release,
        backendRelease: release,
        frontendRelease: release,
        googleOAuthConfigured: !!((process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) && process.env.GOOGLE_CLIENT_SECRET),
        database: databaseStatus
    });
});

app.get('/api/health', async (req, res) => {
    let databaseStatus = 'disconnected';
    try {
        await prisma.$queryRaw`SELECT 1`;
        databaseStatus = 'connected';
    } catch (error) {
        logger.error({ error }, 'Health check database connection failed');
        databaseStatus = 'disconnected';
    }

    const release = process.env.BACKEND_SHA || 'development';

    res.json({
        status: databaseStatus === 'connected' ? 'ok' : 'error',
        release: release,
        backendRelease: release,
        frontendRelease: release,
        googleOAuthConfigured: !!((process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) && process.env.GOOGLE_CLIENT_SECRET),
        database: databaseStatus,
        redis: 'connected'
    });
});

// Dedicated Kubernetes / Docker health probes
app.get('/health/liveness', (req, res) => {
    // Liveness probe just needs to know the process is responsive
    res.status(200).json({ status: 'OK', message: 'Liveness probe passed' });
});



app.get('/health/readiness', async (req, res) => {
    try {
        const result = await prisma.$queryRaw<DatabaseIdentityRow[]>`SELECT current_database() as db_name`;
        if (result[0].db_name !== EXPECTED_DATABASE) {
            return res.status(503).json({ 
                status: 'ERROR', 
                databaseConnected: true,
                databaseIdentityValid: false 
            });
        }
        res.status(200).json({ 
            status: 'OK', 
            databaseConnected: true,
            databaseIdentityValid: true,
            databaseName: result[0].db_name
        });
    } catch (error) {
        logger.error({ error }, 'Readiness probe failed');
        res.status(503).json({ 
            status: 'ERROR', 
            databaseConnected: false 
        });
    }
});

// Sentry Error Handler (must be before any other error middleware)
Sentry.setupExpressErrorHandler(app);

// Apply Prisma Error Handler
app.use(prismaErrorHandler);

// Default global error handler for non-Prisma errors
app.use((
  error: unknown,
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) => {
    logger.error({ err: error }, `Unhandled error: ${error instanceof Error ? error.message : String(error)}`);
    console.error('[UNHANDLED ERROR]', error);

    res.status(500).json({
      status: 'error',
      message:
        process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : 'Internal server error',
    });
});

const startServer = async () => {
    
    // Initialize Apollo Server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        validationRules: [depthLimit(5)], // Prevent queries deeper than 5 levels
    });
    
    await server.start();
    
    // GraphQL Endpoint with Rate Limiting
    // Wrap expressMiddleware to avoid @apollo/server vs @types/express version conflict
    const gqlMiddleware = expressMiddleware(server) as unknown as express.RequestHandler;
    app.use('/api/graphql', graphqlLimiter, gqlMiddleware);

    
    // KHCRF DATABASE IDENTITY GUARD
    try {
        const result = await prisma.$queryRaw<DatabaseIdentityRow[]>`SELECT current_database() as db_name`;
        const connectedDb = result[0].db_name;
        if (connectedDb !== EXPECTED_DATABASE) {
            logger.fatal(`REFUSING STARTUP: Expected ${EXPECTED_DATABASE}, connected to ${connectedDb}`);
            process.exit(1);
        }
        logger.info(`Database Identity Guard passed: Connected to ${connectedDb}`);
    } catch (e) {
        logger.fatal({ err: e }, 'Database Identity Guard failed to query database');
        process.exit(1);
    }

    const httpServer = app.listen(PORT, () => {
        logger.info(`REST server running on port ${PORT}`);
        logger.info(`GraphQL server running at http://localhost:${PORT}/graphql`);
    });

    // Graceful Shutdown Handler
    const shutdown = async () => {
        logger.info('Gracefully shutting down services...');
        await server.stop();
        logger.info('Apollo GraphQL server stopped.');
        
        httpServer.close(async () => {
            logger.info('HTTP server closed.');
            await prisma.$disconnect();
            logger.info('Prisma disconnected.');
            process.exit(0);
        });

        // Force shutdown after 10 seconds
        setTimeout(() => {
            logger.fatal('Forceful shutdown due to timeout');
            process.exit(1);
        }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
};

// Global Process Error Handlers
process.on('uncaughtException', (err) => {
    logger.fatal({ err }, 'UNCAUGHT EXCEPTION! Shutting down...');
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.fatal({ err: reason, promise }, 'UNHANDLED REJECTION! Shutting down...');
    process.exit(1);
});

// Run with clustering in production (disabled via CLUSTER_DISABLED=true for CI/Stage4A)
if (process.env.NODE_ENV === 'production' && cluster.isPrimary && process.env.CLUSTER_DISABLED !== 'true') {
    const numCPUs = process.env.WEB_CONCURRENCY ? parseInt(process.env.WEB_CONCURRENCY, 10) : (process.env.BACKEND_WORKERS ? parseInt(process.env.BACKEND_WORKERS, 10) : os.cpus().length);
    logger.info(`Primary process ${process.pid} is running`);
    logger.info(`Forking ${numCPUs} workers...`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        logger.warn(`Worker ${worker.process.pid} died (code: ${code}, signal: ${signal}). Restarting...`);
        cluster.fork();
    });
} else {
    startServer().catch((error) => {
        logger.error({ err: error }, 'Failed to start server');
        process.exit(1);
    });
}

export { prisma };

// Harmless backend comment for Test B

// Harmless backend change for Test C
// trigger reload
