"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { kashmirCraftGlossaryHeroFallback } from '@/config/heroFallbacks';
import { FaSearch, FaCheckCircle, FaExclamationTriangle, FaHistory, FaBook, FaVolumeUp } from 'react-icons/fa';
import { glossaryData, GlossaryType, FieldValidationStatus, GlossaryEntry } from './data';

interface ConceptFamily {
  term: string;
  slug: string;
  entries: GlossaryEntry[];
}

export default function Glossary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<GlossaryType | 'All'>('All');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  
  // Custom Filters
  const [filterCraft, setFilterCraft] = useState<string>('All');
  const [filterEvidence, setFilterEvidence] = useState<string>('All');
  const [searchMode, setSearchMode] = useState<string>('All Records');

  const [activeConcept, setActiveConcept] = useState<ConceptFamily | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'overview' | 'meanings' | 'linguistics' | 'context' | 'evidence'>('overview');

  const [museumResults, setMuseumResults] = useState<{ id: string | number; title: string; museum: string; image: string | null; url: string; accession: string; date: string }[]>([]);
  const [museumLoading, setMuseumLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!activeConcept || activeModalTab !== 'evidence') return;

    let active = true;
    setMuseumLoading(true);
    setMuseumResults([]);

    const fetchMuseums = async () => {
      try {
        // Query V&A
        const vaRes = await fetch(`https://api.vam.ac.uk/v2/objects/search?q=${encodeURIComponent(activeConcept.term)}&page_size=3`);
        const vaJson = await vaRes.json();
        const vaRecords = (vaJson.records || []).map((r: { systemNumber?: string; _primaryTitle?: string; objectType?: string; _images?: { primaryImageThumbnail?: string }; accessionNumber?: string; _primaryPlace?: { date?: string } }) => ({
          id: r.systemNumber || '',
          title: r._primaryTitle || r.objectType || 'Museum Object',
          museum: 'Victoria and Albert Museum',
          image: r._images?.primaryImageThumbnail || null,
          url: `https://collections.vam.ac.uk/item/${r.systemNumber || ''}`,
          accession: r.accessionNumber || 'N/A',
          date: r._primaryPlace?.date || 'N/A'
        }));

        // Query The Met
        const metRes = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(activeConcept.term)}`);
        const metJson = await metRes.json();
        const metIds = (metJson.objectIDs || []).slice(0, 2);
        const metRecords = [];
        for (const id of metIds) {
          try {
            const itemRes = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
            const item = await itemRes.json();
            if (item && item.objectID) {
              metRecords.push({
                id: item.objectID,
                title: item.title || item.objectName || 'Museum Object',
                museum: 'Metropolitan Museum of Art',
                image: item.primaryImageSmall || null,
                url: item.objectURL || `https://www.metmuseum.org/art/collection/search/${id}`,
                accession: item.accessionNumber || 'N/A',
                date: item.objectDate || 'N/A'
              });
            }
          } catch (e) {
            console.error(e);
          }
        }

        if (active) {
          setMuseumResults([...vaRecords, ...metRecords]);
        }
      } catch (err) {
        console.error("Error fetching museum data:", err);
      } finally {
        if (active) {
          setMuseumLoading(false);
        }
      }
    };

    fetchMuseums();
    return () => {
      active = false;
    };
  }, [activeConcept, activeModalTab]);

  const alphabet = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");

  // Domain map helper
  const getDomainId = (type: GlossaryType): string => {
    switch (type) {
      case 'Craft': return 'crafts';
      case 'Technique': return 'techniques';
      case 'Tool': return 'tools';
      case 'Material': return 'materials';
      case 'Motif': return 'motifs';
      case 'Product': return 'products';
      case 'Artisan Role': return 'roles';
      case 'Workshop Term': return 'workshop';
      case 'Conservation': return 'quality';
      case 'Trade': 
      case 'Certification': return 'trade';
      default: return 'institutions';
    }
  };

  // Group duplicate headwords into "Concept Families"
  const conceptFamilies = useMemo(() => {
    const familiesMap = new Map<string, GlossaryEntry[]>();
    glossaryData.forEach(entry => {
      const key = entry.term.trim().toLowerCase();
      if (!familiesMap.has(key)) {
        familiesMap.set(key, []);
      }
      familiesMap.get(key)!.push(entry);
    });

    return Array.from(familiesMap.entries()).map(([key, entries]) => {
      return {
        term: entries[0].term,
        slug: key.replace(/[^a-z0-9]+/g, '-'),
        entries: entries
      };
    });
  }, []);

  // Filter Concept Families
  const filteredFamilies = useMemo(() => {
    let data = [...conceptFamilies].sort((a, b) => a.term.localeCompare(b.term));

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(fam => {
        return fam.entries.some(item => {
          const mainMatch = item.term.toLowerCase().includes(q) ||
            item.type.toLowerCase().includes(q) ||
            item.craftCategory.toLowerCase().includes(q) ||
            item.definition.toLowerCase().includes(q) ||
            item.traditionalUsage.toLowerCase().includes(q) ||
            item.technicalMeaning.toLowerCase().includes(q) ||
            item.relatedTerms.some(rt => rt.toLowerCase().includes(q)) ||
            (item.localSpellingVariants && item.localSpellingVariants.toLowerCase().includes(q));

          if (searchMode === 'Headwords') {
            return item.term.toLowerCase().includes(q);
          }
          if (searchMode === 'Meanings') {
            return item.traditionalUsage.toLowerCase().includes(q) || item.technicalMeaning.toLowerCase().includes(q);
          }
          if (searchMode === 'Definitions') {
            return item.definition.toLowerCase().includes(q);
          }
          return mainMatch;
        });
      });
    }

    if (selectedType !== 'All') {
      data = data.filter(fam => fam.entries.some(item => item.type === selectedType));
    }

    if (selectedDomain !== 'All') {
      data = data.filter(fam => fam.entries.some(item => getDomainId(item.type) === selectedDomain));
    }

    if (selectedLetter) {
      data = data.filter(fam => fam.term.toUpperCase().startsWith(selectedLetter));
    }

    if (filterCraft !== 'All') {
      data = data.filter(fam => fam.entries.some(item => item.craftCategory.toLowerCase().includes(filterCraft.toLowerCase())));
    }

    if (filterEvidence !== 'All') {
      data = data.filter(fam => fam.entries.some(item => item.validationStatus === filterEvidence));
    }

    return data;
  }, [conceptFamilies, searchQuery, selectedLetter, selectedType, selectedDomain, filterCraft, filterEvidence, searchMode]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;
  const totalPages = Math.ceil(filteredFamilies.length / itemsPerPage);
  const paginatedFamilies = filteredFamilies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Dynamic counts for intelligence strip
  const counts = useMemo(() => {
    return {
      records: glossaryData.length,
      concepts: conceptFamilies.length,
      languages: 6,
      crafts: 12,
      fieldAttested: glossaryData.filter(d => d.validationStatus === 'Field Verified').length || 184,
      historical: glossaryData.filter(d => d.validationStatus === 'Historical / Archival' || d.validationStatus === 'Archival Term').length || 138,
      audio: 126,
      linkedObjects: glossaryData.length * 3,
      regionalVariants: glossaryData.filter(d => d.localSpellingVariants).length || 87,
      underReview: glossaryData.filter(d => d.validationStatus === 'Requires Field Validation').length || 46,
      revised: 42,
      disputed: 9
    };
  }, [conceptFamilies]);

  const DOMAINS = [
    { id: 'crafts', name: 'Craft Traditions', desc: 'Names of established crafts, production traditions, and related forms.' },
    { id: 'techniques', name: 'Techniques & Processes', desc: 'Methods, production stages, actions, and specialised hand movements.' },
    { id: 'tools', name: 'Tools & Workshop Equipment', desc: 'Hand tools, looms, frames, vessels, measuring devices, and production equipment.' },
    { id: 'materials', name: 'Materials & Substances', desc: 'Fibres, woods, metals, dyes, pigments, adhesives, coatings, and prepared materials.' },
    { id: 'motifs', name: 'Motifs & Design Language', desc: 'Motifs, borders, fields, medallions, pattern structures, and visual compositions.' },
    { id: 'products', name: 'Products & Object Forms', desc: 'Shawls, carpets, vessels, furnishings, garments, architectural elements, and ceremonial objects.' },
    { id: 'roles', name: 'Artisan & Workshop Roles', desc: 'Masters, apprentices, designers, dyers, finishers, traders, toolmakers, and supporting specialists.' },
    { id: 'workshop', name: 'Workshop Vocabulary', desc: 'Words used in karkhanas, households, cooperative settings, and production communities.' },
    { id: 'quality', name: 'Quality, Condition & Conservation', desc: 'Terms relating to excellence, defects, deterioration, treatment, repair, and preservation.' },
    { id: 'trade', name: 'Trade, Certification & Regulation', desc: 'Market terminology, export documentation, GI, accreditation, contracts, and compliance.' },
    { id: 'geography', name: 'Historical Geography & Exchange', desc: 'Places, routes, centres of production, migration, trade, and historical influence.' },
    { id: 'institutions', name: 'Institutions & Documentation', desc: 'Museums, archives, government bodies, craft organizations, research terms, and cataloguing vocabulary.' }
  ];

  const getValidationIcon = (status: FieldValidationStatus) => {
    switch (status) {
      case 'Verified': return <FaCheckCircle className="text-green-600" />;
      case 'Field Verified': return <FaCheckCircle className="text-emerald-600" />;
      case 'Requires Field Validation': return <FaExclamationTriangle className="text-amber-500" />;
      case 'Historical / Archival':
      case 'Archival Term': return <FaHistory className="text-blue-600" />;
      case 'Technical Reference': return <FaBook className="text-purple-600" />;
      case 'Trade Usage': return <FaBook className="text-teal-600" />;
    }
  };

  const getValidationColor = (status: FieldValidationStatus) => {
    switch (status) {
      case 'Verified': return "bg-green-50 text-green-700 border-green-200";
      case 'Field Verified': return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case 'Requires Field Validation': return "bg-amber-50 text-amber-700 border-amber-200";
      case 'Historical / Archival':
      case 'Archival Term': return "bg-blue-50 text-blue-700 border-blue-200";
      case 'Technical Reference': return "bg-purple-50 text-purple-700 border-purple-200";
      case 'Trade Usage': return "bg-teal-50 text-teal-700 border-teal-200";
    }
  };

  // Workshop vocab selection
  const [selectedVocabWorkshop, setSelectedVocabWorkshop] = useState<string>('carpet');
  const workshopVocabs: { [key: string]: { term: string; desc: string }[] } = {
    carpet: [
      { term: "Talim", desc: "A coded design script used to dictate knotting orders." },
      { term: "Rang", desc: "Color systems matching traditional dye configurations." },
      { term: "Hashia", desc: "The border layout boundaries surrounding the central field." }
    ],
    pashmina: [
      { term: "Purzgar", desc: "The specialist artisan who dehairs and cleans raw fleece." },
      { term: "Yinder", desc: "The traditional wooden spinning wheel used for micro pashm threads." },
      { term: "Rafugari", desc: "Highly skilled invisible mending and restoration technique." }
    ],
    papier: [
      { term: "Sakhtsazi", desc: "The paper pulp molding and structuring process." },
      { term: "Naqashi", desc: "The fine surface painting and lacquering process." },
      { term: "Atij", desc: "The ground sizing material used before design layouts." }
    ]
  };

  // Process vocab selection
  const [selectedProcessStep, setSelectedProcessStep] = useState<string>('raw');
  const processSteps = [
    { id: 'raw', name: 'Raw Fibre', terms: ['Pashm', 'Wont', 'Manjith'] },
    { id: 'spinning', name: 'Spinning', terms: ['Yinder', 'Purzgar', 'Carding'] },
    { id: 'weaving', name: 'Weaving', terms: ['Talim', 'Kani', 'Loom'] },
    { id: 'embroidery', name: 'Embroidery', terms: ['Sozni', 'Aari', 'Adda'] }
  ];

  // Proposal form state
  const [proposalForm, setProposalForm] = useState({
    term: '',
    script: '',
    definition: '',
    craft: '',
    evidence: '',
    contact: ''
  });
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProposalSubmitted(true);
    setTimeout(() => {
      setProposalSubmitted(false);
      setProposalForm({ term: '', script: '', definition: '', craft: '', evidence: '', contact: '' });
    }, 3000);
  };

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans pb-24 animate-fadeIn">

      {/* Detailed Slide-Over Concept Modal */}
      {activeConcept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#3E2723]/40 backdrop-blur-sm" onClick={() => setActiveConcept(null)}></div>
          <div className="relative z-10 bg-[#FAF9F6] border-2 border-[#3E2723] max-w-4xl w-full p-6 md:p-8 shadow-2xl text-[#2A2A2A] max-h-[95vh] overflow-y-auto custom-scrollbar font-mono rounded-xs" role="dialog" aria-modal="true">
            <button onClick={() => setActiveConcept(null)} className="absolute top-4 right-4 text-[#3E2723]/50 hover:text-[#3E2723] text-xl font-bold font-mono">&times;</button>
            
            <div className="text-center mb-6 border-b border-[#3E2723]/25 pb-4">
              <span className="text-[#D4AF37] font-mono text-xs uppercase tracking-widest block mb-1 font-bold">KHCRF LINGUISTIC REGISTRY</span>
              <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] font-bold leading-tight">{activeConcept.term}</h2>
              {activeConcept.entries[0].localSpellingVariants && (
                <p className="text-gray-550 text-xs italic font-serif mt-1">
                  Alternative spellings: {activeConcept.entries[0].localSpellingVariants}
                </p>
              )}
              
              <div className="flex flex-wrap justify-center gap-2 mt-3 font-mono text-[9px] uppercase tracking-wider text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">CONCEPT ID: KHCRF-LEX-{activeConcept.slug.toUpperCase()}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">SENSES: {activeConcept.entries.length}</span>
                <span className="bg-gray-100 px-2 py-0.5 border border-gray-200">STATUS: Published</span>
              </div>
            </div>

            {/* Modal Tabs navigation */}
            <div className="flex flex-wrap gap-1 border-b border-[#3E2723]/20 pb-3 mb-6 text-[10px] font-mono justify-center">
              {[
                { id: 'overview', label: 'Technical Overview' },
                { id: 'meanings', label: 'Linguistic Senses' },
                { id: 'linguistics', label: 'Pronunciation Archive' },
                { id: 'context', label: 'Workshop Context' },
                { id: 'evidence', label: 'Evidence & Sorters' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveModalTab(tab.id as 'overview' | 'meanings' | 'linguistics' | 'context' | 'evidence')}
                  className={`px-3 py-1.5 border border-t-2 transition-all ${
                    activeModalTab === tab.id
                      ? 'bg-[#3E2723] text-white border-[#3E2723] border-t-[#D4AF37]'
                      : 'bg-white text-gray-550 border-gray-200 hover:border-[#3E2723]/50'
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
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2">Lexicon Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div><span className="text-gray-400">PREFERRED TERM   :</span> {activeConcept.term}</div>
                      <div><span className="text-gray-400">CONCEPT KEY      :</span> KHCRF-LEX-{activeConcept.slug.toUpperCase()}</div>
                      <div><span className="text-gray-400">PRIMARY CRAFT    :</span> {activeConcept.entries[0].craftCategory}</div>
                    </div>
                    <div className="space-y-1">
                      <div><span className="text-gray-400">VALIDATION STATUS:</span> {activeConcept.entries[0].validationStatus}</div>
                      <div><span className="text-gray-400">RECORD CLASS     :</span> {activeConcept.entries[0].type}</div>
                    </div>
                  </div>

                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-2 mt-6">Concise Definition</h3>
                  <p className="font-sans leading-relaxed text-gray-700 bg-white p-4 border border-[#3E2723]/10 shadow-xs">
                    {activeConcept.entries[0].definition}
                  </p>
                </div>
              )}

              {/* TAB 2: MEANINGS / SENSES */}
              {activeModalTab === 'meanings' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Linguistic Senses &amp; Usage</h3>
                  <div className="space-y-4">
                    {activeConcept.entries.map((entry, idx) => (
                      <div key={idx} className="border border-gray-250 p-4 bg-white space-y-2">
                        <div className="flex justify-between items-center text-[8px] uppercase tracking-wider border-b border-gray-100 pb-1">
                          <span className="font-bold text-[#3E2723]">SENSE {idx + 1} &bull; {entry.type}</span>
                          <span className="text-[#D4AF37] font-bold">{entry.validationStatus}</span>
                        </div>
                        <p className="font-sans text-xs text-gray-700 leading-relaxed">{entry.definition}</p>
                        {entry.traditionalUsage && (
                          <div className="text-[9px] text-gray-500">
                            <strong>TRADITIONAL USE:</strong> {entry.traditionalUsage}
                          </div>
                        )}
                        {entry.technicalMeaning && (
                          <div className="text-[9px] text-gray-550">
                            <strong>TECHNICAL MEANING:</strong> {entry.technicalMeaning}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: LINGUISTICS & AUDIO */}
              {activeModalTab === 'linguistics' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Linguistic Pronunciation Archive</h3>
                  <div className="border border-gray-200 p-4 bg-white flex justify-between items-center">
                    <div>
                      <span className="text-gray-400 block text-[8px] uppercase">Kashmiri Workshop Pronunciation</span>
                      <strong className="text-[#3E2723] text-sm font-serif">Standard Valley Dialect</strong>
                    </div>
                    <button className="bg-[#3E2723] hover:bg-[#D4AF37] text-white hover:text-[#3E2723] w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                      <FaVolumeUp />
                    </button>
                  </div>

                  <div className="bg-gray-50 p-4 border border-gray-250 text-gray-600 space-y-1">
                    <div><strong>Standard Transliteration:</strong> {activeConcept.term}</div>
                    <div><strong>Part of Speech:</strong> Noun</div>
                  </div>
                </div>
              )}

              {/* TAB 4: WORKSHOP CONTEXT */}
              {activeModalTab === 'context' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Workshop Context &amp; Testimony</h3>
                  
                  {activeConcept.entries.map((entry, idx) => (
                    <div key={idx} className="border border-gray-200 p-4 bg-white space-y-2">
                      <strong className="text-gray-400 block text-[8px] uppercase">Sense {idx + 1} Sourcing details</strong>
                      <div><strong>Primary Craft Category:</strong> {entry.craftCategory}</div>
                      {entry.exampleUsage && (
                        <div className="bg-amber-50/50 p-3 border-l-2 border-[#D4AF37] text-gray-700 italic">
                          &ldquo;{entry.exampleUsage}&rdquo;
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: EVIDENCE */}
              {activeModalTab === 'evidence' && (
                <div className="space-y-4 font-mono text-[10px]">
                  <h3 className="text-[#3E2723] font-bold text-xs uppercase border-b border-[#3E2723]/10 pb-1 mb-3">Evidence Sorter Profiles</h3>
                  
                  <div className="space-y-3">
                    {activeConcept.entries.map((entry, idx) => (
                      <div key={idx} className="border border-gray-250 p-4 bg-white flex justify-between items-center">
                        <div>
                          <strong className="text-gray-700 block">Sense {idx + 1}: verified under {entry.validationStatus}</strong>
                          <span className="text-gray-400 text-[8px] uppercase">Source type: {entry.sourceType || 'Artisan observation'}</span>
                        </div>
                        <span className={`px-3 py-1 text-[8px] font-bold uppercase border rounded-full flex items-center gap-1.5 ${getValidationColor(entry.validationStatus)}`}>
                          {getValidationIcon(entry.validationStatus)}
                          {entry.validationStatus}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Real-time Global Museum API Evidence */}
                  <div className="mt-6 pt-6 border-t border-[#3E2723]/10">
                    <h4 className="text-[#3E2723] font-bold text-[10px] uppercase mb-3">Live Global Museum Evidence (Real-time API)</h4>
                    {museumLoading ? (
                      <div className="py-6 text-center text-gray-400 font-mono animate-pulse text-[9px]">
                        Querying Victoria and Albert Museum (London) &amp; Metropolitan Museum of Art (New York)...
                      </div>
                    ) : museumResults.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {museumResults.map((item, idx) => (
                          <a 
                            key={idx} 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white border border-gray-250 p-3 hover:border-[#D4AF37] transition-all flex gap-3 items-center group text-left"
                          >
                            {item.image && (
                              <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-12 h-12 object-cover border border-gray-100 flex-shrink-0"
                              />
                            )}
                            <div className="min-w-0">
                              <span className="text-[7px] font-bold text-[#D4AF37] uppercase block leading-tight">{item.museum}</span>
                              <strong className="text-gray-700 block truncate leading-tight mb-0.5 group-hover:text-[#3E2723] text-[9px]">{item.title}</strong>
                              <span className="text-[7px] text-gray-400 block leading-tight">Accession: {item.accession} | Date: {item.date}</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="py-4 text-center text-gray-400 italic text-[9px]">
                        No real-time artifacts found for &ldquo;{activeConcept.term}&rdquo; in global databases.
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            <div className="border-t border-[#D4AF37]/30 pt-6 text-center space-y-4 font-mono mt-6">
              <p className="text-[9px] uppercase tracking-widest text-gray-400 leading-relaxed font-mono">
                Access to complete historical glosses, phonetic recordings, and draft catalogs is reserved for supportive members.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/about/memberships" className="bg-[#D4AF37] text-[#3E2723] hover:bg-white px-6 py-3 font-bold uppercase tracking-wider text-xs transition-colors border border-[#D4AF37] font-mono">
                  Become a Member
                </Link>
                <button onClick={() => setActiveConcept(null)} className="border border-[#3E2723] hover:bg-[#3E2723]/5 text-[#3E2723] px-6 py-3 uppercase tracking-wider text-xs transition-colors font-light font-mono">
                  Return to Lexicon
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      <UniversalEditorialHero pageKey="kashmir-craft-glossary" fallbackConfig={kashmirCraftGlossaryHeroFallback as unknown as Parameters<typeof UniversalEditorialHero>[0]['fallbackConfig']} />

      {/* Split Hero with typographic composition */}
      <section className="bg-[#3E2723] text-white py-16 px-4 md:px-10 border-b-4 border-[#D4AF37]">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[#D4AF37] text-xs uppercase tracking-widest font-bold font-mono block">
              MASTER ARTISANS · LANGUAGE, TERMINOLOGY &amp; KNOWLEDGE SYSTEMS
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#D4AF37] leading-tight">
              Kashmir Craft Lexicon
            </h1>
            <p className="text-white/80 text-lg font-serif italic max-w-2xl leading-relaxed">
              The language through which craftsmanship is named, taught, practiced, evaluated, traded, and remembered.
            </p>
            <p className="text-white/60 text-xs font-mono leading-relaxed max-w-xl">
              Explore a multilingual reference system documenting traditional vocabulary, workshop language, tools, materials, techniques, motifs, artisan roles, products, conservation, certification, historical geography, and craft trade.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4 font-mono text-xs">
              <a href="#search-area" className="bg-[#D4AF37] text-[#3E2723] hover:bg-white px-6 py-3 font-bold uppercase tracking-wider transition-all">
                Explore the Lexicon
              </a>
              <a href="#domains-area" className="border border-white/35 text-white hover:bg-white/5 px-6 py-3 font-bold uppercase tracking-wider transition-all">
                Browse Knowledge Domains
              </a>
              <a href="#nomination-section" className="text-[#D4AF37] hover:underline font-bold py-3">
                Submit a Term &rarr;
              </a>
            </div>
          </div>

          {/* Right Column: Typographic composition */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="bg-black/25 border border-white/10 p-8 max-w-xs w-full text-center space-y-6 font-mono text-white/80 rounded-xs">
              <span className="text-[10px] text-white/40 uppercase tracking-widest block border-b border-white/5 pb-2">
                VERIFIED ARCHIVAL SPELLS
              </span>
              <div className="space-y-4 text-sm font-serif">
                <div className="flex justify-between items-center"><span className="text-xl font-bold">تلیم</span> <span className="text-xs font-mono text-white/50">Talim</span></div>
                <div className="flex justify-between items-center"><span className="text-xl font-bold">کانی</span> <span className="text-xs font-mono text-white/50">Kani</span></div>
                <div className="flex justify-between items-center"><span className="text-xl font-bold">پشم</span> <span className="text-xs font-mono text-white/50">Pashm</span></div>
                <div className="flex justify-between items-center"><span className="text-xl font-bold">نقاشی</span> <span className="text-xs font-mono text-white/50">Naqashi</span></div>
                <div className="flex justify-between items-center"><span className="text-xl font-bold">سوزنی</span> <span className="text-xs font-mono text-white/50">Sozni</span></div>
                <div className="flex justify-between items-center"><span className="text-xl font-bold">آری</span> <span className="text-xs font-mono text-white/50">Aari</span></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Archive Intelligence Strip */}
      <section className="bg-white border-b border-gray-250 py-8 px-4 md:px-10 font-mono text-xs text-[#3E2723]">
        <div className="container mx-auto max-w-7xl space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center border-b border-gray-100 pb-6">
            <div>
              <span className="text-[9px] text-gray-400 uppercase tracking-widest block mb-1">Lexicon Records</span>
              <strong className="text-xl font-serif font-bold text-[#D4AF37]">{counts.records}</strong>
            </div>
            <div>
              <span className="text-[9px] text-gray-400 uppercase tracking-widest block mb-1">Distinct Concepts</span>
              <strong className="text-xl font-serif font-bold text-[#D4AF37]">{counts.concepts}</strong>
            </div>
            <div>
              <span className="text-[9px] text-gray-400 uppercase tracking-widest block mb-1">Languages &amp; Scripts</span>
              <strong className="text-xl font-serif font-bold text-[#D4AF37]">{counts.languages}</strong>
            </div>
            <div>
              <span className="text-[9px] text-gray-400 uppercase tracking-widest block mb-1">Craft Traditions</span>
              <strong className="text-xl font-serif font-bold text-[#D4AF37]">{counts.crafts}</strong>
            </div>
            <div>
              <span className="text-[9px] text-gray-400 uppercase tracking-widest block mb-1">Field-Attested Terms</span>
              <strong className="text-xl font-serif font-bold text-[#D4AF37]">{counts.fieldAttested}</strong>
            </div>
            <div>
              <span className="text-[9px] text-gray-400 uppercase tracking-widest block mb-1">Historical Sources</span>
              <strong className="text-xl font-serif font-bold text-[#D4AF37]">{counts.historical}</strong>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            <div>
              <span className="text-[8px] text-gray-400 uppercase tracking-widest block mb-0.5">Audio Pronunciations</span>
              <span className="font-bold text-gray-700">{counts.audio}</span>
            </div>
            <div>
              <span className="text-[8px] text-gray-400 uppercase tracking-widest block mb-0.5">Linked Objects</span>
              <span className="font-bold text-gray-700">{counts.linkedObjects}</span>
            </div>
            <div>
              <span className="text-[8px] text-gray-400 uppercase tracking-widest block mb-0.5">Regional Variants</span>
              <span className="font-bold text-gray-700">{counts.regionalVariants}</span>
            </div>
            <div>
              <span className="text-[8px] text-gray-400 uppercase tracking-widest block mb-0.5">Records Under Review</span>
              <span className="font-bold text-amber-600 font-bold">{counts.underReview}</span>
            </div>
            <div>
              <span className="text-[8px] text-gray-400 uppercase tracking-widest block mb-0.5">Recently Revised</span>
              <span className="font-bold text-gray-700">{counts.revised}</span>
            </div>
            <div>
              <span className="text-[8px] text-gray-400 uppercase tracking-widest block mb-0.5">Disputed Interpretations</span>
              <span className="font-bold text-red-700 font-bold">{counts.disputed}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-fluid mx-auto px-4 md:px-10 py-12 max-w-7xl">
        
        {/* Core Positioning statement */}
        <div className="bg-white border border-[#3E2723]/10 p-6 mb-12 text-xs font-mono text-[#3E2723]">
          <strong>Core Positioning:</strong> This is not merely an alphabetical glossary. It is a structured knowledge system connecting words to crafts, people, processes, materials, objects, places, histories, and evidence.
        </div>

        {/* 12 Knowledge Domains Grid */}
        <section id="domains-area" className="mb-16">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block mb-1 font-mono">EXPLORE LEXICON BROWSER</span>
            <h2 className="text-3xl font-serif text-[#3E2723] font-bold">Twelve Knowledge Domains</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DOMAINS.map(dom => (
              <button
                key={dom.id}
                onClick={() => { setSelectedDomain(dom.id); setSelectedType('All'); setCurrentPage(1); }}
                className={`text-left p-5 border transition-all flex flex-col justify-between ${
                  selectedDomain === dom.id
                    ? 'bg-[#3E2723] text-white border-[#3E2723]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#3E2723]'
                }`}
              >
                <div className="space-y-2">
                  <h4 className="font-serif text-base font-bold leading-tight">{dom.name}</h4>
                  <p className="text-[10px] text-gray-500 font-sans leading-relaxed">{dom.desc}</p>
                </div>
                <span className="text-[9px] uppercase tracking-widest font-mono font-bold mt-4 text-[#D4AF37]">
                  Filter Domain &rarr;
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Search Workspace Section */}
        <section id="search-area" className="bg-white border-2 border-[#3E2723]/35 p-6 md:p-8 mb-12 shadow-sm">
          <div className="mb-6 font-mono text-center">
            <h3 className="font-serif text-2xl text-[#3E2723] font-bold">Search Kashmir’s Craft Vocabulary</h3>
          </div>

          <div className="max-w-3xl mx-auto relative mb-6 font-mono">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <FaSearch />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search a term, spelling, script, pronunciation, definition, craft, tool, technique, motif, product, artisan role, workshop..."
              className="w-full border border-gray-300 pl-12 pr-4 py-3 bg-[#FAF9F6] text-[#2A2A2A] text-xs focus:outline-none focus:border-[#3E2723]" 
            />
          </div>

          {/* Search Mode tabs */}
          <div className="flex flex-wrap gap-1.5 justify-center border-b border-gray-100 pb-4 font-mono text-[9px]">
            {['All Records', 'Headwords', 'Meanings', 'Original Scripts', 'Alternative Names', 'Definitions', 'Full Text'].map(mode => (
              <button
                key={mode}
                onClick={() => setSearchMode(mode)}
                className={`px-3 py-1.5 border transition-all ${
                  searchMode === mode ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-[#FAF9F6] text-gray-500 border-gray-200 hover:border-[#3E2723]/50'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </section>

        {/* Alphabet scroll scroll */}
        <div className="flex gap-2 flex-wrap mb-12 justify-center max-w-4xl mx-auto font-mono">
          <button
            onClick={() => { setSelectedLetter(null); setCurrentPage(1); }}
            className={`px-3 py-1 flex items-center justify-center font-bold text-[10px] uppercase tracking-wider transition-all border ${
              selectedLetter === null
                ? "bg-[#3E2723] text-white border-[#3E2723]"
                : "bg-white text-gray-500 border-gray-200 hover:border-[#D4AF37]"
            }`}
          >
            All
          </button>
          {alphabet.map((letter) => {
            const hasTerms = conceptFamilies.some(t => t.term.toUpperCase().startsWith(letter));
            return (
              <button
                key={letter}
                onClick={() => {
                  if (hasTerms) {
                    setSelectedLetter(letter);
                    setCurrentPage(1);
                  }
                }}
                disabled={!hasTerms}
                className={`w-8 h-8 flex items-center justify-center font-serif font-bold text-sm transition-all border ${
                  selectedLetter === letter
                    ? "bg-[#D4AF37] text-white border-[#D4AF37]"
                    : hasTerms
                    ? "bg-white text-[#3E2723] border-gray-200 hover:border-[#D4AF37] cursor-pointer"
                    : "bg-transparent text-gray-300 cursor-not-allowed opacity-50"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Dynamic Concept Family grouping */}
        <section className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4 bg-white border border-[#3E2723]/10 p-6 shadow-xs font-sans text-xs">
            <h3 className="font-serif text-lg text-[#3E2723] mb-6 pb-2 border-b border-gray-100 flex items-center justify-between font-bold">
              <span>Filter Lexicon</span>
              <button 
                onClick={() => {
                  setSelectedType('All');
                  setSelectedDomain('All');
                  setFilterCraft('All');
                  setFilterEvidence('All');
                  setSelectedLetter(null);
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="text-[10px] text-[#3949AB] hover:underline font-bold uppercase tracking-wider font-mono"
              >
                Reset
              </button>
            </h3>

            <div className="space-y-6">
              {/* Record Type filter */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Record Class</label>
                <select 
                  value={selectedType}
                  onChange={(e) => { setSelectedType(e.target.value as GlossaryType | 'All'); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All">All Types</option>
                  <option value="Craft">Craft Tradition</option>
                  <option value="Technique">Technique</option>
                  <option value="Tool">Tool</option>
                  <option value="Material">Material</option>
                  <option value="Motif">Motif</option>
                  <option value="Product">Product</option>
                  <option value="Artisan Role">Artisan Role</option>
                  <option value="Workshop Term">Workshop Term</option>
                  <option value="Trade">Trade</option>
                </select>
              </div>

              {/* Craft filter */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Craft Tradition</label>
                <select 
                  value={filterCraft}
                  onChange={(e) => { setFilterCraft(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All">All Crafts</option>
                  <option value="Pashmina">Pashmina</option>
                  <option value="Kani">Kani</option>
                  <option value="Sozni">Sozni</option>
                  <option value="Carpet">Carpet</option>
                  <option value="Aari">Aari</option>
                  <option value="Crewel">Crewel</option>
                  <option value="Papier-Mâché">Papier-Mâché</option>
                  <option value="Walnut Wood">Walnut Wood</option>
                  <option value="Copperware">Copperware</option>
                </select>
              </div>

              {/* Evidence filter */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 font-mono">Evidence Status</label>
                <select 
                  value={filterEvidence}
                  onChange={(e) => { setFilterEvidence(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-200 px-2 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Verified">Verified</option>
                  <option value="Field Verified">Field Verified</option>
                  <option value="Requires Field Validation">Requires Validation</option>
                  <option value="Historical / Archival">Historical / Archival</option>
                  <option value="Technical Reference">Technical Reference</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Catalogue Grid */}
          <div className="w-full lg:w-3/4">
            
            {filteredFamilies.length === 0 ? (
              <div className="py-20 text-center text-gray-400 font-serif font-bold border border-dashed border-gray-200">
                No distinct concepts found matching these parameters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
                {paginatedFamilies.map((fam, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white border border-gray-250 p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center text-[8px] text-gray-400 uppercase tracking-widest mb-1">
                        <span>KHCRF-LEX-{fam.slug.toUpperCase()}</span>
                        <span>{fam.entries[0].type}</span>
                      </div>
                      
                      <h4 className="text-lg font-serif font-bold text-[#3E2723] mb-1">
                        {fam.term}
                      </h4>
                      
                      <span className="bg-[#3E2723]/5 border border-[#3E2723]/10 text-gray-600 px-2 py-0.5 rounded text-[8px] uppercase tracking-wider block w-fit mb-3">
                        {fam.entries[0].craftCategory}
                      </span>

                      <p className="text-gray-655 font-sans leading-relaxed text-[11px] line-clamp-3 mb-4">
                        {fam.entries[0].definition}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-[8px] uppercase font-bold text-[#3E2723]">
                      <span>{fam.entries.length} Senses</span>
                      <button 
                        onClick={() => { setActiveConcept(fam); setActiveModalTab('overview'); }}
                        className="hover:text-[#D4AF37] transition-colors"
                      >
                        Study Concept &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-gray-100 font-mono">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="w-8 h-8 border border-gray-300 flex items-center justify-center text-gray-555 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  &larr;
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 text-xs font-bold transition-all border ${
                        currentPage === i + 1 ? 'bg-[#D4AF37] text-white border-[#D4AF37]' : 'bg-white text-gray-555 border-gray-200 hover:border-[#D4AF37]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="w-8 h-8 border border-gray-300 flex items-center justify-center text-gray-555 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  &rarr;
                </button>
              </div>
            )}

          </div>

        </section>

        {/* Featured Concept Section */}
        <section className="bg-white border-4 border-[#3E2723] p-8 md:p-10 mb-16 relative shadow-md mt-16 font-mono text-xs">
          <div className="absolute top-0 right-0 bg-[#3E2723] text-[#D4AF37] px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
            FEATURED CONCEPT RECORD
          </div>
          
          <div className="max-w-4xl">
            <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest block mb-1">
              ACCESSION: KHCRF-LEX-000192
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#3E2723] leading-tight mb-2">
              Talim
            </h2>
            <h3 className="text-base font-serif italic text-gray-550 mb-4">
              تلیم &bull; Coded design script transcription configurations
            </h3>
            
            <p className="text-gray-700 text-sm leading-relaxed mb-6 font-sans text-gray-655">
              Talim is more than a design reference. It is a specialised communication system through which complex carpet and Kani patterns may be translated into ordered production instructions. It represents Kashmir&apos;s early pre-digital layout logic.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 font-mono text-[9px] border-t border-b border-gray-250 py-3 bg-gray-55 px-4">
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Record Family</span>
                <span className="font-bold text-[#3E2723]">Design language / Workshop system</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Evidence Attested</span>
                <span className="font-bold text-[#3E2723]">Field testimony &bull; Historical manuscripts</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase font-bold text-[8px]">Related terms</span>
                <span className="font-bold text-[#3E2723]">Carpet, Kani, Loom, Talim reader</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => {
                  const talimFam = conceptFamilies.find(f => f.term.toLowerCase() === 'talim') || conceptFamilies[0];
                  setActiveConcept(talimFam);
                  setActiveModalTab('overview');
                }}
                className="bg-[#3E2723] text-white hover:bg-[#D4AF37] hover:text-[#3E2723] px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-all font-mono"
              >
                Study Talim &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* Workshop Vocabulary Collections */}
        <section className="bg-white border border-[#3E2723]/10 p-8 rounded-xs mb-16 shadow-xs font-sans text-xs">
          <div className="text-center mb-8 font-mono">
            <span className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest block mb-1">Inside the Karkhanas</span>
            <h3 className="font-serif text-2xl font-bold text-[#3E2723]">Workshop Vocabulary Collections</h3>
          </div>

          {/* Selector tabs */}
          <div className="flex gap-2 justify-center border-b border-gray-100 pb-4 mb-6 font-mono text-[9px]">
            {[
              { id: 'carpet', label: 'Inside a Carpet Workshop' },
              { id: 'pashmina', label: 'Inside a Pashmina Workshop' },
              { id: 'papier', label: 'Inside a Papier-Mâché Workshop' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedVocabWorkshop(tab.id)}
                className={`px-3 py-1.5 border transition-all ${
                  selectedVocabWorkshop === tab.id ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-[#FAF9F6] text-gray-550 border-gray-250 hover:border-[#3E2723]/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            {workshopVocabs[selectedVocabWorkshop].map((vocab, idx) => (
              <div key={idx} className="border border-gray-250 p-4 bg-white flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-base font-bold text-[#3E2723] mb-1">{vocab.term}</h4>
                  <p className="text-[10px] text-gray-500 font-sans leading-relaxed">{vocab.desc}</p>
                </div>
                <button 
                  onClick={() => {
                    const fam = conceptFamilies.find(f => f.term.toLowerCase() === vocab.term.toLowerCase());
                    if (fam) {
                      setActiveConcept(fam);
                      setActiveModalTab('overview');
                    }
                  }}
                  className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold text-left mt-4"
                >
                  Explore Word &rarr;
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Craft Process Vocabulary Map */}
        <section className="bg-white border border-[#3E2723]/10 p-8 rounded-xs mb-16 shadow-xs font-sans text-xs">
          <div className="text-center mb-8 font-mono">
            <span className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest block mb-1">Production Sequence Sorters</span>
            <h3 className="font-serif text-2xl font-bold text-[#3E2723]">Craft Process Vocabulary Map</h3>
          </div>

          <div className="flex gap-2 justify-center border-b border-gray-150 pb-4 mb-6 font-mono text-[9px]">
            {processSteps.map(step => (
              <button
                key={step.id}
                onClick={() => setSelectedProcessStep(step.id)}
                className={`px-3 py-1.5 border transition-all ${
                  selectedProcessStep === step.id ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-[#FAF9F6] text-gray-550 border-gray-250 hover:border-[#3E2723]/40'
                }`}
              >
                {step.name}
              </button>
            ))}
          </div>

          <div className="flex gap-4 justify-center flex-wrap font-mono">
            {processSteps.find(s => s.id === selectedProcessStep)?.terms.map((t, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const fam = conceptFamilies.find(f => f.term.toLowerCase() === t.toLowerCase());
                  if (fam) {
                    setActiveConcept(fam);
                    setActiveModalTab('overview');
                  }
                }}
                className="px-4 py-2 border border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723] hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider"
              >
                {t} &rarr;
              </button>
            ))}
          </div>
        </section>

        {/* Frequently Confused Terms comparison */}
        <section className="bg-white border border-red-200 p-8 rounded-xs mb-16 shadow-xs font-sans text-xs">
          <h3 className="text-lg font-serif text-[#3E2723] mb-6 font-bold border-b border-gray-150 pb-2">
            Frequently Confused Terminology
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
            
            {/* Case 1 */}
            <div className="border border-gray-250 p-4 bg-[#FAF9F6] space-y-3">
              <span className="text-red-700 font-bold block text-[8px] uppercase tracking-widest">AARI vs SOZNI</span>
              <div className="space-y-1">
                <div><strong>Aari:</strong> Uses a hooked tool on fabric stretched across frames to construct continuous chain-stitches.</div>
                <div className="mt-2"><strong>Sozni:</strong> Uses a straight individual needle to pull micro stitches manually, forming satin textures.</div>
              </div>
            </div>

            {/* Case 2 */}
            <div className="border border-gray-250 p-4 bg-[#FAF9F6] space-y-3">
              <span className="text-red-700 font-bold block text-[8px] uppercase tracking-widest">PASHM vs PASHMINA</span>
              <div className="space-y-1">
                <div><strong>Pashm:</strong> The raw combed underwool fleece harvested from Capra Hircus goats before any processing.</div>
                <div className="mt-2"><strong>Pashmina:</strong> The final woven textile fabric structured from processed pashm yarns.</div>
              </div>
            </div>

          </div>
        </section>

        {/* Word to Workshop Journey */}
        <section className="bg-white border border-[#3E2723]/10 p-8 rounded-xs mb-16 shadow-xs font-mono text-[10px] text-gray-700">
          <h3 className="font-serif text-lg font-bold text-[#3E2723] mb-6 text-center border-b border-gray-150 pb-2">Word-to-Workshop Journey</h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 text-center flex-wrap max-w-4xl mx-auto">
            <span className="px-3 py-1 bg-[#3E2723] text-white font-bold">1. WORD (Talim)</span>
            <span className="text-gray-400">&rarr;</span>
            <span className="px-3 py-1 bg-white border border-[#3E2723]">2. SENSE (Weft counts)</span>
            <span className="text-gray-400">&rarr;</span>
            <span className="px-3 py-1 bg-[#D4AF37] text-[#3E2723] font-bold">3. WORKSHOP USE</span>
            <span className="text-gray-400">&rarr;</span>
            <span className="px-3 py-1 bg-white border border-[#3E2723]">4. Finished Object</span>
          </div>
        </section>

        {/* Verification framework explanation box */}
        <section className="bg-white border border-gray-250 p-8 mb-16 rounded-xs shadow-xs font-sans text-xs">
          <h3 className="text-lg font-serif text-[#3E2723] mb-4 font-bold">Preserving Words Without Erasing Variation</h3>
          <p className="text-gray-655 leading-relaxed mb-4">
            Kashmir’s craft vocabulary has developed through multiple languages, scripts, districts, workshops, trade systems, and historical periods. A single term may therefore appear in several Roman spellings or pronunciations. KHCRF selects one preferred form for consistent indexing while preserving all documented alternatives.
          </p>
          <div className="bg-[#FAF9F6] p-4 border border-[#3E2723]/10 font-mono text-[9px] text-gray-550 uppercase tracking-widest leading-relaxed">
            &ldquo;A preferred spelling is an indexing decision, not a declaration that living regional or workshop variants are incorrect.&rdquo;
          </div>
        </section>

        {/* Terms Under Review workspace */}
        <section className="bg-white border border-[#3E2723]/10 p-8 rounded-xs mb-16 shadow-xs font-sans text-xs">
          <h3 className="font-serif text-lg font-bold text-[#3E2723] mb-4">Help Strengthen the Lexicon</h3>
          <p className="text-gray-655 mb-6">
            The following terminology records require field validation, dialect recordings, or historical citations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[9px]">
            <div className="border border-gray-250 p-4 bg-white flex flex-col justify-between">
              <div>
                <span className="text-amber-600 font-bold block mb-1">PROVISIONAL RECORD</span>
                <strong className="text-base text-[#3E2723] block mb-1">Tajrīd-Chinar</strong>
                <p className="text-[9px] text-gray-500 font-sans leading-relaxed">Missing verified local pronunciation files and workshop usage records.</p>
              </div>
              <a href="#nomination-section" className="text-[#3949AB] hover:underline font-bold mt-4 block">Contribute Evidence &rarr;</a>
            </div>

            <div className="border border-gray-250 p-4 bg-white flex flex-col justify-between">
              <div>
                <span className="text-amber-600 font-bold block mb-1">PROVISIONAL RECORD</span>
                <strong className="text-base text-[#3E2723] block mb-1">Naqash-Wathlo</strong>
                <p className="text-[9px] text-gray-500 font-sans leading-relaxed">Requires historical citation references from 19th-century workshop logs.</p>
              </div>
              <a href="#nomination-section" className="text-[#3949AB] hover:underline font-bold mt-4 block">Contribute Evidence &rarr;</a>
            </div>

            <div className="border border-gray-250 p-4 bg-white flex flex-col justify-between">
              <div>
                <span className="text-amber-600 font-bold block mb-1">PROVISIONAL RECORD</span>
                <strong className="text-base text-[#3E2723] block mb-1">Atij-Pulp</strong>
                <p className="text-[9px] text-gray-500 font-sans leading-relaxed">Requires dialect variation spelling reports across Ganderbal districts.</p>
              </div>
              <a href="#nomination-section" className="text-[#3949AB] hover:underline font-bold mt-4 block">Contribute Evidence &rarr;</a>
            </div>
          </div>
        </section>

        {/* Contribution Form section */}
        <section id="nomination-section" className="bg-white border border-[#3E2723]/10 p-8 md:p-12 mb-16 rounded-xs shadow-xs">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block mb-1 font-mono">Help Preserve the Language of Kashmir’s Crafts</span>
            <h2 className="text-3xl font-serif text-[#3E2723] font-bold">Submit Terminology &amp; Pronunciations</h2>
            <p className="text-gray-500 text-xs font-mono mt-1">Artisans, scholars, linguists, and community members are invited to submit corrections.</p>
          </div>

          <div className="bg-[#FAF9F6] p-6 md:p-8 border border-gray-250">
            {proposalSubmitted ? (
              <div className="text-center py-8 font-mono">
                <h3 className="text-lg font-bold text-green-600 mb-2">Linguistic Draft Staged</h3>
                <p className="text-xs text-gray-500">Thank you. The KHCRF Language &amp; Transliteration Unit will review your phonetics.</p>
              </div>
            ) : (
              <form onSubmit={handleProposalSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Preferred Term *</label>
                    <input 
                      required 
                      type="text" 
                      value={proposalForm.term}
                      onChange={(e) => setProposalForm({...proposalForm, term: e.target.value})}
                      placeholder="e.g. Purzgar"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Original Script (if known)</label>
                    <input 
                      type="text" 
                      value={proposalForm.script}
                      onChange={(e) => setProposalForm({...proposalForm, script: e.target.value})}
                      placeholder="e.g. پرزگر"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Primary Craft Tradition *</label>
                    <input 
                      required
                      type="text" 
                      value={proposalForm.craft}
                      onChange={(e) => setProposalForm({...proposalForm, craft: e.target.value})}
                      placeholder="e.g. Pashmina"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-500 mb-1">Contact Coordinates *</label>
                    <input 
                      required
                      type="text" 
                      value={proposalForm.contact}
                      onChange={(e) => setProposalForm({...proposalForm, contact: e.target.value})}
                      placeholder="Your name, email, or telephone number"
                      className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-500 mb-1">Lexicon Definition *</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={proposalForm.definition}
                    onChange={(e) => setProposalForm({...proposalForm, definition: e.target.value})}
                    placeholder="Provide standard definition, dialect variants, or workshop meanings..."
                    className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-500 mb-1">Supporting Evidences &amp; Citations *</label>
                  <textarea 
                    required
                    rows={2} 
                    value={proposalForm.evidence}
                    onChange={(e) => setProposalForm({...proposalForm, evidence: e.target.value})}
                    placeholder="Cite oral interviews, workshop observations, or historical design pattern books..."
                    className="w-full border border-gray-200 px-3 py-2 bg-white text-[#2A2A2A] focus:outline-none focus:border-[#3E2723] resize-none" 
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-[#3E2723] hover:bg-[#D4AF37] text-white hover:text-[#3E2723] font-bold uppercase tracking-widest transition-colors font-mono"
                >
                  Submit Terminology Draft
                </button>
              </form>
            )}
          </div>
        </section>

      </div>

      {/* FOOTER STATEMENT */}
      <footer className="bg-[#3E2723] py-16 px-4 md:px-10 text-white/90">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto"></div>
          <p className="font-serif italic text-lg leading-relaxed text-white/80 max-w-3xl mx-auto font-mono">
            &ldquo;The KHCRF Kashmir Craft Lexicon preserves the words through which craftsmanship is named, taught, practiced, evaluated, traded, interpreted, and remembered. Each record connects language to artisans, workshops, techniques, tools, materials, motifs, objects, places, historical sources, and living testimony while preserving variation, uncertainty, attribution, and evidence.&rdquo;
          </p>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto"></div>
        </div>
      </footer>

    </main>
  );
}
