import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# 1. Magazine Issues
issues_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function MagazineIssues() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Magazine Issues</h1>
          <p className="text-gray-600 text-lg">Explore our quarterly publications dedicated to the master artisans of Kashmir, featuring in-depth interviews, photo essays, and research.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Link href={`/master-artisans/issues/${item}`} key={item} className="group flex flex-col">
              <div className="relative aspect-[3/4] mb-6 shadow-xl overflow-hidden">
                <Image src="/assets/images/artisan-portrait.jpg" alt="Magazine Cover" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 border-[8px] border-white/20"></div>
                <div className="absolute top-6 w-full text-center">
                  <h3 className="text-white font-serif text-3xl drop-shadow-md">KHCRF</h3>
                  <div className="text-white/80 text-[10px] uppercase tracking-widest font-bold">Quarterly Review</div>
                </div>
                <div className="absolute bottom-6 w-full text-center px-4">
                  <h4 className="text-[#D4AF37] font-serif text-2xl drop-shadow-md leading-tight mb-2">The Woodcarvers of Srinagar</h4>
                  <div className="text-white/90 text-xs font-bold tracking-widest uppercase">Issue 0{item} • Autumn 2026</div>
                </div>
              </div>
              <h3 className="text-xl font-serif text-[#3E2723] group-hover:text-[#D4AF37] transition-colors mb-2">Issue 0{item}: The Woodcarvers</h3>
              <p className="text-sm text-gray-600 flex-1">A deep dive into the undercut relief carving techniques and the masters who keep this 19th-century tradition alive.</p>
              <div className="mt-4 text-xs font-bold text-[#3949AB] uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors">Read Issue &rarr;</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("issues", issues_content)


