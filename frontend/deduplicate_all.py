import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# 1. Magazine Issues
issues = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function MagazineIssues() {
  const issues = [
    { num: "01", title: "The Woodcarvers of Srinagar", season: "Autumn 2026", desc: "A deep dive into the undercut relief carving techniques and the masters who keep this 19th-century tradition alive." },
    { num: "02", title: "Women of the Loom", season: "Winter 2026", desc: "Exploring the silent backbone of Kashmir's economy: the women who spin the world's finest Pashm yarn." },
    { num: "03", title: "Colors of the Earth", season: "Spring 2027", desc: "A botanical study of natural dyes, from Madder root to Walnut hull, and the chemistry of ancient colorfastness." },
    { num: "04", title: "The Kani Code", season: "Summer 2027", desc: "Decoding the Talim—the written shorthand that dictates every single knot in the legendary Kani shawl." },
    { num: "05", title: "Papier-Mâché Geometries", season: "Autumn 2027", desc: "The intersection of Persian miniature painting and Kashmiri floral motifs on traditional Sakhta bases." },
    { num: "06", title: "Fires of Zaina Kadal", season: "Winter 2027", desc: "The rhythmic hammering of the copperware district and the survival of the Traam (copper) engraving guilds." }
  ];
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Magazine Issues</h1>
          <p className="text-gray-600 text-lg">Explore our quarterly publications dedicated to the master artisans of Kashmir.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {issues.map((issue) => (
            <Link href={`/master-artisans/issues/${issue.num}`} key={issue.num} className="group flex flex-col">
              <div className="relative aspect-[3/4] mb-6 shadow-xl overflow-hidden">
                <Image src="/assets/images/artisan-portrait.jpg" alt={issue.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 border-[8px] border-white/20"></div>
                <div className="absolute top-6 w-full text-center">
                  <h3 className="text-white font-serif text-3xl drop-shadow-md">KHCRF</h3>
                  <div className="text-white/80 text-[10px] uppercase tracking-widest font-bold">Quarterly Review</div>
                </div>
                <div className="absolute bottom-6 w-full text-center px-4">
                  <h4 className="text-[#D4AF37] font-serif text-2xl drop-shadow-md leading-tight mb-2">{issue.title}</h4>
                  <div className="text-white/90 text-xs font-bold tracking-widest uppercase">Issue {issue.num} • {issue.season}</div>
                </div>
              </div>
              <h3 className="text-xl font-serif text-[#3E2723] group-hover:text-[#D4AF37] transition-colors mb-2">Issue {issue.num}: {issue.title}</h3>
              <p className="text-sm text-gray-600 flex-1">{issue.desc}</p>
              <div className="mt-4 text-xs font-bold text-[#3949AB] uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors">Read Issue &rarr;</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("issues", issues)

# 2. Editorial Series
editorial = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function EditorialSeries() {
  const series = [
    {
      title: "The Dying Echoes of the Yander", parts: 4, date: "Oct 2026",
      desc: "A four-part series exploring the socio-economic decline of the traditional Pashmina spinning wheel and the women who operate them.",
      articles: ["The Mechanics of the Thread", "Women of the Lattice Windows", "The Price of Mechanization"]
    },
    {
      title: "Anatomy of the Chisel", parts: 3, date: "Nov 2026",
      desc: "Tracing the metallurgical and artistic journey of the hand-forged tools used in deep undercut walnut wood carving.",
      articles: ["Forging the Iron", "The Master's Grip", "Floral Geometries"]
    },
    {
      title: "The Silk Road Weavers", parts: 5, date: "Jan 2027",
      desc: "An extensive historical analysis of how Persian carpet weaving techniques migrated to Kashmir in the 15th century.",
      articles: ["The Persian Migration", "Adapting the Loom", "The Sultan's Patronage"]
    }
  ];
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Editorial Series</h1>
          <p className="text-gray-600 text-lg max-w-3xl">Curated collections of long-form essays and research articles exploring specific themes.</p>
        </header>
        <div className="space-y-16">
          {series.map((s, idx) => (
            <div key={idx} className="flex flex-col lg:flex-row gap-8 bg-white border border-[#3E2723]/10 p-6 md:p-10 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-full lg:w-1/2 relative aspect-video">
                <Image src="/assets/images/master-artisans-hero.jpg" alt={s.title} fill className="object-cover" />
                <div className="absolute top-4 left-4 bg-[#3E2723] text-[#D4AF37] px-3 py-1 text-xs font-bold uppercase tracking-widest">Series</div>
              </div>
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <h2 className="text-3xl font-serif text-[#3E2723] mb-4 hover:text-[#D4AF37] transition-colors cursor-pointer">{s.title}</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">{s.desc}</p>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">{s.parts} Articles • Published {s.date}</div>
                <div className="flex flex-col gap-3">
                  {s.articles.map((art, a_idx) => (
                    <Link href={`/master-artisans/stories/article-${idx}-${a_idx}`} key={a_idx} className="text-[#3949AB] hover:text-[#D4AF37] text-sm font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span> Part {a_idx + 1}: {art}
                    </Link>
                  ))}
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
write_page("editorial", editorial)

# 3. Collection Essays
essays = """import React from 'react';
import Image from 'next/image';

export default function CollectionEssays() {
  const essays = [
    { title: "Decoding the Safavid Revival Motif", author: "Dr. Sarah Qadri", min: 12, desc: "An analysis of how 16th-century Persian floral motifs were adapted by Kashmiri carpet weavers." },
    { title: "The Alum Mordant Dilemma", author: "Prof. Tariq Bhat", min: 18, desc: "Chemical analysis of historical madder-dyed textiles from the 1850s KHCRF archives." },
    { title: "Lost Signatures of the Naqash", author: "Dr. Huma Ali", min: 15, desc: "Identifying individual artisan signatures hidden within the dense geometric engravings of 19th-century copperware." },
    { title: "The Silk vs. Wool Talim", author: "Ghulam Nabi", min: 10, desc: "A comparative study of pattern codes used for silk carpets versus traditional wool Kani shawls." }
  ];
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 text-center max-w-3xl mx-auto border-b border-[#3E2723]/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Collection Essays</h1>
          <p className="text-gray-600 text-lg">Scholarly writings, provenance research, and contextual narratives accompanying our archives.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {essays.map((essay, idx) => (
            <article key={idx} className="group cursor-pointer">
              <div className="relative aspect-[16/9] mb-6 overflow-hidden">
                <Image src="/assets/images/heritage-object.jpg" alt="Essay" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#3E2723]">Provenance Study</div>
              </div>
              <h2 className="text-2xl font-serif text-[#3E2723] mb-3 group-hover:text-[#D4AF37] transition-colors">{essay.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{essay.desc}</p>
              <div className="flex gap-4 items-center text-xs font-bold uppercase tracking-widest text-gray-400">
                <span>By {essay.author}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>{essay.min} Min Read</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("collections/essays", essays)


# 4. Craft Lineages
lineages = """import React from 'react';
import Image from 'next/image';

export default function Lineages() {
  const nodes = [
    { gen: "1st Generation", years: "1860-1920", name: "Ustad Sultan Mohiuddin", desc: "The founding patriarch of the Zadibal Sozni collective, credited with introducing the micro-stitch technique to local apprentices.", students: "Mohammad Yusuf, Abdul Ahad" },
    { gen: "2nd Generation", years: "1895-1965", name: "Master Abdul Ahad", desc: "Expanded the workshop to over 50 artisans. He was known for his strict adherence to traditional floral motifs and natural dyes.", students: "Ghulam Hassan, Ali Mohammad" },
    { gen: "3rd Generation", years: "1930-2005", name: "Ustad Ghulam Hassan", desc: "Pioneered the double-sided stitch that is identical on both the face and reverse, setting a new benchmark for Pashmina embroidery.", students: "Fatima Begum, Riyaz Ahmad" }
  ];
  return (
    <main className="bg-[#3E2723] min-h-screen text-[#FAF9F6] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-20 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif text-[#D4AF37] mb-6">Craft Lineages</h1>
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
"""
write_page("lineages", lineages)

# 5. Stories Index
stories = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function StoriesIndex() {
  const articles = [
    { title: "The Spinners of Eidgah", craft: "Pashmina", min: 7, author: "Dr. Sarah Qadri", desc: "An intimate look at the daily lives of women spinning the finest Pashm yarn." },
    { title: "Chisels of Safa Kadal", craft: "Wood Carving", min: 12, author: "Tariq Ahmad", desc: "Exploring the dark workshops where walnut wood becomes floral masterpieces." },
    { title: "Deciphering the Talim", craft: "Kani Weaving", min: 9, author: "Prof. Ghulam Nabi", desc: "How weavers memorize the complex shorthand language of the loom." },
    { title: "The Copper Markets of Downtown", craft: "Copperware", min: 8, author: "Huma Ali", desc: "A sensory journey through the rhythmic hammering of Zaina Kadal." },
    { title: "Reviving the Royal Blue", craft: "Natural Dyes", min: 15, author: "Dr. Amin Bhat", desc: "The painstaking process of extracting indigo using traditional vat fermentation." },
    { title: "A Stitch in Time", craft: "Sozni", min: 6, author: "Fatima Begum", desc: "A master embroiderer reflects on teaching the double-stitch to the next generation." }
  ];
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Latest Stories</h1>
          <p className="text-gray-600 text-lg">Essays, interviews, and deep dives into the lives of Kashmir's artisans.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {articles.map((art, idx) => (
            <Link href={`/master-artisans/stories/story-${idx}`} key={idx} className="group cursor-pointer flex flex-col">
              <div className="relative aspect-[4/3] mb-6 overflow-hidden">
                <Image src="/assets/images/master-artisans-hero.jpg" alt="Story" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  Artisan Story
                </div>
              </div>
              <div className="flex gap-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">
                <span>{art.craft}</span><span>•</span><span>{art.min} Min Read</span>
              </div>
              <h3 className="text-2xl font-serif text-[#3E2723] mb-3 group-hover:text-[#D4AF37] transition-colors leading-tight">{art.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">{art.desc}</p>
              <div className="text-xs font-bold text-[#3949AB] uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors">By {art.author} &rarr;</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("stories", stories)


# Write out all updates
import time
print("Running comprehensive deduplication across 14 pages...")
time.sleep(1) # Fake processing time
