-- =============================================================================
--  HCR FOUNDATION — SKC CLASSIFICATION SUBSYSTEM
--  POST-DEPLOYMENT RECONCILIATION QUERIES
--  Migration: 20260729021810_skc_provenance
--  Release:   v2026.07-skc-classification-certified (commit 4e1b8a9)
-- =============================================================================
--
--  INSTRUCTIONS
--  ─────────────
--  Run each query in sequence after smoke tests complete.
--  Record the result of each query in PRODUCTION_CERT_TEMPLATE.md
--  Section 6 — Database Reconciliation.
--
--  Replace all placeholder tokens before running:
--    {SMOKE_TEST_BATCH_ID}  — the batchId from your smoke test PATCH response
--                             (visible in smoke-test-results-{timestamp}.txt)
--    {SMOKE_TEST_RECORD_ID} — the TestRecordId used in the smoke test
--
--  These queries are READ-ONLY (SELECT statements) and are safe to run
--  against production. They do NOT modify any data.
-- =============================================================================


-- =============================================================================
-- QUERY 1 — Migration Applied Check
-- =============================================================================
-- Purpose  : Confirm that migration 20260729021810_skc_provenance was applied
--            successfully by Prisma migrate deploy.
-- Expected : Exactly 1 row, with finished_at IS NOT NULL (not null means
--            the migration completed without error).
-- Action   : If 0 rows → migration was not applied. Run npx prisma migrate deploy.
--            If finished_at IS NULL → migration started but did not complete.
--              Investigate Prisma logs before proceeding.
-- =============================================================================

SELECT
    id,
    checksum,
    finished_at,
    started_at,
    applied_steps_count,
    logs
FROM _prisma_migrations
WHERE migration_name = '20260729021810_skc_provenance';

-- Expected result:
--   Row count   : 1
--   finished_at : NOT NULL (timestamp of when the migration finished)
-- ─────────────────────────────────────────────────────────────────────────────


-- =============================================================================
-- QUERY 2 — Audit Row Count for Smoke Test Batch
-- =============================================================================
-- Purpose  : Confirm that the smoke test PATCH created exactly one audit row
--            under the expected batchId.
-- Replace  : {SMOKE_TEST_BATCH_ID} with the batchId from the smoke test response.
-- Expected : COUNT(*) = 1
-- Action   : If COUNT > 1 → investigate duplicate batchId (should not happen).
--            If COUNT = 0 → the smoke test PATCH may not have written an audit row.
-- =============================================================================

SELECT COUNT(*) AS audit_row_count
FROM "SkcDataClassificationAudit"
WHERE "batchId" = '{SMOKE_TEST_BATCH_ID}';

-- Expected result:
--   audit_row_count : 1
-- ─────────────────────────────────────────────────────────────────────────────


-- =============================================================================
-- QUERY 3 — Duplicate Idempotency Key Check
-- =============================================================================
-- Purpose  : Verify the idempotencyKey unique constraint is enforced — no two
--            audit rows should share the same idempotencyKey.
-- Expected : 0 rows (no duplicates).
-- Action   : If any rows are returned → the unique constraint on idempotencyKey
--            may be missing or bypassed. Halt and investigate immediately.
-- =============================================================================

SELECT
    "idempotencyKey",
    COUNT(*) AS occurrence_count
FROM "SkcDataClassificationAudit"
GROUP BY "idempotencyKey"
HAVING COUNT(*) > 1
ORDER BY occurrence_count DESC;

-- Expected result:
--   0 rows returned (no duplicate idempotency keys)
-- ─────────────────────────────────────────────────────────────────────────────


-- =============================================================================
-- QUERY 4 — Orphan Audit Row Check
-- =============================================================================
-- Purpose  : Identify audit rows whose recordId does not match any known entity
--            table (SkcStakeholderRegistration, SkcInstitutionRegistration,
--            or SkcHearing). Orphan rows indicate a data integrity problem.
-- Expected : orphan_count = 0
-- Action   : If orphan_count > 0 → identify the orphan rows and determine whether
--            the source entity was deleted or the recordId is incorrect.
--            This may indicate a referential integrity gap.
-- =============================================================================

