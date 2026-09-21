"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const fetcher = (url: string) => fetch(url, {
  headers: {
    // Assuming token is handled globally or via next-auth
    'Content-Type': 'application/json'
  }
}).then((res) => {
  if (!res.ok) throw new Error('An error occurred while fetching the data.');
  return res.json();
});

export default function MediaDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 20;

  // Build query string
  const query = new URLSearchParams({
    skip: (pageIndex * pageSize).toString(),
    take: pageSize.toString(),
    ...(searchTerm && { search: searchTerm })
  });

  const { data, error, isLoading, mutate } = useSWR(`/api/media?${query.toString()}`, fetcher);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', publicUrl: '', mediaType: 'IMAGE', caption: '' });

  const handleOpenCreate = () => {
    setEditingAsset(null);
    setFormData({ title: '', publicUrl: '', mediaType: 'IMAGE', caption: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: any) => {
    setEditingAsset(record);
    setFormData({
      title: record.title || '',
      publicUrl: record.publicUrl || '',
      mediaType: record.mediaType || 'IMAGE',
      caption: record.caption || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = editingAsset ? `/media/${editingAsset.id}` : `/media`;
      const payload = {
        ...formData,
        storageProvider: 'EXTERNAL',
        fileName: formData.title || 'external_asset'
      };
      
      if (editingAsset) {
        await api.patch(endpoint, payload);
      } else {
        await api.post(endpoint, payload);
      }
      setIsModalOpen(false);
      mutate();
    } catch (err) {
      console.error(err);
      toast.error('Error saving asset');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    try {
      await api.delete(`/media/${id}`);
      mutate();
    } catch (err) {
      console.error(err);
      toast.error('Error deleting asset');
    }
  };

  const records = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Media Assets Registry</h1>
        <button onClick={handleOpenCreate} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create New</button>
      </div>

      <div className="border rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Overview</h2>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <input className="px-3 py-2 border rounded" 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded" type="button"  onClick={() => setPageIndex(0)}>Search</button>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title / Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {records.length === 0 ? (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap  colSpan={3}  text-center text-muted-foreground py-8">
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    records.map((record: any) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">{record.id.substring(0, 8)}...</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{record.title || 'Untitled'}</div>
                          <div className="text-sm text-gray-500">{record.mediaType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(record.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <button onClick={() => handleOpenEdit(record)} className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Edit</button>
                          <button onClick={() => handleDelete(record.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              {/* Pagination Controls */}
              <div className="flex justify-between items-center text-sm">
                <span>Showing {records.length} of {total} results</span>
                <div className="space-x-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded" 
                     
                     
                    disabled={pageIndex === 0}
                    onClick={() => setPageIndex(p => p - 1)}
                  >
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded" 
                     
                    
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4">{editingAsset ? 'Edit Media Asset' : 'Create Media Asset'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required type="text" className="w-full px-3 py-2 border rounded" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Public URL</label>
                <input required type="url" className="w-full px-3 py-2 border rounded" value={formData.publicUrl} onChange={e => setFormData({ ...formData, publicUrl: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select className="w-full px-3 py-2 border rounded" value={formData.mediaType} onChange={e => setFormData({ ...formData, mediaType: e.target.value })}>
                  <option value="IMAGE">Image</option>
                  <option value="VIDEO">Video</option>
                  <option value="AUDIO">Audio</option>
                  <option value="DOCUMENT">Document</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full px-3 py-2 border rounded" rows={3} value={formData.caption} onChange={e => setFormData({ ...formData, caption: e.target.value })}></textarea>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
