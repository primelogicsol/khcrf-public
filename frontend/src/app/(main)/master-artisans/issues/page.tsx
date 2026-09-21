import { getBaseUrlNoApi } from "@/lib/api";
import { Metadata } from 'next';
import MagazineIssuesClient from './MagazineIssuesClient';

export const metadata: Metadata = {
  title: 'Magazine Issues | KHCRF Master Artisans',
  description: 'Explore our archive of master artisan stories, research, and heritage documentation.',
};

export default async function MagazineIssuesPage() {
  const backendBase = getBaseUrlNoApi();
  let initialIssues = [];
  
  try {
    const res = await fetch(backendBase + '/api/v1/magazine-issues', { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      initialIssues = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
      // Filter out non-published or hidden on server
      initialIssues = initialIssues.filter((issue: any) => issue.status === 'PUBLISHED' && issue.visibility !== 'HIDDEN');
    }
  } catch (err) {
    console.error('Failed to fetch magazine issues for SSR:', err);
  }

  return <MagazineIssuesClient initialIssues={initialIssues} />;
}
