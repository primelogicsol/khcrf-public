import React, { Suspense } from 'react';
import { Metadata } from 'next';
import ParticipateClient from './ParticipateClient';

export const metadata: Metadata = {
  title: 'Participate Online | State of Kashmir Crafts | KHCRF',
  description: 'Participate in the State of Kashmir Crafts assessment through surveys, submissions, recommendations, evidence, interviews, and public consultation.',
};

export default function ParticipatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading participation portal...</div>}>
      <ParticipateClient />
    </Suspense>
  );
}
