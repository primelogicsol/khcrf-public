import { Metadata } from 'next';
import EvidenceRepositoryClient from './EvidenceRepositoryClient';

import { skc2026Lifecycle } from '@/config/skcLifecycleSchedule';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Evidence Repository | State of Kashmir Crafts | KHCRF',
  description: 'Browse and contribute documents, consultations, testimonies, research papers, photos, videos, and evidence supporting the State of Kashmir Crafts annual assessment.',
};

export default function EvidenceRepositoryPage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark"></div></div>}>
        <EvidenceRepositoryClient />
      </Suspense>
    </>
  );
}
