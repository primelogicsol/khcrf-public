'use client';
import React, { useEffect, useState, FormEvent } from 'react';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { masterArtisansHeroFallback } from '@/config/heroFallbacks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowRight, FaSearch, FaUsers, FaCertificate, FaGem, FaFemale, FaStar, FaHandsHelping, FaCity } from 'react-icons/fa';
import api from '@/lib/api';

export default function MasterArtisanRegistryHome() {
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    recognized: 0,
    living: 0,
    historical: 0,
    women: 0,
    emerging: 0,
    apprentices: 0,
    workshops: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/v1/artisans/stats')
      .then(res => {
        if (res.data) setStats(res.data);
      })
      .catch(err => console.error('Error fetching stats:', err))
      .finally(() => setLoading(false));
  }, []);

  const formatStat = (val: number) => {
    if (loading) return '—';
    return val.toLocaleString();
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/master-artisans/artisans?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const gateways = [
    { statKey: 'total', title: 'All Records', desc: 'Search all documented artisans, masters, and related craft records.', link: '/master-artisans/artisans?view=ALL', icon: FaUsers, isPrimary: true },
    { statKey: 'recognized', title: 'Master Artisans', desc: 'Government-recognized and verified master craftspeople.', link: '/master-artisans/artisans?view=MASTER_ARTISAN', icon: FaCertificate, isPrimary: false },
    { statKey: 'living', title: 'Living Masters', desc: 'Masters whose techniques can still be documented.', link: '/master-artisans/artisans?view=LIVING_MASTER', icon: FaGem, isPrimary: false },
    { statKey: 'historical', title: 'Historical Masters', desc: 'Deceased masters documented through archives and records.', link: '/master-artisans/artisans?view=HISTORICAL_MASTER', icon: FaSearch, isPrimary: false },
    { statKey: 'women', title: 'Women Artisans', desc: 'Women whose contributions are often under-recorded.', link: '/master-artisans/artisans?view=WOMEN_ARTISAN', icon: FaFemale, isPrimary: false },
    { statKey: 'emerging', title: 'Emerging Artisans', desc: 'Younger artisans demonstrating significant potential.', link: '/master-artisans/artisans?view=EMERGING_ARTISAN', icon: FaStar, isPrimary: false },
    { statKey: 'apprentices', title: 'Apprentices', desc: 'Artisans currently learning through apprenticeship.', link: '/master-artisans/artisans?view=APPRENTICE', icon: FaHandsHelping, isPrimary: false },
    { statKey: 'workshops', title: 'Workshop Communities', desc: 'Family groups and clusters where production continues.', link: '/master-artisans/artisans?view=WORKSHOP_COMMUNITY', icon: FaCity, isPrimary: false }
  ];

  const crafts = [
    { id: '1046', name: 'Kashmir Chain Stitch Embroidery' },
    { id: '1047', name: 'Kashmir Crewel Embroidery' },
    { id: '902', name: 'Kashmir Gabba' },
    { id: '868', name: 'Kashmir Namda' },
    { id: '1048', name: 'Kashmir Tweed' },
    { id: '869', name: 'Kashmir Wagoo' },
    { id: '903', name: 'Kashmir Willow Bat' },
    { id: '527', name: 'Kashmir Hand-Knotted Carpet' },
    { id: '204', name: 'Kashmir Khatamband' },
    { id: '181', name: 'Kashmir Paper Machie' },
    { id: '182', name: 'Kashmir Walnut Wood Carving' },
    { id: '51', name: 'Kashmir Kani Shawl' },
    { id: '46', name: 'Kashmir Pashmina' },
    { id: '48', name: 'Kashmir Sozani Embroidery' }
  ];

  const districts = [
    'Srinagar', 'Budgam', 'Ganderbal', 'Anantnag', 'Kulgam',
    'Pulwama', 'Shopian', 'Baramulla', 'Bandipora', 'Kupwara'
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#050A1E]">
      {/* Hero Section */}
      <UniversalEditorialHero
        pageKey="master-artisans"
        fallbackConfig={masterArtisansHeroFallback}
      />

      {/* Editorial Intro */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="flex gap-6 items-start max-w-4xl">
          <div className="w-[5px] shrink-0 rounded-full bg-[#D4AF37] self-stretch mt-2 mb-2"></div>
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-[#050A1E] mb-4">
              Global Gateway to Kashmir’s Living Craft Legends
            </h2>
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
              Discover the master artisans, legendary hands, inherited techniques, and living lineages that have shaped Kashmir’s artistic legacy and influenced global handicraft taste, luxury, refinement, and cultural expression for centuries.
            </p>
          </div>
        </div>
      </section>

      {/* Search Command Bar */}
      <section className="px-6 pb-12 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-200">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
              <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Search artisan, KHCRF ID, Pehchan, GI AU, district, award..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-[#F9F9F9] border-none rounded-2xl focus:ring-2 focus:ring-[#D4AF37] outline-none text-[#050A1E] placeholder-gray-500 text-lg transition-all"
              />
            </div>
            <button type="submit" className="w-full md:w-auto px-8 py-4 bg-[#050A1E] text-white rounded-2xl font-medium tracking-wide hover:bg-[#D4AF37] transition-colors shrink-0">
              Search Registry
            </button>
          </form>
        </div>
      </section>

      {/* Registry Intelligence Bar */}
      <section className="px-6 pb-16 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-200 overflow-x-auto">
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-6 md:gap-8 min-w-[600px] lg:min-w-0">
            {[
              { label: 'Total Records', val: stats.total },
              { label: 'Govt Masters', val: stats.recognized },
              { label: 'Living Masters', val: stats.living },
              { label: 'Historical', val: stats.historical },
              { label: 'Women', val: stats.women },
              { label: 'Emerging', val: stats.emerging },
              { label: 'Apprentices', val: stats.apprentices },
              { label: 'Workshops', val: stats.workshops }
            ].map((stat, idx) => (
              <div key={idx} className="flex-1">
                <div className="text-3xl font-serif text-[#D4AF37] mb-2">{formatStat(stat.val)}</div>
                <div className="text-[10px] uppercase tracking-widest text-[#050A1E] font-semibold opacity-70 leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registry Gateways */}
      <section className="px-6 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gateways.map((g, idx) => {
            const val = formatStat((stats as any)[g.statKey] || 0);
            return (
              <Link 
                key={idx} 
                href={g.link}
                className={`relative group rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] border ${
                  g.isPrimary 
                    ? 'bg-[#050A1E] text-white border-[#050A1E]' 
                    : 'bg-white text-[#050A1E] border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-12">
                  <div className={`p-3 rounded-2xl ${g.isPrimary ? 'bg-white/10 text-[#D4AF37]' : 'bg-[#F9F9F9] text-[#D4AF37]'}`}>
                    <g.icon className="w-5 h-5" />
                  </div>
                  <div className={`text-2xl font-serif ${g.isPrimary ? 'text-white' : 'text-[#050A1E]'}`}>
                    {val}
                  </div>
                </div>
                <div>
                  <h3 className={`text-lg font-bold mb-2 ${g.isPrimary ? 'text-white' : 'text-[#050A1E]'}`}>{g.title}</h3>
                  <p className={`text-sm mb-6 ${g.isPrimary ? 'text-white/70' : 'text-gray-500'}`}>{g.desc}</p>
                </div>
                <div className="absolute bottom-6 right-6">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${g.isPrimary ? 'bg-white/10 text-white group-hover:bg-[#D4AF37]' : 'bg-[#F9F9F9] text-[#050A1E] group-hover:bg-[#D4AF37] group-hover:text-white'}`}>
                    <FaArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* How to Use the Registry */}
      <section className="px-6 pb-20 max-w-7xl mx-auto">
        <div className="bg-[#050A1E] text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="mb-12 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif mb-2">From Name to Provenance</h2>
              <div className="text-[#D4AF37] text-sm md:text-base uppercase tracking-widest font-semibold">Search. Verify. Trace.</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 relative z-10">
            
            <div className="group">
              <div className="flex items-center justify-between mb-5">
                <div className="text-sm font-mono text-[#D4AF37]">01</div>
                <div className="text-[10px] uppercase tracking-widest text-white/50 group-hover:text-[#D4AF37] transition-colors flex items-center gap-1">Find the person <FaArrowRight className="w-2 h-2" /></div>
              </div>
              <h3 className="text-sm font-bold mb-3 tracking-widest uppercase text-white">Search</h3>
              <p className="text-sm text-white/60 leading-relaxed">Search by name, KHCRF ID, Pehchan ID, GI Authorized User ID, award, village, district or craft.</p>
            </div>

            <div className="group relative">
              <div className="hidden lg:block absolute -left-4 top-1/2 w-[1px] h-20 bg-white/10 -translate-y-1/2"></div>
              <div className="flex items-center justify-between mb-5">
                <div className="text-sm font-mono text-[#D4AF37]">02</div>
                <div className="text-[10px] uppercase tracking-widest text-white/50 group-hover:text-[#D4AF37] transition-colors flex items-center gap-1">Check evidence <FaArrowRight className="w-2 h-2" /></div>
              </div>
              <h3 className="text-sm font-bold mb-3 tracking-widest uppercase text-white">Verify</h3>
              <p className="text-sm text-white/60 leading-relaxed">Review government recognition, identity records, GI authorization, evidence grade and reconciliation status.</p>
            </div>

            <div className="group relative">
              <div className="hidden lg:block absolute -left-4 top-1/2 w-[1px] h-20 bg-white/10 -translate-y-1/2"></div>
              <div className="flex items-center justify-between mb-5">
                <div className="text-sm font-mono text-[#D4AF37]">03</div>
                <div className="text-[10px] uppercase tracking-widest text-white/50 group-hover:text-[#D4AF37] transition-colors flex items-center gap-1">Follow lineage <FaArrowRight className="w-2 h-2" /></div>
              </div>
              <h3 className="text-sm font-bold mb-3 tracking-widest uppercase text-white">Trace</h3>
              <p className="text-sm text-white/60 leading-relaxed">Explore master-apprentice relationships, descendants, workshops, craft lineages and continuity.</p>
            </div>

            <div className="group relative">
              <div className="hidden lg:block absolute -left-4 top-1/2 w-[1px] h-20 bg-white/10 -translate-y-1/2"></div>
              <div className="flex items-center justify-between mb-5">
                <div className="text-sm font-mono text-[#D4AF37]">04</div>
                <div className="text-[10px] uppercase tracking-widest text-white/50 group-hover:text-[#D4AF37] transition-colors flex items-center gap-1">Explore craft <FaArrowRight className="w-2 h-2" /></div>
              </div>
              <h3 className="text-sm font-bold mb-3 tracking-widest uppercase text-white">Understand</h3>
              <p className="text-sm text-white/60 leading-relaxed">Move from the artisan record to the GI craft tradition and its wider knowledge context.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Why Registry Exists & Evidence Architecture */}
      <section className="py-20 px-6 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-serif text-[#050A1E] mb-8">Why this registry exists</h2>
            
            <div className="flex gap-5 items-start mb-12">
              <div className="w-1 shrink-0 rounded-full bg-[#D4AF37] self-stretch mt-1 mb-1"></div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Kashmir’s craft heritage lives not only in objects, but in people, memory, recognition and transmitted knowledge. Yet artisan records remain fragmented across government archives, award lists, family histories, workshops and generations. The KHCRF Registry brings these fragments together into a persistent, evidence-backed record.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 mb-12">
              <div>
                <h4 className="text-xs font-bold text-[#050A1E] uppercase tracking-widest mb-3">Recognition</h4>
                <p className="text-sm text-gray-600 leading-relaxed">Government awards, registrations and institutional recognition are scattered across decades and agencies. The registry connects them to one canonical artisan identity.</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#050A1E] uppercase tracking-widest mb-3">Preservation</h4>
                <p className="text-sm text-gray-600 leading-relaxed">When a master artisan passes away, undocumented techniques, terminology, memory and lineage knowledge may disappear permanently.</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#050A1E] uppercase tracking-widest mb-3">Verification</h4>
                <p className="text-sm text-gray-600 leading-relaxed">Every significant claim can be traced to its source, allowing the registry to distinguish verified evidence, probable attribution and unresolved history.</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#050A1E] uppercase tracking-widest mb-3">Continuity</h4>
                <p className="text-sm text-gray-600 leading-relaxed">Connecting masters with descendants, apprentices, workshops and successors reveals whether a craft lineage is active, weakening or critically at risk.</p>
              </div>
            </div>

            <hr className="border-gray-100 mb-8" />
            
            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">What the Registry Protects</h4>
              <div className="text-sm font-semibold text-[#050A1E] tracking-widest uppercase mb-4">
                Identity <span className="text-[#D4AF37] mx-1">·</span> Recognition <span className="text-[#D4AF37] mx-1">·</span> Knowledge <span className="text-[#D4AF37] mx-1">·</span> Lineage <span className="text-[#D4AF37] mx-1">·</span> Continuity
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Together, these records create a durable digital memory of the people who carry Kashmir’s living craft heritage.
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-5 bg-[#050A1E] text-white p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-2xl font-serif mb-8 relative z-10">Evidence Architecture</h3>
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0 text-sm font-bold">1</div>
                <div>
                  <div className="font-semibold text-sm">Primary Evidence</div>
                  <div className="text-xs text-white/60">Government registries, GI records, Pehchan, awards, institutional archives</div>
                </div>
              </div>
              <div className="flex justify-center -my-2">
                <div className="w-[1px] h-6 bg-gradient-to-b from-white/20 to-transparent"></div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0 text-sm font-bold">2</div>
                <div>
                  <div className="font-semibold text-sm">Evidence Corroboration</div>
                  <div className="text-xs text-white/60">Identity, craft, geography, lineage and recognition cross-matching</div>
                </div>
              </div>
              <div className="flex justify-center -my-2">
                <div className="w-[1px] h-6 bg-gradient-to-b from-white/20 to-transparent"></div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0 text-sm font-bold">3</div>
                <div>
                  <div className="font-semibold text-sm">Craftlore Evidence Grade</div>
                  <div className="text-xs text-white/60">A+ · A++ · A+++</div>
                </div>
              </div>
              <div className="flex justify-center -my-2">
                <div className="w-[1px] h-6 bg-gradient-to-b from-white/20 to-transparent"></div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0 text-sm font-bold">4</div>
                <div>
                  <div className="font-semibold text-sm">Craftlore Verified / Certified Record</div>
                  <div className="text-xs text-white/60">Independently verified craft status</div>
                </div>
              </div>
              <div className="flex justify-center -my-2">
                <div className="w-[1px] h-6 bg-gradient-to-b from-white/20 to-[#D4AF37]/50"></div>
              </div>
              <div className="flex items-center gap-4 bg-gradient-to-r from-[#D4AF37]/20 to-transparent p-4 rounded-2xl border border-[#D4AF37]/30">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#050A1E] shrink-0 text-sm font-bold">5</div>
                <div>
                  <div className="font-semibold text-[#D4AF37] text-sm">Canonical KHCRF Artisan Record</div>
                  <div className="text-xs text-white/80">A preserved, evidence-backed digital legacy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Human Provenance of Kashmir Craft */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          
          {/* 01 The Hands Must Be Seen */}
          <div className="py-20 px-6 lg:px-12 bg-white">
            <div className="max-w-4xl">
              <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-6">01</div>
              <h2 className="text-3xl md:text-4xl font-serif text-[#050A1E] mb-4">The Hands Must Be Seen</h2>
              <div className="text-sm font-semibold text-[#050A1E] uppercase tracking-widest mb-8">Identity <span className="text-[#D4AF37] mx-2">·</span> Dignity <span className="text-[#D4AF37] mx-2">·</span> Recognition</div>
              
              <div className="text-lg text-gray-700 leading-relaxed mb-8 space-y-6">
                <p>For generations, Kashmir’s crafts have travelled across the world while the hands that created them often remained invisible. Products acquired names, brands, dealers and destinations, while the artisan behind the work disappeared from the story.</p>
                <p>The KHCRF Artisan Registry is designed to reverse that imbalance.</p>
                <p>It gives the maker a persistent identity, connects the artisan to the craft, recognition, lineage and evidence, and ensures that the person carrying the knowledge is not erased when the object enters commerce.</p>
              </div>
              <blockquote className="border-l-2 border-[#D4AF37] pl-6 py-2 text-xl font-serif text-[#050A1E] italic">
                The craft may travel. The name of the hand that created it should travel with it.
              </blockquote>
            </div>
          </div>

          {/* 02 The Artisan Is the Soul of the Craft Passport */}
          <div className="py-20 px-6 lg:px-12 bg-[#F9F9F9] border-y border-gray-100">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="max-w-xl">
                <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-6">02</div>
                <h2 className="text-3xl md:text-4xl font-serif text-[#050A1E] mb-4">The Artisan Is the Soul of the Craft Passport</h2>
                <div className="text-sm font-semibold text-[#050A1E] uppercase tracking-widest mb-8">Person <span className="text-[#D4AF37] mx-2">→</span> Craft <span className="text-[#D4AF37] mx-2">→</span> Object <span className="text-[#D4AF37] mx-2">→</span> Provenance</div>
                
                <div className="text-lg text-gray-700 leading-relaxed mb-8 space-y-6">
                  <p>Every authentic craft object begins with a human hand. A Craft Passport can document materials, technique, place, GI tradition and production history, but its provenance is incomplete without the artisan or workshop behind it.</p>
                  <p>KHCRF therefore places the artisan at the center of Kashmir’s digital provenance architecture. The Artisan Registry identifies the maker. The Craft Passport identifies the object. Together they preserve the relationship between <strong>person, knowledge and creation</strong>.</p>
                </div>
                <blockquote className="border-l-2 border-[#D4AF37] pl-6 py-2 text-xl font-serif text-[#050A1E] italic">
                  The Passport belongs to the object. Its soul begins with the artisan.
                </blockquote>
              </div>

              {/* Passport Diagram */}
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 max-w-md mx-auto w-full">
                <div className="space-y-6">
                  <div className="text-center">
                    <h4 className="text-sm font-bold text-[#050A1E] uppercase tracking-widest">Artisan</h4>
                    <div className="text-xs text-gray-500 mt-1">KHCRF Registry Identity</div>
                  </div>
                  <div className="flex justify-center text-[#D4AF37]"><FaArrowRight className="w-4 h-4 rotate-90" /></div>
                  <div className="text-center">
                    <h4 className="text-sm font-bold text-[#050A1E] uppercase tracking-widest">Craft</h4>
                    <div className="text-xs text-gray-500 mt-1">Tradition · GI · Technique</div>
                  </div>
                  <div className="flex justify-center text-[#D4AF37]"><FaArrowRight className="w-4 h-4 rotate-90" /></div>
                  <div className="text-center">
                    <h4 className="text-sm font-bold text-[#050A1E] uppercase tracking-widest">Object</h4>
                    <div className="text-xs text-gray-500 mt-1">Kashmir Digital Craft Passport</div>
                  </div>
                  <div className="flex justify-center text-[#D4AF37]"><FaArrowRight className="w-4 h-4 rotate-90" /></div>
                  <div className="text-center bg-[#F9F9F9] py-4 rounded-xl border border-gray-100">
                    <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest">Provenance</h4>
                    <div className="text-xs text-gray-600 mt-1 font-medium">A traceable relationship from hand to heritage object</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 03 Counterfeit Must Not Inherit */}
          <div className="py-20 px-6 lg:px-12 bg-[#050A1E] text-white relative overflow-hidden rounded-b-3xl mb-8">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="max-w-5xl relative z-10">
              <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-6">03</div>
              <h2 className="text-3xl md:text-4xl font-serif mb-4">Counterfeit Must Not Inherit the Identity of Real Hands</h2>
              <div className="text-sm font-semibold text-white/80 uppercase tracking-widest mb-10">Authenticity <span className="text-[#D4AF37] mx-2">·</span> Attribution <span className="text-[#D4AF37] mx-2">·</span> Protection</div>
              
              <div className="text-lg text-white/70 leading-relaxed mb-12 space-y-6 max-w-3xl">
                <p>Counterfeit and imitation products do more than compete with authentic craft. They borrow the reputation of traditions, techniques and artisans whose knowledge they do not carry.</p>
                <p>A machine-made imitation should not acquire the cultural identity of a handmade Kashmir craft simply through a label. An anonymous product should not inherit the reputation of a documented master artisan. And counterfeit production should never be attributed to the hands whose lifetime of knowledge created the original tradition.</p>
              </div>
              
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12 border-y border-white/10 py-10">
                <div>
                  <h4 className="text-sm font-bold text-white mb-2">Verified artisan identity</h4>
                  <p className="text-xs text-white/60">Who actually carries the craft knowledge?</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-2">Verified craft relationship</h4>
                  <p className="text-xs text-white/60">Which tradition and technique does the artisan practice?</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-2">Verified object provenance</h4>
                  <p className="text-xs text-white/60">Can a specific product be connected to that artisan or workshop?</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-2">Evidence trail</h4>
                  <p className="text-xs text-white/60">What supports the claim?</p>
                </div>
              </div>

              <blockquote className="border-l-2 border-[#D4AF37] pl-6 py-2 text-2xl font-serif italic text-white max-w-4xl leading-tight">
                Authenticity is not a marketing word. It is a relationship between the craft, the maker, the method and the object.
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Kashmir's Craft Landscape */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl font-serif text-[#050A1E] mb-4">Explore Kashmir’s Craft Landscape</h2>
          <p className="text-gray-600 text-lg">
            Navigate the registry through Kashmir’s 14 GI-recognized craft traditions or the districts where living knowledge, workshops, and artisan lineages continue.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
          
          {/* Left: GI Craft Intelligence (65%) */}
          <div className="w-full lg:w-[65%]">
            <div className="mb-8">
              <h3 className="text-xl font-serif text-[#050A1E] mb-2">14 GI Craft Traditions</h3>
              <p className="text-sm text-gray-500">Explore Kashmir’s globally recognized craft traditions through the artisans who sustain them.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {crafts.map(c => (
                <Link 
                  key={c.id} 
                  href={`/master-artisans/artisans?craftId=${c.id}`} 
                  className="group relative bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#D4AF37] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[120px]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-[15px] font-semibold text-[#050A1E] leading-tight pr-4">{c.name}</h4>
                    <FaArrowRight className="w-3 h-3 text-gray-300 group-hover:text-[#D4AF37] transition-colors shrink-0 mt-1" />
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px] uppercase tracking-widest text-[#050A1E] bg-gray-100 px-2 py-1 rounded-md font-bold">GI {c.id}</span>
                    <span className="text-[11px] text-gray-400 font-medium">— records</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: District Intelligence (35%) */}
          <div className="w-full lg:w-[35%] bg-[#050A1E] rounded-3xl p-8 md:p-10 shadow-xl">
            <div className="mb-8">
              <h3 className="text-xl font-serif text-white mb-2">District Intelligence</h3>
              <p className="text-sm text-white/60">Discover where craft knowledge, master artisans, lineages and workshops continue across Kashmir.</p>
            </div>
            
            <div className="flex flex-col">
              {districts.map((d, i) => (
                <Link 
                  key={d} 
                  href={`/master-artisans/artisans?district=${d.toUpperCase()}`} 
                  className="group flex items-center justify-between py-4 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors -mx-4 px-4 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-[#D4AF37]">{(i + 1).toString().padStart(2, '0')}</span>
                    <span className="text-sm font-medium text-white group-hover:text-[#D4AF37] transition-colors">{d}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-white/40">—</span>
                    <FaArrowRight className="w-3 h-3 text-white/20 group-hover:text-[#D4AF37] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Final Action Band */}
      <section className="bg-white border-t border-gray-200 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[#050A1E] font-serif text-lg">
            Preserving Kashmir's Craft Legacy
          </div>
          <div className="flex gap-4">
            <Link href="/master-artisans/artisans" className="px-6 py-2 bg-[#F9F9F9] border border-gray-200 text-[#050A1E] text-sm font-medium rounded-full hover:border-[#D4AF37] transition-colors">
              Explore Full Registry
            </Link>
            <Link href="/nominate" className="px-6 py-2 bg-[#050A1E] text-white text-sm font-medium rounded-full hover:bg-[#D4AF37] transition-colors">
              Nominate an Artisan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
