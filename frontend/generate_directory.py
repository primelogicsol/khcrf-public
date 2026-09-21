import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

# Artisan Directory Page
directory_content = """import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ArtisanDirectory() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-12 border-b border-[#3E2723]/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Master Artisans Directory</h1>
          <p className="text-gray-600 text-lg max-w-3xl">Explore verified artisans, living legends, workshop communities, and knowledge holders across Kashmir’s craft traditions.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <h3 className="font-bold text-sm uppercase tracking-widest text-[#3E2723] mb-6">Filters</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Craft</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  {['Pashmina', 'Kani', 'Sozni', 'Papier Mâché', 'Walnut Carving', 'Carpet Weaving'].map(c => (
                    <label key={c} className="flex items-center gap-2 cursor-pointer hover:text-[#D4AF37]">
                      <input type="checkbox" className="accent-[#3E2723]" /> {c}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Status</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  {['Verified', 'Living Legend', 'Oral History Available', 'Collection Linked'].map(s => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer hover:text-[#D4AF37]">
                      <input type="checkbox" className="accent-[#3E2723]" /> {s}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Directory Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Link href="/master-artisans/artisans/ali-mohammad-najjar" key={item} className="bg-white border border-[#3E2723]/10 hover:border-[#D4AF37] transition-all duration-300 group">
                  <div className="relative aspect-square">
                    <Image src="https://images.unsplash.com/photo-1544168190-79c15427015f?q=80&w=600&auto=format&fit=crop" alt="Artisan" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    <div className="absolute top-3 left-3 bg-[#3E2723] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span> Verified
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif text-[#3E2723] mb-1 group-hover:text-[#D4AF37] transition-colors">Ali Mohammad Najjar</h3>
                    <div className="text-xs font-bold text-[#3949AB] uppercase tracking-wider mb-3">Walnut Wood Carving • Srinagar</div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">Master of undercut floral relief carving with over 55 years of practice in Safa Kadal.</p>
                    <div className="flex gap-2">
                      <span className="bg-[#FAF9F6] text-gray-500 text-[10px] uppercase font-bold tracking-wider px-2 py-1 border border-gray-100">Oral History</span>
                      <span className="bg-[#FAF9F6] text-gray-500 text-[10px] uppercase font-bold tracking-wider px-2 py-1 border border-gray-100">Collection</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
"""

with open(os.path.join(base_dir, r"artisans\page.tsx"), "w", encoding="utf-8") as f:
    f.write(directory_content)

