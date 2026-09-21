export type AccessState =
  | "PUBLIC_PREVIEW"
  | "SIGN_IN_OR_APPLY"
  | "MEMBERSHIP_REQUIRED"
  | "APPLICATION_UNDER_REVIEW"
  | "ADDITIONAL_INFORMATION_REQUIRED"
  | "MEMBERSHIP_INACTIVE"
  | "ENTITLEMENT_REQUIRED"
  | "RESOURCE_RESERVED"
  | "ACCESS_GRANTED"
  | "RESOURCE_WITHDRAWN"
  | "ACCESS_DENIED";

export interface ProtectedAccessDecision {
  state: AccessState;
  canViewProtectedContent: boolean;
  reasonCode: string;
}

export type ResourceStatus = 'LOCKED' | 'READY' | 'WITHDRAWN';
export type MembershipStatus = 'NONE' | 'UNDER_REVIEW' | 'ADDITIONAL_INFO_REQUIRED' | 'SUSPENDED' | 'EXPIRED' | 'APPROVED';

export interface ResourceEntity {
  id: string;
  resourceType: 'PUBLICATION' | 'DOCUMENTARY_FILM' | 'VIDEO_INTERVIEW' | 'ORAL_HISTORY' | 'WORKSHOP_DIARY' | 'CRAFT_DEMONSTRATION' | 'ARCHIVE_ASSET';
  accessStatus: ResourceStatus;
  requiredEntitlement?: string; // Made optional to test missing config
}

export interface UserEntity {
  id: string;
  membershipStatus: MembershipStatus;
  entitlements: string[];
}

/**
 * Universally resolves authorization for protected assets across both Studio and Publications.
 * Strictly decoupled from identity/roles, relying solely on membership states and cryptographic-style entitlements.
 */
export function resolveProtectedResourceAccess(
  user: UserEntity | null,
  resource: ResourceEntity | null,
  action: "VIEW" = "VIEW" // Download explicitly excluded from this resolver
): ProtectedAccessDecision {
  
  // 1. Safe Default
  let decision: ProtectedAccessDecision = {
    state: "ACCESS_DENIED",
    canViewProtectedContent: false,
    reasonCode: "DEFAULT_DENY"
  };

  try {
    // 2. Resource Existence
    if (!resource) {
      decision.reasonCode = "RESOURCE_NOT_FOUND";
      return decision;
    }

    // 3. Withdrawn Override (Highest Priority)
    if (resource.accessStatus === 'WITHDRAWN') {
      decision.state = "RESOURCE_WITHDRAWN";
      decision.reasonCode = "RESOURCE_WITHDRAWN";
      return decision;
    }

    // 4. Public access check
    if (resource.requiredEntitlement === 'PUBLIC') {
       if (resource.accessStatus !== 'READY') {
         decision.state = "RESOURCE_RESERVED";
         decision.reasonCode = "RESOURCE_NOT_READY";
         return decision;
       }
       decision.state = "ACCESS_GRANTED";
       decision.canViewProtectedContent = true;
       decision.reasonCode = "PUBLIC_ACCESS";
       return decision;
    }

    // 5. Authenticated?
    if (!user) {
      decision.state = "SIGN_IN_OR_APPLY";
      decision.reasonCode = "UNAUTHENTICATED";
      return decision;
    }

    // 5. Membership State
    switch (user.membershipStatus) {
      case 'NONE':
        decision.state = "MEMBERSHIP_REQUIRED";
        decision.reasonCode = "NO_MEMBERSHIP";
        return decision;
      case 'UNDER_REVIEW':
        decision.state = "APPLICATION_UNDER_REVIEW";
        decision.reasonCode = "PENDING_REVIEW";
        return decision;
      case 'ADDITIONAL_INFO_REQUIRED':
        decision.state = "ADDITIONAL_INFORMATION_REQUIRED";
        decision.reasonCode = "AWAITING_INFO";
        return decision;
      case 'SUSPENDED':
      case 'EXPIRED':
        decision.state = "MEMBERSHIP_INACTIVE";
        decision.reasonCode = "INACTIVE_MEMBERSHIP";
        return decision;
      case 'APPROVED':
        // Proceed to resource checks
        break;
      default:
        decision.reasonCode = "UNKNOWN_MEMBERSHIP_STATE";
        return decision; // Fallback to ACCESS_DENIED
    }

    // 6. Resource Ready?
    if (resource.accessStatus !== 'READY') {
      decision.state = "RESOURCE_RESERVED";
      decision.reasonCode = "RESOURCE_NOT_READY";
      return decision;
    }

    // 7. Entitlement Verification (Decoupled from identity)
    if (!resource.requiredEntitlement) {
      // Security rule: Missing config fails closed
      decision.state = "ACCESS_DENIED"; 
      decision.reasonCode = "MISSING_ENTITLEMENT_CONFIG";
      return decision;
    }

    if (!user.entitlements.includes(resource.requiredEntitlement)) {
      decision.state = "ENTITLEMENT_REQUIRED";
      decision.reasonCode = "MISSING_REQUIRED_ENTITLEMENT";
      return decision;
    }

    // 8. Access Granted
    decision.state = "ACCESS_GRANTED";
    decision.canViewProtectedContent = true;
    decision.reasonCode = "AUTHORIZED";

  } catch (error) {
    decision.state = "ACCESS_DENIED";
    decision.canViewProtectedContent = false;
    decision.reasonCode = "AUTHORIZATION_ERROR";
  }

  return decision;
}

/**
 * Strict DTO Separator: Returns ONLY the public preview envelope.
 * Protected data must NEVER be passed to this function or returned by it.
 */
export function getPublicResourceDTO(resource: any) {
  return {
    id: resource.id,
    title: resource.title,
    cover: resource.cover,
    abstract: resource.abstract,
    resourceType: resource.resourceType,
    accessStatus: resource.accessStatus,
    // NO protected content
  };
}

/**
 * Strict DTO Separator: Returns the full payload, but ONLY if authorized.
 * Throws or returns null if the user does not pass the authorization resolver.
 */
export function getProtectedResourceDTO(resource: any, user: UserEntity | null) {
  const decision = resolveProtectedResourceAccess(user, resource);
  if (!decision.canViewProtectedContent) {
    throw new Error(`Unauthorized: ${decision.state} (${decision.reasonCode})`);
  }
  
  return {
    ...getPublicResourceDTO(resource),
    protectedContent: resource.protectedContent, // The actual restricted payload
    manifestUrl: resource.manifestUrl,
    pdfUrl: resource.pdfUrl
  };
}
