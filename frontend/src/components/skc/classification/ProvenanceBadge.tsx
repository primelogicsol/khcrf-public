import React from 'react';

export function ProvenanceBadge({ provenance }: { provenance: string }) {
  const colorMap: Record<string, string> = {
    PRODUCTION: 'bg-green-100 text-green-800',
    UNKNOWN: 'bg-yellow-100 text-yellow-800',
    TEST: 'bg-red-100 text-red-800'
  };
  const classes = colorMap[provenance] || 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>
      {provenance}
    </span>
  );
}
