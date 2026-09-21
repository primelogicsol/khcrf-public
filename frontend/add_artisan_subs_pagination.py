import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# 1. Living Legends
legends_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LivingLegends() {
  const allLegends = [
    { name: "Ali Mohammad Najjar", craft: "Walnut Carving", loc: "Safa Kadal", award: "Shilp Guru", img: "/assets/images/artisan-portrait.jpg" },
    { name: "Ghulam Hassan", craft: "Kani Weaving", loc: "Kanihama", award: "Padma Shri", img: "/assets/images/heritage-object.jpg" },
    { name: "Zareena Bano", craft: "Namda Felting", loc: "Anantnag", award: "National Award", img: "/assets/images/master-artisans-hero.jpg" },
    { name: "Tariq Bhat", craft: "Papier-Mâché", loc: "Zadibal", award: "State Award", img: "/assets/images/heritage-object.jpg" },
    { name: "Ghulam Nabi", craft: "Copperware", loc: "Zaina Kadal", award: "Shilp Guru", img: "/assets/images/artisan-portrait.jpg" },
    { name: "Hajira Begum", craft: "Pashmina", loc: "Eidgah", award: "Padma Shri", img: "/assets/images/master-artisans-hero.jpg" }
  ];

  const filters = ['All', 'Walnut Carving', 'Kani Weaving', 'Namda Felting', 'Papier-Mâché', 'Copperware', 'Pashmina'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredLegends = allLegends.filter(l => activeFilter === 'All' || l.craft === activeFilter);
  const totalPages = Math.ceil(filteredLegends.length / itemsPerPage);
  const paginatedLegends = filteredLegends.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-12 border-b border-[#3E2723]/10 pb-8 text-center max-w-4xl mx-auto">
          <div className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">
            Master Category
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Living Legends</h1>
          <p className="text-gray-600 text-lg">Honoring the elder statesmen and women of Kashmiri craft who hold the highest national awards.</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {paginatedLegends.map((l, i) => (
            <Link href={`/master-artisans/artisans/${l.name.toLowerCase().replace(/ /g, '-')}`} key={i} className="group block border border-[#3E2723]/5 hover:shadow-xl transition-all duration-300 bg-white">
              <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                <Image src={l.img} alt={l.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#3E2723]">
                  {l.award}
                </div>
              </div>
              <div className="p-6">
                <div className="text-[10px] text-[#3949AB] font-bold uppercase tracking-widest mb-2">{l.craft} • {l.loc}</div>
                <h3 className="text-xl font-serif text-[#3E2723] group-hover:text-[#D4AF37] transition-colors">{l.name}</h3>
              </div>
            </Link>
          ))}
          {paginatedLegends.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 font-serif text-lg">
              No living legends found for this craft category.
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
write_page("artisans/living-legends", legends_content)

# 2. Women Artisans
women_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function WomenArtisans() {
  const allWomen = [
    { name: "Fatima Begum", craft: "Sozni Embroidery", loc: "Nowhatta", img: "/assets/images/master-artisans-hero.jpg" },
    { name: "Hajira Begum", craft: "Pashmina Spinning", loc: "Eidgah", img: "/assets/images/artisan-portrait.jpg" },
    { name: "Zareena Bano", craft: "Namda Felting", loc: "Anantnag", img: "/assets/images/heritage-object.jpg" },
    { name: "Asiya Jan", craft: "Willow Wicker", loc: "Ganderbal", img: "/assets/images/artisan-portrait.jpg" },
    { name: "Rifat Ara", craft: "Crewel Embroidery", loc: "Srinagar", img: "/assets/images/master-artisans-hero.jpg" },
    { name: "Iqra Bano", craft: "Pashmina Spinning", loc: "Eidgah", img: "/assets/images/heritage-object.jpg" }
  ];

  const filters = ['All', 'Sozni Embroidery', 'Pashmina Spinning', 'Namda Felting', 'Willow Wicker', 'Crewel Embroidery'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredWomen = allWomen.filter(w => activeFilter === 'All' || w.craft === activeFilter);
  const totalPages = Math.ceil(filteredWomen.length / itemsPerPage);
  const paginatedWomen = filteredWomen.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-12 border-b border-[#3E2723]/10 pb-8 text-center max-w-4xl mx-auto">
          <div className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">
            Special Focus
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Women Artisans</h1>
          <p className="text-gray-600 text-lg">Highlighting the crucial but often overlooked role of female artisans in Kashmir's craft ecosystem.</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {paginatedWomen.map((w, i) => (
            <Link href={`/master-artisans/artisans/${w.name.toLowerCase().replace(/ /g, '-')}`} key={i} className="group block border border-[#3E2723]/5 hover:shadow-xl transition-all duration-300 bg-white">
              <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                <Image src={w.img} alt={w.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" />
              </div>
              <div className="p-6">
                <div className="text-[10px] text-[#3949AB] font-bold uppercase tracking-widest mb-2">{w.craft} • {w.loc}</div>
                <h3 className="text-xl font-serif text-[#3E2723] group-hover:text-[#D4AF37] transition-colors">{w.name}</h3>
              </div>
            </Link>
          ))}
          {paginatedWomen.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 font-serif text-lg">
              No women artisans found for this craft category.
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
write_page("artisans/women-artisans", women_content)

# 3. Emerging Artisans
emerging_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function EmergingArtisans() {
  const allEmerging = [
    { name: "Umar Farooq", craft: "Copperware", loc: "Zaina Kadal", img: "/assets/images/artisan-portrait.jpg" },
    { name: "Firdous Ahmad", craft: "Walnut Carving", loc: "Pampore", img: "/assets/images/heritage-object.jpg" },
    { name: "Naseem", craft: "Copperware", loc: "Downtown", img: "/assets/images/master-artisans-hero.jpg" },
    { name: "Irfan Ali", craft: "Kani Weaving", loc: "Kanihama", img: "/assets/images/artisan-portrait.jpg" },
    { name: "Shabir", craft: "Papier-Mâché", loc: "Zadibal", img: "/assets/images/heritage-object.jpg" },
    { name: "Muneer", craft: "Sozni Embroidery", loc: "Nowhatta", img: "/assets/images/master-artisans-hero.jpg" }
  ];

  const filters = ['All', 'Copperware', 'Walnut Carving', 'Kani Weaving', 'Papier-Mâché', 'Sozni Embroidery'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredEmerging = allEmerging.filter(e => activeFilter === 'All' || e.craft === activeFilter);
  const totalPages = Math.ceil(filteredEmerging.length / itemsPerPage);
  const paginatedEmerging = filteredEmerging.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-12 border-b border-[#3E2723]/10 pb-8 text-center max-w-4xl mx-auto">
          <div className="inline-block bg-[#3E2723]/10 text-[#3E2723] border border-[#3E2723]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">
            Next Generation
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Emerging Artisans</h1>
          <p className="text-gray-600 text-lg">Showcasing the young innovators who are carrying their ancestral techniques into the modern era.</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {paginatedEmerging.map((e, i) => (
            <Link href={`/master-artisans/artisans/${e.name.toLowerCase().replace(/ /g, '-')}`} key={i} className="group block border border-[#3E2723]/5 hover:shadow-xl transition-all duration-300 bg-white">
              <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                <Image src={e.img} alt={e.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" />
              </div>
              <div className="p-6">
                <div className="text-[10px] text-[#3949AB] font-bold uppercase tracking-widest mb-2">{e.craft} • {e.loc}</div>
                <h3 className="text-xl font-serif text-[#3E2723] group-hover:text-[#D4AF37] transition-colors">{e.name}</h3>
              </div>
            </Link>
          ))}
          {paginatedEmerging.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 font-serif text-lg">
              No emerging artisans found for this craft category.
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
write_page("artisans/emerging-artisans", emerging_content)

print("Added pagination and filtering to Legends, Women, and Emerging Artisans.")
