"use client";

import React, { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url, {
  headers: {
    'Content-Type': 'application/json'
  }
}).then((res) => {
  if (!res.ok) throw new Error('An error occurred while fetching the data.');
  return res.json();
});

export default function TechniquesDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 20;

  // Build query string
  const query = new URLSearchParams({
    skip: (pageIndex * pageSize).toString(),
    take: pageSize.toString(),
    ...(searchTerm && { search: searchTerm })
  });

  const { data, error, isLoading, mutate } = useSWR(`/api/technique?${query.toString()}`, fetcher);
  const apiEndpoint = `/api/technique`;

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const openCreateModal = () => {
    setEditingRecord(null);
    setFormData({});
    setSubmitError('');
    setIsModalOpen(true);
  };

  const openEditModal = (record: any) => {
    setEditingRecord(record);
    setFormData(record);
    setSubmitError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const url = editingRecord ? `${apiEndpoint}/${editingRecord.id}` : apiEndpoint;
      const method = editingRecord ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save record');
      await mutate();
      setIsModalOpen(false);
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const records = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Technique Library</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={openCreateModal}>Create New</button>
      </div>

      <div className="border rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Overview</h2>
          <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
            <input 
              className="px-3 py-2 border rounded" 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded" type="button" onClick={() => setPageIndex(0)}>Search</button>
          </div>
        </div>
        <div className="p-4">
          {error ? (
             <p className="text-red-500">Failed to load data. The API server might be unreachable.</p>
          ) : isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-4">
              <table className="min-w-full divide-y">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-center text-muted-foreground py-8">
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    records.map((record: any) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">{record.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(record.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50 text-sm" onClick={() => openEditModal(record)}>Edit</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              <div className="flex justify-between items-center text-sm pt-4">
                <span>Showing {records.length} of {total} results</span>
                <div className="space-x-2">
                  <button 
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    disabled={pageIndex === 0}
                    onClick={() => setPageIndex(p => p - 1)}
                  >
                    Previous
                  </button>
                  <button 
                    className="px-3 py-1 border rounded disabled:opacity-50"
                    disabled={(pageIndex + 1) * pageSize >= total}
                    onClick={() => setPageIndex(p => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">{editingRecord ? 'Edit Record' : 'Create Record'}</h2>
            {submitError && <div className="text-red-500 mb-4">{submitError}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Data payload (JSON)</label>
                <textarea 
                  className="w-full px-3 py-2 border rounded font-mono text-sm"
                  rows={4}
                  value={JSON.stringify(formData, null, 2)}
                  onChange={e => {
                    try {
                      setFormData(JSON.parse(e.target.value));
                    } catch(err) {
                      // ignore parse errors while typing
                    }
                  }}
                  placeholder='{"canonicalEntityId": "example"}'
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" className="px-4 py-2 border rounded" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded flex items-center" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
</div>
  );
}
