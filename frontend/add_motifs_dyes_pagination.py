import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# 3. Motifs & Symbols
motifs_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function MotifsSymbols() {
  const allMotifs = [
    { title: 'The Badam (Paisley)', origin: 'Persian / Central Asian', desc: 'The most iconic motif in Kashmiri craft, representing the cypress tree bent by the wind, symbolizing life and eternity.' },
    { title: 'Chinar Leaf (Boen)', origin: 'Indigenous Kashmiri', desc: 'The five-pointed leaf of the majestic Oriental Plane tree, deeply rooted in Kashmir\\'s landscape and poetry.' },
    { title: 'Pamposh (Lotus)', origin: 'Indigenous Kashmiri', desc: 'A symbol of purity and rebirth, often used in both Hindu and Sufi iconography within the valley.' },
    { title: 'Gul-e-Hazara (Thousand Flowers)', origin: 'Mughal Influence', desc: 'A dense, intricate floral pattern that covers the entire surface, popular in Papier-Mâché.' },
    { title: 'Mihrab (Arch)', origin: 'Islamic Architecture', desc: 'Inspired by the prayer niches in mosques, widely used as the border design in carpets and prayer rugs.' },
    { title: 'Yander (Spinning Wheel)', origin: 'Domestic Tool', desc: 'A rarer motif that honors the spinners, occasionally found in contemporary Sozni work.' }
  ];

  const filters = ['All', 'Indigenous Kashmiri', 'Persian / Central Asian', 'Mughal Influence', 'Islamic Architecture'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filteredMotifs = allMotifs.filter(m => activeFilter === 'All' || m.origin === activeFilter);
  const totalPages = Math.ceil(filteredMotifs.length / itemsPerPage);
  const paginatedMotifs = filteredMotifs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-6xl">
        <header className="mb-12 border-b border-[#3E2723]/10 pb-8 text-center max-w-3xl mx-auto">
          <div className="inline-block bg-[#3E2723]/10 text-[#3E2723] border border-[#3E2723]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">
            Knowledge Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Motifs & Symbols</h1>
          <p className="text-gray-600 text-lg">Deconstructing the visual vocabulary and historical origins of the patterns used across all Kashmiri crafts.</p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {paginatedMotifs.map((motif, i) => (
            <Link href={`/master-artisans/knowledge/motif-${i}`} key={i} className="bg-white border border-gray-200 p-6 hover:border-[#D4AF37] hover:shadow-lg transition-all duration-300 group cursor-pointer block">
              <div className="relative aspect-[3/4] mb-6 bg-gray-50 overflow-hidden">
                <Image src="/assets/images/heritage-object.jpg" alt={motif.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply opacity-80" />
              </div>
              <div className="text-[10px] text-[#3949AB] font-bold uppercase tracking-widest mb-2">{motif.origin}</div>
              <h3 className="text-xl font-serif text-[#3E2723] mb-2 group-hover:text-[#D4AF37] transition-colors">{motif.title}</h3>
              <p className="text-sm text-gray-500">{motif.desc}</p>
            </Link>
          ))}
          {paginatedMotifs.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 font-serif text-lg border border-dashed border-gray-200">
              No motifs found for this origin category.
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
write_page("motifs-symbols", motifs_content)

# 4. Natural Dyes
dyes_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function NaturalDyes() {
  const allDyes = [
    { title: 'Madder Root (Majith)', color: 'Deep Red', source: 'Plant Root', desc: 'Produces the iconic deep reds used in classic Kani shawls and carpets.' },
    { title: 'Walnut Hull (Doon)', color: 'Brown / Black', source: 'Tree Bark/Hull', desc: 'A staple dye in Kashmir, providing various earthy tones depending on the mordant used.' },
    { title: 'Indigo (Neel)', color: 'Blue', source: 'Plant Leaves', desc: 'The universal source of blue, fermented in deep vats to achieve colorfastness.' },
    { title: 'Saffron (Kong)', color: 'Golden Yellow', source: 'Flower Stigma', desc: 'The most expensive dye, reserved historically for royal garments.' },
    { title: 'Pomegranate Rind', color: 'Mustard / Green', source: 'Fruit Skin', desc: 'Provides rich yellows and, when mixed with iron, olive greens.' },
    { title: 'Lapis Lazuli', color: 'Ultramarine', source: 'Mineral', desc: 'Crushed into a fine powder for painting high-end Papier-Mâché.' }
  ];

  const filters = ['All', 'Plant Root', 'Tree Bark/Hull', 'Plant Leaves', 'Flower Stigma', 'Fruit Skin', 'Mineral'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filteredDyes = allDyes.filter(d => activeFilter === 'All' || d.source === activeFilter);
  const totalPages = Math.ceil(filteredDyes.length / itemsPerPage);
  const paginatedDyes = filteredDyes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-6xl">
        <header className="mb-12 border-b border-[#3E2723]/10 pb-8 text-center max-w-3xl mx-auto">
          <div className="inline-block bg-[#3E2723]/10 text-[#3E2723] border border-[#3E2723]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">
            Knowledge Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Natural Dyes & Pigments</h1>
          <p className="text-gray-600 text-lg">Documenting the historic botanical and mineral sources used before the advent of synthetic colors.</p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {paginatedDyes.map((dye, i) => (
            <Link href={`/master-artisans/knowledge/dye-${i}`} key={i} className="bg-white border border-gray-200 p-6 hover:border-[#D4AF37] hover:shadow-lg transition-all duration-300 group cursor-pointer block">
              <div className="relative aspect-square mb-6 bg-gray-50 overflow-hidden">
                <Image src="/assets/images/heritage-object.jpg" alt={dye.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="text-[10px] text-[#3949AB] font-bold uppercase tracking-widest mb-2 border-b border-gray-100 pb-2 flex justify-between">
                <span>{dye.source}</span>
                <span className="text-gray-400">{dye.color}</span>
              </div>
              <h3 className="text-xl font-serif text-[#3E2723] mb-2 group-hover:text-[#D4AF37] transition-colors">{dye.title}</h3>
              <p className="text-sm text-gray-500">{dye.desc}</p>
            </Link>
          ))}
          {paginatedDyes.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 font-serif text-lg border border-dashed border-gray-200">
              No dyes found for this source material.
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
write_page("natural-dyes", dyes_content)

print("Added pagination and filtering to Motifs and Dyes.")
