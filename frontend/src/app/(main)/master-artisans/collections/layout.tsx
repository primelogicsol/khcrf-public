import React from 'react';
import CollectionsGroupSwitcher from '@/components/collections/CollectionsGroupSwitcher';

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CollectionsGroupSwitcher />
      {children}
    </>
  );
}
