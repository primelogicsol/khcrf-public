/**
 * SKC Classification — Structured Operation Logger
 *
 * Emits one structured JSON log line per classification operation.
 * Every log line is machine-parseable and query-able by any log aggregator
 * (Datadog, Loki, CloudWatch, etc.).
 *
 * Usage:
 *   import { classificationLogger } from '../utils/classificationLogger';
 *   classificationLogger.logPreview({ ... });
 *   classificationLogger.logSubmit({ ... });
 *   classificationLogger.logIdempotentReplay({ ... });
 *   classificationLogger.logStalePreviewRejection({ ... });
 *   classificationLogger.logTransactionFailure({ ... });
 */

import { DataProvenance, SkcClassifiedEntityType } from '@prisma/client';
import crypto from 'crypto';

// ─── Types ────────────────────────────────────────────────────────────────────

export type OperationOutcome = 'success' | 'failure' | 'rejected' | 'replayed';

export interface BaseOperationLog {
  /** ISO-8601 timestamp */
  timestamp: string;
  /** Human-readable correlation ID for tracing a request across services */
  requestId: string;
  /** The administrator who initiated the operation */
  actorId: string;
  /** Entity type being classified */
  entityType: SkcClassifiedEntityType;
  /** Operation outcome */
  outcome: OperationOutcome;
  /** Elapsed wall-clock time in milliseconds */
  durationMs: number;
}

export interface PreviewOperationLog extends BaseOperationLog {
  event: 'skc.classification.preview';
  targetProvenance: DataProvenance;
  requestedCount: number;
  affectedCount: number;
  blockedCount: number;
  missingCount: number;
}

export interface SubmitOperationLog extends BaseOperationLog {
  event: 'skc.classification.submit';
  batchId: string;
  targetProvenance: DataProvenance;
  requestedCount: number;
  classifiedCount: number;
  idempotencyKey: string;
  idempotentReplay: boolean;
  rollbackOccurred: boolean;
}

export interface StalePreviewLog extends BaseOperationLog {
  event: 'skc.classification.stale_preview';
  targetProvenance: DataProvenance;
  requestedCount: number;
  /** The records whose state changed between preview and confirmation */
  staleRecordIds?: string[];
}

export interface IdempotencyReuseLog extends BaseOperationLog {
  event: 'skc.classification.idempotency_key_reused';
  idempotencyKey: string;
  targetProvenance: DataProvenance;
}

export interface TransactionFailureLog extends BaseOperationLog {
  event: 'skc.classification.transaction_failure';
  batchId?: string;
  targetProvenance: DataProvenance;
  requestedCount: number;
  errorCode?: string;
  errorMessage: string;
  rollbackOccurred: boolean;
}

type ClassificationLog =
  | PreviewOperationLog
  | SubmitOperationLog
  | StalePreviewLog
  | IdempotencyReuseLog
  | TransactionFailureLog;

// ─── Logger ──────────────────────────────────────────────────────────────────

function emit(log: ClassificationLog): void {
  // In production, replace process.stdout.write with your log aggregator SDK
  // (pino, winston, Datadog logger, etc.)
  process.stdout.write(JSON.stringify(log) + '\n');
}

function generateRequestId(): string {
  return crypto.randomBytes(8).toString('hex');
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const classificationLogger = {
  /**
   * Log a completed preview operation.
   * Call this immediately after service.preview() resolves.
   */
  logPreview(params: {
    requestId?: string;
    actorId: string;
    entityType: SkcClassifiedEntityType;
    targetProvenance: DataProvenance;
    requestedCount: number;
    affectedCount: number;
    blockedCount: number;
    missingCount: number;
    durationMs: number;
  }): void {
    emit({
      timestamp: new Date().toISOString(),
      requestId: params.requestId ?? generateRequestId(),
      event: 'skc.classification.preview',
      actorId: params.actorId,
      entityType: params.entityType,
      targetProvenance: params.targetProvenance,
      requestedCount: params.requestedCount,
      affectedCount: params.affectedCount,
      blockedCount: params.blockedCount,
      missingCount: params.missingCount,
      outcome: 'success',
      durationMs: params.durationMs,
    });
  },

  /**
   * Log a completed (committed) classification batch.
   * Call this immediately after service.submit() resolves successfully.
   */
  logSubmit(params: {
    requestId?: string;
    actorId: string;
    entityType: SkcClassifiedEntityType;
    targetProvenance: DataProvenance;
    batchId: string;
    idempotencyKey: string;
    requestedCount: number;
    classifiedCount: number;
    idempotentReplay: boolean;
    durationMs: number;
  }): void {
    emit({
      timestamp: new Date().toISOString(),
      requestId: params.requestId ?? generateRequestId(),
      event: 'skc.classification.submit',
      actorId: params.actorId,
      entityType: params.entityType,
      targetProvenance: params.targetProvenance,
      batchId: params.batchId,
      idempotencyKey: params.idempotencyKey,
      requestedCount: params.requestedCount,
      classifiedCount: params.classifiedCount,
      idempotentReplay: params.idempotentReplay,
      rollbackOccurred: false,
      outcome: params.idempotentReplay ? 'replayed' : 'success',
      durationMs: params.durationMs,
    });
  },

  /**
   * Log a stale-preview rejection.
   * Call this when service.submit() throws STALE_PREVIEW.
   */
  logStalePreviewRejection(params: {
    requestId?: string;
    actorId: string;
    entityType: SkcClassifiedEntityType;
    targetProvenance: DataProvenance;
    requestedCount: number;
    durationMs: number;
  }): void {
    emit({
      timestamp: new Date().toISOString(),
      requestId: params.requestId ?? generateRequestId(),
      event: 'skc.classification.stale_preview',
      actorId: params.actorId,
      entityType: params.entityType,
      targetProvenance: params.targetProvenance,
      requestedCount: params.requestedCount,
      outcome: 'rejected',
      durationMs: params.durationMs,
    });
  },

  /**
   * Log an idempotency-key reuse rejection.
   * Call this when service.submit() throws IDEMPOTENCY_KEY_REUSED.
   */
  logIdempotencyKeyReuse(params: {
    requestId?: string;
    actorId: string;
    entityType: SkcClassifiedEntityType;
    targetProvenance: DataProvenance;
    idempotencyKey: string;
    durationMs: number;
  }): void {
    emit({
      timestamp: new Date().toISOString(),
      requestId: params.requestId ?? generateRequestId(),
      event: 'skc.classification.idempotency_key_reused',
      actorId: params.actorId,
      entityType: params.entityType,
      targetProvenance: params.targetProvenance,
      idempotencyKey: params.idempotencyKey,
      outcome: 'rejected',
      durationMs: params.durationMs,
    });
  },

  /**
   * Log a transaction failure (unexpected error during commit).
   * Call this when service.submit() throws an unhandled error.
   */
  logTransactionFailure(params: {
    requestId?: string;
    actorId: string;
    entityType: SkcClassifiedEntityType;
    targetProvenance: DataProvenance;
    batchId?: string;
    requestedCount: number;
    errorCode?: string;
    errorMessage: string;
    durationMs: number;
  }): void {
    emit({
      timestamp: new Date().toISOString(),
      requestId: params.requestId ?? generateRequestId(),
      event: 'skc.classification.transaction_failure',
      actorId: params.actorId,
      entityType: params.entityType,
      targetProvenance: params.targetProvenance,
      batchId: params.batchId,
      requestedCount: params.requestedCount,
      errorCode: params.errorCode,
      errorMessage: params.errorMessage,
      outcome: 'failure',
      rollbackOccurred: true,
      durationMs: params.durationMs,
    });
  },
};
