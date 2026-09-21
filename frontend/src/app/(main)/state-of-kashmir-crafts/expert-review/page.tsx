import { Metadata } from 'next';
import ExpertReviewClient from './ExpertReviewClient';

import { skc2026Lifecycle } from '@/config/skcLifecycleSchedule';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Expert Review | State of Kashmir Crafts | KHCRF',
  description: 'Expert panel review process for the State of Kashmir Crafts assessment.',
};

export default function ExpertReviewPage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark"></div></div>}>
        <ExpertReviewClient />
      </Suspense>
    </>
  );
}
