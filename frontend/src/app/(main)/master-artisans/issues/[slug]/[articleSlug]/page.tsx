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


export default async function IssueArticleDetail({ params }: { params: Promise<{ slug: string, articleSlug: string }> }) {
  const resolvedParams = await params;
  // Format slug to readable title
  const title = resolvedParams.articleSlug.replace(/-/g, ' ').replace(/\w/g, c => c.toUpperCase());
  
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-4xl">
        <Link href={`/master-artisans/issues/${resolvedParams.slug}`} className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#D4AF37] mb-8 inline-block">
          &larr; Back to Issue Index
        </Link>
        
        <header className="mb-12 border-b border-[#3E2723]/10 pb-12">
          <div className="text-[#D4AF37] font-bold uppercase tracking-widest text-sm mb-4">Magazine Feature</div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#3E2723] mb-6 leading-tight">{title}</h1>
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
            <span>By Editorial Desk</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            <span>12 Min Read</span>
          </div>
        </header>
        
        <div className="relative aspect-[21/9] mb-12 bg-gray-100">
          <Image src="/assets/images/master-artisans-hero.jpg" alt="Article Header" fill className="object-cover" />
        </div>
        
        <article className="prose prose-lg max-w-none text-gray-600 font-serif leading-relaxed">
          <p className="text-2xl text-[#3E2723] mb-8 leading-relaxed">
            The tradition of Kashmiri craftsmanship is not merely about the production of beautiful objects, but the transmission of a complex, unwritten code of ethics, aesthetics, and social interdependence spanning centuries.
          </p>
          <p className="mb-6">
            In the shadowed workshops of downtown Srinagar, the rhythmic sound of the chisel or the loom is a language unto itself. Master artisans, some of whom have practiced their craft for over fifty years, possess a kinetic memory that cannot be fully captured in textbooks. 
          </p>
          <p className="mb-6">
            Our documentation efforts at KHCRF aim to capture these fleeting moments—the precise angle of a Naqash's engraving tool, the specific recipe for madder root dye, and the oral histories of the guilds that once supplied royal courts across Central Asia.
          </p>
          
          <div className="my-12 p-8 border-l-4 border-[#D4AF37] bg-white italic text-xl text-[#3E2723]">
            "To understand the craft, you must first understand the silence of the artisan."
          </div>
          
          <p>
            As global markets demand faster production, these ancient, deliberate methods are under threat. By mapping the lineages and recording the masterclasses, we ensure that the standard of excellence set by previous generations remains the benchmark for the future.
          </p>
        </article>
      </div>
    </main>
  );
}
