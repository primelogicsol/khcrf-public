import { getBaseUrl } from "@/lib/api";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import PublicationPublicView from "@/components/publications/PublicationPublicView";
import { toCanonicalPublicationPresentation } from "@/types/CanonicalPublicationPresentation";
import { resolvePublicationAccess } from "@/lib/publications/resolvePublicationAccess";

export const revalidate = 300;
export const dynamic = 'force-dynamic';

// Fetch publication by slug using Next cached fetch
async function getPublicationBySlug(slug: string) {

const API_BASE = getBaseUrl();
  try {
    const res = await fetch(`${API_BASE}/publications/details/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.error("Error fetching publication:", res.status);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching publication:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const rawData = await getPublicationBySlug(slug);
  
  if (!rawData) {
    return { title: "Publication Not Found" };
  }

  const canonical = toCanonicalPublicationPresentation(rawData);

  const title = `${canonical.title} | KHCRF Press`;
  const desc = canonical.executiveSummary ? canonical.executiveSummary.slice(0, 155) : "";

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: "book",
      images: canonical.coverImageUrl ? [canonical.coverImageUrl] : [],
    },
  };
}

export default async function PublicationDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rawData = await getPublicationBySlug(slug);
  
  if (!rawData) {
    return notFound();
  }

  const canonical = toCanonicalPublicationPresentation(rawData);
  const access = await resolvePublicationAccess({ publication: rawData.data || rawData, user: null });

  return (
    <PublicationPublicView
      canonical={canonical}
      isPreviewMode={false}
      initialAccessState={access}
    />
  );
}
