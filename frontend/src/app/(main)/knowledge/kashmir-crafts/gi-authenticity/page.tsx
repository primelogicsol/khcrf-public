import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "GI & Authenticity | KHCRF Craft Knowledge",
  description: "Understand Geographical Indication protection, product-level verification, and community participation for Kashmir crafts.",
};

export default function GiAuthenticityPage() {
  return (
    <div className="bg-[#fdfcfb] min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-24 px-4 bg-[#071025] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link href="/knowledge/kashmir-crafts" className="text-[10px] font-bold uppercase tracking-widest text-[#a9783c] hover:text-white transition-colors">
              ← Return to Craft Knowledge
            </Link>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4">
            PROTECTING HERITAGE
          </div>
          <h1 className="text-5xl md:text-6xl font-black font-serif mb-8">Understand GI Protection</h1>
          <p className="text-xl md:text-2xl text-white/70 max-w-3xl leading-relaxed">
            Geographical Indication (GI) protects the identity of Kashmir's crafts, but registration alone does not prove individual product authenticity. Learn how to interpret credentials correctly.
          </p>
        </div>
      </section>

      {/* 2. EDUCATION LAYER */}
      <section className="py-24 px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-8">
            <h2 className="text-3xl font-bold font-serif text-[#071025] mb-8">What GI Actually Tells You</h2>
            <div className="prose max-w-none text-gray-600 space-y-6">
              <p className="text-lg">
                Geographical Indication is a powerful legal framework, but it is frequently misunderstood. A GI tag on a craft tradition (like "Kashmir Pashmina") establishes the geographic association and protected identity of the craft. 
              </p>
              <p className="text-lg">
                However, a GI name alone does <strong>not</strong> automatically prove that an individual product you are buying is genuine, handmade, correctly represented, or produced by an authorized maker.
              </p>
              <ul className="space-y-4 my-8 list-none pl-0">
                <li className="flex items-start gap-4 p-6 bg-white border border-gray-100 rounded-xl">
                  <span className="text-green-700 font-bold mt-1">✓</span>
                  <div>
                    <strong className="block text-[#071025] mb-1">Craft protected</strong>
                    <span className="text-sm">The tradition itself has formal geographical protection.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 p-6 bg-white border border-gray-100 rounded-xl">
                  <span className="text-red-700 font-bold mt-1">≠</span>
                  <div>
                    <strong className="block text-[#071025] mb-1">Authorized producer</strong>
                    <span className="text-sm">A producer or entity must be formally authorized. The name alone doesn't prove authorization.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4 p-6 bg-white border border-gray-100 rounded-xl">
                  <span className="text-red-700 font-bold mt-1">≠</span>
                  <div>
                    <strong className="block text-[#071025] mb-1">Individual product verified</strong>
                    <span className="text-sm">Evidence must connect a specific product to an eligible producer and process.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* DEEPER EDUCATIONAL RESOURCE */}
          <div className="lg:col-span-4">
            <div className="bg-[#f6f5f1] border border-[rgba(169,120,60,0.2)] rounded-2xl p-8 sticky top-32">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#a9783c] mb-4">
                DEEPER EDUCATIONAL RESOURCE
              </div>
              <h3 className="text-xl font-bold font-serif text-[#071025] mb-4">Want the complete GI-system explanation?</h3>
              <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                Explore the external Craftlore platform to learn exactly what GI is, why protection matters, the registration/authorization process, and how buyers can identify GI-linked products.
              </p>
              <a 
                href="https://www.craftlore.org/cgis/craft_gi_system/about-gi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#071025] text-white text-xs font-bold uppercase tracking-widest px-6 py-4 rounded-lg hover:bg-[#a9783c] transition-colors group w-full justify-center"
              >
                Explore Craftlore: About GI <span className="text-lg leading-none transform transition-transform group-hover:-translate-y-[1px] group-hover:translate-x-[1px]">↗</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 3. VERIFICATION LAUNCHERS */}
      <section className="py-24 px-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-serif text-[#071025] mb-4">Verify With Evidence</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Ready to verify a product or explore the registry? Launch the specialized Craftlore CGIS verification engines.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <a href="https://www.craftlore.org/cgis/craft_gi_system/listed-crafts" target="_blank" rel="noopener noreferrer" className="block border border-gray-100 rounded-2xl p-8 hover:border-[#a9783c]/30 hover:shadow-xl transition-all group">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#a9783c] mb-4">CRAFTLORE REGISTRY</div>
              <h3 className="text-xl font-bold text-[#071025] mb-2">Explore GI-Protected Crafts</h3>
              <p className="text-sm text-gray-500 mb-8">Browse the formal registry of Kashmir crafts holding Geographical Indication status.</p>
              <div className="text-xs font-bold text-[#071025] flex items-center justify-between group-hover:text-[#a9783c] transition-colors">
                Launch Registry Engine 
                <span className="text-lg transform transition-transform group-hover:-translate-y-[1px] group-hover:translate-x-[1px]">↗</span>
              </div>
            </a>

            <a href="https://www.craftlore.org/cgis/craft_gi_system/verify-product" target="_blank" rel="noopener noreferrer" className="block border border-gray-100 rounded-2xl p-8 hover:border-[#a9783c]/30 hover:shadow-xl transition-all group">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#a9783c] mb-4">CRAFTLORE VERIFICATION</div>
              <h3 className="text-xl font-bold text-[#071025] mb-2">Verify a GI Product</h3>
              <p className="text-sm text-gray-500 mb-8">Check individual product credentials and authenticity tags against official GI verification records.</p>
              <div className="text-xs font-bold text-[#071025] flex items-center justify-between group-hover:text-[#a9783c] transition-colors">
                Launch Verification Tool 
                <span className="text-lg transform transition-transform group-hover:-translate-y-[1px] group-hover:translate-x-[1px]">↗</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 4. PREMIUM ACTION STRIP: HERO PROGRAM */}
      <section className="py-32 px-4 bg-[#f4f4f2] text-center border-t-8 border-[#a9783c]">
        <div className="max-w-4xl mx-auto">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#a9783c] mb-6">
            FROM KNOWLEDGE TO PROTECTION
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-serif text-[#071025] mb-8">
            Help Protect Kashmir's GI Crafts
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            GI protection depends not only on registration, but also on informed buyers, artisans, researchers and community members who can identify suspicious claims and contribute evidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <a 
              href="https://www.craftlore.org/cgis/craft_gi_system/hero-program"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#a9783c] text-white text-xs font-bold uppercase tracking-widest px-8 py-5 rounded-xl hover:bg-[#8c6230] transition-colors group shadow-lg shadow-[#a9783c]/20"
            >
              Become a GI Hero <span className="text-xl leading-none transform transition-transform group-hover:-translate-y-[1px] group-hover:translate-x-[1px]">↗</span>
            </a>
            
            <a 
              href="https://www.craftlore.org/cgis/craft_gi_system/report-counterfeit"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#071025] border-2 border-gray-200 text-xs font-bold uppercase tracking-widest px-8 py-5 rounded-xl hover:border-[#071025] transition-colors group"
            >
              Report a Suspected Counterfeit <span className="text-xl leading-none transform transition-transform group-hover:-translate-y-[1px] group-hover:translate-x-[1px]">↗</span>
            </a>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Community Protection Program · Craftlore CGIS
          </div>
        </div>
      </section>

    </div>
  );
}