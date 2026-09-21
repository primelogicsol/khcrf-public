'use client';
import React, { useState } from 'react';
import { EntityList } from '@/components/institutional-cms/EntityList';
import { EntityEditor } from '@/components/institutional-cms/EntityEditor';

const KNOWLEDGE_TYPES = [
  'CRAFT', 'MATERIAL', 'TOOL', 'TECHNIQUE', 'MOTIF', 'PRODUCT', 'GLOSSARY_TERM'
];

export default function KnowledgeCMS() {
  const [activeTab, setActiveTab] = useState(KNOWLEDGE_TYPES[0]);
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
        entityType={activeTab} 
        onBack={handleBack} 
        onSaved={handleSaved} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-6">
        {KNOWLEDGE_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition ${activeTab === type ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>
      <EntityList 
        title={`${activeTab.replace('_', ' ')} Records`}
        entityType={activeTab}
        onEdit={handleEdit} 
        onCreate={handleCreate} 
      />
    </div>
  );
}
