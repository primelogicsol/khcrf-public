'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { museumArchiveHeroFallback } from '@/config/heroFallbacks';

export default function MuseumArchive() {
  const [allCollections, setAllCollections] = useState<any[]>([
    {
      slug: "ma-kashmir-textiles-va",
      title: "Kashmir Textiles at the Victoria and Albert Museum",
      subtitle: "Tracing the Global Journey of Pashmina, Shawls, and Textile Design",
      desc: "This collection examines Kashmiri textiles preserved within the Victoria and Albert Museum, highlighting their craftsmanship, historical context, collecting history, and influence on global textile appreciation. Rather than presenting isolated objects, the archive interprets how these works collectively document changing artistic traditions, international exchange, and museum stewardship.",
      accessionId: "KHCRF-MA-2026-001",
      institution: "Victoria and Albert Museum",
      country: "United Kingdom",
      city: "London",
      founded: "1852",
      focus: "Decorative arts and design",
      holdingsCount: 127,
      curator: "Dr. Rosemary Crill",
      dateEstablished: "c. 1880",
      status: "Fully Documented",
      version: "v1.2",
      provenanceOverview: "Mainly sourced from the East India Company Collections (exhibitions 1851, 1878) and later individual donations.",
      history: {
        collecting: "Shawls entered the EIC collections in mid-19th century, transferred to the South Kensington Museum (later V&A) in 1879.",
        context: "Documents the high-demand export period of Kashmiri shawls to Europe and the subsequent imitation industries in Paisley."
      },
      objects: [
        {
          title: "Dogra Court Kani Shawl",
          accNo: "IS. 18-1882",
          institution: "Victoria and Albert Museum",
          dept: "South Asian Section",
          craft: "Kani",
          maker: "Unknown Court Weaver",
          workshop: "State Guilds",
          date: "c. 1860",
          material: "Pashmina",
          dimensions: "180 x 180 cm",
          technique: "Double warp Kani weave",
          condition: "Stable, minor fiber thinning",
          status: "On Display",
          provenance: "Presented to the Secretary of State for India; transferred 1882.",
          acquisition: "Transfer from India Office Museum",
          exhibitions: "Great Exhibition of 1851 (likely), Paris 1878",
          conservation: "Cleaned and backed with silk gauze in 1982.",
          rights: "Crown Copyright V&A Museum"
        }
      ],
      conservationProfile: {
        condition: "Excellent - Climate-controlled display cases",
        materialsAssessment: "100% fine grade Changthangi Pashm fleece threads",
        treatments: "Support lining backing applied in 1982",
        handling: "Flat mount support frames, soft cotton gloves",
        monitoring: "Inspected every 12 months",
        treatment: "Humidification chamber balancing completed in 2021",
        reviewSchedule: "Next review October 2026"
      },
      relatedDoc: "Doc-KHCRF-2026-05",
      relatedHistory: "KHCRF-OH-2026-001",
      relatedDemo: "KHCRF-CD-2026-003",
      relatedCollection: "KHCRF-COL-2026-001",
      bibliography: "V&A Kashmir Shawl Catalog (1986).",
      citation: "V&A IS.18-1882 record citation.",
      rights: "Courtesy V&A Museum Collections"
    },
    {
      slug: "ma-carpets-delhi",
      title: "Carpets in the National Museum, New Delhi",
      subtitle: "Historic Weaves of the Mughal and Dogra Periods",
      desc: "This curation documents Kashmir hand-knotted wool and silk carpets housed in New Delhi, tracing the evolution of court medallion systems from 1750 onwards.",
      accessionId: "KHCRF-MA-2026-002",
      institution: "National Museum, New Delhi",
      country: "India",
      city: "New Delhi",
      founded: "1949",
      focus: "National archeology and art history",
      holdingsCount: 84,
      curator: "Dr. A. K. Singh",
      dateEstablished: "1952",
      status: "Provenance Complete",
      version: "v2.0",
      provenanceOverview: "Transferred from Delhi Durbar archives and Maharaja family collections.",
      history: {
        collecting: "Deposited post-independence to form the core of the textile gallery.",
        context: "Represents classical northern carpet knotting schools."
      },
      objects: [],
      conservationProfile: {
        condition: "Good - Rolled on cotton tubes",
        materialsAssessment: "Fine spun sheep wool pile on cotton warp",
        treatments: "Fringe re-weaving in 2015",
        handling: "Two-person flat rolling checks",
        monitoring: "Inspected every 6 months",
        treatment: "Wash cleaning using organic soap-nut solutions",
        reviewSchedule: "Review March 2027"
      },
      relatedDoc: "Doc-KHCRF-2026-03",
      relatedHistory: "KHCRF-OH-2026-007",
      relatedDemo: "KHCRF-CD-2026-001",
      relatedCollection: "KHCRF-COL-2026-002"
    },
    {
      slug: "ma-papiermache-intl",
      title: "Papier-Mâché in International Museums",
      subtitle: "Kashmiri Painted Boxes and Qalamdans Worldwide",
      desc: "Linking lacquered paper pulp relics across Europe and America to study mineral pigment chemistry stability.",
      accessionId: "KHCRF-MA-2026-003",
      institution: "Smithsonian Institution",
      country: "United States",
      city: "Washington D.C.",
      founded: "1846",
      focus: "Global anthropology and decorative arts",
      holdingsCount: 63,
      curator: "Dr. S. A. Shah",
      dateEstablished: "c. 1910",
      status: "Conservation Notes Available",
      version: "v1.1",
      provenanceOverview: "Donated by early diplomatic envoys and private travel collectors.",
      history: {
        collecting: "Sourced during late 19th-century exploratory expeditions.",
        context: "Documents the migration of floral Persian motifs into Western collections."
      },
      objects: [],
      conservationProfile: {
        condition: "Excellent - Stored in dark cases",
        materialsAssessment: "Paper pulp Sakhta with mineral blue pigment coats",
        treatments: "Lacquer consolidation in 2018",
        handling: "Silk gloves, soft tray transit support",
        monitoring: "UV checks semi-annually",
        treatment: "Varnish consolidation completed",
        reviewSchedule: "Review January 2027"
      },
      relatedDoc: "Doc-KHCRF-2026-04",
      relatedHistory: "KHCRF-OH-2026-003",
      relatedDemo: "KHCRF-CD-2026-006",
      relatedCollection: "KHCRF-COL-2026-005"
    }
  ]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedMuseum, setSelectedMuseum] = useState('All');
  const [selectedCraft, setSelectedCraft] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Featured');
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  // Interactive Map States
  const [mapSelectedCraft, setMapSelectedCraft] = useState('All');
  const [mapSelectedMuseum, setMapSelectedMuseum] = useState<any>(null);

  const [activeItem, setActiveItem] = useState<any>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'essay' | 'objects' | 'provenance' | 'conservation' | 'relations'>('overview');
  const [currentView, setCurrentView] = useState<'gallery' | 'institution' | 'catalogue' | 'map'>('gallery');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Global Museums dataset for Interactive Map
  const mapMuseums = [
    {
      name: "Victoria and Albert Museum",
      city: "London",
      country: "United Kingdom",
      coords: "51.4975° N, 0.1720° W",
      holdings: 127,
      crafts: ["Pashmina", "Kani", "Sozni"],
      strengths: "19th Century royal court shawls and textile designs",
      research: "East India Company collection transfers provenance audit complete",
      artisans: "Srinagar Court Weavers Guild",
      techniques: "Kani Loom Weaving",
      motifs: "Buta, Paisley, Shah-pasand",
      publications: "V&A Kashmir Shawl Catalog (1986)"
    },
    {
      name: "Smithsonian Institution",
      city: "Washington D.C.",
      country: "United States",
      coords: "38.8921° N, 77.0260° W",
      holdings: 63,
      crafts: ["Papier-Mâché", "Walnut Wood"],
      strengths: "Lacquered writing boxes and carved screens",
      research: "Late Dogra era artisan workshop registers",
      artisans: "Habibullah Atelier Guild",
      techniques: "Sakhta pulp moulding & Naqashi",
      motifs: "Chinar leaf, Hazara floral array",
      publications: "Smithsonian South Asian Decorative Arts Review (1998)"
    },
    {
      name: "National Museum, New Delhi",
      city: "New Delhi",
      country: "India",
      coords: "28.6118° N, 77.2193° E",
      holdings: 84,
      crafts: ["Carpet", "Pashmina"],
      strengths: "Mughal and early Dogra court carpets",
      research: "Talim script translation and pattern drift audits",
      artisans: "Master Weavers Guild (Srinagar)",
      techniques: "Traditional Hand-Knotting",
      motifs: "Medallion garden plans, floral scroll borders",
      publications: "National Museum Court Carpets Monograph"
    },
    {
      name: "British Museum",
      city: "London",
      country: "United Kingdom",
      coords: "51.5194° N, 0.1270° W",
      holdings: 58,
      crafts: ["Copperware", "Walnut Wood"],
      strengths: "Engraved ceremonial vessels and early architecture lattices",
      research: "19th Century metal alloy tracing",
      artisans: "Zaina Kadal Coppersmiths",
      techniques: "Kandkari chasing",
      motifs: "Geometrical arabesque panels",
      publications: "British Museum Kashmir Metalwork Survey"
    },
    {
      name: "Metropolitan Museum of Art",
      city: "New York",
      country: "United States",
      coords: "40.7794° N, 73.9632° W",
      holdings: 91,
      crafts: ["Pashmina", "Sozni", "Carpet"],
      strengths: "Classical shawls and early hand-woven floor carpets",
      research: "18th-century dye stabilization studies",
      artisans: "Srinagar Guild Masters",
      techniques: "Dorukha double sided embroidery",
      motifs: "Shikargah hunting scenes",
      publications: "Metropolitan Islamic Art textile registry"
    }
  ];

  const filteredCollections = allCollections.filter(c => {
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const text = `${c.title} ${c.subtitle || ''} ${c.desc} ${c.institution} ${c.country} ${c.city} ${c.craft} ${c.accessionId}`.toLowerCase();
      if (!text.includes(q)) return false;
    }
    // Craft
    if (selectedCraft !== 'All') {
      if (c.craft !== selectedCraft) return false;
    }
    // Country
    if (selectedCountry !== 'All') {
      if (c.country !== selectedCountry) return false;
    }
    // Museum Institution
    if (selectedMuseum !== 'All') {
      if (c.institution !== selectedMuseum) return false;
    }
    return true;
  });

  // Sorting
  const sortedCollections = [...filteredCollections].sort((a, b) => {
    if (selectedSort === 'Recently Added') {
      return b.accessionId.localeCompare(a.accessionId);
    }
    if (selectedSort === 'Institution') {
      return a.institution.localeCompare(b.institution);
    }
    if (selectedSort === 'Country') {
      return a.country.localeCompare(b.country);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedCollections.length / itemsPerPage);
  const paginatedCollections = sortedCollections.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Filter map museums by craft selection
  const filteredMapMuseums = mapMuseums.filter(m => {
    if (mapSelectedCraft === 'All') return true;
    return m.crafts.includes(mapSelectedCraft);
  });

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24 animate-fadeIn">
      
      {/* Detailed Modal Registry Sheet */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-sm" onClick={() => setActiveItem(null)}></div>
          <div className="relative z-10 bg-[#FAF9F6] border-2 border-[#3E2723] max-w-3xl w-full p-6 md:p-8 shadow-2xl text-[#2A2A2A] max-h-[95vh] overflow-y-auto custom-scrollbar font-mono rounded-xs" role="dialog" aria-modal="true">
            <button onClick={() => setActiveItem(null)} className="absolute top-4 right-4 text-[#3E2723]/50 hover:text-[#3E2723] text-xl font-bold font-mono">&times;</button>
            
            <div className="text-center mb-6 border-b border-[#3E2723]/25 pb-4">
              <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest block mb-1 font-bold">KHCRF MUSEUM ARCHIVE REGISTRY</span>
              <h2 className="text-xl md:text-2xl font-serif text-[#3E2723] font-bold leading-tight">{activeItem.title}</h2>
              {activeItem.subtitle && <p className="text-gray-555 text-xs italic font-serif mt-1">{activeItem.subtitle}</p>}
              
              <div className="flex flex-wrap justify-center gap-2 mt-3 font-mono text-[9px] uppercase tracking-wider text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">ACCESSION: {activeItem.accessionId}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">MUSEUM: {activeItem.institution}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">OBJECTS: {activeItem.holdingsCount}</span>
              </div>
            </div>

            {/* Modal Tabs navigation */}
            <div className="flex flex-wrap gap-1 border-b border-[#3E2723]/20 pb-3 mb-6 text-[10px] font-mono justify-center">
              {[
                { id: 'overview', label: 'Collection Overview' },
                { id: 'provenance', label: 'Provenance History' },
                { id: 'essay', label: 'Curatorial Essay' },
                { id: 'objects', label: 'Objects Inventory' },
                { id: 'conservation', label: 'Conservation Profile' },
                { id: 'relations', label: 'Related Knowledge' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as any)}
                  className={`px-3 py-1.5 border border-t-2 transition-all ${
                    activeModalTab === tab.id
                      ? 'bg-[#3E2723] text-white border-[#3E2723] border-t-[#D4AF37]'
                      : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Contents */}
            <div className="space-y-6 text-xs text-gray-700 leading-relaxed font-mono">
              
              {/* TAB 1: OVERVIEW */}
              {activeModalTab === 'overview' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Institutional Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div><span className="text-gray-400">INSTITUTION NAME :</span> {activeItem.institution}</div>
                      <div><span className="text-gray-400">COUNTRY          :</span> {activeItem.country}</div>
                      <div><span className="text-gray-400">CITY             :</span> {activeItem.city}</div>
                      <div><span className="text-gray-400">FOUNDED YEAR     :</span> {activeItem.founded}</div>
                      <div><span className="text-gray-400">COLLECTION FOCUS :</span> {activeItem.focus}</div>
                    </div>
                    <div className="space-y-1">
                      <div><span className="text-gray-400">RELEVANT HOLDINGS:</span> {activeItem.holdingsCount} documented records</div>
                      <div><span className="text-gray-400">CURATOR LEAD     :</span> {activeItem.curator}</div>
                      <div><span className="text-gray-400">DATE ESTABLISHED :</span> {activeItem.dateEstablished}</div>
                      <div><span className="text-gray-400">RESEARCH STATUS  :</span> {activeItem.status}</div>
                      <div><span className="text-gray-400">VERSION CODE     :</span> {activeItem.version}</div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3 space-y-1">
                    <div><span className="text-gray-400">DEPARTMENTS       :</span> South Asian & Islamic collections</div>
                    <div><span className="text-gray-400">RESEARCH ACCESS   :</span> By scholastic application only</div>
                    <div><span className="text-gray-400">PHOTOGRAPHY POLICY:</span> Non-commercial research allowed</div>
                    <div><span className="text-gray-400">LOAN POLICY       :</span> Under museum cooperative guidelines</div>
                    <div><span className="text-gray-400">OFFICIAL WEBSITE  :</span> <a href="https://www.vam.ac.uk" target="_blank" rel="noopener noreferrer" className="text-[#3949AB] hover:underline">Victoria and Albert Collections Portal</a></div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROVENANCE */}
              {activeModalTab === 'provenance' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Provenance Timeline</h3>
                  <div className="border-l-2 border-[#3E2723]/20 pl-4 space-y-3 relative">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 bg-[#3E2723] w-2 h-2 rounded-full"></div>
                      <span className="font-bold text-[#3E2723]">Workshop in Srinagar</span>
                      <p className="text-gray-500 text-[9px]">Authentic craft production site. Mid 19th C.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 bg-[#3E2723] w-2 h-2 rounded-full"></div>
                      <span className="font-bold text-[#3E2723]">Private Patron</span>
                      <p className="text-gray-500 text-[9px]">Acquired by trade merchants or court officers.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 bg-gray-300 w-2 h-2 rounded-full"></div>
                      <span className="font-bold text-gray-400">Unknown Interval</span>
                      <p className="text-gray-400 text-[9px] italic">Not inferred - historical gap in billing records</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 bg-[#3E2723] w-2 h-2 rounded-full"></div>
                      <span className="font-bold text-[#3E2723]">Museum Acquisition</span>
                      <p className="text-gray-500 text-[9px]">Transferred to South Kensington inventory in 1879.</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 bg-[#D4AF37] w-2 h-2 rounded-full"></div>
                      <span className="font-bold text-[#D4AF37]">Digitally Documented by KHCRF</span>
                      <p className="text-gray-500 text-[9px]">Cross-collection registry linked 2026.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CURATORIAL ESSAY */}
              {activeModalTab === 'essay' && (
                <div className="space-y-4 font-sans text-gray-655">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase font-mono border-b border-[#3E2723]/10 pb-1 mb-2">Curatorial Essay</h3>
                  <p className="leading-relaxed font-sans text-gray-700">{activeItem.desc}</p>
                  <div className="bg-[#FAF9F6] border border-gray-200 p-4 font-mono text-[10px] space-y-1 mt-4">
                    <div><span className="text-gray-400">COLLECTING HISTORY:</span> {activeItem.history?.collecting}</div>
                    <div><span className="text-gray-400">HISTORICAL CONTEXT:</span> {activeItem.history?.context}</div>
                  </div>
                </div>
              )}

              {/* TAB 4: OBJECTS INVENTORY */}
              {activeModalTab === 'objects' && (
                <div className="space-y-4 font-mono">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Documented Objects</h3>
                  {activeItem.objects?.length > 0 ? (
                    <div className="space-y-4">
                      {activeItem.objects.map((obj: any, oIdx: number) => (
                        <div key={oIdx} className="border border-gray-200 p-4 bg-white space-y-2 text-[10px] font-mono">
                          <div className="flex justify-between items-center border-b border-gray-100 pb-1 font-bold">
                            <span className="text-[#3E2723]">{obj.title}</span>
                            <span className="text-gray-400">{obj.accNo}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[9px] text-gray-500">
                            <div><span className="font-bold">Gallery Location:</span> Room 41, South Asian display</div>
                            <div><span className="font-bold">Department:</span> {obj.dept}</div>
                            <div><span className="font-bold">Craft:</span> {obj.craft}</div>
                            <div><span className="font-bold">Maker:</span> {obj.maker}</div>
                            <div><span className="font-bold">Workshop:</span> {obj.workshop}</div>
                            <div><span className="font-bold">Date:</span> {obj.date}</div>
                            <div><span className="font-bold">Material:</span> {obj.material}</div>
                            <div><span className="font-bold">Dimensions:</span> {obj.dimensions}</div>
                            <div><span className="font-bold">Technique:</span> {obj.technique}</div>
                            <div><span className="font-bold">Condition:</span> {obj.condition}</div>
                            <div><span className="font-bold">Display Status:</span> {obj.status}</div>
                            <div><span className="font-bold">Acquisition Method:</span> {obj.acquisition}</div>
                          </div>
                          <div className="pt-2 border-t border-gray-100 text-[9px] text-gray-450 italic">
                            Rights Statement: {obj.rights}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">Inventory lists are under institutional verification. Core numbers logged.</p>
                  )}
                </div>
              )}

              {/* TAB 5: CONSERVATION PROFILE */}
              {activeModalTab === 'conservation' && (
                <div className="space-y-4 font-mono text-[10px] grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-[#D4AF37] font-bold border-b border-gray-200 pb-1 uppercase text-[9px]">Status & Treatments</h4>
                    <div><span className="text-gray-400">Current Condition:</span> {activeItem.conservationProfile?.condition}</div>
                    <div><span className="text-gray-400">Materials Assessment:</span> {activeItem.conservationProfile?.materialsAssessment}</div>
                    <div><span className="text-gray-400">Past Treatments:</span> {activeItem.conservationProfile?.treatments}</div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[#D4AF37] font-bold border-b border-gray-200 pb-1 uppercase text-[9px]">Risks & Handling</h4>
                    <div><span className="text-gray-400">Environmental Risks:</span> {activeItem.conservationProfile?.risks || "Fading peaks from high display lighting"}</div>
                    <div><span className="text-gray-400">Handling Guidance:</span> {activeItem.conservationProfile?.handling || "Horizontal box mount only"}</div>
                    <div><span className="text-gray-400">Recommended Storage:</span> {activeItem.conservationProfile?.storage || "Acid-free wrapping, darkness stack"}</div>
                    <div><span className="text-gray-400">Monitoring History:</span> {activeItem.conservationProfile?.monitoring || "Inspected every 12 months"}</div>
                  </div>
                </div>
              )}

              {/* TAB 6: RELATED KNOWLEDGE */}
              {activeModalTab === 'relations' && (
                <div className="space-y-4 font-mono text-[11px] space-y-4">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Scholarly Connections</h3>
                  <div className="bg-white border border-gray-200 p-4 space-y-1.5 text-[10px]">
                    <div><span className="text-gray-400">CITATION           :</span> KHCRF Museum Archive, Record {activeItem.accessionId}. Retrieved 2026.</div>
                    <div><span className="text-gray-400">RELATED ORAL HISTORY:</span> {activeItem.relatedHistory}</div>
                    <div><span className="text-gray-400">RELATED DOCUMENTARY :</span> {activeItem.relatedDoc}</div>
                    <div><span className="text-gray-400">RELATED DEMONSTRATION:</span> {activeItem.relatedDemo}</div>
                    <div><span className="text-gray-400">RELATED COLLECTION  :</span> {activeItem.relatedCollection}</div>
                    <div><span className="text-gray-400">BIBLIOGRAPHY        :</span> {activeItem.bibliography}</div>
                    <div><span className="text-gray-400">CITATION DETAILS    :</span> {activeItem.citation}</div>
                    <div><span className="text-gray-400">RIGHTS STATEMENT    :</span> {activeItem.rights}</div>
                  </div>
                </div>
              )}

            </div>

            <div className="border-t border-[#D4AF37]/30 pt-6 text-center space-y-4 font-mono mt-6">
              <p className="text-[9px] uppercase tracking-widest text-gray-400 leading-relaxed font-mono">
                Access to full microscopic logs and high-definition material spectra is reserved for supportive members.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/about/memberships" className="bg-[#D4AF37] text-[#3E2723] hover:bg-white px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors border border-[#D4AF37] font-mono">
                  Become a Member
                </Link>
                <button onClick={() => setActiveItem(null)} className="border border-[#3E2723] hover:bg-[#3E2723]/5 text-[#3E2723] px-6 py-3 uppercase tracking-wider text-xs transition-colors font-light font-mono">
                  Return to Archive
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Hero section */}
      <UniversalEditorialHero pageKey="museum-archive" fallbackConfig={museumArchiveHeroFallback as any} />

      <div className="container-fluid mx-auto px-4 md:px-10 py-12 max-w-7xl animate-fadeIn">
        
        {/* Scholarly Statement */}
        <div className="bg-[#3E2723]/5 border-l-4 border-[#3E2723] p-8 mb-12 rounded-r-xs max-w-5xl">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed font-serif">
            This is <strong>not</strong> a museum directory. It is <strong>a federated research archive of museum-held Kashmiri craft heritage</strong>—bringing together documented objects from museums, cultural institutions, university collections, archives, and public repositories worldwide into one searchable knowledge platform. Unlike <strong>Signature Masterpieces</strong>, which recognize excellence, the <strong>Museum Archive</strong> focuses on <strong>institutional stewardship, provenance, conservation, interpretation, and accessibility</strong>.
          </p>
          <p className="text-gray-755 text-xs mt-3 uppercase tracking-widest font-bold font-mono">
            The KHCRF Museum Archive brings together documented records of Kashmiri craft objects held by museums and cultural institutions. While the physical objects remain under the care of their respective institutions, this archive connects them through shared research, standardized documentation, provenance studies, conservation records, technical analysis, and contextual interpretation. By linking dispersed collections into a unified digital knowledge resource, the archive enables researchers, students, artisans, museums, policymakers, and the public to study Kashmir's craft heritage beyond institutional boundaries while respecting ownership, intellectual property, and collection policies.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 font-mono text-xs">
            <a href="#results" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Explore Museum Archive
            </a>
            <a href="#suggest" className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-5 py-2.5 font-bold uppercase tracking-wider transition-all">
              Suggest a Museum Collection
            </a>
            <a href="#methodology" className="text-[#3E2723] hover:underline font-bold py-2.5">
              Museum Documentation Standards &rarr;
            </a>
          </div>
        </div>

        {/* Featured Museum Collection */}
        <section className="bg-white border-4 border-[#3E2723] p-8 md:p-10 mb-16 relative shadow-md">
          <div className="absolute top-0 right-0 bg-[#3E2723] text-[#D4AF37] px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
            FEATURED COLLECTION
          </div>
          
          <div className="max-w-4xl font-mono">
            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-1">
              Collection Record: KHCRF-MA-2026-001
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3E2723] leading-tight mb-2">
              Kashmir Textiles at the Victoria and Albert Museum
            </h2>
            <h3 className="text-base md:text-lg font-serif italic text-gray-500 mb-4">
              Tracing the Global Journey of Pashmina, Shawls, and Textile Design
            </h3>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-6 font-sans text-gray-655">
              This collection examines Kashmiri textiles preserved within the Victoria and Albert Museum, highlighting their craftsmanship, historical context, collecting history, and influence on global textile appreciation. Rather than presenting isolated objects, the archive interprets how these works collectively document changing artistic traditions, international exchange, and museum stewardship.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 font-mono text-[10px] border-t border-b border-gray-250 py-3 bg-gray-55 px-4">
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Institution</span>
                <span className="font-bold text-[#3E2723]">Victoria and Albert Museum</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Country</span>
                <span className="font-bold text-[#3E2723]">United Kingdom</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Size</span>
                <span className="font-bold text-[#3E2723]">127 Documented Objects</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Assessments</span>
                <span className="font-bold text-[#D4AF37] font-bold">Research Essays &amp; Conservation Records</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => { setActiveItem(allCollections[0]); setActiveModalTab('overview'); }}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all font-mono"
              >
                Explore Collection &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* Why a Museum Archive Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start mt-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-6 font-bold">Connecting Dispersed Heritage</h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
              Kashmir's craft heritage is preserved in museums across many countries. Individual collections often document only part of a larger story. By connecting these holdings through shared metadata and scholarly interpretation, KHCRF helps researchers understand the relationships between collections.
            </p>
            <p className="text-gray-605 text-sm leading-relaxed font-sans">
              The archive complements museum catalogues by building relationships between collections rather than duplicating institutional records.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#3E2723]/10 p-8 rounded-xs shadow-xs">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              Research Pathways Connected:
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 font-sans font-mono">
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>historical movement of objects</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>regional workshop traditions</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>artistic evolution</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>provenance pathways</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>conservation history</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>collecting practices</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>cultural exchange</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>museum interpretation</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>comparative design</li>
              <li className="flex items-start gap-2"><span className="text-[#D4AF37] font-bold">▪</span>long-term preservation</li>
            </ul>
          </div>
        </section>

        {/* Comparative Research Tools Section */}
        <section className="bg-white border border-[#3E2723]/25 p-8 md:p-10 mb-16 rounded-xs shadow-sm">
          <div className="border-b border-[#3E2723]/15 pb-4 mb-8">
            <span className="text-[#D4AF37] text-[10px] font-mono uppercase font-bold tracking-widest block mb-1">Advanced Tools</span>
            <h3 className="font-serif text-2xl font-bold text-[#3E2723]">Comparative Research Tools</h3>
            <p className="text-gray-500 text-xs font-mono mt-1">CROSS-INSTITUTIONAL METADATA COMPARISON SYSTEM</p>
          </div>

          <p className="text-gray-655 text-xs leading-relaxed mb-6 font-sans">
            The Museum Archive allows researchers to compare objects across institutions. This cross-institutional capability is a major value-add over individual museum databases:
          </p>

          <ul className="space-y-2 text-xs font-mono text-gray-700 mb-6">
            <li className="flex items-center gap-2"><span className="text-[#D4AF37]">▪</span>Compare all 19th-century Kani shawls held in different museums.</li>
            <li className="flex items-center gap-2"><span className="text-[#D4AF37]">▪</span>Compare Chinar motifs across five collections.</li>
            <li className="flex items-center gap-2"><span className="text-[#D4AF37]">▪</span>Compare accession histories of carpets acquired before 1950.</li>
          </ul>
        </section>

        {/* Archive Overview Dashboard */}
        <section className="bg-[#3E2723] text-white p-8 md:p-10 mb-12 rounded-xs relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#3E2723] px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-widest">
            Registry Overview
          </div>
          <div className="mb-8 font-mono">
            <h3 className="font-serif text-2xl text-[#D4AF37] mb-2 font-bold font-serif">Federated Museum Registry</h3>
            <p className="text-white/60 text-xs">
              GLOBAL INSTITUTIONAL PARTNERSHIP CLASSIFIED SYSTEM
            </p>
          </div>

          {/* Primary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left border-b border-white/10 pb-8 mb-8">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Museum Partners</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">36</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Objects Documented</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">4,812</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono">Countries</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">18</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Collections Connected</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">94</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono font-mono font-mono">Research Essays</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">137</span>
            </div>
            <div className="last:border-0">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block mb-2 font-mono">Conservation Records</span>
              <span className="text-3xl font-serif font-bold text-[#D4AF37]">921</span>
            </div>
          </div>

          {/* Secondary Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center md:text-left font-mono">
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Digitally Accessible</span>
              <span className="text-xl font-serif font-semibold text-white/80 font-mono">3,476</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Provenance Research</span>
              <span className="text-xl font-serif font-semibold text-white/80">2,904</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono">High-Res Imaging</span>
              <span className="text-xl font-serif font-semibold text-white/80 font-mono">2,188</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">3D Documentation</span>
              <span className="text-xl font-serif font-semibold text-white/80">116</span>
            </div>
            <div className="border-r border-white/10 last:border-0 pr-4">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono">Linked Artisans</span>
              <span className="text-xl font-serif font-semibold text-white/80">402</span>
            </div>
            <div className="last:border-0">
              <span className="text-[9px] text-white/40 uppercase tracking-widest block mb-2 font-mono font-mono">Related Pubs</span>
              <span className="text-lg font-serif font-semibold text-[#D4AF37] block leading-tight font-mono">683</span>
            </div>
          </div>
        </section>

        {/* View Switcher Controls */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-[#FAF9F6] border border-[#3E2723]/10 p-4 font-mono" id="results">
          <div className="text-xs font-serif text-[#3E2723]">
            KHCRF Museum Archive Registry &bull; Showing {sortedCollections.length} Verified Institutions
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] text-gray-400 uppercase self-center mr-2 font-mono">Archive Layout View:</span>
            <button 
              onClick={() => { setCurrentView('gallery'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'gallery' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-550 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Museum Gallery
            </button>
            <button 
              onClick={() => { setCurrentView('institution'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'institution' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Institution View
            </button>
            <button 
              onClick={() => { setCurrentView('catalogue'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'catalogue' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Research Catalogue
            </button>
            <button 
              onClick={() => { setCurrentView('map'); setCurrentPage(1); }}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border ${
                currentView === 'map' ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#3E2723]'
              }`}
            >
              Interactive Map
            </button>
          </div>
        </div>

        {/* Search and Discovery Layout */}
        <section className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Filters Sidebar */}
          {currentView !== 'map' && (
            <div className="w-full lg:w-1/4 bg-white border border-[#3E2723]/10 p-6 shadow-xs sticky top-4 z-10 font-sans">
              <h3 className="font-serif text-lg text-[#3E2723] mb-6 pb-2 border-b border-gray-100 flex items-center justify-between font-bold">
                <span>Filter Archive</span>
                <button 
                  onClick={() => {
                    setSelectedCraft('All');
                    setSelectedMaterial('All');
                    setSelectedDistrict('All');
                    setSelectedPeriod('All');
                    setSelectedCountry('All');
                    setSelectedStatus('All');
                    setSelectedSort('Featured');
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="text-[10px] text-[#3949AB] hover:underline font-bold uppercase tracking-wider font-mono"
                >
                  Reset
                </button>
              </h3>

              <div className="space-y-6">
                {/* Search Field */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Search Field</label>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="Search museum objects by institution, craft, maker, accession number, motif, material, period, or keyword..."
                    className="w-full border border-gray-200 px-3 py-2 text-xs rounded-none bg-[#FAF9F6] text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  />
                </div>

                {/* Institution Type */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Institution Type</label>
                  <select 
                    value={selectedType}
                    onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Types</option>
                    <option value="National Museum">National Museum</option>
                    <option value="Regional Museum">Regional Museum</option>
                    <option value="University Museum">University Museum</option>
                    <option value="Craft Museum">Craft Museum</option>
                    <option value="Decorative Arts Museum">Decorative Arts Museum</option>
                    <option value="Anthropology Museum">Anthropology Museum</option>
                    <option value="Private Museum">Private Museum</option>
                    <option value="Cultural Centre">Cultural Centre</option>
                    <option value="Archive">Archive</option>
                    <option value="Textile Museum">Textile Museum</option>
                  </select>
                </div>

                {/* Museum Institution Select */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Museum</label>
                  <select 
                    value={selectedMuseum}
                    onChange={(e) => { setSelectedMuseum(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Museums</option>
                    <option value="National Museum, New Delhi">National Museum, New Delhi</option>
                    <option value="Indian Museum, Kolkata">Indian Museum, Kolkata</option>
                    <option value="Victoria and Albert Museum">Victoria and Albert Museum</option>
                    <option value="British Museum">British Museum</option>
                    <option value="Smithsonian Institution">Smithsonian Institution</option>
                    <option value="Los Angeles County Museum of Art">Los Angeles County Museum of Art</option>
                    <option value="Metropolitan Museum of Art">Metropolitan Museum of Art</option>
                    <option value="National Museum of Asian Art">National Museum of Asian Art</option>
                    <option value="Ashmolean Museum">Ashmolean Museum</option>
                    <option value="Museum of Islamic Art">Museum of Islamic Art</option>
                  </select>
                </div>

                {/* Craft Select filter */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Craft Tradition</label>
                  <select 
                    value={selectedCraft}
                    onChange={(e) => { setSelectedCraft(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Crafts</option>
                    <option value="Carpet">Carpet</option>
                    <option value="Pashmina">Pashmina</option>
                    <option value="Kani">Kani</option>
                    <option value="Sozni">Sozni</option>
                    <option value="Crewel">Crewel</option>
                    <option value="Papier-Mâché">Papier-Mâché</option>
                    <option value="Walnut Wood">Walnut Wood</option>
                    <option value="Copperware">Copperware</option>
                    <option value="Namda">Namda</option>
                    <option value="Willow Wicker">Willow Wicker</option>
                  </select>
                </div>

                {/* Historical Period */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Historical Period</label>
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => { setSelectedPeriod(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Periods</option>
                    <option value="Contemporary">Contemporary</option>
                    <option value="19th Century">19th Century</option>
                    <option value="18th Century">18th Century</option>
                    <option value="Earlier">Earlier</option>
                  </select>
                </div>

                {/* Material */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono font-mono">Primary Material</label>
                  <select 
                    value={selectedMaterial}
                    onChange={(e) => { setSelectedMaterial(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Materials</option>
                    <option value="Wool">Wool</option>
                    <option value="Pashmina">Pashmina</option>
                    <option value="Silk">Silk</option>
                    <option value="Walnut">Walnut</option>
                    <option value="Copper">Copper</option>
                    <option value="Papier-Mâché">Papier-Mâché</option>
                    <option value="Mixed Materials">Mixed Materials</option>
                  </select>
                </div>

                {/* Country Select */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Country Location</label>
                  <select 
                    value={selectedCountry}
                    onChange={(e) => { setSelectedCountry(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Countries</option>
                    <option value="India">India</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="Italy">Italy</option>
                    <option value="Canada">Canada</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                {/* Documentation Status */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Documentation Status</label>
                  <select 
                    value={selectedStatus}
                    onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Fully Documented">Fully Documented</option>
                    <option value="Provenance Complete">Provenance Complete</option>
                    <option value="Conservation Notes Available">Conservation Notes Available</option>
                    <option value="Under Research">Under Research</option>
                    <option value="Archive Preview">Archive Preview</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Sort Order</label>
                  <select 
                    value={selectedSort}
                    onChange={(e) => { setSelectedSort(e.target.value); }}
                    className="w-full border border-gray-200 px-2 py-2 text-xs rounded-none bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                  >
                    <option value="Featured">Featured</option>
                    <option value="Institution">Institution</option>
                    <option value="Historical Period">Historical Period</option>
                    <option value="Recently Added">Recently Added</option>
                    <option value="Country">Country</option>
                    <option value="Alphabetical">Alphabetical</option>
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* Results Area */}
          <div className={`w-full ${currentView === 'map' ? 'lg:w-full' : 'lg:w-3/4'}`}>

            {loading ? (
              <div className="py-20 text-center text-gray-505 font-serif font-bold">Loading collections...</div>
            ) : (
              <>
                {/* 1. MUSEUM GALLERY VIEW */}
                {currentView === 'gallery' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                    {paginatedCollections.map((c, i) => (
                      <div 
                        key={i} 
                        className="bg-white border-2 border-[#3E2723]/35 py-8 px-6 hover:bg-[#3E2723]/5 transition-all duration-300 group flex flex-col justify-between shadow-sm relative grid-ledger font-mono"
                      >
                        <div>
                          {/* Accession ID & Objects count header */}
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1.5 font-semibold">
                            <span>{c.accessionId}</span>
                            <span>{c.holdingsCount} OBJECTS</span>
                          </div>

                          {/* Collection Type & Country */}
                          <div className="text-[9px] font-mono text-[#D4AF37] font-bold uppercase tracking-widest mb-4">
                            MUSEUM ARCHIVE &bull; {c.country.toUpperCase()}
                          </div>

                          {/* Title */}
                          <h3 
                            onClick={() => { setActiveItem(c); setActiveModalTab('overview'); }}
                            className="text-xl md:text-2xl font-serif font-bold text-[#3E2723] leading-snug cursor-pointer group-hover:text-[#D4AF37] transition-colors"
                          >
                            {c.title}
                          </h3>

                          {c.subtitle && (
                            <h4 className="text-xs font-serif italic text-gray-500 mt-1 leading-snug mb-3">
                              {c.subtitle}
                            </h4>
                          )}

                          <p className="text-gray-655 text-xs leading-relaxed mb-4 font-sans line-clamp-3 mt-3">
                            {c.desc}
                          </p>

                          {/* Institution location info */}
                          <div className="relative pl-4 mb-4 border-l-2 border-[#D4AF37]/50 font-mono text-[10px] leading-relaxed my-4">
                            <span className="text-[9px] text-gray-400 uppercase tracking-wider block mb-1">
                              INSTITUTION STEWARD
                            </span>
                            <span className="font-bold text-[#3E2723]">
                              {c.institution} ({c.city})
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-[#3E2723]/25 text-[9px] font-mono mb-3 select-none">
                            ─────╱╲──╱────╲╱─────
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto font-mono">
                            <span className="bg-[#3E2723]/5 border border-[#3E2723]/10 text-[#3E2723] text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider">
                              {c.status.toUpperCase()}
                            </span>
                            
                            <button 
                              onClick={() => { setActiveItem(c); setActiveModalTab('overview'); }}
                              className="text-xs font-bold uppercase tracking-widest text-[#3E2723] hover:text-[#D4AF37] transition-colors font-mono"
                            >
                              Explore Collection &rarr;
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* 2. INSTITUTION VIEW */}
                {currentView === 'institution' && (
                  <div className="space-y-6 animate-fadeIn font-mono text-xs">
                    {paginatedCollections.map((c, i) => (
                      <div key={i} className="bg-white border border-[#3E2723]/15 p-6 shadow-xs relative">
                        <div className="absolute top-4 right-4 text-gray-300 font-bold font-mono text-sm">{c.accessionId}</div>
                        <h4 className="text-[#3E2723] font-serif text-lg font-bold mb-1">{c.institution}</h4>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-3">Country: {c.country} &bull; Founded: {c.founded}</p>
                        
                        <div className="bg-[#FAF9F6] border border-gray-250 p-4 mt-3">
                          <span className="text-[#3E2723] font-bold text-[10px] uppercase block mb-1">CONNECTED REPLICAS & METADATA</span>
                          <div className="text-[10px] space-y-1">
                            <div><strong className="text-gray-450 uppercase text-[8px]">Collection:</strong> {c.title}</div>
                            <div><strong className="text-gray-450 uppercase text-[8px]">Kashmir Holdings Focus:</strong> {c.focus}</div>
                            <div><strong className="text-gray-450 uppercase text-[8px]">Documented Objects:</strong> {c.holdingsCount} objects cataloged</div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[9px] text-gray-400 uppercase mt-4 pt-3 border-t border-gray-100">
                          <span>Curator Lead: {c.curator}</span>
                          <button 
                            onClick={() => { setActiveItem(c); setActiveModalTab('overview'); }}
                            className="text-[#3E2723] hover:underline font-bold"
                          >
                            Open Institutional Profile &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. RESEARCH CATALOGUE VIEW */}
                {currentView === 'catalogue' && (
                  <div className="bg-white border border-[#3E2723]/10 overflow-x-auto shadow-sm animate-fadeIn">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#3E2723] text-[#D4AF37] font-mono uppercase tracking-wider text-[10px]">
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Registry No</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Title & Focus</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Institution</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Country</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">City</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Objects</th>
                          <th className="p-4 border-b border-[#3E2723]/20 font-mono">Curator</th>
                          <th className="p-4 border-b border-[#3E2723]/20 text-center font-mono">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#3E2723]/10 font-sans text-gray-700">
                        {paginatedCollections.map((c, i) => (
                          <tr key={i} className="hover:bg-[#FAF9F6] transition-colors cursor-pointer" onClick={() => { setActiveItem(c); setActiveModalTab('overview'); }}>
                            <td className="p-4 font-mono font-bold text-gray-500 whitespace-nowrap">{c.accessionId}</td>
                            <td className="p-4">
                              <div className="font-serif font-bold text-[#3E2723] text-sm hover:text-[#D4AF37] transition-colors">{c.title}</div>
                              <div className="text-[10px] text-gray-400 font-light truncate max-w-xs">{c.focus}</div>
                            </td>
                            <td className="p-4 whitespace-nowrap">{c.institution}</td>
                            <td className="p-4 whitespace-nowrap">{c.country}</td>
                            <td className="p-4 whitespace-nowrap font-bold">{c.city}</td>
                            <td className="p-4 text-center font-mono">{c.holdingsCount}</td>
                            <td className="p-4 whitespace-nowrap font-mono">{c.curator}</td>
                            <td className="p-4 text-center whitespace-nowrap font-mono">
                              <span className="px-2 py-0.5 font-mono text-[9px] uppercase border border-[#3E2723]/20 bg-[#3E2723]/5 text-[#3E2723] font-bold">
                                {c.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 4. INTERACTIVE GLOBAL MAP VIEW */}
                {currentView === 'map' && (
                  <div className="bg-white border-2 border-[#3E2723] p-6 shadow-md animate-fadeIn font-mono text-xs">
                    <div className="border-b border-[#3E2723]/15 pb-3 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#3E2723] block mb-1">Interactive Global Collections Map</h3>
                        <p className="text-gray-500 text-[10px]">SELECT A CRAFT TO HIGHLIGHT PARTNER INSTITUTION STRENGTHS WORLDWIDE</p>
                      </div>

                      {/* Craft Selector inside map view */}
                      <div className="flex gap-2">
                        {["All", "Pashmina", "Carpet", "Papier-Mâché", "Copperware"].map((cr) => (
                          <button
                            key={cr}
                            onClick={() => { setMapSelectedCraft(cr); setMapSelectedMuseum(null); }}
                            className={`px-3 py-1.5 text-[9px] font-bold uppercase border transition-colors ${
                              mapSelectedCraft === cr 
                                ? 'bg-[#D4AF37] text-white border-[#D4AF37]' 
                                : 'bg-[#FAF9F6] text-[#3E2723] border-gray-250 hover:border-[#3E2723]'
                            }`}
                          >
                            {cr}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      
                      {/* Left: Interactive monospaced map directory */}
                      <div className="lg:col-span-7 bg-[#FAF9F6] border border-gray-250 p-4 space-y-4">
                        <span className="text-[10px] font-bold text-gray-400 block mb-2 uppercase">MAPPED MUSEUM PLOTS ({filteredMapMuseums.length})</span>
                        
                        <div className="space-y-3">
                          {filteredMapMuseums.map((mus, idx) => (
                            <div 
                              key={idx}
                              onClick={() => setMapSelectedMuseum(mus)}
                              className={`border p-3 cursor-pointer transition-all ${
                                mapSelectedMuseum?.name === mus.name 
                                  ? 'bg-[#3E2723] text-white border-[#3E2723]' 
                                  : 'bg-white hover:bg-gray-50 border-gray-200 text-[#3E2723]'
                              }`}
                            >
                              <div className="flex justify-between items-center font-bold">
                                <span>{mus.name}</span>
                                <span className={mapSelectedMuseum?.name === mus.name ? 'text-[#D4AF37]' : 'text-gray-400'}>{mus.coords}</span>
                              </div>
                              <div className={`text-[9px] mt-1 ${mapSelectedMuseum?.name === mus.name ? 'text-white/60' : 'text-gray-500'}`}>
                                Location: {mus.city}, {mus.country} &bull; Documented Holdings: {mus.holdings} objects
                              </div>
                              <div className="flex gap-1.5 mt-2 flex-wrap text-[8px] uppercase tracking-wider font-bold">
                                {mus.crafts.map((c, cIdx) => (
                                  <span key={cIdx} className={`px-1.5 py-0.5 border ${mapSelectedMuseum?.name === mus.name ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Selected Plot Metadata Detail Viewer */}
                      <div className="lg:col-span-5 bg-white border border-[#3E2723]/15 p-5 shadow-xs">
                        {mapSelectedMuseum ? (
                          <div className="space-y-4 text-[10px]">
                            <div className="border-b border-[#3E2723]/15 pb-2 mb-2">
                              <span className="text-[#D4AF37] font-bold text-[9px] block uppercase mb-0.5">PLOT SPECIFICATIONS</span>
                              <h4 className="font-serif text-base font-bold text-[#3E2723]">{mapSelectedMuseum.name}</h4>
                              <p className="text-gray-500 text-[9px]">{mapSelectedMuseum.city}, {mapSelectedMuseum.country}</p>
                            </div>

                            <div>
                              <span className="text-gray-450 uppercase block text-[8px] font-bold mb-0.5">COLLECTION STRENGTHS</span>
                              <p className="text-gray-700 font-sans leading-relaxed">{mapSelectedMuseum.strengths}</p>
                            </div>

                            <div>
                              <span className="text-gray-450 uppercase block text-[8px] font-bold mb-0.5">RELATED KHCRF RESEARCH</span>
                              <p className="text-gray-700 font-sans leading-relaxed">{mapSelectedMuseum.research}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-150">
                              <div>
                                <span className="text-gray-405 uppercase block text-[8px] font-bold">ASSOCIATED ARTISANS</span>
                                <span className="text-[#3949AB] font-bold text-[9px] block mt-0.5">{mapSelectedMuseum.artisans}</span>
                              </div>
                              <div>
                                <span className="text-gray-455 uppercase block text-[8px] font-bold">CORE TECHNIQUES</span>
                                <span className="text-gray-700 text-[9px] block mt-0.5">{mapSelectedMuseum.techniques}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-150">
                              <div>
                                <span className="text-gray-455 uppercase block text-[8px] font-bold">MOTIFS &amp; SYMBOLS</span>
                                <span className="text-gray-700 text-[9px] block mt-0.5">{mapSelectedMuseum.motifs}</span>
                              </div>
                              <div>
                                <span className="text-gray-455 uppercase block text-[8px] font-bold">KEY PUBLICATIONS</span>
                                <span className="text-gray-700 text-[9px] block mt-0.5 leading-snug">{mapSelectedMuseum.publications}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="py-20 text-center text-gray-400 italic">
                            Select a mapped museum from the directory to inspect global catalog details.
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {currentView !== 'map' && totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-gray-100 font-mono">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="w-10 h-10 border border-gray-300 flex items-center justify-center text-gray-555 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-mono"
                >
                  &larr;
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 text-sm font-bold transition-colors ${
                        currentPage === i + 1 ? 'bg-[#D4AF37] text-white' : 'border border-gray-200 text-gray-555 hover:border-[#D4AF37]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="w-10 h-10 border border-gray-305 flex items-center justify-center text-gray-555 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-mono"
                >
                  &rarr;
                </button>
              </div>
            )}
          </div>

        </section>

        {/* Museum Documentation Methodology Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-16" id="methodology">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold font-serif">
            How KHCRF Museum Archive Records Are Developed
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans">
            Museum Archive records are created through publicly available collection data, institutional collaboration where possible, scholarly literature, provenance research, conservation references, and standardized metadata. KHCRF does not replace museum catalogues; it connects and contextualizes them within the broader history of Kashmir's craft heritage.
          </p>

          <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
            Curation Workflow
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 text-xs text-gray-700 font-mono">
            {[
              { id: "01", name: "Institution identification", desc: "Selecting global repositories with historical Kashmir craft holdings." },
              { id: "02", name: "Public catalogue review", desc: "Auditing public catalog descriptions, accession codes, and data keys." },
              { id: "03", name: "Object selection", desc: "Isolating key references representing significant style shifts." },
              { id: "04", name: "Metadata standardization", desc: "Unifying varying museum coordinates and naming styles." },
              { id: "05", name: "Provenance research", desc: "Mapping historical transaction, donation, and EIC paths." },
              { id: "06", name: "Technical documentation", desc: "Documenting thread counts, dye formulas, and wood joins." },
              { id: "07", name: "Contextual interpretation", desc: "Drafting essays linking the object to local history." },
              { id: "08", name: "Cross-reference", desc: "Integrating findings into KHCRF's broader knowledge ecosystem." },
              { id: "09", name: "Editorial review", desc: "Review by independent panels and contributing researchers." },
              { id: "10", name: "Publication", desc: "Releasing records inside the federated research index." }
            ].map((step) => (
              <div key={step.id} className="border-l-2 border-[#3E2723] pl-4 py-1 font-mono">
                <span className="font-mono text-[#D4AF37] font-bold block mb-1">STAGE {step.id}</span>
                <span className="font-bold text-[#3E2723] block mb-1">{step.name}</span>
                <span className="text-gray-555 font-sans">{step.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Documentation Principles Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-12">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold font-serif font-serif">
            Documentation Principles
          </h2>
          <p className="text-gray-655 text-sm leading-relaxed mb-8 max-w-4xl font-sans">
            The archive adheres to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-xs text-gray-700 font-sans">
            {[
              "respect for museum ownership and intellectual property",
              "citation of institutional sources",
              "clear distinction between verified facts and scholarly interpretation",
              "transparent provenance reporting",
              "no reproduction of restricted images without permission",
              "standardized terminology",
              "version-controlled updates",
              "attribution of contributing institutions and researchers"
            ].map((principle, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-[#D4AF37] font-bold">▪</span>
                <span>{principle}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Research & Educational Use Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start mt-16 font-sans">
          <div className="lg:col-span-5 font-sans">
            <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold font-serif font-serif">
              Research & Educational Use
            </h2>
            <p className="text-gray-655 text-sm leading-relaxed mb-6 font-sans text-gray-550 font-medium">
              The Museum Archive supports:
            </p>
            <div className="flex flex-col gap-3 font-mono">
              <button 
                onClick={() => {
                  setActiveItem(allCollections[0]);
                  setActiveModalTab('provenance');
                }}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors text-center font-mono w-full md:w-auto"
              >
                Request Research Access
              </button>
              <a 
                href="#suggest"
                className="border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723]/5 px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors text-center font-mono w-full md:w-auto block animate-fadeIn"
              >
                Recommend a Museum Collection
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#FAF9F6] border border-[#3E2723]/10 p-6 md:p-8 font-sans">
            <h3 className="text-[#3E2723] text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-gray-100 font-mono">
              Approved Educational Frameworks
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 text-xs text-gray-700 font-sans">
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>museum studies</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>provenance research</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>conservation science</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>comparative art history</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>exhibition planning</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>digital humanities</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>cultural diplomacy</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>heritage policy</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>craft scholarship</li>
              <li className="flex items-center gap-2"><span className="text-[#D4AF37] font-bold">▪</span>university teaching</li>
            </ul>
          </div>
        </section>

        {/* Help Expand the Museum Archive Section */}
        <section className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs mt-12" id="suggest">
          <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-4 font-bold font-serif font-serif">
            Help Expand the Museum Archive
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6 font-sans">
            Museums, curators, researchers, collectors, and cultural institutions are invited to recommend collections, share corrections, or contribute additional documentation.
          </p>
          
          <div className="max-w-2xl bg-[#FAF9F6] border border-[#3E2723]/20 p-6 font-mono text-xs space-y-4">
            <h4 className="font-bold text-[#3E2723] uppercase mb-3 text-[10px]">Required Proposal Fields:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-gray-500 font-mono text-[10px]">
              <div>• Collection Title</div>
              <div>• Country</div>
              <div>• Primary Craft</div>
              <div>• Approximate Number of Objects</div>
              <div>• Public Catalogue URL</div>
              <div>• Reason for Recommendation</div>
              <div>• Supporting References</div>
              <div>• Contact Information</div>
            </div>
            
            <div className="pt-4 border-t border-[#3E2723]/10 mt-4">
              <span className="text-gray-400 block mb-2 font-sans">To submit a museum collection proposal, please email our archival desk:</span>
              <a href="mailto:museums@khcrf.org" className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-2.5 font-bold uppercase tracking-wider text-[10px] inline-block font-mono transition-colors">
                Submit a Museum Archive Proposal
              </a>
            </div>
          </div>
        </section>

        {/* Footer Statement Section */}
        <section className="border-t border-[#3E2723]/20 pt-10 text-center max-w-4xl mx-auto mt-16 font-sans">
          <blockquote className="text-gray-700 text-base md:text-lg leading-relaxed font-serif italic mb-4">
            "The KHCRF Museum Archive connects Kashmir's craft heritage across institutions, enabling a deeper understanding of objects, collections, provenance, conservation, and cultural history. By linking dispersed museum holdings into a unified research framework, the archive supports scholarship, preservation, and international collaboration while respecting the stewardship of each participating institution."
          </blockquote>
          <p className="text-gray-400 text-xs font-mono uppercase tracking-widest font-bold">
            KHCRF Registry Access Console &bull; Museum Archive Registry Division
          </p>
          <p className="text-[#D4AF37] text-[10px] uppercase font-bold mt-2 tracking-widest font-mono">
            This page represents a scholarly museum collection registry under development. Access to verified logs and raw records is reserved for supportive members.
          </p>
        </section>

      </div>
    </main>
  );
}
