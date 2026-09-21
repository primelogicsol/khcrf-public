import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# 1. Living Legends
legends = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LivingLegends() {
  const legends = [
    {
      id: 1, name: "Ali Mohammad Najjar", craft: "Walnut Wood Carving", loc: "Srinagar", award: "Shilp Guru Awardee (2018)", desc: "Recognized for reviving the deep undercut floral relief technique. Born into a lineage tracing back to the 19th century, Ali Mohammad is one of the last artisans who still hand-forges his own specialized chisels."
    },
    {
      id: 2, name: "Ghulam Hassan", craft: "Kani Shawl Weaving", loc: "Kanihama", award: "Padma Shri (2015)", desc: "A master weaver who memorized over 500 traditional Talim codes. His efforts single-handedly saved the Kani weaving tradition from extinction during the difficult years of the 1990s."
    },
    {
      id: 3, name: "Fatima Begum", craft: "Sozni Embroidery", loc: "Zadibal", award: "National Merit (2020)", desc: "Pioneered the double-sided Sozni stitch that looks flawless on both sides of a Pashmina shawl. At 78, she continues to train dozens of young women in her community."
    }
  ];
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-20 text-center max-w-4xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37] text-white flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#3E2723] mb-6">Living Legends</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            The highest honor bestowed by KHCRF. These individuals have dedicated over 40 years to their craft, achieved national recognition, and possess irreplaceable knowledge.
          </p>
        </header>

        <div className="space-y-16">
          {legends.map((legend, idx) => (
            <div key={legend.id} className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center bg-white border border-[#3E2723]/5 shadow-xl p-6 md:p-12`}>
              <div className="w-full lg:w-5/12">
                <div className="relative aspect-[3/4] p-4 bg-gray-50">
                  <Image src="/assets/images/artisan-portrait.jpg" alt={legend.name} fill className="object-cover opacity-90 sepia-[.3]" />
                </div>
              </div>
              <div className="w-full lg:w-7/12 lg:px-8">
                <div className="flex gap-4 mb-4 text-[10px] text-[#3949AB] font-bold uppercase tracking-widest">
                  <span>{legend.craft}</span>
                  <span>•</span>
                  <span>{legend.loc}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">{legend.name}</h2>
                <div className="bg-[#FAF9F6] border-l-4 border-[#D4AF37] p-4 mb-6">
                  <span className="font-bold text-[#3E2723]">{legend.award}</span>
                </div>
                <p className="text-gray-600 leading-relaxed mb-8 text-lg">{legend.desc}</p>
                <Link href={`/master-artisans/artisans/${legend.name.toLowerCase().replace(/ /g, '-')}`} className="inline-block bg-[#3E2723] text-white hover:bg-[#D4AF37] px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors">
                  Read Master Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("artisans/living-legends", legends)

# 2. Women Artisans
women = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function WomenArtisans() {
  const artisans = [
    { name: "Hajira Begum", craft: "Pashmina Spinning", desc: "Operating the traditional Yander for over 50 years." },
    { name: "Rifat Ara", craft: "Crewel Embroidery", desc: "Specializes in chain stitch (Aari) on wool." },
    { name: "Zareena Bano", craft: "Namda Felting", desc: "Master of creating intricate woolen rug patterns." },
    { name: "Shameema", craft: "Sozni Embroidery", desc: "Creates microscopic needlework on Shahtoosh." },
    { name: "Naseema", craft: "Papier Mache Base", desc: "Expert in molding the Sakhta (paper pulp base)." },
    { name: "Asiya Jan", craft: "Willow Wicker", desc: "One of the few women mastering the Kangri weaving." },
    { name: "Mymoona", craft: "Pashmina Spinning", desc: "Trains younger women in high-count yarn spinning." },
    { name: "Safiya", craft: "Tilla Embroidery", desc: "Gold and silver thread work for bridal pherans." }
  ];
  return (
    <main className="bg-[#3E2723] min-h-screen text-[#FAF9F6] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-white/10 pb-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Women Artisans</h1>
          <p className="text-white/70 text-lg font-light leading-relaxed">
            Highlighting the historically invisible backbone of Kashmir's craft economy.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {artisans.map((a, i) => (
            <Link href={`/master-artisans/artisans/women-${i}`} key={i} className="group block bg-white/5 border border-white/10 p-6 hover:border-[#D4AF37] transition-all">
              <div className="relative aspect-square rounded-full overflow-hidden mb-6 border-4 border-transparent group-hover:border-[#D4AF37] transition-all duration-500">
                <Image src="/assets/images/artisan-portrait.jpg" alt={a.name} fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-serif text-white group-hover:text-[#D4AF37] transition-colors mb-2">{a.name}</h3>
                <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-3">{a.craft}</div>
                <p className="text-sm text-white/70 line-clamp-2">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("artisans/women-artisans", women)

# 3. Emerging Artisans
emerging = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function EmergingArtisans() {
  const artisans = [
    { name: "Tariq Bhat", age: 28, craft: "Papier-Mâché", desc: "Combining ancient Naqashi techniques with contemporary color palettes." },
    { name: "Sajad Dar", age: 24, craft: "Walnut Carving", desc: "Integrating traditional geometric motifs into modern furniture design." },
    { name: "Irfan Ali", age: 31, craft: "Kani Weaving", desc: "Digitizing old Talim patterns to preserve them for future generations." },
    { name: "Aabida", age: 22, craft: "Sozni", desc: "Bringing minimalist floral designs to traditional pashmina shawls." },
    { name: "Umar Farooq", age: 29, craft: "Copperware", desc: "Experimenting with oxidized finishes on classic Traam utensils." },
    { name: "Zahid", age: 26, craft: "Khatam-band", desc: "Using precision tools to create modular ceiling panels faster." }
  ];
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Emerging Artisans</h1>
          <p className="text-gray-600 text-lg max-w-2xl">Showcasing brilliant young practitioners (under 35) carrying their family lineage into the future.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artisans.map((a, i) => (
            <div key={i} className="bg-white border border-gray-200 overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative aspect-[4/3] bg-gray-100">
                <Image src="/assets/images/master-artisans-hero.jpg" alt={a.name} fill className="object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 bg-white/90 backdrop-blur px-4 py-2">
                  <span className="text-[#3E2723] font-bold text-sm">Age: {a.age}</span>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="text-[10px] text-[#3949AB] uppercase tracking-widest font-bold mb-2">{a.craft}</div>
                <h3 className="text-2xl font-serif text-[#3E2723] mb-3">{a.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{a.desc}</p>
                <Link href={`/master-artisans/artisans/emerging-${i}`} className="text-xs font-bold uppercase tracking-widest text-[#3949AB] hover:text-[#D4AF37] border-b border-[#3949AB] pb-1 transition-colors">
                  View Portfolio
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("artisans/emerging-artisans", emerging)

# 4. Museum Archive
archive = """import React from 'react';
import Image from 'next/image';

export default function MuseumArchive() {
  const items = [
    { id: "001", title: "Ceremonial Samovar", mat: "Tinned Copper", date: "Late 19th C.", prov: "Zaina Kadal" },
    { id: "002", title: "Royal Kani Shawl", mat: "Pashmina", date: "1850s", prov: "Kanihama" },
    { id: "003", title: "Carved Door Panel", mat: "Walnut Wood", date: "Early 20th C.", prov: "Downtown Srinagar" },
    { id: "004", title: "Qalamdan (Pen Box)", mat: "Papier-Mâché", date: "1920s", prov: "Zadibal" },
    { id: "005", title: "Silk Carpet", mat: "Silk on Cotton", date: "1970s", prov: "Pattan" },
    { id: "006", title: "Silver Hookah Base", mat: "Engraved Silver", date: "1880s", prov: "Maharaj Gunj" },
    { id: "007", title: "Crewel Tent Hanging", mat: "Wool on Cotton", date: "1910s", prov: "Anantnag" },
    { id: "008", title: "Copper Tasht-Nari", mat: "Copperware", date: "1940s", prov: "Nowhatta" },
  ];
  return (
    <main className="bg-[#3E2723] min-h-screen text-[#FAF9F6] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Museum Archive</h1>
            <p className="text-white/70 text-lg max-w-2xl font-light">The foundational digital catalog of KHCRF's physical holdings.</p>
          </div>
        </header>

        <div className="overflow-x-auto border border-white/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-widest text-white/50">
                <th className="p-4 font-bold">Accession No.</th>
                <th className="p-4 font-bold">Thumbnail</th>
                <th className="p-4 font-bold">Object Title</th>
                <th className="p-4 font-bold">Material / Craft</th>
                <th className="p-4 font-bold">Dating</th>
                <th className="p-4 font-bold">Provenance</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {items.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="p-4 font-mono text-[#D4AF37]">KHCRF-26-{item.id}</td>
                  <td className="p-4">
                    <div className="w-16 h-16 relative bg-white/10">
                      <Image src="/assets/images/heritage-object.jpg" alt="Item" fill className="object-cover opacity-80 mix-blend-screen" />
                    </div>
                  </td>
                  <td className="p-4 font-serif text-lg">{item.title}</td>
                  <td className="p-4 text-white/70">{item.mat}</td>
                  <td className="p-4 text-white/70">{item.date}</td>
                  <td className="p-4 text-white/70">{item.prov}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
"""
write_page("collections/museum-archive", archive)

# 5. Documentary Films
docs = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function DocumentaryFilms() {
  const films = [
    { title: "The Last Pashmina Weavers", dur: "45 Min", year: "2024" },
    { title: "Symphony of the Chisel", dur: "32 Min", year: "2023" },
    { title: "Dyes of the Valley", dur: "28 Min", year: "2025" }
  ];
  return (
    <main className="bg-[#111111] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-white/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Documentary Films</h1>
        </header>

        <div className="relative aspect-video max-h-[70vh] mb-12 group cursor-pointer overflow-hidden">
          <Image src="/assets/images/master-artisans-hero.jpg" alt="Featured" fill className="object-cover opacity-60 transition-opacity duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute bottom-10 left-10 max-w-3xl">
            <span className="bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">Latest Release</span>
            <h2 className="text-4xl md:text-6xl font-serif mb-4 text-white">The Copper Smiths of Zaina Kadal</h2>
            <Link href="/master-artisans/studio/copper-smiths" className="bg-white text-black px-8 py-3 text-sm font-bold uppercase tracking-widest inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg> Watch Film
            </Link>
          </div>
        </div>

        <h3 className="text-xl font-serif mb-6 text-white/80">From the Archives</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {films.map((f, i) => (
            <Link href={`/master-artisans/studio/doc-${i}`} key={i} className="group block">
              <div className="relative aspect-video mb-4 overflow-hidden bg-black">
                <Image src="/assets/images/artisan-portrait.jpg" alt={f.title} fill className="object-cover opacity-50 group-hover:scale-105 transition-all duration-700" />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">{f.dur} • {f.year}</div>
              <h4 className="font-serif text-lg text-white group-hover:text-[#D4AF37] transition-colors">{f.title}</h4>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("studio/documentary-films", docs)

print("Updated 5 pages with diverse dummy content (Living Legends, Women Artisans, Emerging Artisans, Museum Archive, Documentary Films) successfully.")
