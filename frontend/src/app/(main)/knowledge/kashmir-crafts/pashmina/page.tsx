import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "Kashmir Pashmina | KHCRF Craft Record",
  description: "The authoritative knowledge record for Kashmir Pashmina: materials, techniques, GI, authenticity, provenance, and care.",
};

export default function PashminaMasterPage() {
  return (
    <div className="bg-[#f6f5f1] min-h-screen">
      
      {/* 1. MASTER CRAFT HERO */}
      <section className="pt-32 pb-24 px-4 bg-[#071025] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link href="/knowledge/kashmir-crafts" className="text-[10px] font-bold uppercase tracking-widest text-[#a9783c] hover:text-white transition-colors">
              ← Return to Craft Atlas
            </Link>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4">
            KASHMIR TEXTILES · GI PROTECTED
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-serif mb-8">Kashmir Pashmina</h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl leading-relaxed">
            Fine-fibre textile knowledge shaped through specialist hand processing, spinning, weaving and finishing. The definitive reference for origin, authenticity, and geographic protection.
          </p>
        </div>
      </section>

      {/* 2. KNOWLEDGE NAVIGATION BAR */}
      <section className="sticky top-0 z-40 bg-white border-b border-[rgba(7,16,37,0.1)]">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-8 h-16 text-[10px] font-bold uppercase tracking-widest text-[#8a93a3] whitespace-nowrap">
            <a href="#overview" className="hover:text-[#071025]">Overview</a>
            <a href="#materials" className="hover:text-[#071025]">Materials</a>
            <a href="#process" className="hover:text-[#071025]">Process & Techniques</a>
            <a href="#gi" className="hover:text-[#071025]">GI & Authenticity</a>
            <a href="#provenance" className="hover:text-[#071025]">Provenance</a>
            <a href="#value" className="hover:text-[#071025]">Value & Buyers</a>
            <a href="#care" className="hover:text-[#071025]">Care</a>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 py-24">
        
        {/* We will build the architectural components here based on user directives */}
        <div className="flex items-center justify-center min-h-[40vh] border-2 border-dashed border-[rgba(7,16,37,0.1)] rounded-3xl">
          <div className="text-center">
            <h2 className="text-2xl font-serif font-black text-[#071025] mb-2">Master Profile Scaffold</h2>
            <p className="text-[#8a93a3]">Awaiting structural directives from the user.</p>
          </div>
        </div>

      </main>

    </div>
  );
}