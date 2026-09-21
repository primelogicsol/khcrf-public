import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stakeholder Registry | State of Kashmir Crafts',
  description: 'Participate and view the Stakeholder Registry for the State of Kashmir Crafts assessment by KHCRF.',
  openGraph: {
    title: 'Stakeholder Registry | State of Kashmir Crafts',
    description: 'Participate and view the Stakeholder Registry for the State of Kashmir Crafts assessment by KHCRF.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
