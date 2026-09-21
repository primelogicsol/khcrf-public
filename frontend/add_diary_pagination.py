import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

diaries_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function WorkshopDiaries() {
  const allDiaries = [
    { title: "Morning Prep: Dye Boiling", loc: "Srinagar", time: "08:30 AM", session: "Morning" },
    { title: "Setting the Warp Threads", loc: "Kanihama", time: "09:15 AM", session: "Morning" },
    { title: "Sharpening the Chisels", loc: "Safa Kadal", time: "10:00 AM", session: "Morning" },
    { title: "Mixing the Papier-Mâché", loc: "Zadibal", time: "11:30 AM", session: "Morning" },
    { title: "Washing the Wool", loc: "Pampore", time: "01:00 PM", session: "Afternoon" },
    { title: "Reading the Afternoon Talim", loc: "Budgam", time: "03:45 PM", session: "Afternoon" },
    { title: "Polishing the Copper", loc: "Zaina Kadal", time: "05:00 PM", session: "Evening" },
    { title: "Closing the Karkhan", loc: "Downtown", time: "07:30 PM", session: "Evening" },
    { title: "Stretching the Silk", loc: "Srinagar", time: "09:00 AM", session: "Morning" },
    { title: "Dye Vat Fermentation", loc: "Pampore", time: "02:30 PM", session: "Afternoon" },
    { title: "Final Undercut Details", loc: "Safa Kadal", time: "06:15 PM", session: "Evening" },
    { title: "Sorting the Raw Pashm", loc: "Eidgah", time: "10:45 AM", session: "Morning" }
  ];

  const filters = ['All', 'Morning', 'Afternoon', 'Evening'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredDiaries = allDiaries.filter(d => activeFilter === 'All' || d.session === activeFilter);
  const totalPages = Math.ceil(filteredDiaries.length / itemsPerPage);
  const paginatedDiaries = filteredDiaries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#111111] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Workshop Diaries</h1>
            <p className="text-white/60 text-lg max-w-2xl font-light">Raw, unedited, behind-the-scenes footage capturing the authentic, daily rhythm of artisan workshops across the valley.</p>
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-12">
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
          {paginatedDiaries.map((d, i) => (
            <Link href={`/master-artisans/stories/diary-${i}`} key={i} className="group block">
              <div className="relative aspect-square bg-black overflow-hidden border border-white/10 mb-3">
                <Image src="/assets/images/master-artisans-hero.jpg" alt="Diary" fill className="object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-500 mix-blend-luminosity group-hover:mix-blend-normal" />
                <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 text-[9px] uppercase tracking-widest font-mono text-white/80 backdrop-blur-sm border border-white/10">
                  RAW FILE
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                     <svg className="w-4 h-4 ml-1 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                   </div>
                </div>
              </div>
              <h4 className="font-serif text-sm text-white group-hover:text-[#D4AF37] transition-colors truncate">{d.title}</h4>
              <div className="text-[10px] text-gray-500 mt-1">{d.loc} • {d.time}</div>
            </Link>
          ))}
          {paginatedDiaries.length === 0 && (
            <div className="col-span-full py-12 text-white/40 font-serif text-lg text-center border border-dashed border-white/10">
              No workshop footage found for this session.
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
write_page("studio/workshop-diaries", diaries_content)

print("Added pagination and filtering to Workshop Diaries.")
