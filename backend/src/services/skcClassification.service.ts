import crypto from 'crypto';
import { DataProvenance, SkcClassifiedEntityType } from '@prisma/client';
import {
  SkcClassificationRepository,
  ClassifiableRecord,
} from '../repositories/skcClassification.repository';
import {
  ALLOWED_TRANSITIONS,
  MAX_BATCH_SIZE,
  PreviewBody,
  QueueQuery,
  SubmitBody,
  HistoryQuery,
} from '../validators/skcClassification.validator';

// ────────────────────────────────────────────────────────────────────────────
// Token / Fingerprint utilities
// All cryptographic operations live here — no token logic in controller or repository.
// ────────────────────────────────────────────────────────────────────────────

const PREVIEW_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Build a deterministic preview token that incorporates current record state.
 *
 * The token is a SHA-256 over actorId, entityType, targetProvenance, and the
 * sorted per-record state fingerprint (id + dataProvenance + updatedAt).
 *
 * expiresAt is intentionally excluded from the hash — it is returned as
 * metadata alongside the token but is NOT part of the state integrity check.
 * Including a time-varying value in the hash would make every confirmation
 * fail because expiresAt is computed at a different millisecond each time.
 *
 * State integrity: any change to dataProvenance or updatedAt on any record
 * will produce a different token, which will be rejected at confirmation.
 */
