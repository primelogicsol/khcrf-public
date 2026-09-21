import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

demos_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CraftDemonstrations() {
  const allDemos = [
    { title: "Mastering the Chisel: Undercut Carving", artisan: "Ali Mohammad", craft: "Walnut Carving", dur: "30 Min", level: "Advanced", desc: "A detailed breakdown of how to achieve three-dimensional depth on a single block of walnut wood without breaking the grain." },
    { title: "The Sozni Double Stitch", artisan: "Fatima Begum", craft: "Sozni Embroidery", dur: "18 Min", level: "Intermediate", desc: "An over-the-shoulder view of the precise double-sided needlework required for reversible Pashmina shawls." },
    { title: "Spinning on the Yander", artisan: "Hajira Begum", craft: "Pashmina", dur: "22 Min", level: "Beginner", desc: "Understanding the tension, rhythm, and posture required to spin 15-micron raw Pashm wool on a traditional wheel." },
    { title: "Tinning (Kalai) the Copper", artisan: "Umar Farooq", craft: "Copperware", dur: "15 Min", level: "Intermediate", desc: "The chemical process and safety techniques for applying food-safe tin linings to oxidized copper vessels." },
    { title: "Reading the Talim Script", artisan: "Ghulam Hassan", craft: "Kani Weaving", dur: "45 Min", level: "Advanced", desc: "A complex masterclass on deciphering the shorthand color codes and translating them into physical loom movements." },
    { title: "Pounding the Sakhta", artisan: "Tariq Bhat", craft: "Papier-Mâché", dur: "12 Min", level: "Beginner", desc: "The foundational step of Kashmiri Papier-Mâché: mixing waste paper, rice glue, and copper sulphate into a durable mold." },
    { title: "Applying 24k Gold Naqashi", artisan: "Zahid Dar", craft: "Papier-Mâché", dur: "28 Min", level: "Advanced", desc: "The delicate brushwork and breathing techniques required to apply authentic gold leaf to intricate floral patterns." },
    { title: "The Art of Namda Felting", artisan: "Zareena Bano", craft: "Namda Felting", dur: "25 Min", level: "Intermediate", desc: "Compressing raw wool fibers using soap, water, and sheer physical force to create the dense Central Asian rugs." }
  ];

  const filters = ['All', 'Walnut Carving', 'Sozni Embroidery', 'Pashmina', 'Copperware', 'Kani Weaving', 'Papier-Mâché', 'Namda Felting'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredDemos = allDemos.filter(d => activeFilter === 'All' || d.craft === activeFilter);
  const totalPages = Math.ceil(filteredDemos.length / itemsPerPage);
  const paginatedDemos = filteredDemos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#111111] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-6xl">
        <header className="mb-16 border-b border-white/10 pb-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Craft Demonstrations (Masterclasses)</h1>
          <p className="text-white/60 text-lg font-light">High-resolution, multi-angle instructional videos breaking down the most complex techniques in Kashmiri heritage arts.</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {paginatedDemos.map((d, i) => (
            <Link href={`/master-artisans/stories/demo-${i}`} key={i} className="group block bg-black border border-white/10 overflow-hidden hover:border-[#D4AF37] transition-colors">
              <div className="relative aspect-video">
                <Image src="/assets/images/heritage-object.jpg" alt={d.title} fill className="object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur border border-white flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] group-hover:text-[#111] transition-colors">
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                  </div>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-[#D4AF37] text-[#111] px-2 py-1 text-[9px] font-bold uppercase tracking-widest">{d.level}</span>
                  <span className="bg-black/80 backdrop-blur px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white border border-white/20">{d.dur}</span>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-2 border-b border-white/10 pb-2 inline-block">{d.craft}</div>
                <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-[#D4AF37] transition-colors">{d.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">{d.desc}</p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 relative grayscale">
                    <Image src="/assets/images/artisan-portrait.jpg" alt={d.artisan} fill className="object-cover" />
                  </div>
                  <div className="text-xs text-white/70 font-bold uppercase tracking-widest">Master: <span className="text-white">{d.artisan}</span></div>
                </div>
              </div>
            </Link>
          ))}
          {paginatedDemos.length === 0 && (
            <div className="col-span-full py-12 text-center text-white/40 font-serif text-lg border border-dashed border-white/10">
              No masterclasses found for this craft category.
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
write_page("studio/craft-demonstrations", demos_content)

print("Added pagination and filtering to Craft Demonstrations.")
