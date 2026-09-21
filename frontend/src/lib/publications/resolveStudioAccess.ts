import { getBaseUrl } from "@/lib/api";
import { cookies } from "next/headers";
import { resolveProtectedResourceAccess, UserEntity, ResourceEntity, ProtectedAccessDecision } from "@/lib/auth/protectedResourceResolver";
import { StudioEntity } from "@/lib/services/canonicalStudio";

export async function resolveStudioAccess(studioRecord: StudioEntity): Promise<ProtectedAccessDecision> {
  if (!studioRecord) {
    return { state: "ACCESS_DENIED", canViewProtectedContent: false, reasonCode: "NO_RECORD" };
  }

  const resource: ResourceEntity = {
    id: studioRecord.id || studioRecord.slug,
    resourceType: (studioRecord.studioType === 'WORKSHOP' ? 'WORKSHOP_DIARY' : studioRecord.studioType) as any,
    accessStatus: (studioRecord.accessStatus === 'PROCESSING' ? 'LOCKED' : studioRecord.accessStatus) as any,
    requiredEntitlement: studioRecord.requiredEntitlement
  };

  let normalizedUser: UserEntity | null = null;

  if (resource.requiredEntitlement !== 'PUBLIC') {
const API_BASE = getBaseUrl();
    try {
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
  
      // Mock Studio access check (falling back to same pattern as publications for now)
      const res = await fetch(`${API_BASE}/publications/access/${studioRecord.slug}`, {
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
            entitlements: decisionData.hasAccess ? [resource.requiredEntitlement || ''] : []
          };
        }
      }
    } catch (error) {
      console.error("Error resolving Studio access:", error);
    }
  }

  return resolveProtectedResourceAccess(normalizedUser, resource);
}