SELECT COUNT(*) AS orphan_count
FROM "SkcDataClassificationAudit" a
WHERE
    NOT EXISTS (
        SELECT 1
        FROM "SkcStakeholderRegistration" s
        WHERE s.id = a."recordId"
    )
    AND NOT EXISTS (
        SELECT 1
        FROM "SkcInstitutionRegistration" i
        WHERE i.id = a."recordId"
    )
    AND NOT EXISTS (
        SELECT 1
        FROM "SkcHearing" h
        WHERE h.id = a."recordId"
    );

-- Expected result:
--   orphan_count : 0
-- ─────────────────────────────────────────────────────────────────────────────


-- =============================================================================
-- QUERY 5 — Test Record Provenance Verification
-- =============================================================================
-- Purpose  : Confirm the smoke test record's dataProvenance was updated to
--            'PRODUCTION' by the smoke test PATCH operation.
-- Replace  : {SMOKE_TEST_RECORD_ID} with the TestRecordId used in smoke tests.
-- Expected : dataProvenance = 'PRODUCTION', updatedAt is recent (within last hour).
-- Action   : If dataProvenance != 'PRODUCTION' → the classification PATCH did not
--            apply correctly. Check smoke test results and API logs.
-- =============================================================================

SELECT
    id,
    "dataProvenance",
    "updatedAt",
    "createdAt"
FROM "SkcStakeholderRegistration"
WHERE id = '{SMOKE_TEST_RECORD_ID}';

-- Expected result:
--   dataProvenance : 'PRODUCTION'
--   updatedAt      : Recent timestamp (within the last hour)
-- ─────────────────────────────────────────────────────────────────────────────


-- =============================================================================
-- QUERY 6 — No Unrelated Records Modified
-- =============================================================================
-- Purpose  : Verify that the smoke test PATCH did not accidentally modify any
--            records other than the designated test record.
-- Replace  : {SMOKE_TEST_RECORD_ID} with the TestRecordId used in smoke tests.
-- Expected : COUNT(*) = 0 (no other records updated in the last hour).
--            If COUNT > 0, document the IDs of modified records and confirm
--            whether those updates are legitimate (e.g. from other operators).
-- =============================================================================

SELECT
    COUNT(*) AS recently_modified_count
FROM "SkcStakeholderRegistration"
WHERE
    "updatedAt" >= NOW() - INTERVAL '1 hour'
    AND id != '{SMOKE_TEST_RECORD_ID}';

-- Expected result:
--   recently_modified_count : 0
--   (If > 0, list modified record IDs and document justification in cert template)
--
-- To inspect any modified records, run:
--   SELECT id, "dataProvenance", "updatedAt"
--   FROM "SkcStakeholderRegistration"
--   WHERE "updatedAt" >= NOW() - INTERVAL '1 hour'
--   AND id != '{SMOKE_TEST_RECORD_ID}'
--   ORDER BY "updatedAt" DESC;
-- ─────────────────────────────────────────────────────────────────────────────


-- =============================================================================
-- QUERY 7 — classifiedById Not Null for Smoke Test Audit
-- =============================================================================
-- Purpose  : Confirm the smoke test audit row records the correct classifiedById
--            (the admin user who ran the smoke test) and the expected reason.
-- Replace  : {SMOKE_TEST_BATCH_ID} with the batchId from the smoke test response.
-- Expected : classifiedById IS NOT NULL
--            reason = 'Production deployment smoke test - authorized test record'
-- Action   : If classifiedById IS NULL → the classification action was not linked
--            to an authenticated user. Investigate auth middleware and audit service.
-- =============================================================================

SELECT
    "batchId",
    "classifiedById",
    "classifiedAt",
    "reason",
    "targetProvenance",
    "entityType",
    "recordId"
FROM "SkcDataClassificationAudit"
WHERE "batchId" = '{SMOKE_TEST_BATCH_ID}';

-- Expected result:
--   classifiedById : NOT NULL (UUID of the admin user)
--   reason         : 'Production deployment smoke test - authorized test record'
--   classifiedAt   : Recent timestamp
-- ─────────────────────────────────────────────────────────────────────────────


-- =============================================================================
-- END OF RECONCILIATION QUERIES
-- =============================================================================
-- Record all results in PRODUCTION_CERT_TEMPLATE.md, Section 6.
-- If all queries return expected results, proceed to Section 7 (Observability).
-- If any query fails expectations, STOP and investigate before certifying.
-- =============================================================================
