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

  const isApproved = membership.status === "APPROVED";
  const isSuspended = membership.suspendedAt != null || membership.status === "SUSPENDED";
  const isRevoked = membership.revokedAt != null || membership.status === "REVOKED";

  // We consider them active if status is APPROVED and not suspended/revoked
  return isApproved && !isSuspended && !isRevoked;
}
