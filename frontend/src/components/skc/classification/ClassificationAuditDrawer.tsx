'use client';

import React from 'react';

interface Props {
  record: any;
  onClose: () => void;
}

export function ClassificationAuditDrawer({ record, onClose }: Props) {
  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-background shadow-2xl border-l flex flex-col z-50 transform transition-transform duration-300">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-bold text-lg">Audit Record Details</h2>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">&times;</button>
      </div>
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        <div>
          <p className="text-sm text-muted-foreground">Entity Type</p>
          <p className="font-medium">{record.entityType}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Record ID</p>
          <p className="font-medium break-all">{record.recordId}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Previous Provenance</p>
            <p className="font-semibold text-red-600">{record.previousProvenance}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">New Provenance</p>
            <p className="font-semibold text-green-600">{record.newProvenance}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Administrator</p>
          <p className="font-medium">{record.actorId}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Classification Timestamp</p>
          <p className="font-medium">{new Date(record.createdAt).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Reason</p>
          <div className="mt-1 p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
            {record.reason || 'No reason provided.'}
          </div>
        </div>
        {record.batchId && (
          <div>
            <p className="text-sm text-muted-foreground">Batch ID</p>
            <p className="font-mono text-xs text-muted-foreground break-all">{record.batchId}</p>
          </div>
        )}
      </div>
      <div className="p-4 border-t bg-muted/50 text-xs text-muted-foreground text-center">
        Audit entries are read-only and immutable.
      </div>
    </div>
  );
}
