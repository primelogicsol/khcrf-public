# Release Manifest — v2026.07-skc-classification-certified

> This document is the authoritative release record for the SKC Classification subsystem.
> It must be updated at each deployment and retained for the full lifetime of the system.

---

## 1 — Release Identity

| Field | Value |
|-------|-------|
| Release tag | `v2026.07-skc-production-ready` |
| Release name | SKC Data Provenance Classification — Production Ready Release |
| Subsystem | SKC Classification (`/api/admin/skc/classification`) |
| Release series | 2026.07 |
| Certification date | 2026-07-29 |
| Manifest version | 1.0 |

---

## 2 — Git Coordinates

| Field | Value |
|-------|-------|
| Commit SHA (full) | `3275d300e84b807ebfe9b0b115654df3a35e46be` |
| Commit SHA (short) | `3275d30` |
| Branch at tag | `main` |
| Tag type | Annotated (`git tag -a`) |
| Tag message | Includes certification summary, migration ID, and migration checksum |
| Preceding commit | `4e1b8a9` — P4 certification baseline |
| Repository | `primelogicsol/hcr_foundation_full_govind` |

---

## 3 — Schema and Migration

| Field | Value |
|-------|-------|
| Migration ID | `20260729021810_skc_provenance` |
| Migration SHA-256 | `279411D1E97F0D722A83F112EDDC6AC6E311302491AB350C2A79187574A326E7` |
| ORM | Prisma 5 |
| Schema file lines | 4,442 |
| Models introduced | `SkcDataClassificationAudit` |
| Enums introduced | `DataProvenance`, `RecordSourceSystem`, `SkcClassifiedEntityType` |
| Indexes | `@unique idempotencyKey` · `@index batchId` · `@index classifiedById` · `@index classifiedAt` |
| Backfill applied | Legacy records → `DataProvenance.UNKNOWN`, `RecordSourceSystem.LEGACY_IMPORT` |
| Destructive changes | None — additive migration only |
| Rollback migration | Not available (additive; safe to leave in place on rollback) |

---

## 4 — Backend Build

| Field | Value |
|-------|-------|
| Runtime | Node.js 20.x |
| Framework | Express 4 |
| Language | TypeScript 5.x |
| `tsc --noEmit` | ✅ exit 0 |
| Entry point | `backend/src/index.ts` |
| Docker image tag | `hcrf-backend:4e1b8a9` |
| Certified source files | `skcClassification.validator.ts` |
| | `skcClassification.repository.ts` |
| | `skcClassification.service.ts` |
| | `skcClassification.controller.ts` |
| `routes/admin/skcClassification.routes.ts` | |
| | `skcMetrics.repository.ts` |

---

## 5 — Frontend Build

| Field | Value |
|-------|-------|
| Framework | Next.js 16.1.1 / Turbopack |
| `npm run build` | ✅ exit 0 |
| Pages compiled | 316 |
| New routes | `/dashboard/skc/classification` |
| | `/dashboard/skc/classification/history` |
| Access control | `allowedRoles: [ROLES.ADMIN]` on both routes |
| Docker image tag | `hcrf-frontend:4e1b8a9` |

---

## 6 — Test Certification

| Suite | Tests | Result | File |
|-------|-------|--------|------|
| P4 End-to-End Certification | 38 / 38 | ✅ PASS | `skcClassification.p4.cert.test.ts` |
| Service Unit Tests | 8 / 8 | ✅ PASS | `skcClassification.service.test.ts` |
| Metrics Integration (P2) | 3 / 3 | ✅ PASS | `skcMetrics.integration.test.ts` |
| **Total** | **49 / 49** | **✅ PASS** | |

Certification report: `P4_CERTIFICATION_REPORT.md` (versioned at commit `4e1b8a9`)

---

## 7 — CI Gate

| Workflow | File | Jobs |
|----------|------|------|
| SKC Classification Regression Gate | `.github/workflows/skc-classification-regression-gate.yml` | 4 |

Jobs:
1. `backend-quality` — typecheck + lint + service unit tests (every PR)
2. `frontend-build` — typecheck + production build (every PR)
3. `integration-tests` — P2 metrics consistency (push to main or `run-integration` label)
4. `p4-certification` — full 38-test suite (push to main or `run-p4` label)

---

## 8 — API Surface (Certified Endpoints)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/admin/skc/classification/queue` | ADMIN | Paginated unclassified record queue |
| `POST` | `/api/admin/skc/classification/preview` | ADMIN | Generate state-fingerprint token |
| `PATCH` | `/api/admin/skc/classification` | ADMIN | Confirm classification batch |
| `GET` | `/api/admin/skc/classification/history` | ADMIN | Immutable audit log |

