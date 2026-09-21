import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const title = resolvedParams.slug.replace(/-/g, ' ').replace(/ \w/g, c => c.toUpperCase());
  return {
    title: `${title} - KHCRF Knowledge Graph`,
    robots: { index: false, follow: false },
    description: `Explore the historical origin, material properties, and techniques for ${title} in Kashmiri craftsmanship.`,
    openGraph: {
      title: `${title} - KHCRF Knowledge Graph`,
      description: `Explore the historical origin, material properties, and techniques for ${title} in Kashmiri craftsmanship.`,
      url: `https://khcrf.org/master-artisans/knowledge/${resolvedParams.slug}`,
      siteName: 'KHCRF',
      type: 'article',
    },
    alternates: {
      canonical: `https://khcrf.org/master-artisans/knowledge/${resolvedParams.slug}`,
    }
  };
}

export default async function KnowledgeDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const title = resolvedParams.slug.replace(/-/g, ' ').replace(/\w/g, c => c.toUpperCase());
  
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-5xl">
        <Link href="/master-artisans/knowledge" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#D4AF37] mb-8 inline-block">
          &larr; Back to Knowledge Hub
        </Link>
        
        <div className="flex flex-col md:flex-row gap-12 bg-white p-8 md:p-12 shadow-xl border border-[#3E2723]/10">
          <div className="w-full md:w-1/2 relative aspect-square bg-gray-50 p-6">
            <Image src="/assets/images/heritage-object.jpg" alt="Topic" fill className="object-contain mix-blend-multiply opacity-90 p-8" />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-2 border-b border-gray-100 pb-2 inline-block">Encyclopedia Entry</div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-6">{title}</h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              A foundational element of Kashmiri craftsmanship. This entry details the historical origin, material properties, and specific application of this technique or motif within the broader ecosystem of the valley's heritage arts.
            </p>
            
            <div className="bg-[#FAF9F6] p-6 border-l-4 border-[#3E2723]">
              <h4 className="font-bold text-[#3E2723] text-sm uppercase tracking-widest mb-2">Technical Specifications</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><strong className="text-[#3E2723]">Primary Craft:</strong> Cross-disciplinary</li>
                <li><strong className="text-[#3E2723]">Origin Period:</strong> 14th - 16th Century</li>
                <li><strong className="text-[#3E2723]">Conservation Status:</strong> Practiced widely</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
