import React from 'react';
import Image from 'next/image';
import Link from 'next/link';


import { Metadata } from 'next';
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};


export default async function CollectionDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const title = resolvedParams.slug.replace(/-/g, ' ').replace(/\w/g, c => c.toUpperCase());
  
  return (
    <main className="bg-[#3E2723] min-h-screen text-[#FAF9F6] font-sans">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-6xl">
        <Link href="/master-artisans/collections" className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white mb-8 inline-block">
          &larr; Back to Archive
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="relative aspect-[3/4] bg-white/5 border border-white/10 p-8">
              <Image src="/assets/images/heritage-object.jpg" alt="Artifact" fill className="object-contain p-8 drop-shadow-2xl mix-blend-screen opacity-90" />
            </div>
          </div>
          
          <div className="py-8">
            <div className="flex gap-4 mb-4">
              <span className="bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Accession: KH-2026-X</span>
              <span className="border border-white/20 text-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Heritage Archive</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-6">{title}</h1>
            
            <div className="prose prose-invert max-w-none mb-10">
              <p className="text-lg text-white/70 font-light leading-relaxed">
                This exceptionally rare object demonstrates the pinnacle of historical Kashmiri artisanship. Preserved in the KHCRF archives, it serves as a master reference for identifying authentic traditional techniques, dyes, and structural integrity.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 border-t border-white/10 pt-8">
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Dating / Era</div>
                <div className="font-serif text-xl">Late 19th Century</div>
              </div>
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Material</div>
                <div className="font-serif text-xl">Organic & Mineral Base</div>
              </div>
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Provenance</div>
                <div className="font-serif text-xl">Downtown Srinagar</div>
              </div>
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Condition</div>
                <div className="font-serif text-xl text-green-400">Conserved</div>
              </div>
            </div>
            
            <div className="mt-12 flex gap-4">
              <button className="bg-white text-[#3E2723] hover:bg-[#D4AF37] px-8 py-3 text-xs font-bold uppercase tracking-widest transition-colors">
                View High-Res Scan
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
