export interface FeatureFlags {
  // Phase 4.1C Flags
  enableCanonicalPublicReads: boolean;
  enableCanonicalAdminReads: boolean;
  enableDualReadTelemetry: boolean;
  enableLegacyEndpointFallback: boolean;
  
  // Phase 4.1D Flags
  enableCanonicalWrites: boolean;
  enableWorkflowEngine: boolean;
}

/**
 * Fallback defaults in case the flag service is unavailable.
 * We default to the safest state (legacy paths).
 */
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  enableCanonicalPublicReads: true,
  enableCanonicalAdminReads: true,
  enableDualReadTelemetry: true,
  enableLegacyEndpointFallback: true,
  enableCanonicalWrites: false,
  enableWorkflowEngine: false,
};

export interface FeatureFlagService {
  getFlags(): Promise<FeatureFlags>;
  getFlag<K extends keyof FeatureFlags>(flagName: K): Promise<FeatureFlags[K]>;
}

// Stub implementation for rollout
export class DefaultFeatureFlagService implements FeatureFlagService {
  async getFlags(): Promise<FeatureFlags> {
    return DEFAULT_FEATURE_FLAGS;
  }

  async getFlag<K extends keyof FeatureFlags>(flagName: K): Promise<FeatureFlags[K]> {
    return DEFAULT_FEATURE_FLAGS[flagName];
  }
}
