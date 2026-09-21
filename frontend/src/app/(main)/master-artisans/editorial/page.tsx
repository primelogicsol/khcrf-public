'use client';
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { editorialSeriesHeroFallback } from '@/config/heroFallbacks';

const API_BASE_URL = getBaseUrlNoApi();

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch series');
  }
  const data = await res.json();
  return Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type StoryItem = AnyObject;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SeriesItem = AnyObject;

export default function EditorialSeries() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: seriesList, error, isLoading } = useSWR(`${API_BASE_URL}/api/master-artisans/editorial-series`, fetcher);

  // Exclude non-active series if backend doesn't already
  const validSeries = (seriesList || []).filter((s: AnyObject) => s.status === 'ACTIVE' || s.status === 'COMPLETED');

  const filters = ['All Series', 'Planned', 'In Development', 'Forthcoming', 'Published'];

  const filteredSeries = validSeries.filter((s: AnyObject) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Active') return s.status === 'ACTIVE';
    if (activeFilter === 'Completed') return s.status === 'COMPLETED';
    return true;
  });

  const totalPages = Math.ceil(filteredSeries.length / itemsPerPage);
  const paginatedSeries = filteredSeries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans">
      <UniversalEditorialHero pageKey="editorial-series" fallbackConfig={editorialSeriesHeroFallback as AnyObject} />
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-5xl py-16">

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => { setActiveFilter(f); setCurrentPage(1); }}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                activeFilter === f ? 'bg-[#3E2723] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#3E2723] hover:text-[#3E2723]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="w-full flex justify-center py-40">
            <div className="w-12 h-12 border-4 border-[#3E2723] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="w-full py-24 text-center">
            <div className="inline-block bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-md shadow-sm">
              <h3 className="text-lg font-bold mb-2">Failed to load series</h3>
              <p className="text-sm font-mono bg-white p-2 mt-2 rounded border border-red-100">{error.message}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredSeries.length === 0 && (
          <div className="w-full py-24 text-center">
            <p className="text-gray-400 font-serif text-2xl italic">No editorial series found.</p>
          </div>
        )}

        <div className="space-y-12 mb-16">
          {!isLoading && !error && paginatedSeries.map((s: AnyObject, idx: number) => (
            <div key={s.id || idx} className="bg-white border border-[#3E2723]/10 shadow-sm flex flex-col md:flex-row gap-8 p-8 hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#3E2723] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                {s.status}
              </div>
              <div className="w-full md:w-1/3">
                {s.coverImage && (
                   <div className="relative aspect-video mb-4 w-full">
                     <Image src={s.coverImage} alt={s.title} fill className="object-cover" />
                   </div>
                )}
                <h2 className="text-2xl font-serif text-[#3E2723] mb-4 leading-tight">{s.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">{s.description || s.subtitle || ''}</p>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  {s.stories?.length || 0} Installments
                </div>
              </div>
              <div className="w-full md:w-2/3 bg-gray-50 p-6 border border-gray-100">
                <h4 className="text-sm font-serif text-[#3E2723] mb-4">Articles in this series:</h4>
                <div className="flex flex-col gap-3">
                  {s.stories && s.stories.length > 0 ? (
                    s.stories.sort((a: AnyObject, b: AnyObject) => a.position - b.position).map((assignment: AnyObject, a_idx: number) => {
                      const story = assignment.story;
                      return (
                        <Link href={`/master-artisans/stories/${story.slug}`} key={assignment.id || a_idx} className="text-[#3949AB] hover:text-[#D4AF37] text-sm font-medium flex items-center gap-2 transition-colors">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span> Part {a_idx + 1}: {story.title}
                        </Link>
                      );
                    })
                  ) : (
                    <div className="text-sm text-gray-400 italic">No installments published yet.</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="w-10 h-10 border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              &larr;
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 text-sm font-bold transition-colors ${
                    currentPage === i + 1 ? 'bg-[#D4AF37] text-white' : 'border border-gray-200 text-gray-500 hover:border-[#D4AF37]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="w-10 h-10 border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              &rarr;
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
