'use client';
import api, { getBaseUrlNoApi } from "@/lib/api";
import { WorkshopCommunitiesView } from './WorkshopCommunitiesView';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FaChevronDown, FaChevronUp, FaSearch, FaFilter, FaCheckCircle, FaTimes, FaInfoCircle, FaCertificate, FaIdCard, FaHandsHelping, FaPhoneAlt, FaFileAlt } from 'react-icons/fa';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { masterArtisansDirectoryHeroFallback } from '@/config/heroFallbacks';

const API_BASE_URL = getBaseUrlNoApi();

const filterCategories = {
  craftId: { label: 'GI Craft', options: [
    {value: 'ALL', label: 'All'},
    {value: '1046', label: 'Kashmir Chain Stitch Embroidery'},
    {value: '1047', label: 'Kashmir Crewel Embroidery'},
    {value: '902', label: 'Kashmir Gabba'},
    {value: '868', label: 'Kashmir Namda'},
    {value: '1048', label: 'Kashmir Tweed'},
    {value: '869', label: 'Kashmir Wagoo'},
    {value: '903', label: 'Kashmir Willow Bat'},
    {value: '527', label: 'Kashmir Hand-Knotted Carpet'},
    {value: '204', label: 'Kashmir Khatamband'},
    {value: '181', label: 'Kashmir Paper Machie'},
    {value: '182', label: 'Kashmir Walnut Wood Carving'},
    {value: '51', label: 'Kashmir Kani Shawl'},
    {value: '46', label: 'Kashmir Pashmina'},
    {value: '48', label: 'Kashmir Sozani Embroidery'}
  ] },
  district: { label: 'District', options: [
    {value: 'ALL', label: 'All'},
    {value: 'SRINAGAR', label: 'Srinagar'},
    {value: 'BUDGAM', label: 'Budgam'},
    {value: 'GANDERBAL', label: 'Ganderbal'},
    {value: 'ANANTNAG', label: 'Anantnag'},
    {value: 'KULGAM', label: 'Kulgam'},
    {value: 'PULWAMA', label: 'Pulwama'},
    {value: 'SHOPIAN', label: 'Shopian'},
    {value: 'BARAMULLA', label: 'Baramulla'},
    {value: 'BANDIPORA', label: 'Bandipora'},
    {value: 'KUPWARA', label: 'Kupwara'}
  ] },
  period: { label: 'Period', options: [
    {value: 'ALL', label: 'All'},
    {value: '1965_1999', label: '1965–1999'},
    {value: '2000_2008', label: '2000–2008'},
    {value: '2009_2019', label: '2009–2019'},
    {value: '2020_2026', label: '2020–2026'}
  ] },
  recognition: { label: 'Recognition', options: [
    {value: 'ALL', label: 'All'},
    {value: 'PADMA', label: 'Padma Award'},
    {value: 'SHILP_GURU', label: 'Shilp Guru'},
    {value: 'SANT_KABIR', label: 'Sant Kabir Award'},
    {value: 'NATIONAL_AWARD', label: 'National Award'},
    {value: 'NATIONAL_MERIT', label: 'National Merit Certificate'},
    {value: 'STATE_AWARD', label: 'State Award'},
    {value: 'OTHER_GOVT', label: 'Other Government Recognition'},
    {value: 'NO_AWARD', label: 'No Government Award Recorded'}
  ] },
  verification: { label: 'Verification', options: [
    {value: 'ALL', label: 'All'},
    {value: 'GOVT_AWARD', label: 'Government Award Verified'},
    {value: 'GOVT_REG', label: 'Government Artisan Registration'},
    {value: 'PEHCHAN', label: 'Pehchan Verified'},
    {value: 'GI_AU', label: 'GI Authorized User'},
    {value: 'KHCRF', label: 'KHCRF Verified'},
    {value: 'MULTIPLE_GOVT', label: 'Multiple Government Sources'},
    {value: 'UNVERIFIED_HISTORICAL', label: 'Unverified / Historical Only'}
  ] },
  status: { label: 'Status', options: [
    {value: 'ALL', label: 'All'},
    {value: 'LIVING', label: 'Living'},
    {value: 'DECEASED', label: 'Deceased'},
    {value: 'UNKNOWN', label: 'Unknown'},
    {value: 'ACTIVE', label: 'Active'},
    {value: 'RETIRED', label: 'Retired'},
    {value: 'HISTORICAL_ONLY', label: 'Historical Only'}
  ] },
  reconciliationStatus: { label: 'Reconciliation Status', options: [
    {value: 'ALL', label: 'All'},
    {value: 'VERIFIED', label: 'Verified'},
    {value: 'PROBABLE', label: 'Probable'},
    {value: 'CONFLICTED', label: 'Conflicted'},
    {value: 'UNRESOLVED', label: 'Unresolved'}
  ] },
  evidenceGrade: { label: 'Evidence Grade', options: [
    {value: 'ALL', label: 'All'},
    {value: 'A_PLUS', label: 'A+'},
    {value: 'A', label: 'A'},
    {value: 'B', label: 'B'},
    {value: 'C', label: 'C'},
    {value: 'D', label: 'D'}
  ] },
  documentation: { label: 'Documentation', options: [
    {value: 'ALL', label: 'All'},
    {value: 'ORAL_HISTORY', label: 'Oral History'},
    {value: 'STUDIO_INTERVIEW', label: 'Studio Interview'},
    {value: 'LINEAGE', label: 'Lineage Documented'},
    {value: 'COLLECTION', label: 'Collection Linked'},
    {value: 'GOVT_ONLY', label: 'Government Source Only'},
    {value: 'NO_DOC', label: 'No Documentation Yet'}
  ] },
};


function ArtisansContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [allMasters, setAllMasters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State from URL
  const [activeView, setActiveView] = useState(searchParams.get('view') || 'ALL');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(searchQuery);

  const [filters, setFilters] = useState(() => {
    const initFilters: any = {};
    Object.keys(filterCategories).forEach(key => {
      initFilters[key] = searchParams.get(key) || 'ALL';
    });
    return initFilters;
  });

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showEvidence, setShowEvidence] = useState<Set<string>>(new Set());

  // URL Sync
  useEffect(() => {
    const query = new URLSearchParams();
    if (activeView !== 'ALL') query.set('view', activeView);
    if (searchQuery) query.set('search', searchQuery);
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== 'ALL') query.set(k, v as string);
    });
    
    router.replace(`${pathname}?${query.toString()}`, { scroll: false });
    
    fetchArtisans(query);
  }, [filters, searchQuery, activeView]);

  const fetchArtisans = async (query: URLSearchParams) => {
    setLoading(true);
    try {
      const res = await api.get(`/v1/artisans?${query.toString()}&_t=${Date.now()}`);
      const data = res.data;
      setAllMasters(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error(err);
      setAllMasters([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedRows(newExpanded);
  };

  const toggleEvidence = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newEvidence = new Set(showEvidence);
    if (newEvidence.has(id)) newEvidence.delete(id);
    else newEvidence.add(id);
    setShowEvidence(newEvidence);
  };

  const handleFilterChange = (key: string, val: string) => {
    setFilters(prev => ({ ...prev, [key]: val }));
    setCurrentPage(1);
  };

  const removeFilter = (key: string) => {
    handleFilterChange(key, 'ALL');
  };

  const clearAllFilters = () => {
    const resetFilters: any = {};
    Object.keys(filterCategories).forEach(key => resetFilters[key] = 'ALL');
    setFilters(resetFilters);
    setSearchQuery('');
    setSearchInput('');
    setActiveView('ALL');
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const activeChips = useMemo(() => {
    const chips: { key: string, label: string }[] = [];
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== 'ALL') {
        const cat = (filterCategories as any)[key];
        const opt = cat.options.find((o: any) => o.value === val);
        if (opt) chips.push({ key, label: `${opt.label}` });
      }
    });
    return chips;
  }, [filters]);

  const activeFilterCount = activeChips.length + (activeView !== 'ALL' ? 1 : 0);

  const paginatedMasters = allMasters.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(allMasters.length / itemsPerPage);

  const getTrustSummary = (m: any) => {
    const sources = [];
    if (m.government_verified) sources.push('Govt');
    if (m.pehchan_verified) sources.push('Pehchan');
    if (m.gi_verified) sources.push('GI');
    
    const count = sources.length;
    const grade = m.evidence_grade || '?';
    if (count > 0) {
      return `Evidence ${grade} · ${count} Govt Source${count > 1 ? 's' : ''}`;
    } else if (m.khcrf_verified) {
      return `Evidence ${grade} · KHCRF Verified`;
    }
    return `Evidence ${grade} · Unverified`;
  };

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-[#2A2A2A] font-sans">
      <UniversalEditorialHero pageKey="master-artisans-dir" fallbackConfig={masterArtisansDirectoryHeroFallback as any} />
      
      <div className="container-fluid mx-auto px-4 md:px-10 mt-8 mb-4">
        <h1 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-6">MASTER ARTISAN REGISTRY</h1>
        
        {/* Horizontal Scroll Views */}
        <div className="flex overflow-x-auto custom-scrollbar gap-2 md:gap-4 border-b border-[#3E2723]/10 pb-4 mb-6">
          {[
            { id: 'ALL', label: 'All Artisans' },
            { id: 'MASTER_ARTISAN', label: 'Master Artisans' },
            { id: 'LIVING_MASTER', label: 'Living Legends' },
            { id: 'HISTORICAL_MASTER', label: 'Historical Masters' },
            { id: 'WOMEN_ARTISAN', label: 'Women Artisans' },
            { id: 'EMERGING_ARTISAN', label: 'Emerging Artisans' },
            { id: 'WORKSHOP_COMMUNITY', label: 'Workshop Communities' }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => { setActiveView(view.id); setCurrentPage(1); }}
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors ${
                activeView === view.id 
                  ? 'bg-[#3E2723] text-white border border-[#3E2723]' 
                  : 'bg-white text-[#3E2723] border border-[#3E2723]/20 hover:bg-[#FAF9F6]'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {/* Big Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full mb-4">
          <input
            type="text"
            placeholder="Search artisan, KHCRF ID, Pehchan ID, GI AU ID, village, award..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-base md:text-lg border border-gray-300 rounded focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none shadow-sm transition-all"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <button type="submit" className="hidden"></button>
        </form>

        {/* Active Filter Chips */}
        {(activeChips.length > 0 || searchQuery || activeView !== 'ALL') && (
          <div className="flex flex-wrap gap-2 items-center mb-6">
            <span className="text-xs text-gray-500 uppercase font-bold mr-2">Active Filters:</span>
            {activeView !== 'ALL' && (
              <span className="px-3 py-1 bg-[#D4AF37]/20 text-[#3E2723] rounded-full text-xs flex items-center gap-1 font-medium border border-[#D4AF37]/30">
                View: {activeView.replace('_', ' ')}
                <FaTimes className="cursor-pointer hover:text-red-500 ml-1" onClick={() => setActiveView('ALL')} />
              </span>
            )}
            {searchQuery && (
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs flex items-center gap-1 font-medium">
                Search: "{searchQuery}"
                <FaTimes className="cursor-pointer hover:text-red-500 ml-1" onClick={() => {setSearchQuery(''); setSearchInput('');}} />
              </span>
            )}
            {activeChips.map(chip => (
              <span key={chip.key} className="px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-full text-xs flex items-center gap-1 font-medium">
                {chip.label}
                <FaTimes className="cursor-pointer hover:text-red-500 ml-1" onClick={() => removeFilter(chip.key)} />
              </span>
            ))}
            <button onClick={clearAllFilters} className="text-xs text-red-500 hover:underline ml-2">Clear all</button>
          </div>
        )}
      </div>

      <div className="container-fluid mx-auto px-4 md:px-10 pb-12 flex flex-col lg:flex-row lg:items-start gap-8 relative">
        
        {/* Mobile Filters Toggle */}
        <div className="lg:hidden w-full mb-4">
          <button 
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-3 rounded text-[#3E2723] font-bold"
          >
            <FaFilter /> Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
          </button>
        </div>

        {/* Sidebar Filters */}
        <aside className={`${isMobileFilterOpen ? 'block' : 'hidden'} lg:block w-full lg:w-[280px] flex-shrink-0 absolute lg:relative z-10 lg:z-auto bg-white lg:bg-transparent shadow-xl lg:shadow-none p-4 lg:p-0 top-[60px] lg:top-0 left-0 right-0 border-b lg:border-none border-gray-200`}>
          <div className="bg-white border border-[#3E2723]/10 p-6  shadow-sm rounded-md">
            <div className="flex justify-between items-center mb-6 border-b border-[#3E2723]/10 pb-4">
              <h2 className="font-bold text-lg text-[#3E2723]">Filters</h2>
              <button className="lg:hidden text-gray-500" onClick={() => setIsMobileFilterOpen(false)}><FaTimes /></button>
            </div>

            <div className="space-y-6  pr-2">
              {Object.entries(filterCategories).map(([key, cat]) => (
                <div key={key}>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{cat.label}</h3>
                  <select
                    value={(filters as any)[key]}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    className="w-full border border-gray-300 rounded py-2 px-3 text-sm focus:border-[#D4AF37] outline-none"
                  >
                    {cat.options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Table / List Area */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-gray-500">
              {loading ? 'Loading...' : `${allMasters.length} Records Found`}
            </span>
          </div>

                    {activeView === 'WORKSHOP_COMMUNITY' ? (
            <WorkshopCommunitiesView data={paginatedMasters} />
          ) : (
          <div className="bg-white border border-[#3E2723]/10 rounded-md shadow-sm overflow-hidden">
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-[1fr_2fr_1.5fr_1.5fr_2fr_auto] bg-[#3E2723] text-white p-4 font-bold uppercase tracking-wider text-xs">
              <div>ID</div>
              <div>Name</div>
              <div>Craft & District</div>
              <div>Status</div>
              <div>Trust Summary</div>
              <div className="w-8"></div>
            </div>

            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="p-10 text-center text-gray-500">Loading data...</div>
              ) : paginatedMasters.length === 0 ? (
                <div className="p-10 text-center text-gray-500">No records found.</div>
              ) : (
                paginatedMasters.map(m => (
                  <React.Fragment key={m.id}>
                    {/* Row (Desktop & Mobile combined) */}
                    <div 
                      className={`hover:bg-gray-50 cursor-pointer transition-colors p-4 ${expandedRows.has(m.id) ? 'bg-gray-50' : 'bg-white'}`}
                      onClick={() => toggleRow(m.id)}
                    >
                      {/* Desktop Layout */}
                      <div className="hidden md:grid grid-cols-[1fr_2fr_1.5fr_1.5fr_2fr_auto] items-center gap-4">
                        <div className="text-gray-500 font-mono text-xs">{m.khcrf_master_id || 'N/A'}</div>
                        <div className="font-bold text-[#3E2723] truncate">{m.artisan_name}</div>
                        <div className="text-sm text-gray-600 truncate">
                          <div>{m.primary_craft?.canonical_name || 'N/A'}</div>
                          <div className="text-xs text-gray-400">{m.district || 'N/A'} {m.village_locality ? `(${m.village_locality})` : ''}</div>
                        </div>
                        <div>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{m.status || 'Unknown'}</span>
                        </div>
                        <div className="text-sm font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded inline-block">
                          {getTrustSummary(m)}
                        </div>
                        <div className="text-gray-400 justify-self-end">
                          {expandedRows.has(m.id) ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                      </div>

                      {/* Mobile Layout */}
                      <div className="md:hidden flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-[#3E2723] text-lg">{m.artisan_name}</div>
                            <div className="text-xs font-mono text-gray-400">{m.khcrf_master_id || 'ID N/A'}</div>
                          </div>
                          <div className="text-gray-400">
                            {expandedRows.has(m.id) ? <FaChevronUp /> : <FaChevronDown />}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">{m.primary_craft?.canonical_name || 'Craft N/A'} | {m.district || 'District N/A'}</div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{m.status || 'Unknown'}</span>
                          <span className="text-xs font-medium text-gray-700 bg-green-50 text-green-800 px-2 py-1 rounded border border-green-200">
                            {getTrustSummary(m)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content (Level 3 Redesign) */}
                    {expandedRows.has(m.id) && (
                      <div className="bg-[#FAF9F6] p-4 md:p-8 border-t border-gray-200 border-l-4 border-[#D4AF37]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          
                          {/* Section 1: Identity */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold text-[#3E2723] uppercase tracking-wider flex items-center gap-2 border-b border-[#3E2723]/10 pb-2"><FaIdCard /> Identity</h4>
                            <div className="text-sm space-y-1 text-gray-700">
                              <p><span className="font-medium">KHCRF ID:</span> {m.khcrf_master_id || 'N/A'}</p>
                              <p><span className="font-medium">Name:</span> {m.artisan_name}</p>
                              <p><span className="font-medium">Parent/Spouse:</span> {m.father_husband_name || 'N/A'}</p>
                              <p><span className="font-medium">Gender:</span> {m.gender || 'N/A'}</p>
                              <p><span className="font-medium">Location:</span> {m.district || 'N/A'}, {m.village_locality || 'N/A'}</p>
                              <p><span className="font-medium">Life Status:</span> {m.status || 'N/A'} {m.birth_year ? `(b. ${m.birth_year})` : ''}</p>
                              <p><span className="font-medium">Practice:</span> {m.practice_status || 'N/A'}</p>
                            </div>
                          </div>

                          {/* Section 2: Recognition */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold text-[#3E2723] uppercase tracking-wider flex items-center gap-2 border-b border-[#3E2723]/10 pb-2"><FaCertificate /> Recognition</h4>
                            {m.awards && m.awards.length > 0 ? (
                              <ul className="text-sm space-y-2">
                                {m.awards.map((aw: any) => (
                                  <li key={aw.id} className="bg-white p-2 rounded border border-gray-200 shadow-sm">
                                    <div className="font-bold text-[#D4AF37]">{aw.award_name} {aw.award_year ? `(${aw.award_year})` : ''}</div>
                                    <div className="text-xs text-gray-500">{aw.award_level || 'Level N/A'} | {aw.awarding_authority || 'Authority N/A'}</div>
                                  </li>
                                ))}
                              </ul>
                            ) : <p className="text-sm text-gray-500 italic">No government awards recorded.</p>}
                          </div>

                          {/* Section 3: Government Identity */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold text-[#3E2723] uppercase tracking-wider flex items-center gap-2 border-b border-[#3E2723]/10 pb-2"><FaIdCard /> Government IDs</h4>
                            {m.identifiers && m.identifiers.length > 0 ? (
                              <ul className="text-sm space-y-2">
                                {m.identifiers.map((ident: any) => (
                                  <li key={ident.id} className="bg-white p-2 rounded border border-gray-200 shadow-sm">
                                    <div className="font-medium text-gray-800">{ident.identifier_type}</div>
                                    <div className="font-mono text-xs text-gray-600">{ident.identifier_value}</div>
                                  </li>
                                ))}
                              </ul>
                            ) : <p className="text-sm text-gray-500 italic">No government IDs recorded.</p>}
                          </div>

                          {/* Section 4: Craft & Lineage */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold text-[#3E2723] uppercase tracking-wider flex items-center gap-2 border-b border-[#3E2723]/10 pb-2"><FaHandsHelping /> Craft & Lineage</h4>
                            <div className="text-sm text-gray-700 space-y-2">
                              <p><span className="font-medium">Primary Craft:</span> {m.primary_craft?.canonical_name || 'N/A'}</p>
                              {m.lineagesAsMember && m.lineagesAsMember.length > 0 ? (
                                <div>
                                  <span className="font-medium">Lineage:</span>
                                  <ul className="list-disc list-inside text-xs mt-1 space-y-1 text-gray-600">
                                    {m.lineagesAsMember.map((lin: any) => (
                                      <li key={lin.id}>{lin.lineage?.lineage_name || 'Unknown'} ({lin.relationship_type})</li>
                                    ))}
                                  </ul>
                                </div>
                              ) : <p className="text-xs text-gray-500 italic">No lineage documented.</p>}
                            </div>
                          </div>

                          {/* Section 5: Current Contact */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold text-[#3E2723] uppercase tracking-wider flex items-center gap-2 border-b border-[#3E2723]/10 pb-2"><FaPhoneAlt /> Current Contact</h4>
                            <div className="text-sm text-gray-700">
                              <p><span className="font-medium">Contact Status:</span> Private / Redacted</p>
                              <p className="text-xs text-gray-500 mt-1">KHCRF maintains verified contact info internally for programs. It is not displayed publicly.</p>
                            </div>
                          </div>

                          {/* Section 6: Evidence & Reconciliation */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold text-[#3E2723] uppercase tracking-wider flex items-center gap-2 border-b border-[#3E2723]/10 pb-2"><FaFileAlt /> Evidence</h4>
                            <div className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                              <div className="font-medium mb-1">Status: {m.reconciliation_status || 'Unresolved'}</div>
                              <div className="text-xs text-gray-600 mb-3">
                                Verified from {m.assertions ? m.assertions.length : 0} original sources.
                              </div>
                              <button 
                                onClick={(e) => toggleEvidence(m.id, e)}
                                className="text-xs font-bold text-[#D4AF37] hover:underline"
                              >
                                {showEvidence.has(m.id) ? 'Hide Evidence Details' : 'View Evidence Details'}
                              </button>
                            </div>

                            {showEvidence.has(m.id) && m.assertions && m.assertions.length > 0 && (
                              <div className="mt-2 space-y-2 max-h-48 overflow-y-auto custom-scrollbar bg-white p-2 border border-gray-200 rounded">
                                {m.assertions.map((a: any) => (
                                  <div key={a.id} className={`text-xs p-2 rounded ${a.is_canonical ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                                    <div className="flex justify-between font-medium text-gray-800">
                                      <span>{a.field_name}: {a.raw_value}</span>
                                      {a.is_canonical && <span className="text-[9px] bg-green-200 text-green-800 px-1 rounded uppercase">Canonical</span>}
                                    </div>
                                    <div className="text-gray-500 mt-1">Src: {a.source?.source_title || 'Unknown'} {a.source_page ? `(p. ${a.source_page})` : ''}</div>
                                    {a.reconciliation_reason && <div className="text-[10px] text-gray-400 mt-1 italic border-t pt-1 border-gray-200">Reason: {a.reconciliation_reason}</div>}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>

                    )}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="w-8 h-8 border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 transition-colors bg-white rounded"
              >
                &larr;
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 text-xs font-bold transition-colors rounded ${
                      currentPage === i + 1 ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white border border-gray-300 text-gray-500 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="w-8 h-8 border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#3E2723] hover:text-[#3E2723] disabled:opacity-30 transition-colors bg-white rounded"
              >
                &rarr;
              </button>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

export default function ArtisansIndex() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading registry...</div>}>
      <ArtisansContent />
    </Suspense>
  );
}

// Trigger frontend rebuild


