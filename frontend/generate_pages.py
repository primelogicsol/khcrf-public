import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

# Studio Page
studio_content = """import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlay } from 'react-icons/fa';

export default function Studio() {
  return (
    <main className="bg-[#1A1A1A] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif text-[#D4AF37] mb-6">KHCRF Studio</h1>
          <p className="text-gray-400 text-lg md:text-xl font-light">
            Documentary films, oral histories, workshop diaries, and craft demonstrations preserving the voice, hand, and memory of Kashmir’s master artisans.
          </p>
        </header>

        {['Featured Documentary', 'Latest Interviews', 'Oral Histories'].map((section) => (
          <section key={section} className="mb-16">
            <h2 className="text-2xl font-serif mb-6 flex items-center gap-4">
              {section}
              <div className="flex-1 h-px bg-white/10"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="group cursor-pointer">
                  <div className="relative aspect-video mb-4 overflow-hidden bg-black">
                    <Image src="https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=800&auto=format&fit=crop" alt="Video" fill className="object-cover opacity-80 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#3E2723] flex items-center justify-center pl-1">
                        <FaPlay className="text-sm" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5">15:20</div>
                  </div>
                  <h3 className="font-serif text-lg group-hover:text-[#D4AF37] transition-colors leading-tight mb-2">The Copper Smiths of Zaina Kadal</h3>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    <span>Copperware • Kashmiri</span>
                    <span className="text-blue-400">Transcript [EN]</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
"""

with open(os.path.join(base_dir, r"studio\page.tsx"), "w", encoding="utf-8") as f:
    f.write(studio_content)

# Collections Page
collections_content = """import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Collections() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-6">Heritage Collections</h1>
        <p className="text-gray-600 text-lg">A museum-quality archive of documented Kashmiri craft objects, masterpieces, materials, techniques, and artisan-linked works.</p>
        <div className="mt-8 bg-[#3E2723]/5 border border-[#3E2723]/10 p-4 inline-block text-xs font-bold uppercase tracking-widest text-[#3E2723]">
          These records are for documentation, research, and preservation. They are not commercial product listings.
        </div>
      </div>

      <div className="container-fluid mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <Link href={`/master-artisans/collections/item-${item}`} key={item} className="group border border-gray-200 bg-white hover:border-[#D4AF37] transition-colors flex flex-col">
              <div className="relative aspect-square p-6 bg-gray-50 flex items-center justify-center">
                <Image src="https://images.unsplash.com/photo-1590727264875-520e5db197d1?q=80&w=600&auto=format&fit=crop" alt="Object" fill className="object-contain p-6 mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-3 right-3 bg-white shadow-sm text-[#3E2723] text-[9px] font-bold uppercase tracking-widest px-2 py-1 border border-gray-100">Archive Record</div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg text-[#3E2723] group-hover:text-[#D4AF37] mb-2 leading-snug">Safavid Revival Silk Carpet</h3>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Carpet Weaving • Silk on Silk</div>
                </div>
                <div className="text-xs text-[#3949AB] font-medium border-t border-gray-100 pt-3">
                  View Archive Record &rarr;
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

with open(os.path.join(base_dir, r"collections\page.tsx"), "w", encoding="utf-8") as f:
    f.write(collections_content)

# Collection Detail Page
collection_detail_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CollectionDetail() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        
        <Link href="/master-artisans/collections" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#D4AF37] mb-8 inline-block">
          &larr; Back to Collections
        </Link>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/2 bg-white border border-gray-200 p-8 flex items-center justify-center relative aspect-square">
            <Image src="https://images.unsplash.com/photo-1590727264875-520e5db197d1?q=80&w=1200&auto=format&fit=crop" alt="Object" fill className="object-contain p-8 mix-blend-multiply" />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button className="bg-white/80 p-2 border border-gray-200 text-gray-600 hover:text-[#3E2723]"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg></button>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="bg-[#3E2723] text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest px-3 py-1 inline-block mb-4">
              Archive Record KHCRF-C-2026-004
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-6">Safavid Revival Silk Carpet</h1>
            
            <table className="w-full text-sm text-left mb-8 border-t border-gray-200">
              <tbody>
                {[
                  ['Craft Category', 'Carpet Weaving (Kal Baffi)'],
                  ['Material', 'Silk warp, Silk weft (100% Kashmir Silk)'],
                  ['Technique', 'Talim-guided hand knotting (600 knots/sq inch)'],
                  ['Dimensions', '4ft x 6ft'],
                  ['Condition', 'Pristine / Archive Grade'],
                  ['Associated Artisan', 'Master Gulam Nabi (Srinagar)'],
                  ['Period', 'Contemporary (2024)']
                ].map(([label, val]) => (
                  <tr key={label} className="border-b border-gray-200">
                    <td className="py-3 font-bold text-gray-500 uppercase tracking-wider text-[10px] w-1/3">{label}</td>
                    <td className="py-3 font-medium text-[#3E2723]">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="prose prose-sm text-gray-600 font-light mb-8">
              <h3 className="font-serif text-lg text-[#3E2723] mb-2">Cultural Significance</h3>
              <p>This piece represents a rare revival of 16th-century Safavid motifs, reinterpreted through the traditional Kashmiri talim system. The density of the knots allows for an unprecedented curvilinear flow in the floral elements, a hallmark of Master Gulam Nabi's workshop.</p>
            </div>

            <div className="bg-gray-100 p-4 text-xs font-mono text-gray-500">
              <strong className="block text-[#3E2723] mb-1">Citation</strong>
              KHCRF. "Safavid Revival Silk Carpet." Heritage Collections. Hamadan Craft Revival Foundation, 2026.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
"""

with open(os.path.join(base_dir, r"collections\[slug]\page.tsx"), "w", encoding="utf-8") as f:
    f.write(collection_detail_content)


