import { getBaseUrlNoApi } from "@/lib/api";
import { RichPublicationPayloads } from './RichPublicationPayloads';
/**
 * Canonical registry for Publications.
 * This guarantees a public card will ALWAYS result in a public detail page (200),
 * separating public discovery from protected body access (LOCKED state).
 */

const API_BASE_URL = getBaseUrlNoApi();

export async function getPublicPublications() {
  const res = await fetch(`${API_BASE_URL}/api/v1/magazine-issues`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API Error ${res.status}: ${text || res.statusText}`);
  }
  const data = await res.json();
  const arr = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
  
  // Enforce eligibility rule: must be published and have a slug
  return arr.filter((pub: any) => pub.status === 'PUBLISHED' && pub.slug);
}

export async function getPublicPublicationBySlug(slug: string) {
  const res = await fetch(`${API_BASE_URL}/api/v1/magazine-issues/${slug}`, {
    next: { revalidate: 60 }
  });
  
  // Note: 403 or 404 from the backend for a LOCKED issue would violate the invariant. 
  // The backend correctly returns 200 for public metadata even if accessStatus='LOCKED'.
  if (!res.ok) return null;
  
  const data = await res.json();

  if (data && data.slug && RichPublicationPayloads[data.slug]) {
    const richData = RichPublicationPayloads[data.slug];
    data.publicOverview = richData.publicOverview;
    data.contextModules = richData.contextModules;
    data.contentsPreview = richData.contentsPreview;
  }

  return data && data.slug ? data : null;
}
