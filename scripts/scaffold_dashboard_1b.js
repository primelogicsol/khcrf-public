const fs = require('fs');
const path = require('path');

const sections = [
  { name: 'crafts', title: 'Craft Directory', endpoint: '/api/craft' },
  { name: 'materials', title: 'Material Registry', endpoint: '/api/material' },
  { name: 'tools', title: 'Tool Inventory', endpoint: '/api/tool' },
  { name: 'techniques', title: 'Technique Library', endpoint: '/api/technique' },
  { name: 'motifs', title: 'Motif Database', endpoint: '/api/motif' },
  { name: 'products', title: 'Product Catalogue', endpoint: '/api/product' },
  { name: 'glossary', title: 'Glossary Terms', endpoint: '/api/glossary-term' }
];

const basePath = path.join(__dirname, '..', 'frontend', 'src', 'app', 'dashboard');

sections.forEach(section => {
  const dirPath = path.join(basePath, section.name);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const pagePath = path.join(dirPath, 'page.tsx');
  
  const content = `"use client";

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

export default function ${section.name.charAt(0).toUpperCase() + section.name.slice(1).replace('-', '')}Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 20;

  // Build query string
  const query = new URLSearchParams({
    skip: (pageIndex * pageSize).toString(),
    take: pageSize.toString(),
    ...(searchTerm && { search: searchTerm })
  });

  const { data, error, isLoading } = useSWR(\`${section.endpoint}?\${query.toString()}\`, fetcher);

  const records = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">${section.title}</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Create New</button>
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
                          <button className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50 text-sm">Edit</button>
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
    </div>
  );
}
`;

  if (!fs.existsSync(pagePath)) {
    fs.writeFileSync(pagePath, content);
  }
});

console.log('Successfully scaffolded Sprint 1B Dashboard sections.');
