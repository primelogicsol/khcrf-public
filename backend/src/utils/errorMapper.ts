export function isTransactionConflict(error: unknown): boolean {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 'P2034'
  ) {
    return true;
  }

  if (!(error instanceof Error)) {
    return false;
  }

  return /serialization failure|transaction conflict|write conflict|schedule overlap|active feature already exists|stale version/i.test(
    error.message
  );
}
