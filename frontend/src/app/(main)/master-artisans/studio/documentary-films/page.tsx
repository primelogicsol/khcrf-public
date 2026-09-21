'use client';
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { documentaryFilmsHeroFallback } from '@/config/heroFallbacks';

export default function DocumentaryFilms() {
  const [allFilms, setAllFilms] = useState<any[]>([
    {
      slug: "threads-of-eternity",
      title: "Threads of Eternity",
      subtitle: "The Making and Memory of Kashmir Pashmina",
      dur: "42 Minutes",
      durationMin: 42,
      tag: "Pashmina",
      img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop",
      desc: "A long-form exploration of the people, skills, materials, and generational knowledge behind Kashmir Pashmina. The film follows the journey from fibre preparation and hand spinning to weaving, finishing, embroidery, and market circulation.",
      accessionId: "KHCRF-DF-2026-001",
      year: "2026",
      language: "Kashmiri and Urdu",
      subtitles: "Yes",
      artisan: "Master Ali Mohammad",
      district: "Srinagar and Budgam",
      director: "Farooq Mir",
      transcriptPreview: "When we comb the pashm, we do it in early mornings. The humidity in the air ensures the fibers do not break...",
      craft: "Pashmina",
      theme: "Artisan Life",
      status: "Published",
      hasTranscript: "Yes",
      themes: ["Pashmina", "Women Artisans", "Hand Spinning", "Weaving", "Craft Lineage", "Authenticity"]
    },
    {
      slug: "forty-winters",
      title: "Forty Winters at the Loom",
      subtitle: "A Carpet Master’s Lifetime of Knotting and Memory",
      dur: "38 Minutes",
      durationMin: 38,
      tag: "Hand-Knotted Carpet",
      img: "/assets/images/studio_demo_forty_winters.jpg",
      desc: "An elderly carpet master reflects on four decades inside Srinagar karkhanas, documenting the discipline of knotting, the reading of talim, workshop relationships, changing wages, and the future of apprenticeship.",
      accessionId: "KHCRF-DF-2026-002",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Ghulam Hassan",
      district: "Srinagar",
      director: "Aamir Bhat",
      transcriptPreview: "The knotting speed is not about speed of hands, it is about the geometry in the mind. If the pattern is memorized, the hands are automatic...",
      craft: "Hand-Knotted Carpet",
      theme: "Workshop Culture",
      status: "Published",
      hasTranscript: "Yes",
      themes: ["Carpet Weaving", "Master Artisan", "Workshop Life", "Talim", "Apprenticeship", "Labour"]
    },
    {
      slug: "kani-language-loom",
      title: "Kani: The Language of the Loom",
      subtitle: "Design, Discipline, and Intergenerational Knowledge in Kani Weaving",
      dur: "35 Minutes",
      durationMin: 35,
      tag: "Kani Shawl",
      img: "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=600&auto=format&fit=crop",
      desc: "A detailed record of Kani weaving, from design interpretation and loom preparation to the controlled movement of small wooden kanis. The film examines how complex visual patterns are translated into a disciplined weaving language.",
      accessionId: "KHCRF-DF-2026-003",
      year: "2026",
      language: "Kashmiri and Urdu",
      subtitles: "Yes",
      artisan: "Mustafa Loom",
      district: "Kanihama, Budgam",
      director: "Fahad Malik",
      transcriptPreview: null,
      craft: "Kani Shawl",
      theme: "Craft Lineage",
      status: "Documentary Concept",
      hasTranscript: "No",
      themes: ["Kani Weaving", "Design Systems", "Loom Practice", "Apprenticeship", "GI Craft", "Heritage Skills"]
    },
    {
      slug: "painted-surface",
      title: "The Painted Surface",
      subtitle: "The Living Tradition of Kashmir Papier-Mâché",
      dur: "31 Minutes",
      durationMin: 31,
      tag: "Papier-Mâché",
      img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop",
      desc: "The film follows the transformation of prepared forms into painted cultural objects through surface preparation, naqashi, motif composition, detailing, and finishing. It also documents the economic challenges faced by contemporary papier-mâché workshops.",
      accessionId: "KHCRF-DF-2026-004",
      year: "2026",
      language: "Urdu and Kashmiri",
      subtitles: "Yes",
      artisan: "Fayaz Ahmad",
      district: "Srinagar",
      director: "Sajad Dar",
      transcriptPreview: "Using ground stone pigments and real gold leaf is the signature of old masters. Synthetic colors will fade in fifty years, gold never does...",
      craft: "Papier-Mâché",
      theme: "Artisan Life",
      status: "In Editorial Review",
      hasTranscript: "Yes",
      themes: ["Papier-Mâché", "Naqashi", "Motifs", "Workshop Economy", "Family Lineage", "Market Change"]
    },
    {
      slug: "carving-memory",
      title: "Carving Memory",
      subtitle: "Walnut Wood Workshops of Downtown Srinagar",
      dur: "36 Minutes",
      durationMin: 36,
      tag: "Walnut Wood Carving",
      img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop",
      desc: "A study of walnut wood carving as material knowledge, workshop discipline, and architectural memory. Artisans explain wood selection, seasoning, drawing, carving depth, tool control, and the changing demand for traditional forms.",
      accessionId: "KHCRF-DF-2026-005",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Tariq Ahmad",
      district: "Srinagar",
      director: "Zehra Malik",
      transcriptPreview: null,
      craft: "Walnut Wood Carving",
      theme: "Traditional Techniques",
      status: "Field Recorded",
      hasTranscript: "No",
      themes: ["Walnut Wood", "Carving", "Traditional Tools", "Architecture", "Workshop Culture", "Material Knowledge"]
    },
    {
      slug: "copper-fire-rhythm",
      title: "Copper, Fire, and Rhythm",
      subtitle: "The Craft Communities Behind Kashmir Copperware",
      dur: "29 Minutes",
      durationMin: 29,
      tag: "Copperware",
      img: "https://images.unsplash.com/photo-1595273670150-bd0c3c6ca68e?w=600&auto=format&fit=crop",
      desc: "The documentary records the sounds, heat, tools, engraving systems, and specialized labour involved in Kashmir copperware. It also examines the relationship between domestic use, ceremonial objects, tourism, and contemporary markets.",
      accessionId: "KHCRF-DF-2026-006",
      year: "2026",
      language: "Kashmiri and Urdu",
      subtitles: "Yes",
      artisan: "Ustad Ghulam",
      district: "Srinagar",
      director: "Bilal Jan",
      transcriptPreview: null,
      craft: "Copperware",
      theme: "Workshop Culture",
      status: "Research in Progress",
      hasTranscript: "No",
      themes: ["Copperware", "Engraving", "Metalwork", "Workshop Sound", "Traditional Markets", "Artisan Communities"]
    },
    {
      slug: "passing-the-needle",
      title: "Passing the Needle",
      subtitle: "Women, Home-Based Work, and Sozni Embroidery",
      dur: "33 Minutes",
      durationMin: 33,
      tag: "Sozni Embroidery",
      img: "/assets/images/passing_the_needle.jpg",
      desc: "Mothers, daughters, and home-based artisans describe how Sozni skills are learned through observation, repetition, correction, and memory. The film documents both the artistry and the often-invisible labour behind embroidered shawls.",
      accessionId: "KHCRF-DF-2026-007",
      year: "2026",
      language: "Kashmiri",
      subtitles: "Yes",
      artisan: "Bashir Ahmad",
      district: "Srinagar and Budgam",
      director: "Tariq Qadri",
      transcriptPreview: "Sozni is like silent prayer. You must hold the needle with minimal pressure, pulling silk loops in perfect parallel lines...",
      craft: "Sozni Embroidery",
      theme: "Women Artisans",
      status: "Published",
      hasTranscript: "Yes",
      themes: ["Sozni", "Women Artisans", "Home-Based Work", "Intergenerational Learning", "Invisible Labour", "Embroidery"]
    },
    {
      slug: "felted-ground",
      title: "Felted Ground",
      subtitle: "The Making, Decline, and Revival of Kashmir Namda",
      dur: "27 Minutes",
      durationMin: 27,
      tag: "Namda",
      img: "https://images.unsplash.com/photo-1565192647048-f997ded87958?w=600&auto=format&fit=crop",
      desc: "A field-based documentary examining wool preparation, felting, washing, drying, surface decoration, and the decline of traditional Namda production. It also records contemporary revival and design initiatives.",
      accessionId: "KHCRF-DF-2026-008",
      year: "2026",
      language: "Kashmiri and Urdu",
      subtitles: "Yes",
      artisan: "Rural Felters",
      district: "Anantnag and Srinagar",
      director: "Sana Shah",
      transcriptPreview: null,
      craft: "Namda",
      theme: "Conservation",
      status: "Archive Preview",
      hasTranscript: "No",
      themes: ["Namda", "Felting", "Wool", "Rural Production", "Revival", "Design Adaptation"]
    },
    {
      slug: "workshop-and-world",
      title: "The Workshop and the World",
      subtitle: "How Kashmir Crafts Move from Artisan to Global Market",
      dur: "48 Minutes",
      durationMin: 48,
      tag: "Multi-Craft",
      img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop",
      desc: "A systems-oriented documentary tracing how craft products move through artisans, manufacturers, exporters, retailers, digital marketplaces, collectors, and institutions. The film examines value distribution, authenticity, branding, logistics, and market access.",
      accessionId: "KHCRF-DF-2026-009",
      year: "2026",
      language: "English, Urdu, and Kashmiri",
      subtitles: "Yes",
      artisan: "Multi-Craft Guilds",
      district: "Srinagar",
      director: "KHCRF Editorial",
      transcriptPreview: "Every craft supports another. The carver needs the tool smith, the weaver needs the natural dyer...",
      craft: "Willow Wicker",
      theme: "Markets and Trade",
      status: "Published",
      hasTranscript: "Yes",
      themes: ["Craft Economy", "Exports", "Value Chain", "Global Markets", "Authenticity", "Artisan Income"]
    },
    {
      slug: "learning-without-schools",
      title: "Learning Without Schools",
      subtitle: "The Ustad–Shagird Tradition in Kashmir’s Craft Workshops",
      dur: "34 Minutes",
      durationMin: 34,
      tag: "Multi-Craft",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop",
      desc: "The film documents how craft knowledge is transmitted outside formal classrooms. Masters and apprentices discuss discipline, observation, repetition, trust, correction, responsibility, and the changing viability of workshop-based learning.",
      accessionId: "KHCRF-DF-2026-010",
      year: "2026",
      language: "Kashmiri and Urdu",
      subtitles: "Yes",
      artisan: "Ustad Apprentice Guilds",
      district: "Srinagar and Budgam",
      director: "Mehran Qazi",
      transcriptPreview: null,
      craft: "Crewel Embroidery",
      theme: "Apprenticeship",
      status: "Field Documentation Planned",
      hasTranscript: "No",
      themes: ["Ustad–Shagird", "Apprenticeship", "Informal Education", "Skill Transmission", "Workshop Culture", "Youth"]
    },
    {
      slug: "craft-through-conflict",
      title: "Craft Through Conflict",
      subtitle: "Workshop Resilience During Political and Economic Instability",
      dur: "44 Minutes",
      durationMin: 44,
      tag: "Multi-Craft",
      img: "/assets/images/studio_demo_conflict.jpg",
      desc: "Artisans and workshop owners describe how instability, closures, disrupted supply chains, weakened markets, and uncertainty affected production and livelihoods. The film focuses on endurance, adaptation, and the continuity of craft knowledge.",
      accessionId: "KHCRF-DF-2026-011",
      year: "2026",
      language: "Kashmiri and Urdu",
      subtitles: "Yes",
      artisan: "Downtown Woodcarvers",
      district: "Kashmir Valley",
      director: "Zehra Malik",
      transcriptPreview: "Artisans describe the challenges of keeping the workshops open during times of instability...",
      craft: "Walnut Wood Carving",
      theme: "Conservation",
      status: "In Editorial Review",
      hasTranscript: "Yes",
      themes: ["Resilience", "Conflict", "Livelihoods", "Workshop Closures", "Supply Chains", "Cultural Continuity"]
    },
    {
      slug: "future-in-their-hands",
      title: "The Future in Their Hands",
      subtitle: "Young Artisans Reimagining Kashmir’s Craft Heritage",
      dur: "39 Minutes",
      durationMin: 39,
      tag: "Multi-Craft",
      img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop",
      desc: "Young artisans, designers, researchers, and entrepreneurs discuss how traditional skills can remain relevant without losing authenticity. The film explores digital tools, new markets, design experimentation, sustainability, documentation, and craft education.",
      accessionId: "KHCRF-DF-2026-012",
      year: "2026",
      language: "Kashmiri, Urdu, and English",
      subtitles: "Yes",
      artisan: "Emerging Designers Guild",
      district: "Kashmir Valley",
      director: "KHCRF Editorial",
      transcriptPreview: null,
      craft: "Chain Stitch",
      theme: "Innovation",
      status: "Documentary Concept",
      hasTranscript: "No",
      themes: ["Emerging Artisans", "Innovation", "Digital Markets", "Sustainability", "Design", "Future of Craft"]
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
const API_BASE_URL = getBaseUrlNoApi();
    fetch(`${API_BASE_URL}/api/v1/knowledge?entityType=KNOWLEDGE_OBJECT&take=100`).catch(() => ({ ok: false, json: () => Promise.resolve([]) }))
      .then(res => { if (!res.ok) return []; return res.json(); })
      .then(data => {
        const items = (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])).filter((d: any) => d.metadata?.kind === 'STUDIO_MEDIA' && d.metadata?.type === 'Documentary').map((d: any) => ({
          title: d.title,
          subtitle: d.metadata.subtitle || d.title,
          dur: d.metadata.dur || '45 Minutes',
          durationMin: d.metadata.durationMin || 45,
          tag: d.metadata.tag || 'Featured Film',
          img: d.metadata.img || '/assets/images/studio/films/film_1.jpg',
          desc: d.summary || d.metadata.desc,
          slug: d.slug,
          accessionId: d.metadata.accessionId || `KHCRF-DF-2026-${d.slug.toUpperCase()}`,
          year: d.metadata.year || '2026',
          language: d.metadata.language || 'Kashmiri',
          subtitles: d.metadata.subtitles || 'Yes',
          artisan: d.metadata.artisan || 'Featured Artisan',
          district: d.metadata.district || 'Kashmir',
          director: d.metadata.director || 'KHCRF',
          transcriptPreview: d.metadata.transcriptPreview || 'Archived transcript snippet is loaded under support request.',
          craft: d.metadata.craft || 'Pashmina',
          theme: d.metadata.theme || 'Artisan Life',
          status: d.metadata.status || 'Published',
          hasTranscript: d.metadata.hasTranscript || 'No',
          themes: d.metadata.themes || ["Kashmir", "Craft"]
        }));
        if (items.length > 0) {
          setAllFilms(items);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // View state switch
  const [currentView, setCurrentView] = useState<'cards' | 'list' | 'index'>('cards');

  // Multi-dimensional filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCraft, setSelectedCraft] = useState('All Crafts');
  const [selectedTheme, setSelectedTheme] = useState('All Themes');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedDuration, setSelectedDuration] = useState('All Durations');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedSort, setSelectedSort] = useState('Featured');

  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilm, setActiveFilm] = useState<any>(null);
  const itemsPerPage = 6;

  // Filtering
  const filteredFilms = allFilms.filter(f => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchText = `${f.title} ${f.subtitle || ''} ${f.desc} ${f.artisan} ${f.accessionId} ${f.director} ${f.craft} ${f.theme} ${f.district}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    if (selectedCraft !== 'All Crafts') {
      if (f.craft !== selectedCraft) return false;
    }
    if (selectedTheme !== 'All Themes') {
      if (f.theme !== selectedTheme) return false;
    }
    if (selectedLocation !== 'All Locations') {
      const dist = f.district.toLowerCase();
      const sel = selectedLocation.toLowerCase();
      if (!dist.includes(sel)) return false;
    }
    if (selectedDuration !== 'All Durations') {
      const min = f.durationMin;
      if (selectedDuration === 'Under 15 Minutes' && min >= 15) return false;
      if (selectedDuration === '15–30 Minutes' && (min < 15 || min > 30)) return false;
      if (selectedDuration === '30–60 Minutes' && (min < 30 || min > 60)) return false;
      if (selectedDuration === 'Over 60 Minutes' && min <= 60) return false;
    }
    if (selectedStatus !== 'All Statuses') {
      if (selectedStatus === 'Transcript Available') {
        if (f.hasTranscript !== 'Yes') return false;
      } else if (f.status !== selectedStatus) {
        return false;
      }
    }
    if (selectedLanguage !== 'All Languages') {
      if (selectedLanguage === 'English Subtitles Available') {
        if (f.subtitles !== 'Yes') return false;
      } else if (!f.language.toLowerCase().includes(selectedLanguage.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  // Sorting
  const sortedFilms = [...filteredFilms].sort((a, b) => {
    if (selectedSort === 'Newest') {
      return parseInt(b.year) - parseInt(a.year);
    }
    if (selectedSort === 'Oldest') {
      return parseInt(a.year) - parseInt(b.year);
    }
    if (selectedSort === 'Duration') {
      return b.durationMin - a.durationMin;
    }
    if (selectedSort === 'A–Z') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedFilms.length / itemsPerPage);
  const paginatedFilms = sortedFilms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveFilm(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24 animate-fadeIn">
      {/* Membership / Archival Request Modal */}
      {activeFilm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-sm" onClick={() => setActiveFilm(null)}></div>
          <div className="relative z-10 bg-[#3E2723] border border-[#D4AF37]/50 max-w-xl w-full p-8 md:p-10 shadow-2xl text-center max-h-[90vh] overflow-y-auto custom-scrollbar" role="dialog" aria-modal="true">
            <div className="w-14 h-14 mx-auto bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-serif text-[#D4AF37] mb-2">Request Archival Access</h2>
            <p className="text-white text-base md:text-lg font-serif italic mb-4">
              "{activeFilm.title}" &bull; Record {activeFilm.accessionId}
            </p>
            <p className="text-white/80 font-light mb-6 leading-relaxed text-sm">
              This record is part of the KHCRF Visual Heritage Archive. Content is currently in state <strong>"{activeFilm.status}"</strong>. To request research access to transcripts, draft recordings, field briefs or workshop logs, please contact the archival team.
            </p>

            <hr className="border-white/10 mb-6" />

            <div className="text-left mb-6 px-4 md:px-8">
              <h3 className="text-[#D4AF37] text-xs uppercase tracking-widest font-bold mb-4 text-center">Archive Parameters</h3>
              <div className="space-y-2 text-xs text-white/90 font-mono">
                <div><span className="text-white/50">ACCESSION NO  :</span> {activeFilm.accessionId}</div>
                <div><span className="text-white/50">CRAFT SECTOR  :</span> {activeFilm.craft}</div>
                <div><span className="text-white/50">RECORD STATUS :</span> {activeFilm.status}</div>
                <div><span className="text-white/50">RECORDED DURATION :</span> {activeFilm.dur}</div>
              </div>
            </div>

            <hr className="border-white/10 mb-6" />

            <div className="flex flex-col gap-4 mb-6">
              <div className="flex justify-center">
                <Link href="/about/memberships" className="bg-[#D4AF37] text-[#3E2723] hover:bg-white px-8 py-4 font-bold uppercase tracking-widest text-sm transition-colors w-full md:w-auto min-w-[250px] flex items-center justify-center font-mono">
                  Become a Research Member
                </Link>
              </div>
              <button onClick={() => setActiveFilm(null)} className="text-white/40 hover:text-white mt-2 text-xs uppercase tracking-widest transition-colors font-light font-mono">
                Close Record View
              </button>
            </div>

            <hr className="border-white/10 mb-6" />

            <p className="text-white/40 text-[10px] uppercase tracking-widest leading-relaxed">
              Preserving Kashmir's living craft knowledge through systematic visual registry.
            </p>
          </div>
        </div>
      )}

      {/* Hero section */}
      <UniversalEditorialHero pageKey="documentary-films" fallbackConfig={documentaryFilmsHeroFallback as any} />

      <div className="container-fluid mx-auto px-4 md:px-10 py-12 max-w-7xl animate-fadeIn">
        
        {/* Introductory Statement Block */}
        <div className="bg-[#3E2723]/5 border-l-4 border-[#3E2723] p-8 mb-12 rounded-r-xs max-w-5xl">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-serif">
            KHCRF Documentary Films preserve the wider context surrounding Kashmir’s craft heritage. Each film goes beyond the finished object to document the artisan, family, workshop, community, material, process, market, and cultural environment from which the craft emerges.
          </p>
          <p className="text-gray-500 text-xs mt-3 uppercase tracking-widest font-bold">
            The collection is intended for artisans, researchers, universities, museums, cultural institutions, policymakers, educators, collectors, and the public.
          </p>
        </div>

        {/* Featured Documentary Section */}
        <section className="bg-white border-4 border-[#3E2723] p-8 md:p-10 mb-16 relative shadow-md">
          <div className="absolute top-0 right-0 bg-[#3E2723] text-[#D4AF37] px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
            Featured Archival Record
          </div>
          
          <div className="max-w-4xl">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold block mb-1">
              Archive Record: KHCRF-DF-2026-001
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3E2723] leading-tight mb-2">
              Threads of Eternity
            </h2>
            <h3 className="text-base md:text-lg font-serif italic text-gray-500 mb-4">
              The Making and Memory of Kashmir Pashmina
            </h3>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-6 font-sans">
              A documentary record following the material, human, and cultural journey of Pashmina—from fibre preparation and hand spinning to weaving, embroidery, finishing, authenticity, and market circulation.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {["42 Minutes", "Pashmina", "Srinagar and Budgam", "Recorded 2026", "English Subtitles", "Transcript Available"].map((tagText) => (
                <span key={tagText} className="bg-[#FAF9F6] border border-[#3E2723]/20 text-[#3E2723] font-mono text-[10px] uppercase font-semibold px-2.5 py-1">
                  {tagText}
                </span>
              ))}
            </div>

            <button 
              onClick={() => setActiveFilm(allFilms[0])}
              className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all font-mono"
            >
              Explore Documentary Record &rarr;
            </button>
          </div>
        </section>

        {/* Why Documentary Films Matter Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-6">Why Documentary Films Matter</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Many dimensions of craft heritage cannot be preserved through photographs or written records alone. The movement of the artisan’s hands, the rhythm of the workshop, the relationship between master and apprentice, the seasonal character of production, and the social realities surrounding craft communities require sustained visual documentation.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              KHCRF documentary films provide contextual records of:
            </p>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#3E2723]/10 p-8 rounded-xs shadow-xs">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100">
              Contextual Preservation Indicators
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>Artisan lives and family lineages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>Workshop environments and production systems</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>Traditional tools, materials, and techniques</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>Cultural meanings and local histories</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>Economic pressures and market changes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>Apprenticeship and knowledge transmission</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>Conservation, innovation, and revival efforts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>Relationship between craft, place, and community</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Archive Summary (Archive Preview Data Block) */}
        <section className="bg-[#3E2723] text-white p-8 md:p-10 mb-12 rounded-xs relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest">
            Archive Preview Data
          </div>
          <div className="mb-8">
            <h3 className="font-serif text-2xl text-[#D4AF37] mb-2">Visual Heritage Archive Registry</h3>
            <p className="text-white/60 text-xs font-mono">
              INTERNAL AUDIT PREVIEW // CONNECTS DIRECTLY TO CANONICAL CMS OBJECTS
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Documentary Records</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">12</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Craft Traditions Covered</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">10</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Districts Represented</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">6</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Recorded Material</span>
              <span className="text-lg md:text-xl font-serif font-bold text-[#D4AF37] block leading-tight">8 Hours 42 Minutes</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Artisans Featured</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">34</span>
            </div>
            <div className="last:border-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Transcripts Available</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">8</span>
            </div>
          </div>
        </section>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-[#FAF9F6] border border-[#3E2723]/10 p-4">
          <div className="text-xs font-serif text-[#3E2723]">
            KHCRF Registry Catalog &bull; Showing {sortedFilms.length} Records
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] text-gray-400 font-mono uppercase self-center mr-2">Archive Layout View:</span>
            <button 
              onClick={() => { setCurrentView('cards'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'cards' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Editorial Cards
            </button>
            <button 
              onClick={() => { setCurrentView('list'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'list' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Archive List
            </button>
            <button 
              onClick={() => { setCurrentView('index'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'index' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-500 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Research Index
            </button>
          </div>
        </div>

        {/* Search and Discovery Layout */}
        <section className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Filters Sidebar (Left / 25% width) */}
          <div className="w-full lg:w-1/4 bg-white border border-[#3E2723]/10 p-6 shadow-xs sticky top-4 z-10">
            <h3 className="font-serif text-lg text-[#3E2723] mb-6 pb-2 border-b border-gray-100 flex items-center justify-between">
              <span>Filter Archive</span>
              <button 
                onClick={() => {
                  setSelectedCraft('All Crafts');
                  setSelectedTheme('All Themes');
                  setSelectedLocation('All Locations');
                  setSelectedDuration('All Durations');
                  setSelectedStatus('All Statuses');
                  setSelectedLanguage('All Languages');
                  setSelectedSort('Featured');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="text-[10px] text-[#3949AB] hover:underline font-bold uppercase tracking-wider"
              >
                Reset
              </button>
            </h3>

            <div className="space-y-6">
              {/* Search Field */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Search Corpus</label>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search films by title, artisan, craft..."
                  className="w-full border border-gray-200 px-3 py-2 text-xs rounded-none bg-[#FAF9F6] text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                />
              </div>

              {/* Craft Selection */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Craft Tradition</label>
                <select 
                  value={selectedCraft}
                  onChange={(e) => { setSelectedCraft(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Crafts">All Crafts</option>
                  <option value="Hand-Knotted Carpet">Hand-Knotted Carpet</option>
                  <option value="Pashmina">Pashmina</option>
                  <option value="Kani Shawl">Kani Shawl</option>
                  <option value="Sozni Embroidery">Sozni Embroidery</option>
                  <option value="Papier-Mâché">Papier-Mâché</option>
                  <option value="Walnut Wood Carving">Walnut Wood Carving</option>
                  <option value="Copperware">Copperware</option>
                  <option value="Namda">Namda</option>
                  <option value="Crewel Embroidery">Crewel Embroidery</option>
                  <option value="Willow Wicker">Willow Wicker</option>
                  <option value="Chain Stitch">Chain Stitch</option>
                </select>
              </div>

              {/* Theme Selection */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Documentary Theme</label>
                <select 
                  value={selectedTheme}
                  onChange={(e) => { setSelectedTheme(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Themes">All Themes</option>
                  <option value="Artisan Life">Artisan Life</option>
                  <option value="Craft Lineage">Craft Lineage</option>
                  <option value="Workshop Culture">Workshop Culture</option>
                  <option value="Traditional Techniques">Traditional Techniques</option>
                  <option value="Women Artisans">Women Artisans</option>
                  <option value="Apprenticeship">Apprenticeship</option>
                  <option value="Markets and Trade">Markets and Trade</option>
                  <option value="Conservation">Conservation</option>
                  <option value="Innovation">Innovation</option>
                  <option value="Economic Change">Economic Change</option>
                  <option value="Cultural Identity">Cultural Identity</option>
                  <option value="Sustainability">Sustainability</option>
                </select>
              </div>

              {/* Geography */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Geography</label>
                <select 
                  value={selectedLocation}
                  onChange={(e) => { setSelectedLocation(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Locations">All Locations</option>
                  <option value="Srinagar">Srinagar</option>
                  <option value="Budgam">Budgam</option>
                  <option value="Ganderbal">Ganderbal</option>
                  <option value="Baramulla">Baramulla</option>
                  <option value="Anantnag">Anantnag</option>
                  <option value="Pulwama">Pulwama</option>
                  <option value="Bandipora">Bandipora</option>
                  <option value="Kupwara">Kupwara</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Duration</label>
                <select 
                  value={selectedDuration}
                  onChange={(e) => { setSelectedDuration(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Durations">All Durations</option>
                  <option value="Under 15 Minutes">Under 15 Minutes</option>
                  <option value="15–30 Minutes">15–30 Minutes</option>
                  <option value="30–60 Minutes">30–60 Minutes</option>
                  <option value="Over 60 Minutes">Over 60 Minutes</option>
                </select>
              </div>

              {/* Recording Status */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Recording Status</label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Statuses">All Statuses</option>
                  <option value="Archive Preview">Archive Preview</option>
                  <option value="Documentary Concept">Documentary Concept</option>
                  <option value="Research in Progress">Research in Progress</option>
                  <option value="Field Documentation Planned">Field Documentation Planned</option>
                  <option value="Field Recorded">Field Recorded</option>
                  <option value="In Editorial Review">In Editorial Review</option>
                  <option value="Published">Published</option>
                  <option value="Transcript Available">Transcript Available</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Language</label>
                <select 
                  value={selectedLanguage}
                  onChange={(e) => { setSelectedLanguage(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All Languages">All Languages</option>
                  <option value="Kashmiri">Kashmiri</option>
                  <option value="Urdu">Urdu</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Multilingual">Multilingual</option>
                  <option value="English Subtitles Available">English Subtitles Available</option>
                </select>
              </div>

              {/* Sorting */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Sort Order</label>
                <select 
                  value={selectedSort}
                  onChange={(e) => { setSelectedSort(e.target.value); }}
                  className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="Featured">Featured</option>
                  <option value="Newest">Newest</option>
                  <option value="Oldest">Oldest</option>
                  <option value="Duration">Duration</option>
                  <option value="A–Z">A–Z</option>
                </select>
              </div>

            </div>
          </div>

          {/* Results Area (Right / 75% width) */}
          <div className="w-full lg:w-3/4">

            {loading ? (
              <div className="py-20 text-center text-gray-500 font-serif">Loading documentary records...</div>
            ) : (
              <>
                {/* 1. EDITORIAL CARDS VIEW (DEFAULT) */}
                {currentView === 'cards' && (
                  <div className="space-y-8">
                    {paginatedFilms.map((f, i) => (
                      <div 
                        key={i} 
                        className="bg-white border-t-2 border-b-2 border-dashed border-[#3E2723]/30 py-8 px-6 md:px-8 hover:bg-[#3E2723]/5 transition-all duration-300 group relative pl-6 border-l-4 border-l-[#3E2723]"
                      >
                        {/* Film Frame Line / Archive Header */}
                        <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#3E2723]">Archive Record: {f.accessionId}</span>
                            <span>&bull;</span>
                            <span className="bg-[#3E2723]/5 border border-[#3E2723]/10 px-1.5 py-0.5 text-[8px] font-bold">
                              {f.status}
                            </span>
                          </div>
                          <div className="font-bold text-[#3E2723] flex items-center gap-1.5 font-mono">
                            {f.dur.toUpperCase()}
                          </div>
                        </div>

                        {/* Title & Subtitle */}
                        <div className="mb-4">
                          <h3 
                            onClick={() => setActiveFilm(f)}
                            className="text-2xl md:text-3xl font-serif font-bold text-[#3E2723] leading-snug cursor-pointer group-hover:text-[#D4AF37] transition-colors"
                          >
                            {f.title}
                          </h3>
                          {f.subtitle && (
                            <h4 className="text-xs font-serif italic text-gray-500 mt-1 leading-snug">
                              {f.subtitle}
                            </h4>
                          )}
                        </div>

                        {/* Synopsis */}
                        <p className="text-gray-700 text-sm leading-relaxed mb-6 font-sans">
                          {f.desc}
                        </p>

                        {/* Thin Thematic Divider */}
                        <div className="border-t border-gray-200 pt-3 flex flex-wrap justify-between items-center gap-3 text-xs text-gray-500">
                          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-gray-400">
                            <span className="font-bold text-[#3E2723]">{f.craft.toUpperCase()}</span>
                            {f.themes && f.themes.map((th: string) => (
                              <React.Fragment key={th}>
                                <span>&middot;</span>
                                <span>{th.toUpperCase()}</span>
                              </React.Fragment>
                            ))}
                            <span>&middot;</span>
                            <span>{f.year}</span>
                          </div>
                        </div>

                        {/* Sans-serif Metadata List */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 border-t border-gray-100 pt-4 mt-4 text-xs text-gray-500">
                          <div>
                            <span className="text-gray-400 text-[8px] uppercase tracking-wider block font-bold font-mono">Location Cluster</span>
                            <span className="font-medium text-[#2A2A2A]">{f.district}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-[8px] uppercase tracking-wider block font-bold font-mono">Recording Language</span>
                            <span className="font-semibold text-[#2A2A2A]">{f.language}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-[8px] uppercase tracking-wider block font-bold font-mono">Subtitles Index</span>
                            <span className="font-semibold text-[#2A2A2A]">{f.subtitles === 'Yes' ? 'English Subtitles' : 'None'}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-[8px] uppercase tracking-wider block font-bold font-mono">Transcript Status</span>
                            {f.hasTranscript === 'Yes' ? (
                              <span className="text-green-700 font-bold font-mono uppercase text-[9px] flex items-center gap-1">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                Transcript Available
                              </span>
                            ) : (
                              <span className="text-gray-400 font-mono uppercase text-[9px]">Archived</span>
                            )}
                          </div>
                        </div>

                        {/* Interactive Call to Action */}
                        <div className="mt-6 flex justify-between items-center pt-4 border-t border-gray-100/50">
                          <button 
                            onClick={() => setActiveFilm(f)}
                            className="text-xs font-bold uppercase tracking-widest text-[#3E2723] hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 font-mono"
                          >
                            View Documentary Record &rarr;
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* 2. ARCHIVE LIST VIEW (COMPACT TABULAR LIST) */}
                {currentView === 'list' && (
                  <div className="bg-white border border-[#3E2723]/10 overflow-x-auto shadow-sm">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#3E2723] text-[#D4AF37] font-mono uppercase tracking-wider text-[10px]">
                          <th className="p-4 border-b border-[#3E2723]/20">Accession ID</th>
                          <th className="p-4 border-b border-[#3E2723]/20">Documentary Title</th>
                          <th className="p-4 border-b border-[#3E2723]/20">Craft Sector</th>
                          <th className="p-4 border-b border-[#3E2723]/20">District / Geography</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-right">Duration</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center">Year</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center">Transcript</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3E2723]/10 font-sans text-gray-700">
                        {paginatedFilms.map((f, i) => (
                          <tr key={i} className="hover:bg-[#FAF9F6] transition-colors cursor-pointer" onClick={() => setActiveFilm(f)}>
                            <td className="p-4 font-mono font-bold text-gray-500 whitespace-nowrap">{f.accessionId}</td>
                            <td className="p-4">
                              <div className="font-serif font-bold text-[#3E2723] text-sm hover:text-[#D4AF37] transition-colors">{f.title}</div>
                              <div className="text-[10px] text-gray-400 font-light truncate max-w-xs">{f.subtitle}</div>
                            </td>
                            <td className="p-4 font-medium">{f.craft}</td>
                            <td className="p-4 whitespace-nowrap">{f.district}</td>
                            <td className="p-4 text-right font-mono whitespace-nowrap">{f.dur}</td>
                            <td className="p-4 text-center font-mono">{f.year}</td>
                            <td className="p-4 text-center whitespace-nowrap">
                              <span className={`px-2 py-0.5 font-mono text-[9px] uppercase border ${
                                f.hasTranscript === 'Yes' ? 'text-green-600 border-green-200 bg-green-50' : 'text-gray-400 border-gray-100 bg-gray-50'
                              }`}>
                                {f.hasTranscript === 'Yes' ? 'Available' : 'Archived'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3. RESEARCH INDEX VIEW (STRICT INSTITUTIONAL CATALOG SHEETS) */}
                {currentView === 'index' && (
                  <div className="space-y-8 font-mono text-xs">
                    {paginatedFilms.map((f, i) => (
                      <div key={i} className="bg-white border-2 border-[#3E2723] p-6 shadow-sm relative">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-[#3E2723] mb-4 gap-2">
                          <div>
                            <span className="bg-[#3E2723] text-white px-2 py-0.5 text-[10px] font-bold mr-3">
                              KHCRF REGISTRY OBJECT
                            </span>
                            <span className="font-bold text-gray-500">
                              METADATA ACCESSION CODE: {f.accessionId}
                            </span>
                          </div>
                          <div className="text-[#3E2723] font-bold text-[10px] uppercase">
                            STATUS: {f.status} // RECORDED {f.year}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-[#3E2723] uppercase">
                            {f.title}
                          </h3>
                          {f.subtitle && (
                            <h4 className="text-xs text-gray-500 italic mt-0.5 uppercase">
                              {f.subtitle}
                            </h4>
                          )}
                        </div>

                        {/* Strict Key-Value Catalog Table */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-[#3E2723]/10 p-4 mb-4 bg-[#FAF9F6]">
                          <div className="space-y-1.5">
                            <div><span className="text-gray-400">PRIMARY CRAFT SECTOR :</span> <span className="font-bold text-[#3E2723]">{f.craft}</span></div>
                            <div><span className="text-gray-400">PRIMARY GEOGRAPHY    :</span> <span className="font-bold text-[#3E2723]">{f.district}</span></div>
                            <div><span className="text-gray-400">RECORDED DURATION   :</span> <span className="font-bold text-[#3E2723]">{f.dur}</span></div>
                            <div><span className="text-gray-400">RESEARCH DIRECTOR   :</span> <span className="font-bold text-[#3E2723]">{f.director}</span></div>
                          </div>
                          <div className="space-y-1.5">
                            <div><span className="text-gray-400">FEATURED ARTISAN    :</span> <span className="font-bold text-[#3E2723]">{f.artisan}</span></div>
                            <div><span className="text-gray-400">RECORDING LANGUAGE  :</span> <span className="font-bold text-[#3E2723]">{f.language}</span></div>
                            <div><span className="text-gray-400">SUBTITLES INDEXED   :</span> <span className="font-bold text-[#3E2723]">{f.subtitles === 'Yes' ? 'ENGLISH (BURNED-IN)' : 'NONE'}</span></div>
                            <div><span className="text-gray-400">TRANSCRIPT CODE     :</span> <span className="font-bold text-[#3E2723]">{f.hasTranscript === 'Yes' ? `TR-${f.accessionId.replace('KHCRF-DF-', '')}-VERIFIED` : 'ARCHIVED/FORTHCOMING'}</span></div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <span className="text-gray-400 block mb-1 uppercase font-bold text-[10px]">Archival Synopsis:</span>
                          <p className="text-gray-700 leading-relaxed text-[11px]">
                            {f.desc}
                          </p>
                        </div>

                        {f.themes && (
                          <div className="mb-4">
                            <span className="text-gray-400 block mb-1 uppercase font-bold text-[10px]">Index Keywords & Themes:</span>
                            <div className="flex flex-wrap gap-1">
                              {f.themes.map((th: string) => (
                                <span key={th} className="bg-gray-100 text-[#3E2723] px-2 py-0.5 text-[9px] border border-gray-300">
                                  {th.toUpperCase()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-4 border-t border-[#3E2723]/20 flex justify-between items-center text-[10px]">
                          <span className="text-gray-400">KHCRF VISUAL ARCHIVE DEPT &bull; SRINAGAR HQ</span>
                          <button onClick={() => setActiveFilm(f)} className="text-[#3949AB] hover:underline font-bold uppercase">
                            View Documentary Record &rarr;
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-gray-100">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="w-10 h-10 border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  &larr;
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 text-sm font-bold transition-colors ${
                        currentPage === i + 1 ? 'bg-[#D4AF37] text-white' : 'border border-gray-200 text-gray-500 hover:border-[#D4AF37]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="w-10 h-10 border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>

        </section>

        {/* How KHCRF Documentary Records Are Developed Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-16">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4">
            How KHCRF Documentary Records Are Developed
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-4xl font-sans">
            Each documentary record is structured through archival research, field documentation, interviews, craft-specific metadata, workshop observation, editorial review, and contextual analysis.
          </p>

          <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100">
            Documentation Stages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-gray-700">
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 01</span>
              <span className="font-bold text-[#3E2723] block mb-1">Research & Subject ID</span>
              <span className="text-gray-500">Archival identification and craft cluster survey.</span>
            </div>
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 02</span>
              <span className="font-bold text-[#3E2723] block mb-1">Artisan Engagement</span>
              <span className="text-gray-500">Establishing trust, consent, and scheduling.</span>
            </div>
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 03</span>
              <span className="font-bold text-[#3E2723] block mb-1">Field Recording</span>
              <span className="text-gray-500">High-fidelity documentary filming and recording.</span>
            </div>
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 04</span>
              <span className="font-bold text-[#3E2723] block mb-1">Interview Transcription</span>
              <span className="text-gray-500">Converting dialect audio to indexed transcript texts.</span>
            </div>
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 05</span>
              <span className="font-bold text-[#3E2723] block mb-1">Metadata Annotation</span>
              <span className="text-gray-500">Tagging materials, tools, regions, and years.</span>
            </div>
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 06</span>
              <span className="font-bold text-[#3E2723] block mb-1">Historical Contextualization</span>
              <span className="text-gray-500">Aligning field notes with cultural heritage data.</span>
            </div>
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 07</span>
              <span className="font-bold text-[#3E2723] block mb-1">Editorial Review</span>
              <span className="text-gray-500">Subject-matter experts check and verify record parameters.</span>
            </div>
            <div className="border-l-2 border-[#3E2723] pl-4 py-1">
              <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE 08</span>
              <span className="font-bold text-[#3E2723] block mb-1">Archival Publication</span>
              <span className="text-gray-500">Data released to the KHCRF registry for research use.</span>
            </div>
          </div>
        </section>

        {/* Research and Educational Use Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start mt-16">
          <div className="lg:col-span-5">
            <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4">
              Using the Documentary Archive
            </h2>
            <p className="text-gray-650 text-sm leading-relaxed mb-6 font-sans">
              The documentary collection is curated to support researchers, educational systems, and cultural preservationists:
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setActiveFilm(allFilms[0])}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors text-center font-mono w-full md:w-auto"
              >
                Request Research Access
              </button>
              <button 
                onClick={() => setActiveFilm(allFilms[0])}
                className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors text-center font-mono w-full md:w-auto"
              >
                Propose a Documentary Subject
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#3E2723]/10 p-6 md:p-8">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-200 font-mono">
              Approved Research & Educational Uses
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 text-xs text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Academic research
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Classroom teaching
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Museum interpretation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Craft training
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Policy analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Cultural documentation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Exhibition development
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Institutional collaboration
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Artisan advocacy
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Public education
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>Family memory
              </li>
            </ul>
          </div>
        </section>

        {/* Footer Statement Section */}
        <section className="border-t border-[#3E2723]/20 pt-10 text-center max-w-4xl mx-auto mt-16">
          <blockquote className="text-gray-700 text-base md:text-lg leading-relaxed font-serif italic mb-4">
            "KHCRF Documentary Films preserve Kashmir’s craft heritage as lived knowledge—recording not only what artisans make, but how they work, learn, remember, adapt, and sustain their traditions."
          </blockquote>
          <p className="text-gray-400 text-xs font-mono uppercase tracking-widest font-bold">
            KHCRF Registry Access Console &bull; Visual Heritage Archive Division
          </p>
          <p className="text-[#D4AF37] text-[10px] uppercase font-bold mt-2 tracking-widest font-mono">
            This page represents a documentary archive under development. Records represent scheduled research and field documentation objects.
          </p>
        </section>

      </div>
    </main>
  );
}
