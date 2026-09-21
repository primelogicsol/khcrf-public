import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Magazine Issues | KHCRF Master Artisans',
  description:
    'Explore all issues of the KHCRF Master Artisans magazine — in-depth editorial coverage of Kashmir\'s living craft heritage, artisan profiles, and preservation policy.',
  alternates: {
    canonical: '/master-artisans/publications',
  },
  openGraph: {
    title: 'Magazine Issues | KHCRF Master Artisans',
    description:
      'In-depth editorial coverage of Kashmir\'s living craft heritage, artisan profiles, and preservation policy.',
    type: 'website',
  },
};

export default function IssuesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
