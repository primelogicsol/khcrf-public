import { Metadata } from 'next';
import ValidationRoundClient from './ValidationRoundClient';

import { skc2026Lifecycle } from '@/config/skcLifecycleSchedule';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Validation Round | State of Kashmir Crafts | KHCRF',
  description: 'Participate in the public validation round to verify preliminary findings for the State of Kashmir Crafts assessment.',
};

export default function ValidationRoundPage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark"></div></div>}>
        <ValidationRoundClient />
      </Suspense>
    </>
  );
}
