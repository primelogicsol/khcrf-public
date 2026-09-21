import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Official Messages | State of Kashmir Crafts',
  description: 'Participate and view the Official Messages for the State of Kashmir Crafts assessment by KHCRF.',
  openGraph: {
    title: 'Official Messages | State of Kashmir Crafts',
    description: 'Participate and view the Official Messages for the State of Kashmir Crafts assessment by KHCRF.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
