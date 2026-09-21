import { getBaseUrl } from "@/lib/api";
import { cookies } from "next/headers";
import { resolveProtectedResourceAccess, UserEntity, ResourceEntity, ProtectedAccessDecision } from "@/lib/auth/protectedResourceResolver";

/**
 * Thin Adapter for Master Artisans Publications.
 * Maps Master Artisans schema to the normalized ProtectedResource contract and delegates to shared authorization policy.
 */
export async function resolveMasterArtisansAccess(publication: any): Promise<ProtectedAccessDecision> {
  if (!publication) {
    return { state: "ACCESS_DENIED", canViewProtectedContent: false, reasonCode: "NO_PUBLICATION" };
  }

  // Master Artisans schema uses accessStatus directly (LOCKED | READY)
  const resource: ResourceEntity = {
    id: publication.id || publication.slug,
    resourceType: 'PUBLICATION',
    accessStatus: publication.accessStatus === 'LOCKED' ? 'LOCKED' : 'READY',
    requiredEntitlement: publication.visibility === 'PUBLIC' ? 'PUBLIC' : 'MASTER_ARTISANS_MEMBERSHIP'
  };

  let normalizedUser: UserEntity | null = null;

  if (resource.requiredEntitlement !== 'PUBLIC') {
    // Evaluate trusted backend cookies
const API_BASE = getBaseUrl();
    try {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
  
      const res = await fetch(`${API_BASE}/publications/access/${publication.slug}`, {
        headers: { Cookie: cookieHeader },
        cache: 'no-store'
      });
      
      if (res.ok) {
        const backendRes = await res.json();
        const decisionData = backendRes.data || backendRes;
        
        if (decisionData.state && decisionData.state !== 'NOT_AUTHENTICATED') {
          normalizedUser = {
            id: 'backend-validated-user',
            membershipStatus: decisionData.state === 'APPROVED' ? 'APPROVED' : decisionData.state,
            entitlements: decisionData.hasAccess ? ['MASTER_ARTISANS_MEMBERSHIP'] : []
          };
        }
      }
    } catch (error) {
      console.error("Error resolving Master Artisans publication access:", error);
    }
  }

  return resolveProtectedResourceAccess(normalizedUser, resource);
}
