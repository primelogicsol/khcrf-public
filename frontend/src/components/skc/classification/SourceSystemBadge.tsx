import React from 'react';

export function SourceSystemBadge({ source }: { source: string }) {
  return (
    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
      {source}
    </span>
  );
}
