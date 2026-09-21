import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# 1. Main Artisans Hub (artisans/page.tsx)
artisans = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ArtisansIndex() {
  const masters = [
    { name: "Ali Mohammad Najjar", craft: "Walnut Carving", loc: "Srinagar", award: "Shilp Guru", img: "/assets/images/artisan-portrait.jpg" },
    { name: "Hajira Begum", craft: "Pashmina Spinning", loc: "Eidgah", award: "Master Artisan", img: "/assets/images/master-artisans-hero.jpg" },
    { name: "Ghulam Hassan", craft: "Kani Weaving", loc: "Kanihama", award: "Padma Shri", img: "/assets/images/heritage-object.jpg" },
    { name: "Zareena Bano", craft: "Namda Felting", loc: "Anantnag", award: "National Award", img: "/assets/images/artisan-portrait.jpg" },
    { name: "Tariq Bhat", craft: "Papier-Mâché", loc: "Zadibal", award: "State Award", img: "/assets/images/heritage-object.jpg" },
    { name: "Fatima Begum", craft: "Sozni Embroidery", loc: "Nowhatta", award: "Master Artisan", img: "/assets/images/master-artisans-hero.jpg" },
    { name: "Umar Farooq", craft: "Copperware", loc: "Zaina Kadal", award: "Emerging Talent", img: "/assets/images/artisan-portrait.jpg" },
    { name: "Asiya Jan", craft: "Willow Wicker", loc: "Ganderbal", award: "Master Artisan", img: "/assets/images/heritage-object.jpg" }
  ];
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Master Artisans</h1>
          <p className="text-gray-600 text-lg">Browse the definitive directory of Kashmir's living craft custodians.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {masters.map((m, i) => (
            <Link href={`/master-artisans/artisans/master-${i}`} key={i} className="group block border border-[#3E2723]/5 hover:shadow-xl transition-all duration-300 bg-white">
              <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                <Image src={m.img} alt={m.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[#3E2723]">
                  {m.award}
                </div>
              </div>
              <div className="p-6">
                <div className="text-[10px] text-[#3949AB] font-bold uppercase tracking-widest mb-2">{m.craft} • {m.loc}</div>
                <h3 className="text-xl font-serif text-[#3E2723] group-hover:text-[#D4AF37] transition-colors">{m.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("artisans", artisans)


# 2. Main Studio Hub (studio/page.tsx)
studio = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function StudioIndex() {
  const vids = [
    { title: "The Copper Smiths of Zaina Kadal", type: "Documentary", dur: "45 Min", tag: "Featured Film" },
    { title: "We used to sing the Talim", type: "Oral History", dur: "12 Min", tag: "Audio Interview" },
    { title: "The Sozni Double Stitch", type: "Demonstration", dur: "18 Min", tag: "Masterclass" },
    { title: "Morning Prep: Dye Boiling", type: "Workshop Diary", dur: "5 Min", tag: "Raw Footage" },
    { title: "Ali Mohammad: Life in Wood", type: "Video Interview", dur: "22 Min", tag: "Conversation" },
    { title: "The Sound of the Loom", type: "Audio Story", dur: "24 Min", tag: "Podcast" }
  ];
  return (
    <main className="bg-[#111111] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">KHCRF Studio</h1>
            <p className="text-white/60 text-lg max-w-2xl font-light">Documentary films, oral histories, and masterclasses capturing the sights and sounds of Kashmiri craft.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vids.map((v, i) => (
            <Link href={`/master-artisans/studio/vid-${i}`} key={i} className="group block">
              <div className="relative aspect-video mb-4 bg-black border border-white/10 overflow-hidden">
                <Image src="/assets/images/master-artisans-hero.jpg" alt={v.title} fill className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:border-[#D4AF37] group-hover:text-[#3E2723] transition-colors">
                    <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                  </div>
                </div>
                <div className="absolute top-3 left-3 bg-white/10 backdrop-blur px-2 py-1 text-[9px] uppercase tracking-widest font-bold text-white border border-white/20">
                  {v.tag}
                </div>
              </div>
              <div className="flex gap-3 text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                <span>{v.type}</span> <span>•</span> <span>{v.dur}</span>
              </div>
              <h4 className="font-serif text-lg text-white group-hover:text-[#D4AF37] transition-colors leading-tight">{v.title}</h4>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("studio", studio)


# 3. Main Collections Hub (collections/page.tsx)
collections = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CollectionsIndex() {
  const items = [
    { title: "The Shah-e-Hamadan Kani Shawl", category: "Signature Masterpiece", craft: "Pashmina", year: "2018" },
    { title: "Original Waguv (River Reed Mat)", category: "Rare Object", craft: "Waguv Weaving", year: "1950s" },
    { title: "Ceremonial Samovar", category: "Museum Archive", craft: "Copperware", year: "Late 19th C." },
    { title: "Minimalist Khatam-band Table", category: "Contemporary Excellence", craft: "Woodwork", year: "2024" },
    { title: "Mughal-era Qalamdan", category: "Museum Archive", craft: "Papier-Mâché", year: "1820s" },
    { title: "Double-sided Silk Carpet", category: "Signature Masterpiece", craft: "Carpet Weaving", year: "2015" }
  ];
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Heritage Collections</h1>
          <p className="text-gray-600 text-lg">A museum-quality digital archive of physical objects, masterworks, and contemporary innovations.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((it, i) => (
            <Link href={`/master-artisans/collections/item-${i}`} key={i} className="group block bg-white border border-[#3E2723]/10 p-4 hover:shadow-xl transition-shadow">
              <div className="relative aspect-square mb-4 bg-gray-50 overflow-hidden">
                <Image src="/assets/images/heritage-object.jpg" alt={it.title} fill className="object-cover p-6 mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-2 left-2 bg-[#3E2723]/5 text-[#3E2723] border border-[#3E2723]/20 px-2 py-1 text-[9px] uppercase tracking-widest font-bold">
                  {it.category}
                </div>
              </div>
              <div className="px-2 pb-2">
                <h3 className="font-serif text-xl text-[#3E2723] group-hover:text-[#D4AF37] transition-colors leading-tight mb-2">{it.title}</h3>
                <div className="text-xs text-gray-500">{it.craft} • {it.year}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("collections", collections)


# 4. Main Knowledge Hub (knowledge/page.tsx)
knowledge = """import React from 'react';
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
"""
write_page("knowledge", knowledge)


print("Successfully deduplicated the 4 Main Hub Indexes (Artisans, Studio, Collections, Knowledge).")
