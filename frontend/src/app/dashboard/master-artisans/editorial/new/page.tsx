'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateEditorialSeriesPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    coverImage: '',
    status: 'PLANNED',
    accessLevel: 'PUBLIC',
    publishedAt: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload: any = { ...formData };
      if (!payload.publishedAt) delete payload.publishedAt;
      else payload.publishedAt = new Date(payload.publishedAt).toISOString();
      
      const res = await fetch('/api/master-artisans/admin/editorial-series', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Failed to create series');
      
      const data = await res.json();
      router.push(`/dashboard/master-artisans/editorial/${data.id || data.data?.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/master-artisans/editorial" className="text-blue-600 hover:underline">&larr; Back</Link>
        <h1 className="text-2xl font-bold">Create Editorial Series</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white border rounded p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input required type="text" className="w-full border rounded px-3 py-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <input required type="text" className="w-full border rounded px-3 py-2" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subtitle</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea className="w-full border rounded px-3 py-2 h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cover Image URL</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status *</label>
            <select className="w-full border rounded px-3 py-2" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="PLANNED">Planned</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Access Level *</label>
            <select className="w-full border rounded px-3 py-2" value={formData.accessLevel} onChange={e => setFormData({...formData, accessLevel: e.target.value})}>
              <option value="PUBLIC">Public</option>
              <option value="REGISTERED_USERS">Registered Users</option>
              <option value="MEMBERS_ONLY">Members Only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Published At</label>
            <input type="datetime-local" className="w-full border rounded px-3 py-2" value={formData.publishedAt} onChange={e => setFormData({...formData, publishedAt: e.target.value})} />
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Series'}
          </button>
        </div>
      </form>
    </div>
  );
}
