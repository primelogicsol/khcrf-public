'use client';
import React, { useState, useCallback } from 'react';
import useSWR, { mutate as globalMutate } from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

// ─── Fetcher uses the authenticated axios client ─────────────────────────────
const fetcher = (url: string) =>
  api.get(url).then(r => Array.isArray(r.data) ? r.data : (r.data?.data ?? []));

const ADMIN_URL = '/magazine-issues/admin';

// ─── Status badge colours ────────────────────────────────────────────────────
const statusColour: Record<string, string> = {
  PUBLISHED: 'bg-emerald-100 text-emerald-800',
  DRAFT:     'bg-yellow-100  text-yellow-800',
  ARCHIVED:  'bg-gray-100    text-gray-600',
  SCHEDULED: 'bg-blue-100    text-blue-800',
};
const visColour: Record<string, string> = {
  PUBLIC:       'bg-sky-100    text-sky-800',
  MEMBERS_ONLY: 'bg-purple-100 text-purple-800',
  HIDDEN:       'bg-red-100    text-red-700',
};

// ─── Confirm + action helper ──────────────────────────────────────────────────
function useIssueAction() {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (
    id: string,
    label: string,
    fn: () => Promise<void>,
    confirm?: string,
  ) => {
    if (confirm && !window.confirm(confirm)) return;
    setBusy(id + label);
    setError(null);
    try {
      await fn();
      await globalMutate(ADMIN_URL);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? e?.message ?? 'Action failed');
    } finally {
      setBusy(null);
    }
  }, []);

  return { busy, error, run };
}

export default function AdminMagazineIssues() {
  const router = useRouter();
  const { data: issues = [], isLoading, error: fetchError } = useSWR(ADMIN_URL, fetcher);
  const { busy, error: actionError, run } = useIssueAction();

  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const filtered = (issues as any[]).filter(i => {
    const matchStatus = !statusFilter || i.status === statusFilter;
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.issueNumber.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handlePublish = (id: string, title: string) =>
    run(id, 'publish', () => api.patch(`/magazine-issues/${id}/publish`),
      `Publish "${title}"? It will become visible to the public immediately.`);

  const handleArchive = (id: string, title: string) =>
    run(id, 'archive', () => api.patch(`/magazine-issues/${id}/archive`),
      `Archive "${title}"? It will be removed from all public listings.`);

  const handleDuplicate = (id: string, title: string) =>
    run(id, 'duplicate', async () => {
      const res = await api.post(`/magazine-issues/${id}/duplicate`);
      const newId = res.data?.id;
      if (newId) router.push(`/dashboard/master-artisans/magazine-issues/${newId}/edit`);
    }, `Duplicate "${title}"? A draft copy will be created.`);

  const handleDelete = (id: string, title: string) =>
    run(id, 'delete', () => api.delete(`/magazine-issues/${id}`),
      `Permanently delete "${title}"? This cannot be undone.`);

  return (
    <div className="p-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Magazine Issues</h1>
          <p className="text-gray-500 mt-1 text-sm">Master Artisans / Magazine Issues</p>
        </div>
        <Link
          href="/dashboard/master-artisans/magazine-issues/create"
          className="bg-black text-white px-6 py-2.5 rounded font-medium hover:bg-gray-800 transition-colors text-sm whitespace-nowrap"
        >
          + New Issue
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by title or issue number…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">All Statuses</option>
          {['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Error banner */}
      {(fetchError || actionError) && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
          {fetchError ? 'Failed to load issues. Check your connection.' : actionError}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 min-w-[900px]">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase font-bold text-xs">
            <tr>
              <th className="px-4 py-4">Cover</th>
              <th className="px-4 py-4">Issue #</th>
              <th className="px-4 py-4">Title</th>
              <th className="px-4 py-4">Edition</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Visibility</th>
              <th className="px-4 py-4">Published</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <span className="inline-block w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                  {search || statusFilter ? 'No issues match your filters.' : 'No issues yet. Create the first one.'}
                </td>
              </tr>
            ) : (
              filtered.map((issue: any) => {
                const isBusy = (label: string) => busy === issue.id + label;
                return (
                  <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                    {/* Cover */}
                    <td className="px-4 py-3">
                      <div className="relative w-10 h-14 bg-gray-100 rounded border border-gray-200 overflow-hidden shadow-sm">
                        {issue.coverImage ? (
                          <Image src={issue.coverImage} alt={issue.title} fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                        )}
                      </div>
                    </td>

                    {/* Issue number */}
                    <td className="px-4 py-3 font-mono text-xs text-gray-700 font-bold whitespace-nowrap">
                      {issue.issueNumber}
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3 max-w-xs">
                      <p className="font-semibold text-gray-900 line-clamp-2">{issue.title}</p>
                      {issue.subtitle && (
                        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{issue.subtitle}</p>
                      )}
                    </td>

                    {/* Edition */}
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {issue.edition ?? '—'}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${statusColour[issue.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {issue.status}
                      </span>
                    </td>

                    {/* Visibility */}
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${visColour[issue.visibility] ?? 'bg-gray-100 text-gray-600'}`}>
                        {issue.visibility?.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Published date */}
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                      {issue.publishedAt
                        ? new Date(issue.publishedAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })
                        : '—'}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex justify-end flex-wrap gap-2 text-xs font-medium">
                        <Link
                          href={`/dashboard/master-artisans/magazine-issues/${issue.id}/edit`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/master-artisans/issues/${issue.slug}`}
                          target="_blank"
                          className="text-gray-500 hover:text-gray-800"
                        >
                          Preview
                        </Link>
                        <button
                          onClick={() => handleDuplicate(issue.id, issue.title)}
                          disabled={!!busy}
                          className="text-gray-500 hover:text-gray-800 disabled:opacity-40"
                        >
                          {isBusy('duplicate') ? '…' : 'Duplicate'}
                        </button>
                        {issue.status !== 'PUBLISHED' && (
                          <button
                            onClick={() => handlePublish(issue.id, issue.title)}
                            disabled={!!busy}
                            className="text-emerald-600 hover:text-emerald-800 disabled:opacity-40"
                          >
                            {isBusy('publish') ? '…' : 'Publish'}
                          </button>
                        )}
                        {issue.status !== 'ARCHIVED' && (
                          <button
                            onClick={() => handleArchive(issue.id, issue.title)}
                            disabled={!!busy}
                            className="text-amber-600 hover:text-amber-800 disabled:opacity-40"
                          >
                            {isBusy('archive') ? '…' : 'Archive'}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(issue.id, issue.title)}
                          disabled={!!busy}
                          className="text-red-500 hover:text-red-700 disabled:opacity-40"
                        >
                          {isBusy('delete') ? '…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Footer count */}
        {!isLoading && filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400">
            Showing {filtered.length} of {(issues as any[]).length} issue{(issues as any[]).length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
