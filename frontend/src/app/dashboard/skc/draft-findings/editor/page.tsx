'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [phase, setPhase] = useState('Phase 1');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/api/skc/findings/${id}`)
        .then(res => {
          const finding = res.data.data;
          setTitle(finding.title);
          setContent(finding.content);
          setStatus(finding.status);
          setPhase(finding.phase || '');
        })
        .catch(err => {
          alert("Failed to load finding: " + err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = { title, content, status, phase };
      if (id) {
        await api.put(`/api/skc/findings/${id}`, payload);
        alert('Finding updated successfully');
      } else {
        await api.post('/api/skc/findings', payload);
        alert('Finding created successfully');
        router.push('/dashboard/skc/draft-findings');
      }
    } catch (err: any) {
      alert("Error saving: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{id ? 'Edit Draft Finding' : 'Create Draft Finding'}</h1>
      {loading ? <p>Loading...</p> : (
        <div className="space-y-4 bg-white p-6 shadow rounded">
          <div>
            <label className="block font-bold">Title</label>
            <input 
              type="text" 
              className="w-full border p-2 rounded" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
          </div>
          <div>
            <label className="block font-bold">Phase</label>
            <input 
              type="text" 
              className="w-full border p-2 rounded" 
              value={phase} 
              onChange={e => setPhase(e.target.value)} 
            />
          </div>
          <div>
            <label className="block font-bold">Status</label>
            <select 
              className="w-full border p-2 rounded" 
              value={status} 
              onChange={e => setStatus(e.target.value)}
            >
              <option value="DRAFT">DRAFT</option>
              <option value="VALIDATION">VALIDATION</option>
              <option value="EXPERT_REVIEW">EXPERT REVIEW</option>
              <option value="PUBLISHED">PUBLISHED</option>
            </select>
          </div>
          <div>
            <label className="block font-bold">Content</label>
            <textarea 
              className="w-full border p-2 rounded h-64 font-mono text-sm" 
              value={content} 
              onChange={e => setContent(e.target.value)} 
              placeholder="Enter rich text or markdown content here..."
            />
          </div>
          <div className="flex gap-4">
            <button 
              className="bg-brand-primary text-white px-4 py-2 rounded font-bold"
              onClick={handleSave}
            >
              Save Finding
            </button>
            <button 
              className="bg-gray-300 px-4 py-2 rounded font-bold"
              onClick={() => router.push('/dashboard/skc/draft-findings')}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DraftFindingEditor() {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <EditorContent />
    </Suspense>
  );
}
