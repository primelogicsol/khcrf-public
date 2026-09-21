import os
import re

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

# 1. Update Navbar.tsx
navbar_path = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\components\Navbar.tsx"
with open(navbar_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the studio links
old_links = [
    r'\{ name: "Documentary Films", href: "/master-artisans/studio\?type=documentary" \}',
    r'\{ name: "Oral Histories", href: "/master-artisans/studio\?type=oral-history" \}',
    r'\{ name: "Video Interviews", href: "/master-artisans/studio\?type=interview" \}',
    r'\{ name: "Audio Stories", href: "/master-artisans/studio\?type=audio" \}',
    r'\{ name: "Workshop Diaries", href: "/master-artisans/studio\?type=diary" \}',
    r'\{ name: "Craft Demonstrations", href: "/master-artisans/studio\?type=demo" \}'
]

new_links = [
    '{ name: "Documentary Films", href: "/master-artisans/studio/documentary-films" }',
    '{ name: "Oral Histories", href: "/master-artisans/studio/oral-histories" }',
    '{ name: "Video Interviews", href: "/master-artisans/studio/video-interviews" }',
    '{ name: "Audio Stories", href: "/master-artisans/studio/audio-stories" }',
    '{ name: "Workshop Diaries", href: "/master-artisans/studio/workshop-diaries" }',
    '{ name: "Craft Demonstrations", href: "/master-artisans/studio/craft-demonstrations" }'
]

for old, new in zip(old_links, new_links):
    content = re.sub(old, new, content)

with open(navbar_path, "w", encoding="utf-8") as f:
    f.write(content)


# 2. Generate the 6 separate pages
def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# Documentary Films
documentary_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function DocumentaryFilms() {
  return (
    <main className="bg-[#111111] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-[1px] bg-[#D4AF37]"></span>
              <span className="text-[#D4AF37] uppercase tracking-widest text-xs font-bold">KHCRF Studio</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif mb-4">Documentary Films</h1>
            <p className="text-white/60 text-lg max-w-2xl font-light">Feature-length and short-form cinematic explorations of Kashmir's most revered craft traditions and the communities that sustain them.</p>
          </div>
        </header>

        {/* Featured Documentary */}
        <div className="relative aspect-video max-h-[70vh] mb-12 group cursor-pointer overflow-hidden">
          <Image src="/assets/images/master-artisans-hero.jpg" alt="Featured" fill className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute bottom-10 left-10 max-w-3xl">
            <span className="bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">Latest Release</span>
            <h2 className="text-4xl md:text-6xl font-serif mb-4 text-white">The Copper Smiths of Zaina Kadal</h2>
            <p className="text-white/80 mb-6 line-clamp-2">A comprehensive look into the roaring fires and rhythmic hammering of Srinagar's oldest copperware district.</p>
            <Link href="/master-artisans/studio/copper-smiths" className="bg-white text-black px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#D4AF37] transition-colors inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg> Watch Film
            </Link>
          </div>
        </div>

        {/* Grid */}
        <h3 className="text-xl font-serif mb-6 text-white/80">From the Archives</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(item => (
            <Link href={`/master-artisans/studio/doc-${item}`} key={item} className="group block">
              <div className="relative aspect-video mb-4 overflow-hidden bg-black">
                <Image src="/assets/images/artisan-portrait.jpg" alt="Doc" fill className="object-cover opacity-50 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-colors">
                    <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                  </div>
                </div>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">45 Min • 2024</div>
              <h4 className="font-serif text-lg text-white group-hover:text-[#D4AF37] transition-colors">The Last Pashmina Weavers</h4>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("studio/documentary-films", documentary_content)


# Oral Histories
oral_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function OralHistories() {
  return (
    <main className="bg-[#1A1A1A] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-5xl">
        <header className="mb-16 text-center border-b border-white/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Oral Histories</h1>
          <p className="text-white/60 text-lg font-light">Preserving the unwritten memories, personal anecdotes, and historical perspectives of elder artisans before they are lost.</p>
        </header>

        <div className="space-y-8">
          {[1, 2, 3, 4].map(item => (
            <div key={item} className="bg-black/50 border border-white/5 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center hover:border-white/20 transition-colors group cursor-pointer">
              <div className="w-full md:w-48 aspect-square relative flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                <Image src="/assets/images/artisan-portrait.jpg" alt="Artisan" fill className="object-cover rounded-full p-2 border border-dashed border-white/20" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-2">Recorded: April 2025 • Location: Safa Kadal</div>
                <h3 className="text-2xl font-serif text-white mb-3">"We used to sing the Talim..."</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6 italic">
                  Master weaver Ghulam Nabi recounts the rhythmic singing of pattern codes (Talim) that once echoed through the Karkhans (workshops) of Srinagar during his childhood in the 1960s, a tradition now entirely replaced by silent concentration.
                </p>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-white hover:text-[#D4AF37] transition-colors border border-white/20 px-4 py-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg> Play Audio (12:45)
                  </button>
                  <button className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Transcript
                  </button>
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
write_page("studio/oral-histories", oral_content)


# Video Interviews
interviews_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function VideoInterviews() {
  return (
    <main className="bg-[#111111] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-white/10 pb-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Video Interviews</h1>
          <p className="text-white/60 text-lg font-light">Direct conversations with master artisans discussing their life journey, creative process, and thoughts on the future of their craft.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
            <Link href={`/master-artisans/studio/interview-${item}`} key={item} className="group block">
              <div className="relative aspect-[4/5] bg-black mb-4 overflow-hidden border border-white/10 group-hover:border-[#D4AF37] transition-colors">
                <Image src="/assets/images/artisan-portrait.jpg" alt="Interview" fill className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#3E2723] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                  </div>
                  <h4 className="font-serif text-lg leading-tight text-white">Ali Mohammad Najjar</h4>
                  <div className="text-[9px] uppercase tracking-widest text-gray-400 mt-1">Walnut Carving</div>
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


# Audio Stories
audio_content = """import React from 'react';

export default function AudioStories() {
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
            {[1, 2, 3, 4, 5].map(item => (
              <div key={item} className="flex items-center gap-6 p-4 hover:bg-white/5 rounded-xl transition-colors group cursor-pointer">
                <button className="w-12 h-12 flex-shrink-0 bg-white/10 group-hover:bg-[#D4AF37] rounded-full flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-white group-hover:text-[#3E2723] ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                </button>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-white group-hover:text-[#D4AF37] transition-colors">Ep. {item}: The Sound of the Loom</h3>
                  <p className="text-xs text-white/50 mt-1 line-clamp-1">An auditory journey through a traditional Kani weaving workshop in Kanihama.</p>
                </div>
                <div className="text-xs font-mono text-gray-500">24:15</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
"""
write_page("studio/audio-stories", audio_content)


# Workshop Diaries
diaries_content = """import React from 'react';
import Image from 'next/image';

export default function WorkshopDiaries() {
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
          {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
            <div key={item} className="group cursor-pointer">
              <div className="relative aspect-square bg-black overflow-hidden border border-white/10 mb-3">
                <Image src="/assets/images/master-artisans-hero.jpg" alt="Diary" fill className="object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-500 mix-blend-luminosity group-hover:mix-blend-normal" />
                <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 text-[9px] uppercase tracking-widest font-mono text-white/80 backdrop-blur-sm">
                  RAW FILE
                </div>
              </div>
              <h4 className="font-serif text-sm text-white group-hover:text-[#D4AF37] transition-colors truncate">Morning Prep: Dye Boiling</h4>
              <div className="text-[10px] text-gray-500 mt-1">Srinagar • 08:30 AM</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("studio/workshop-diaries", diaries_content)


# Craft Demonstrations
demos_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CraftDemonstrations() {
  return (
    <main className="bg-[#1A1A1A] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-white/10 pb-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Craft Demonstrations</h1>
          <p className="text-white/60 text-lg font-light">Highly focused, educational video series breaking down specific techniques, stitches, and processes step-by-step.</p>
        </header>

        <div className="space-y-16 max-w-5xl mx-auto">
          {[
            { title: "The Sozni Double Stitch", desc: "A macro-lens demonstration of the intricate double-sided stitch that defines premium Sozni embroidery on Pashmina." },
            { title: "Preparing the Papier-Mâché Base (Sakhta)", desc: "Step-by-step process of pounding waste paper, mixing with rice glue, and molding it over wooden frames." },
            { title: "Reading the Kani Talim", desc: "Understanding how to decipher the written shorthand code that dictates every knot in a Kani shawl." }
          ].map((demo, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-8 bg-black/40 border border-white/10 p-6 rounded-lg hover:border-white/30 transition-colors">
              <div className="w-full md:w-1/3 relative aspect-video bg-black flex-shrink-0 group cursor-pointer rounded overflow-hidden">
                 <Image src="/assets/images/heritage-object.jpg" alt="Demo" fill className="object-cover opacity-60 group-hover:scale-105 transition-transform" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-[#D4AF37] group-hover:text-[#3E2723] transition-colors">
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
                    </div>
                 </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-2">Masterclass Series</div>
                <h3 className="text-2xl font-serif text-white mb-3">{demo.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6">{demo.desc}</p>
                <Link href={`/master-artisans/studio/demo-${i}`} className="text-xs font-bold uppercase tracking-widest text-white border-b border-white pb-1 inline-block hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors w-max">
                  Watch Demonstration
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
write_page("studio/craft-demonstrations", demos_content)

print("Navbar updated and the 6 separate Studio pages created successfully.")
