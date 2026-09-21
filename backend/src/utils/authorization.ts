export type MembershipStatus =
  | "NONE"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED"
  | "REVOKED";

export interface UserContext {
  role?: string;
  isAdmin?: boolean;
}

export interface MembershipContext {
  status?: MembershipStatus | string | null;
  isActive?: boolean;
  suspendedAt?: string | Date | null;
  revokedAt?: string | Date | null;
}

export function getPublicationAccessState(
  user: UserContext | null | undefined,
  membership: MembershipContext | null | undefined
): boolean {
  if (!user) return false;

  // Admin override
  if (user.role === "ADMIN" || user.isAdmin === true) {
    return true;
  }

  // Member requirement
  if (!membership) return false;

  const status = (membership as any).profileData?.workflowState || membership.status;

  const isApproved = status === "APPROVED";
  const isSuspended = membership.suspendedAt != null || status === "SUSPENDED";
  const isRevoked = membership.revokedAt != null || status === "REVOKED";

  return isApproved && !isSuspended && !isRevoked;
}
