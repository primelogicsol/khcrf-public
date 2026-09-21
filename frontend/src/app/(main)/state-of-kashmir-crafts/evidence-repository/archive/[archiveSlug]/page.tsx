import { Metadata } from "next";
import { Suspense } from 'react';
import EvidenceRepositoryClient, { ARCHIVE_MAP } from "../../EvidenceRepositoryClient";

type Props = {
  params: { archiveSlug: string }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const archive = ARCHIVE_MAP[params.archiveSlug];
  if (!archive) {
    return {
      title: "Evidence Repository Archive | State of Kashmir Crafts | KHCRF",
    };
  }
  
  return {
    title: `${archive.title} | Evidence Repository | State of Kashmir Crafts | KHCRF`,
    description: archive.desc,
  };
}

export default function EvidenceRepositoryArchivePage({ params }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark"></div></div>}>
      <EvidenceRepositoryClient archiveSlug={params.archiveSlug} />
    </Suspense>
  );
}