# Story Page
story_content = """import React from 'react';
import Image from 'next/image';

export default function StoryPage() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[500px]">
        <Image src="https://images.unsplash.com/photo-1610992015732-2808058b475d?q=80&w=2000&auto=format&fit=crop" alt="Story Cover" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 container-fluid mx-auto">
          <div className="bg-[#D4AF37] text-[#3E2723] text-[10px] font-bold uppercase tracking-widest px-3 py-1 inline-block mb-4">
            Artisan Story • Pashmina
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-white max-w-4xl leading-tight mb-4">
            The Spinners of Eidgah: A Fading Symphony
          </h1>
          <div className="flex gap-4 text-sm text-white/70 font-medium">
            <span>By Dr. Sarah Qadri</span>
            <span>•</span>
            <span>Oct 12, 2026</span>
            <span>•</span>
            <span>7 Min Read</span>
          </div>
        </div>
      </div>

      <div className="container-fluid mx-auto px-4 md:px-10 mt-16 flex flex-col lg:flex-row gap-16">
        {/* Sticky Sidebar / Tools */}
        <div className="hidden lg:block w-48 flex-shrink-0 relative">
          <div className="sticky top-32 space-y-8 text-xs font-bold uppercase tracking-widest text-gray-400">
            <div>
              <div className="h-1 w-full bg-gray-200 rounded-full mb-2"><div className="h-full bg-[#D4AF37] w-1/3 rounded-full"></div></div>
              Reading Progress
            </div>
            <div className="flex flex-col gap-4">
              <button className="text-left hover:text-[#3E2723]">Share Story</button>
              <button className="text-left hover:text-[#3E2723]">Save to Library</button>
              <button className="text-left hover:text-[#3E2723]">Print Mode</button>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="prose prose-lg prose-stone max-w-3xl font-serif text-gray-800 leading-loose">
          <p className="lead text-xl text-gray-600 font-light mb-8">
            An intimate look at the daily lives and rhythmic labor of the women who spin the finest Pashm yarn on traditional yander wheels, preserving a craft that is rapidly disappearing.
          </p>
          
          <p><span className="text-5xl font-serif text-[#D4AF37] float-left mr-3 mt-2">I</span>n the narrow alleys of Eidgah, before the morning sun fully illuminates the wooden lattice windows, a subtle, rhythmic whirring begins. It is the sound of the <em>yander</em>, the traditional spinning wheel, operated by hands that have memorized its cadence over decades.</p>
          
          <blockquote className="border-l-4 border-[#D4AF37] pl-6 my-10 italic text-2xl text-[#3E2723]">
            "The yarn must be as fine as a spider's web, yet strong enough to hold the weight of our history."
          </blockquote>
          
          <p>For Khatija Begum, 68, spinning Pashmina is not just an occupation; it is an act of meditation. Her fingers, calloused yet incredibly delicate, coax the unspun cashmere down into a thread so fine it seems to vanish in the low light of her room.</p>

          <figure className="my-12">
            <Image src="https://images.unsplash.com/photo-1544168190-79c15427015f?q=80&w=1200&auto=format&fit=crop" width={1200} height={800} alt="Spinning" className="w-full object-cover rounded-sm grayscale" />
            <figcaption className="text-sm text-center text-gray-500 mt-3 font-sans">Khatija Begum operating the yander. Photo by KHCRF Archive.</figcaption>
          </figure>

          <h2>The Economics of the Thread</h2>
          <p>Despite their foundational role in creating the world's most luxurious shawls, the spinners remain the most economically vulnerable segment of the craft chain. KHCRF's recent survey indicates a 40% decline in traditional spinners over the last decade.</p>
        </article>
      </div>
    </main>
  );
}
"""

with open(os.path.join(base_dir, r"stories\[slug]\page.tsx"), "w", encoding="utf-8") as f:
    f.write(story_content)

# Nominate Page
nominate_content = """import React from 'react';

export default function Nominate() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-3xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Nominate a Master Artisan</h1>
          <p className="text-gray-600 text-lg">Help KHCRF document and preserve the living legacy of Kashmir's most skilled and knowledgeable artisans.</p>
        </header>

        <div className="bg-white p-8 md:p-12 shadow-sm border border-[#3E2723]/10">
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Artisan Name</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#D4AF37]" placeholder="Full Name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Craft Specialization</label>
                <select className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#D4AF37]">
                  <option>Select Craft</option>
                  <option>Pashmina</option>
                  <option>Walnut Wood Carving</option>
                  <option>Papier Mâché</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">District</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. Srinagar" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Years of Practice</label>
                <input type="number" className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. 40" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Why should this artisan be documented?</label>
              <textarea rows={5} className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#D4AF37]" placeholder="Detail their mastery, techniques, or legacy..."></textarea>
            </div>

            <div className="border-t border-gray-200 pt-8 mt-8">
              <h3 className="text-sm font-bold text-[#3E2723] uppercase tracking-widest mb-6">Nominator Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Your Name</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Your Email / Contact</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#D4AF37]" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 accent-[#3E2723]" />
                <span className="text-xs text-gray-500 leading-relaxed">I confirm that the information provided is accurate to the best of my knowledge, and I consent to KHCRF contacting me or the artisan for verification purposes.</span>
              </label>
            </div>

            <button type="button" className="w-full bg-[#3E2723] hover:bg-[#D4AF37] text-white hover:text-[#3E2723] py-4 font-bold uppercase tracking-widest text-sm transition-colors mt-8">
              Submit Nomination
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
"""

with open(os.path.join(base_dir, r"nominate\page.tsx"), "w", encoding="utf-8") as f:
    f.write(nominate_content)

print("Remaining pages generated successfully.")
