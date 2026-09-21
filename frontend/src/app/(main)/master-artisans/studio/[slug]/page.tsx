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


export default function StudioDetail() {
  return (
    <main className="bg-[#1A1A1A] min-h-screen text-white font-sans">
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
