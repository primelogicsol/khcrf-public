"use client";

import { SKC_2026_SCHEDULE } from '@/config/skcSchedule';
import { formatTimelineDate } from '@/lib/skc/timeline';

import React, { useEffect, useState, useMemo } from 'react';
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FaShieldAlt, FaFileAlt, FaImage, FaFileSignature, FaUsers, FaSearch, FaHistory,
  FaMapMarkerAlt, FaCalendarAlt, FaArrowRight, FaDatabase, FaMicrophone, FaBuilding, FaLandmark, FaUpload, FaCheckCircle, FaExclamationTriangle
} from "react-icons/fa";
import { useFileUpload } from '@/hooks/useFileUpload';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { evidenceRepositoryHeroFallback } from '@/config/heroFallbacks';

export const ARCHIVE_MAP: Record<string, { title: string; prop: string; value: string; desc: string }> = {
  'consultations': { title: "Consultation Records", prop: "type", value: "Consultation Record", desc: "Browse published consultation evidence, transcripts, and stakeholder submissions." },
  'public-hearings': { title: "Public Hearing Records", prop: "type", value: "Public Hearing", desc: "View hearing notices, agendas, transcripts, approved written testimony, and recordings." },
  'institutional-submissions': { title: "Institutional Submissions", prop: "type", value: "Institutional Submission", desc: "Read approved submissions from Government Departments, Universities, NGOs, and Trade Bodies." },
  'historical-heritage': { title: "Historical & Heritage", prop: "category", value: "Historical Context", desc: "Explore historical documents, archival photographs, heritage inventories, and rare manuscripts." }
};

