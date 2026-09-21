import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# 1. Essays (or Artisan Stories)
essays_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ArtisanEssays() {
  const allEssays = [
    { title: "The Geometry of Chinar", author: "Dr. Sarah Qadri", category: "Design History", min: "8 Min Read", date: "May 2026", desc: "Analyzing how the iconic Chinar leaf was mathematically adapted for Naqashi patterns over three centuries." },
    { title: "Tracing the Silk Road", author: "Prof. Hamid", category: "Trade Routes", min: "12 Min Read", date: "April 2026", desc: "A geographical deep-dive into how Central Asian weaving techniques migrated and settled in Srinagar." },
    { title: "The Color of Kings", author: "Aisha Bhat", category: "Materials", min: "6 Min Read", date: "June 2026", desc: "The dangerous and secretive historical process of extracting royal blue dye from lapis lazuli." },
    { title: "Voices of the Looms", author: "Tariq Mir", category: "Social Impact", min: "15 Min Read", date: "July 2026", desc: "How the economic downturns of the 1990s permanently altered the demographic of carpet weavers." },
    { title: "Mathematics of Khatam-band", author: "Dr. Sarah Qadri", category: "Design History", min: "10 Min Read", date: "August 2026", desc: "Why Kashmiri interlocking wooden ceilings are a marvel of ancient geometric engineering." },
    { title: "The Wool Route", author: "Prof. Hamid", category: "Trade Routes", min: "14 Min Read", date: "September 2026", desc: "Following the treacherous path of raw Pashm from the Changthang plateau to the spinning wheels of Eidgah." },
    { title: "Gold Leaf Alchemy", author: "Aisha Bhat", category: "Materials", min: "7 Min Read", date: "October 2026", desc: "The meticulous, breathing-restricted process of applying 24k gold leaf in traditional Papier-Mâché." },
    { title: "Women in the Shadows", author: "Tariq Mir", category: "Social Impact", min: "11 Min Read", date: "November 2026", desc: "Documenting the unrecognized labor of women who sort, wash, and spin materials before the 'masters' begin." }
  ];

  const filters = ['All', 'Design History', 'Trade Routes', 'Materials', 'Social Impact'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredEssays = allEssays.filter(e => activeFilter === 'All' || e.category === activeFilter);
  const totalPages = Math.ceil(filteredEssays.length / itemsPerPage);
  const paginatedEssays = filteredEssays.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-5xl">
        <header className="mb-12 border-b border-[#3E2723]/10 pb-8 text-center max-w-4xl mx-auto">
          <div className="inline-block bg-[#3E2723]/10 text-[#3E2723] border border-[#3E2723]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">
            Scholarly Essays
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Artisan Essays</h1>
          <p className="text-gray-600 text-lg">In-depth research articles, historical analyses, and cultural critiques by our resident scholars.</p>
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

        <div className="space-y-8 mb-16">
          {paginatedEssays.map((e, idx) => (
            <Link href={`/master-artisans/stories/essay-${idx}`} key={idx} className="group block bg-white border border-[#3E2723]/10 p-6 md:p-8 hover:shadow-xl transition-shadow flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/3 aspect-[4/3] relative bg-gray-100 overflow-hidden">
                <Image src="/assets/images/master-artisans-hero.jpg" alt={e.title} fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" />
              </div>
              <div className="w-full md:w-2/3">
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold mb-3">
                  <span className="text-[#3949AB]">{e.category}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500">{e.date}</span>
                </div>
                <h3 className="text-2xl font-serif text-[#3E2723] group-hover:text-[#D4AF37] transition-colors mb-4">{e.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{e.desc}</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
                    <Image src="/assets/images/artisan-portrait.jpg" alt={e.author} fill className="object-cover" />
                  </div>
                  <div className="text-xs font-bold text-[#3E2723]">{e.author}</div>
                  <div className="text-xs text-gray-400 font-mono ml-auto">{e.min}</div>
                </div>
              </div>
            </Link>
          ))}
          {paginatedEssays.length === 0 && (
            <div className="py-12 text-center text-gray-400 font-serif text-lg">
              No essays found for this category.
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
write_page("collections/essays", essays_content)

# 2. Signature Masterpieces
signature_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SignatureMasterpieces() {
  const allMasterpieces = [
    { title: "The Shah-e-Hamadan Shawl", craft: "Pashmina Kani", artisan: "Ghulam Hassan", year: "2018", desc: "A sprawling Kani shawl requiring three weavers working simultaneously for two years to complete." },
    { title: "The Walnut Chinar Throne", craft: "Woodwork", artisan: "Ali Mohammad", year: "2015", desc: "An undercut chair featuring a seamless integration of over 500 individual Chinar leaves carved from a single log." },
    { title: "The Golden Qalamdan", craft: "Papier-Mâché", artisan: "Tariq Bhat", year: "2020", desc: "A pen box adorned with authentic 24k gold leaf and crushed lapis lazuli, reviving a lost Mughal technique." },
    { title: "The Tree of Life Carpet", craft: "Carpet Weaving", artisan: "Riyaz Ahmad", year: "2019", desc: "A massive 12x15 foot silk-on-silk carpet boasting 600 knots per square inch." },
    { title: "The Royal Traam Samovar", craft: "Copperware", artisan: "Ghulam Nabi", year: "2017", desc: "A highly oxidized copper samovar engraved with intricate Persian poetry around its base." },
    { title: "The Sozni Jamawar Panel", craft: "Embroidery", artisan: "Fatima Begum", year: "2021", desc: "A pure Pashmina panel completely submerged under microscopic, double-sided needlework." }
  ];

  const filters = ['All', 'Pashmina Kani', 'Woodwork', 'Papier-Mâché', 'Carpet Weaving', 'Copperware', 'Embroidery'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filteredMasterpieces = allMasterpieces.filter(m => activeFilter === 'All' || m.craft === activeFilter);
  const totalPages = Math.ceil(filteredMasterpieces.length / itemsPerPage);
  const paginatedMasterpieces = filteredMasterpieces.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#111111] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-5xl">
        <header className="mb-16 border-b border-white/10 pb-8 text-center max-w-4xl mx-auto">
          <div className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">
            The Pinnacle of Craft
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Signature Masterpieces</h1>
          <p className="text-white/60 text-lg">Monumental works that redefine the boundaries of what is possible within traditional Kashmiri crafts.</p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
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

        <div className="space-y-12 mb-16">
          {paginatedMasterpieces.map((m, i) => (
            <div key={i} className="bg-black border border-white/10 flex flex-col md:flex-row hover:border-[#D4AF37]/50 transition-colors group">
              <div className="w-full md:w-1/2 relative aspect-square md:aspect-auto">
                <Image src="/assets/images/heritage-object.jpg" alt={m.title} fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/90"></div>
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-2">{m.craft}</div>
                <h2 className="text-3xl font-serif text-white mb-4 group-hover:text-[#D4AF37] transition-colors">{m.title}</h2>
                <p className="text-white/60 leading-relaxed mb-6">{m.desc}</p>
                <div className="text-xs text-white/40 uppercase tracking-widest font-mono mb-8 border-l-2 border-[#D4AF37] pl-3">
                  Created By: {m.artisan} • {m.year}
                </div>
                <div>
                  <Link href={`/master-artisans/collections/signature-${i}`} className="inline-block border border-white/30 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-[#111] transition-colors">
                    View Masterpiece
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {paginatedMasterpieces.length === 0 && (
            <div className="py-12 text-center text-white/40 font-serif text-lg border border-dashed border-white/10">
              No signature masterpieces found for this craft.
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
write_page("collections/signature-masterpieces", signature_content)

print("Added pagination and filtering to Essays and Signature Masterpieces.")
