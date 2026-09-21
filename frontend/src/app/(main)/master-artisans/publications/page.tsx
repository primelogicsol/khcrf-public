'use client';
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import useSWR from 'swr';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { magazineIssuesHeroFallback } from '@/config/heroFallbacks';

const API_BASE_URL = getBaseUrlNoApi();

interface RawIssue {
  issueNumber?: number;
  title?: string;
  slug?: string;
  coverImage?: string;
  edition?: string;
  publishedAt?: string;
  shortDescription?: string;
  subtitle?: string;
  visibility?: string;
  featuredCraft?: string;
  status?: string;
}

interface IssueItem {
  num?: number;
  title?: string;
  slug?: string;
  img?: string;
  season: string;
  year: string;
  desc?: string;
  status?: string;
  featuredCraft?: string;
  isPublished: boolean;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API Error ${res.status}: ${text || res.statusText}`);
  }
  const data = await res.json();
  const arr = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
  
  const validIssues = arr.filter((issue: RawIssue) => issue.status === 'PUBLISHED');

  return validIssues.map((item: RawIssue) => {
    // Safely extract year from edition (e.g. 'Spring 2026' or just '2026') or publishedAt
    let parsedYear = '';
      // Map Master Artisan Dossier to Artisan Dossier for display
      if (item.issueOverview === 'Master Artisan Dossier') item.issueOverview = 'Artisan Dossier';
    let parsedSeason = '';
    
    if (item.edition && typeof item.edition === 'string' && item.edition.trim() !== '') {
      const parts = item.edition.trim().split(' ');
      if (parts.length > 1) {
        parsedSeason = parts[0];
        parsedYear = parts[1];
      } else {
        parsedYear = parts[0];
      }
    } else if (item.publishedAt && typeof item.publishedAt === 'string') {
      const year = new Date(item.publishedAt).getFullYear();
      if (!isNaN(year)) parsedYear = year.toString();
    }
    
    return {
      num: item.issueNumber,
      title: item.title,
      slug: item.slug,
      img: item.coverImage,
      season: parsedSeason,
      year: parsedYear,
      desc: item.shortDescription || item.subtitle,
      status: item.visibility,
        heroEyebrow: item.issueOverview,
      featuredCraft: item.featuredCraft,
      isPublished: item.status === 'PUBLISHED'
    };
  });
};

export default function EditorialIssuesIndex() {
  const [activeFilter, setActiveFilter] = useState('All Publications');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const filterParam = params.get('filter');
      if (filterParam) {
        setActiveFilter(filterParam);
        setCurrentPage(1);
      }
    }
  }, []);
  const itemsPerPage = 7; // 1 featured + 6 standard per page
  const DEFAULT_ISSUE_EYEBROW = "Quarterly Review";
  
  const { data: allIssues = [], isLoading, error } = useSWR('/api/backend/v1/magazine-issues', fetcher);
  
  // Years derived exclusively from live data — no hardcoded fallbacks
  const availableYears = Array.from(
    new Set(
      allIssues
        .map((iss: IssueItem) => Number(iss.year))
        .filter((y): y is number => typeof y === 'number' && Number.isFinite(y))
    )
  )
    .sort((a, b) => b - a)
    .map(String);
  const filters = ['All Publications', 'Quarterly Review', 'Special Editions', 'Craft Monographs', 'Artisan Dossiers', ...availableYears];

  // Server already filters to PUBLISHED + non-HIDDEN; isPublished check is redundant but kept as defensive layer
  const filteredIssues = allIssues.filter((iss: IssueItem) => {
    if (activeFilter === 'All Publications') return true;
    if (availableYears.includes(activeFilter)) return iss.year === activeFilter;
    const eyebrow = iss.heroEyebrow?.trim() || 'Quarterly Review';
    if (activeFilter === 'Special Editions') return eyebrow === 'Special Edition';
    if (activeFilter === 'Craft Monographs') return eyebrow === 'Craft Monograph';
    if (activeFilter === 'Artisan Dossiers') return eyebrow === 'Artisan Dossier' || eyebrow === 'Master Artisan Dossier';
    if (activeFilter === 'Quarterly Review') return eyebrow === 'Quarterly Review';
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filteredIssues.length / itemsPerPage));
  const paginatedIssues = filteredIssues.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
    show: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <main className="w-full bg-white min-h-screen text-black font-sans selection:bg-[#FFCC00] selection:text-black">
      <UniversalEditorialHero pageKey="magazine-issues" fallbackConfig={magazineIssuesHeroFallback} />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* NatGeo Style Filters */}
        <div className="flex flex-wrap items-center gap-8 md:gap-14 mb-16 border-b border-gray-200 pb-5">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => { setActiveFilter(f); setCurrentPage(1); }}
              className={`relative text-sm md:text-base font-bold uppercase tracking-[0.15em] transition-colors duration-500 ${
                activeFilter === f ? 'text-black' : 'text-gray-400 hover:text-black'
              }`}
            >
              {f}
              {activeFilter === f && (
                <motion.div 
                  layoutId="activeFilterNatGeo" 
                  className="absolute -bottom-[21px] left-0 right-0 h-[4px] bg-[#FFCC00]" 
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="w-full flex justify-center py-40">
            <div className="w-12 h-12 border-4 border-[#FFCC00] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="w-full py-24 text-center">
            <div className="inline-block bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-md shadow-sm">
              <h3 className="text-lg font-bold mb-2">Failed to load publications</h3>
              <p className="text-sm font-mono bg-white p-2 mt-2 rounded border border-red-100">{error.message || 'Unknown network error'}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Cinematic Asymmetrical Grid */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              key={activeFilter + currentPage}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[450px] gap-6 mb-20"
            >
              <AnimatePresence mode="popLayout">
                {paginatedIssues.map((issue: IssueItem, index: number) => {
                  const isFeatured = index === 0 && currentPage === 1;
                  
                  return (
                    <motion.div 
                      key={issue.num || issue.title || index} 
                      variants={itemVariants} 
                      layout
                      className={`group relative overflow-hidden bg-black ${isFeatured ? 'md:col-span-2 lg:row-span-2 lg:col-span-2' : 'col-span-1 row-span-1'}`}
                    >
                      <Link href={`/master-artisans/publications/${issue.slug || ''}`} className="block w-full h-full">
                        
                        {/* Immersive Image with Slow Zoom */}
                        <Image 
                          src={issue.img || '/images/hero-bg.jpg'} 
                          alt={issue.title || 'Archive Issue Cover'} 
                          fill 
                          className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 opacity-70 group-hover:opacity-100" 
                        />
                        
                        {/* Iconic Yellow Border on Hover */}
                        <div className="absolute inset-0 border-[8px] border-transparent group-hover:border-[#FFCC00] transition-colors duration-500 z-20 pointer-events-none"></div>

                        {/* Heavy Cinematic Gradient */}
                        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 z-10 transition-opacity duration-700 group-hover:opacity-100"></div>
                        
                        {/* Top Badge */}
                        <div className="absolute top-6 left-6 z-20">
                          <div className="bg-[#FFCC00] text-black text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1 inline-block">
                            Issue {issue.num}
                          </div>
                        </div>

                        {/* Bottom Metadata & Title */}
                        <div className={`absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8 ${isFeatured ? 'lg:p-14' : ''}`}>
                          <div className="text-[#FFCC00] text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                            <span>{[issue.season, issue.year].filter(Boolean).join(' ')}</span>
                            <div className="h-[1px] w-8 bg-[#FFCC00]/50"></div>
                            <span>{issue.heroEyebrow?.trim() || DEFAULT_ISSUE_EYEBROW}</span>
                          </div>
                          
                          <h3 className={`text-white font-serif leading-[1.1] mb-4 transition-colors duration-500 ${isFeatured ? 'text-4xl md:text-5xl lg:text-7xl group-hover:text-[#FFCC00]' : 'text-2xl md:text-3xl group-hover:text-[#FFCC00]'}`}>
                            {issue.title}
                          </h3>
                          
                          {/* Only show description on the featured massive card or fade it in on hover for small cards */}
                          {isFeatured ? (
                            <p className="text-gray-200 text-sm md:text-lg max-w-2xl font-sans leading-relaxed border-l-2 border-[#FFCC00] pl-4 mt-6">
                              {issue.desc}
                            </p>
                          ) : (
                            <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-700 opacity-0 group-hover:opacity-100 mt-4">
                              <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                                {issue.desc}
                              </p>
                            </div>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {paginatedIssues.length === 0 && (
                <div className="col-span-full py-24 text-center">
                  <p className="text-gray-400 font-serif text-2xl italic">No publications found for this period.</p>
                  {error && <p className="text-red-500 mt-4">Error loading data: {error.message || String(error)}</p>}
                </div>
              )}
            </motion.div>

            {/* Stark Editorial Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center border-t border-black pt-8 mt-12">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="text-sm font-bold uppercase tracking-[0.2em] text-black hover:text-[#FFCC00] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  &larr; Previous
                </button>
                
                <div className="flex gap-6 text-sm font-bold tracking-widest">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`transition-colors duration-300 ${
                        currentPage === i + 1 ? 'text-black border-b-2 border-[#FFCC00] pb-1' : 'text-gray-400 hover:text-black'
                      }`}
                      aria-label={`Page ${i + 1}`}
                    >
                      0{i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="text-sm font-bold uppercase tracking-[0.2em] text-black hover:text-[#FFCC00] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
