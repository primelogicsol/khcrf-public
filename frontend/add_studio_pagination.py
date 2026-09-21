import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# 1. Documentary Films
docs_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function DocumentaryFilms() {
  const allFilms = [
    { title: "The Copper Smiths of Zaina Kadal", dur: "45 Min", tag: "Copperware", desc: "An intimate look into the guild structures and traditional hammering techniques of downtown Srinagar's copper markets." },
    { title: "Pashmina: From Changthang to Srinagar", dur: "55 Min", tag: "Pashmina", desc: "Tracing the perilous journey of raw Pashm wool from the high-altitude nomads to the spinning wheels of Kashmir." },
    { title: "The Chinar's Reflection", dur: "40 Min", tag: "Woodwork", desc: "A cinematic exploration of the undercut walnut wood carving lineage, focusing on the Najjar family's 200-year history." },
    { title: "Colors of the Earth", dur: "35 Min", tag: "Dyeing", desc: "Documenting the lost art of natural mineral and plant dyeing in the valley before synthetic alternatives took over." },
    { title: "The Silent Looms", dur: "50 Min", tag: "Carpet Weaving", desc: "A deep dive into the complex Talim reading system and the synchronized chanting of carpet weavers." },
    { title: "Molding the Sakhta", dur: "38 Min", tag: "Papier-Mâché", desc: "Following the grueling process of pounding waste paper and rice glue to create the durable base for intricate Naqashi." },
    { title: "The Namda Revival", dur: "42 Min", tag: "Wool Felting", desc: "How a small collective of women in Anantnag are keeping the ancient Central Asian felting technique alive." },
    { title: "Waguv: The River's Gift", dur: "30 Min", tag: "Reed Weaving", desc: "A short documentary on the marshland reed gatherers and the disappearing craft of traditional Kashmiri mat weaving." }
  ];

  const filters = ['All', 'Copperware', 'Pashmina', 'Woodwork', 'Carpet Weaving', 'Papier-Mâché'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredFilms = allFilms.filter(f => activeFilter === 'All' || f.tag === activeFilter);
  const totalPages = Math.ceil(filteredFilms.length / itemsPerPage);
  const paginatedFilms = filteredFilms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#111111] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-white/10 pb-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Documentary Films</h1>
          <p className="text-white/60 text-lg font-light">Cinematic deep-dives into the history, supply chains, and living communities behind Kashmir's most revered crafts.</p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => { setActiveFilter(f); setCurrentPage(1); }}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                activeFilter === f ? 'bg-[#D4AF37] text-[#111]' : 'bg-transparent text-white/60 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 max-w-5xl mx-auto">
          {paginatedFilms.map((f, i) => (
            <Link href={`/master-artisans/stories/film-${i}`} key={i} className="group block">
              <div className="relative aspect-video mb-6 bg-black border border-white/10 overflow-hidden">
                <Image src="/assets/images/heritage-object.jpg" alt={f.title} fill className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] group-hover:text-[#3E2723] transition-colors">
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  Featured Film
                </div>
              </div>
              <div className="flex justify-between items-start mb-3">
                <div className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">{f.tag}</div>
                <div className="text-xs text-gray-500 font-mono">{f.dur}</div>
              </div>
              <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-[#D4AF37] transition-colors">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </Link>
          ))}
          {paginatedFilms.length === 0 && (
            <div className="col-span-full py-12 text-white/40 font-serif text-lg text-center border border-dashed border-white/10">
              No documentary films found for this category.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              &larr;
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 text-sm font-bold transition-colors ${
                    currentPage === i + 1 ? 'bg-[#D4AF37] text-[#111]' : 'border border-white/20 text-white/60 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              &rarr;
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
"""
write_page("studio/documentary-films", docs_content)

# 2. Video Interviews
interviews_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function VideoInterviews() {
  const allInterviews = [
    { name: "Ali Mohammad", craft: "Walnut Carving", desc: "Discussing the burden and honor of inheriting a 5th-generation lineage." },
    { name: "Hajira Begum", craft: "Pashmina", desc: "Reflecting on 50 years of spinning and the meditative silence of the Yander wheel." },
    { name: "Ghulam Hassan", craft: "Kani Weaving", desc: "The Padma Shri awardee on how the Talim script was almost lost during the 1990s." },
    { name: "Zareena Bano", craft: "Namda Felting", desc: "On adapting ancient Central Asian felting techniques for modern markets." },
    { name: "Tariq Bhat", craft: "Papier-Mâché", desc: "Breaking down the exact composition of the Sakhta base material." },
    { name: "Umar Farooq", craft: "Copperware", desc: "An emerging artisan's perspective on competing with machine-pressed utensils." },
    { name: "Asiya Jan", craft: "Willow Wicker", desc: "Harvesting the specific reeds of Ganderbal and the seasonality of weaving." },
    { name: "Rifat Ara", craft: "Embroidery", desc: "The differences between Sozni and Crewel, and organizing women's collectives." },
    { name: "Naseer Bhat", craft: "Woodwork", desc: "The modern challenges of sourcing authentic Kashmiri Walnut." },
    { name: "Iqra Bano", craft: "Pashmina", desc: "A young apprentice's journey into learning the fine art of sorting raw Pashm." },
    { name: "Fayaz Ahmad", craft: "Copperware", desc: "The chemistry of tinning (Kalai) and maintaining copper vessels." },
    { name: "Zahid Dar", craft: "Papier-Mâché", desc: "Why natural gold leaf is critical for authentic Naqashi work." }
  ];

  const filters = ['All', 'Pashmina', 'Walnut Carving', 'Papier-Mâché', 'Copperware', 'Embroidery'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredInterviews = allInterviews.filter(iv => activeFilter === 'All' || iv.craft === activeFilter);
  const totalPages = Math.ceil(filteredInterviews.length / itemsPerPage);
  const paginatedInterviews = filteredInterviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#111111] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-white/10 pb-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Video Interviews</h1>
          <p className="text-white/60 text-lg font-light">Direct conversations with master artisans discussing their life journey, creative process, and thoughts on the future of their craft.</p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => { setActiveFilter(f); setCurrentPage(1); }}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                activeFilter === f ? 'bg-white text-[#111]' : 'bg-transparent text-white/60 border border-white/20 hover:border-white hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {paginatedInterviews.map((iv, i) => (
            <Link href={`/master-artisans/stories/interview-${i}`} key={i} className="group block">
              <div className="relative aspect-[4/5] bg-black mb-4 overflow-hidden border border-white/10 group-hover:border-white transition-colors">
                <Image src="/assets/images/artisan-portrait.jpg" alt={iv.name} fill className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="w-8 h-8 rounded-full bg-white text-[#111] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                  </div>
                  <h4 className="font-serif text-xl leading-tight text-white mb-1 group-hover:text-[#D4AF37] transition-colors">{iv.name}</h4>
                  <div className="text-[9px] uppercase tracking-widest text-white/70 mb-2">{iv.craft}</div>
                  <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">{iv.desc}</p>
                </div>
              </div>
            </Link>
          ))}
          {paginatedInterviews.length === 0 && (
            <div className="col-span-full py-12 text-white/40 font-serif text-lg text-center border border-dashed border-white/10">
              No interviews found for this category.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:border-white hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              &larr;
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 text-sm font-bold transition-colors ${
                    currentPage === i + 1 ? 'bg-white text-[#111]' : 'border border-white/20 text-white/60 hover:border-white hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:border-white hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              &rarr;
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
"""
write_page("studio/video-interviews", interviews_content)

print("Added pagination and filtering to Documentary Films and Video Interviews.")
