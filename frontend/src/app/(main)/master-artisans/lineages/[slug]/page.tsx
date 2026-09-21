import React from 'react';
import Image from 'next/image';


import { Metadata } from 'next';
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};


export default async function LineageDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const title = resolvedParams.slug.replace(/-/g, ' ').replace(/\w/g, c => c.toUpperCase());
  
  const nodes = [
    { gen: "1st Generation", years: "1860-1920", name: "Ustad Sultan Mohiuddin", desc: "The founding patriarch of the collective, credited with introducing the micro-stitch technique to local apprentices.", students: "Mohammad Yusuf, Abdul Ahad" },
    { gen: "2nd Generation", years: "1895-1965", name: "Master Abdul Ahad", desc: "Expanded the workshop to over 50 artisans. He was known for his strict adherence to traditional floral motifs and natural dyes.", students: "Ghulam Hassan, Ali Mohammad" },
    { gen: "3rd Generation", years: "1930-2005", name: "Ustad Ghulam Hassan", desc: "Pioneered the double-sided stitch that is identical on both the face and reverse, setting a new benchmark.", students: "Fatima Begum, Riyaz Ahmad" }
  ];

  return (
    <main className="bg-[#3E2723] min-h-screen text-[#FAF9F6] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-20 text-center max-w-4xl mx-auto">
          <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-4">Craft Lineage Timeline</div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#D4AF37] mb-6">{title}</h1>
          <p className="text-white/70 text-lg font-light">Mapping the intergenerational transfer of knowledge through master-apprentice relationships.</p>
        </header>
        <div className="max-w-5xl mx-auto">
          <div className="relative border-l-2 border-[#D4AF37]/30 ml-4 md:ml-1/2 space-y-24">
            {nodes.map((node, idx) => (
              <div key={idx} className="relative pl-12 md:pl-0">
                <div className="absolute left-[-9px] md:left-1/2 md:-translate-x-1/2 top-0 w-4 h-4 bg-[#D4AF37] rounded-full ring-4 ring-[#3E2723]"></div>
                <div className={`md:w-1/2 ${idx % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:ml-auto'}`}>
                  <div className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">{node.gen} • {node.years}</div>
                  <h3 className="text-3xl font-serif mb-4">{node.name}</h3>
                  <div className={`relative aspect-video mb-6 ${idx % 2 === 0 ? 'md:ml-auto' : ''} max-w-sm`}>
                    <Image src="/assets/images/artisan-portrait.jpg" alt="Lineage" fill className="object-cover rounded-sm grayscale opacity-80" />
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">{node.desc}</p>
                  <div className="inline-flex gap-2 text-[10px] font-bold uppercase tracking-widest text-[#3949AB] bg-white/10 px-3 py-1">
                    Notable Students: {node.students}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
