import React from 'react';
import KnowledgeGroupSwitcher from '@/components/knowledge/KnowledgeGroupSwitcher';

export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <KnowledgeGroupSwitcher />
      {children}
    </>
  );
}
