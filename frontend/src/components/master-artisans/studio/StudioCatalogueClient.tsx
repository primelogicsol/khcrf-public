'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { StudioEntity } from '@/lib/services/canonicalStudio';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { studioCatalogueHeroFallback } from '@/config/heroFallbacks';


const FILTERS = ['All Studio', 'Workshops', 'Films & Interviews', 'Oral Histories', 'Craft Demonstrations'];

export function StudioCatalogueInner({ initialRecords, defaultFilter }: { initialRecords: StudioEntity[], defaultFilter?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const urlFilter = searchParams?.get('filter');
  
  const [activeFilter, setActiveFilter] = useState(urlFilter || defaultFilter || 'All Studio');

  useEffect(() => {
    if (urlFilter && FILTERS.includes(urlFilter)) {
      setActiveFilter(urlFilter);
    }
  }, [urlFilter]);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    if (filter === 'All Studio') {
      router.push('/master-artisans/studio', { scroll: false });
    } else {
      router.push(`/master-artisans/studio?filter=${encodeURIComponent(filter)}`, { scroll: false });
    }
  };

  const filteredRecords = initialRecords.filter((record) => {
    if (activeFilter === 'All Studio') return true;
    if (activeFilter === 'Workshops') return record.studioType === 'WORKSHOP';
    if (activeFilter === 'Films & Interviews') return record.studioType === 'DOCUMENTARY_FILM' || record.studioType === 'VIDEO_INTERVIEW';
    if (activeFilter === 'Oral Histories') return record.studioType === 'ORAL_HISTORY';
    if (activeFilter === 'Craft Demonstrations') return record.studioType === 'CRAFT_DEMONSTRATION';
    return true;
  });

  return (
    <div className="bg-[#050505] min-h-screen font-sans selection:bg-[#D4AF37] selection:text-white pb-32">
      {/* Global KHCRF Hero */}
      <UniversalEditorialHero pageKey="studio-catalogue" fallbackConfig={studioCatalogueHeroFallback} />

      {/* Cinematic Filter Bar */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex overflow-x-auto hide-scrollbar">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterClick(filter)}
                className={`px-8 py-6 text-[10px] uppercase tracking-[0.25em] whitespace-nowrap transition-colors duration-300 ${
                  activeFilter === filter 
                    ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cinematic Catalogue Grid */}
      <section className="py-24 md:py-32 max-w-6xl mx-auto px-6">
        <div className={`grid gap-12 ${
          filteredRecords.length === 1 ? 'grid-cols-1 max-w-4xl mx-auto' : 
          filteredRecords.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto' : 
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {filteredRecords.map((record) => {
            let label = 'Studio Record';
            let mediaType = 'RECORD';
            switch (record.studioType) {
              case 'WORKSHOP': label = 'Workshop Documentation'; mediaType = 'WORKSHOP'; break;
              case 'DOCUMENTARY_FILM': label = 'Documentary Film'; mediaType = 'FILM'; break;
              case 'VIDEO_INTERVIEW': label = 'Video Interview'; mediaType = 'INTERVIEW'; break;
              case 'ORAL_HISTORY': label = 'Oral History'; mediaType = 'AUDIO'; break;
              case 'CRAFT_DEMONSTRATION': label = 'Craft Demonstration'; mediaType = 'DEMO'; break;
            }

            return (
              <div key={record.id} className="group flex flex-col">
                <Link href={`/master-artisans/studio/${record.slug}?returnTo=${encodeURIComponent(pathname + (urlFilter ? '?filter=' + encodeURIComponent(urlFilter) : ''))}`} className="block relative aspect-video bg-neutral-900 mb-6 overflow-hidden border border-white/10">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                  {record.mediaStatus === 'MEDIA_CONTENT_INCOMPLETE' || !record.media?.catalogueImage ? (
                    <div className="absolute inset-0 bg-[#3E2723]/30 flex flex-col items-center justify-center p-6 text-center z-0">
                      <span className="text-[#D4AF37] text-xs font-mono mb-2 uppercase tracking-widest text-center border border-[#D4AF37]/30 px-3 py-1">Incomplete</span>
                      <span className="text-gray-400 text-[9px] font-sans uppercase mt-1 tracking-[0.2em]">Canonical Image Required</span>
                    </div>
                  ) : (
                    <img src={record.media.catalogueImage.src} alt={record.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-90" />
                  )}
                  
                  {/* Cinematic Play/Audio icon depending on type */}
                  {mediaType !== 'WORKSHOP' && (
                    <div className="absolute bottom-4 right-4 z-20 w-10 h-10 bg-black/60 backdrop-blur flex items-center justify-center border border-white/20 rounded-full group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] group-hover:text-black text-white transition-all duration-300">
                      {mediaType === 'AUDIO' ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v18M8 8v8M4 11v2M16 8v8M20 11v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
                      ) : (
                        <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      )}
                    </div>
                  )}
                </Link>
                
                <div className="flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-[9px] tracking-[0.2em] uppercase text-[#D4AF37] mb-3">
                    <span>{label}</span>
                    {record.duration && (
                      <>
                        <span className="text-gray-600">·</span>
                        <span className="text-gray-400">{record.duration}</span>
                      </>
                    )}
                  </div>
                  
                  <Link href={`/master-artisans/studio/${record.slug}?returnTo=${encodeURIComponent(pathname + (urlFilter ? '?filter=' + encodeURIComponent(urlFilter) : ''))}`} className="block mb-3">
                    <h3 className="text-2xl font-serif text-gray-200 group-hover:text-white transition-colors">{record.title}</h3>
                  </Link>
                  
                  <div className="text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-4">
                    {record.media?.catalogueImage?.craft || record.location || 'Kashmir'}
                  </div>
                  
                  <p className="text-gray-400 font-serif leading-relaxed line-clamp-3 mb-6">
                    {record.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-white/10">
                    <Link href={`/master-artisans/studio/${record.slug}?returnTo=${encodeURIComponent(pathname + (urlFilter ? '?filter=' + encodeURIComponent(urlFilter) : ''))}`} className="text-[10px] tracking-[0.2em] uppercase text-gray-300 hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                      {mediaType === 'WORKSHOP' ? 'View Workshop' : mediaType === 'AUDIO' ? 'Listen to Preview' : 'Watch Preview'}
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default function StudioCatalogueClient({ initialRecords, defaultFilter }: { initialRecords: StudioEntity[], defaultFilter?: string }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <StudioCatalogueInner initialRecords={initialRecords} defaultFilter={defaultFilter} />
    </Suspense>
  );
}

