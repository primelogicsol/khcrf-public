import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advisory Council | State of Kashmir Crafts',
  description: 'Participate and view the Advisory Council for the State of Kashmir Crafts assessment by KHCRF.',
  openGraph: {
    title: 'Advisory Council | State of Kashmir Crafts',
    description: 'Participate and view the Advisory Council for the State of Kashmir Crafts assessment by KHCRF.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
