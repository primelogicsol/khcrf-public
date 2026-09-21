'use client';
import React, { useState } from 'react';
import { EntityList } from '@/components/institutional-cms/EntityList';
import { EntityEditor } from '@/components/institutional-cms/EntityEditor';

export default function InstitutionalCMSOverview() {
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
        onBack={handleBack} 
        onSaved={handleSaved} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 border border-gray-200 shadow-sm border-l-4 border-l-[#D4AF37]">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Entities</div>
          <div className="text-3xl font-serif text-[#3E2723]">Manage All</div>
        </div>
        <div className="bg-white p-6 border border-gray-200 shadow-sm">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Unverified</div>
          <div className="text-3xl font-serif text-red-700">Review Required</div>
        </div>
      </div>
      
      <EntityList 
        title="Global Knowledge Graph" 
        onEdit={handleEdit} 
        onCreate={handleCreate} 
      />
    </div>
  );
}
