import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import MagazineIssueDetailClient from "./MagazineIssueDetailClient";
import { getPublicPublicationBySlug } from "@/lib/services/canonicalPublications";
import { resolveMasterArtisansAccess } from "@/lib/publications/resolveMasterArtisansAccess";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const issue = await getPublicPublicationBySlug(resolvedParams.slug);
  
  if (!issue) {
    return { title: 'Not Found | KHCRF' };
  }
  
  return {
    title: `${issue.title} | Publications | KHCRF`,
    description: issue.shortDescription || issue.subtitle
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // 1. Resolve from canonical source
  const rawIssue = await getPublicPublicationBySlug(resolvedParams.slug);
  
  if (!rawIssue) {
    notFound();
  }

  // 2. Resolve server-side access policy securely
  const accessDecision = await resolveMasterArtisansAccess(rawIssue);

  // 3. Render 200 Public Detail Page, passing both payloads
  return <MagazineIssueDetailClient initialIssue={rawIssue} initialAccessDecision={accessDecision.state} />;
}
