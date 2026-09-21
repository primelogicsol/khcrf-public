import os
import re

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

# 1. Update Navbar.tsx
navbar_path = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\components\Navbar.tsx"
with open(navbar_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the collections links
old_links = [
    r'\{ name: "Signature Masterpieces", href: "/master-artisans/collections\?type=masterpiece" \}',
    r'\{ name: "Museum Archive", href: "/master-artisans/collections\?type=archive" \}',
    r'\{ name: "Rare Objects", href: "/master-artisans/collections\?type=rare" \}',
    r'\{ name: "Contemporary Excellence", href: "/master-artisans/collections\?type=contemporary" \}'
]

new_links = [
    '{ name: "Signature Masterpieces", href: "/master-artisans/collections/signature-masterpieces" }',
    '{ name: "Museum Archive", href: "/master-artisans/collections/museum-archive" }',
    '{ name: "Rare Objects", href: "/master-artisans/collections/rare-objects" }',
    '{ name: "Contemporary Excellence", href: "/master-artisans/collections/contemporary-excellence" }'
]

for old, new in zip(old_links, new_links):
    content = re.sub(old, new, content)

with open(navbar_path, "w", encoding="utf-8") as f:
    f.write(content)


# 2. Generate the 4 separate pages
def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# Signature Masterpieces
masterpieces_content = """import React from 'react';
import Image from 'next/image';

export default function SignatureMasterpieces() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8 text-center max-w-4xl mx-auto">
          <div className="text-[#D4AF37] font-bold uppercase tracking-widest text-xs mb-4">Curated Collection</div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Signature Masterpieces</h1>
          <p className="text-gray-600 text-lg">The pinnacle of Kashmiri craftsmanship. These exceptionally complex, multi-year projects demonstrate the absolute peak of human skill in weaving, carving, and embroidery.</p>
        </header>

        <div className="space-y-16">
          {[1, 2, 3].map((item, idx) => (
            <div key={item} className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
              <div className="w-full lg:w-1/2">
                <div className="relative aspect-[4/3] shadow-2xl bg-white p-4">
                  <Image src="/assets/images/heritage-object.jpg" alt="Masterpiece" fill className="object-cover mix-blend-multiply opacity-90 p-4" />
                </div>
              </div>
              <div className="w-full lg:w-1/2 p-6 md:p-12">
                <h3 className="text-3xl font-serif text-[#3E2723] mb-4">The Shah-e-Hamadan Kani Shawl</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  A staggering achievement taking four master weavers over 3.5 years to complete. Woven using 120 separate bobbins (tojilis) per line of weft, this piece replicates a 17th-century Mughal royal pattern with flawless symmetry on both the face and reverse.
                </p>
                <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-6">
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Time to Create</div>
                    <div className="text-lg font-serif text-[#3E2723]">42 Months</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Craft Lineage</div>
                    <div className="text-lg font-serif text-[#3E2723]">Kanihama</div>
                  </div>
                </div>
                <button className="mt-8 bg-[#3E2723] text-white hover:bg-[#D4AF37] px-8 py-3 text-xs font-bold uppercase tracking-widest transition-colors">
                  View Full Analysis
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("collections/signature-masterpieces", masterpieces_content)

# Museum Archive
archive_content = """import React from 'react';
import Image from 'next/image';

export default function MuseumArchive() {
  return (
    <main className="bg-[#3E2723] min-h-screen text-[#FAF9F6] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Museum Archive</h1>
            <p className="text-white/70 text-lg max-w-2xl font-light">The foundational digital catalog of KHCRF's physical holdings, documenting provenance, conservation status, and historical significance.</p>
          </div>
          <button className="border border-white/20 text-white hover:bg-white hover:text-[#3E2723] px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap">
            Download Index (.CSV)
          </button>
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
              {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
                <tr key={item} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="p-4 font-mono text-[#D4AF37]">KHCRF-26-00{item}</td>
                  <td className="p-4">
                    <div className="w-16 h-16 relative bg-white/10">
                      <Image src="/assets/images/heritage-object.jpg" alt="Item" fill className="object-cover opacity-80 mix-blend-screen" />
                    </div>
                  </td>
                  <td className="p-4 font-serif text-lg">Ceremonial Samovar</td>
                  <td className="p-4 text-white/70">Tinned Copper / Naqashi</td>
                  <td className="p-4 text-white/70">Late 19th Century</td>
                  <td className="p-4 text-white/70">Zaina Kadal District</td>
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
write_page("collections/museum-archive", archive_content)

# Rare Objects
rare_content = """import React from 'react';
import Image from 'next/image';

export default function RareObjects() {
  return (
    <main className="bg-[#1A1A1A] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-20 text-center max-w-4xl mx-auto">
          <div className="text-red-500 font-bold uppercase tracking-widest text-xs mb-4 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> At Risk / Extinct
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 tracking-wide">Rare & Extinct Objects</h1>
          <p className="text-white/60 text-lg font-light leading-relaxed">
            Documenting items created using techniques, materials, or motifs that have been entirely lost to time, or are currently practiced by fewer than five living artisans globally.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {[1, 2, 3, 4].map(item => (
            <div key={item} className="group">
              <div className="relative aspect-square bg-black border border-white/10 mb-6 overflow-hidden flex items-center justify-center p-8">
                {/* Spotlight effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <Image src="/assets/images/heritage-object.jpg" alt="Rare Object" fill className="object-contain p-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-1000" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-2">Original Waguv (River Reed Mat)</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                The traditional Waguv was woven from specific marsh reeds (Pech) harvested from the Dal Lake. Due to ecological changes and the influx of synthetic carpets, authentic hand-woven Waguv making is nearly extinct.
              </p>
              <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest border-b border-[#D4AF37]/30 pb-1 inline-block">Read Conservation Status</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("collections/rare-objects", rare_content)

# Contemporary Excellence
contemporary_content = """import React from 'react';
import Image from 'next/image';

export default function ContemporaryExcellence() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Contemporary Excellence</h1>
          <p className="text-gray-600 text-lg">Highlighting modern innovations, experimental designs, and cross-disciplinary collaborations that push the boundaries of traditional Kashmiri crafts into the 21st century.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(item => (
            <div key={item} className="bg-white border border-gray-100 hover:shadow-xl transition-shadow duration-500 group">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src="/assets/images/master-artisans-hero.jpg" alt="Contemporary Art" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white text-[#3E2723] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Innovation</div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-serif text-[#3E2723] mb-3">Minimalist Khatam-band</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Applying the ancient geometric wood-joining technique to modern, modular furniture design without sacrificing the mortar-less integrity of the craft.
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
                     <Image src="/assets/images/artisan-portrait.jpg" alt="Artisan" fill className="object-cover" />
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Lead Artisan</div>
                    <div className="text-sm font-medium text-[#3E2723]">Bilal Ahmad</div>
                  </div>
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
write_page("collections/contemporary-excellence", contemporary_content)

print("Navbar updated and the 4 separate Collections pages created successfully.")
