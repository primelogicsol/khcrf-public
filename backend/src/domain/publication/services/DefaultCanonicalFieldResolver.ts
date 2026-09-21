import { CanonicalFieldResolver, ResolutionContext } from '../contracts/CanonicalFieldResolver';
import { FallbackPolicy } from '../domain.types';
import { TelemetrySink } from '../telemetry/TelemetrySink';
import { CanonicalResolutionError } from '../domain.errors';

export class DefaultCanonicalFieldResolver implements CanonicalFieldResolver {
  constructor(private readonly telemetry: TelemetrySink) {}

  resolveField<T>(
    canonicalValue: T | null | undefined,
    legacyFallbackFn: () => T | null | undefined,
    context: ResolutionContext,
    policy: FallbackPolicy
  ): T | null {
    // 1. Valid Canonical Value Precedence
    // Only null or undefined trigger fallback. "", 0, false, [] are valid canonical values.
    if (canonicalValue !== null && canonicalValue !== undefined) {
      return canonicalValue;
    }

    // 2. Policy Guards
    if (policy === 'CANONICAL_ONLY') {
      return null;
    }
    
    if (policy === 'LEGACY_PROHIBITED') {
      throw new CanonicalResolutionError(
        context.fieldKey, 
        'Fallback prohibited by policy, but canonical value is missing.'
      );
    }

    // 3. Execute Fallback
    const legacyValue = legacyFallbackFn();
    
    // 4. Fallback Evaluation
    if (legacyValue !== null && legacyValue !== undefined) {
      // Telemetry MUST NOT include actual legacyValue or canonicalValue to prevent leaking PII/content
      this.telemetry.incrementMetric('publication_legacy_fallback_total', {
        dtoType: context.dtoType,
        fieldKey: context.fieldKey,
        endpoint: context.endpoint
      });
      return legacyValue as T; 
    }

    // 5. Final fallback (Null)
    if (policy === 'REQUIRED_WITH_LEGACY_FALLBACK') {
      throw new CanonicalResolutionError(
        context.fieldKey,
        'Fallback Policy is REQUIRED_WITH_LEGACY_FALLBACK but both canonical and legacy values are missing.'
      );
    }

    return null;
  }
}
