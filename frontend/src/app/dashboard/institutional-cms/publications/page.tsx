'use client';
import React, { useState } from 'react';
import { EntityList } from '@/components/institutional-cms/EntityList';
import { EntityEditor } from '@/components/institutional-cms/EntityEditor';

export default function PublicationsCMS() {
  const [view, setView] = useState<'LIST' | 'EDIT'>('LIST');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setView('EDIT');
  };

  const handleCreate = () => {
    setEditingId(null);
    setView('EDIT');
  };

  const handleBack = () => {
    setView('LIST');
  };

  const handleSaved = () => {
    setView('LIST');
  };

  if (view === 'EDIT') {
    return (
      <EntityEditor 
        entityId={editingId}
        entityType="RESEARCH_PUBLICATION" 
        onBack={handleBack} 
        onSaved={handleSaved} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <EntityList 
        title="Research & Publications" 
        entityType="RESEARCH_PUBLICATION"
        onEdit={handleEdit} 
        onCreate={handleCreate} 
      />
    </div>
  );
}
