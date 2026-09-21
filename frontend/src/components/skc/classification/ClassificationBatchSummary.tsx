import React from 'react';

export function ClassificationBatchSummary({ selectedCount, batchLimit }: { selectedCount: number, batchLimit: number }) {
  return (
    <div className="bg-muted p-4 rounded-md flex justify-between items-center">
      <span className="text-sm font-medium">Batch Selection</span>
      <span className="text-sm text-muted-foreground">
        {selectedCount} of {batchLimit} max records selected
      </span>
    </div>
  );
}
