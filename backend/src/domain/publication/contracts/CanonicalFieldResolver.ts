import { FallbackPolicy } from '../domain.types';

export interface ResolutionContext {
  publicationId: string;
  fieldKey: string;
  dtoType: string;
  endpoint: string;
  editionId: string | null;
  requestId: string;
}

/**
 * Registry defining exactly how a specific domain field should resolve
 * its value between the new canonical models and the legacy JSON blobs.
 */
export interface CanonicalFieldResolver {
  /**
   * Resolves a field dynamically based on the precedence rules:
   * Canonical -> Legacy -> Null.
   * 
   * @param canonicalValue The value from the Phase 3 schema.
   * @param legacyFallbackFn A function to extract the value from legacy JSON/fields if canonical is null.
   * @param context Context for telemetry and metric logging.
   * @param policy The strict FallbackPolicy dictating if a fallback is allowed.
   */
  resolveField<T>(
    canonicalValue: T | null | undefined,
    legacyFallbackFn: () => T | null | undefined,
    context: ResolutionContext,
    policy: FallbackPolicy
  ): T | null;
}
