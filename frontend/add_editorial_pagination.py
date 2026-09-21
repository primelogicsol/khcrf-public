import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

editorial_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function EditorialSeries() {
  const allSeries = [
    {
      title: "The Dying Arts", tag: "Conservation",
      desc: "A multi-part investigation into the crafts that are currently on the verge of extinction, exploring economic pressures and lack of raw materials.",
      articles: ["The Last Waguv Weavers", "Glazed Pottery of Dal Lake", "Pinjrakari: The Lost Geometry"]
    },
    {
      title: "Women in Craft", tag: "Social History",
      desc: "Historically relegated to the unseen steps of production (spinning, sorting, washing), this series brings the female artisans of Kashmir to the forefront.",
      articles: ["The Spinners of Eidgah", "The Silent Needle: Sozni's Unsung Heroes", "Breaking the Loom Barrier"]
    },
    {
      title: "The Silk Road Connection", tag: "History",
      desc: "Tracing the direct stylistic and technical lineages between modern Kashmiri crafts and the courts of Persia and Central Asia.",
      articles: ["The Persian Knot", "Samarkand to Srinagar", "The Evolution of the Paisley (Badam)"]
    },
    {
      title: "Modern Economics of Pashmina", tag: "Market Analysis",
      desc: "An in-depth look at the global supply chain of authentic Pashmina, from the high-altitude Changthangi goats to luxury boutiques in Europe.",
      articles: ["The Cost of Raw Pashm", "Machine vs. Hand-spun", "Geographical Indication (GI) Tags Explained"]
    },
    {
      title: "Innovators of the Valley", tag: "Contemporary",
      desc: "Highlighting the new generation of artisans who are breaking traditional boundaries while maintaining the integrity of their ancestral crafts.",
      articles: ["Abstract Felting", "Digitizing the Talim", "Oxidized Copper Aesthetics"]
    }
  ];

  const filters = ['All', 'Conservation', 'Social History', 'History', 'Market Analysis', 'Contemporary'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filteredSeries = allSeries.filter(s => activeFilter === 'All' || s.tag === activeFilter);
  const totalPages = Math.ceil(filteredSeries.length / itemsPerPage);
  const paginatedSeries = filteredSeries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-5xl">
        <header className="mb-12 border-b border-[#3E2723]/10 pb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Editorial Series</h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">Deep-dive, multi-part investigative journalism and historical essays written by KHCRF scholars and guest historians.</p>
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

        <div className="space-y-12 mb-16">
          {paginatedSeries.map((s, idx) => (
            <div key={idx} className="bg-white border border-[#3E2723]/10 shadow-sm flex flex-col md:flex-row gap-8 p-8 hover:shadow-lg transition-shadow">
              <div className="w-full md:w-1/3">
                <div className="text-[10px] text-[#3949AB] font-bold uppercase tracking-widest mb-2 border-b border-gray-100 pb-2">{s.tag} Series</div>
                <h2 className="text-2xl font-serif text-[#3E2723] mb-4 leading-tight">{s.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">{s.desc}</p>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{s.articles.length} Parts Published</div>
              </div>
              <div className="w-full md:w-2/3 bg-gray-50 p-6 border border-gray-100">
                <h4 className="text-sm font-serif text-[#3E2723] mb-4">Articles in this series:</h4>
                <div className="flex flex-col gap-3">
                  {s.articles.map((art, a_idx) => (
                    <Link href={`/master-artisans/stories/article-${idx}-${a_idx}`} key={a_idx} className="text-[#3949AB] hover:text-[#D4AF37] text-sm font-medium flex items-center gap-2 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span> Part {a_idx + 1}: {art}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {paginatedSeries.length === 0 && (
            <div className="py-12 text-center text-gray-400 font-serif text-lg">
              No editorial series found for this topic.
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
write_page("editorial", editorial_content)

print("Added pagination and filtering to Editorial Series.")
