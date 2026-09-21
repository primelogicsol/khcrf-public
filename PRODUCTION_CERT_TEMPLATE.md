# PRODUCTION CERTIFICATION — SKC CLASSIFICATION SUBSYSTEM — {DATE}

> **Instructions for the deployment operator:**
> Fill in every field marked `___________` or `{PLACEHOLDER}`.
> Check every checkbox. Do not leave any field blank.
> This document is the authoritative production certification record.
> It must be retained for the full operational lifetime of the subsystem.

---

## Status

```
CERTIFICATION STATUS:   [ ] PENDING     [ ] CERTIFIED     [ ] FAILED
```

---

## Section 1 — Deployment Identity

| Field | Value |
|---|---|
| **Subsystem** | SKC Classification (Data Provenance Tracking) |
| **Production Deployment Tag** | `v2026.07-skc-production-ready` |
| **Production Deployment SHA** | `3275d30` |
| **P4 Certification Baseline** | `4e1b8a9` |
| **Deployment Date** | ___________ (YYYY-MM-DD) |
| **Deployment Time** | ___________ (HH:MM ± UTC offset) |
| **Deployment Window** | ___________ (e.g., 02:00–04:00 UTC) |
| **Environment** | Production |
| **Operator Name** | ___________ |
| **Operator Email** | ___________ |
| **Approver Name** | ___________ |
| **Approver Email** | ___________ |
| **Incident Ticket (if any)** | ___________ or `None` |

---

## Section 2 — Pre-Deployment Evidence

> **Reference:** Run `.\scripts\pre-deployment-evidence.ps1` before deploying.
> Attach the generated `pre-deployment-evidence-{timestamp}.txt` file to this record.

### 2.1 Git State Before Deployment

| Field | Value |
|---|---|
| **SHA before deployment (HEAD)** | ___________ |
| **Branch before deployment** | ___________ |
| **Target SHA** | `3275d30` |

### 2.2 Database Backup

| Field | Value |
|---|---|
| **Backup Identifier** | ___________ |
| **Backup Timestamp** | ___________ |
| **Backup Tool / Method** | ___________ (e.g., pg_dump, RDS snapshot) |
| **Backup Verified Restorable** | `[ ] Yes   [ ] No` |
| **Backup Confirmed Before Migration** | `[ ] Yes   [ ] No` |

### 2.3 Migration State Before Deployment

Paste the output of `npx prisma migrate status` (run from `backend/`) here:

```
{PASTE OUTPUT OF: npx prisma migrate status — BEFORE DEPLOYMENT}
```

- Migration `20260729021810_skc_provenance` shown as **pending**: `[ ] Yes   [ ] No`

### 2.4 Environment Variable Validation

Confirm each variable is correctly set on the production host:

| Variable | Present & Correct |
|---|---|
| `DATABASE_URL` | `[ ] Y   [ ] N` |
| `JWT_SECRET` | `[ ] Y   [ ] N` |
| `JWT_EXPIRES_IN` | `[ ] Y   [ ] N` |
| `NODE_ENV` | `[ ] Y   [ ] N` — value: ___________ (expected: `production`) |
| `PORT` | `[ ] Y   [ ] N` — value: ___________ |
| `NEXT_PUBLIC_API_URL` | `[ ] Y   [ ] N` — value: ___________ |

---

## Section 3 — Migration Execution

### 3.1 Commands Run

Record the exact commands executed, in order:

```
{EXACT COMMANDS RUN — e.g.:
  cd /app/backend
  npx prisma migrate deploy
}
```

### 3.2 Prisma Migrate Status — BEFORE

```
{PASTE OUTPUT OF: npx prisma migrate status — BEFORE npx prisma migrate deploy}
```

### 3.3 Prisma Migrate Deploy — Output

```
{PASTE FULL OUTPUT OF: npx prisma migrate deploy}
```

### 3.4 Prisma Migrate Status — AFTER

```
{PASTE OUTPUT OF: npx prisma migrate status — AFTER npx prisma migrate deploy}
```

### 3.5 Migration Result

