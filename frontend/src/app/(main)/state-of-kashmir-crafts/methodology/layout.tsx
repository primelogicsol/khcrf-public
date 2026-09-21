import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Methodology | State of Kashmir Crafts',
  description: 'Participate and view the Methodology for the State of Kashmir Crafts assessment by KHCRF.',
  openGraph: {
    title: 'Methodology | State of Kashmir Crafts',
    description: 'Participate and view the Methodology for the State of Kashmir Crafts assessment by KHCRF.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
