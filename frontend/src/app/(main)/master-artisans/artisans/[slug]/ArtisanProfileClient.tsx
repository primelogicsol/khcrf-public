'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlay, FaDownload, FaCamera, FaArrowRight } from 'react-icons/fa';
import { notFound } from 'next/navigation';



import { getBaseUrlNoApi } from "@/lib/api";
const API_BASE_URL = getBaseUrlNoApi();

export default function ArtisanProfileClient({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const [master, setMaster] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/artisans/${resolvedParams.slug}`).catch(() => ({ ok: false, json: () => Promise.resolve([]) }))
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setMaster(data);
        setLoading(false);
      })
      .catch(() => {
        setMaster(null);
        setLoading(false);
      });
  }, [resolvedParams.slug]);

  if (loading) return <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center font-serif text-[#3E2723]">Loading profile...</div>;
  if (!master) return notFound();

  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24 selection:bg-[#D4AF37] selection:text-[#3E2723]">
      
      {/* 1. Hero (Split Screen Layout) */}
      <section className="relative pt-32 pb-0 border-b border-[#3E2723]/10 universal-hero">
        <div className="container-fluid mx-auto flex flex-col lg:flex-row items-stretch">
          
          <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-[#3E2723] text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 flex items-center gap-2 shadow-sm">
                <svg className="w-3 h-3 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Verified Master Artisan
              </span>
              <span className="bg-[#FAF9F6] text-[#3E2723] border border-[#3E2723]/20 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5">
                Living Legend
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif mb-6 text-[#3E2723] leading-none">{master.name}</h1>
            
            <div className="flex gap-4 mb-10 text-sm text-[#3949AB] font-bold uppercase tracking-wider">
              <span>{master.craft}</span>
              <span className="text-gray-300">|</span>
              <span>{master.loc}, Kashmir</span>
            </div>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-10">
              <div>
                <span className="block text-gray-400 text-[10px] uppercase tracking-widest mb-1 font-bold">Years of Practice</span>
                <span className="font-serif text-2xl text-[#3E2723]">{master.years}+ Years</span>
              </div>
              <div>
                <span className="block text-gray-400 text-[10px] uppercase tracking-widest mb-1 font-bold">Recognition</span>
                <span className="font-serif text-lg text-[#3E2723]">{master.award}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <Link href="#studio" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 shadow-md">
                <FaPlay className="text-[10px]" /> Watch Interview
              </Link>
              <Link href="#gallery" className="bg-white border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723] hover:text-white px-6 py-4 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                <FaCamera className="text-[12px]" /> View Gallery
              </Link>
              <button className="bg-transparent text-[#3949AB] hover:text-[#3E2723] px-4 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                <FaDownload /> Download Citation
              </button>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative min-h-[500px] lg:min-h-0 bg-[#3E2723]">
             <Image src={master.img} alt={master.name} fill className="object-cover opacity-90 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000" priority />
             
          </div>
          
        </div>
      </section>

      {/* Main Content */}
      <div className="container-fluid mx-auto px-4 md:px-10 mt-16 grid grid-cols-1 xl:grid-cols-12 gap-16">
        
        {/* Left Column (Sticky Sidebar) */}
        <div className="xl:col-span-3 space-y-10 order-2 xl:order-1">
          <div className="sticky top-32 space-y-8">
            {/* Overview Widget */}
            <div className="bg-white p-8 border border-[#3E2723]/10 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#3E2723] mb-6 flex items-center gap-3">
                <span className="w-6 h-px bg-[#D4AF37]"></span> Overview
              </h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed mb-6 italic">
                "{master.bio}"
              </p>
              <ul className="space-y-5 text-sm text-gray-700">
                <li className="border-b border-gray-100 pb-2"><strong className="block text-gray-400 text-[10px] uppercase tracking-wider mb-1">Craft Specialization</strong> <span className="font-bold">{master.craft}</span></li>
                <li className="border-b border-gray-100 pb-2"><strong className="block text-gray-400 text-[10px] uppercase tracking-wider mb-1">Location / Workshop</strong> <span className="font-bold">{master.loc}, Srinagar</span></li>
                <li className="border-b border-gray-100 pb-2"><strong className="block text-gray-400 text-[10px] uppercase tracking-wider mb-1">Main Materials</strong> <span className="font-bold">Raw Pashm, Kani Spools</span></li>
                <li><strong className="block text-gray-400 text-[10px] uppercase tracking-wider mb-1">Primary Techniques</strong> <span className="font-bold">{master.sig}</span></li>
              </ul>
            </div>

            {/* Citation Widget */}
            <div className="bg-[#3E2723] text-white p-8 shadow-sm relative overflow-hidden">
              
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-4">Academic Citation</h3>
              <p className="font-mono text-[11px] text-white/80 leading-relaxed mb-6">
                KHCRF. "{master.name}." Master Artisans of Kashmir Archive. Hamadan Craft Revival Foundation, 2026.
              </p>
              <button className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
                <FaDownload /> Export Citation
              </button>
            </div>
          </div>
        </div>

        {/* Center/Right Column (Main Content) */}
        <div className="xl:col-span-9 space-y-24 order-1 xl:order-2">
          
          {/* Life Journey */}
          <section id="journey">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-8 flex items-center gap-4">
              <span className="w-12 h-[2px] bg-[#D4AF37]"></span> Life Journey
            </h2>
            <div className="prose prose-stone max-w-3xl text-gray-700 font-light leading-loose text-lg">
              <p className="first-letter:text-7xl first-letter:font-serif first-letter:text-[#3E2723] first-letter:mr-3 first-letter:float-left">
                Born in the historic neighborhood of {master.loc}, Kashmir, {master.name} represents a deep, continuous lineage of master artisans. From an early age, training began under the strict tutelage of family elders, where the rhythmic sounds of the workshop formed the soundtrack of childhood.
              </p>
              <p>
                For decades, {master.name} has refined the art of {master.craft}, focusing specifically on the {master.stage} stage of production. {master.desc} The workshop remains a sanctuary of traditional methods, where ancestral knowledge is preserved meticulously against the tides of modernization.
              </p>
              <blockquote className="border-l-4 border-[#D4AF37] pl-6 py-2 my-10 italic text-xl text-[#3E2723] font-serif bg-white shadow-sm pr-6">
                "The craft is not just in the hands; it is in the breath, the memory, and the patience. When we weave, we are speaking a language our ancestors taught us."
              </blockquote>
              <p>
                Today, {master.name} continues to work daily, surrounded by apprentices who are learning the nuanced language of the craft. The dedication shown over {master.years} years of practice has resulted in works that are celebrated not just locally, but in museums and collections globally.
              </p>
            </div>
          </section>

          {/* Craft Lineage */}
          <section id="lineage">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-10 flex items-center gap-4">
              <span className="w-12 h-[2px] bg-[#D4AF37]"></span> Craft Lineage
            </h2>
            <div className="bg-white p-10 md:p-14 border border-[#3E2723]/10 shadow-sm max-w-4xl relative">
               <div className="absolute right-10 top-10 opacity-5">
                 <svg className="w-48 h-48" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13l6.5-13z"/></svg>
               </div>
               
               <div className="relative border-l-2 border-[#D4AF37] ml-4 space-y-12">
                  <div className="relative pl-10">
                    <span className="absolute w-5 h-5 bg-[#3E2723] rounded-full left-[-11px] top-1 ring-4 ring-white"></span>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Master / Teacher</div>
                    <div className="font-serif font-bold text-[#3E2723] text-2xl">Ustad Abdul Khaliq</div>
                    <div className="text-sm text-[#3949AB] font-bold">Family Tradition (1890-1970)</div>
                  </div>
                  <div className="relative pl-10">
                    <span className="absolute w-5 h-5 bg-[#D4AF37] rounded-full left-[-11px] top-1 ring-4 ring-white shadow-lg"></span>
                    <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-1">Current Master Artisan</div>
                    <div className="font-serif font-bold text-[#3E2723] text-3xl">{master.name}</div>
                    <div className="text-sm text-[#3E2723] font-medium mt-1">Practicing since childhood in the original family workshop.</div>
                  </div>
                  <div className="relative pl-10">
                    <span className="absolute w-5 h-5 bg-gray-300 rounded-full left-[-11px] top-1 ring-4 ring-white"></span>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Students & Apprentices</div>
                    <div className="font-serif font-bold text-gray-700 text-xl">12 Active Apprentices</div>
                    <div className="text-sm text-gray-500 mt-1">Passing down the exact historic techniques without compromise.</div>
                  </div>
               </div>
            </div>
          </section>

          {/* Signature Techniques */}
          <section id="techniques">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-8 flex items-center gap-4">
              <span className="w-12 h-[2px] bg-[#D4AF37]"></span> Signature Techniques
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white border border-[#3E2723]/10 p-8 hover:border-[#D4AF37] hover:shadow-xl transition-all group">
                  <div className="text-[10px] uppercase tracking-widest text-[#3949AB] font-bold mb-3">Mastery Level</div>
                  <h3 className="font-serif text-2xl text-[#3E2723] mb-4 group-hover:text-[#D4AF37] transition-colors">{master.sig}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6 font-light">
                    A highly complex method of creating intricate patterns that requires immense focus and mathematical precision inherited through generations.
                  </p>
                  <Link href="/master-artisans/techniques/example" className="text-[10px] uppercase tracking-widest font-bold text-[#3E2723] flex items-center gap-2 group-hover:text-[#D4AF37]">
                    Read Documentation <FaArrowRight />
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Studio (Video) */}
          <section id="studio">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-8 flex items-center gap-4">
              <span className="w-12 h-[2px] bg-[#D4AF37]"></span> In The Studio
            </h2>
            <div className="max-w-4xl bg-black p-2 rounded-sm shadow-2xl">
              <div className="aspect-video bg-[#111] relative flex items-center justify-center group cursor-pointer overflow-hidden">
                <Image src={master.img} alt="Video Thumbnail" fill className="object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute w-20 h-20 rounded-full bg-[#D4AF37]/90 backdrop-blur flex items-center justify-center z-10 pl-2 text-[#3E2723] transform group-hover:scale-110 transition-transform shadow-2xl">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div>
                    <h3 className="font-serif text-2xl text-white mb-2">Oral History: {master.name}</h3>
                    <div className="flex gap-3 text-xs font-mono font-bold text-gray-300 uppercase tracking-widest">
                      <span>Kashmiri</span>
                      <span>•</span>
                      <span>45:20 MIN</span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-white bg-white/20 backdrop-blur px-3 py-1.5 rounded-sm">Transcript Available</span>
                </div>
              </div>
            </div>
          </section>

          {/* Workshop & Gallery (Masonry) */}
          <section id="gallery">
            <div className="flex justify-between items-end mb-8 max-w-4xl">
              <h2 className="text-3xl font-serif text-[#3E2723] flex items-center gap-4">
                <span className="w-12 h-[2px] bg-[#D4AF37]"></span> Workshop Gallery
              </h2>
            </div>
            <div className="columns-1 md:columns-2 gap-4 space-y-4 max-w-4xl">
               <div className="relative w-full aspect-square bg-gray-200 overflow-hidden group cursor-pointer">
                 <Image src={master.img} alt="Workshop detail" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 hover:scale-105" />
               </div>
               <div className="relative w-full aspect-[3/4] bg-gray-200 overflow-hidden group cursor-pointer">
                 <Image src="/assets/images/copper-smiths-video.jpg" alt="Tools" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 hover:scale-105" />
               </div>
               <div className="relative w-full aspect-[4/3] bg-gray-200 overflow-hidden group cursor-pointer">
                 <Image src="/assets/images/talim-code.jpg" alt="Process" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 hover:scale-105" />
               </div>
               <div className="relative w-full aspect-[4/5] bg-gray-200 overflow-hidden group cursor-pointer">
                 <Image src="/assets/images/antique-qalamdan.jpg" alt="Detail" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 hover:scale-105" />
               </div>
            </div>
          </section>

          {/* Signature Works (Collections) */}
          <section id="works">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-8 flex items-center gap-4">
              <span className="w-12 h-[2px] bg-[#D4AF37]"></span> Signature Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              {[1, 2].map((i) => (
                <Link href={`/master-artisans/collections/masterpiece-${i}`} key={i} className="group flex flex-col bg-white border border-[#3E2723]/10 shadow-sm hover:shadow-xl transition-all duration-500">
                  <div className="relative aspect-square bg-[#F5F5F5] p-6 flex items-center justify-center overflow-hidden border-b border-[#3E2723]/10">
                    <Image src="/assets/images/safavid-carpet.jpg" alt="Masterpiece" fill className="object-cover mix-blend-multiply opacity-90 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#3E2723] text-[#D4AF37] px-2 py-1 text-[8px] uppercase tracking-widest font-bold shadow-md">
                        Archive Record
                      </span>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-serif text-xl text-[#3E2723] mb-2 group-hover:text-[#D4AF37] transition-colors">Historical Masterpiece {i}</h3>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{master.craft} • Circa 2010</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Publications */}
          <section id="publications">
            <div className="bg-[#FAF9F6] border border-[#3E2723]/10 p-10 max-w-4xl flex flex-col md:flex-row gap-8 items-center justify-between shadow-sm">
               <div>
                 <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37] mb-2">KHCRF Publications</h4>
                 <h3 className="font-serif text-2xl text-[#3E2723] mb-4">Read Related Research</h3>
                 <p className="text-sm text-gray-600 max-w-lg font-light leading-relaxed">
                   Explore scholarly articles, policy briefs, and cultural documentation referencing {master.name} and the broader ecosystem of {master.craft}.
                 </p>
               </div>
               <Link href={`/publications?q=${master.name}`} className="bg-white border-2 border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723] hover:text-white px-8 py-4 text-[10px] font-bold uppercase tracking-widest transition-colors flex-shrink-0 whitespace-nowrap">
                 View Publications
               </Link>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
