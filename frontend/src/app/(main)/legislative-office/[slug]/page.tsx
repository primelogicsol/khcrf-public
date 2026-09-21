import LegislativePortal from "./LegislativePortal";

export default async function OfficeBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <LegislativePortal initialSlug={slug} />;
}
