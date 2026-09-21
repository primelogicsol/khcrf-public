import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request Invitation | State of Kashmir Crafts',
  description: 'Participate and view the Request Invitation for the State of Kashmir Crafts assessment by KHCRF.',
  openGraph: {
    title: 'Request Invitation | State of Kashmir Crafts',
    description: 'Participate and view the Request Invitation for the State of Kashmir Crafts assessment by KHCRF.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
