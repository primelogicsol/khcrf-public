import os
import re

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

def write_page(route, content):
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    with open(os.path.join(path, "page.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# 1. Magazine Article Detail (issues/[slug]/[articleSlug])
issue_article = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function IssueArticleDetail({ params }: { params: { slug: string, articleSlug: string } }) {
  // Format slug to readable title
  const title = params.articleSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-4xl">
        <Link href={`/master-artisans/issues/${params.slug}`} className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#D4AF37] mb-8 inline-block">
          &larr; Back to Issue Index
        </Link>
        
        <header className="mb-12 border-b border-[#3E2723]/10 pb-12">
          <div className="text-[#D4AF37] font-bold uppercase tracking-widest text-sm mb-4">Magazine Feature</div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#3E2723] mb-6 leading-tight">{title}</h1>
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
            <span>By Editorial Desk</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            <span>12 Min Read</span>
          </div>
        </header>
        
        <div className="relative aspect-[21/9] mb-12 bg-gray-100">
          <Image src="/assets/images/master-artisans-hero.jpg" alt="Article Header" fill className="object-cover" />
        </div>
        
        <article className="prose prose-lg max-w-none text-gray-600 font-serif leading-relaxed">
          <p className="text-2xl text-[#3E2723] mb-8 leading-relaxed">
            The tradition of Kashmiri craftsmanship is not merely about the production of beautiful objects, but the transmission of a complex, unwritten code of ethics, aesthetics, and social interdependence spanning centuries.
          </p>
          <p className="mb-6">
            In the shadowed workshops of downtown Srinagar, the rhythmic sound of the chisel or the loom is a language unto itself. Master artisans, some of whom have practiced their craft for over fifty years, possess a kinetic memory that cannot be fully captured in textbooks. 
          </p>
          <p className="mb-6">
            Our documentation efforts at KHCRF aim to capture these fleeting moments—the precise angle of a Naqash's engraving tool, the specific recipe for madder root dye, and the oral histories of the guilds that once supplied royal courts across Central Asia.
          </p>
          
          <div className="my-12 p-8 border-l-4 border-[#D4AF37] bg-white italic text-xl text-[#3E2723]">
            "To understand the craft, you must first understand the silence of the artisan."
          </div>
          
          <p>
            As global markets demand faster production, these ancient, deliberate methods are under threat. By mapping the lineages and recording the masterclasses, we ensure that the standard of excellence set by previous generations remains the benchmark for the future.
          </p>
        </article>
      </div>
    </main>
  );
}
"""
write_page("issues/[slug]/[articleSlug]", issue_article)


# 2. Stories / Essays Detail (stories/[slug])
story_detail = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function StoryDetail({ params }: { params: { slug: string } }) {
  const title = params.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  
  return (
    <main className="bg-white min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-4xl">
        <Link href="/master-artisans/stories" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#D4AF37] mb-8 inline-block">
          &larr; Back to Stories
        </Link>
        
        <header className="mb-12 text-center">
          <div className="text-[#3949AB] font-bold uppercase tracking-widest text-sm mb-4">Editorial Essay</div>
          <h1 className="text-4xl md:text-6xl font-serif text-[#3E2723] mb-6 leading-tight">{title}</h1>
          <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
            <span>By KHCRF Research</span>
            <span>•</span>
            <span>Oct 2026</span>
          </div>
        </header>
        
        <div className="relative aspect-video mb-12 bg-gray-100">
          <Image src="/assets/images/heritage-object.jpg" alt="Story Header" fill className="object-cover" />
        </div>
        
        <article className="prose prose-lg max-w-none text-gray-600 font-serif leading-relaxed">
          <p className="mb-6">
            The rich tapestry of Kashmiri heritage is interwoven with the lives of its master artisans. Every knot, every stroke of the brush, and every strike of the hammer tells a story of survival, adaptation, and unparalleled skill.
          </p>
          <p className="mb-6">
            This detailed exploration dives into the intricate realities of producing world-class craftsmanship in an era of mass production. It highlights the dedication required to master techniques that have remained largely unchanged since the 15th century.
          </p>
          <div className="grid grid-cols-2 gap-4 my-8">
            <div className="relative aspect-square"><Image src="/assets/images/artisan-portrait.jpg" alt="Detail" fill className="object-cover" /></div>
            <div className="relative aspect-square"><Image src="/assets/images/master-artisans-hero.jpg" alt="Detail" fill className="object-cover" /></div>
          </div>
          <p>
            The future of these crafts relies not just on patronage, but on deep, structural documentation and the elevation of the artisan from a nameless laborer to a recognized master of their discipline.
          </p>
        </article>
      </div>
    </main>
  );
}
"""
write_page("stories/[slug]", story_detail)


# 3. Knowledge Topic Detail (knowledge/[slug])
knowledge_detail = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function KnowledgeDetail({ params }: { params: { slug: string } }) {
  const title = params.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-5xl">
        <Link href="/master-artisans/knowledge" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-[#D4AF37] mb-8 inline-block">
          &larr; Back to Knowledge Hub
        </Link>
        
        <div className="flex flex-col md:flex-row gap-12 bg-white p-8 md:p-12 shadow-xl border border-[#3E2723]/10">
          <div className="w-full md:w-1/2 relative aspect-square bg-gray-50 p-6">
            <Image src="/assets/images/heritage-object.jpg" alt="Topic" fill className="object-contain mix-blend-multiply opacity-90 p-8" />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-2 border-b border-gray-100 pb-2 inline-block">Encyclopedia Entry</div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#3E2723] mb-6">{title}</h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              A foundational element of Kashmiri craftsmanship. This entry details the historical origin, material properties, and specific application of this technique or motif within the broader ecosystem of the valley's heritage arts.
            </p>
            
            <div className="bg-[#FAF9F6] p-6 border-l-4 border-[#3E2723]">
              <h4 className="font-bold text-[#3E2723] text-sm uppercase tracking-widest mb-2">Technical Specifications</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><strong className="text-[#3E2723]">Primary Craft:</strong> Cross-disciplinary</li>
                <li><strong className="text-[#3E2723]">Origin Period:</strong> 14th - 16th Century</li>
                <li><strong className="text-[#3E2723]">Conservation Status:</strong> Practiced widely</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
"""
write_page("knowledge/[slug]", knowledge_detail)


# 4. Collections Item Detail (collections/[slug])
collections_detail = """import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CollectionDetail({ params }: { params: { slug: string } }) {
  const title = params.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  
  return (
    <main className="bg-[#3E2723] min-h-screen text-[#FAF9F6] font-sans pt-32 pb-24">
      <div className="container-fluid mx-auto px-4 md:px-10 max-w-6xl">
        <Link href="/master-artisans/collections" className="text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white mb-8 inline-block">
          &larr; Back to Archive
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="relative aspect-[3/4] bg-white/5 border border-white/10 p-8">
              <Image src="/assets/images/heritage-object.jpg" alt="Artifact" fill className="object-contain p-8 drop-shadow-2xl mix-blend-screen opacity-90" />
            </div>
          </div>
          
          <div className="py-8">
            <div className="flex gap-4 mb-4">
              <span className="bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Accession: KH-2026-X</span>
              <span className="border border-white/20 text-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Heritage Archive</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-6">{title}</h1>
            
            <div className="prose prose-invert max-w-none mb-10">
              <p className="text-lg text-white/70 font-light leading-relaxed">
                This exceptionally rare object demonstrates the pinnacle of historical Kashmiri artisanship. Preserved in the KHCRF archives, it serves as a master reference for identifying authentic traditional techniques, dyes, and structural integrity.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 border-t border-white/10 pt-8">
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Dating / Era</div>
                <div className="font-serif text-xl">Late 19th Century</div>
              </div>
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Material</div>
                <div className="font-serif text-xl">Organic & Mineral Base</div>
              </div>
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Provenance</div>
                <div className="font-serif text-xl">Downtown Srinagar</div>
              </div>
              <div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Condition</div>
                <div className="font-serif text-xl text-green-400">Conserved</div>
              </div>
            </div>
            
            <div className="mt-12 flex gap-4">
              <button className="bg-white text-[#3E2723] hover:bg-[#D4AF37] px-8 py-3 text-xs font-bold uppercase tracking-widest transition-colors">
                View High-Res Scan
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
"""
write_page("collections/[slug]", collections_detail)

# 5. Update the issues/[slug]/page.tsx to use Links for the articles
issues_page_path = os.path.join(base_dir, "issues\\[slug]\\page.tsx")
with open(issues_page_path, "r", encoding="utf-8") as f:
    issues_content = f.read()

# Replace the <li> mapping with a <Link> mapping
old_li_block = r"""<li key=\{i\} className="flex justify-between items-center group cursor-pointer">
                    <span className="font-medium text-gray-700 group-hover:text-\[\#D4AF37\] transition-colors">\{article.title\}</span>
                    <span className="text-xs font-mono text-gray-400">pg\. \{article.page\}</span>
                  </li>"""
new_link_block = """<Link href={`/master-artisans/issues/01/${article.title.toLowerCase().replace(/ /g, '-')}`} key={i} className="flex justify-between items-center group cursor-pointer pb-4 border-b border-gray-100 last:border-0">
                    <span className="font-medium text-gray-700 group-hover:text-[#D4AF37] transition-colors">{article.title}</span>
                    <span className="text-xs font-mono text-gray-400">pg. {article.page}</span>
                  </Link>"""

issues_content = re.sub(old_li_block, new_link_block, issues_content)
with open(issues_page_path, "w", encoding="utf-8") as f:
    f.write(issues_content)

print("Successfully created dynamic detail pages for Issues, Stories, Knowledge, and Collections. Updated Issues to use active links.")
