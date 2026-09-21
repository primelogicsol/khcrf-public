"use client";
import React from 'react';
import Link from 'next/link';

export default function SkcLifecycleBanner({ lifecycleData, currentStageCode }: { lifecycleData: any[], currentStageCode: string }) {
  const currentIndex = lifecycleData.findIndex((s) => s.code === currentStageCode);
  const prevStage = currentIndex > 0 ? lifecycleData[currentIndex - 1] : null;
  const nextStage = currentIndex < lifecycleData.length - 1 ? lifecycleData[currentIndex + 1] : null;

  return (
    <div className="bg-white border-y border-gray-200 py-6 mb-8 w-full shadow-sm">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-1/3 flex justify-start">
          {prevStage ? (
            <Link href={prevStage.path} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold text-gray-600 transition flex items-center gap-2">
              <span>←</span> Previous Phase
            </Link>
          ) : <div />}
        </div>
        <div className="w-full md:w-1/3 flex justify-center text-center">
          <div data-editorial-accent-text className="text-xs font-black  uppercase tracking-widest mb-1">Current Phase</div>
          <h2 className="text-xl font-black text-brand-dark">{lifecycleData[currentIndex]?.title}</h2>
        </div>
        <div className="w-full md:w-1/3 flex justify-end">
          {nextStage ? (
            <Link href={nextStage.path} className="px-4 py-2 bg-brand-primary text-white hover:bg-brand-secondary rounded-lg text-sm font-bold transition flex items-center gap-2 shadow-sm">
              Next Phase <span>→</span>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
