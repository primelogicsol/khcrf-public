import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Institutional Messages | State of Kashmir Crafts',
  description: 'Participate and view the Institutional Messages for the State of Kashmir Crafts assessment by KHCRF.',
  openGraph: {
    title: 'Institutional Messages | State of Kashmir Crafts',
    description: 'Participate and view the Institutional Messages for the State of Kashmir Crafts assessment by KHCRF.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
