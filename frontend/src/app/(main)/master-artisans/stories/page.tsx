'use client';
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { latestStoriesHeroFallback } from '@/config/heroFallbacks';

const API_BASE_URL = getBaseUrlNoApi();

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch stories');
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

export default function StoriesIndex() {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const { data: stories, error, isLoading } = useSWR(`${API_BASE_URL}/api/master-artisans/editorial-stories`, fetcher);

  // Filter out any accidentally returned drafts or archives, though backend should do this
  const validStories = (stories || []).filter((s: AnyObject) => s.publicationStatus === 'PUBLISHED');

  const crafts = Array.from(new Set(validStories.map((s: AnyObject) => s.primaryCraft).filter(Boolean)));
  const filters = ['All', ...crafts] as string[];

  const filteredStories = validStories.filter((s: AnyObject) => activeFilter === 'All' || s.primaryCraft === activeFilter);

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans">
      <UniversalEditorialHero pageKey="latest-stories" fallbackConfig={latestStoriesHeroFallback as AnyObject} />
      
      <div className="container-fluid mx-auto px-4 md:px-10 py-16">
        
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
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
              <h3 className="text-lg font-bold mb-2">Failed to load stories</h3>
              <p className="text-sm font-mono bg-white p-2 mt-2 rounded border border-red-100">{error.message}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredStories.length === 0 && (
          <div className="w-full py-24 text-center">
            <p className="text-gray-400 font-serif text-2xl italic">No published stories found.</p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && !error && filteredStories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredStories.map((art: AnyObject, idx: number) => (
              <Link href={`/master-artisans/stories/${art.slug}`} key={art.id || idx} className="group cursor-pointer flex flex-col">
                <div className="relative aspect-[4/3] mb-6 overflow-hidden">
                  <Image src={art.heroImage || "/assets/images/master-artisans-hero.jpg"} alt={art.title || "Story"} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-md">
                    {art.storyType || "Artisan Story"}
                  </div>
                </div>
                <div className="flex gap-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">
                  {art.primaryCraft && <span>{art.primaryCraft}</span>}
                  {art.primaryCraft && <span>•</span>}
                  <span>{art.readingMinutes || 5} Min Read</span>
                </div>
                <h3 className="text-2xl font-serif text-[#3E2723] mb-3 group-hover:text-[#D4AF37] transition-colors leading-tight">{art.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{art.excerpt || art.subtitle || ''}</p>
                <div className="text-xs font-bold text-[#3949AB] uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors">By {art.authorDisplayName || "Editorial Team"} &rarr;</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
