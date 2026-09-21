import { Metadata } from 'next';
import DraftFindingsClient from './DraftFindingsClient';

import { skc2026Lifecycle } from '@/config/skcLifecycleSchedule';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Draft Findings | State of Kashmir Crafts | KHCRF',
  description: 'Review preliminary findings from consultations, submissions, hearings, and evidence collected during the State of Kashmir Crafts assessment.',
};

export default function DraftFindingsPage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark"></div></div>}>
        <DraftFindingsClient />
      </Suspense>
    </>
  );
}
