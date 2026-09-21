import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stakeholder Statements | State of Kashmir Crafts',
  description: 'Participate and view the Stakeholder Statements for the State of Kashmir Crafts assessment by KHCRF.',
  openGraph: {
    title: 'Stakeholder Statements | State of Kashmir Crafts',
    description: 'Participate and view the Stakeholder Statements for the State of Kashmir Crafts assessment by KHCRF.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
