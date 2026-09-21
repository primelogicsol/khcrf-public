# AEK Dynamic Backlog (Cycle 2)

| ID | Description | Category | Impact | Risk | Effort | Institutional Value | Dependencies | Est. Time | Priority Score | Status |
|----|-------------|----------|--------|------|--------|---------------------|--------------|-----------|----------------|--------|
| AEK-11 | Create GraphQL endpoint wrapper over Prisma for Knowledge Graph querying | Platform | 9 | 5 | 8 | 10 | None | 4h | 6.8 | **COMPLETE** |
| AEK-12 | Implement Redis Cache layer for high-read endpoints (`/api/knowledge`) | Performance | 8 | 3 | 5 | 7 | ioredis | 2h | 6.5 | **COMPLETE** |
| AEK-13 | Automated AI embedding generation (Cohere pipeline) on Entity creation | AI | 10 | 6 | 7 | 10 | pgvector | 3h | 6.2 | BLOCKED |
| AEK-14 | Docker Compose multi-stage build optimization for CI/CD | DevOps | 7 | 4 | 4 | 8 | None | 2h | 6.0 | **COMPLETE** |
| AEK-15 | Enforce strict TypeScript `strictNullChecks` across backend | Technical Debt | 6 | 2 | 7 | 6 | None | 3h | 5.5 | **COMPLETE** |
| AEK-16 | Implement Zod schema validation for all query parameters and pagination offsets | API / Security | 8 | 3 | 6 | 8 | None | 2h | 7.5 | **COMPLETE** |
| AEK-17 | Create automated database seeding pipeline for CI/CD environments | DevOps | 8 | 2 | 5 | 8 | None | 3h | 7.0 | **COMPLETE** |
| AEK-18 | Enhance Dashboard accessibility with focus traps and keyboard navigation on complex modals | Accessibility | 7 | 2 | 6 | 8 | None | 3h | 6.8 | **COMPLETE** |
| AEK-19 | Implement structured JSON logging using Pino for better DataDog/Sentry APM parsing | Observability | 7 | 2 | 5 | 7 | None | 2h | 6.5 | **COMPLETE** |
| AEK-20 | Audit and optimize PostgreSQL indexes for Knowledge Graph relational queries | Database | 9 | 5 | 7 | 9 | None | 4h | 6.4 | **COMPLETE** |
| AEK-21 | Implement strict Content Security Policy (CSP) headers in Next.js | Security | 8 | 4 | 5 | 8 | None | 2h | 7.0 | **COMPLETE** |
| AEK-22 | Enforce Apollo GraphQL query depth limiting to prevent DoS | API / Security | 9 | 3 | 4 | 7 | graphql-depth-limit | 2h | 6.8 | **COMPLETE** |
| AEK-23 | Implement automated `supertest` regression tests for Knowledge endpoints | Testing / QA | 8 | 2 | 6 | 7 | None | 3h | 6.5 | **COMPLETE** |
| AEK-24 | Add comprehensive `loading.tsx` and `error.tsx` App Router fallbacks | UX / Frontend | 7 | 1 | 5 | 8 | None | 3h | 6.3 | **COMPLETE** |
| AEK-25 | Enforce strict import paths & cleanup via `eslint-plugin-unused-imports` | Technical Debt | 6 | 2 | 5 | 6 | None | 2h | 6.0 | **COMPLETE** |
| AEK-26 | Implement strict Cross-Origin Resource Sharing (CORS) origin whitelisting in Express | Security | 9 | 2 | 3 | 8 | None | 1h | 7.5 | **COMPLETE** |
| AEK-27 | Integrate Sentry Node Profiling (`@sentry/profiling-node`) for performance bottleneck tracing | Observability | 8 | 1 | 4 | 7 | None | 1h | 7.0 | **IN PROGRESS** |
| AEK-28 | Integrate automated Swagger/OpenAPI documentation generation for REST endpoints | DX / API | 8 | 2 | 6 | 8 | None | 3h | 6.8 | **COMPLETE** |
| AEK-29 | Secure Helmet configuration with HSTS and DNS prefetch controls | Security | 7 | 1 | 3 | 7 | None | 1h | 6.5 | **COMPLETE** |
| AEK-30 | Create unified API response formatter middleware to guarantee standard JSON structure | Technical Debt | 7 | 3 | 5 | 7 | None | 2h | 6.2 | **COMPLETE** |
| AEK-31 | Add structured global process error handlers (`uncaughtException`, `unhandledRejection`) | Observability | 8 | 1 | 3 | 8 | None | 1h | 7.0 | **COMPLETE** |
| AEK-32 | Implement Redis-based response caching for the Knowledge APIs | Performance | 9 | 4 | 5 | 8 | None | 3h | 7.2 | **COMPLETE** |
| AEK-33 | Enforce strict schema stripping (`.strict()`) in backend Zod body validation | Security | 8 | 2 | 4 | 7 | None | 2h | 6.5 | **COMPLETE** |
| AEK-34 | Implement graceful shutdown in Node.js to safely close Prisma and Express connections | DevOps | 7 | 2 | 4 | 8 | None | 2h | 6.8 | **COMPLETE** |
| AEK-35 | Refactor backend Dockerfile to use an unprivileged `node` user for container security | Security | 8 | 1 | 3 | 7 | None | 1h | 6.5 | **COMPLETE** |
| AEK-36 | Enable explicit Prisma query duration logging to detect slow queries (N+1) | Observability | 8 | 1 | 4 | 7 | None | 1h | 6.8 | **COMPLETE** |
| AEK-37 | Configure standard pre-commit hooks using `husky` & `lint-staged` for frontend | DX / Tooling | 7 | 2 | 5 | 8 | None | 1h | 6.5 | **COMPLETE** |
| AEK-38 | Implement dynamic Next.js Metadata API for Knowledge Graph detail pages (SEO) | SEO / UX | 8 | 3 | 5 | 8 | None | 3h | 6.8 | **COMPLETE** |
| AEK-39 | Enable native Node.js clustering (`cluster` module) for Express on production | Performance | 8 | 2 | 4 | 7 | None | 2h | 6.5 | **COMPLETE** |
| AEK-40 | Remove legacy `any` types from global custom utility types | Technical Debt | 6 | 4 | 4 | 6 | None | 3h | 5.8 | **COMPLETE** |
| AEK-41 | Implement `next/font/google` in frontend root layout for zero-CLS typography | Performance | 9 | 2 | 3 | 8 | None | 1h | 7.2 | **COMPLETE** |
| AEK-42 | Implement dedicated GraphQL rate limiting middleware for Apollo server | Security | 8 | 3 | 4 | 7 | None | 2h | 6.8 | **COMPLETE** |
| AEK-43 | Add `docker-compose.prod.yml` configuring Nginx as a reverse proxy | DevOps | 7 | 2 | 4 | 8 | None | 2h | 6.5 | **COMPLETE** |
| AEK-44 | Configure Prisma client connection pooling parameters for massive scale | Architecture | 8 | 1 | 2 | 9 | None | 1h | 7.0 | **COMPLETE** |
| AEK-45 | Create dedicated Kubernetes liveness/readiness probe routes (`/health/*`) | Observability | 7 | 1 | 3 | 8 | None | 1h | 6.5 | **COMPLETE** |

