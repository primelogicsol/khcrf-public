import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

apprentices_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Apprentices() {
  const allStudents = [
    { name: "Riyaz Ahmad", craft: "Carpet Weaving", ustad: "Ustad Ghulam Hassan", slug: "riyaz-ahmad" },
    { name: "Shabir Ali", craft: "Sozni Embroidery", ustad: "Fatima Begum", slug: "shabir-ali" },
    { name: "Asif Jan", craft: "Walnut Carving", ustad: "Ali Mohammad Najjar", slug: "asif-jan" },
    { name: "Naseer Bhat", craft: "Copperware", ustad: "Tariq Ahmad", slug: "naseer-bhat" },
    { name: "Iqra Bano", craft: "Pashmina", ustad: "Hajira Begum", slug: "iqra-bano" },
    { name: "Muneer", craft: "Papier-Mâché", ustad: "Zahid Dar", slug: "muneer" },
    { name: "Bilal", craft: "Namda Felting", ustad: "Zareena Bano", slug: "bilal" },
    { name: "Fayaz", craft: "Willow Wicker", ustad: "Asiya Jan", slug: "fayaz" },
    { name: "Tariq", craft: "Copperware", ustad: "Ghulam Nabi", slug: "tariq" },
    { name: "Sajad", craft: "Walnut Carving", ustad: "Ali Mohammad Najjar", slug: "sajad" },
    { name: "Aabida", craft: "Pashmina", ustad: "Hajira Begum", slug: "aabida" },
    { name: "Irfan", craft: "Sozni Embroidery", ustad: "Fatima Begum", slug: "irfan" }
  ];

  const filters = ['All', 'Carpet Weaving', 'Sozni Embroidery', 'Walnut Carving', 'Copperware', 'Pashmina', 'Papier-Mâché'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredStudents = allStudents.filter(s => activeFilter === 'All' || s.craft === activeFilter);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Apprentices & Shagirds</h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            In the Kashmiri tradition, a 'Shagird' studies under an 'Ustad' (Master) for years before producing independent work. Documenting these students is vital to tracing the living transfer of knowledge.
          </p>
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {paginatedStudents.map((student, i) => (
            <Link href={`/master-artisans/artisans/${student.slug}`} key={i} className="block bg-white border border-gray-100 p-6 text-center group hover:border-[#D4AF37] transition-colors shadow-sm hover:shadow-md">
              <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-50 border-2 border-transparent group-hover:border-[#D4AF37] transition-colors">
                 <Image src="/assets/images/artisan-portrait.jpg" alt={student.name} fill className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
              </div>
              <h3 className="font-serif text-lg text-[#3E2723] mb-1 group-hover:text-[#D4AF37] transition-colors">{student.name}</h3>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">{student.craft}</div>
              <div className="text-xs text-[#3949AB] bg-[#3949AB]/5 py-2 px-2 border border-transparent group-hover:border-[#3949AB]/20 transition-colors">
                <span className="block text-[9px] text-gray-500 uppercase mb-1">Apprentice to:</span>
                <span className="font-bold line-clamp-1">{student.ustad}</span>
              </div>
            </Link>
          ))}
          {paginatedStudents.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 font-serif text-lg">
              No apprentices found for this craft category.
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
write_page("artisans/apprentices", apprentices_content)

print("Added pagination and filtering to Apprentices.")
