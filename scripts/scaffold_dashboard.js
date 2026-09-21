const fs = require('fs');
const path = require('path');

const sections = [
  { name: 'knowledge', title: 'Knowledge Management' },
  { name: 'taxonomy', title: 'Taxonomy Categories' },
  { name: 'relationships', title: 'Entity Relationships' },
  { name: 'verification', title: 'Verification Queue' },
  { name: 'workflow', title: 'Workflow Management' },
  { name: 'media', title: 'Media Assets Registry' },
  { name: 'source-references', title: 'Source References' }
];

const basePath = path.join(__dirname, '..', 'frontend', 'src', 'app', 'dashboard');

sections.forEach(section => {
  const dirPath = path.join(basePath, section.name);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const pagePath = path.join(dirPath, 'page.tsx');
  const content = `"use client";

import React, { useState, useEffect } from 'react';
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

export default function ${section.name.charAt(0).toUpperCase() + section.name.slice(1).replace('-', '')}Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scaffold hook
    setLoading(false);
  }, []);

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
            <Input type="text" placeholder="Search..." />
            <Button type="button" variant="secondary">Search</Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name/Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No data available. API integration pending.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
`;

  if (!fs.existsSync(pagePath)) {
    fs.writeFileSync(pagePath, content);
  }
});

console.log('Successfully scaffolded Sprint 1A Dashboard sections.');
