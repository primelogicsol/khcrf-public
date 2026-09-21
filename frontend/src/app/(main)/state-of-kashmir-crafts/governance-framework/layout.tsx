import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Governance Framework | State of Kashmir Crafts',
  description: 'Participate and view the Governance Framework for the State of Kashmir Crafts assessment by KHCRF.',
  openGraph: {
    title: 'Governance Framework | State of Kashmir Crafts',
    description: 'Participate and view the Governance Framework for the State of Kashmir Crafts assessment by KHCRF.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
