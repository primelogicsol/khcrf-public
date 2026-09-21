import os

components_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\components\master-artisans"
os.makedirs(components_dir, exist_ok=True)

# 1. Landing Page UI (/master-artisans/page.tsx)
landing_page_path = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans\page.tsx"

landing_content = """import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlay, FaChevronRight } from 'react-icons/fa';

export const metadata = {
  title: 'Master Artisans of Kashmir | KHCRF',
  description: 'Documenting the living custodians of Kashmir’s craft traditions through stories, lineages, techniques, workshops, collections, and oral histories.',
};

export default function MasterArtisansLanding() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans selection:bg-[#D4AF37] selection:text-[#3E2723]">
      
      {/* 1. Cinematic Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/images/master-artisans-hero.jpg" 
            alt="Artisan Hands" 
            fill 
            className="object-cover object-center"
            priority
            onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=2000&auto=format&fit=crop' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/90 via-[#3E2723]/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container-fluid mx-auto px-4 md:px-10 text-center mt-20">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 tracking-wide drop-shadow-lg">
            MASTER ARTISANS <br/> <span className="text-[#D4AF37] italic font-light">of</span> KASHMIR
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            Documenting the living custodians of Kashmir's craft traditions through stories, lineages, techniques, workshops, collections, and oral histories.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Link href="/master-artisans/artisans" className="bg-[#D4AF37] hover:bg-white text-[#3E2723] px-8 py-3 rounded-sm font-bold uppercase tracking-widest text-xs transition-all duration-300">
              Explore Artisans
            </Link>
            <Link href="/master-artisans/studio" className="bg-transparent border border-white hover:bg-white hover:text-[#3E2723] text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center gap-2">
              <FaPlay className="text-[10px]" /> Watch Studio
            </Link>
            <Link href="/master-artisans/nominate" className="bg-transparent border border-white/50 hover:border-white text-white/80 hover:text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest text-xs transition-all duration-300">
              Nominate an Artisan
            </Link>
          </div>
          
          <div className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-bold border-t border-white/20 pt-6 max-w-2xl mx-auto flex justify-center gap-4 flex-wrap">
            <span>Living Archive</span>
            <span>•</span>
            <span>Oral Histories</span>
            <span>•</span>
            <span>Craft Lineages</span>
            <span>•</span>
            <span>Heritage Collections</span>
          </div>
        </div>
      </section>

      {/* 2. Featured Master Artisan */}
      <section className="py-24 px-4 md:px-10 container-fluid mx-auto" id="featured">
        <div className="flex flex-col lg:flex-row gap-12 items-center bg-white shadow-xl shadow-[#3E2723]/5 p-6 md:p-12 border border-[#3E2723]/10">
          <div className="w-full lg:w-5/12 relative aspect-[3/4]">
            <Image 
              src="https://images.unsplash.com/photo-1544168190-79c15427015f?q=80&w=1000&auto=format&fit=crop" 
              alt="Featured Artisan" 
              fill 
              className="object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute top-4 left-4 bg-[#3E2723] text-[#D4AF37] px-3 py-1 text-xs font-bold uppercase tracking-widest">
              Living Legend
            </div>
          </div>
          
          <div className="w-full lg:w-7/12 flex flex-col justify-center">
            <h4 className="text-[#D4AF37] font-bold uppercase tracking-widest text-sm mb-4 border-b border-[#D4AF37]/30 pb-2 inline-block">Featured Artisan</h4>
            <h2 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-2">Ali Mohammad Najjar</h2>
            
            <div className="flex gap-4 mb-6 text-sm text-[#3949AB] font-semibold uppercase tracking-wider">
              <span>Walnut Wood Carving</span>
              <span className="text-gray-300">|</span>
              <span>Srinagar</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8 text-sm border-y border-gray-100 py-4">
              <div>
                <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Years of Practice</span>
                <span className="font-serif text-lg text-[#3E2723]">55+ Years</span>
              </div>
              <div>
                <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Recognition</span>
                <span className="font-serif text-lg text-[#3E2723]">Shilp Guru Awardee</span>
              </div>
              <div className="col-span-2">
                <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Signature Technique</span>
                <span className="font-serif text-lg text-[#3E2723]">Undercut Floral Relief (Deep Carving)</span>
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed mb-10 text-lg">
              Born into a lineage that traces its roots to the 19th century, Ali Mohammad has dedicated his life to perfecting the deepest forms of walnut wood carving. His workshop in Safa Kadal remains one of the last bastions where traditional tools are still hand-forged by the master himself.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/master-artisans/artisans/ali-mohammad-najjar" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors">
                Read Full Profile
              </Link>
              <Link href="/master-artisans/studio/ali-mohammad-interview" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723] hover:text-white px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors">
                Watch Interview
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Latest Stories */}
      <section className="py-24 bg-[#3E2723] text-[#FAF9F6] px-4 md:px-10" id="stories">
        <div className="container-fluid mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-[#FAF9F6]/20 pb-4">
            <div>
              <h2 className="text-4xl font-serif text-[#D4AF37] mb-2">Editorial Archive</h2>
              <p className="text-white/70 font-light">Essays, interviews, and stories from the craft ecosystem.</p>
            </div>
            <Link href="/master-artisans/stories" className="hidden md:flex items-center gap-2 text-[#D4AF37] text-sm uppercase tracking-widest font-bold hover:text-white transition-colors">
              View All <FaChevronRight className="text-[10px]" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group cursor-pointer">
                <div className="relative aspect-[4/3] mb-6 overflow-hidden">
                  <Image src={`https://images.unsplash.com/photo-1610992015732-2808058b475d?q=80&w=800&auto=format&fit=crop`} alt="Story" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                    Artisan Story
                  </div>
                </div>
                <div className="flex gap-4 text-[10px] uppercase tracking-widest text-white/50 mb-3">
                  <span>Pashmina</span>
                  <span>•</span>
                  <span>7 Min Read</span>
                  <span>•</span>
                  <span>Oct 2026</span>
                </div>
                <h3 className="text-2xl font-serif mb-3 group-hover:text-[#D4AF37] transition-colors">The Spinners of Eidgah: A Fading Symphony</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">An intimate look at the daily lives and rhythmic labor of the women who spin the finest Pashm yarn on traditional yander wheels.</p>
                <div className="text-sm font-semibold text-[#D4AF37]">By Dr. Sarah Qadri</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Browse by Craft */}
      <section className="py-24 px-4 md:px-10 container-fluid mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif text-[#3E2723] mb-4">Browse by Craft</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Explore artisans, stories, and collections across Kashmir's primary heritage crafts.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['Pashmina', 'Kani', 'Sozni', 'Papier Mâché', 'Walnut Carving', 'Carpet Weaving', 'Copperware', 'Namda', 'Crewel', 'Chain Stitch', 'Willow Wicker', 'Silverware'].map((craft) => (
            <Link href={`/master-artisans/artisans?craft=${craft.toLowerCase().replace(' ', '-')}`} key={craft} className="group block border border-[#3E2723]/10 hover:border-[#D4AF37] bg-white p-6 text-center transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 mx-auto bg-[#FAF9F6] rounded-full flex items-center justify-center mb-4 text-[#3E2723] group-hover:text-[#D4AF37] transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h4 className="font-serif text-[#3E2723] group-hover:text-[#D4AF37] transition-colors">{craft}</h4>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">12 Artisans</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Studio & Heritage (Split) */}
      <section className="py-24 bg-white px-4 md:px-10 border-y border-[#3E2723]/10">
        <div className="container-fluid mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Studio Column */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-[2px] bg-[#D4AF37]"></div>
              <h2 className="text-3xl font-serif text-[#3E2723]">KHCRF Studio</h2>
            </div>
            <p className="text-gray-500 mb-8 font-light">Documentary films, oral histories, and workshop diaries preserving the voice, hand, and memory of the masters.</p>
            
            <div className="space-y-6">
              {[1, 2, 3].map((item) => (
                <Link href="/master-artisans/studio/example" key={item} className="flex gap-6 group items-center">
                  <div className="relative w-32 h-24 flex-shrink-0">
                    <Image src="https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=400&auto=format&fit=crop" alt="Video" fill className="object-cover group-hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#3E2723]/80 flex items-center justify-center text-white pl-1">
                        <FaPlay className="text-[10px]" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[#3949AB] font-bold mb-1">Documentary • 15:20</div>
                    <h4 className="font-serif text-lg text-[#3E2723] group-hover:text-[#D4AF37] transition-colors leading-tight mb-2">The Copper Smiths of Zaina Kadal</h4>
                    <p className="text-xs text-gray-500">Transcript Available in English</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/master-artisans/studio" className="text-sm font-bold uppercase tracking-widest text-[#3E2723] border-b border-[#3E2723] pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">Enter Studio</Link>
            </div>
          </div>

          {/* Heritage Collections Column */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-[2px] bg-[#D4AF37]"></div>
              <h2 className="text-3xl font-serif text-[#3E2723]">Heritage Collections</h2>
            </div>
            <p className="text-gray-500 mb-8 font-light">A museum-quality archive of documented craft objects, rare masterpieces, and artisan-linked works.</p>
            
            <div className="grid grid-cols-2 gap-6">
              {[1, 2].map((item) => (
                <Link href="/master-artisans/collections/example" key={item} className="group">
                  <div className="relative aspect-square mb-4 bg-[#FAF9F6] border border-[#3E2723]/10 p-4">
                    <Image src="https://images.unsplash.com/photo-1590727264875-520e5db197d1?q=80&w=600&auto=format&fit=crop" alt="Object" fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-700 mix-blend-multiply" />
                    <div className="absolute top-2 right-2">
                      <span className="bg-[#3E2723]/10 text-[#3E2723] px-2 py-1 text-[8px] uppercase tracking-widest font-bold">Archive Record</span>
                    </div>
                  </div>
                  <h4 className="font-serif text-[#3E2723] group-hover:text-[#D4AF37] transition-colors">Safavid Revival Carpet</h4>
                  <div className="text-xs text-gray-400 mt-1">Carpet Weaving • 2012</div>
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/master-artisans/collections" className="text-sm font-bold uppercase tracking-widest text-[#3E2723] border-b border-[#3E2723] pb-1 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">View All Collections</Link>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Nominate */}
      <section className="py-32 px-4 md:px-10 bg-[#3E2723] text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-6">Preserve a Legacy</h2>
          <p className="text-white/80 text-lg mb-10 font-light">
            Know a master artisan whose knowledge, skill, and contribution should be documented in the KHCRF living archive?
          </p>
          <Link href="/master-artisans/nominate" className="bg-[#D4AF37] text-[#3E2723] hover:bg-white px-10 py-4 font-bold uppercase tracking-widest text-sm transition-colors inline-block shadow-lg">
            Nominate an Artisan
          </Link>
        </div>
      </section>

    </main>
  );
}
"""

with open(landing_page_path, "w", encoding="utf-8") as f:
    f.write(landing_content)

print("Landing page created.")
