export class OptimisticLockError extends Error {
  public readonly publicationId: string;
  public readonly expectedRevision: number;

  constructor(publicationId: string, expectedRevision: number) {
    super(`Optimistic lock failed for Publication ${publicationId}. Expected revision ${expectedRevision}.`);
    this.name = 'OptimisticLockError';
    this.publicationId = publicationId;
    this.expectedRevision = expectedRevision;
  }
}

export class IdempotencyConflictError extends Error {
  public readonly idempotencyKey: string;

  constructor(idempotencyKey: string) {
    super(`A different command is already processing for idempotency key ${idempotencyKey}.`);
    this.name = 'IdempotencyConflictError';
    this.idempotencyKey = idempotencyKey;
  }
}
