import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# 1. Stories Index
stories_index_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function StoriesIndex() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Latest Stories</h1>
          <p className="text-gray-600 text-lg">Essays, interviews, and deep dives into the lives and lineages of Kashmir's master artisans.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Link href={`/master-artisans/stories/story-${item}`} key={item} className="group cursor-pointer flex flex-col">
              <div className="relative aspect-[4/3] mb-6 overflow-hidden">
                <Image src="/assets/images/master-artisans-hero.jpg" alt="Story" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  Artisan Story
                </div>
              </div>
              <div className="flex gap-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">
                <span>Pashmina</span>
                <span>•</span>
                <span>7 Min Read</span>
              </div>
              <h3 className="text-2xl font-serif text-[#3E2723] mb-3 group-hover:text-[#D4AF37] transition-colors leading-tight">The Spinners of Eidgah: A Fading Symphony</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">An intimate look at the daily lives and rhythmic labor of the women who spin the finest Pashm yarn on traditional yander wheels.</p>
              <div className="text-xs font-bold text-[#3949AB] uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors">Read Story &rarr;</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("stories", stories_index_content)

# 2. Studio Detail Player
studio_detail_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function StudioDetail() {
  return (
    <main className="bg-[#1A1A1A] min-h-screen text-white font-sans pt-24 pb-24">
      {/* Video Player Area */}
      <div className="bg-black w-full aspect-video max-h-[75vh] relative flex items-center justify-center">
        <Image src="/assets/images/master-artisans-hero.jpg" alt="Video Player" fill className="object-cover opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center pl-2 hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-[#3E2723]" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
          </button>
        </div>
        {/* Fake Video Controls */}
        <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-black/80 to-transparent flex items-end px-6 pb-4">
          <div className="w-full h-1 bg-white/30 rounded-full"><div className="w-1/3 h-full bg-[#D4AF37] rounded-full"></div></div>
        </div>
      </div>

      <div className="container-fluid mx-auto px-4 md:px-10 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex gap-4 text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold mb-4">
            <span>Documentary</span>
            <span>•</span>
            <span>English Transcript</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif mb-6">The Copper Smiths of Zaina Kadal</h1>
          <p className="text-white/70 leading-relaxed text-lg mb-8">
            A comprehensive look into the roaring fires and rhythmic hammering of Srinagar's oldest copperware district. Master artisan Tariq Ahmad explains the 'Naqashi' engraving process, a skill passed down through his family for over two centuries.
          </p>
          
          <div className="flex gap-4">
            <button className="bg-white/10 hover:bg-white/20 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Download Transcript
            </button>
            <button className="bg-white/10 hover:bg-white/20 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg> Share
            </button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-6 border-b border-white/10 pb-4">Up Next</h3>
          <div className="space-y-6">
            {[1, 2, 3].map(item => (
              <Link href={`/master-artisans/studio/video-${item}`} key={item} className="flex gap-4 group">
                <div className="w-32 aspect-video bg-black relative flex-shrink-0">
                  <Image src="/assets/images/artisan-portrait.jpg" alt="Thumbnail" fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <h4 className="font-serif text-sm leading-tight mb-1 group-hover:text-[#D4AF37] transition-colors">Oral History: The Chisel's Memory</h4>
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest">45:20 • Walnut Carving</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
"""
write_page(r"studio\[slug]", studio_detail_content)


# 3. Magazine Issue Detail
issue_detail_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function IssueDetail() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <Link href="/master-artisans/issues" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#D4AF37] mb-8 inline-block">
          &larr; Back to Issues
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/3">
            <div className="relative aspect-[3/4] shadow-2xl">
              <Image src="/assets/images/artisan-portrait.jpg" alt="Magazine Cover" fill className="object-cover" />
              <div className="absolute inset-0 border-[8px] border-white/20"></div>
              <div className="absolute top-6 w-full text-center">
                <h3 className="text-white font-serif text-4xl drop-shadow-md">KHCRF</h3>
                <div className="text-white/80 text-[10px] uppercase tracking-widest font-bold">Quarterly Review</div>
              </div>
              <div className="absolute bottom-6 w-full text-center px-4">
                <h4 className="text-[#D4AF37] font-serif text-3xl drop-shadow-md leading-tight mb-2">The Woodcarvers of Srinagar</h4>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-2/3">
            <div className="text-[#D4AF37] font-bold uppercase tracking-widest text-sm mb-4">Issue 01 • Autumn 2026</div>
            <h1 className="text-4xl md:text-6xl font-serif text-[#3E2723] mb-6">The Woodcarvers of Srinagar</h1>
            <p className="text-xl text-gray-600 mb-8 font-light leading-relaxed">
              A deep dive into the undercut relief carving techniques and the masters who keep this 19th-century tradition alive. Featuring exclusive interviews, historical provenance of walnut wood, and a photo essay from the workshops of Safa Kadal.
            </p>
            
            <div className="flex gap-4 mb-12">
              <button className="bg-[#3E2723] text-white hover:bg-[#D4AF37] px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors shadow-lg">
                Read Online
              </button>
              <button className="bg-white border border-gray-300 text-gray-600 hover:border-[#3E2723] hover:text-[#3E2723] px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> Download PDF
              </button>
            </div>

            <div className="bg-white border border-gray-200 p-8">
              <h3 className="text-xl font-serif text-[#3E2723] mb-6 border-b border-gray-100 pb-4">Inside this Issue</h3>
              <ul className="space-y-6">
                {[
                  { title: "The Anatomy of Walnut Wood", page: "04" },
                  { title: "Interview: Master Ali Mohammad Najjar", page: "12" },
                  { title: "Photo Essay: Tools of the Trade", page: "26" },
                  { title: "Market Realities & Modern Fakes", page: "34" },
                ].map((article, i) => (
                  <li key={i} className="flex justify-between items-center group cursor-pointer">
                    <span className="font-medium text-gray-700 group-hover:text-[#D4AF37] transition-colors">{article.title}</span>
                    <span className="text-xs font-mono text-gray-400">pg. {article.page}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
"""
write_page(r"issues\[slug]", issue_detail_content)

print("Missing CTA pages (Stories Index, Studio Detail, Issue Detail) created.")
