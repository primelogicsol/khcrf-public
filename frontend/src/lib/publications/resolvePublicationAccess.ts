import { getBaseUrl } from "@/lib/api";
import { cookies } from "next/headers";

export async function resolvePublicationAccess({ publication, user }: { publication: any, user?: any }) {
  if (!publication) return { hasAccess: false, state: "NO_APPLICATION" };

  const accessTier = publication.accessTier || publication.accessType || (publication.metadata?.access_tier) || "PUBLIC";

  // Public access is open to all
  if (accessTier === "PUBLIC") {
    return { hasAccess: true, state: "APPROVED", submittedAt: null };
  }

  // Admin and Staff override (if user is provided from a session)
  if (user) {
    const isAdminOrStaff = user.isAdmin || user.role === 'ADMIN' || user.role?.startsWith('MODERATOR_') || user.role?.startsWith('COLLABORATOR_');
    if (isAdminOrStaff) {
      return { hasAccess: true, state: "APPROVED", submittedAt: null };
    }
  }

  // Registered user access (if user is provided)
  if ((accessTier === "REGISTERED" || accessTier === "REGISTERED_USER") && user) {
    return { hasAccess: true, state: "APPROVED", submittedAt: null };
  }

  // For MEMBER or when user isn't passed but we need to check cookies against backend
const API_BASE = getBaseUrl();
  
  try {
    const cookieStore = await cookies();
    // Reconstruct cookie string from Next.js ReadonlyRequestCookies
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

    const res = await fetch(`${API_BASE}/publications/access/${publication.slug}`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: 'no-store'
    });
    
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error("Error resolving publication access:", error);
  }

  // If fetch failed or user is not authenticated according to backend
  return { hasAccess: false, state: "NOT_AUTHENTICATED", submittedAt: null };
}
