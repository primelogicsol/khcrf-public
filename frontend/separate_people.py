import os
import re

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

# 1. Update Navbar.tsx
navbar_path = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\components\Navbar.tsx"
with open(navbar_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the people links
old_links = [
    r'\{ name: "Living Legends", href: "/master-artisans/artisans\?category=legends" \}',
    r'\{ name: "Women Artisans", href: "/master-artisans/artisans\?category=women" \}',
    r'\{ name: "Emerging Artisans", href: "/master-artisans/artisans\?category=emerging" \}',
    r'\{ name: "Apprentices", href: "/master-artisans/artisans\?category=apprentices" \}',
    r'\{ name: "Workshop Communities", href: "/master-artisans/artisans\?category=workshops" \}'
]

new_links = [
    '{ name: "Living Legends", href: "/master-artisans/artisans/living-legends" }',
    '{ name: "Women Artisans", href: "/master-artisans/artisans/women-artisans" }',
    '{ name: "Emerging Artisans", href: "/master-artisans/artisans/emerging-artisans" }',
    '{ name: "Apprentices", href: "/master-artisans/artisans/apprentices" }',
    '{ name: "Workshop Communities", href: "/master-artisans/artisans/workshop-communities" }'
]

for old, new in zip(old_links, new_links):
    content = re.sub(old, new, content)

with open(navbar_path, "w", encoding="utf-8") as f:
    f.write(content)


# 2. Generate the 5 separate pages
def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# Living Legends
legends_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function LivingLegends() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-20 text-center max-w-4xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37] text-white flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#3E2723] mb-6">Living Legends</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            The highest honor bestowed by KHCRF. These individuals have dedicated over 40 years to their craft, achieved national recognition (Shilp Guru or Padma Shri), and possess irreplaceable knowledge of techniques that face extinction.
          </p>
        </header>

        <div className="space-y-16">
          {[1, 2, 3].map((item, idx) => (
            <div key={item} className={`flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center bg-white border border-[#3E2723]/5 shadow-xl p-6 md:p-12`}>
              <div className="w-full lg:w-5/12">
                <div className="relative aspect-[3/4] p-4 bg-gray-50">
                  <Image src="/assets/images/artisan-portrait.jpg" alt="Living Legend" fill className="object-cover opacity-90 sepia-[.3]" />
                </div>
              </div>
              <div className="w-full lg:w-7/12 lg:px-8">
                <div className="flex gap-4 mb-4 text-[10px] text-[#3949AB] font-bold uppercase tracking-widest">
                  <span>Walnut Wood Carving</span>
                  <span>•</span>
                  <span>Srinagar</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Ali Mohammad Najjar</h2>
                <div className="bg-[#FAF9F6] border-l-4 border-[#D4AF37] p-4 mb-6">
                  <span className="font-bold text-[#3E2723]">Shilp Guru Awardee (2018)</span> — Recognized for reviving the deep undercut floral relief technique.
                </div>
                <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                  Born into a lineage tracing back to the 19th century, Ali Mohammad is one of the last artisans who still hand-forges his own specialized chisels. His workshop in Safa Kadal remains a bastion of uncompromising traditionalism.
                </p>
                <Link href="/master-artisans/artisans/ali-mohammad-najjar" className="inline-block bg-[#3E2723] text-white hover:bg-[#D4AF37] px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors">
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
write_page("artisans/living-legends", legends_content)


# Women Artisans
women_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function WomenArtisans() {
  return (
    <main className="bg-[#3E2723] min-h-screen text-[#FAF9F6] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-white/10 pb-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Women Artisans</h1>
          <p className="text-white/70 text-lg font-light leading-relaxed">
            Highlighting the historically invisible backbone of Kashmir's craft economy. From spinning delicate Pashm yarn on the Yander to intricate Sozni embroidery, women are the silent architects of the region's finest textiles.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
            <Link href={`/master-artisans/artisans/women-${item}`} key={item} className="group block bg-white/5 border border-white/10 p-6 hover:border-[#D4AF37] transition-all">
              <div className="relative aspect-square rounded-full overflow-hidden mb-6 border-4 border-transparent group-hover:border-[#D4AF37] transition-all duration-500">
                <Image src="/assets/images/artisan-portrait.jpg" alt="Artisan" fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-serif text-white group-hover:text-[#D4AF37] transition-colors mb-2">Hajira Begum</h3>
                <div className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-3">Pashmina Spinning</div>
                <p className="text-sm text-white/70 line-clamp-2">Has been operating the traditional Yander for over 50 years, spinning 100-count yarn.</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("artisans/women-artisans", women_content)


# Emerging Artisans
emerging_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function EmergingArtisans() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="text-[#3949AB] font-bold uppercase tracking-widest text-xs mb-4">The Next Generation</div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Emerging Artisans</h1>
            <p className="text-gray-600 text-lg max-w-2xl">Showcasing brilliant young practitioners (under 35) who have dedicated themselves to carrying their family lineage into the future, despite modern socio-economic pressures.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(item => (
            <div key={item} className="bg-white border border-gray-200 overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative aspect-[4/3] bg-gray-100">
                <Image src="/assets/images/master-artisans-hero.jpg" alt="Emerging Artisan" fill className="object-cover mix-blend-multiply opacity-80 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 bg-white/90 backdrop-blur px-4 py-2">
                  <span className="text-[#3E2723] font-bold text-sm">Age: 28</span>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="text-[10px] text-[#3949AB] uppercase tracking-widest font-bold mb-2">Papier-Mâché • 4th Gen</div>
                <h3 className="text-2xl font-serif text-[#3E2723] mb-3">Tariq Bhat</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Tariq chose to return to the family Karkhan after finishing his university degree, combining ancient Naqashi techniques with contemporary color palettes.
                </p>
                <Link href={`/master-artisans/artisans/emerging-${item}`} className="text-xs font-bold uppercase tracking-widest text-[#3949AB] hover:text-[#D4AF37] border-b border-[#3949AB] hover:border-[#D4AF37] pb-1 transition-colors">
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
write_page("artisans/emerging-artisans", emerging_content)


# Apprentices
apprentices_content = """import React from 'react';
import Image from 'next/image';

export default function Apprentices() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-5xl">
        <header className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Apprentices & Shagirds</h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            In the Kashmiri tradition, a 'Shagird' studies under an 'Ustad' (Master) for years before producing independent work. Documenting these students is vital to tracing the living transfer of knowledge.
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(item => (
            <div key={item} className="bg-white border border-gray-100 p-6 text-center group hover:border-[#D4AF37] transition-colors">
              <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-50 border-2 border-transparent group-hover:border-[#D4AF37] transition-colors">
                 <Image src="/assets/images/artisan-portrait.jpg" alt="Apprentice" fill className="object-cover opacity-80" />
              </div>
              <h3 className="font-serif text-lg text-[#3E2723] mb-1">Riyaz Ahmad</h3>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">Carpet Weaving</div>
              <div className="text-xs text-[#3949AB] bg-[#3949AB]/5 py-2 px-2">
                <span className="block text-[9px] text-gray-500 uppercase">Apprentice to:</span>
                <span className="font-bold">Ustad Ghulam Hassan</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("artisans/apprentices", apprentices_content)


# Workshop Communities
workshops_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function WorkshopCommunities() {
  return (
    <main className="bg-[#1A1A1A] min-h-screen text-white font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-white/10 pb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Workshop Communities (Karkhans)</h1>
          <p className="text-white/70 text-lg max-w-3xl font-light">
            Kashmiri craft is inherently collaborative. A 'Karkhan' is not just a physical space, but an interdependent community of dyers, washers, spinners, designers, and weavers operating as a collective unit.
          </p>
        </header>

        <div className="space-y-12">
          {[1, 2, 3].map(item => (
            <div key={item} className="bg-black border border-white/10 overflow-hidden hover:border-white/30 transition-colors">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative aspect-video lg:aspect-auto h-full">
                  <Image src="/assets/images/master-artisans-hero.jpg" alt="Workshop" fill className="object-cover opacity-60" />
                  <div className="absolute bottom-6 left-6 flex gap-2">
                    <span className="bg-white/10 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white border border-white/20">Srinagar District</span>
                    <span className="bg-white/10 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white border border-white/20">Est. 1950</span>
                  </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold mb-2">Carpet Collective</div>
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">The Safa Kadal Naqash Guild</h2>
                  <p className="text-white/60 leading-relaxed mb-8">
                    A rare collective of 12 copper engravers operating out of a 200-year-old heritage building. This Karkhan operates on a traditional master-apprentice hierarchy, where profits are pooled and materials are bought collectively to survive market fluctuations.
                  </p>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4">Key Members Documented</h4>
                    <div className="flex gap-4">
                      {[1, 2, 3].map(member => (
                        <div key={member} className="w-12 h-12 relative rounded-full overflow-hidden border border-white/20">
                          <Image src="/assets/images/artisan-portrait.jpg" alt="Member" fill className="object-cover" />
                        </div>
                      ))}
                      <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center text-[10px] font-bold">+9</div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Link href={`/master-artisans/artisans/workshop-${item}`} className="text-xs font-bold uppercase tracking-widest text-white hover:text-[#D4AF37] border-b border-white hover:border-[#D4AF37] pb-1 transition-colors">
                      View Workshop Profile
                    </Link>
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
write_page("artisans/workshop-communities", workshops_content)

print("Navbar updated and the 5 separate People pages created successfully.")
