import { getBaseUrlNoApi } from "@/lib/api";
/**
 * Canonical registry for Artisans.
 * Both directory lists and individual profiles must consume these canonical selectors
 * to ensure 100% list-to-detail routing integrity.
 */

const API_BASE_URL = getBaseUrlNoApi();

export async function getPublicArtisans() {
  const res = await fetch(`${API_BASE_URL}/api/v1/artisans`, {
    next: { revalidate: 60 } // or cache: 'no-store'
  });
  if (!res.ok) return [];
  const data = await res.json();
  const arr = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
  
  // Enforce eligibility rule: must have a slug to render publicly
  return arr.filter((artisan: any) => artisan.slug);
}

export async function getPublicArtisanBySlug(slug: string) {
  const res = await fetch(`${API_BASE_URL}/api/v1/artisans/${slug}`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) return null;
  
  const data = await res.json();
  return data && data.slug ? data : null;
}
