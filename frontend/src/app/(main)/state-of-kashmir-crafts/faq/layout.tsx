import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Faq | State of Kashmir Crafts',
  description: 'Participate and view the Faq for the State of Kashmir Crafts assessment by KHCRF.',
  openGraph: {
    title: 'Faq | State of Kashmir Crafts',
    description: 'Participate and view the Faq for the State of Kashmir Crafts assessment by KHCRF.',
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
