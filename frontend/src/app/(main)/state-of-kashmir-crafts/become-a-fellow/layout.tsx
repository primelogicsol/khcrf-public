import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Become A Fellow | State of Kashmir Crafts',
  description: 'Participate and view the Become A Fellow for the State of Kashmir Crafts assessment by KHCRF.',
  openGraph: {
    title: 'Become A Fellow | State of Kashmir Crafts',
    description: 'Participate and view the Become A Fellow for the State of Kashmir Crafts assessment by KHCRF.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
