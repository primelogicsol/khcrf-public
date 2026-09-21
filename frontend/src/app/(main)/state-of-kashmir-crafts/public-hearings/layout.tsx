import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Public Hearings | State of Kashmir Crafts',
  description: 'Participate and view the Public Hearings for the State of Kashmir Crafts assessment by KHCRF.',
  openGraph: {
    title: 'Public Hearings | State of Kashmir Crafts',
    description: 'Participate and view the Public Hearings for the State of Kashmir Crafts assessment by KHCRF.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