export default function EvidenceRepositoryClient({ archiveSlug }: { archiveSlug?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeArchive = archiveSlug ? ARCHIVE_MAP[archiveSlug] : null;

  const [metrics, setMetrics] = useState<any>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState(false);

  // Search state initialized from URL if available
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [filterType, setFilterType] = useState(activeArchive && activeArchive.prop === "type" ? activeArchive.value : (searchParams.get('type') || ''));
  const [filterCycle, setFilterCycle] = useState(searchParams.get('cycle') || '2026'); // Only published cycle
  const [filterCategory, setFilterCategory] = useState(activeArchive && activeArchive.prop === "category" ? activeArchive.value : (searchParams.get('category') || ''));
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchTotal, setSearchTotal] = useState(0);
  const [searchPage, setSearchPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);

  const [isPreLaunch, setIsPreLaunch] = useState(true);

  // Initialize filters from URL parameters on first load ONLY IF there's no activeArchive
  useEffect(() => {
    if (!activeArchive) {
       const initialType = searchParams.get("type");
       const initialCategory = searchParams.get("category");
       const initialQuery = searchParams.get("q");

       if (initialType) setFilterType(initialType);
       if (initialCategory) setFilterCategory(initialCategory);
       if (initialQuery) setSearchQuery(initialQuery);
    }
  }, [searchParams, activeArchive]);

  useEffect(() => {
    setIsPreLaunch(false); // Forced false for testing purposes
  }, []);

  const [facets, setFacets] = useState({ types: [], categories: [], cycles: [] });

  // Sync state to URL without full page reload
  const updateURL = (query: string, type: string, cycle: string, category: string, page: number) => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (type) params.set('type', type);
    if (cycle) params.set('cycle', cycle);
    if (category) params.set('category', category);
    if (page > 1) params.set('page', page.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', evidenceType: '', category: '', district: '', craftSector: '', organization: '', contributorName: '', email: '', source: '', publicationDate: '', provenance: '', relevance: '', copyrightDeclaration: false, attributionPreference: false, confidentialityExplanation: '', visibility: 'REVIEW_ONLY', consent: false, description: '', fileUrl: '', fileType: '', fileSize: 0
  });
  const [formStatus, setFormStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [formMessage, setFormMessage] = useState('');
  const { uploadFile, isUploading: isFileUploading } = useFileUpload();

  const fetchMetrics = () => {
    setMetricsLoading(true);
    setMetricsError(false);
    fetch(`/api/backend/skc/evidence/public/metrics?cycle=2026`)
      .then(res => {
         if (!res.ok) throw new Error("Network response was not ok");
         return res.json();
      })
      .then(resData => {
        const data = resData.status === 'success' && resData.data ? resData.data : resData;
        if (data.success) {
          setMetrics(data.data);
        } else {
          setMetricsError(true);
        }
        setMetricsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setMetricsError(true);
        setMetricsLoading(false);
      });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile(file);
      setFormData(prev => ({
        ...prev,
        fileUrl: result,
        fileType: file.type,
        fileSize: file.size
      }));
    } catch (err) {
      console.error('File upload failed', err);
      alert('File upload failed. Please try again.');
    }
  };

  // 1. Fetch Metrics Initial
  useEffect(() => {
    fetchMetrics();
  }, []);

  // 2. Fetch Search
  const performSearch = (page = 1) => {
    setSearchLoading(true);
    setSearchError(false);
    updateURL(searchQuery, filterType, filterCycle, filterCategory, page);
    const params = new URLSearchParams();
    if (searchQuery) params.append('query', searchQuery);
    if (filterType) params.append('type', filterType);
    if (filterCycle) params.append('cycle', filterCycle);
    if (filterCategory) params.append('category', filterCategory);
    params.append('page', page.toString());
    params.append('limit', '10');

    fetch(`/api/backend/skc/evidence/public/search?${params.toString()}`)
      .then(res => res.json())
      .then(resData => {
        const data = resData.status === 'success' && resData.data ? resData.data : resData;
        if (data.success) {
          setSearchResults(data.data);
          setSearchTotal(data.pagination.total);
          setSearchPage(data.pagination.page);
          setFacets(data.facets);
        } else {
          setSearchError(true);
        }
        setSearchLoading(false);
      })
      .catch(err => {
        console.error(err);
        setSearchError(true);
        setSearchLoading(false);
      });
  };

  // Initial search
  useEffect(() => {
    performSearch(1);
  }, [filterType, filterCycle, filterCategory]);

  // Submit Evidence
  const submitEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
       setFormMessage("You must consent to the terms to submit.");
       setFormStatus('ERROR');
       return;
    }
    setFormStatus('LOADING');
    try {
       const res = await fetch(`/api/backend/skc/evidence/public/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
       });
       const resData = await res.json();
       const data = resData.status === 'success' && resData.data ? resData.data : resData;
       if (data.success) {
          setFormStatus('SUCCESS');
          setFormMessage(`Submission successful. Reference Number: ${data.data.referenceNumber}`);
       } else {
          setFormStatus('ERROR');
          setFormMessage(data.error || "Failed to submit.");
       }
    } catch (err) {
       setFormStatus('ERROR');
       setFormMessage("An unexpected error occurred.");
    }
  };

  const handleArchiveClick = (slug: string) => {
    router.push(`/state-of-kashmir-crafts/evidence-repository/archive/${slug}`);
  };

  return (
    <main className="w-full bg-gray-50 min-h-screen pb-20">
      
      {/* Hero Section */}
      <UniversalEditorialHero 
        pageKey="evidence-repository" 
        fallbackConfig={evidenceRepositoryHeroFallback as any} 
      />

      <div className="container mx-auto px-4">
        
        {/* Statistics Board */}
        <section className="mb-20">
          <h2 className="text-2xl font-black text-brand-dark mb-8 border-l-4 border-brand-primary pl-4">Live Repository Statistics</h2>
          {isPreLaunch ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm text-center">
               <FaDatabase className="text-5xl text-gray-300 mx-auto mb-4" />
               <h3 className="text-2xl font-black text-brand-dark mb-4">Repository statistics are not yet available</h3>
               <p className="text-gray-600 max-w-2xl mx-auto mb-6">The 2026–2027 Assessment is currently in the Design and Pre-Launch phase. Public evidence statistics will begin updating after evidence submission opens on {formatTimelineDate(SKC_2026_SCHEDULE.publicParticipation.plannedStart)} and approved submissions enter the repository review process.</p>
               <button onClick={() => fetchMetrics()} className="px-6 py-3 bg-brand-secondary text-brand-dark font-bold rounded-xl hover:bg-brand-primary hover:text-white transition shadow-sm">Check Again</button>
            </div>
          ) : metricsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
               {[1,2,3,4,5].map(i => <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-2xl"></div>)}
            </div>
          ) : metricsError ? (
            <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 font-medium flex flex-col items-center gap-4">
               Repository services are temporarily unavailable. Please try again shortly.
               <button onClick={() => fetchMetrics()} className="px-4 py-2 bg-red-100 text-red-800 rounded font-bold hover:bg-red-200 transition text-sm">Retry</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
                <FaDatabase data-ui-icon  className="text-3xl  mx-auto mb-3" />
                <div className="text-3xl font-black text-brand-dark">{metrics?.publishedEvidenceRecords || 0}</div>
                <div className="text-sm text-gray-500 font-bold mt-1">Total Published Records</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
                <FaFileAlt data-ui-icon  className="text-3xl  mx-auto mb-3" />
                <div className="text-3xl font-black text-brand-dark">{metrics?.documents || 0}</div>
                <div className="text-sm text-gray-500 font-bold mt-1">Documents</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
                <FaImage className="text-3xl text-blue-500 mx-auto mb-3" />
                <div className="text-3xl font-black text-brand-dark">{metrics?.photographs || 0}</div>
                <div className="text-sm text-gray-500 font-bold mt-1">Photographs</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
                <FaFileSignature className="text-3xl text-purple-500 mx-auto mb-3" />
                <div className="text-3xl font-black text-brand-dark">{metrics?.policyNotes || 0}</div>
                <div className="text-sm text-gray-500 font-bold mt-1">Policy Notes</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 text-center">
                <FaUsers className="text-3xl text-green-500 mx-auto mb-3" />
                <div className="text-3xl font-black text-brand-dark">{metrics?.consultationRecords || 0}</div>
                <div className="text-sm text-gray-500 font-bold mt-1">Consultation Records</div>
              </div>
            </div>
          )}
        </section>

        {/* Verification Workflow */}
        <section className="mb-20 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200">
           <h2 className="text-2xl font-black text-brand-dark mb-8">Evidence Verification Workflow</h2>
           <div className="flex flex-col md:flex-row justify-between items-start relative">
              <div className="hidden md:block absolute top-6 left-10 right-10 h-1 bg-gray-200 z-0"></div>
              {[
                 { stage: "Submission", desc: `Submission opens ${formatTimelineDate(SKC_2026_SCHEDULE.publicParticipation.plannedStart)}.` },
                 { stage: "Moderation", desc: "Initial check for completeness." },
                 { stage: "Evidence Review", desc: `Expert review from ${formatTimelineDate(SKC_2026_SCHEDULE.review.plannedStart)}.` },
                 { stage: "Approval", desc: "Cleared for publication or restricted." },
                 { stage: "Publication", desc: "Published into evidence repository." },
                 { stage: "Referenced", desc: "Used in SKC findings." }
              ].map((step, idx) => (
                 <div key={idx} className="relative z-10 flex flex-col items-center text-center w-full md:w-32 mb-6 md:mb-0">
                    <div className="w-12 h-12 rounded-full bg-brand-dark text-white flex items-center justify-center font-bold mb-3 border-4 border-white shadow-md">
                       {idx + 1}
                    </div>
                    <div className="font-bold text-sm text-gray-900 mb-1 leading-tight">{step.stage}</div>
                    <div className="text-xs text-gray-500">{step.desc}</div>
                 </div>
              ))}
           </div>
        </section>

        {/* Advanced Search */}
        <section id="search-section" className="mb-20">
           <div className="bg-brand-dark text-white p-8 md:p-12 rounded-3xl shadow-xl">
              <h2 className="text-3xl font-black mb-6">Advanced Repository Search</h2>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                 <div className="flex-1 relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                       type="text" 
                       placeholder="Search by keyword, title, or reference number..." 
                       value={searchQuery}
                       onChange={e => setSearchQuery(e.target.value)}
                       onKeyDown={e => e.key === 'Enter' && performSearch(1)}
                       className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:bg-white focus:text-brand-dark focus:placeholder-gray-500 outline-none transition"
                    />
                 </div>
                  <select 
                     value={filterType} 
                     onChange={e => setFilterType(e.target.value)} 
                     disabled={activeArchive?.prop === "type"}
                     className={`py-4 px-6 border rounded-xl text-white outline-none [&>option]:text-brand-dark ${activeArchive?.prop === "type" ? "bg-white/5 border-white/5 text-white/50 cursor-not-allowed" : "bg-white/10 border-white/20"}`}
                  >
                     <option value="">All Types</option>
                     {Array.from(new Set([
                       ...(facets?.types || []),
                       "Document",
                       "Photograph",
                       "Policy Note",
                       "Research Paper",
                       "Institutional Submission",
                       "Consultation Record",
                       "Public Hearing"
                     ])).map((type: string) => (
                       <option key={type} value={type}>{type}</option>
                     ))}
                  </select>
                  <select 
                     value={filterCategory} 
                     onChange={e => setFilterCategory(e.target.value)} 
                     disabled={activeArchive?.prop === "category"}
                     className={`py-4 px-6 border rounded-xl text-white outline-none [&>option]:text-brand-dark ${activeArchive?.prop === "category" ? "bg-white/5 border-white/5 text-white/50 cursor-not-allowed" : "bg-white/10 border-white/20"}`}
                  >
                     <option value="">All Categories</option>
                     {Array.from(new Set([
                       ...(facets?.categories || []),
                       "Historical Context",
                       "Craft Practice",
                       "Economic Impact",
                       "Policy & Regulation",
                       "Raw Materials",
                       "Wages & Livelihoods",
                       "Markets & Trade"
                     ])).map((cat: string) => (
                       <option key={cat} value={cat}>{cat}</option>
                     ))}
                  </select>
                  <select value={filterCycle} onChange={e => setFilterCycle(e.target.value)} className="py-4 px-6 bg-brand-primary border border-brand-primary rounded-xl text-white outline-none font-bold">
                     <option value="2026">2026 Cycle</option>
                     <option value="2027">2027 Cycle</option>
                     <option value="2028">2028 Cycle</option>
                  </select>
                 <button onClick={() => performSearch(1)} className="py-4 px-8 bg-brand-secondary text-brand-dark font-black rounded-xl hover:bg-white transition">
                    Search
                 </button>
              </div>
           </div>

           {/* Results Listing */}
           <div className="mt-8">
               {isPreLaunch ? (
                  <div className="text-center py-16 md:py-20 bg-white rounded-3xl border border-gray-200 shadow-sm px-4">
                     <FaSearch className="text-5xl text-gray-300 mx-auto mb-6" />
                     <h3 className="text-2xl font-black text-brand-dark mb-4">Public repository records are not yet available for search</h3>
                     <p className="text-gray-600 max-w-2xl mx-auto mb-8">The searchable repository will become active as evidence submissions are reviewed, classified, and approved for public access. Until then, you may submit evidence or review the evidence standards and methodology.</p>
                     <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={() => performSearch(1)} className="px-6 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-primary transition shadow-sm">Check Again</button>
                        <button onClick={() => setShowForm(true)} className="px-6 py-3 bg-white text-brand-dark border border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition shadow-sm">Submit Evidence</button>
                        <Link href="/state-of-kashmir-crafts/evidence-standards" className="px-6 py-3 bg-white text-brand-dark border border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition shadow-sm">View Evidence Standards</Link>
                     </div>
                  </div>
               ) : searchLoading ? (
                  <div className="text-center py-20 text-gray-500 font-bold">Searching database...</div>
               ) : searchError ? (
                  <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-200 shadow-sm flex flex-col items-center gap-4">
                     <p className="text-red-700 font-bold">Repository services are temporarily unavailable. Please try again shortly.</p>
                     <button onClick={() => performSearch(1)} className="px-6 py-2 bg-red-100 text-red-800 rounded font-bold hover:bg-red-200 transition">Retry</button>
                  </div>
                ) : searchResults.length === 0 ? (
                   <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 text-center max-w-2xl mx-auto my-8 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-secondary to-brand-primary"></div>
                      <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-6 shadow-inner">
                         <FaHistory className="text-2xl text-gray-400" />
                      </div>
                      <h3 className="text-xl font-black text-brand-dark mb-3 tracking-tight">
                         {searchQuery || filterType || filterCategory 
                            ? "No Matching Records Found" 
                            : "Registry Initialization in Progress"}
                      </h3>
                      <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-md mx-auto mb-6">
                         {searchQuery || filterType || filterCategory 
                            ? "We could not find any evidence records matching your active filters or search terms. Try refining your selection." 
                            : "Official public evidence records for the 2026–2027 Assessment cycle are currently undergoing formal classification. Once verified under KHCRF evidence standards, approved publications will appear here."}
                      </p>
                      <div className="flex justify-center gap-3">
                         <button onClick={() => { setFilterType(''); setFilterCategory(''); setSearchQuery(''); }} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition">
                            Reset Filters
                         </button>
                         <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-primary/95 transition shadow-sm">
                            Submit New Evidence
                         </button>
                      </div>
                   </div>
               ) : (
                 <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-sm text-gray-600 flex justify-between">
                       <span>Showing {searchResults.length} of {searchTotal} results</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                       {searchResults.map(result => (
                          <div key={result.id} className="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row justify-between gap-6">
                             <div>
                                <div className="flex items-center gap-2 mb-2">
                                   <span className="text-xs font-bold bg-brand-primary/10 text-brand-primary px-2 py-1 rounded">{result.evidenceType}</span>
                                   <span className="text-xs font-bold text-gray-500">{result.referenceNumber}</span>
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark mb-2">{result.title}</h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{result.description}</p>
                                <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-medium">
                                   {result.district && <span><FaMapMarkerAlt className="inline mr-1"/>{result.district}</span>}
                                   {result.craftSector && <span><FaArrowRight className="inline mr-1"/>{result.craftSector}</span>}
                                   {result.publicationDate && <span><FaCalendarAlt className="inline mr-1"/>{new Date(result.publicationDate).toLocaleDateString()}</span>}
                                </div>
                             </div>
                             <div className="flex items-center">
                                <Link href={`/state-of-kashmir-crafts/evidence-repository/${result.slug}`} className="px-6 py-2 bg-brand-dark text-white text-sm font-bold rounded-lg hover:bg-brand-primary transition whitespace-nowrap">
                                   View Details
                                </Link>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              )}
           </div>
        </section>


        {/* Submission Form Modal / Section */}
        {showForm && (
           <div className="fixed inset-0 z-50 bg-brand-dark/80 backdrop-blur-sm overflow-y-auto pt-20 pb-20 px-4">
              <div className="bg-white max-w-4xl mx-auto rounded-3xl shadow-2xl p-8 md:p-12 relative">
                 <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-gray-400 hover:text-brand-dark font-bold">Close X</button>
                 
                 <h2 className="text-3xl font-black text-brand-dark mb-2">Submit Evidence to Repository</h2>
                 <p className="text-gray-600 mb-8 pb-8 border-b border-gray-200">Please provide detailed information to ensure proper categorization and verification by our analysts.</p>

                 {formStatus === 'SUCCESS' ? (
                    <div className="bg-green-50 text-green-800 p-8 rounded-2xl border border-green-200 text-center">
                       <FaCheckCircle className="text-5xl text-green-500 mx-auto mb-4" />
                       <h4 className="text-2xl font-bold mb-2">Evidence Submission Received</h4>
                       <p className="font-medium mb-6">{formMessage}</p>
                       <p className="text-sm text-green-700">Your submission has entered the Initial Review queue. You will receive an acknowledgment email shortly.</p>
                    </div>
                 ) : (
                    <form onSubmit={submitEvidence} className="space-y-6">
                       {formStatus === 'ERROR' && (
                          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center gap-3 font-medium">
                             <FaExclamationTriangle /> {formMessage}
                          </div>
                       )}

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Evidence Title *</label>
                             <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-brand-primary" />
                          </div>
                          <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Evidence Type *</label>
                             <select required value={formData.evidenceType} onChange={e => setFormData({...formData, evidenceType: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-brand-primary">
                                <option value="">Select type...</option>
                                <option value="Document">Document</option>
                                <option value="Photograph">Photograph</option>
                                <option value="Policy Note">Policy Note</option>
                                <option value="Research Paper">Research Paper</option>
                                <option value="Institutional Submission">Institutional Submission</option>
                             </select>
                          </div>
                          <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Contributor Name</label>
                             <input type="text" value={formData.contributorName} onChange={e => setFormData({...formData, contributorName: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-brand-primary" />
                          </div>
                          <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                             <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-brand-primary" />
                          </div>
                          <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Organization / Source</label>
                             <input type="text" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-brand-primary" />
                          </div>
                          <div>
                             <label className="block text-sm font-bold text-gray-700 mb-2">Original Publication Date</label>
                             <input type="date" value={formData.publicationDate} onChange={e => setFormData({...formData, publicationDate: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-brand-primary" />
                          </div>
                       </div>

                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Description / Abstract</label>
                          <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-brand-primary"></textarea>
                       </div>

                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Provenance / Chain of Custody</label>
                          <textarea rows={2} value={formData.provenance} onChange={e => setFormData({...formData, provenance: e.target.value})} placeholder="How was this evidence obtained or created?" className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:border-brand-primary"></textarea>
                       </div>
                       
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Upload Evidence File</label>
                          <input 
                             type="file" 
                             onChange={handleFileUpload}
                             disabled={isFileUploading}
                             className="w-full p-3 bg-white border border-gray-300 rounded-lg outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-dark"
                          />
                          {isFileUploading && <p className="text-sm text-brand-primary mt-2">Uploading...</p>}
                          {formData.fileUrl && <p className="text-sm text-green-600 mt-2">File uploaded successfully.</p>}
                       </div>
                       
                       <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                          <h4 className="font-bold text-brand-dark mb-4 border-b border-gray-200 pb-2">Visibility & Privacy Preferences</h4>
                          
                          <div className="space-y-4">
                             <label className="flex items-start gap-3 cursor-pointer">
                                <input type="radio" name="visibility" value="PUBLIC" checked={formData.visibility === 'PUBLIC'} onChange={e => setFormData({...formData, visibility: e.target.value})} className="mt-1 w-5 h-5 accent-brand-primary" />
                                <div>
                                   <span className="text-sm font-bold text-gray-800">Public</span>
                                   <p className="text-xs text-gray-500">May be published openly in the repository after review and approval.</p>
                                </div>
                             </label>
                             <label className="flex items-start gap-3 cursor-pointer">
                                <input type="radio" name="visibility" value="RESTRICTED" checked={formData.visibility === 'RESTRICTED'} onChange={e => setFormData({...formData, visibility: e.target.value})} className="mt-1 w-5 h-5 accent-brand-primary" />
                                <div>
                                   <span className="text-sm font-bold text-gray-800">Restricted</span>
                                   <p className="text-xs text-gray-500">Accessible only to authorized assessment reviewers and logged-in experts.</p>
                                </div>
                             </label>
                             <label className="flex items-start gap-3 cursor-pointer">
                                <input type="radio" name="visibility" value="CONFIDENTIAL" checked={formData.visibility === 'CONFIDENTIAL'} onChange={e => setFormData({...formData, visibility: e.target.value})} className="mt-1 w-5 h-5 accent-brand-primary" />
                                <div>
                                   <span className="text-sm font-bold text-gray-800">Confidential</span>
                                   <p className="text-xs text-gray-500">Identity and material remain strictly protected subject to KHCRF privacy policy.</p>
                                </div>
                             </label>
                             <label className="flex items-start gap-3 cursor-pointer">
                                <input type="radio" name="visibility" value="REVIEW_ONLY" checked={formData.visibility === 'REVIEW_ONLY'} onChange={e => setFormData({...formData, visibility: e.target.value})} className="mt-1 w-5 h-5 accent-brand-primary" />
                                <div>
                                   <span className="text-sm font-bold text-gray-800">Review Only</span>
                                   <p className="text-xs text-gray-500">Submitted purely for backend assessment review. Not eligible for any public publication.</p>
                                </div>
                             </label>
                          </div>

                          {formData.visibility === 'CONFIDENTIAL' && (
                             <div className="mt-4 pt-4 border-t border-gray-200">
                                <label className="block text-xs font-bold text-gray-700 mb-2">Confidentiality Explanation</label>
                                <textarea rows={2} required value={formData.confidentialityExplanation} onChange={e => setFormData({...formData, confidentialityExplanation: e.target.value})} placeholder="Please explain why this requires confidentiality..." className="w-full p-3 bg-white border border-gray-300 rounded-lg outline-none focus:border-brand-primary text-sm"></textarea>
                             </div>
                          )}
                       </div>

                       <div className="pt-6 border-t border-gray-200 space-y-4">
                          <label className="flex items-start gap-3 cursor-pointer">
                             <input type="checkbox" checked={formData.copyrightDeclaration} onChange={e => setFormData({...formData, copyrightDeclaration: e.target.checked})} className="mt-1 w-5 h-5 accent-brand-primary" />
                             <span className="text-sm text-gray-600 font-medium">I declare that I hold the copyright or have authorization to submit this material.</span>
                          </label>
                          <label className="flex items-start gap-3 cursor-pointer">
                             <input required type="checkbox" checked={formData.consent} onChange={e => setFormData({...formData, consent: e.target.checked})} className="mt-1 w-5 h-5 accent-brand-primary" />
                             <span className="text-sm text-gray-600 font-medium">I consent to the KHCRF processing this data as part of the official assessment record under the selected visibility preference.</span>
                          </label>
                       </div>

                       <button disabled={formStatus === 'LOADING' || isFileUploading} type="submit" className="w-full py-4 bg-brand-dark text-white font-black text-lg rounded-xl hover:bg-brand-primary transition disabled:opacity-50">
                          {formStatus === 'LOADING' ? 'Submitting to Repository...' : (isFileUploading ? 'Uploading File...' : 'Submit Evidence')}
                       </button>
                    </form>
                 )}
              </div>
           </div>
        )}

      </div>
    </main>
  );
}
