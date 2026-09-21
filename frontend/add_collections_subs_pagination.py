import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# 1. Museum Archive
museum_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function MuseumArchive() {
  const allArtifacts = [
    { title: "Ceremonial Copper Samovar", craft: "Copperware", era: "Late 19th C.", origin: "Srinagar", material: "Tinned Copper" },
    { title: "Mughal-era Qalamdan (Pen Box)", craft: "Papier-Mâché", era: "Early 18th C.", origin: "Downtown", material: "Sakhta, Gold Leaf" },
    { title: "Antique Walnut Chest", craft: "Woodwork", era: "Mid 19th C.", origin: "Pampore", material: "Kashmiri Walnut" },
    { title: "Original Waguv Mat", craft: "Reed Weaving", era: "1920s", origin: "Dal Lake", material: "River Reeds" },
    { title: "Embroidered Choga", craft: "Crewel Embroidery", era: "Late 18th C.", origin: "Anantnag", material: "Wool, Silk Thread" },
    { title: "Silver Filigree Hookah", craft: "Metalwork", era: "Early 19th C.", origin: "Zaina Kadal", material: "Silver" },
    { title: "Kani Shawl Fragment", craft: "Weaving", era: "1850s", origin: "Kanihama", material: "Pashm" },
    { title: "Royal Khatam-band Panel", craft: "Woodwork", era: "17th Century", origin: "Srinagar", material: "Deodar Wood" }
  ];

  const filters = ['All', 'Copperware', 'Woodwork', 'Papier-Mâché', 'Reed Weaving', 'Metalwork', 'Weaving', 'Crewel Embroidery'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredArtifacts = allArtifacts.filter(a => activeFilter === 'All' || a.craft === activeFilter);
  const totalPages = Math.ceil(filteredArtifacts.length / itemsPerPage);
  const paginatedArtifacts = filteredArtifacts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-6xl">
        <header className="mb-12 border-b border-[#3E2723]/10 pb-8 text-center max-w-4xl mx-auto">
          <div className="inline-block bg-[#3E2723]/10 text-[#3E2723] border border-[#3E2723]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">
            Curated Collection
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Museum Archive</h1>
          <p className="text-gray-600 text-lg">Digitized historical artifacts dating back centuries, showcasing the apex of Kashmiri craftsmanship.</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {paginatedArtifacts.map((it, i) => (
            <Link href={`/master-artisans/collections/museum-${i}`} key={i} className="group block bg-white border border-[#3E2723]/10 p-4 hover:shadow-xl transition-shadow">
              <div className="relative aspect-square mb-4 bg-[#F5F5F5] overflow-hidden">
                <Image src="/assets/images/heritage-object.jpg" alt={it.title} fill className="object-cover p-6 mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-2 left-2 bg-black/10 backdrop-blur px-2 py-1 text-[9px] uppercase tracking-widest font-bold text-[#3E2723]">
                  {it.era}
                </div>
              </div>
              <div className="px-2 pb-2">
                <div className="text-[10px] text-[#3949AB] font-bold uppercase tracking-widest mb-2">{it.craft}</div>
                <h3 className="font-serif text-xl text-[#3E2723] group-hover:text-[#D4AF37] transition-colors leading-tight mb-2">{it.title}</h3>
                <div className="text-xs text-gray-500">Origin: {it.origin} • Mat: {it.material}</div>
              </div>
            </Link>
          ))}
          {paginatedArtifacts.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400 font-serif text-lg">
              No artifacts found for this craft category.
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
write_page("collections/museum-archive", museum_content)

# 2. Rare Objects
rare_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function RareObjects() {
  const allObjects = [
    { title: "Antique Shahtoosh Shawl", craft: "Weaving", desc: "A flawless, ring-test passing Shahtoosh woven before the ban, representing the absolute pinnacle of hand-spinning.", origin: "Srinagar, 1920s" },
    { title: "Undercut Walnut Throne", craft: "Woodwork", desc: "A massive singular block of walnut intricately carved with overlapping Chinar leaves to an astonishing 4-inch depth.", origin: "Anantnag, 1890s" },
    { title: "Double-sided Silk Carpet", craft: "Carpet Weaving", desc: "A rare carpet featuring a completely different geometric pattern on the reverse side.", origin: "Downtown, 1950s" },
    { title: "Gold-leaf Naqashi Shield", craft: "Papier-Mâché", desc: "A ceremonial shield constructed entirely of Sakhta and painted in 24k gold leaf.", origin: "Zadibal, 1850s" },
    { title: "Silver-inlaid Tash-t-Nari", craft: "Metalwork", desc: "A hand-washing vessel used in royal banquets, featuring intricate silver wire inlay on oxidized copper.", origin: "Zaina Kadal, 1910s" },
    { title: "Embroidered Pashmina Jamawar", craft: "Sozni Embroidery", desc: "A shawl so densely embroidered that the underlying Pashmina fabric is completely invisible.", origin: "Nowhatta, 1930s" }
  ];

  const filters = ['All', 'Weaving', 'Woodwork', 'Carpet Weaving', 'Papier-Mâché', 'Metalwork', 'Sozni Embroidery'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filteredObjects = allObjects.filter(o => activeFilter === 'All' || o.craft === activeFilter);
  const totalPages = Math.ceil(filteredObjects.length / itemsPerPage);
  const paginatedObjects = filteredObjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#111111] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-5xl">
        <header className="mb-12 border-b border-white/10 pb-8 text-center max-w-4xl mx-auto">
          <div className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">
            Private Collection
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Rare Objects</h1>
          <p className="text-white/60 text-lg">One-of-a-kind masterpieces that demonstrate the absolute zenith of human skill and patience.</p>
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
          {paginatedObjects.map((obj, i) => (
            <div key={i} className="bg-black border border-white/10 flex flex-col md:flex-row hover:border-[#D4AF37]/50 transition-colors group">
              <div className="w-full md:w-1/2 relative aspect-square md:aspect-auto">
                <Image src="/assets/images/heritage-object.jpg" alt={obj.title} fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/90"></div>
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-2">{obj.craft}</div>
                <h2 className="text-3xl font-serif text-white mb-4 group-hover:text-[#D4AF37] transition-colors">{obj.title}</h2>
                <p className="text-white/60 leading-relaxed mb-6">{obj.desc}</p>
                <div className="text-xs text-white/40 uppercase tracking-widest font-mono mb-8 border-l-2 border-[#D4AF37] pl-3">
                  Provenance: {obj.origin}
                </div>
                <div>
                  <Link href={`/master-artisans/collections/rare-${i}`} className="inline-block border border-white/30 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-white hover:text-[#111] transition-colors">
                    View 3D Scan
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {paginatedObjects.length === 0 && (
            <div className="py-12 text-center text-white/40 font-serif text-lg border border-dashed border-white/10">
              No rare objects found for this craft category.
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
write_page("collections/rare-objects", rare_content)

# 3. Contemporary Excellence
contemp_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ContemporaryExcellence() {
  const allItems = [
    { title: "Minimalist Khatam-band Table", craft: "Woodwork", artisan: "Naseer Bhat", year: "2024" },
    { title: "Oxidized Traam Bowl", craft: "Copperware", artisan: "Umar Farooq", year: "2023" },
    { title: "Abstract Silk Carpet", craft: "Carpet Weaving", artisan: "Riyaz Ahmad", year: "2024" },
    { title: "Monochrome Pashmina Stole", craft: "Weaving", artisan: "Hajira Begum", year: "2025" },
    { title: "Geometric Papier-Mâché Lamp", craft: "Papier-Mâché", artisan: "Shabir", year: "2023" },
    { title: "Modern Crewel Tapestry", craft: "Embroidery", artisan: "Rifat Ara", year: "2024" }
  ];

  const filters = ['All', 'Woodwork', 'Copperware', 'Carpet Weaving', 'Weaving', 'Papier-Mâché', 'Embroidery'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredItems = allItems.filter(it => activeFilter === 'All' || it.craft === activeFilter);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-6xl">
        <header className="mb-12 border-b border-[#3E2723]/10 pb-8 text-center max-w-4xl mx-auto">
          <div className="inline-block bg-[#3949AB]/10 text-[#3949AB] border border-[#3949AB]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">
            Modern Innovations
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Contemporary Excellence</h1>
          <p className="text-gray-600 text-lg">Award-winning modern designs that adapt traditional Kashmiri techniques for contemporary aesthetics.</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {paginatedItems.map((it, i) => (
            <Link href={`/master-artisans/collections/contemp-${i}`} key={i} className="group block bg-white border border-[#3E2723]/10 p-4 hover:shadow-xl transition-shadow">
              <div className="relative aspect-square mb-4 bg-gray-50 overflow-hidden">
                <Image src="/assets/images/heritage-object.jpg" alt={it.title} fill className="object-cover p-6 mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="px-2 pb-2">
                <div className="text-[10px] text-[#3949AB] font-bold uppercase tracking-widest mb-2">{it.craft}</div>
                <h3 className="font-serif text-lg text-[#3E2723] group-hover:text-[#D4AF37] transition-colors leading-tight mb-2">{it.title}</h3>
                <div className="text-xs text-gray-500">By {it.artisan} • {it.year}</div>
              </div>
            </Link>
          ))}
          {paginatedItems.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400 font-serif text-lg">
              No contemporary items found for this craft.
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
write_page("collections/contemporary-excellence", contemp_content)

print("Added pagination and filtering to Museum Archive, Rare Objects, and Contemporary Excellence.")
