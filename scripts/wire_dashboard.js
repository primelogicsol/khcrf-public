const fs = require('fs');
const path = require('path');

const sections = [
  { name: 'knowledge', title: 'Knowledge Management', endpoint: '/api/knowledge' },
  { name: 'taxonomy', title: 'Taxonomy Categories', endpoint: '/api/taxonomy' },
  { name: 'relationships', title: 'Entity Relationships', endpoint: '/api/relationship' },
  { name: 'verification', title: 'Verification Queue', endpoint: '/api/verification' },
  { name: 'workflow', title: 'Workflow Management', endpoint: '/api/workflow' },
  { name: 'media', title: 'Media Assets Registry', endpoint: '/api/media' },
  { name: 'source-references', title: 'Source References', endpoint: '/api/source-reference' }
];

const basePath = path.join(__dirname, '..', 'frontend', 'src', 'app', 'dashboard');

sections.forEach(section => {
  const pagePath = path.join(basePath, section.name, 'page.tsx');
  
  const content = `"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const fetcher = (url: string) => fetch(url, {
  headers: {
    // Assuming token is handled globally or via next-auth
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
        <Button>Create New</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="button" variant="secondary" onClick={() => setPageIndex(0)}>Search</Button>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
             <p className="text-red-500">Failed to load data. The API server might be unreachable.</p>
          ) : isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        No records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((record: any) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono text-xs">{record.id}</TableCell>
                        <TableCell>{new Date(record.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              {/* Pagination Controls */}
              <div className="flex justify-between items-center text-sm">
                <span>Showing {records.length} of {total} results</span>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={pageIndex === 0}
                    onClick={() => setPageIndex(p => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={(pageIndex + 1) * pageSize >= total}
                    onClick={() => setPageIndex(p => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
`;

  if (fs.existsSync(pagePath)) {
    fs.writeFileSync(pagePath, content);
  }
});

console.log('Successfully wired SWR to all Sprint 1A Dashboard sections.');
