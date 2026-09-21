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


export default async function StoryDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const title = resolvedParams.slug.replace(/-/g, ' ').replace(/\w/g, c => c.toUpperCase());
  
  return (
    <main className="bg-white min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-4xl">
        <Link href="/master-artisans/stories" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#D4AF37] mb-8 inline-block">
          &larr; Back to Stories
        </Link>
        
        <header className="mb-12 text-center">
          <div className="text-[#3949AB] font-bold uppercase tracking-widest text-sm mb-4">Editorial Essay</div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#3E2723] mb-6 leading-tight">{title}</h1>
          <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
            <span>By KHCRF Research</span>
            <span>•</span>
            <span>Oct 2026</span>
          </div>
        </header>
        
        <div className="relative aspect-video mb-12 bg-gray-100">
          <Image src="/assets/images/heritage-object.jpg" alt="Story Header" fill className="object-cover" />
        </div>
        
        <article className="prose prose-lg max-w-none text-gray-600 font-serif leading-relaxed">
          <p className="mb-6">
            The rich tapestry of Kashmiri heritage is interwoven with the lives of its master artisans. Every knot, every stroke of the brush, and every strike of the hammer tells a story of survival, adaptation, and unparalleled skill.
          </p>
          <p className="mb-6">
            This detailed exploration dives into the intricate realities of producing world-class craftsmanship in an era of mass production. It highlights the dedication required to master techniques that have remained largely unchanged since the 15th century.
          </p>
          <div className="grid grid-cols-2 gap-4 my-8">
            <div className="relative aspect-square"><Image src="/assets/images/artisan-portrait.jpg" alt="Detail" fill className="object-cover" /></div>
            <div className="relative aspect-square"><Image src="/assets/images/master-artisans-hero.jpg" alt="Detail" fill className="object-cover" /></div>
          </div>
          <p>
            The future of these crafts relies not just on patronage, but on deep, structural documentation and the elevation of the artisan from a nameless laborer to a recognized master of their discipline.
          </p>
        </article>
      </div>
    </main>
  );
}
