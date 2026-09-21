import os
import re

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

# 1. Update Navbar.tsx
navbar_path = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\components\Navbar.tsx"
with open(navbar_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the participate links
old_links = [
    r'\{ name: "Submit a Story", href: "/master-artisans/participate\?action=story" \}',
    r'\{ name: "Become a Contributor", href: "/master-artisans/participate\?action=contributor" \}',
    r'\{ name: "Support Documentation", href: "/master-artisans/participate\?action=support" \}'
]

new_links = [
    '{ name: "Submit a Story", href: "/master-artisans/submit-story" }',
    '{ name: "Become a Contributor", href: "/master-artisans/contributor" }',
    '{ name: "Support Documentation", href: "/master-artisans/support" }'
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

submit_story_content = """import React from 'react';
import Image from 'next/image';

export default function SubmitStory() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-4xl">
        <header className="mb-12 text-center border-b border-[#3E2723]/10 pb-8">
          <div className="w-16 h-16 bg-[#D4AF37] rounded-full mx-auto flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-[#3E2723]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Submit a Story</h1>
          <p className="text-gray-600 text-lg">We welcome essays, interviews, and field notes from researchers, writers, and artisans to be published in the KHCRF Archive.</p>
        </header>

        <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-200">
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Author Name</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#D4AF37]" placeholder="Full Name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                <input type="email" className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#D4AF37]" placeholder="name@example.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Story Title</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#D4AF37]" placeholder="Enter an engaging title" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Story Abstract or Full Text</label>
              <textarea rows={8} className="w-full bg-gray-50 border border-gray-200 p-3 focus:outline-none focus:border-[#D4AF37]" placeholder="Paste your story here, or provide a brief abstract..."></textarea>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 p-6 flex items-center justify-center border-dashed cursor-pointer hover:border-[#D4AF37] transition-colors">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Upload Draft (Word, PDF) or High-Res Images</span>
            </div>

            <button type="button" className="w-full bg-[#3E2723] hover:bg-[#D4AF37] text-white hover:text-[#3E2723] py-4 font-bold uppercase tracking-widest text-sm transition-colors mt-8">
              Submit Draft for Review
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
"""
write_page("submit-story", submit_story_content)

contributor_content = """import React from 'react';

export default function Contributor() {
  return (
    <main className="bg-[#3E2723] min-h-screen text-[#FAF9F6] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-4xl text-center">
        <header className="mb-16">
          <div className="w-16 h-16 bg-[#D4AF37] rounded-full mx-auto flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-[#3E2723]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Become a Contributor</h1>
          <p className="text-white/70 text-lg font-light max-w-2xl mx-auto">Join our esteemed network of field researchers, academic scholars, and cultural photographers dedicated to documenting the living heritage of Kashmir.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left">
          <div className="bg-white/5 border border-white/10 p-6">
            <h3 className="font-serif text-xl text-white mb-2">Field Researchers</h3>
            <p className="text-white/50 text-sm">Conduct on-the-ground interviews and verify workshop lineage data across districts.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6">
            <h3 className="font-serif text-xl text-white mb-2">Photographers</h3>
            <p className="text-white/50 text-sm">Document the intricate processes, tools, and daily lives of artisans in high resolution.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6">
            <h3 className="font-serif text-xl text-white mb-2">Scholars</h3>
            <p className="text-white/50 text-sm">Contribute provenance studies, historical context, and policy analysis for the archive.</p>
          </div>
        </div>

        <div className="bg-white text-[#2A2A2A] p-8 md:p-12 text-left">
          <h2 className="text-2xl font-serif text-[#3E2723] mb-6 border-b border-gray-200 pb-4">Contributor Application</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-200 p-3" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Role of Interest</label>
                <select className="w-full bg-gray-50 border border-gray-200 p-3 text-gray-500">
                  <option>Field Researcher</option>
                  <option>Cultural Photographer</option>
                  <option>Academic Scholar</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Portfolio / Institutional Affiliation</label>
              <input type="text" className="w-full bg-gray-50 border border-gray-200 p-3" placeholder="Link to work or university name" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Statement of Interest</label>
              <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 p-3" placeholder="Tell us why you want to document Kashmir's craft heritage..."></textarea>
            </div>
            <button type="button" className="bg-[#D4AF37] text-[#3E2723] hover:bg-[#3E2723] hover:text-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors">
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
"""
write_page("contributor", contributor_content)

support_content = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SupportDocumentation() {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10">
        <header className="mb-16 border-b border-[#3E2723]/10 pb-8 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-4">Support Documentation</h1>
          <p className="text-gray-600 text-lg">Help us preserve Kashmir's living craft heritage. Your support directly funds archival projects, documentary films, oral histories, and museum-quality acquisitions.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          
          <div className="bg-white border border-gray-200 p-8 shadow-sm">
            <div className="relative aspect-video mb-6 bg-gray-100">
              <Image src="/assets/images/master-artisans-hero.jpg" alt="Documentation" fill className="object-cover opacity-80" />
            </div>
            <h2 className="text-2xl font-serif text-[#3E2723] mb-3">Fund a Documentary Film</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">Sponsor an in-depth documentary in the KHCRF Studio. High-quality videography ensures the subtle gestures and intricate techniques of master artisans are captured in 4K before they are lost to time.</p>
            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <span className="text-[#D4AF37] font-bold text-xl">₹50,000<span className="text-xs text-gray-400 font-normal ml-1">/ film</span></span>
              <Link href="/about/donations" className="bg-[#3E2723] hover:bg-[#D4AF37] text-white hover:text-[#3E2723] px-6 py-2 text-xs font-bold uppercase tracking-widest transition-colors">Support</Link>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-8 shadow-sm">
            <div className="relative aspect-video mb-6 bg-gray-100">
              <Image src="/assets/images/heritage-object.jpg" alt="Archive" fill className="object-cover mix-blend-multiply opacity-80 p-4" />
            </div>
            <h2 className="text-2xl font-serif text-[#3E2723] mb-3">Adopt an Archive Object</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">Help KHCRF acquire rare masterpieces or antique tools for the physical and digital museum. Your contribution ensures these objects remain in Kashmir for study rather than being sold to private collectors abroad.</p>
            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <span className="text-[#D4AF37] font-bold text-xl">₹25,000<span className="text-xs text-gray-400 font-normal ml-1">/ object</span></span>
              <Link href="/about/donations" className="bg-[#3E2723] hover:bg-[#D4AF37] text-white hover:text-[#3E2723] px-6 py-2 text-xs font-bold uppercase tracking-widest transition-colors">Support</Link>
            </div>
          </div>

        </div>
        
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-4">All contributions are eligible for tax exemption under section 80G of the Income Tax Act.</p>
          <Link href="/about/donations" className="text-[#3949AB] hover:text-[#D4AF37] font-bold uppercase tracking-widest text-xs border-b border-[#3949AB] pb-1">View General Donation Options &rarr;</Link>
        </div>

      </div>
    </main>
  );
}
"""
write_page("support", support_content)

print("Navbar updated and the 3 separate Participate pages created successfully.")
