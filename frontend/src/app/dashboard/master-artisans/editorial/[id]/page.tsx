'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditEditorialSeriesPage({ params }: { params: any }) {
  const router = useRouter();
  const { id } = params;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    coverImage: '',
    status: 'PLANNED',
    accessLevel: 'PUBLIC',
    publishedAt: '',
    version: 0
  });
  const [stories, setStories] = useState<any[]>([]); // { storyId, position, story: { title, etc } }
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflictError, setConflictError] = useState(false);
  const [success, setSuccess] = useState(false);

  // For stories assignment
  const [searchStory, setSearchStory] = useState('');
  const [foundStories, setFoundStories] = useState<any[]>([]);

  useEffect(() => {
    fetchSeries();
  }, [id]);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/master-artisans/admin/editorial-series/${id}`);
      if (!res.ok) throw new Error('Failed to fetch series');
      const data = await res.json();
      const series = data.data || data;
      
      setFormData({
        title: series.title || '',
        slug: series.slug || '',
        subtitle: series.subtitle || '',
        description: series.description || '',
        coverImage: series.coverImage || '',
        status: series.status || 'PLANNED',
        accessLevel: series.accessLevel || 'PUBLIC',
        publishedAt: series.publishedAt ? new Date(series.publishedAt).toISOString().slice(0, 16) : '',
        version: series.version || 0
      });
      setStories(series.stories || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setConflictError(false);
    setSuccess(false);

    try {
      const payload: any = { ...formData };
      if (!payload.publishedAt) payload.publishedAt = null;
      else payload.publishedAt = new Date(payload.publishedAt).toISOString();

      const res = await fetch(`/api/master-artisans/admin/editorial-series/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.status === 409) {
        setConflictError(true);
        throw new Error('Conflict: Someone else updated this series. Please refresh to see the latest changes.');
      }
      
      if (!res.ok) throw new Error('Failed to update series');
      
      const data = await res.json();
      const updated = data.data || data;
      setFormData(prev => ({ ...prev, version: updated.version }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSearchStory = async () => {
    if (!searchStory) return;
    try {
      const res = await fetch(`/api/master-artisans/admin/stories?search=${encodeURIComponent(searchStory)}`);
      if (res.ok) {
        const data = await res.json();
        setFoundStories(data.data || data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const assignStory = async (storyId: string) => {
    if (stories.some(s => s.storyId === storyId)) return; // prevent duplicate assignment
    try {
      const res = await fetch(`/api/master-artisans/admin/editorial-series/${id}/stories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId })
      });
      if (res.ok) {
        fetchSeries(); // Reload to get updated stories array
        setFoundStories([]);
        setSearchStory('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeStory = async (storyId: string) => {
    try {
      const res = await fetch(`/api/master-artisans/admin/editorial-series/${id}/stories/${storyId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setStories(stories.filter(s => s.storyId !== storyId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const moveStory = async (index: number, direction: number) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === stories.length - 1) return;

    const newStories = [...stories];
    const temp = newStories[index];
    newStories[index] = newStories[index + direction];
    newStories[index + direction] = temp;

    setStories(newStories);

    const order = newStories.map(s => s.storyId);
    try {
      await fetch(`/api/master-artisans/admin/editorial-series/${id}/stories/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order })
      });
    } catch (err) {
      console.error(err);
      fetchSeries(); // revert on failure
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/master-artisans/editorial" className="text-blue-600 hover:underline">&larr; Back</Link>
        <h1 className="text-2xl font-bold">Edit Editorial Series</h1>
      </div>

      {error && (
        <div className={`p-4 rounded mb-6 ${conflictError ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-600'}`}>
          {error}
          {conflictError && (
            <button type="button" onClick={fetchSeries} className="ml-4 underline font-medium">Reload Data</button>
          )}
        </div>
      )}
      
      {success && <div className="bg-green-50 text-green-700 p-4 rounded mb-6">Series updated successfully!</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Series Details</h2>
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

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Published At</label>
              <input type="datetime-local" className="w-full border rounded px-3 py-2" value={formData.publishedAt} onChange={e => setFormData({...formData, publishedAt: e.target.value})} />
            </div>

            <div className="pt-4 border-t flex justify-between items-center">
              <span className="text-sm text-gray-500">Version: {formData.version}</span>
              <button type="submit" disabled={saving || conflictError} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Installments Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Installments</h2>
          
          <div className="bg-white border rounded p-6 shadow-sm mb-6">
            <h3 className="font-medium mb-2">Assign a Story</h3>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Search stories by title..." 
                className="flex-grow border rounded px-3 py-2"
                value={searchStory}
                onChange={e => setSearchStory(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearchStory()}
              />
              <button type="button" onClick={handleSearchStory} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Search
              </button>
            </div>
            {foundStories.length > 0 && (
              <ul className="border rounded divide-y max-h-48 overflow-y-auto">
                {foundStories.map(fs => (
                  <li key={fs.id} className="p-3 flex justify-between items-center hover:bg-gray-50">
                    <span className="text-sm font-medium truncate pr-2">{fs.title}</span>
                    <button 
                      type="button" 
                      onClick={() => assignStory(fs.id)}
                      disabled={stories.some(s => s.storyId === fs.id)}
                      className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded disabled:opacity-50 disabled:bg-gray-50 disabled:text-gray-400"
                    >
                      {stories.some(s => s.storyId === fs.id) ? 'Assigned' : 'Assign'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white border rounded p-6 shadow-sm">
            <h3 className="font-medium mb-4">Current Installments ({stories.length})</h3>
            {stories.length === 0 ? (
              <p className="text-sm text-gray-500">No stories assigned yet.</p>
            ) : (
              <ul className="space-y-3">
                {stories.map((s, index) => (
                  <li key={s.storyId} className="flex items-center gap-3 p-3 border rounded bg-gray-50 group">
                    <div className="flex flex-col gap-1 text-gray-400">
                      <button type="button" onClick={() => moveStory(index, -1)} disabled={index === 0} className="hover:text-black disabled:opacity-30">▲</button>
                      <button type="button" onClick={() => moveStory(index, 1)} disabled={index === stories.length - 1} className="hover:text-black disabled:opacity-30">▼</button>
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium truncate">{s.story?.title || 'Unknown Story'}</p>
                      <p className="text-xs text-gray-500 truncate">{s.story?.slug || s.storyId}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeStory(s.storyId)}
                      className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
