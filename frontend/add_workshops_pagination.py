import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

workshops_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function WorkshopCommunities() {
  const allKarkhans = [
    {
      title: "The Safa Kadal Naqash Guild", craft: "Copper Engraving", loc: "Srinagar", est: "Est. 1920",
      desc: "A rare collective of 12 copper engravers operating out of a heritage building. This Karkhan operates on a traditional master-apprentice hierarchy where materials are bought collectively.",
      slug: "safa-kadal-guild"
    },
    {
      title: "Zadibal Sozni Collective", craft: "Sozni Embroidery", loc: "Zadibal", est: "Est. 1965",
      desc: "A predominantly female-led workshop focusing on double-sided needlework for Pashmina shawls, pooling resources to maintain high-quality silk threads.",
      slug: "zadibal-collective"
    },
    {
      title: "Kanihama Weavers Cooperative", craft: "Kani Shawl Weaving", loc: "Budgam", est: "Est. 1980",
      desc: "The heart of the Kani weaving revival. Dozens of looms operate simultaneously here, guided by a single master Talim-reader who dictates patterns to the entire floor.",
      slug: "kanihama-cooperative"
    },
    {
      title: "Eidgah Pashmina Spinners", craft: "Pashmina Spinning", loc: "Eidgah", est: "Est. 1955",
      desc: "A historic courtyard where over thirty women gather daily to spin raw Pashm into ultra-fine yarn on traditional Yander wheels.",
      slug: "eidgah-spinners"
    },
    {
      title: "Pampore Wood Carvers Guild", craft: "Walnut Carving", loc: "Pampore", est: "Est. 1970",
      desc: "A brotherhood of undercut carving specialists who share a large seasoning kiln to properly age their walnut wood logs before carving.",
      slug: "pampore-wood-carvers"
    },
    {
      title: "Downtown Papier-Mâché Artists", craft: "Papier-Mâché", loc: "Downtown", est: "Est. 1945",
      desc: "A multi-family workshop that handles the entire pipeline, from pounding the Sakhta base to the final application of 24k gold leaf Naqashi.",
      slug: "downtown-papier-mache"
    }
  ];

  const filters = ['All', 'Copper Engraving', 'Sozni Embroidery', 'Kani Shawl Weaving', 'Pashmina Spinning', 'Walnut Carving', 'Papier-Mâché'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filteredKarkhans = allKarkhans.filter(k => activeFilter === 'All' || k.craft === activeFilter);
  const totalPages = Math.ceil(filteredKarkhans.length / itemsPerPage);
  const paginatedKarkhans = filteredKarkhans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#1A1A1A] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Workshop Communities (Karkhans)</h1>
          <p className="text-white/70 text-lg max-w-3xl font-light">
            Kashmiri craft is inherently collaborative. A 'Karkhan' is not just a physical space, but an interdependent community of dyers, washers, spinners, designers, and weavers operating as a collective unit.
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-12">
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

        <div className="space-y-12 mb-16">
          {paginatedKarkhans.map((karkhan, idx) => (
            <div key={idx} className="bg-black border border-white/10 overflow-hidden hover:border-white/30 transition-colors">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative aspect-video lg:aspect-auto h-full group">
                  <Image src="/assets/images/master-artisans-hero.jpg" alt={karkhan.title} fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute bottom-6 left-6 flex gap-2">
                    <span className="bg-white/10 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white border border-white/20">{karkhan.loc}</span>
                    <span className="bg-white/10 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white border border-white/20">{karkhan.est}</span>
                  </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold mb-2">{karkhan.craft}</div>
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">{karkhan.title}</h2>
                  <p className="text-white/60 leading-relaxed mb-8">{karkhan.desc}</p>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4">Key Members Documented</h4>
                    <div className="flex gap-4">
                      {[1, 2, 3].map(member => (
                        <div key={member} className="w-12 h-12 relative rounded-full overflow-hidden border border-white/20">
                          <Image src="/assets/images/artisan-portrait.jpg" alt="Member" fill className="object-cover grayscale hover:grayscale-0 transition-all cursor-pointer" />
                        </div>
                      ))}
                      <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center text-[10px] font-bold hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors cursor-pointer">+12</div>
                    </div>
                  </div>
                  <div className="mt-8 flex gap-4">
                    <Link href={`/master-artisans/artisans/${karkhan.slug}`} className="text-xs font-bold uppercase tracking-widest text-white hover:text-[#D4AF37] border-b border-white hover:border-[#D4AF37] pb-1 transition-colors">
                      View Workshop Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {paginatedKarkhans.length === 0 && (
            <div className="py-12 text-center text-white/40 font-serif text-lg border border-dashed border-white/10">
              No workshop communities found for this craft category.
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
write_page("artisans/workshop-communities", workshops_content)

print("Added pagination and filtering to Workshop Communities.")
