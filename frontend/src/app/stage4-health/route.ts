/**
 * Stage 4A fault-injection health probe (server-side only).
 *
 * Lives at /stage4-health (NOT /api/stage4-health) so it is served by the
 * Next.js frontend container. The /api/* namespace is exclusively proxied
 * by Nginx to the backend — any route inside /api/ would return a backend 404.
 *
 * Behaviour:
 *   - STAGE4_FAULT_INJECTION_ENABLED=true AND SIMULATE_FRONTEND_FAILURE=true → 503
 *   - Otherwise → 200
 *
 * The double guard ensures this path is unreachable in production where
 * neither variable is set.
 */

// Force dynamic rendering so runtime env vars (injected by Docker Compose at
// container start) are evaluated on every request, not compiled away at build time.
export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  const faultEnabled = process.env.STAGE4_FAULT_INJECTION_ENABLED === 'true';
  const simulateFailure = process.env.SIMULATE_FRONTEND_FAILURE === 'true';

  if (faultEnabled && simulateFailure) {
    return Response.json(
      { status: 'failed', reason: 'simulated_frontend_failure' },
      { status: 503 }
    );
  }

  return Response.json({ status: 'ok' }, { status: 200 });
}
