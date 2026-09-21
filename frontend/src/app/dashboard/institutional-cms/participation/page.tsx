import React from 'react';
import { ParticipationDashboard } from '@/components/institutional-cms/ParticipationDashboard';

export const metadata = {
  title: 'Participation | Institutional CMS | KHCRF',
};

export default function ParticipationCMSPage() {
  return (
    <div className="space-y-6">
      <ParticipationDashboard />
    </div>
  );
}
