import React from 'react';
import StudioGroupSwitcher from '@/components/studio/StudioGroupSwitcher';

export default function ArtisansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StudioGroupSwitcher />
      {children}
    </>
  );
}
