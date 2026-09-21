import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaSearch, FaUserPlus, FaUsers, FaCertificate, FaGem, FaFemale, FaStar, FaHandsHelping, FaCity } from 'react-icons/fa';
import api from '@/lib/api';

export default function MasterArtisanRegistryHome() {
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

  useEffect(() => {
    api.get('/v1/artisans/stats')
      .then(res => {
        if (res.data) setStats(res.data);
      })
      .catch(err => console.error('Error fetching stats:', err))
      .finally(() => setLoading(false));
  }, []);

  const gateways = [
    { title: 'All Records', desc: 'Search all documented artisans, masters, apprentices, lineages and related craft records across the 14 GI craft traditions.', link: '/master-artisans/artisans?view=ALL', icon: FaUsers },
    { title: 'Master Artisans', desc: 'Government-recognized and independently verified master craftspeople whose work represents exceptional skill, knowledge and continuity.', link: '/master-artisans/artisans?view=MASTER_ARTISAN', icon: FaCertificate },
    { title: 'Living Masters', desc: 'Living master artisans whose techniques, memory and experience can still be documented, transmitted and supported.', link: '/master-artisans/artisans?view=LIVING_MASTER', icon: FaGem },
    { title: 'Historical Masters', desc: 'Deceased and historical master artisans documented through government awards, archives, institutional records and lineage evidence.', link: '/master-artisans/artisans?view=HISTORICAL_MASTER', icon: FaSearch },
    { title: 'Women Artisans', desc: 'Women artisans across weaving, embroidery, finishing, production and other craft practices whose contributions are often under-recorded.', link: '/master-artisans/artisans?view=WOMEN_ARTISAN', icon: FaFemale },
    { title: 'Emerging Artisans', desc: 'Younger or developing artisans demonstrating significant technical capability and potential for future mastery.', link: '/master-artisans/artisans?view=EMERGING_ARTISAN', icon: FaStar },
    { title: 'Apprentices', desc: 'Artisans currently learning through master-apprentice, family or workshop-based transmission.', link: '/master-artisans/artisans?view=APPRENTICE', icon: FaHandsHelping },
    { title: 'Workshop Communities', desc: 'Workshops, family groups and craft clusters where knowledge, production and apprenticeship continue collectively.', link: '/master-artisans/artisans?view=WORKSHOP_COMMUNITY', icon: FaCity }
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
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Hero Section */}
      <section className="bg-[#3E2723] text-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif mb-6 uppercase tracking-widest text-[#D4AF37]">Master Artisan Registry</h1>
          <h2 className="text-2xl font-light mb-8">Preserving the people behind Kashmir's craft heritage</h2>
          <div className="max-w-3xl text-gray-300 leading-relaxed space-y-4">
            <p>The KHCRF Master Artisan Registry documents the artisans, master craftspeople, award recipients, apprentices and craft lineages who sustain Kashmir's traditional craft knowledge.</p>
            <p>The registry brings together government awards, artisan registrations, Pehchan records, GI Authorized User records, historical documentation, lineage information and KHCRF verification into one evidence-based public record.</p>
            <p>Its purpose is not simply to list artisans, but to preserve identity, recognition, lineage and continuity so that master craftsmanship is not lost when records disappear, workshops close or generations change.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-[#3E2723]/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-serif text-[#D4AF37] mb-2">{loading ? '-' : stats.total}</div>
              <div className="text-xs uppercase tracking-widest text-[#3E2723] font-bold">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-[#D4AF37] mb-2">{loading ? '-' : stats.recognized}</div>
              <div className="text-xs uppercase tracking-widest text-[#3E2723] font-bold">Government-Recognized Masters</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-[#D4AF37] mb-2">{loading ? '-' : stats.living}</div>
              <div className="text-xs uppercase tracking-widest text-[#3E2723] font-bold">Living Masters</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-[#D4AF37] mb-2">{loading ? '-' : stats.historical}</div>
              <div className="text-xs uppercase tracking-widest text-[#3E2723] font-bold">Historical Masters</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-[#D4AF37] mb-2">{loading ? '-' : stats.women}</div>
              <div className="text-xs uppercase tracking-widest text-[#3E2723] font-bold">Women Artisans</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-[#D4AF37] mb-2">{loading ? '-' : stats.emerging}</div>
              <div className="text-xs uppercase tracking-widest text-[#3E2723] font-bold">Emerging Artisans</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-[#D4AF37] mb-2">{loading ? '-' : stats.apprentices}</div>
              <div className="text-xs uppercase tracking-widest text-[#3E2723] font-bold">Apprentices</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-[#D4AF37] mb-2">{loading ? '-' : stats.workshops}</div>
              <div className="text-xs uppercase tracking-widest text-[#3E2723] font-bold">Workshop Communities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Gateways */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif text-[#3E2723] mb-12 text-center">Explore the Registry</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {gateways.map((g, idx) => (
            <Link key={idx} href={g.link} className="bg-white p-8 border border-[#3E2723]/10 rounded shadow-sm hover:shadow-md hover:border-[#D4AF37] transition-all group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#3E2723]/5 rounded-full text-[#3E2723] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
                  <g.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#3E2723]">{g.title}</h3>
              </div>
              <p className="text-gray-600 mb-6 min-h-[60px]">{g.desc}</p>
              <div className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-2 group-hover:gap-4 transition-all">
                Explore {g.title} <FaArrowRight />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Registry Exists & KHCRF Difference */}
      <section className="bg-white py-20 px-6 border-y border-[#3E2723]/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-serif text-[#3E2723] mb-10">Why this registry exists</h2>
              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-[#3E2723] uppercase tracking-wider mb-2">Recognition</h4>
                  <p className="text-gray-600">Government awards and registrations are scattered across decades and agencies. The registry consolidates them into one record.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#3E2723] uppercase tracking-wider mb-2">Preservation</h4>
                  <p className="text-gray-600">When a master artisan dies, undocumented techniques, terminology and lineage knowledge can disappear with them.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#3E2723] uppercase tracking-wider mb-2">Verification</h4>
                  <p className="text-gray-600">Each important fact is linked to its source so the registry distinguishes evidence from assumption.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#3E2723] uppercase tracking-wider mb-2">Continuity</h4>
                  <p className="text-gray-600">The registry connects masters with descendants, apprentices and workshops to show whether a craft lineage is continuing or at risk.</p>
                </div>
              </div>
            </div>
            <div className="bg-[#FAF9F6] p-10 rounded border border-[#3E2723]/10">
              <h2 className="text-3xl font-serif text-[#3E2723] mb-8">What makes KHCRF's registry different</h2>
              <h4 className="font-bold text-[#3E2723] uppercase tracking-wider mb-4">Evidence-Based Records</h4>
              <p className="text-gray-600 mb-6">Every record may connect to:</p>
              <ul className="space-y-3 text-gray-700 font-medium mb-8">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" /> Government Award Records</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" /> Pehchan ID</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" /> Government Artisan Registration</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" /> GI Authorized User Records</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" /> Historical Sources</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" /> KHCRF Verification</li>
              </ul>
              <div className="border-l-4 border-[#D4AF37] pl-4 italic text-gray-600">
                "KHCRF preserves both the canonical record and the original source assertions when government records disagree."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scope and Districts */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-serif text-[#3E2723] mb-8">Registry Craft Scope</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {crafts.map(c => (
                <Link key={c.id} href={/master-artisans/artisans?craftId=} className="text-sm text-gray-600 hover:text-[#D4AF37] border-b border-transparent hover:border-[#D4AF37] pb-1 w-max transition-colors">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-serif text-[#3E2723] mb-8">Explore by District</h2>
            <div className="flex flex-wrap gap-3">
              {districts.map(d => (
                <Link key={d} href={/master-artisans/artisans?district=} className="px-4 py-2 bg-white border border-[#3E2723]/20 rounded text-sm text-[#3E2723] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all">
                  {d}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#3E2723] text-white py-24 text-center px-6">
        <h2 className="text-3xl font-serif mb-8 text-[#D4AF37]">Ready to explore?</h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <Link href="/master-artisans/artisans" className="px-8 py-4 bg-[#D4AF37] text-white font-bold uppercase tracking-widest text-sm hover:bg-white hover:text-[#3E2723] transition-colors rounded">
            Explore the Registry
          </Link>
          <Link href="/nominate" className="px-8 py-4 border border-[#D4AF37] text-[#D4AF37] font-bold uppercase tracking-widest text-sm hover:bg-[#D4AF37] hover:text-white transition-colors rounded">
            Nominate an Artisan
          </Link>
        </div>
      </section>
    </div>
  );
}