# 2. Editorial Series
editorial_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function EditorialSeries() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Editorial Series</h1>
          <p className="text-gray-600 text-lg max-w-3xl">Curated collections of long-form essays, research articles, and narratives exploring specific themes within Kashmir's craft heritage.</p>
        </header>

        <div className="space-y-16">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-col lg:flex-row gap-8 bg-white border border-[#3E2723]/10 p-6 md:p-10 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-full lg:w-1/2 relative aspect-video">
                <Image src="/assets/images/master-artisans-hero.jpg" alt="Series Cover" fill className="object-cover" />
                <div className="absolute top-4 left-4 bg-[#3E2723] text-[#D4AF37] px-3 py-1 text-xs font-bold uppercase tracking-widest">Series</div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <h2 className="text-3xl font-serif text-[#3E2723] mb-4 hover:text-[#D4AF37] transition-colors cursor-pointer">The Dying Echoes of the Yander</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">A four-part series exploring the socio-economic and cultural decline of the traditional Pashmina spinning wheel (yander) and the women who operate them in the face of mechanized yarn production.</p>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">4 Articles • Published Oct 2026</div>
                <div className="flex flex-col gap-3">
                  <Link href="/master-artisans/stories/article-1" className="text-[#3949AB] hover:text-[#D4AF37] text-sm font-medium flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span> Part I: The Mechanics of the Thread</Link>
                  <Link href="/master-artisans/stories/article-2" className="text-[#3949AB] hover:text-[#D4AF37] text-sm font-medium flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span> Part II: Women of the Lattice Windows</Link>
                  <Link href="/master-artisans/stories/article-3" className="text-[#3949AB] hover:text-[#D4AF37] text-sm font-medium flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span> Part III: The Price of Mechanization</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("editorial", editorial_content)


# 3. Collection Essays
essays_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CollectionEssays() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 text-center max-w-3xl mx-auto border-b border-[#3E2723]/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Collection Essays</h1>
          <p className="text-gray-600 text-lg">Scholarly writings, provenance research, and contextual narratives accompanying our museum-quality craft archives.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[1, 2, 3, 4].map((item) => (
            <article key={item} className="group">
              <div className="relative aspect-[16/9] mb-6 overflow-hidden">
                <Image src="/assets/images/heritage-object.jpg" alt="Essay Image" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#3E2723]">Provenance Study</div>
              </div>
              <h2 className="text-2xl font-serif text-[#3E2723] mb-3 group-hover:text-[#D4AF37] transition-colors">Decoding the Safavid Revival Motif</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">An analysis of how 16th-century Persian floral motifs were adapted by Kashmiri carpet weavers using the traditional talim (coded pattern) system, focusing on Archive Record KHCRF-C-2026-004.</p>
              <div className="flex gap-4 items-center text-xs font-bold uppercase tracking-widest text-gray-400">
                <span>By Dr. Sarah Qadri</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>12 Min Read</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("collections/essays", essays_content)


# 4. Craft Lineages
lineages_content = """import React from 'react';
import Image from 'next/image';

export default function Lineages() {
  return (
    <main className="bg-[#3E2723] min-h-screen text-[#FAF9F6] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-20 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif text-[#D4AF37] mb-6">Craft Lineages</h1>
          <p className="text-white/70 text-lg font-light">Mapping the intergenerational transfer of knowledge through master-apprentice relationships and family traditions.</p>
        </header>

        <div className="max-w-5xl mx-auto">
          {/* Timeline UI */}
          <div className="relative border-l-2 border-[#D4AF37]/30 ml-4 md:ml-1/2 space-y-24">
            
            {[1, 2, 3].map((item, idx) => (
              <div key={item} className="relative pl-12 md:pl-0">
                {/* Node marker */}
                <div className="absolute left-[-9px] md:left-1/2 md:-translate-x-1/2 top-0 w-4 h-4 bg-[#D4AF37] rounded-full ring-4 ring-[#3E2723]"></div>
                
                <div className={`md:w-1/2 ${idx % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:ml-auto'}`}>
                  <div className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">3rd Generation • 1920-1980</div>
                  <h3 className="text-3xl font-serif mb-4">Ustad Ghulam Mohiuddin</h3>
                  <div className={`relative aspect-video mb-6 ${idx % 2 === 0 ? 'md:ml-auto' : ''} max-w-sm`}>
                    <Image src="/assets/images/artisan-portrait.jpg" alt="Lineage" fill className="object-cover rounded-sm grayscale opacity-80" />
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">Known for introducing the 'papier-mâché' style embroidery in Sozni craft, Ustad Mohiuddin trained over 40 artisans in his lifetime, establishing the foundation of the modern Zadibal workshop collective.</p>
                  <div className="inline-flex gap-2 text-[10px] font-bold uppercase tracking-widest text-[#3949AB] bg-white/10 px-3 py-1">
                    Notable Students: Ali Mohammad, Bashir Ahmad
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
"""
write_page("lineages", lineages_content)


# 5. Traditional Techniques
techniques_content = """import React from 'react';
import Image from 'next/image';

export default function Techniques() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Traditional Techniques</h1>
          <p className="text-gray-600 text-lg">A visual and descriptive encyclopedia of the specific, highly specialized skills that define Kashmiri craftsmanship.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            'Undercut Relief (Vatta Chikan)', 
            'Talim Reading (Kani Weaving)', 
            'Papier-Mâché Sakhta Making',
            'Sozni Double Stitch',
            'Copper Engraving (Naqash)',
            'Natural Indigo Dyeing'
          ].map((tech) => (
            <div key={tech} className="bg-white border border-gray-200 p-6 hover:border-[#D4AF37] hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <div className="relative aspect-square mb-6 bg-gray-50 overflow-hidden">
                <Image src="/assets/images/master-artisans-hero.jpg" alt={tech} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              <h3 className="text-xl font-serif text-[#3E2723] mb-2">{tech}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">A highly specialized method passed down through generations, requiring immense precision and understanding of the raw material.</p>
              <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest border border-[#D4AF37] inline-block px-2 py-1">View Documentation</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("techniques", techniques_content)


# 6. Knowledge Hub Main (Tools, Motifs, Dyes)
knowledge_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function KnowledgeHub() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Knowledge Hub</h1>
            <p className="text-gray-600 text-lg max-w-2xl">The comprehensive digital encyclopedia covering tools, materials, motifs, natural dyes, and the fundamental elements of Kashmiri crafts.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/master-artisans/knowledge/glossary" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors">
              Craft Glossary
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Tools & Materials */}
          <div className="col-span-1 md:col-span-3 mb-8">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-6 flex items-center gap-4"><span className="w-8 h-1 bg-[#D4AF37]"></span> Tools & Materials</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(item => (
                <div key={item} className="bg-white p-4 border border-gray-200">
                  <div className="relative aspect-square mb-4 bg-gray-50"><Image src="/assets/images/master-artisans-hero.jpg" alt="Tool" fill className="object-cover" /></div>
                  <h4 className="font-bold text-sm text-[#3E2723]">Yander (Spinning Wheel)</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Pashmina Processing</p>
                </div>
              ))}
            </div>
          </div>

          {/* Motifs & Symbols */}
          <div className="col-span-1 md:col-span-3 mb-8">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-6 flex items-center gap-4"><span className="w-8 h-1 bg-[#D4AF37]"></span> Motifs & Symbols</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(item => (
                <div key={item} className="bg-white p-4 border border-gray-200">
                  <div className="relative aspect-square mb-4 bg-gray-50"><Image src="/assets/images/heritage-object.jpg" alt="Motif" fill className="object-cover" /></div>
                  <h4 className="font-bold text-sm text-[#3E2723]">Badam (Paisley)</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Found in Kani, Sozni, Carpet</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Natural Dyes */}
          <div className="col-span-1 md:col-span-3">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-6 flex items-center gap-4"><span className="w-8 h-1 bg-[#D4AF37]"></span> Natural Dyes</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(item => (
                <div key={item} className="bg-[#3E2723] text-white p-6">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37] mb-4"></div>
                  <h4 className="font-bold text-lg mb-1">Walnut Hull (Kenze)</h4>
                  <p className="text-xs text-white/70">Yields deep browns to warm grays depending on the mordant.</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
"""
write_page("knowledge", knowledge_content)


# 7. Glossary
glossary_content = """import React from 'react';

export default function Glossary() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-4xl">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Craft Glossary</h1>
          <p className="text-gray-600 text-lg">A definitive lexicon of Kashmiri craft terminology, translating local artisan vocabulary into standardized definitions.</p>
        </header>

        <div className="flex gap-2 flex-wrap mb-12 justify-center">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map(letter => (
            <button key={letter} className="w-8 h-8 flex items-center justify-center font-serif font-bold text-[#3E2723] hover:bg-[#D4AF37] hover:text-white border border-[#3E2723]/20 transition-colors">
              {letter}
            </button>
          ))}
        </div>

        <div className="space-y-12">
          {['B', 'K', 'P', 'T'].map(letter => (
            <div key={letter}>
              <h2 className="text-4xl font-serif text-[#D4AF37] mb-6 border-b border-[#D4AF37]/30 pb-2 inline-block w-full">{letter}</h2>
              <dl className="space-y-6">
                <div className="bg-white p-6 border-l-4 border-[#3E2723] shadow-sm">
                  <dt className="text-xl font-bold text-[#3E2723] mb-2">{letter === 'B' ? 'Badam' : letter === 'K' ? 'Karkhan' : letter === 'P' ? 'Pashm' : 'Talim'}</dt>
                  <dd className="text-gray-600 leading-relaxed">
                    A traditional term used in Kashmiri workshops to describe {letter === 'B' ? 'the almond or paisley motif, symbolizing fertility and life' : letter === 'K' ? 'the physical workshop space where artisans gather to work and sing' : letter === 'P' ? 'the raw, unspun cashmere fiber harvested from the Changthangi goat' : 'the coded, written pattern read aloud by the master weaver (Ustad) to guide the knotting process'}.
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("knowledge/glossary", glossary_content)


# 8. Participate Main (Submit Story / Become Contributor)
participate_content = """import React from 'react';
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
"""
write_page("participate", participate_content)

print("All missing pages created with premium UI.")
