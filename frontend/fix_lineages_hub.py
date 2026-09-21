import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# 1. Individual Lineage View
lineage_detail_content = """import React from 'react';
import Image from 'next/image';

export default async function LineageDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const title = resolvedParams.slug.replace(/-/g, ' ').replace(/\\w/g, c => c.toUpperCase());
  
  const nodes = [
    { gen: "1st Generation", years: "1860-1920", name: "Ustad Sultan Mohiuddin", desc: "The founding patriarch of the collective, credited with introducing the micro-stitch technique to local apprentices.", students: "Mohammad Yusuf, Abdul Ahad" },
    { gen: "2nd Generation", years: "1895-1965", name: "Master Abdul Ahad", desc: "Expanded the workshop to over 50 artisans. He was known for his strict adherence to traditional floral motifs and natural dyes.", students: "Ghulam Hassan, Ali Mohammad" },
    { gen: "3rd Generation", years: "1930-2005", name: "Ustad Ghulam Hassan", desc: "Pioneered the double-sided stitch that is identical on both the face and reverse, setting a new benchmark.", students: "Fatima Begum, Riyaz Ahmad" }
  ];

  return (
    <main className="bg-[#3E2723] min-h-screen text-[#FAF9F6] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-20 text-center max-w-4xl mx-auto">
          <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-4">Craft Lineage Timeline</div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#D4AF37] mb-6">{title}</h1>
          <p className="text-white/70 text-lg font-light">Mapping the intergenerational transfer of knowledge through master-apprentice relationships.</p>
        </header>
        <div className="max-w-5xl mx-auto">
          <div className="relative border-l-2 border-[#D4AF37]/30 ml-4 md:ml-1/2 space-y-24">
            {nodes.map((node, idx) => (
              <div key={idx} className="relative pl-12 md:pl-0">
                <div className="absolute left-[-9px] md:left-1/2 md:-translate-x-1/2 top-0 w-4 h-4 bg-[#D4AF37] rounded-full ring-4 ring-[#3E2723]"></div>
                <div className={`md:w-1/2 ${idx % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:ml-auto'}`}>
                  <div className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">{node.gen} • {node.years}</div>
                  <h3 className="text-3xl font-serif mb-4">{node.name}</h3>
                  <div className={`relative aspect-video mb-6 ${idx % 2 === 0 ? 'md:ml-auto' : ''} max-w-sm`}>
                    <Image src="/assets/images/artisan-portrait.jpg" alt="Lineage" fill className="object-cover rounded-sm grayscale opacity-80" />
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">{node.desc}</p>
                  <div className="inline-flex gap-2 text-[10px] font-bold uppercase tracking-widest text-[#3949AB] bg-white/10 px-3 py-1">
                    Notable Students: {node.students}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
"""
write_page("lineages/[slug]", lineage_detail_content)

# 2. Lineages Hub Directory
lineages_hub_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LineagesDirectory() {
  const allLineages = [
    { title: "The Najjar Woodcarvers", craft: "Walnut Carving", origin: "Safa Kadal", gens: 5, est: "1820s", desc: "A continuous 200-year lineage of master undercut carvers." },
    { title: "Zadibal Sozni Collective", craft: "Sozni Embroidery", origin: "Zadibal", gens: 4, est: "1860s", desc: "The founding masters of the micro-stitch technique used in royal Pashmina." },
    { title: "The Kanihama Weavers", craft: "Kani Weaving", origin: "Budgam", gens: 6, est: "1790s", desc: "The guardians of the original Talim script for Kani shawls." },
    { title: "The Bhat Papier-Mâché Masters", craft: "Papier-Mâché", origin: "Downtown", gens: 3, est: "1910s", desc: "Renowned for their exact botanical renditions using 24k gold leaf." },
    { title: "Eidgah Pashmina Spinners", craft: "Pashmina", origin: "Eidgah", gens: 4, est: "1880s", desc: "A matrilineal lineage passing down the sensitive tension techniques of the Yander." },
    { title: "The Copper Engravers of Zaina Kadal", craft: "Copperware", origin: "Zaina Kadal", gens: 5, est: "1840s", desc: "Tracing the evolution from royal banquetware to modern household Traam." }
  ];

  const filters = ['All', 'Walnut Carving', 'Sozni Embroidery', 'Kani Weaving', 'Papier-Mâché', 'Pashmina', 'Copperware'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredLineages = allLineages.filter(l => activeFilter === 'All' || l.craft === activeFilter);
  const totalPages = Math.ceil(filteredLineages.length / itemsPerPage);
  const paginatedLineages = filteredLineages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-6xl">
        <header className="mb-12 border-b border-[#3E2723]/10 pb-8 text-center max-w-4xl mx-auto">
          <div className="inline-block bg-[#3E2723]/10 text-[#3E2723] border border-[#3E2723]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">
            Generational Knowledge
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Craft Lineages (Shajra)</h1>
          <p className="text-gray-600 text-lg">Explore the genealogical and master-apprentice trees that have preserved Kashmir's heritage arts across centuries.</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {paginatedLineages.map((l, i) => (
            <Link href={`/master-artisans/lineages/lineage-${i}`} key={i} className="group block bg-white border border-[#3E2723]/10 p-6 md:p-8 hover:shadow-xl transition-shadow flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/3 aspect-[4/5] relative bg-[#3E2723] overflow-hidden">
                <Image src="/assets/images/artisan-portrait.jpg" alt={l.title} fill className="object-cover opacity-60 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute inset-0 border-[4px] border-[#D4AF37]/20 m-2"></div>
              </div>
              <div className="w-full md:w-2/3">
                <div className="text-[10px] text-[#3949AB] font-bold uppercase tracking-widest mb-2">{l.craft} • Est. {l.est}</div>
                <h3 className="text-2xl font-serif text-[#3E2723] group-hover:text-[#D4AF37] transition-colors mb-3">{l.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{l.desc}</p>
                <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <span className="text-[#3E2723] text-lg">{l.gens}</span> Generations
                  </div>
                  <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest ml-auto group-hover:underline">
                    View Tree
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {paginatedLineages.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 font-serif text-lg border border-dashed border-gray-200">
              No lineages found for this craft category.
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
write_page("lineages", lineages_hub_content)

print("Moved Lineage timeline to dynamic detail page and converted Lineages hub to a paginated directory.")
