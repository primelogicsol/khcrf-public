"use client";

import React, { useState, useEffect } from 'react';
import { skcClassificationApi } from '@/lib/api/skcClassification';
import { ProvenanceBadge } from '@/components/skc/classification/ProvenanceBadge';
import { ClassificationAuditDrawer } from '@/components/skc/classification/ClassificationAuditDrawer';
import Link from 'next/link';

export default function SKCClassificationHistoryPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAuditRecord, setSelectedAuditRecord] = useState<any | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await skcClassificationApi.getHistory({});
      setRecords(data.records);
      setTotal(data.total ?? data.records.length);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to load history');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Classification Audit History</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Immutable, read-only log of all provenance classification decisions.{' '}
            {total > 0 && <span>{total} total entries.</span>}
          </p>
        </div>
        <Link href="/dashboard/skc/classification" className="text-sm text-primary hover:underline">
          ← Back to Queue
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded text-sm">{error}</div>
      )}

      <div className="border rounded-lg overflow-hidden bg-background">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wide">
            <tr>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Entity Type</th>
              <th className="p-3">Record ID</th>
              <th className="p-3">Previous</th>
              <th className="p-3">New</th>
              <th className="p-3">Administrator</th>
              <th className="p-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No classification history found.</td></tr>
            ) : (
              records.map(record => (
                <tr key={record.id} className="border-t hover:bg-muted/40 transition-colors">
                  <td className="p-3 text-muted-foreground">{new Date(record.classifiedAt).toLocaleString()}</td>
                  <td className="p-3 text-xs">{record.entityType.replace(/_/g, ' ')}</td>
                  <td className="p-3 font-mono text-xs">{record.recordId}</td>
                  <td className="p-3"><ProvenanceBadge provenance={record.previousProvenance} /></td>
                  <td className="p-3"><ProvenanceBadge provenance={record.newProvenance} /></td>
                  <td className="p-3">{record.classifiedBy?.name ?? record.classifiedById ?? '—'}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setSelectedAuditRecord(record)}
                      className="text-primary hover:underline text-xs"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedAuditRecord && (
        <ClassificationAuditDrawer
          record={selectedAuditRecord}
          onClose={() => setSelectedAuditRecord(null)}
        />
      )}
    </div>
  );
}
