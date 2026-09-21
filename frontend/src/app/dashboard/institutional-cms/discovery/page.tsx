import React from 'react';
import { DiscoveryEngine } from '@/components/institutional-cms/DiscoveryEngine';

export const metadata = {
  title: 'Institutional Discovery | CMS | KHCRF',
};

export default function DiscoveryCMSPage() {
  return (
    <div className="space-y-6">
      <DiscoveryEngine />
    </div>
  );
}
