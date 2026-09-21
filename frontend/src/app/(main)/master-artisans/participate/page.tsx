import React from 'react';
import Link from 'next/link';

export default function Participate() {
  return (
    <main className="bg-[#3E2723] min-h-screen text-[#FAF9F6] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-5xl text-center">
        <header className="mb-20">
          <h1 className="text-4xl md:text-6xl font-serif text-[#D4AF37] mb-6">Contribute to the Archive</h1>
          <p className="text-white/70 text-lg font-light max-w-3xl mx-auto">KHCRF is a collaborative effort. Whether you are a researcher, a writer, a photographer, or an artisan, your contributions help build the definitive digital memory of Kashmir's crafts.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          
          <div className="bg-white/5 border border-white/10 p-10 hover:border-[#D4AF37] transition-colors">
            <div className="w-12 h-12 bg-[#D4AF37] flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#3E2723]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </div>
            <h2 className="text-2xl font-serif mb-4">Submit a Story</h2>
            <p className="text-white/60 mb-8 font-light leading-relaxed">Have you conducted an interview or written an essay on a specific craft technique, lineage, or artisan? Submit your editorial piece for publication in the KHCRF Archive.</p>
            <button className="bg-transparent border border-white hover:bg-white hover:text-[#3E2723] px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors w-full">Submit Draft</button>
          </div>

          <div className="bg-white/5 border border-white/10 p-10 hover:border-[#D4AF37] transition-colors">
            <div className="w-12 h-12 bg-[#D4AF37] flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#3E2723]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h2 className="text-2xl font-serif mb-4">Become a Contributor</h2>
            <p className="text-white/60 mb-8 font-light leading-relaxed">Join our network of field researchers, academic scholars, and cultural photographers dedicated to documenting the living heritage of Kashmir.</p>
            <button className="bg-[#D4AF37] border border-[#D4AF37] text-[#3E2723] hover:bg-white hover:border-white px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors w-full">Apply Now</button>
          </div>
          
          <div className="col-span-1 md:col-span-2 mt-8 bg-white/5 border border-white/10 p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-serif mb-2">Support Documentation</h2>
              <p className="text-white/60 font-light">Fund specific archival projects, documentary films, or museum acquisitions.</p>
            </div>
            <Link href="/about/donations" className="bg-[#3949AB] text-white hover:bg-white hover:text-[#3949AB] px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap">
              Donate to the Archive
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
