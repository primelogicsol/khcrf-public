'use client';
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlay, FaInfoCircle, FaSearch, FaFilter } from 'react-icons/fa';

const API_BASE_URL = getBaseUrlNoApi();

export default function StudioIndex() {
  const [allVids, setAllVids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/knowledge?entityType=KNOWLEDGE_OBJECT&take=100`).catch(() => ({ ok: false, json: () => Promise.resolve([]) }))
      .then(res => { if (!res.ok) return []; return res.json(); })
      .then(data => {
        // filter to just STUDIO_MEDIA kinds
        const vids = (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])).filter((d: any) => d.metadata?.kind === 'STUDIO_MEDIA').map((d: any) => ({
          title: d.title,
          type: d.metadata.type,
          dur: d.metadata.dur,
          tag: d.metadata.tag,
          img: d.metadata.img,
          desc: d.summary || d.metadata.desc,
          featured: d.isFeatured
        }));
        setAllVids(vids);
        setLoading(false);
      });
  }, []);

  const featuredVid = allVids.find(v => v.featured) || allVids[0];
  const filters = ['All', 'Documentary', 'Oral History', 'Demonstration', 'Video Interview', 'Workshop Diary'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVids = allVids.filter(v => {
    const matchesFilter = activeFilter === 'All' || v.type === activeFilter;
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="bg-[#0A0A0A] min-h-screen text-white font-sans selection:bg-[#D4AF37] selection:text-[#0A0A0A]">
      
      {/* Cinematic Hero (Netflix Style) */}
      <section className="relative h-[85vh] min-h-[600px] w-full flex items-end pb-24 px-4 md:px-16 overflow-hidden">
        {loading || !featuredVid ? (
          <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm tracking-widest uppercase font-bold">
            Loading Studio Archives...
          </div>
        ) : (
          <>
            <div className="absolute inset-0 z-0">
              <Image 
                src={featuredVid.img} 
                alt={featuredVid.title} 
                fill 
                className="object-cover object-center opacity-80"
                priority
              />
              
              
            </div>
            
            <div className="relative z-10 max-w-3xl">
              <div className="flex gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-[#D4AF37] mb-4 drop-shadow-md">
                <span>{featuredVid.tag}</span>
                <span className="text-white/50">•</span>
                <span>{featuredVid.dur}</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-tight drop-shadow-2xl">
                {featuredVid.title}
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed mb-10 max-w-2xl drop-shadow-md">
                {featuredVid.desc}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-black hover:bg-gray-200 px-8 py-3.5 text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-3 rounded-sm">
                  <FaPlay className="text-xs" /> Play Film
                </button>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur text-white border border-white/10 px-8 py-3.5 text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-3 rounded-sm">
                  <FaInfoCircle className="text-lg" /> More Info
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Main Content Area */}
      <div className="container-fluid mx-auto px-4 md:px-16 pb-32 -mt-8 relative z-20">
        
        {/* Navigation & Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12 bg-[#141414] p-4 rounded-sm border border-white/5 sticky top-24 z-30 shadow-2xl">
          
          <div className="flex overflow-x-auto w-full lg:w-auto gap-2 hide-scrollbar py-2">
            {filters.map(f => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap rounded-sm ${
                  activeFilter === f 
                    ? 'bg-white text-black' 
                    : 'bg-transparent text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-64">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/40">
               <FaSearch />
             </div>
             <input 
               type="text" 
               placeholder="Search studio archive..." 
               className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-sm pl-10 pr-4 py-2.5 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all placeholder-white/40"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
        </div>

        {/* Dynamic Grid */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-serif text-white">{activeFilter === 'All' ? 'Complete Archive' : activeFilter}</h2>
            <span className="text-xs text-white/40 font-mono uppercase tracking-widest">{filteredVids.length} Titles</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {filteredVids.map((v, i) => (
              <Link href="/master-artisans/studio/video-id" key={i} className="group flex flex-col h-full cursor-pointer">
                
                {/* Thumbnail */}
                <div className="relative aspect-video bg-[#1A1A1A] rounded-sm overflow-hidden mb-4 shadow-lg border border-white/5 group-hover:border-white/20 transition-colors">
                  <Image src={v.img} alt={v.title} fill className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center text-white pl-1 transform scale-75 group-hover:scale-100 transition-transform duration-500">
                      <FaPlay className="text-xl" />
                    </div>
                  </div>
                  
                  {/* Progress/Duration Bar */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                     <div className="h-full bg-[#D4AF37] w-0 group-hover:w-full transition-all duration-3000 ease-linear"></div>
                  </div>
                  
                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur text-white px-2 py-1 text-[10px] font-mono font-bold tracking-widest rounded-sm">
                    {v.dur}
                  </div>
                </div>
                
                {/* Metadata */}
                <div className="flex flex-col flex-1 px-1">
                  <div className="flex gap-2 text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold mb-2">
                    <span>{v.type}</span>
                  </div>
                  <h4 className="font-serif text-lg text-white group-hover:text-white transition-colors leading-snug mb-2">{v.title}</h4>
                  <p className="text-xs text-white/50 font-light line-clamp-2 mt-auto leading-relaxed">{v.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {filteredVids.length === 0 && (
            <div className="py-32 text-center border border-white/10 rounded-sm bg-white/5 mt-8">
              <FaFilter className="text-4xl text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-white mb-2">No titles found</h3>
              <p className="text-white/50 text-sm">Try adjusting your filters or search query.</p>
              <button 
                onClick={() => {setActiveFilter('All'); setSearchQuery('');}}
                className="mt-6 text-[#D4AF37] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
