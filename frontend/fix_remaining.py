import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# 1. Oral Histories
oral_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function OralHistories() {
  const histories = [
    { title: "We used to sing the Talim", artisan: "Ghulam Nabi", loc: "Safa Kadal", date: "April 2025", dur: "12:45", desc: "Master weaver Ghulam Nabi recounts the rhythmic singing of pattern codes that once echoed through the Karkhans of Srinagar." },
    { title: "The First Time I Held a Chisel", artisan: "Ali Mohammad", loc: "Srinagar", date: "May 2025", dur: "18:20", desc: "A moving reflection on inheriting the family tools and the pressure of continuing a 200-year-old carving lineage." },
    { title: "Boiling the Madder Root", artisan: "Fatima Begum", loc: "Eidgah", date: "June 2025", dur: "09:15", desc: "Fatima discusses the secret family recipe for achieving the perfect deep red dye using alum mordants." },
    { title: "When the Looms Went Silent", artisan: "Tariq Ahmad", loc: "Kanihama", date: "July 2025", dur: "14:30", desc: "Recounting the difficult years of the 1990s when the supply of raw Pashm was cut off and many weavers abandoned their craft." }
  ];
  return (
    <main className="bg-[#1A1A1A] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-5xl">
        <header className="mb-16 text-center border-b border-white/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Oral Histories</h1>
          <p className="text-white/60 text-lg font-light">Preserving the unwritten memories, personal anecdotes, and historical perspectives of elder artisans before they are lost.</p>
        </header>

        <div className="space-y-8">
          {histories.map((h, i) => (
            <Link href={`/master-artisans/stories/oral-history-${i}`} key={i} className="bg-black/50 border border-white/5 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center hover:border-white/20 transition-colors group cursor-pointer block">
              <div className="w-full md:w-48 aspect-square relative flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                <Image src="/assets/images/artisan-portrait.jpg" alt={h.artisan} fill className="object-cover rounded-full p-2 border border-dashed border-white/20 group-hover:border-[#D4AF37]" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-2">Recorded: {h.date} • Location: {h.loc}</div>
                <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-[#D4AF37] transition-colors">"{h.title}"</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6 italic">
                  {h.desc}
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-white group-hover:text-[#D4AF37] transition-colors border border-white/20 px-4 py-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg> Play Audio ({h.dur})
                  </div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Transcript
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("studio/oral-histories", oral_content)


# 2. Video Interviews
interviews_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function VideoInterviews() {
  const interviews = [
    { name: "Ali Mohammad", craft: "Walnut Carving" },
    { name: "Hajira Begum", craft: "Pashmina Spinning" },
    { name: "Ghulam Hassan", craft: "Kani Weaving" },
    { name: "Zareena Bano", craft: "Namda Felting" },
    { name: "Tariq Bhat", craft: "Papier-Mâché" },
    { name: "Umar Farooq", craft: "Copperware" },
    { name: "Asiya Jan", craft: "Willow Wicker" },
    { name: "Rifat Ara", craft: "Crewel Embroidery" }
  ];
  return (
    <main className="bg-[#111111] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-white/10 pb-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Video Interviews</h1>
          <p className="text-white/60 text-lg font-light">Direct conversations with master artisans discussing their life journey, creative process, and thoughts on the future of their craft.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {interviews.map((iv, i) => (
            <Link href={`/master-artisans/stories/interview-${i}`} key={i} className="group block">
              <div className="relative aspect-[4/5] bg-black mb-4 overflow-hidden border border-white/10 group-hover:border-[#D4AF37] transition-colors">
                <Image src="/assets/images/artisan-portrait.jpg" alt={iv.name} fill className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#3E2723] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                    <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                  </div>
                  <h4 className="font-serif text-lg leading-tight text-white">{iv.name}</h4>
                  <div className="text-[9px] uppercase tracking-widest text-[#D4AF37] mt-1">{iv.craft}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("studio/video-interviews", interviews_content)


# 3. Audio Stories
audio_content = """import React from 'react';
import Link from 'next/link';

export default function AudioStories() {
  const podcasts = [
    { title: "The Sound of the Loom", dur: "24:15", desc: "An auditory journey through a traditional Kani weaving workshop in Kanihama." },
    { title: "Hammers of Zaina Kadal", dur: "18:30", desc: "The rhythmic beats of fifty copper engravers working in unison." },
    { title: "The Chinar's Whisper", dur: "21:05", desc: "A narrated essay on how the iconic Chinar leaf motif made its way onto Pashmina." },
    { title: "Dye Vats & Chemistry", dur: "26:40", desc: "Listening to the boiling vats of madder root and walnut hull." },
    { title: "The Silent Stitch", dur: "15:20", desc: "A meditative soundscape of a Sozni embroiderer at work." }
  ];
  return (
    <main className="bg-[#222222] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-4xl">
        <header className="mb-16 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Audio Stories (Podcasts)</h1>
          <p className="text-white/60 text-lg font-light">Immersive soundscapes and narrated essays exploring the sounds, myths, and legends surrounding Kashmir's craft heritage.</p>
        </header>

        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl">
          <div className="space-y-6">
            {podcasts.map((p, i) => (
              <Link href={`/master-artisans/stories/podcast-${i}`} key={i} className="flex items-center gap-6 p-4 hover:bg-white/5 rounded-xl transition-colors group block">
                <div className="w-12 h-12 flex-shrink-0 bg-white/10 group-hover:bg-[#D4AF37] rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-white group-hover:text-[#3E2723] ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-white group-hover:text-[#D4AF37] transition-colors">Ep. {i + 1}: {p.title}</h3>
                  <p className="text-xs text-white/50 mt-1 line-clamp-1">{p.desc}</p>
                </div>
                <div className="text-xs font-mono text-gray-500">{p.dur}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
"""
write_page("studio/audio-stories", audio_content)


# 4. Workshop Diaries
diaries_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function WorkshopDiaries() {
  const diaries = [
    { title: "Morning Prep: Dye Boiling", loc: "Srinagar", time: "08:30 AM" },
    { title: "Setting the Warp Threads", loc: "Kanihama", time: "09:15 AM" },
    { title: "Sharpening the Chisels", loc: "Safa Kadal", time: "10:00 AM" },
    { title: "Mixing the Papier-Mâché", loc: "Zadibal", time: "11:30 AM" },
    { title: "Washing the Wool", loc: "Pampore", time: "01:00 PM" },
    { title: "Reading the Afternoon Talim", loc: "Budgam", time: "03:45 PM" },
    { title: "Polishing the Copper", loc: "Zaina Kadal", time: "05:00 PM" },
    { title: "Closing the Karkhan", loc: "Downtown", time: "07:30 PM" }
  ];
  return (
    <main className="bg-[#111111] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Workshop Diaries</h1>
            <p className="text-white/60 text-lg max-w-2xl font-light">Raw, unedited, behind-the-scenes footage capturing the authentic, daily rhythm of artisan workshops across the valley.</p>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {diaries.map((d, i) => (
            <Link href={`/master-artisans/stories/diary-${i}`} key={i} className="group block">
              <div className="relative aspect-square bg-black overflow-hidden border border-white/10 mb-3">
                <Image src="/assets/images/master-artisans-hero.jpg" alt="Diary" fill className="object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-500 mix-blend-luminosity group-hover:mix-blend-normal" />
                <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 text-[9px] uppercase tracking-widest font-mono text-white/80 backdrop-blur-sm">
                  RAW FILE
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                     <svg className="w-4 h-4 ml-1 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                   </div>
                </div>
              </div>
              <h4 className="font-serif text-sm text-white group-hover:text-[#D4AF37] transition-colors truncate">{d.title}</h4>
              <div className="text-[10px] text-gray-500 mt-1">{d.loc} • {d.time}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("studio/workshop-diaries", diaries_content)

# 5. Signature Masterpieces
masterpieces = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SignatureMasterpieces() {
  const pieces = [
    { title: "The Shah-e-Hamadan Kani Shawl", craft: "Kani Weaving", time: "42 Months", desc: "Woven using 120 separate bobbins (tojilis) per line of weft, this piece replicates a 17th-century Mughal royal pattern with flawless symmetry on both the face and reverse." },
    { title: "The Chinar Relief Room Divider", craft: "Walnut Carving", time: "28 Months", desc: "A monumental 8-foot wooden partition featuring deep undercut carving so intricate that individual overlapping leaves can be seen suspended in mid-air." },
    { title: "The Thousand-Flower Carpet", craft: "Silk Weaving", time: "36 Months", desc: "A pure silk-on-silk carpet featuring exactly one thousand distinct floral motifs, with an unprecedented knot density of 1,200 knots per square inch." }
  ];
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8 text-center max-w-4xl mx-auto">
          <div className="text-[#D4AF37] font-bold uppercase tracking-widest text-xs mb-4">Curated Collection</div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Signature Masterpieces</h1>
          <p className="text-gray-600 text-lg">The pinnacle of Kashmiri craftsmanship. These exceptionally complex, multi-year projects demonstrate the absolute peak of human skill.</p>
        </header>

        <div className="space-y-16">
          {pieces.map((item, idx) => (
            <div key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
              <div className="w-full lg:w-1/2">
                <Link href={`/master-artisans/collections/masterpiece-${idx}`} className="block relative aspect-[4/3] shadow-2xl bg-white p-4 group cursor-pointer">
                  <Image src="/assets/images/heritage-object.jpg" alt={item.title} fill className="object-cover mix-blend-multiply opacity-90 p-4 group-hover:scale-105 transition-transform duration-700" />
                </Link>
              </div>
              <div className="w-full lg:w-1/2 p-6 md:p-12">
                <h3 className="text-3xl font-serif text-[#3E2723] mb-4">{item.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{item.desc}</p>
                <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-6">
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Time to Create</div>
                    <div className="text-lg font-serif text-[#3E2723]">{item.time}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Craft Lineage</div>
                    <div className="text-lg font-serif text-[#3E2723]">{item.craft}</div>
                  </div>
                </div>
                <Link href={`/master-artisans/collections/masterpiece-${idx}`} className="mt-8 inline-block bg-[#3E2723] text-white hover:bg-[#D4AF37] px-8 py-3 text-xs font-bold uppercase tracking-widest transition-colors">
                  View Full Analysis
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
write_page("collections/signature-masterpieces", masterpieces)


# 6. Rare Objects
rare_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function RareObjects() {
  const rare = [
    { title: "Original Waguv (River Reed Mat)", desc: "Woven from specific marsh reeds (Pech) harvested from the Dal Lake. Authentic hand-woven Waguv making is nearly extinct due to synthetic alternatives." },
    { title: "Shahtoosh Shawl (Pre-Ban Archive)", desc: "Historically woven from the down hair of the Tibetan antelope. These antique pieces are preserved solely for academic study of the microscopic spin techniques." },
    { title: "Antique Copper Samovar", desc: "A 150-year-old water boiler demonstrating a tinning and engraving method that modern artisans no longer have the tools to reproduce." },
    { title: "Natural Indigo Kani", desc: "A rare surviving shawl dyed entirely using complex vat fermentation, a process abandoned in the 1920s with the advent of synthetic dyes." }
  ];
  return (
    <main className="bg-[#1A1A1A] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-20 text-center max-w-4xl mx-auto">
          <div className="text-red-500 font-bold uppercase tracking-widest text-xs mb-4 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> At Risk / Extinct
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 tracking-wide">Rare & Extinct Objects</h1>
          <p className="text-white/60 text-lg font-light leading-relaxed">
            Documenting items created using techniques, materials, or motifs that have been entirely lost to time.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {rare.map((r, i) => (
            <div key={i} className="group">
              <Link href={`/master-artisans/collections/rare-${i}`} className="block relative aspect-square bg-black border border-white/10 mb-6 overflow-hidden flex items-center justify-center p-8 cursor-pointer">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <Image src="/assets/images/heritage-object.jpg" alt={r.title} fill className="object-contain p-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-1000" />
              </Link>
              <h3 className="text-2xl font-serif text-white mb-2">{r.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">{r.desc}</p>
              <Link href={`/master-artisans/collections/rare-${i}`} className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest border-b border-[#D4AF37]/30 pb-1 inline-block hover:border-[#D4AF37] transition-colors">
                Read Conservation Status
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("collections/rare-objects", rare_content)


# 7. Contemporary Excellence
contemp_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ContemporaryExcellence() {
  const contemp = [
    { title: "Minimalist Khatam-band", artisan: "Bilal Ahmad", desc: "Applying the ancient geometric wood-joining technique to modern, modular furniture design without sacrificing the mortar-less integrity." },
    { title: "Monochrome Pashmina", artisan: "Aabida", desc: "Stripping away the traditional dense floral motifs to create stark, modern geometric layouts on hand-spun pashmina." },
    { title: "Oxidized Copperware", artisan: "Umar Farooq", desc: "Using controlled oxidation to create stunning black-and-copper contrast on classic Traam utensils." },
    { title: "Abstract Namda Rugs", artisan: "Zareena Bano", desc: "Fusing traditional wool felting with abstract expressionist patterns for modern interiors." },
    { title: "Digitized Talim Art", artisan: "Irfan Ali", desc: "Transforming the written shorthand of Kani weaving into large-scale canvas art." },
    { title: "Papier-Mâché Lighting", artisan: "Tariq Bhat", desc: "Molding the Sakhta base into sleek, contemporary pendant lights adorned with subtle gold Naqashi." }
  ];
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Contemporary Excellence</h1>
          <p className="text-gray-600 text-lg">Highlighting modern innovations, experimental designs, and cross-disciplinary collaborations that push the boundaries of traditional Kashmiri crafts.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contemp.map((c, i) => (
            <Link href={`/master-artisans/collections/contemp-${i}`} key={i} className="block bg-white border border-gray-100 hover:shadow-xl transition-shadow duration-500 group">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src="/assets/images/master-artisans-hero.jpg" alt={c.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white text-[#3E2723] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Innovation</div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-serif text-[#3E2723] mb-3 group-hover:text-[#D4AF37] transition-colors">{c.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{c.desc}</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
                     <Image src="/assets/images/artisan-portrait.jpg" alt="Artisan" fill className="object-cover" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Lead Artisan</div>
                    <div className="text-sm font-medium text-[#3E2723]">{c.artisan}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("collections/contemporary-excellence", contemp_content)

print("Remaining Studio and Collection pages deduplicated and link-enabled successfully.")
