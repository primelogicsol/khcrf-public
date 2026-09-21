import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# 1. Techniques
techniques_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Techniques() {
  const allTechs = [
    { title: 'Undercut Relief (Vatta Chikan)', craft: 'Woodwork', desc: 'Carving multiple layers of depth into a single block of wood without breaking the grain.' },
    { title: 'Talim Reading (Kani Weaving)', craft: 'Weaving', desc: 'Deciphering the coded shorthand script that dictates the exact color pattern of a shawl.' },
    { title: 'Papier-Mâché Sakhta Making', craft: 'Papier-Mâché', desc: 'Pounding waste paper and rice glue into a highly durable mold.' },
    { title: 'Sozni Double Stitch', craft: 'Embroidery', desc: 'A microscopic stitch that creates identical patterns on both sides of a Pashmina.' },
    { title: 'Copper Engraving (Naqash)', craft: 'Metalwork', desc: 'Hammering and chiseling intricate floral motifs into oxidized copper.' },
    { title: 'Namda Felting', craft: 'Textiles', desc: 'Friction-pressing raw wool fibers into a dense, un-woven rug.' },
    { title: 'Khatam-band Geometry', craft: 'Woodwork', desc: 'Interlocking faceted wood pieces for ceilings without using a single nail.' },
    { title: 'Crewel Chain Stitch', craft: 'Embroidery', desc: 'Using an awl (aari) to create continuous raised chain stitches on thick wool.' }
  ];

  const filters = ['All', 'Woodwork', 'Weaving', 'Papier-Mâché', 'Embroidery', 'Metalwork', 'Textiles'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredTechs = allTechs.filter(t => activeFilter === 'All' || t.craft === activeFilter);
  const totalPages = Math.ceil(filteredTechs.length / itemsPerPage);
  const paginatedTechs = filteredTechs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-6xl">
        <header className="mb-12 border-b border-[#3E2723]/10 pb-8 text-center max-w-3xl mx-auto">
          <div className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">
            Knowledge Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Traditional Techniques</h1>
          <p className="text-gray-600 text-lg">A visual encyclopedia of the highly specialized skills that define Kashmiri craftsmanship.</p>
        </header>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {paginatedTechs.map((tech, i) => (
            <Link href={`/master-artisans/knowledge/tech-${i}`} key={tech.title} className="bg-white border border-gray-200 p-6 hover:border-[#D4AF37] hover:shadow-lg transition-all duration-300 group cursor-pointer block">
              <div className="relative aspect-square mb-6 bg-gray-50 overflow-hidden">
                <Image src="/assets/images/master-artisans-hero.jpg" alt={tech.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 text-[9px] uppercase tracking-widest font-bold text-[#3E2723]">
                  {tech.craft}
                </div>
              </div>
              <h3 className="text-xl font-serif text-[#3E2723] mb-2 group-hover:text-[#D4AF37] transition-colors">{tech.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{tech.desc}</p>
              <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest border border-[#D4AF37] inline-block px-2 py-1 group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">View Documentation</div>
            </Link>
          ))}
          {paginatedTechs.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 font-serif text-lg border border-dashed border-gray-200">
              No techniques found for this category.
            </div>
          )}
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
"""
write_page("techniques", techniques_content)

# 2. Tools & Materials
tools_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ToolsMaterials() {
  const allTools = [
    { title: 'The Yander (Spinning Wheel)', craft: 'Pashmina', desc: 'The delicate wooden wheel used to spin raw Pashm into ultra-fine yarn.' },
    { title: 'The Aari (Awl)', craft: 'Embroidery', desc: 'A specialized needle with a hooked end used for rapid chain stitching in Crewel work.' },
    { title: 'Vatta Chisel Set', craft: 'Woodwork', desc: 'A curated set of 20+ specialized chisels forged by local blacksmiths.' },
    { title: 'Raw Pashm Wool', craft: 'Textiles', desc: 'The raw, unspun undercoat of the Changthangi goat from Ladakh.' },
    { title: 'Traam (Copper Plates)', craft: 'Metalwork', desc: 'Thick sheets of pure copper ready to be shaped and oxidized.' },
    { title: 'Kani Bobbins (Tojis)', craft: 'Weaving', desc: 'Small wooden eye-less bobbins wrapped with colorful silk threads.' }
  ];

  const filters = ['All', 'Pashmina', 'Embroidery', 'Woodwork', 'Textiles', 'Metalwork', 'Weaving'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filteredTools = allTools.filter(t => activeFilter === 'All' || t.craft === activeFilter);
  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const paginatedTools = filteredTools.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#1A1A1A] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-5xl">
        <header className="mb-12 border-b border-white/10 pb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Tools & Materials</h1>
          <p className="text-white/60 text-lg">Documenting the bespoke instruments and raw resources required to execute Kashmiri heritage arts.</p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {paginatedTools.map((t, i) => (
            <Link href={`/master-artisans/knowledge/tool-${i}`} key={i} className="bg-black border border-white/10 p-6 hover:border-white/30 transition-all group block">
              <div className="relative aspect-square mb-6">
                <Image src="/assets/images/heritage-object.jpg" alt={t.title} fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-2">{t.craft}</div>
              <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[#D4AF37] transition-colors">{t.title}</h3>
              <p className="text-sm text-white/50">{t.desc}</p>
            </Link>
          ))}
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
write_page("tools-materials", tools_content)

print("Added pagination and filtering to Techniques and Tools & Materials.")