function buildPreviewToken(params: {
  actorId: string;
  entityType: SkcClassifiedEntityType;
  targetProvenance: DataProvenance;
  records: ClassifiableRecord[];
}): string {
  const stateFingerprint = [...params.records]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(r => `${r.id}:${r.dataProvenance}:${r.updatedAt.toISOString()}`);

  const payload = JSON.stringify({
    actorId: params.actorId,
    entityType: params.entityType,
    targetProvenance: params.targetProvenance,
    stateFingerprint,
  });

  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Deterministic payload fingerprint for idempotency.
 * Ties the idempotency key to a specific payload so that reuse with a different
 * payload can be detected.
 */
function buildPayloadFingerprint(params: {
  actorId: string;
  entityType: SkcClassifiedEntityType;
  sortedRecordIds: string[];
  targetProvenance: DataProvenance;
  reason: string;
}): string {
  const payload = JSON.stringify({
    actorId: params.actorId,
    entityType: params.entityType,
    recordIds: params.sortedRecordIds,
    targetProvenance: params.targetProvenance,
    reason: params.reason,
  });
  return crypto.createHash('sha256').update(payload).digest('hex');
}

// ────────────────────────────────────────────────────────────────────────────
// Service errors
// ────────────────────────────────────────────────────────────────────────────

export class ClassificationServiceError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 400
  ) {
    super(message);
    this.name = 'ClassificationServiceError';
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Service
// ────────────────────────────────────────────────────────────────────────────

export class SkcClassificationService {
  constructor(private readonly repo: SkcClassificationRepository) {}

  // ──────────────────────────────────────────────────────────────
  // Queue
  // ──────────────────────────────────────────────────────────────

  async getQueue(params: QueueQuery) {
    const result = await this.repo.getQueue(params);
    return { ...result, batchLimit: MAX_BATCH_SIZE };
  }

  // ──────────────────────────────────────────────────────────────
  // Preview
  // ──────────────────────────────────────────────────────────────

  async preview(params: PreviewBody & { actorId: string }) {
    const { actorId, entityType, recordIds, targetProvenance } = params;

    // Fetch current persisted state — this is what gets fingerprinted
    const existingRecords = await this.repo.getRecordsById(entityType, recordIds);

    const foundIds = new Set(existingRecords.map(r => r.id));
    const missingIds = recordIds.filter(id => !foundIds.has(id));

    const blocked = existingRecords.filter(r => {
      const allowed = ALLOWED_TRANSITIONS[r.dataProvenance];
      return !allowed || !allowed.includes(targetProvenance as DataProvenance);
    });

    const affected = existingRecords.filter(r => {
      const allowed = ALLOWED_TRANSITIONS[r.dataProvenance];
      return !!allowed && allowed.includes(targetProvenance as DataProvenance);
    });

    const warnings: string[] = [];
    if (missingIds.length > 0) warnings.push(`${missingIds.length} record(s) were not found and will be skipped.`);
    if (blocked.length > 0) warnings.push(`${blocked.length} record(s) have disallowed provenance transitions (e.g., PRODUCTION → PRODUCTION) and will be skipped.`);

    // Token encodes only state — expiresAt is metadata returned alongside but
    // NOT included in the hash, so confirmation can recompute it deterministically.
    const previewToken = buildPreviewToken({
      actorId,
      entityType,
      targetProvenance: targetProvenance as DataProvenance,
      records: existingRecords,
    });

    const expiresAt = new Date(Date.now() + PREVIEW_TTL_MS);

    return {
      success: true,
      affectedCount: affected.length,
      blockedCount: blocked.length,
      missingCount: missingIds.length,
      blockedIds: blocked.map(r => r.id),
      missingIds,
      warnings,
      previewToken,
      expiresAt: expiresAt.toISOString(),
    };
  }

  // ──────────────────────────────────────────────────────────────
  // Submit (confirm classification)
  // ──────────────────────────────────────────────────────────────

  async submit(params: SubmitBody & { actorId: string }) {
    const { actorId, entityType, recordIds, targetProvenance, reason, idempotencyKey, previewToken } = params;

    const sortedIds = [...recordIds].sort();

    // 1. Check idempotency FIRST — before any other work
    const existingAudit = await this.repo.findAuditByIdempotencyKey(idempotencyKey);
    if (existingAudit) {
      const incomingFingerprint = buildPayloadFingerprint({
        actorId, entityType, sortedRecordIds: sortedIds, targetProvenance: targetProvenance as DataProvenance, reason,
      });
      const storedFingerprint = existingAudit.idempotencyKey.split(':fingerprint:')[1] ?? null;

      if (storedFingerprint && storedFingerprint !== incomingFingerprint) {
        throw new ClassificationServiceError(
          'IDEMPOTENCY_KEY_REUSED',
          'This idempotency key was already used with a different payload. Use a new key.',
          409
        );
      }
      // Same key + same payload — return original result (idempotent response)
      return {
        success: true,
        classifiedCount: 0,
        batchId: idempotencyKey,
        idempotent: true,
      };
    }

    // 2. Re-read current state to validate stale preview
    const currentRecords = await this.repo.getRecordsById(entityType as SkcClassifiedEntityType, recordIds);

    if (currentRecords.length === 0) {
      throw new ClassificationServiceError('NO_RECORDS_FOUND', 'None of the specified records exist.', 404);
    }

    // 3. Recompute preview token from current DB state.
    //    The token does NOT include expiresAt, so this recomputation is deterministic
    //    regardless of when the confirmation arrives within the validity window.
    //    If any record's dataProvenance or updatedAt changed since preview, the token
    //    will differ and the confirm is rejected.
    const expectedToken = buildPreviewToken({
      actorId,
      entityType: entityType as SkcClassifiedEntityType,
      targetProvenance: targetProvenance as DataProvenance,
      records: currentRecords,
    });

    if (expectedToken !== previewToken) {
      throw new ClassificationServiceError(
        'STALE_PREVIEW',
        'One or more records changed after preview was generated. Generate a new preview.',
        409
      );
    }

    // 4. Filter to classifiable records only
    const classifiable = currentRecords.filter(r => {
      const allowed = ALLOWED_TRANSITIONS[r.dataProvenance];
      return !!allowed && allowed.includes(targetProvenance as DataProvenance);
    });

    if (classifiable.length === 0) {
      throw new ClassificationServiceError(
        'NO_CLASSIFIABLE_RECORDS',
        'No records can transition to the specified provenance.',
        400
      );
    }

    // 5. Build payload fingerprint for idempotency storage
    const payloadFingerprint = buildPayloadFingerprint({
      actorId,
      entityType: entityType as SkcClassifiedEntityType,
      sortedRecordIds: sortedIds,
      targetProvenance: targetProvenance as DataProvenance,
      reason,
    });

    // 6. Execute atomic transaction
    return this.repo.classifyRecords({
      entityType: entityType as SkcClassifiedEntityType,
      records: classifiable,
      targetProvenance: targetProvenance as DataProvenance,
      reason,
      idempotencyKey,
      payloadFingerprint,
      actorId,
    });
  }

  // ──────────────────────────────────────────────────────────────
  // History
  // ──────────────────────────────────────────────────────────────

  async getHistory(params: HistoryQuery) {
    return this.repo.getHistory(params);
  }
}