| Check | Result |
|---|---|
| Migration `20260729021810_skc_provenance` shown as **applied** | `[ ] Yes   [ ] No` |
| `finished_at` is NOT NULL (from Query 1 in Section 6) | `[ ] Yes   [ ] No` |
| No errors in deploy output | `[ ] Yes   [ ] No` |
| Total migrations applied matches expected count | `[ ] Yes   [ ] No` |

---

## Section 4 — Application Startup Validation

### 4.1 Startup Times

| Component | Start Time | Notes |
|---|---|---|
| **Backend (Node/Express)** | ___________ | ___________ |
| **Frontend (Next.js)** | ___________ | ___________ |

### 4.2 Health Check

| Field | Value |
|---|---|
| **Health Check URL** | ___________ (e.g., `https://hcrf.example.com/api/health`) |
| **HTTP Response Code** | ___________ (expected: `200`) |
| **Response Body** | ___________ (e.g., `{"status":"ok"}`) |

### 4.3 Startup Log Review

| Check | Result |
|---|---|
| Errors present in backend startup logs | `[ ] Yes   [ ] No` |
| Errors present in frontend startup logs | `[ ] Yes   [ ] No` |
| Migration mismatch warning logged | `[ ] Yes   [ ] No` |
| Auth middleware failure logged | `[ ] Yes   [ ] No` |
| Prisma client generated successfully | `[ ] Yes   [ ] No` |

> **If any item above is `Yes`:** Describe the issue and resolution in Section 9 (Incidents and Deviations).

---

## Section 5 — Smoke Test Results

> **Reference:** Run `.\scripts\production-smoke-test.ps1 -BaseUrl <URL> -TestRecordId <ID>`
> Attach the generated `smoke-test-results-{timestamp}.txt` file to this record.

**Smoke test results file:** `smoke-test-results-{timestamp}.txt`
**Smoke test run timestamp:** ___________
**Test Record ID used:** ___________

| # | Test Name | Expected | Actual Status | Result | Notes |
|---|---|---|---|---|---|
| 01 | Anonymous GET `/api/admin/skc/classification/queue` | `401 Unauthorized` | ___ | `[ ] PASS  [ ] FAIL` | ___________ |
| 02 | Non-admin GET `/api/admin/skc/classification/queue` | `403 Forbidden` | ___ | `[ ] PASS  [ ] FAIL` | ___________ |
| 03 | Admin GET `/api/admin/skc/classification/queue` | `200` with `records` | ___ | `[ ] PASS  [ ] FAIL` | ___________ |
| 04 | Admin GET queue with `provenance=UNKNOWN` filter | `200 OK` | ___ | `[ ] PASS  [ ] FAIL` | ___________ |
| 05 | Admin POST `/api/admin/skc/classification/preview` | `200` with `previewToken` | ___ | `[ ] PASS  [ ] FAIL` | ___________ |
| 06 | Admin PATCH `/api/admin/skc/classification` (first) | `200` with `classifiedCount >= 0` | ___ | `[ ] PASS  [ ] FAIL` | ___________ |
| 07 | GET classification history for test record | `200` with `>= 1` record | ___ | `[ ] PASS  [ ] FAIL` | ___________ |
| 08 | Repeat PATCH with same `idempotencyKey` | `200` with `idempotent: true` | ___ | `[ ] PASS  [ ] FAIL` | ___________ |
| 09 | Preview `PRODUCTION→PRODUCTION` transition | `200` with `blockedCount = 1` | ___ | `[ ] PASS  [ ] FAIL` | ___________ |
| 10 | Admin GET classification history (no filter) | `200` with `total > 0` | ___ | `[ ] PASS  [ ] FAIL` | ___________ |

**Total Passed:** ___ / 10
**All 10 tests passed:** `[ ] Yes   [ ] No`

> **If any test failed:** Describe in Section 9 before certifying.

---

## Section 6 — Database Reconciliation

> **Reference:** Run all queries in `scripts/post-deployment-reconciliation.sql`.
> Replace `{SMOKE_TEST_BATCH_ID}` and `{SMOKE_TEST_RECORD_ID}` before running.

**Smoke Test Batch ID (from Test 06 response):** ___________

### Query 1 — Migration Applied Check