All endpoints enforce: JWT cookie auth → session DB check → `isVerified` → `role === ADMIN`.  
`actorId` is derived exclusively from the session token — never accepted from the request body.

---

## 9 — Deployment Record

> Complete this section at each production deployment.

| Field | Value |
|-------|-------|
| Deployment date | *(to be completed)* |
| Deployed by | *(to be completed)* |
| Target environment | *(production / staging)* |
| Deployment method | *(Docker / direct / CI pipeline)* |
| Migration applied at | *(timestamp)* |
| Migration applied by | *(to be completed)* |
| `prisma migrate status` output | *(paste or attach)* |
| Health check result | *(URL and response)* |
| Startup log errors | *(none / list)* |
| Smoke test result | *(pass / fail — see Section 11)* |
| Rollback target | `274399a` — `chore(master-artisans): type public editorial API responses` |
| Rollback procedure | See Section 12 |

---

## 10 — Environment Variable Checklist

Verify these variables are set identically in staging and production before deploying.

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Must match issuing service; rotation requires re-login |
| `JWT_EXPIRES_IN` | ✅ | Token TTL |
| `NODE_ENV` | ✅ | Must be `production` in production |
| `PORT` | optional | Defaults to 3001 |
| `NEXT_PUBLIC_API_URL` | ✅ | Frontend API base URL |

> **Drift warning:** A staging `JWT_SECRET` carried into production will cause all staging-issued tokens to validate in production. Verify secrets are environment-specific.

---

## 11 — Post-Deployment Smoke Tests

Run after every production deployment. Record pass/fail and timestamp.

| # | Test | Expected | Result |
|---|------|----------|--------|
| 1 | `GET /health` | 200 `{ status: "ok" }` | |
| 2 | `GET /api/admin/skc/classification/queue` (no cookie) | 401 | |
| 3 | `GET /api/admin/skc/classification/queue` (non-admin) | 403 | |
| 4 | `GET /api/admin/skc/classification/queue` (admin) | 200 with queue payload | |
| 5 | `POST /api/admin/skc/classification/preview` (valid payload) | 200 with `previewToken` | |
| 6 | `PATCH /api/admin/skc/classification` (with valid token) | 200 with `classifiedCount` | |
| 7 | Verify audit row created in DB | `SELECT COUNT(*) FROM "SkcDataClassificationAudit"` increments | |
| 8 | `GET /api/admin/skc/classification/history` | 200 with audit record | |
| 9 | Dashboard route `/dashboard/skc/classification` renders | 200 (browser) | |
| 10 | History route `/dashboard/skc/classification/history` renders | 200 (browser) | |

---

## 12 — Rollback Procedure

> Use only if smoke tests fail and the failure cannot be resolved by a hotfix.

```bash
# 1. Stop the application
docker stop hcrf-backend hcrf-frontend

# 2. Roll back to the previous commit
git checkout 274399a

# 3. Rebuild and restart at the rollback target
docker build -t hcrf-backend:rollback ./backend
docker build -t hcrf-frontend:rollback ./frontend
docker start hcrf-backend hcrf-frontend

# 4. The skc_provenance migration is additive and safe to leave applied.
#    If the migration MUST be reverted (data corruption only):
#    Contact the DBA — there is no automatic down migration.
#    Manual steps required: DROP TABLE "SkcDataClassificationAudit";
#    DROP TYPE "DataProvenance"; DROP TYPE "RecordSourceSystem";
#    DROP TYPE "SkcClassifiedEntityType";
```

> ⚠️ **Do not roll back the migration unless audit data is corrupt.** The schema additions are additive and backward-compatible with the previous application version.

---

## 13 — Future Release Checklist

For each future release that modifies the SKC Classification subsystem, the following must be completed before merging to `main`:

- [ ] All P4 certification tests pass (38/38)
- [ ] `tsc --noEmit` exits 0
- [ ] Frontend production build exits 0
- [ ] New migration has a unique ID and verified checksum
- [ ] This manifest is updated with new Git SHA, tag, and migration details
- [ ] P4_CERTIFICATION_REPORT.md is updated or a new report is issued
- [ ] CI regression gate passes on the target branch
- [ ] Deployment record (Section 9) is completed after deployment
- [ ] Smoke tests (Section 11) are recorded after deployment

---

*Manifest maintained by: Engineering Team*  
*Document format version: 1.0*  
*Next review: At next certified release or 90 days, whichever comes first*
