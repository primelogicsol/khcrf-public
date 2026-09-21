import os
import re

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

# 1. Update Navbar.tsx
navbar_path = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\components\Navbar.tsx"
with open(navbar_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the knowledge links
old_links = [
    r'\{ name: "Tools & Materials", href: "/master-artisans/knowledge\?topic=tools" \}',
    r'\{ name: "Motifs & Symbols", href: "/master-artisans/knowledge\?topic=motifs" \}',
    r'\{ name: "Natural Dyes", href: "/master-artisans/knowledge\?topic=dyes" \}'
]

new_links = [
    '{ name: "Tools & Materials", href: "/master-artisans/tools-materials" }',
    '{ name: "Motifs & Symbols", href: "/master-artisans/motifs-symbols" }',
    '{ name: "Natural Dyes", href: "/master-artisans/natural-dyes" }'
]

for old, new in zip(old_links, new_links):
    content = re.sub(old, new, content)

with open(navbar_path, "w", encoding="utf-8") as f:
    f.write(content)


# 2. Generate the 3 separate pages
def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# Tools & Materials
tools_content = """import React from 'react';
import Image from 'next/image';

export default function ToolsMaterials() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Tools & Materials</h1>
          <p className="text-gray-600 text-lg">An interactive archive of the specialized instruments and raw materials that form the foundation of Kashmiri craftsmanship.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filter */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white p-6 border border-gray-200 sticky top-32">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#3E2723] mb-4 border-b border-gray-100 pb-2">Filter by Craft</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2 cursor-pointer hover:text-[#D4AF37]"><input type="checkbox" className="accent-[#D4AF37]" defaultChecked /> Pashmina & Kani</li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-[#D4AF37]"><input type="checkbox" className="accent-[#D4AF37]" /> Walnut Wood Carving</li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-[#D4AF37]"><input type="checkbox" className="accent-[#D4AF37]" /> Papier-Mâché</li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-[#D4AF37]"><input type="checkbox" className="accent-[#D4AF37]" /> Copperware (Traam)</li>
              </ul>
            </div>
          </div>

          {/* Grid */}
          <div className="w-full lg:w-3/4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(item => (
              <div key={item} className="bg-white border border-gray-200 group">
                <div className="relative aspect-square bg-gray-50 border-b border-gray-200 overflow-hidden p-6">
                  <Image src="/assets/images/master-artisans-hero.jpg" alt="Tool" fill className="object-cover mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-1">Spinning Equipment</div>
                  <h3 className="text-xl font-serif text-[#3E2723] mb-2">Yander (Traditional Wheel)</h3>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">The traditional spinning wheel made entirely of wood without any iron nails, essential for spinning the delicate Changthangi pashm fiber into yarn.</p>
                  <button className="text-xs font-bold text-[#3949AB] uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors">View Details &rarr;</button>
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
write_page("tools-materials", tools_content)

# Motifs & Symbols
motifs_content = """import React from 'react';
import Image from 'next/image';

export default function MotifsSymbols() {
  return (
    <main className="bg-[#3E2723] min-h-screen text-[#FAF9F6] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-white/10 pb-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Motifs & Symbols</h1>
          <p className="text-white/70 text-lg font-light">A visual dictionary of the enduring patterns inspired by Kashmir's natural landscape and Persian heritage, decoded across different craft mediums.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Badam (Paisley)', desc: 'The iconic almond motif symbolizing life and fertility.', img: '/assets/images/heritage-object.jpg' },
            { name: 'Chinar Leaf', desc: 'The majestic plane tree leaf, representing Kashmir itself.', img: '/assets/images/heritage-object.jpg' },
            { name: 'Pamposh (Lotus)', desc: 'Symbol of purity emerging from the Dal Lake.', img: '/assets/images/heritage-object.jpg' },
            { name: 'Gul-e-Bulbul', desc: 'The rose and the nightingale, a classic Persian romance motif.', img: '/assets/images/heritage-object.jpg' },
            { name: 'Dachh (Vine)', desc: 'Grapevine motifs often used in borders and architectural carvings.', img: '/assets/images/heritage-object.jpg' },
            { name: 'Mihrab', desc: 'Arch motif inspired by mosque architecture, central to prayer rugs.', img: '/assets/images/heritage-object.jpg' },
            { name: 'Hazar Gul', desc: 'A thousand flowers, a dense millefleurs pattern.', img: '/assets/images/heritage-object.jpg' },
            { name: 'Khatam-band', desc: 'Geometric star patterns used primarily in wood ceilings.', img: '/assets/images/heritage-object.jpg' },
          ].map((motif, i) => (
            <div key={i} className="bg-white/5 border border-white/10 hover:border-[#D4AF37] transition-all duration-300 p-6 flex flex-col justify-between group cursor-pointer">
              <div>
                <div className="relative w-full aspect-square mb-6 bg-white/10 rounded-full overflow-hidden p-2">
                  <Image src={motif.img} alt={motif.name} fill className="object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-serif text-[#D4AF37] mb-2 text-center">{motif.name}</h3>
                <p className="text-sm text-white/60 text-center leading-relaxed">{motif.desc}</p>
              </div>
              <div className="mt-6 text-center">
                <span className="text-[9px] uppercase tracking-widest border border-white/20 px-2 py-1 text-white/50 group-hover:text-white transition-colors">Cross-Craft Analysis</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("motifs-symbols", motifs_content)


# Natural Dyes
dyes_content = """import React from 'react';

export default function NaturalDyes() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-6xl">
        <header className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Natural Dyes & Pigments</h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">Cataloging the botanical sources, mineral extracts, and traditional recipes used to color Pashmina, silk, and Papier-Mâché.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="bg-white border-t-8 border-[#8B0000] p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-serif text-[#3E2723]">Majith (Madder Root)</h2>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Rubia cordifolia</div>
              </div>
              <div className="w-16 h-16 rounded-full bg-[#8B0000] shadow-inner"></div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">Yields the deep, iconic reds found in traditional Kani shawls and antique carpets. The root must be dried, pulverized, and boiled with an alum mordant to achieve colorfastness.</p>
            <div className="flex gap-2">
              <span className="bg-gray-100 px-3 py-1 text-[10px] uppercase font-bold text-gray-500">Textiles</span>
              <span className="bg-gray-100 px-3 py-1 text-[10px] uppercase font-bold text-gray-500">Boiling Required</span>
            </div>
          </div>

          <div className="bg-white border-t-8 border-[#E5AA70] p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-serif text-[#3E2723]">Kenze (Walnut Hull)</h2>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Juglans regia</div>
              </div>
              <div className="w-16 h-16 rounded-full bg-[#E5AA70] shadow-inner"></div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">The green outer husks of Kashmiri walnuts produce an incredibly steadfast range of warm browns, tans, and deep khakis. Requires no mordant due to high natural tannin content.</p>
            <div className="flex gap-2">
              <span className="bg-gray-100 px-3 py-1 text-[10px] uppercase font-bold text-gray-500">Textiles</span>
              <span className="bg-gray-100 px-3 py-1 text-[10px] uppercase font-bold text-gray-500">Direct Dye</span>
            </div>
          </div>

          <div className="bg-white border-t-8 border-[#191970] p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-serif text-[#3E2723]">Kyo (Indigo)</h2>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Indigofera tinctoria</div>
              </div>
              <div className="w-16 h-16 rounded-full bg-[#191970] shadow-inner"></div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">Provides the brilliant blues in Kani weaves and Papier-Mâché base coats. Requires a complex fermentation vat process (often using dates or jaggery in traditional recipes) to become water-soluble.</p>
            <div className="flex gap-2">
              <span className="bg-gray-100 px-3 py-1 text-[10px] uppercase font-bold text-gray-500">Textiles & Wood</span>
              <span className="bg-gray-100 px-3 py-1 text-[10px] uppercase font-bold text-gray-500">Vat Dye</span>
            </div>
          </div>

          <div className="bg-white border-t-8 border-[#FFC000] p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-serif text-[#3E2723]">Kong (Saffron)</h2>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Crocus sativus</div>
              </div>
              <div className="w-16 h-16 rounded-full bg-[#FFC000] shadow-inner"></div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">The most expensive dye, yielding a brilliant golden-yellow. Historically reserved for royal garments and the finest illuminated manuscripts. Often blended with pomegranate rind.</p>
            <div className="flex gap-2">
              <span className="bg-gray-100 px-3 py-1 text-[10px] uppercase font-bold text-gray-500">Royal Textiles</span>
              <span className="bg-gray-100 px-3 py-1 text-[10px] uppercase font-bold text-gray-500">Extract</span>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
"""
write_page("natural-dyes", dyes_content)

print("Navbar updated and the 3 separate Knowledge pages created successfully.")
