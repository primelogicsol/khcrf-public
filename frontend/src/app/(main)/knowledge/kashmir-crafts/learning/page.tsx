import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "Learning & Skills | KHCRF Craft Knowledge",
  description: "Build structured understanding of craft identity, materials, techniques, GI, authenticity, provenance and preservation.",
};

export default function LearningGatewayPage() {
  return (
    <div className="bg-[#fdfcfb] min-h-screen">
      
      {/* HERO SECTION */}
      <section className="pt-32 pb-24 px-4 bg-[#071025] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link href="/knowledge/kashmir-crafts" className="text-[10px] font-bold uppercase tracking-widest text-[#a9783c] hover:text-white transition-colors">
              ← Return to Craft Knowledge
            </Link>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4">
            04 · LEARN &amp; PRESERVE
          </div>
          <h1 className="text-5xl md:text-6xl font-black font-serif mb-8">Learn Kashmir Crafts</h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl leading-relaxed">
            Build structured understanding of craft identity, materials, techniques, GI, authenticity, provenance and preservation.
          </p>
        </div>
      </section>

      {/* CURATED LEARNING PATHWAYS */}
      <section className="py-24 px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#a9783c] mb-8">KHCRF CURATED PATHWAYS</div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-100 p-8 rounded-2xl hover:border-[#a9783c]/30 hover:shadow-xl transition-all">
              <h3 className="text-lg font-bold text-[#071025] mb-2">Understanding Pashmina</h3>
              <p className="text-sm text-gray-500 mb-6">Fibre origin, processing, production and authenticity.</p>
              <div className="text-xs font-bold uppercase tracking-widest text-[#071025]">View Pathway →</div>
            </div>
            <div className="bg-white border border-gray-100 p-8 rounded-2xl hover:border-[#a9783c]/30 hover:shadow-xl transition-all">
              <h3 className="text-lg font-bold text-[#071025] mb-2">Kani Weaving Fundamentals</h3>
              <p className="text-sm text-gray-500 mb-6">Talim, loom preparation, and Kani construction.</p>
              <div className="text-xs font-bold uppercase tracking-widest text-[#071025]">View Pathway →</div>
            </div>
            <div className="bg-white border border-gray-100 p-8 rounded-2xl hover:border-[#a9783c]/30 hover:shadow-xl transition-all">
              <h3 className="text-lg font-bold text-[#071025] mb-2">Kashmir GI &amp; Authenticity</h3>
              <p className="text-sm text-gray-500 mb-6">Geographic protection and authorization.</p>
              <div className="text-xs font-bold uppercase tracking-widest text-[#071025]">View Pathway →</div>
            </div>
            <div className="bg-white border border-gray-100 p-8 rounded-2xl hover:border-[#a9783c]/30 hover:shadow-xl transition-all">
              <h3 className="text-lg font-bold text-[#071025] mb-2">Craft Provenance</h3>
              <p className="text-sm text-gray-500 mb-6">Trace product history and evidence chains.</p>
              <div className="text-xs font-bold uppercase tracking-widest text-[#071025]">View Pathway →</div>
            </div>
            <div className="bg-white border border-gray-100 p-8 rounded-2xl hover:border-[#a9783c]/30 hover:shadow-xl transition-all">
              <h3 className="text-lg font-bold text-[#071025] mb-2">Materials &amp; Techniques</h3>
              <p className="text-sm text-gray-500 mb-6">Study raw materials and production methods.</p>
              <div className="text-xs font-bold uppercase tracking-widest text-[#071025]">View Pathway →</div>
            </div>
            <div className="bg-white border border-gray-100 p-8 rounded-2xl hover:border-[#a9783c]/30 hover:shadow-xl transition-all">
              <h3 className="text-lg font-bold text-[#071025] mb-2">Buyer Intelligence</h3>
              <p className="text-sm text-gray-500 mb-6">Evaluate materials, workmanship and authenticity.</p>
              <div className="text-xs font-bold uppercase tracking-widest text-[#071025]">View Pathway →</div>
            </div>
          </div>
        </div>
      </section>

      {/* EXTERNAL LEARNING ENGINE PANEL */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto bg-[#071025] text-white rounded-[32px] p-8 md:p-16 relative overflow-hidden shadow-2xl">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#a9783c]/20 to-transparent rounded-bl-full pointer-events-none"></div>

          <div className="text-[10px] font-bold uppercase tracking-widest text-[#a9783c] mb-4">
            LEARNING &amp; RECOGNITION ENGINE
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-serif mb-6">Craftlore Learning Incentives Engine</h2>
          <p className="text-lg text-white/70 max-w-2xl leading-relaxed mb-12">
            Transform measurable learning into accredited distinction, redeemable rewards and wider participation in the craft knowledge ecosystem.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            
            <div>
              <h4 className="text-[#a9783c] font-bold text-sm uppercase tracking-widest mb-2">Structured Learning</h4>
              <p className="text-sm text-white/70 leading-relaxed">Progress through measurable knowledge modules.</p>
            </div>
            
            <div>
              <h4 className="text-[#a9783c] font-bold text-sm uppercase tracking-widest mb-2">Accredited Distinction</h4>
              <p className="text-sm text-white/70 leading-relaxed">Convert demonstrated learning into recognized achievement where supported.</p>
            </div>
            
            <div>
              <h4 className="text-[#a9783c] font-bold text-sm uppercase tracking-widest mb-2">Learning Incentives</h4>
              <p className="text-sm text-white/70 leading-relaxed">Connect progress with eligible rewards and participation mechanisms.</p>
            </div>
            
            <div>
              <h4 className="text-[#a9783c] font-bold text-sm uppercase tracking-widest mb-2">Global Influence</h4>
              <p className="text-sm text-white/70 leading-relaxed">Extend informed craft knowledge beyond passive reading.</p>
            </div>

          </div>

          <div className="border-t border-white/10 pt-12 flex flex-col sm:flex-row items-center justify-between gap-8">
            <a 
              href="https://www.craftlore.org/clie/learning-incentive/modules" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-[#a9783c] text-white text-xs font-bold uppercase tracking-widest px-8 py-5 rounded-xl hover:bg-[#8c6230] transition-colors group shadow-lg flex items-center gap-2"
            >
              Launch Learning Engine <span className="text-xl leading-none transform transition-transform group-hover:-translate-y-[1px] group-hover:translate-x-[1px]">↗</span>
            </a>

            <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 text-right">
              External Learning Platform<br/>Craftlore CLIE
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}