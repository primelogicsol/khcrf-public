import React from 'react';
import Link from 'next/link';
import GiEvidenceStepper from '@/components/knowledge/GiEvidenceStepper';
import EvidenceAndTrust from '@/components/knowledge/EvidenceAndTrust';
import KnowledgeIntoAction from '@/components/knowledge/KnowledgeIntoAction';
import IntelligenceCommandCenter from '@/components/knowledge/IntelligenceCommandCenter';
import ProcessAtlas from '@/components/knowledge/ProcessAtlas';
import BuyerIntelligence from '@/components/knowledge/BuyerIntelligence';
import KnowledgeIntoPractice from '@/components/knowledge/KnowledgeIntoPractice';
import { FaSearch, FaBookOpen, FaIndustry, FaGraduationCap, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export const metadata = {
  title: "Kashmir Craft Knowledge | KHCRF",
  description: "Explore how Kashmir crafts are made, protected, authenticated, valued, preserved and distinguished from imitations.",
};

// 1. DATA
const FLAGSHIP_CRAFTS = [
  { slug: 'pashmina', name: 'Kashmir Pashmina', family: 'KASHMIR TEXTILES', description: 'Fine-fibre textile tradition shaped through specialist hand processing, spinning, weaving and finishing.', material: 'Pashmina fibre', technique: 'Hand spinning · Hand weaving', giStatus: 'GI PROTECTED', knowledgeFocus: ['Authenticity', 'Provenance'] },
  { slug: 'kani', name: 'Kani Shawl', family: 'KASHMIR TEXTILES', description: 'A highly specialized Kashmir shawl tradition woven through the Kani technique using coded design construction.', material: 'Pashmina / wool', technique: 'Kani weaving', giStatus: 'GI PROTECTED', knowledgeFocus: ['Technique', 'Authenticity'] },
  { slug: 'carpets', name: 'Kashmir Hand-Knotted Carpets', family: 'KASHMIR TEXTILES', description: 'Kashmir\'s hand-knotted carpet tradition defined by knot structure, design, material and specialist workmanship.', material: 'Silk / wool', technique: 'Hand knotting', giStatus: 'VERIFIED STATUS ONLY', knowledgeFocus: ['Construction', 'Provenance'] },
  { slug: 'papier-mache', name: 'Kashmir Papier-Mache', family: 'DECORATIVE ARTS', description: 'A layered decorative craft combining structural preparation with intricate painted surface decoration.', material: 'Paper-based body · pigments', technique: 'Sakhtasazi · Naqashi', giStatus: 'VERIFIED STATUS ONLY', knowledgeFocus: ['Process', 'Authenticity'] },
  { slug: 'sozni', name: 'Sozni Embroidery', family: 'KASHMIR TEXTILES', description: 'Fine needle embroidery distinguished by dense workmanship, precision and highly skilled hand execution.', material: 'Textile base · thread', technique: 'Sozni needlework', giStatus: 'VERIFIED STATUS ONLY', knowledgeFocus: ['Labour', 'Quality'] },
  { slug: 'crewel', name: 'Crewel / Chain Stitch', family: 'KASHMIR TEXTILES', description: 'Decorative textile work characterized by hand-worked surface embroidery and distinctive stitch construction.', material: 'Fabric · yarn/thread', technique: 'Crewel / chain stitch', giStatus: 'VERIFIED STATUS ONLY', knowledgeFocus: ['Hand vs machine', 'Technique'] },
  { slug: 'walnut', name: 'Kashmir Walnut Wood Carving', family: 'WOODCRAFT', description: 'A specialist carving tradition based on Kashmir walnut wood and distinctive ornamental carving practices.', material: 'Walnut wood', technique: 'Hand carving', giStatus: 'VERIFIED STATUS ONLY', knowledgeFocus: ['Material', 'Origin'] },
  { slug: 'copperware', name: 'Kashmir Copperware', family: 'METALCRAFT', description: 'Traditional Kashmir metalwork shaped through forming, engraving and decorative hand-finishing techniques.', material: 'Copper', technique: 'Metal forming · Engraving', giStatus: 'VERIFIED STATUS ONLY', knowledgeFocus: ['Production', 'Authenticity'] },
];

const INTELLIGENCE_TOOLS = [
  { id: 'verify-product', title: 'Verify a GI Product', desc: 'Check product credentials against GI verification records.', engine: 'Craftlore CGIS', link: 'https://www.craftlore.org/cgis/craft_gi_system/verify-product' },
  { id: 'trade-integrity', title: 'Trade Integrity & Risk', desc: 'Check buyer protection records and verified trade entities.', engine: 'Craftlore CKTRE', link: 'https://www.craftlore.org/cktre/trade-registry/verified-entities' },
  { id: 'product-appraisal', title: 'Product Appraisal', desc: 'Estimate fair value using material, labour, craftsmanship and provenance inputs.', engine: 'Craftlore CAIS', link: 'https://www.craftlore.org/cais/appraisal_intelligence/product-appraisal' },
  { id: 'market-rate', title: 'Market Rate Intelligence', desc: 'Explore market-rate intelligence and fair-value benchmarks.', engine: 'Craftlore CAIS', link: 'https://www.craftlore.org/cais/appraisal_intelligence/market-rate-engine' },
  { id: 'sustainability', title: 'Sustainability Assessment', desc: 'Assess lifecycle impacts, material footprints and production-related sustainability factors.', engine: 'Craftlore CLEE', link: 'https://www.craftlore.org/clee/lifecycle-emission/assessment' },
  { id: 'craft-economy', title: 'Kashmir Craft Economy', desc: 'Explore production, export and sector-level economic intelligence for Kashmir crafts.', engine: 'Craftlore CSEME', link: 'https://www.craftlore.org/cseme/socio-economic/dashboard' },
];

const DOMAINS = [
  { id: 'crafts', title: 'Crafts', desc: 'Complete profiles of Kashmir craft traditions', role: 'Explore Crafts', link: '/knowledge/kashmir-crafts/crafts' },
  { id: 'gi', title: 'GI & Authenticity', desc: 'Geographic protection, authorized users, and authenticity evidence.', role: 'Explore GI Intelligence', link: '/knowledge/kashmir-crafts/gi-authenticity' },
  { id: 'processes', title: 'Processes', desc: 'How each craft is produced step by step.', role: 'Explore Processes', link: '/knowledge/kashmir-crafts/processes' },
  { id: 'techniques', title: 'Techniques', desc: 'Kani, Sozni, Aari, knotting, carving, Naqashi.', role: 'Explore Techniques', link: '/knowledge/kashmir-crafts/techniques' },
  { id: 'materials', title: 'Materials & Tools', desc: 'Fibre, wool, wood, metal, dyes, looms and tools.', role: 'Explore Materials', link: '/knowledge/kashmir-crafts/materials' },
  { id: 'value', title: 'Craft Value', desc: 'Cost drivers and indicative production estimation.', role: 'Understand Value', link: '/knowledge/kashmir-crafts/value' },
  { id: 'economy', title: 'Craft Economy', desc: 'Production, export, and sector market metrics.', role: 'Market Intelligence', link: '/knowledge/kashmir-crafts/economy' },
  { id: 'sustainability', title: 'Sustainability', desc: 'Lifecycle emissions, natural dyes, and footprints.', role: 'Sustainability Data', link: '/knowledge/kashmir-crafts/sustainability' },
  { id: 'risk', title: 'Risk Intelligence', desc: 'Supply chain and market vulnerabilities.', role: 'Assess Risks', link: '/knowledge/kashmir-crafts/risk' },
  { id: 'trade', title: 'Trade Integrity', desc: 'Buyer protection and verified trade entities.', role: 'Trade Integrity', link: '/knowledge/kashmir-crafts/trade-integrity' },
  
  
];

const ExternalToolCard = ({ title, desc, engine, link, externalLabel = "EXTERNAL INTELLIGENCE TOOL" }: any) => (
  <a href={link} target="_blank" rel="noopener noreferrer" className="group block h-full outline-none">
    <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-brand-primary/30 transition-all duration-300 h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-[var(--card-left-accent)] group-hover:bg-brand-primary transition-colors"></div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span> {externalLabel}
      </div>
      <h3 className="text-lg font-bold text-brand-dark mb-2 leading-tight">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 flex-grow leading-relaxed">{desc}</p>
      <div className="bg-gray-50 p-4 rounded-xl mt-auto border border-gray-100 group-hover:bg-white group-hover:border-brand-primary/20 transition-colors">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
          Intelligence Engine ·· {engine}
        </div>
        <div className="flex items-center justify-between text-sm font-bold text-brand-dark group-hover:text-brand-primary transition-colors">
          Launch Tool 
          <span className="text-lg leading-none opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">↗</span>
        </div>
      </div>
    </div>
  </a>
);

const FlagshipCraftCard = ({ craft }: any) => (
  <Link href={`/knowledge/kashmir-crafts/${craft.slug}`} className="group block h-full outline-none">
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 hover:border-brand-primary/30 transition-all duration-300 h-full flex flex-col">
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">
          {craft.family}
        </div>
        {craft.giStatus === 'GI PROTECTED' && (
          <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-md">
            GI PROTECTED
          </div>
        )}
      </div>

      <h3 className="text-2xl font-bold text-brand-dark mb-3 group-hover:text-brand-primary transition-colors font-serif leading-tight">
        {craft.name}
      </h3>
      <p className="text-sm text-gray-600 mb-6 leading-relaxed line-clamp-2">
        {craft.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mt-auto mb-6">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">MATERIAL</div>
          <div className="text-sm font-medium text-brand-dark">{craft.material}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">TECHNIQUE</div>
          <div className="text-sm font-medium text-brand-dark">{craft.technique}</div>
        </div>
        <div className="col-span-2 pt-2 border-t border-gray-100">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">KNOWLEDGE FOCUS</div>
          <div className="text-sm font-medium text-brand-dark">{craft.knowledgeFocus.join(' · ')}</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm font-bold text-brand-primary">
        Explore Craft 
        <span className="text-lg leading-none transform transition-transform group-hover:translate-x-1">→</span>
      </div>

    </div>
  </Link>
);

export default function KnowledgePortal() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      
      {/* 1. HERO: SEARCH FIRST */}
      <section className="bg-brand-dark text-white pt-24 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary opacity-20 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-4 block">
            KHCRF Knowledge System
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 font-serif max-w-4xl mx-auto">
            Search Kashmir Craft Knowledge
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Explore how Kashmir crafts are made, protected, authenticated, valued, preserved and distinguished from imitations.
          </p>
          
          <div className="relative max-w-3xl mx-auto mb-8">
            <input 
              type="text" 
              placeholder="Search Pashmina, Kani, Papier-Mache, Sozni, GI, authenticity, care, value..." 
              className="w-full bg-white text-gray-900 rounded-2xl py-5 pl-6 pr-16 outline-none focus:ring-4 focus:ring-brand-primary/50 transition-shadow text-lg placeholder-gray-400 font-medium shadow-2xl"
            />
            <button className="absolute right-3 top-3 bottom-3 w-12 bg-brand-primary rounded-xl flex items-center justify-center text-white hover:bg-brand-secondary transition-colors">
              <FaSearch />
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            {['Pashmina', 'Kani', 'Carpets', 'Papier-Mache', 'Sozni', 'Crewel'].map(term => (
              <span key={term} className="bg-white/10 hover:bg-white/20 cursor-pointer transition-colors px-4 py-2 rounded-full text-white/90 font-medium tracking-wide">
                {term}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. FLAGSHIP CRAFT ATLAS */}
      <section className="py-24 px-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <span className="text-brand-primary font-bold uppercase tracking-widest text-[10px] block mb-2">
                KHCRF CRAFT ATLAS
              </span>
              <h2 className="text-3xl md:text-4xl font-black font-serif text-brand-dark mb-4">Explore Flagship Crafts</h2>
              <p className="text-gray-500 text-lg max-w-2xl">
                Explore Kashmir's principal craft traditions through their materials, techniques, production systems, authenticity, provenance and cultural context.
              </p>
            </div>
            <div className="text-right">
              <div className="text-brand-dark font-black font-serif text-2xl mb-1">08 Flagship Traditions</div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Materials · Techniques · GI · Provenance
              </div>
            </div>
          </div>
          
          <div className="kc-flagship-atlas">
            
            {/* ROW 1 & 2: HERO + SIDES */}
            <Link href="/knowledge/kashmir-crafts/pashmina" className="kc-craft-record kc-craft-record--hero group outline-none">
              <div className="flex items-center justify-between w-full mb-8">
                <div className="kc-craft-family">KASHMIR TEXTILES</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-white/10 px-3 py-1.5 rounded-md">
                  GI PROTECTED
                </div>
              </div>
              <div className="kc-craft-title">Kashmir<br/>Pashmina</div>
              <p className="kc-craft-desc">Fine-fibre textile knowledge shaped through specialist hand processing, spinning, weaving and finishing.</p>
              
              <div className="grid grid-cols-2 gap-8 mb-12 mt-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">MATERIAL</div>
                  <div className="text-sm font-bold text-white">Pashmina fibre</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">TECHNIQUE</div>
                  <div className="text-sm font-bold text-white">Hand spinning · Hand weaving</div>
                </div>
              </div>
              
              <div className="mt-auto">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">KNOWLEDGE THREADS</div>
                <div className="kc-craft-threads">Origin · Fibre · Process · GI · Authenticity · Provenance</div>
                <div className="kc-craft-cta border-t border-white/10 pt-4 mt-2">Explore Craft <span className="text-lg leading-none transition-transform">→</span></div>
              </div>
            </Link>

            <Link href="/knowledge/kashmir-crafts/kani" className="kc-craft-record kc-craft-record--side kc-craft-record--ivory group outline-none">
              <div className="kc-craft-family">KASHMIR TEXTILES</div>
              <div className="kc-craft-title">Kani Shawl</div>
              <p className="text-sm text-gray-500 font-bold tracking-widest uppercase mb-6">
                Kani Weaving <span className="text-gray-300">·</span> Pashmina / Wool <span className="text-gray-300">·</span> GI Protected
              </p>
              
              <div className="mt-auto">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">KNOWLEDGE THREADS</div>
                <div className="kc-craft-threads">Talim · Kani Weaving · GI · Imitations · Provenance</div>
                <div className="kc-craft-cta border-t border-gray-200 pt-4 mt-2">Explore Craft <span className="text-lg leading-none transition-transform">→</span></div>
              </div>
            </Link>

            <Link href="/knowledge/kashmir-crafts/carpets" className="kc-craft-record kc-craft-record--side kc-craft-record--stone group outline-none">
              <div className="kc-craft-family">KASHMIR TEXTILES</div>
              <div className="kc-craft-title">Kashmir Carpets</div>
              <p className="text-sm text-gray-500 font-bold tracking-widest uppercase mb-6">
                Hand Knotting <span className="text-gray-300">·</span> Silk / Wool <span className="text-gray-300">·</span> Provenance
              </p>
              
              <div className="mt-auto">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">KNOWLEDGE THREADS</div>
                <div className="kc-craft-threads">Construction · Materials · Design · Provenance</div>
                <div className="kc-craft-cta border-t border-gray-200 pt-4 mt-2">Explore Craft <span className="text-lg leading-none transition-transform">→</span></div>
              </div>
            </Link>

            {/* ROW 3: EDITORIAL */}
            <Link href="/knowledge/kashmir-crafts/papier-mache" className="kc-craft-record kc-craft-record--third group outline-none">
              <div className="kc-craft-family">DECORATIVE ARTS</div>
              <div className="kc-craft-title !text-2xl">Papier-Mache</div>
              <p className="text-sm text-brand-primary font-bold tracking-widest uppercase my-4">
                Sakhtasazi <span className="text-gray-300">→</span> Naqashi
              </p>
              <div className="mt-auto">
                <div className="kc-craft-threads">Sakhtasazi · Naqashi · Materials · Authenticity</div>
                <div className="kc-craft-cta">Explore <span className="transition-transform">→</span></div>
              </div>
            </Link>

            <Link href="/knowledge/kashmir-crafts/sozni" className="kc-craft-record kc-craft-record--third kc-craft-record--stone group outline-none">
              <div className="kc-craft-family">KASHMIR TEXTILES</div>
              <div className="kc-craft-title !text-2xl">Sozni Embroidery</div>
              <p className="text-[11px] text-gray-500 font-bold tracking-widest uppercase my-4 leading-relaxed">
                Needlework · Labour<br/>Density · Precision
              </p>
              <div className="mt-auto">
                <div className="kc-craft-threads">Needlework · Labour · Quality</div>
                <div className="kc-craft-cta">Explore <span className="transition-transform">→</span></div>
              </div>
            </Link>

            <Link href="/knowledge/kashmir-crafts/crewel" className="kc-craft-record kc-craft-record--third group outline-none">
              <div className="kc-craft-family">KASHMIR TEXTILES</div>
              <div className="kc-craft-title !text-2xl">Crewel &amp; Chain Stitch</div>
              <p className="text-sm text-brand-primary font-bold tracking-widest uppercase my-4">
                Hand / Machine Distinction
              </p>
              <div className="mt-auto">
                <div className="kc-craft-threads">Hand vs Machine · Technique</div>
                <div className="kc-craft-cta">Explore <span className="transition-transform">→</span></div>
              </div>
            </Link>

            {/* ROW 4: WIDE */}
            <Link href="/knowledge/kashmir-crafts/walnut" className="kc-craft-record kc-craft-record--half kc-craft-record--ivory group outline-none">
              <div className="kc-craft-family">WOODCRAFT</div>
              <div className="kc-craft-title">Kashmir Walnut Wood Carving</div>
              
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Walnut Wood</div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Hand Carving</div>
              </div>
              <p className="kc-craft-desc !mb-6 max-w-md">Material identity, carving traditions, ornamental vocabulary and geographic origin.</p>
              
              <div className="mt-auto flex items-center justify-between w-full border-t border-gray-200 pt-4">
                <div className="kc-craft-threads !mb-0 !mt-0">Material · Origin · Technique · Provenance</div>
                <div className="kc-craft-cta shrink-0">Explore <span className="transition-transform">→</span></div>
              </div>
            </Link>

            <Link href="/knowledge/kashmir-crafts/copperware" className="kc-craft-record kc-craft-record--half group outline-none">
              <div className="kc-craft-family">METALCRAFT</div>
              <div className="kc-craft-title">Kashmir Copperware</div>
              
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Copper Forming</div>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500">Engraving</div>
              </div>
              <p className="kc-craft-desc !mb-6 max-w-md">Traditional Kashmir metalwork shaped through forming, engraving and decorative hand-finishing techniques.</p>
              
              <div className="mt-auto flex items-center justify-between w-full border-t border-gray-100 pt-4">
                <div className="kc-craft-threads !mb-0 !mt-0">Production · Finishing · Authenticity</div>
                <div className="kc-craft-cta shrink-0">Explore <span className="transition-transform">→</span></div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* 3. CRAFT INTELLIGENCE COMMAND CENTER */}
      <IntelligenceCommandCenter />

      {/* 4. KNOWLEDGE ARCHITECTURE (BENTO) */}
      <section className="kc-knowledge-system">
          <div className="max-w-7xl mx-auto">
            <div className="kc-knowledge-header">
              <span className="text-brand-primary font-bold uppercase tracking-widest text-[10px] block mb-2">
                KHCRF KNOWLEDGE ARCHITECTURE
              </span>
              <h2 className="text-3xl md:text-4xl font-black font-serif text-brand-dark mb-4">Knowledge System</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Twelve interconnected intelligence domains documenting how Kashmir crafts are made, protected, valued, traded, preserved and understood.
              </p>
              <div className="kc-knowledge-meta">
                12 Domains <span className="text-brand-primary">·</span> 4 Knowledge Layers <span className="text-brand-primary">·</span> One Connected System
              </div>
            </div>
  
            <div className="flex flex-col">
              
              {/* LAYER 01 */}
              <div className="kc-domain-layer">
                <div className="kc-domain-layer-label">
                  <span className="kc-domain-number">01</span>
                  <h3 className="kc-domain-layer-title">Understand The Craft</h3>
                </div>
                <div className="kc-domain-bento">
                  
                  <Link href="/knowledge/kashmir-crafts/crafts" className="kc-domain-card kc-domain-card--wide kc-domain-card--dark group outline-none">
                    <div className="kc-domain-title">CRAFTS</div>
                    <p className="kc-domain-desc">The canonical knowledge record for every Kashmir craft.</p>
                    <div className="kc-domain-metadata">
                      <span className="kc-domain-meta-item">14 craft traditions</span>
                    </div>
                    <div className="kc-domain-cta">Open Craft Library <span className="transition-transform group-hover:translate-x-1">→</span></div>
                  </Link>
  
                  <Link href="/knowledge/kashmir-crafts/processes" className="kc-domain-card kc-domain-card--small group outline-none">
                    <div className="kc-domain-title">PROCESSES</div>
                    <p className="kc-domain-desc">How a craft is actually made.</p>
                    <div className="kc-domain-metadata">
                      <span className="kc-domain-meta-item">Production chains</span>
                    </div>
                    <div className="kc-domain-cta">Trace Production <span className="transition-transform group-hover:translate-x-1">→</span></div>
                  </Link>
  
                  <Link href="/knowledge/kashmir-crafts/techniques" className="kc-domain-card kc-domain-card--small group outline-none">
                    <div className="kc-domain-title">TECHNIQUES</div>
                    <p className="kc-domain-desc font-medium">Kani · Sozni · Aari<br/>Naqashi · Knotting · Carving</p>
                    <div className="kc-domain-metadata">
                      <span className="kc-domain-meta-item mt-2">Technique library</span>
                    </div>
                    <div className="kc-domain-cta">Explore Techniques <span className="transition-transform group-hover:translate-x-1">→</span></div>
                  </Link>
  
                  <Link href="/knowledge/kashmir-crafts/materials" className="kc-domain-card kc-domain-card--wide group outline-none">
                    <div className="kc-domain-title">MATERIALS &amp; TOOLS</div>
                    <p className="kc-domain-desc font-medium">Fibre · Wool · Wood · Metal<br/>Dyes · Looms · Tools</p>
                    <div className="kc-domain-metadata">
                      <span className="kc-domain-meta-item mt-2">Material profiles</span>
                    </div>
                    <div className="kc-domain-cta">Study Materials <span className="transition-transform group-hover:translate-x-1">→</span></div>
                  </Link>
  
                </div>
              </div>
  
              {/* LAYER 02 */}
              <div className="kc-domain-layer">
                <div className="kc-domain-layer-label">
                  <span className="kc-domain-number">02</span>
                  <h3 className="kc-domain-layer-title">Verify &amp; Value</h3>
                </div>
                <div className="kc-domain-bento">
                  
                  <Link href="/knowledge/kashmir-crafts/gi-authenticity" className="kc-domain-card kc-domain-card--wide kc-domain-card--dark group outline-none border-t-2 border-brand-primary">
                    <div className="kc-domain-title">GI &amp; AUTHENTICITY</div>
                    <p className="kc-domain-desc">Understand geographic protection, authorized users, provenance and product-level authenticity.</p>
                    <div className="kc-domain-metadata">
                      <span className="kc-domain-meta-item">GI registry</span>
                      <span className="kc-domain-meta-item">Product verification</span>
                    </div>
                    <div className="kc-domain-cta">Open GI Intelligence <span className="transition-transform group-hover:translate-x-1">→</span></div>
                  </Link>
  
                  <Link href="/knowledge/kashmir-crafts/value" className="kc-domain-card kc-domain-card--small group outline-none">
                    <div className="kc-domain-title">CRAFT VALUE</div>
                    <p className="kc-domain-desc">Cost drivers and fair value intelligence.</p>
                    <div className="kc-domain-cta mt-auto">Understand Value <span className="transition-transform group-hover:translate-x-1">→</span></div>
                  </Link>
  
                  <Link href="/knowledge/kashmir-crafts/trade-integrity" className="kc-domain-card kc-domain-card--full group outline-none !min-h-[140px] flex-row items-center">
                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-6">
                      <div>
                        <div className="kc-domain-title !mb-1">TRADE INTEGRITY</div>
                        <p className="kc-domain-desc !mb-0 text-sm">Check buyer protection records and verified trade entities.</p>
                      </div>
                      <div className="kc-domain-cta shrink-0">Check Trade Integrity <span className="transition-transform group-hover:translate-x-1">→</span></div>
                    </div>
                  </Link>
  
                </div>
              </div>
  
              {/* LAYER 03 */}
              <div className="kc-domain-layer">
                <div className="kc-domain-layer-label">
                  <span className="kc-domain-number">03</span>
                  <h3 className="kc-domain-layer-title">Measure &amp; Assess</h3>
                </div>
                <div className="kc-domain-bento">
                  
                  <Link href="/knowledge/kashmir-crafts/economy" className="kc-domain-card kc-domain-card--medium kc-domain-card--dark group outline-none">
                    <div className="kc-domain-title">CRAFT ECONOMY</div>
                    <p className="kc-domain-desc">Production, export, and sector market metrics.</p>
                    <div className="kc-domain-metadata">
                      <span className="kc-domain-meta-item">Production</span>
                      <span className="kc-domain-meta-item">Export</span>
                      <span className="kc-domain-meta-item">Productivity</span>
                    </div>
                    <div className="kc-domain-cta">View Market Intelligence <span className="transition-transform group-hover:translate-x-1">→</span></div>
                  </Link>
  
                  <Link href="/knowledge/kashmir-crafts/sustainability" className="kc-domain-card kc-domain-card--medium group outline-none">
                    <div className="kc-domain-title">SUSTAINABILITY</div>
                    <p className="kc-domain-desc">Lifecycle emissions, natural dyes, and footprints.</p>
                    <div className="kc-domain-cta mt-auto">Assess Sustainability <span className="transition-transform group-hover:translate-x-1">→</span></div>
                  </Link>
  
                  <Link href="/knowledge/kashmir-crafts/risk" className="kc-domain-card kc-domain-card--full group outline-none !min-h-[140px] flex-row items-center">
                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-6">
                      <div>
                        <div className="kc-domain-title !mb-1">RISK INTELLIGENCE</div>
                        <p className="kc-domain-desc !mb-0 text-sm">Supply chain and market access vulnerabilities.</p>
                      </div>
                      <div className="kc-domain-cta shrink-0">Assess Risk <span className="transition-transform group-hover:translate-x-1">→</span></div>
                    </div>
                  </Link>
  
                </div>
              </div>
  
              {/* LAYER 04 */}
              <div className="kc-domain-layer border-b border-[#0710251a]">
                <div className="kc-domain-layer-label">
                  <span className="kc-domain-number">04</span>
                  <h3 className="kc-domain-layer-title">Learn &amp; Preserve</h3>
                </div>
                
                {/* Overriding the default 6-col grid to the 58/42 split */}
                <div className="kc-domain-bento" style={{ gridTemplateColumns: '58fr 42fr' }}>
                  
                  {/* LEARNING & SKILLS (58%) */}
                  <Link href="/knowledge/kashmir-crafts/learning" className="kc-domain-card kc-domain-card--dark group outline-none">
                    <div className="kc-domain-title">LEARNING &amp; SKILLS</div>
                    <p className="kc-domain-desc">
                      Build knowledge.<br/>Measure progress.<br/>Gain recognition.
                    </p>
                    <div className="kc-domain-metadata mt-auto">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-2">PATHWAYS</div>
                      <span className="kc-domain-meta-item mb-1">Understanding Pashmina</span>
                      <span className="kc-domain-meta-item mb-1">Kani Weaving Fundamentals</span>
                      <span className="kc-domain-meta-item mb-1">Kashmir GI &amp; Authenticity</span>
                      <span className="kc-domain-meta-item">Craft Provenance</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-6">
                      <div className="kc-domain-cta">Explore Learning <span className="transition-transform group-hover:translate-x-1">→</span></div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 text-left sm:text-right leading-tight">
                        Extended learning via<br/>Craftlore CLIE
                      </div>
                    </div>
                  </Link>
  
                  {/* CRAFT CARE (42%) */}
                  <Link href="/knowledge/kashmir-crafts/care" className="kc-domain-card group outline-none">
                    <div className="kc-domain-title">CRAFT CARE</div>
                    <p className="kc-domain-desc">
                      Preserve knowledge<br/>through practice.
                    </p>
                    <div className="kc-domain-metadata mt-auto">
                      <span className="kc-domain-meta-item mb-1">Textile</span>
                      <span className="kc-domain-meta-item mb-1">Carpet</span>
                      <span className="kc-domain-meta-item mb-1">Wood</span>
                      <span className="kc-domain-meta-item mb-1">Papier-Mache</span>
                      <span className="kc-domain-meta-item">Metalwork</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-6">
                      <div className="kc-domain-cta">View Care Guides <span className="transition-transform group-hover:translate-x-1">→</span></div>
                      <div className="text-[9px] font-bold uppercase tracking-widest text-brand-primary/60 text-left sm:text-right leading-tight">
                        KHCRF PRESERVATION<br/>KNOWLEDGE
                      </div>
                    </div>
                  </Link>
  
                </div>
              </div>
  
            </div>
          </div>
        </section>

        {/* 5. GI & AUTHENTICITY */}
      <section className="py-24 px-4 bg-[#fafafa] border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[47%_53%] gap-12 lg:gap-16 items-start">
          
          {/* LEFT: EDITORIAL */}
          <div className="space-y-8">
            <div>
              <span className="text-brand-primary font-bold uppercase tracking-widest text-[10px] block mb-2">
                Protecting Heritage
              </span>
              <h2 className="text-3xl md:text-4xl font-black font-serif text-brand-dark mb-4">GI &amp; Authenticity</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Understand geographic protection, authorized users, product claims and authenticity evidence. KHCRF provides the context needed to interpret GI credentials correctly and verify claims with confidence.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
              <h4 className="font-bold text-brand-dark text-[10px] uppercase tracking-widest">Important Distinction</h4>
              <div className="flex flex-col gap-4 text-sm text-brand-dark font-medium">
                <div>
                  <div className="flex items-center gap-2 mb-1"><FaCheckCircle className="text-gray-300" /> GI Protected Craft</div>
                  <p className="text-gray-500 font-normal pl-6">The craft tradition itself has formal geographical protection.</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1"><FaCheckCircle className="text-gray-300" /> GI Authorized User</div>
                  <p className="text-gray-500 font-normal pl-6">A producer or entity is formally authorized under the relevant GI system.</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1"><FaCheckCircle className="text-gray-300" /> Verified Individual Product</div>
                  <p className="text-gray-500 font-normal pl-6">Evidence connects a specific product to an eligible producer, process and claim.</p>
                </div>
              </div>
              <p className="text-xs text-brand-primary font-medium mt-2 pt-4 border-t border-gray-100 italic">
                These statuses are related, but they are not interchangeable.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6">
                <h4 className="font-bold text-brand-dark text-[10px] uppercase tracking-widest mb-4">What GI Can Establish</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-brand-dark">
                  <div>
                    <span className="font-bold block mb-0.5">Origin</span>
                    <span className="text-gray-500 text-xs">Geographic association.</span>
                  </div>
                  <div>
                    <span className="font-bold block mb-0.5">Protected Identity</span>
                    <span className="text-gray-500 text-xs">Formal recognition.</span>
                  </div>
                  <div>
                    <span className="font-bold block mb-0.5">Authorized Production</span>
                    <span className="text-gray-500 text-xs">Producer eligibility.</span>
                  </div>
                  <div>
                    <span className="font-bold block mb-0.5">Production Standard</span>
                    <span className="text-gray-500 text-xs">Documented characteristics.</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 border-t border-gray-200">
                <h4 className="font-bold text-gray-400 text-[10px] uppercase tracking-widest mb-2">What GI Does Not Automatically Prove</h4>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  A GI name alone does not automatically prove that an individual product is genuine, handmade, correctly represented, or produced by an authorized maker.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="font-bold text-brand-dark text-[10px] uppercase tracking-widest mb-4">Verify With Evidence</h4>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs font-bold text-gray-500 tracking-wide">
                <div className="flex items-center gap-2"><span className="text-brand-primary">01</span> Identify <span className="hidden md:inline text-gray-300">→</span></div>
                <div className="flex items-center gap-2"><span className="text-brand-primary">02</span> GI Status <span className="hidden md:inline text-gray-300">→</span></div>
                <div className="flex items-center gap-2"><span className="text-brand-primary">03</span> Producer <span className="hidden md:inline text-gray-300">→</span></div>
                <div className="flex items-center gap-2"><span className="text-brand-primary">04</span> Product</div>
              </div>
            </div>

          </div>
          
          {/* RIGHT: TOOLS */}
          <div className="flex flex-col gap-4 h-full">
            <ExternalToolCard 
              title="Explore GI-Protected Crafts" 
              desc="Browse the registry of Kashmir crafts holding formal Geographical Indication status." 
              engine="Craftlore CGIS" 
              link="https://www.craftlore.org/cgis/craft_gi_system/listed-crafts" 
            />
            <ExternalToolCard 
              title="Verify a GI Product" 
              desc="Check product credentials against official GI verification records." 
              engine="Craftlore CGIS" 
              link="https://www.craftlore.org/cgis/craft_gi_system/verify-product" 
            />
            <Link href="/knowledge/kashmir-crafts/gi-authenticity" className="group block h-full outline-none">
              <div className="bg-brand-dark border border-brand-dark rounded-2xl p-6 hover:shadow-xl hover:border-brand-primary/50 transition-all duration-300 h-full flex flex-col relative overflow-hidden">
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span> KHCRF KNOWLEDGE GUIDE
                </div>
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">Understand GI Protection</h3>
                <p className="text-sm text-white/70 mb-6 flex-grow leading-relaxed">
                  Learn how GI registration and authorization work in Kashmir.
                </p>
                <div className="bg-white/5 p-4 rounded-xl mt-auto border border-white/10 group-hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between text-sm font-bold text-white group-hover:text-brand-primary transition-colors">
                    Read Guide
                    <span className="text-lg leading-none transform transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CRAFT PROCESS INTELLIGENCE ATLAS */}
      <ProcessAtlas />

      {/* 7. BUYER INTELLIGENCE DESK */}
      <BuyerIntelligence />

      {/* 8. KNOWLEDGE INTO PRACTICE */}
      <KnowledgeIntoPractice />

      {/* 9. EVIDENCE & TRUST LAYER */}
      <EvidenceAndTrust />

      {/* 10. KNOWLEDGE INTO ACTION LAYER */}
      <KnowledgeIntoAction />

    </main>
  );
}