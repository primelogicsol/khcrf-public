import os

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans\artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)


# 1. Apprentices
apprentices_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Apprentices() {
  const students = [
    { name: "Riyaz Ahmad", craft: "Carpet Weaving", ustad: "Ustad Ghulam Hassan", slug: "riyaz-ahmad" },
    { name: "Shabir Ali", craft: "Sozni Embroidery", ustad: "Fatima Begum", slug: "shabir-ali" },
    { name: "Asif Jan", craft: "Walnut Carving", ustad: "Ali Mohammad Najjar", slug: "asif-jan" },
    { name: "Naseer Bhat", craft: "Copperware", ustad: "Tariq Ahmad", slug: "naseer-bhat" },
    { name: "Iqra Bano", craft: "Pashmina Spinning", ustad: "Hajira Begum", slug: "iqra-bano" },
    { name: "Muneer", craft: "Papier-Mâché", ustad: "Zahid Dar", slug: "muneer" },
    { name: "Bilal", craft: "Namda Felting", ustad: "Zareena Bano", slug: "bilal" },
    { name: "Fayaz", craft: "Willow Wicker", ustad: "Asiya Jan", slug: "fayaz" }
  ];
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
          {students.map((student, i) => (
            <Link href={`/master-artisans/artisans/${student.slug}`} key={i} className="block bg-white border border-gray-100 p-6 text-center group hover:border-[#D4AF37] transition-colors shadow-sm hover:shadow-md">
              <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-50 border-2 border-transparent group-hover:border-[#D4AF37] transition-colors">
                 <Image src="/assets/images/artisan-portrait.jpg" alt={student.name} fill className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
              </div>
              <h3 className="font-serif text-lg text-[#3E2723] mb-1 group-hover:text-[#D4AF37] transition-colors">{student.name}</h3>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">{student.craft}</div>
              <div className="text-xs text-[#3949AB] bg-[#3949AB]/5 py-2 px-2 border border-transparent group-hover:border-[#3949AB]/20 transition-colors">
                <span className="block text-[9px] text-gray-500 uppercase mb-1">Apprentice to:</span>
                <span className="font-bold">{student.ustad}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
"""
write_page("apprentices", apprentices_content)


# 2. Workshop Communities
workshops_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function WorkshopCommunities() {
  const karkhans = [
    {
      title: "The Safa Kadal Naqash Guild", craft: "Copper Engraving", loc: "Srinagar District", est: "Est. 1920",
      desc: "A rare collective of 12 copper engravers operating out of a heritage building. This Karkhan operates on a traditional master-apprentice hierarchy where materials are bought collectively.",
      slug: "safa-kadal-guild"
    },
    {
      title: "Zadibal Sozni Collective", craft: "Sozni Embroidery", loc: "Zadibal", est: "Est. 1965",
      desc: "A predominantly female-led workshop focusing on double-sided needlework for Pashmina shawls, pooling resources to maintain high-quality silk threads.",
      slug: "zadibal-collective"
    },
    {
      title: "Kanihama Weavers Cooperative", craft: "Kani Shawl Weaving", loc: "Budgam District", est: "Est. 1980",
      desc: "The heart of the Kani weaving revival. Dozens of looms operate simultaneously here, guided by a single master Talim-reader who dictates patterns to the entire floor.",
      slug: "kanihama-cooperative"
    }
  ];
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
          {karkhans.map((karkhan, idx) => (
            <div key={idx} className="bg-black border border-white/10 overflow-hidden hover:border-white/30 transition-colors">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative aspect-video lg:aspect-auto h-full">
                  <Image src="/assets/images/master-artisans-hero.jpg" alt={karkhan.title} fill className="object-cover opacity-60" />
                  <div className="absolute bottom-6 left-6 flex gap-2">
                    <span className="bg-white/10 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white border border-white/20">{karkhan.loc}</span>
                    <span className="bg-white/10 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white border border-white/20">{karkhan.est}</span>
                  </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold mb-2">{karkhan.craft}</div>
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">{karkhan.title}</h2>
                  <p className="text-white/60 leading-relaxed mb-8">{karkhan.desc}</p>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4">Key Members Documented</h4>
                    <div className="flex gap-4">
                      {[1, 2, 3].map(member => (
                        <div key={member} className="w-12 h-12 relative rounded-full overflow-hidden border border-white/20">
                          <Image src="/assets/images/artisan-portrait.jpg" alt="Member" fill className="object-cover grayscale hover:grayscale-0 transition-all" />
                        </div>
                      ))}
                      <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center text-[10px] font-bold hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors cursor-pointer">+9</div>
                    </div>
                  </div>
                  <div className="mt-8 flex gap-4">
                    <Link href={`/master-artisans/artisans/${karkhan.slug}`} className="text-xs font-bold uppercase tracking-widest text-white hover:text-[#D4AF37] border-b border-white hover:border-[#D4AF37] pb-1 transition-colors">
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
write_page("workshop-communities", workshops_content)

print("Apprentices and Workshop Communities deduplicated and link-enabled successfully.")
