import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# 1. Audio Stories
audio_content = """'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function AudioStories() {
  const allPodcasts = [
    { title: "The Sound of the Loom", type: "Soundscape", dur: "24:15", desc: "An auditory journey through a traditional Kani weaving workshop in Kanihama." },
    { title: "Hammers of Zaina Kadal", type: "Soundscape", dur: "18:30", desc: "The rhythmic beats of fifty copper engravers working in unison." },
    { title: "The Chinar's Whisper", type: "Narrated Essay", dur: "21:05", desc: "A narrated essay on how the iconic Chinar leaf motif made its way onto Pashmina." },
    { title: "Dye Vats & Chemistry", type: "Soundscape", dur: "26:40", desc: "Listening to the boiling vats of madder root and walnut hull." },
    { title: "The Silent Stitch", type: "Soundscape", dur: "15:20", desc: "A meditative soundscape of a Sozni embroiderer at work." },
    { title: "Legacy of the Naqash", type: "Interview", dur: "32:10", desc: "An intimate conversation with a master papier-mâché artist about preserving designs." },
    { title: "Voices of the Karkhan", type: "Interview", dur: "28:45", desc: "Discussions with apprentices on the pressure of learning under strict masters." },
    { title: "The Geometry of Khatam-band", type: "Narrated Essay", dur: "19:50", desc: "Understanding the mathematical precision required for traditional ceiling woodwork without nails." }
  ];

  const filters = ['All', 'Soundscape', 'Narrated Essay', 'Interview'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredPodcasts = allPodcasts.filter(p => activeFilter === 'All' || p.type === activeFilter);
  const totalPages = Math.ceil(filteredPodcasts.length / itemsPerPage);
  const paginatedPodcasts = filteredPodcasts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#222222] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-4xl">
        <header className="mb-12 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Audio Stories (Podcasts)</h1>
          <p className="text-white/60 text-lg font-light">Immersive soundscapes and narrated essays exploring the sounds, myths, and legends surrounding Kashmir's craft heritage.</p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-8">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => { setActiveFilter(f); setCurrentPage(1); }}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors rounded-full ${
                activeFilter === f ? 'bg-[#D4AF37] text-[#111]' : 'bg-[#111] text-white/60 border border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl mb-12">
          <div className="space-y-2">
            {paginatedPodcasts.map((p, i) => (
              <Link href={`/master-artisans/stories/podcast-${i}`} key={i} className="flex items-center gap-6 p-4 hover:bg-white/5 rounded-xl transition-colors group block">
                <div className="w-12 h-12 flex-shrink-0 bg-white/10 group-hover:bg-[#D4AF37] rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-white group-hover:text-[#3E2723] ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                </div>
                <div className="flex-1">
                  <div className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold mb-1">{p.type}</div>
                  <h3 className="font-serif text-lg text-white group-hover:text-[#D4AF37] transition-colors leading-tight">Ep. {(currentPage - 1) * itemsPerPage + i + 1}: {p.title}</h3>
                  <p className="text-xs text-white/50 mt-1 line-clamp-1">{p.desc}</p>
                </div>
                <div className="text-xs font-mono text-gray-500">{p.dur}</div>
              </Link>
            ))}
            {paginatedPodcasts.length === 0 && (
              <div className="py-12 text-center text-white/40 font-serif text-lg">
                No audio stories found for this category.
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
            >
              &larr;
            </button>
            <span className="text-sm font-bold text-white/40 font-mono">Page {currentPage} of {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
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
write_page("studio/audio-stories", audio_content)


# 2. Magazine Issues
issues_content = """'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function MagazineIssues() {
  const allIssues = [
    { num: "01", title: "Women of the Loom", season: "Autumn", year: "2026", desc: "Exploring the silent backbone of Kashmiri craft: the women who spin, weave, and embroider from within their homes." },
    { num: "02", title: "The Copper Markets", season: "Summer", year: "2026", desc: "A photographic journey through the rhythmic, hammering lanes of Zaina Kadal and the evolution of Traam utensils." },
    { num: "03", title: "Papier-Mâché Geometries", season: "Spring", year: "2026", desc: "Decoding the intricate, mathematical precision of Naqashi patterns and the organic composition of the Sakhta base." },
    { num: "04", title: "The Walnut Legacy", season: "Winter", year: "2025", desc: "Tracing the lineage of undercut carving techniques and the slow, deliberate aging process of authentic Kashmiri walnut wood." },
    { num: "05", title: "Dyes of the Earth", season: "Autumn", year: "2025", desc: "The chemistry of natural dyes: madder root, walnut hull, and indigo, and the families who guard these secret recipes." },
    { num: "06", title: "The Talim Code", season: "Summer", year: "2025", desc: "Translating the complex shorthand script used to dictate Kani weaving patterns to the entire Karkhan." },
    { num: "07", title: "Reviving Waguv", season: "Spring", year: "2025", desc: "The endangered craft of river reed weaving and the environmental impact of losing the Dal Lake's natural materials." },
    { num: "08", title: "The Silk Route", season: "Winter", year: "2024", desc: "Tracing the historical trade routes that brought Central Asian carpet weaving techniques into the heart of Srinagar." }
  ];

  const filters = ['All', '2026', '2025', '2024'];
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredIssues = allIssues.filter(iss => activeFilter === 'All' || iss.year === activeFilter);
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const paginatedIssues = filteredIssues.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-12 border-b border-[#3E2723]/10 pb-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Quarterly Magazine</h1>
          <p className="text-gray-600 text-lg">Deeply researched editorial issues covering the history, techniques, and people of Kashmir's heritage arts.</p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => { setActiveFilter(f); setCurrentPage(1); }}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                activeFilter === f ? 'bg-[#3E2723] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#3E2723] hover:text-[#3E2723]'
              }`}
            >
              {f === 'All' ? 'All Years' : f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {paginatedIssues.map((issue, i) => (
            <Link href={`/master-artisans/issues/${issue.num}`} key={i} className="group block">
              <div className="relative aspect-[3/4] shadow-xl mb-6 bg-gray-100 overflow-hidden border-[6px] border-white group-hover:border-[#D4AF37] transition-colors duration-500">
                <Image src="/assets/images/artisan-portrait.jpg" alt={issue.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                <div className="absolute top-4 w-full text-center">
                  <h3 className="text-white font-serif text-3xl drop-shadow-md">KHCRF</h3>
                  <div className="text-white/90 text-[8px] uppercase tracking-widest font-bold">Quarterly Review</div>
                </div>
                <div className="absolute bottom-4 w-full text-center px-4">
                  <h4 className="text-[#D4AF37] font-serif text-xl drop-shadow-md leading-tight">{issue.title}</h4>
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Issue {issue.num} • {issue.season} {issue.year}</div>
                <h3 className="text-lg font-serif text-[#3E2723] group-hover:text-[#D4AF37] transition-colors mb-2">{issue.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{issue.desc}</p>
              </div>
            </Link>
          ))}
          {paginatedIssues.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 font-serif text-lg">
              No magazine issues found for this year.
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
write_page("issues", issues_content)

print("Added pagination and filtering to Audio Stories and Magazine Issues.")
