import { Metadata } from 'next';
import FinalReportClient from './FinalReportClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Final Report | State of Kashmir Crafts | KHCRF',
  description: 'The finalized State of Kashmir Crafts assessment report.',
};

export default function FinalReportPage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-dark"></div></div>}>
        <FinalReportClient />
      </Suspense>
    </>
  );
}