```sql
SELECT id, checksum, finished_at FROM _prisma_migrations
WHERE migration_name = '20260729021810_skc_provenance';
```

| Field | Expected | Actual |
|---|---|---|
| Row count | `1` | ___________ |
| `finished_at` | NOT NULL | ___________ |
| Result | PASS | `[ ] PASS   [ ] FAIL` |

### Query 2 — Audit Row Count for Smoke Test Batch

```sql
SELECT COUNT(*) FROM "SkcDataClassificationAudit"
WHERE "batchId" = '{SMOKE_TEST_BATCH_ID}';
```

| Field | Expected | Actual |
|---|---|---|
| `COUNT(*)` | `1` | ___________ |
| Result | PASS | `[ ] PASS   [ ] FAIL` |

### Query 3 — Duplicate Idempotency Key Check

```sql
SELECT "idempotencyKey", COUNT(*) FROM "SkcDataClassificationAudit"
GROUP BY "idempotencyKey" HAVING COUNT(*) > 1;
```

| Field | Expected | Actual |
|---|---|---|
| Rows returned | `0 rows` | ___________ |
| Result | PASS | `[ ] PASS   [ ] FAIL` |

### Query 4 — Orphan Audit Row Check

```sql
SELECT COUNT(*) AS orphan_count FROM "SkcDataClassificationAudit" a
WHERE NOT EXISTS (SELECT 1 FROM "SkcStakeholderRegistration" s WHERE s.id = a."recordId")
  AND NOT EXISTS (SELECT 1 FROM "SkcInstitutionRegistration" i WHERE i.id = a."recordId")
  AND NOT EXISTS (SELECT 1 FROM "SkcHearing" h WHERE h.id = a."recordId");
```

| Field | Expected | Actual |
|---|---|---|
| `orphan_count` | `0` | ___________ |
| Result | PASS | `[ ] PASS   [ ] FAIL` |

### Query 5 — Test Record Provenance Verification

```sql
SELECT id, "dataProvenance", "updatedAt"
FROM "SkcStakeholderRegistration"
WHERE id = '{SMOKE_TEST_RECORD_ID}';
```

| Field | Expected | Actual |
|---|---|---|
| `dataProvenance` | `PRODUCTION` | ___________ |
| `updatedAt` | Recent (within 1 hr) | ___________ |
| Result | PASS | `[ ] PASS   [ ] FAIL` |

### Query 6 — No Unrelated Records Modified

```sql
SELECT COUNT(*) FROM "SkcStakeholderRegistration"
WHERE "updatedAt" >= NOW() - INTERVAL '1 hour'
  AND id != '{SMOKE_TEST_RECORD_ID}';
```

| Field | Expected | Actual |
|---|---|---|
| `COUNT(*)` | `0` | ___________ |
| Result | PASS | `[ ] PASS   [ ] FAIL` |

> If COUNT > 0, list modified IDs and justification: ___________

### Query 7 — classifiedById Not Null for Smoke Test Audit

```sql
SELECT "classifiedById", "classifiedAt", "reason"
FROM "SkcDataClassificationAudit"
WHERE "batchId" = '{SMOKE_TEST_BATCH_ID}';
```

| Field | Expected | Actual |
|---|---|---|
| `classifiedById` | NOT NULL | ___________ |
| `reason` | `Production deployment smoke test - authorized test record` | ___________ |
| Result | PASS | `[ ] PASS   [ ] FAIL` |

**All 7 reconciliation queries passed:** `[ ] Yes   [ ] No`

---

## Section 7 — Observability Verification

### 7.1 Structured JSON Logging

| Check | Result |
|---|---|
| `classificationLogger` emits structured JSON logs | `[ ] Confirmed   [ ] Not Confirmed` |
| Log output verified in production log stream | `[ ] Yes   [ ] No` |

### 7.2 Fields Verified Present in Logs

Confirm the following fields are present in classification log entries:

| Log Field | Present |
|---|---|
| `timestamp` | `[ ] Y   [ ] N` |
| `level` | `[ ] Y   [ ] N` |
| `event` (or equivalent action name) | `[ ] Y   [ ] N` |
| `batchId` | `[ ] Y   [ ] N` |
| `classifiedById` | `[ ] Y   [ ] N` |
| `classifiedCount` | `[ ] Y   [ ] N` |
| `entityType` | `[ ] Y   [ ] N` |
| `targetProvenance` | `[ ] Y   [ ] N` |
| `idempotencyKey` | `[ ] Y   [ ] N` |
| `durationMs` (or equivalent timing) | `[ ] Y   [ ] N` |

### 7.3 Sensitive Field Exclusion

Confirm the following sensitive data does **NOT** appear in any log output:

| Sensitive Field | Absent from Logs |
|---|---|
| JWT tokens (access or refresh) | `[ ] Confirmed   [ ] NOT Confirmed` |
| Authorization headers | `[ ] Confirmed   [ ] NOT Confirmed` |
| Raw request bodies (unfiltered) | `[ ] Confirmed   [ ] NOT Confirmed` |
| PII (names, emails, phone numbers) | `[ ] Confirmed   [ ] NOT Confirmed` |
| Database connection strings | `[ ] Confirmed   [ ] NOT Confirmed` |
| Session cookies or secrets | `[ ] Confirmed   [ ] NOT Confirmed` |

**Notes / log sample reference:** ___________

> **If any sensitive field was found in logs:** Record in Section 9 and do NOT certify until resolved.

---

## Section 8 — Rollback Readiness

| Field | Value |
|---|---|
| **Rollback Target Tag** | `v2026.07-skc-classification-certified` |
| **Rollback Target SHA** | `4e1b8a9` |
| **Rollback Command (application)** | `git checkout v2026.07-skc-classification-certified` |
| **Rollback Command (migration)** | `npx prisma migrate resolve --rolled-back 20260729021810_skc_provenance` |
| **Rollback Command (data)** | Restore from backup ID recorded in Section 2.2 |

| Check | Result |
|---|---|
| Rollback procedure tested in **staging** before this deployment | `[ ] Yes   [ ] No` |
| Database migration rollback tested in staging | `[ ] Yes   [ ] No` |
| Backup restoration tested in staging | `[ ] Yes   [ ] No` |
| Rollback runbook available and linked | `[ ] Yes   [ ] No` — Link: ___________ |
| **Estimated rollback time** | ___________ minutes |

> **Rollback Decision Authority:** The operator may initiate rollback immediately if:
> - Any smoke test fails and cannot be resolved within the deployment window.
> - The migration fails partway through.
> - Health checks do not pass within 5 minutes of deployment.
>
> Rollback does not require additional approval if initiated within the deployment window.

---

## Section 9 — Incidents and Deviations

> Record any issue, unexpected behaviour, deviation from the expected procedure,
> or any smoke test / reconciliation failure encountered during this deployment.
> If there were no incidents, write **None** in the table below.

| # | Description | Resolution | Impact | Status |
|---|---|---|---|---|
| — | None | — | None | — |

---

## Section 10 — Final Authorization

### Declaration

> I confirm that all sections of this document have been completed, all smoke
> tests passed, database reconciliation was verified, and observability is
> functioning. I authorize this deployment as production-certified.

### Operator

| Field | Value |
|---|---|
| **Operator Name** | ___________ |
| **Operator Signature / Credential** | ___________ |
| **Certification Date & Time** | ___________ |

### Approver

| Field | Value |
|---|---|
| **Approver Name** | ___________ |
| **Approver Signature / Credential** | ___________ |
| **Approval Date & Time** | ___________ |

### Final Status

```
CERTIFICATION STATUS:   [ ] CERTIFIED       [ ] NOT CERTIFIED
```

---

> [!IMPORTANT]
> **Retention Policy:** This document must be retained for the full operational
> lifetime of the SKC Classification subsystem and referenced in all future
> release manifests for this subsystem. Store a copy alongside the
> `pre-deployment-evidence-{timestamp}.txt` and `smoke-test-results-{timestamp}.txt`
> files in the project audit archive.

---

*HCR Foundation — SKC Classification Subsystem — Production Certification Template*
*Release: v2026.07-skc-classification-certified | Commit: 4e1b8a9*
*Migration: 20260729021810_skc_provenance*
