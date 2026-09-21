import os
import re

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans\artisans\[slug]"

profile_path = os.path.join(base_dir, "page.tsx")
with open(profile_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update signature
content = content.replace("export default function ArtisanProfile() {", "export default function ArtisanProfile({ params }: { params: { slug: string } }) {")

# 2. Update Link
content = content.replace('href="#gallery"', 'href={`/master-artisans/artisans/${params.slug}/gallery`}')

# 3. Remove the gallery section
gallery_section = r"""          <section id="gallery" className="mt-16">.*?</section>"""
content = re.sub(gallery_section, "", content, flags=re.DOTALL)

with open(profile_path, "w", encoding="utf-8") as f:
    f.write(content)

# 4. Create the separate gallery page
gallery_dir = os.path.join(base_dir, "gallery")
os.makedirs(gallery_dir, exist_ok=True)

gallery_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ArtisanGallery({ params }: { params: { slug: string } }) {
  const name = params.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-6xl">
        <Link href={`/master-artisans/artisans/${params.slug}`} className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#D4AF37] mb-8 inline-block">
          &larr; Back to {name}'s Profile
        </Link>
        
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8 text-center">
          <div className="text-[#D4AF37] font-bold uppercase tracking-widest text-xs mb-4">Complete Portfolio</div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">{name}'s Masterworks</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A comprehensive visual catalog of signature creations, spanning early works to recent museum acquisitions.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="bg-white border border-gray-200 p-4 group cursor-pointer hover:shadow-xl transition-shadow">
              <div className="relative aspect-square bg-gray-50 overflow-hidden mb-4">
                <Image 
                  src="/assets/images/heritage-object.jpg" 
                  alt="Gallery Item" 
                  fill 
                  className="object-cover mix-blend-multiply opacity-90 p-4 group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-xs font-bold uppercase tracking-widest border border-white/30 px-4 py-2">
                    View Detail
                  </span>
                </div>
              </div>
              <h3 className="font-serif text-[#3E2723] text-lg mb-1 group-hover:text-[#D4AF37] transition-colors">Masterwork 0{item}</h3>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Completed: 202{item % 5}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
"""

with open(os.path.join(gallery_dir, "page.tsx"), "w", encoding="utf-8") as f:
    f.write(gallery_content)

print("Updated profile and created separate gallery page.")
