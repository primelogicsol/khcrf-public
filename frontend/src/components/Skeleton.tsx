import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = '', count = 1 }: SkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <div 
      key={i} 
      className={`animate-pulse bg-gray-200 rounded-md dark:bg-gray-700 ${className}`}
    ></div>
  ));

  return <>{skeletons}</>;
}

export function TaxonomySkeleton() {
  return (
    <div className="p-4 bg-white rounded shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700 w-full mb-4">
      <Skeleton className="h-6 w-1/3 mb-4" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
      <div className="mt-6 flex space-x-2">
        <Skeleton className="h-8 w-20 rounded" />
        <Skeleton className="h-8 w-20 rounded" />
      </div>
    </div>
  );
}
