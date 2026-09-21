'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EditorialSeriesListPage() {
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [accessLevel, setAccessLevel] = useState('');

  useEffect(() => {
    fetchSeries();
  }, [search, status, accessLevel]);

  const fetchSeries = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (status) query.append('status', status);
      if (accessLevel) query.append('accessLevel', accessLevel);

      const res = await fetch(`/api/master-artisans/admin/editorial-series?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch series');
      
      const data = await res.json();
      setSeries(data.data || data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Editorial Series</h1>
        <Link href="/dashboard/master-artisans/editorial/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Create New Series
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search..." 
          className="border rounded px-3 py-2 flex-grow"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All Statuses</option>
          <option value="PLANNED">Planned</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="COMPLETED">Completed</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <select value={accessLevel} onChange={e => setAccessLevel(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All Access Levels</option>
          <option value="PUBLIC">Public</option>
          <option value="REGISTERED_USERS">Registered Users</option>
          <option value="MEMBERS_ONLY">Members Only</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : series.length === 0 ? (
        <p className="text-gray-500">No editorial series found.</p>
      ) : (
        <div className="bg-white border rounded shadow-sm overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Access Level</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Version</th>
                <th className="px-4 py-3">Installments</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {series.map(s => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{s.title}</td>
                  <td className="px-4 py-3">{s.slug}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">{s.status}</span>
                  </td>
                  <td className="px-4 py-3">{s.accessLevel}</td>
                  <td className="px-4 py-3">{s.publishedAt ? new Date(s.publishedAt).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3">{s.updatedAt ? new Date(s.updatedAt).toLocaleDateString() : '-'}</td>
                  <td className="px-4 py-3">{s.version}</td>
                  <td className="px-4 py-3">{s.stories?.length || 0}</td>
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/master-artisans/editorial/${s.id}`} className="text-blue-600 hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