# Artisan Profile Page
profile_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ArtisanProfile() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24">
      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-[#3E2723] text-white">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image src="https://images.unsplash.com/photo-1544168190-79c15427015f?q=80&w=2000&auto=format&fit=crop" alt="Background" fill className="object-cover grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723] to-transparent"></div>
        </div>
        
        <div className="relative z-10 container-fluid mx-auto px-4 md:px-10 flex flex-col md:flex-row gap-12 items-end">
          <div className="w-48 h-48 md:w-64 md:h-64 relative border-4 border-white/10 shadow-2xl flex-shrink-0">
            <Image src="https://images.unsplash.com/photo-1544168190-79c15427015f?q=80&w=600&auto=format&fit=crop" alt="Artisan Portrait" fill className="object-cover" />
          </div>
          
          <div className="flex-1 pb-4">
            <div className="flex gap-3 mb-4">
              <span className="bg-[#D4AF37] text-[#3E2723] text-[10px] font-bold uppercase tracking-widest px-2 py-1 flex items-center gap-1">
                Verified Master
              </span>
              <span className="bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 border border-white/20">
                Living Legend
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif mb-2">Ali Mohammad Najjar</h1>
            <div className="text-sm md:text-base text-white/70 font-semibold uppercase tracking-wider mb-6">
              Walnut Wood Carving • Srinagar, Kashmir
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link href="#studio" className="bg-white text-[#3E2723] hover:bg-[#D4AF37] px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors">
                Watch Interview
              </Link>
              <Link href="#gallery" className="border border-white/30 text-white hover:bg-white/10 px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors">
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container-fluid mx-auto px-4 md:px-10 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-16">
          <section>
            <h2 className="text-2xl font-serif text-[#3E2723] mb-6 border-b border-[#3E2723]/10 pb-4">Life Journey</h2>
            <div className="prose prose-stone max-w-none text-gray-700 font-light leading-relaxed">
              <p className="text-lg">Born in 1951 in the historic neighborhood of Safa Kadal, Srinagar, Ali Mohammad Najjar represents the fifth generation of a continuous lineage of master wood carvers. His initial training began at the age of ten under the strict tutelage of his father, Ghulam Ahmad Najjar.</p>
              <p>For over five decades, Ali Mohammad has refined the art of 'Undercut Carving' (Vatta Chikan), achieving a level of three-dimensional depth that few contemporaries can match. His workshop remains a sanctuary of traditional methods, where the scent of aged walnut wood mingles with the rhythmic tapping of hand-forged chisels.</p>
            </div>
          </section>

          <section id="studio">
            <h2 className="text-2xl font-serif text-[#3E2723] mb-6 border-b border-[#3E2723]/10 pb-4">KHCRF Studio Archive</h2>
            <div className="aspect-video bg-black relative flex items-center justify-center group cursor-pointer">
              <Image src="https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=1200&auto=format&fit=crop" alt="Video Thumbnail" fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
              <div className="absolute w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center z-10 pl-1 text-[#3E2723]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-start">
              <div>
                <h3 className="font-serif text-lg font-bold">Oral History: The Chisel's Memory</h3>
                <p className="text-sm text-gray-500">Recorded: August 2025 • Duration: 45:20</p>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#3949AB] bg-[#3949AB]/10 px-2 py-1">Transcript Available</span>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-12">
          <div className="bg-white p-6 border border-[#3E2723]/10 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#3E2723] mb-4">Overview</h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><strong className="block text-gray-400 text-xs uppercase tracking-wider">Years of Practice</strong> 55+ Years</li>
              <li><strong className="block text-gray-400 text-xs uppercase tracking-wider">Primary Material</strong> Kashmiri Walnut Wood (Juglans regia)</li>
              <li><strong className="block text-gray-400 text-xs uppercase tracking-wider">Signature Technique</strong> Deep Undercut Relief</li>
              <li><strong className="block text-gray-400 text-xs uppercase tracking-wider">Workshop Location</strong> Safa Kadal, Srinagar</li>
            </ul>
          </div>

          <div className="bg-white p-6 border border-[#3E2723]/10 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#3E2723] mb-4">Craft Lineage</h3>
            <div className="relative border-l border-[#D4AF37] ml-2 space-y-6">
              <div className="relative pl-6">
                <span className="absolute w-2 h-2 bg-[#D4AF37] rounded-full left-[-4px] top-1.5"></span>
                <div className="text-xs text-gray-400 uppercase">Teacher (Father)</div>
                <div className="font-bold text-gray-800">Ghulam Ahmad Najjar</div>
              </div>
              <div className="relative pl-6">
                <span className="absolute w-3 h-3 bg-[#3E2723] rounded-full left-[-6px] top-1.5 ring-4 ring-[#FAF9F6]"></span>
                <div className="text-xs text-[#D4AF37] font-bold uppercase">Current Master</div>
                <div className="font-bold text-[#3E2723] text-lg">Ali Mohammad</div>
              </div>
              <div className="relative pl-6">
                <span className="absolute w-2 h-2 bg-gray-300 rounded-full left-[-4px] top-1.5"></span>
                <div className="text-xs text-gray-400 uppercase">Apprentice (Son)</div>
                <div className="font-bold text-gray-800">Tariq Najjar</div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#3E2723] text-white p-6 text-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-3">Citation</h3>
            <p className="font-mono text-xs text-white/70 leading-relaxed">
              KHCRF. "Ali Mohammad Najjar." Master Artisans of Kashmir Archive. Hamadan Craft Revival Foundation, 2026.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
"""

with open(os.path.join(base_dir, r"artisans\[slug]\page.tsx"), "w", encoding="utf-8") as f:
    f.write(profile_content)

print("Artisan Directory and Profile pages created.")
