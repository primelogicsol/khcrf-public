import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function KnowledgeHub() {
  const topics = [
    { title: "Yander (Spinning Wheel)", category: "Tools & Materials", desc: "The wooden wheel used for spinning Pashm." },
    { title: "Badam (Paisley)", category: "Motifs & Symbols", desc: "The almond motif symbolizing fertility." },
    { title: "Majith (Madder Root)", category: "Natural Dyes", desc: "Yields deep reds for traditional Kani weaves." },
    { title: "Undercut Relief", category: "Traditional Techniques", desc: "Deep 3D floral carving on walnut wood." },
    { title: "Sakhta Base Prep", category: "Traditional Techniques", desc: "Pounding waste paper for Papier-Mâché." },
    { title: "Chinar Leaf", category: "Motifs & Symbols", desc: "The iconic plane tree leaf of Kashmir." }
  ];
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Knowledge Hub</h1>
          <p className="text-gray-600 text-lg">An interactive encyclopedia of the tools, dyes, motifs, and techniques of Kashmir.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((t, i) => (
            <Link href={`/master-artisans/knowledge/topic-${i}`} key={i} className="group block bg-white border border-gray-200 p-6">
              <div className="text-[10px] text-[#3949AB] font-bold uppercase tracking-widest mb-2 border-b border-gray-100 pb-2">{t.category}</div>
              <h3 className="text-2xl font-serif text-[#3E2723] mb-2 group-hover:text-[#D4AF37] transition-colors">{t.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{t.desc}</p>
              <div className="text-xs font-bold text-[#3E2723] uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors">Read Article &rarr;</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