---
**Cycle 9 Complete.**

# AEK Dynamic Backlog (Cycle 10: Master Artisans UI Module)

| ID | Description | Category | Impact | Risk | Effort | Institutional Value | Dependencies | Est. Time | Priority Score | Status |
|----|-------------|----------|--------|------|--------|---------------------|--------------|-----------|----------------|--------|
| AEK-46 | Add 'Master Artisans' Mega Menu to Global Header | UX / Frontend | 9 | 3 | 4 | 9 | None | 2h | 8.5 | **COMPLETE** |
| AEK-47 | Develop shared reusable UI components for Master Artisans module | UX / Frontend | 8 | 2 | 6 | 8 | None | 3h | 8.0 | **COMPLETE** |
| AEK-48 | Implement Master Artisans Landing Page (`/master-artisans`) | UX / Frontend | 10 | 3 | 8 | 10 | AEK-47 | 4h | 8.2 | **COMPLETE** |
| AEK-49 | Implement Artisan Directory and Detail Profile Pages | UX / Frontend | 9 | 4 | 7 | 9 | AEK-47 | 4h | 8.1 | **COMPLETE** |
| AEK-50 | Implement Studio, Collections, and Story Editorial Pages | UX / Frontend | 9 | 4 | 7 | 9 | AEK-47 | 4h | 8.1 | **COMPLETE** |
| AEK-51 | Implement Nomination Form and comprehensive SEO schemas | SEO / UX | 8 | 3 | 5 | 8 | None | 3h | 7.5 | **COMPLETE** |
| AEK-52 | Finalize Studio and Collections aux pages | UX / Frontend | 8 | 2 | 5 | 8 | None | 2h | 7.5 | **COMPLETE** |
| AEK-53 | Verify frontend build compilation | QA / CI | 9 | 1 | 3 | 9 | None | 1h | 8.0 | **COMPLETE** |
| AEK-54 | Integrate Prisma ORM queries to replace mock data | Database / API | 9 | 4 | 6 | 9 | None | 3h | 8.5 | **COMPLETE** |
| AEK-55 | Implement backend API endpoints /api/v1/artisans | API / Backend | 9 | 3 | 5 | 9 | None | 2h | 8.5 | **COMPLETE** |
| AEK-56 | Update docs/HERA/AEK_Dynamic_Backlog.md and complete Cycle 10 | PM / Ops | 7 | 1 | 2 | 7 | None | 1h | 7.0 | **COMPLETE** |

---
**Cycle 10 Complete.**

# AEK Dynamic Backlog (Cycle 11: Institutional Heritage Operating System)

| ID | Description | Category | Impact | Risk | Effort | Institutional Value | Dependencies | Est. Time | Priority Score | Status |
|----|-------------|----------|--------|------|--------|---------------------|--------------|-----------|----------------|--------|
| AEK-57 | Universal Institutional CMS (Manage all People, Knowledge, Heritage, Media entities) | CMS / Full Stack | 10 | 4 | 9 | 10 | None | 6h | 9.5 | **COMPLETE** |
| AEK-58 | Universal Media Service (Centralized multi-format media ingestion & metadata tagging) | Storage / API | 9 | 3 | 7 | 9 | None | 4h | 9.0 | **COMPLETE** |
| AEK-59 | Visual Relationship Builder (UI for linking entities without SQL/Foreign Keys) | CMS / Database | 10 | 5 | 8 | 10 | AEK-57 | 5h | 9.2 | **COMPLETE** |
| AEK-60 | Universal Search (Cross-entity indexed search with advanced filters) | Search / API | 9 | 4 | 7 | 9 | None | 4h | 8.8 | **COMPLETE** |
| AEK-61 | Knowledge Health Dashboard (Score, verify, and identify missing metadata across entities) | Analytics / CMS | 9 | 2 | 6 | 10 | AEK-57, AEK-59 | 4h | 9.0 | **COMPLETE** |

| AEK-62 | Institutional Participation Workflows (Nominate, Story, Contributor, Support Docs) | Frontend/Backend | 10 | 1 | 9 | 10 | None | 5h | 9.5 | **COMPLETE** |
