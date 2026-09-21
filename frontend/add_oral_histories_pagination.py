import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

oral_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function OralHistories() {
  const allHistories = [
    { title: "We used to sing the Talim", artisan: "Ghulam Nabi", loc: "Safa Kadal", date: "April 2025", dur: "12:45", desc: "Master weaver Ghulam Nabi recounts the rhythmic singing of pattern codes that once echoed through the Karkhans of Srinagar." },
    { title: "The First Time I Held a Chisel", artisan: "Ali Mohammad", loc: "Srinagar", date: "May 2025", dur: "18:20", desc: "A moving reflection on inheriting the family tools and the pressure of continuing a 200-year-old carving lineage." },
    { title: "Boiling the Madder Root", artisan: "Fatima Begum", loc: "Eidgah", date: "June 2025", dur: "09:15", desc: "Fatima discusses the secret family recipe for achieving the perfect deep red dye using alum mordants." },
    { title: "When the Looms Went Silent", artisan: "Tariq Ahmad", loc: "Kanihama", date: "July 2025", dur: "14:30", desc: "Recounting the difficult years of the 1990s when the supply of raw Pashm was cut off and many weavers abandoned their craft." },
    { title: "The Silk Road Caravan", artisan: "Naseer", loc: "Downtown", date: "Aug 2025", dur: "22:10", desc: "An elder trader discusses how raw materials were historically transported from Central Asia before modern borders." },
    { title: "Teaching the Next Generation", artisan: "Zareena Bano", loc: "Anantnag", date: "Sep 2025", dur: "16:45", desc: "A discussion on why modern youth are reluctant to take up Namda felting and how the community is adapting." },
    { title: "The Price of Copper", artisan: "Fayaz", loc: "Zaina Kadal", date: "Oct 2025", dur: "11:50", desc: "A detailed oral history of how global metal markets affect the daily lives of local engravers." },
    { title: "Surviving the Winter", artisan: "Aabida", loc: "Pampore", date: "Nov 2025", dur: "25:00", desc: "How harsh Kashmiri winters historically forced agricultural families indoors, turning them into seasonal master artisans." }
  ];

  const filters = ['All', 'Safa Kadal', 'Srinagar', 'Eidgah', 'Kanihama', 'Downtown', 'Anantnag', 'Zaina Kadal', 'Pampore'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredHistories = allHistories.filter(h => activeFilter === 'All' || h.loc === activeFilter);
  const totalPages = Math.ceil(filteredHistories.length / itemsPerPage);
  const paginatedHistories = filteredHistories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#1A1A1A] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-5xl">
        <header className="mb-16 text-center border-b border-white/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Oral Histories</h1>
          <p className="text-white/60 text-lg font-light max-w-3xl mx-auto">Preserving the unwritten memories, personal anecdotes, and historical perspectives of elder artisans before they are lost.</p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => { setActiveFilter(f); setCurrentPage(1); }}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                activeFilter === f ? 'bg-[#D4AF37] text-[#1A1A1A]' : 'bg-transparent text-white/60 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-8 mb-16">
          {paginatedHistories.map((h, i) => (
            <Link href={`/master-artisans/stories/oral-history-${i}`} key={i} className="bg-black/50 border border-white/5 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center hover:border-white/20 transition-colors group cursor-pointer block">
              <div className="w-full md:w-48 aspect-square relative flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                <Image src="/assets/images/artisan-portrait.jpg" alt={h.artisan} fill className="object-cover rounded-full p-2 border border-dashed border-white/20 group-hover:border-[#D4AF37]" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-2">Recorded: {h.date} • Location: {h.loc}</div>
                <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-[#D4AF37] transition-colors">"{h.title}"</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6 italic">
                  {h.desc}
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-white group-hover:text-[#D4AF37] transition-colors border border-white/20 px-4 py-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg> Play Audio ({h.dur})
                  </div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Transcript
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {paginatedHistories.length === 0 && (
            <div className="py-12 text-center text-white/40 font-serif text-lg border border-dashed border-white/10">
              No oral histories found for this location.
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
                    currentPage === i + 1 ? 'bg-[#D4AF37] text-[#1A1A1A]' : 'border border-white/20 text-white/60 hover:border-[#D4AF37] hover:text-[#D4AF37]'
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
write_page("studio/oral-histories", oral_content)

print("Added pagination and filtering to Oral Histories.")
