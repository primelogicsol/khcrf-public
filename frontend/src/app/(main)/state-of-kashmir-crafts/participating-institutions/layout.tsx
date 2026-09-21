import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Participating Institutions | State of Kashmir Crafts',
  description: 'Participate and view the Participating Institutions for the State of Kashmir Crafts assessment by KHCRF.',
  openGraph: {
    title: 'Participating Institutions | State of Kashmir Crafts',
    description: 'Participate and view the Participating Institutions for the State of Kashmir Crafts assessment by KHCRF.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
