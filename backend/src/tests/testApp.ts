/**
 * Minimal Express app for P4 certification testing.
 *
 * Composes only the middleware and routes needed for the classification
 * endpoint, with no cluster, no Apollo, no rate limits (which would
 * interfere with concurrent-request tests).
 *
 * This file is used exclusively by P4 integration tests.
 */

import express from 'express';
import cookieParser from 'cookie-parser';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware';
import skcClassificationRoutes from '../routes/admin/skcClassification.routes';

export function createTestApp() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  app.use(
    '/api/admin/skc/classification',
    authenticateToken,
    authorizeAdmin,
    skcClassificationRoutes
  );

  return app;
}
