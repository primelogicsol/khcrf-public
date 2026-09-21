"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { skcClassificationApi, ClassificationQueueParams, ClassificationQueueRecord } from '@/lib/api/skcClassification';
import { ClassificationFilters } from '@/components/skc/classification/ClassificationFilters';
import { ClassificationBatchSummary } from '@/components/skc/classification/ClassificationBatchSummary';
import { ProvenanceBadge } from '@/components/skc/classification/ProvenanceBadge';
import { SourceSystemBadge } from '@/components/skc/classification/SourceSystemBadge';
import { ClassificationPreviewDialog } from '@/components/skc/classification/ClassificationPreviewDialog';



/**
 * ClassificationQueue owns:
 * - data loading
 * - filter state
 * - pagination
 * - row selection (with single-entityType enforcement)
 * - preview dialog state
 * - post-success queue refresh
 * - preserved selection + reason on failure
 */
export function ClassificationQueue() {
  const [records, setRecords] = useState<ClassificationQueueRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedEntityType, setSelectedEntityType] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [batchLimit, setBatchLimit] = useState(100);
  const [filters, setFilters] = useState<ClassificationQueueParams>({ provenance: 'UNKNOWN' });
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchQueue = useCallback(async (currentFilters?: ClassificationQueueParams, currentPage?: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await skcClassificationApi.getQueue({ ...currentFilters, page: currentPage ?? 1 });
      setRecords(data.records ?? []);
      setTotal(data.total ?? 0);
      if (data.batchLimit) setBatchLimit(data.batchLimit);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      setError(e.response?.data?.error ?? e.message ?? 'Failed to load queue');
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchQueue(filters, page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (newFilter: ClassificationQueueParams) => {
    const updated = { ...filters, ...newFilter };
    setFilters(updated);
    setPage(1);
    setSelectedIds([]);
    setSelectedEntityType('');
    fetchQueue(updated, 1);
  };

  const toggleSelection = (id: string, entityType: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        const next = prev.filter(i => i !== id);
        if (next.length === 0) setSelectedEntityType('');
        return next;
      }
      // Enforce single entity type per batch — mixed-type batches are not supported
      if (selectedEntityType && entityType !== selectedEntityType) return prev;
      if (prev.length >= batchLimit) return prev;
      if (!selectedEntityType) setSelectedEntityType(entityType);
      return [...prev, id];
    });
  };

  const handleSuccess = () => {
    setPreviewOpen(false);
    setSelectedIds([]);
    setSelectedEntityType('');
    fetchQueue(filters, page);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mt-1">
            Records listed here are{' '}
            <strong>awaiting provenance classification</strong>.{' '}
            UNKNOWN does not mean invalid.
          </p>
        </div>
        <Link href="/dashboard/skc/classification/history" className="text-sm text-primary hover:underline whitespace-nowrap">
          View Audit History →
        </Link>
      </div>

      <ClassificationFilters onFilterChange={handleFilterChange} />

      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between">
          <ClassificationBatchSummary selectedCount={selectedIds.length} batchLimit={batchLimit} />
          <button
            id="classify-btn"
            onClick={() => setPreviewOpen(true)}
            className="ml-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
          >
            Preview &amp; Classify {selectedIds.length} Record{selectedIds.length !== 1 ? 's' : ''}
          </button>
        </div>
      )}

      {error && (
        <div
          id="queue-error"
          role="alert"
          className="p-3 bg-red-50 text-red-800 border border-red-200 rounded text-sm"
        >
          {error}
        </div>
      )}

      <div className="border rounded-lg overflow-hidden bg-background">
        <table className="w-full text-sm text-left" aria-label="Classification queue">
          <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-wide">
            <tr>
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={selectedIds.length > 0 && selectedIds.length === records.length}
                  onChange={e => {
                    if (e.target.checked) {
                      const first = records[0];
                      if (first) {
                        setSelectedEntityType(first.entityType);
                        setSelectedIds(
                          records
                            .filter(r => r.entityType === first.entityType)
                            .slice(0, batchLimit)
                            .map(r => r.id)
                        );
                      }
                    } else {
                      setSelectedIds([]);
                      setSelectedEntityType('');
                    }
                  }}
                />
              </th>
              <th className="p-3">Record</th>
              <th className="p-3">Reference</th>
              <th className="p-3">Entity Type</th>
              <th className="p-3">Provenance</th>
              <th className="p-3">Source</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  Loading queue...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground" id="queue-empty">
                  No records awaiting provenance classification.
                </td>
              </tr>
            ) : (
              records.map(record => {
                const isSelected = selectedIds.includes(record.id);
                const isDisabled =
                  !isSelected &&
                  (selectedIds.length >= batchLimit ||
                    (selectedEntityType !== '' && record.entityType !== selectedEntityType));
                return (
                  <tr
                    key={record.id}
                    className={`border-t transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/40'}`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        id={`row-${record.id}`}
                        aria-label={`Select ${record.name}`}
                        checked={isSelected}
                        onChange={() => toggleSelection(record.id, record.entityType)}
                        disabled={isDisabled}
                        className="accent-primary"
                      />
                    </td>
                    <td className="p-3 font-medium">{record.name}</td>
                    <td className="p-3 font-mono text-xs text-muted-foreground">
                      {record.referenceNumber ?? '—'}
                    </td>
                    <td className="p-3 text-xs">{record.entityType.replace(/_/g, ' ')}</td>
                    <td className="p-3">
                      <ProvenanceBadge provenance={record.dataProvenance} />
                    </td>
                    <td className="p-3">
                      <SourceSystemBadge source={record.sourceSystem ?? 'UNKNOWN'} />
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex justify-between items-center text-sm text-muted-foreground pt-2">
          <span>{total} total records</span>
          <div className="flex gap-2">
            <button
              onClick={() => { setPage(p => p - 1); fetchQueue(filters, page - 1); }}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-2">Page {page}</span>
            <button
              onClick={() => { setPage(p => p + 1); fetchQueue(filters, page + 1); }}
              disabled={records.length < 50}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {previewOpen && selectedEntityType && (
        <ClassificationPreviewDialog
          selectedIds={selectedIds}
          entityType={selectedEntityType}
          onClose={() => setPreviewOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
