import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Media Center | State of Kashmir Crafts',
  description: 'Participate and view the Media Center for the State of Kashmir Crafts assessment by KHCRF.',
  openGraph: {
    title: 'Media Center | State of Kashmir Crafts',
    description: 'Participate and view the Media Center for the State of Kashmir Crafts assessment by KHCRF.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
