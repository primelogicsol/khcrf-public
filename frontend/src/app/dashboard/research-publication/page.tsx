"use client";
import React from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ResearchPublicationDashboard() {
  const { data, error, isLoading } = useSWR('/api/research-publication', fetcher);

  if (isLoading) return <div className="p-8">Loading ResearchPublications...</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load data.</div>;

  return (
    <div className="p-8 w-full">
      <h1 className="text-2xl font-bold mb-6">ResearchPublication Management</h1>
      <div className="bg-white rounded shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-sm text-gray-600">
              <th className="p-4">ID</th>
              <th className="p-4">Canonical Title</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item: any) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-xs font-mono">{item.id.slice(0,8)}...</td>
                <td className="p-4">{item.canonicalEntity?.title || 'Unknown'}</td>
                <td className="p-4">
                  <button className="text-blue-500 hover:underline mr-4">Edit</button>
                </td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-400">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
