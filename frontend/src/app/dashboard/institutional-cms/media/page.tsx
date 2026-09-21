'use client';
import React, { useState } from 'react';
import { MediaList } from '@/components/institutional-cms/MediaList';
import { MediaEditor } from '@/components/institutional-cms/MediaEditor';

export default function MediaCMS() {
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
      <MediaEditor 
        mediaId={editingId}
        onBack={handleBack} 
        onSaved={handleSaved} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <MediaList 
        onEdit={handleEdit} 
        onCreate={handleCreate} 
      />
    </div>
  );
}
