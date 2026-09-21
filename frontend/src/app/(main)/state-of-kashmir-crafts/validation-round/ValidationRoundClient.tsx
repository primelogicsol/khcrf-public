"use client";
import { getBaseUrlNoApi } from "@/lib/api";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import {
  FaCheckCircle, FaShieldAlt, FaUsers, FaFileAlt, FaGlobe, FaSearch,
  FaArrowRight, FaCalendarAlt, FaComments, FaRegCheckCircle, FaExclamationTriangle,
  FaUpload, FaEdit, FaTimesCircle, FaHandshake, FaChartBar, FaUserCheck,
  FaChartPie, FaDownload, FaHistory, FaFolderOpen, FaMapMarkerAlt, FaFileSignature,
  FaQuestionCircle, FaChartLine, FaFilePdf, FaArrowDown
} from "react-icons/fa";

// FeatureCard component inlined or adjusted for simplicity if it relies on other components.
import FeatureCard from "@/components/common/FeatureCard";
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { validationRoundHeroFallback } from '@/config/heroFallbacks';


const API_BASE_URL = getBaseUrlNoApi();

async function safeFetch(path: string) {
  const url = path.startsWith('http') ? path : `/api/backend${path.replace(/^\/api/, '')}`;
  const response = await fetch(url);
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(`Expected JSON but received ${contentType}. Response preview: ${text.slice(0, 200)}`);
  }
  const resData = await response.json();
  const data = resData.status === 'success' && resData.data ? resData.data : resData;
  return data;
}
export default function ValidationRoundClient() {
  const [progress, setProgress] = useState<any>(null);
  const [themes, setThemes] = useState<any>(null);
  const [geography, setGeography] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [draftFindings, setDraftFindings] = useState<any[]>([]);
  
  const [cycles, setCycles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [responseType, setResponseType] = useState<string>('');
  const [formStatus, setFormStatus] = useState<string>('');
  const [formMessage, setFormMessage] = useState<string>('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [progressRes, themesRes, geoRes, statRes, dfRes] = await Promise.all([
          safeFetch('/api/public/skc/progress?visibility=validation').catch(() => ({ success: false })),
          safeFetch('/api/public/skc/themes?visibility=validation').catch(() => ({ success: false })),
          safeFetch('/api/public/skc/geography?visibility=validation').catch(() => ({ success: false })),
          safeFetch('/api/public/skc/statistics?visibility=validation').catch(() => ({ success: false })),
          safeFetch('/api/skc/draft-findings/public').catch(() => ({ success: false }))
        ]);
        
        if (progressRes.success) setProgress(progressRes.data);
        if (themesRes.success) setThemes(themesRes.data);
        if (geoRes.success) setGeography(geoRes.data);
        if (statRes.success) setStatistics(statRes.data);
          
        if (dfRes.success && dfRes.data?.findings) setDraftFindings(dfRes.data.findings);
      } catch (e) {
        console.error("Failed to fetch validation metrics", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const totalSubmissions = statistics?.stakeholders ? statistics.stakeholders.reduce((sum: number, s: any) => sum + s.count, 0) : 0;
  const activeStakeholderTypes = statistics?.stakeholders?.length || 0;
  const districtsCount = geography?.districts?.length || 0;
  
  // Status counts
  const draftsCount = progress?.stages?.USED_IN_DRAFT || 0;
  const validatedCount = progress?.stages?.VALIDATED || 0;
  const finalCount = progress?.stages?.USED_IN_FINAL_REPORT || 0;

  const whyMatters = [
    { title: "Accuracy", icon: FaCheckCircle, desc: "Ensures the Final Report is based on facts, not misinterpretations." },
    { title: "Transparency", icon: FaGlobe, desc: "Prevents findings from being finalized behind closed doors." },
    { title: "Inclusiveness", icon: FaUsers, desc: "Gives marginalized voices a chance to correct missing perspectives." },
    { title: "Evidence Verification", icon: FaFileAlt, desc: "Double-checks that all claims are backed by the Evidence Repository." },
    { title: "Stakeholder Trust", icon: FaHandshake, desc: "Builds confidence that KHCRF genuinely listened during consultations." },
    { title: "Public Accountability", icon: FaShieldAlt, desc: "Maintains a rigorous, defensible process against future criticism." }
  ];

  const validationTargets = [
    { title: "Stakeholder Findings", icon: FaUsers },
    { title: "District Findings", icon: FaMapMarkerAlt },
    { title: "Craft Findings", icon: FaFolderOpen },
    { title: "Public Hearing Summaries", icon: FaComments },
    { title: "Evidence Interpretation", icon: FaSearch },
    { title: "Participation Statistics", icon: FaChartBar },
    { title: "Emerging Themes", icon: FaChartLine },
    { title: "Draft Conclusions", icon: FaFileSignature }
  ];

  const actionCards = [
    { type: "SUPPORT", title: "Support a Draft Finding", icon: FaCheckCircle, desc: "Confirm that a published Draft Finding accurately reflects your experience, evidence, or institutional perspective.", color: "bg-green-50 text-green-700 border-green-200 hover:border-green-400 hover:bg-green-100" },
    { type: "CLARIFICATION", title: "Submit a Clarification", icon: FaComments, desc: "Provide additional context or nuance that may improve the accuracy and completeness of a published Draft Finding.", color: "bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400 hover:bg-blue-100" },
    { type: "FACTUAL_ERROR", title: "Report a Factual Error", icon: FaExclamationTriangle, desc: "Identify an incorrect fact, statistic, date, attribution, quotation, geographic reference, or evidence citation.", color: "bg-red-50 text-red-700 border-red-200 hover:border-red-400 hover:bg-red-100" },
    { type: "ADDITIONAL_EVIDENCE", title: "Submit Additional Evidence", icon: FaUpload, desc: "Provide new documents, research, data, testimony, or other material that supports, qualifies, or challenges a Draft Finding.", color: "bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400 hover:bg-purple-100" },
    { type: "MISSING_PERSPECTIVE", title: "Identify a Missing Perspective", icon: FaSearch, desc: "Identify a stakeholder group, craft, geography, issue, or experience that is not adequately represented.", color: "bg-orange-50 text-orange-700 border-orange-200 hover:border-orange-400 hover:bg-orange-100" },
    { type: "REVIEW_MEETING_REQUEST", title: "Request a Review Meeting", icon: FaUsers, desc: "Request a formal consultation where substantial evidence or a significant difference of interpretation requires direct discussion.", color: "bg-gray-100 text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-200" }
  ];

  const handleActionClick = (type: string) => {
    setResponseType(type);
    document.getElementById('validation-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const resolutionTracker: any[] = []; // Intentionally left empty as individual reviewer notes are not publicly disclosed yet

  const downloads = [
    "Draft Findings PDF",
    "Validation Guidelines",
    "Feedback Template",
    "Evidence Submission Guide",
    "Validation Summary Report"
  ];

  const timeline = [
    "Draft Findings Published", "Validation Opens", "Feedback Received",
    "Evidence Reviewed", "Revisions Prepared", "Validation Closes", "Expert Review Begins"
  ];

  // Use explicit timezone parsing for Asia/Kolkata
  const validationLaunch = new Date('2027-05-08T00:00:00+05:30');
  const validationClose = new Date('2027-05-12T23:59:59+05:30');
  
  // Calculate dynamic "today" safely inside JS using Kolkata timezone snapshot
  const now = new Date();
  const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(now);
  const p = {}; parts.forEach(part => p[part.type] = part.value);
  // Reconstruct ISO string for accurate Math operations inside Kolkata timezone
  const today = new Date(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}+05:30`);
  
  let validationPhase = 'Validation Round Scheduled';
  let validationStatus = 'Scheduled';
  // Standard integer floor distance in days to avoid fractional ceiling jumps mid-day
  let daysDifference = Math.floor((validationLaunch.getTime() - today.getTime()) / (1000 * 3600 * 24));
  let daysLabel = 'Days Until Validation Opens';
  let dateText = '8 May 2027';
  let dateLabel = 'Launch Date';

  if (today >= validationLaunch && today <= validationClose) {
    validationPhase = 'Validation Round OPEN';
    validationStatus = 'OPEN';
    daysDifference = Math.ceil((validationClose.getTime() - today.getTime()) / (1000 * 3600 * 24));
    daysLabel = 'Days Remaining';
    dateText = '12 May 2027';
    dateLabel = 'Closing Date';
  } else if (today > validationClose) {
    validationPhase = 'Validation Round CLOSED / COMPLETED';
    validationStatus = 'CLOSED';
    daysDifference = 0;
    daysLabel = 'Validation Completed';
    dateText = '12 May 2027';
    dateLabel = 'Closed On';
  }

  return (
    <main className="w-full">
      {/* 1. Hero Section */}
      <UniversalEditorialHero 
        pageKey="validation-round" 
        fallbackConfig={validationRoundHeroFallback as any} 
      />

      {/* 3. Validation Status Dashboard */}
      <section className="bg-brand-primary border-y-4 border-brand-secondary py-8 relative z-20 shadow-xl">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-white">
                 <div className="text-center lg:text-left">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/70 block mb-1">Validation Status</span>
                    <h2 className="text-2xl font-black flex items-center gap-2 justify-center lg:justify-start">
                       {validationStatus === 'OPEN' && (
                         <span className="relative flex h-4 w-4 mr-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                         </span>
                       )}
                       {validationPhase}
                    </h2>
                 </div>
                 <div className="flex gap-6 lg:gap-8 text-center items-start justify-center flex-wrap">
                    <div>
                       <div className="text-[10px] font-bold uppercase tracking-wider text-white/70">{dateLabel}</div>
                       <div className="text-xl font-black mb-1 mt-1">{dateText}</div>
                    </div>
                    <div className="hidden md:block w-px bg-white/20 h-10 mt-1"></div>
                    <div>
                       <div suppressHydrationWarning className="text-2xl font-black mb-1">{daysDifference}</div>
                       <div className="text-[10px] font-bold uppercase tracking-wider text-white/70">{daysLabel}</div>
                    </div>
                    <div className="hidden md:block w-px bg-white/20 h-10 mt-1"></div>
                    <div>
                       <div className="text-2xl font-black mb-1">{validationStatus === 'Scheduled' ? 0 : validatedCount}</div>
                       <div className="text-[10px] font-bold uppercase tracking-wider text-white/70 mb-1">Validated Records</div>
                       {validationStatus === 'Scheduled' && <div className="text-[9px] text-white/50 italic">Validation has not started</div>}
                    </div>
                    <div className="hidden md:block w-px bg-white/20 h-10 mt-1"></div>
                    <div>
                       <div className="text-2xl font-black mb-1">{validationStatus === 'Scheduled' ? 0 : totalSubmissions}</div>
                       <div className="text-[10px] font-bold uppercase tracking-wider text-white/70 mb-1">Stakeholder Responses</div>
                       {validationStatus === 'Scheduled' && <div className="text-[9px] text-white/50 italic">Response window has not opened</div>}
                    </div>
                 </div>
            </div>
            <div className="w-full bg-black/20 rounded-full h-1.5 mt-6">
              <div className="bg-brand-secondary h-1.5 rounded-full" style={{ width: '0%' }}></div>
            </div>
         </div>
      </section>

      {/* 18. Annual Validation Archive */}
      <div className="bg-gray-100 border-b border-gray-200 py-3">
         <div className="container mx-auto px-4 flex justify-center items-center gap-4">
            <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">Assessment Cycle:</span>
            <select>
                 {cycles && cycles.length > 0 ? cycles.map((c: any) => (
                    <option key={c.cycle_id} value={c.cycle_id}>{c.cycle_label}</option>
                 )) : (
                    <option value="SOC-2026-2027">2026{"\u2013"}2027</option>
                 )}
              </select>
         </div>
      </div>

      {/* 2. Why Validation Matters */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-black text-brand-dark mb-6">Why Validation Matters</h2>
              <div className="text-gray-600 leading-relaxed space-y-4 font-medium mb-6">
                <p>Findings should never move directly from a spreadsheet into a final report without public verification.</p>
                <p>Stakeholders deserve an explicit opportunity to review the draft findings and verify whether their perspectives, concerns, and recommendations were represented fairly and accurately.</p>
                <p>The sole objective of this phase is to answer one question: <strong>"Did we accurately represent what stakeholders told us?"</strong></p>
              </div>
              <div className="w-20 h-1 bg-brand-secondary rounded"></div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
               {whyMatters.map((item: any, idx: number) => (
                 <FeatureCard key={idx} icon={item.icon} title={item.title} description={item.desc} />
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. What Can Be Validated? & 5. Validation Actions */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
           
           {/* What Can Be Validated */}
           <div className="mb-20">
              <h2 className="text-3xl font-black text-brand-dark mb-8 text-center">What Can Be Validated?</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {validationTargets.map((target: any, idx: number) => (
                    <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center hover:border-brand-primary transition group">
                       <target.icon className="text-3xl text-gray-400 mx-auto mb-3 group-hover:text-brand-primary transition" />
                       <span className="font-bold text-sm text-gray-800 leading-tight">{target.title}</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* Validation Actions */}
           <div>
              <h2 className="text-3xl font-black text-brand-dark mb-8 text-center">Primary Validation Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {actionCards.map((card: any, idx: number) => (
                    <button 
                       key={idx} 
                       onClick={() => handleActionClick(card.type)}
                       className={`w-full p-6 rounded-2xl border transition cursor-pointer flex flex-col items-center text-center shadow-sm ${card.color} ${responseType === card.type ? 'ring-4 ring-brand-primary' : ''}`}
                       aria-pressed={responseType === card.type}
                    >
                       <card.icon className="text-4xl mb-4" />
                       <h3 className="font-black text-lg mb-2">{card.title}</h3>
                       <p className="text-sm font-medium opacity-90">{card.desc}</p>
                    </button>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 6. Validation Submission Form */}
      <section id="validation-form" className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200">
              <div className="text-center mb-10" aria-live="polite">
                 <FaEdit data-ui-icon  className="text-5xl  mx-auto mb-4" />
                 <h2 className="text-3xl font-black text-brand-dark mb-2">
                   {responseType === 'SUPPORT' ? 'Support a Draft Finding' :
                    responseType === 'CLARIFICATION' ? 'Submit a Clarification' :
                    responseType === 'FACTUAL_ERROR' ? 'Report a Factual Error' :
                    responseType === 'ADDITIONAL_EVIDENCE' ? 'Submit Additional Evidence' :
                    responseType === 'MISSING_PERSPECTIVE' ? 'Identify a Missing Perspective' :
                    responseType === 'REVIEW_MEETING_REQUEST' ? 'Request a Review Meeting' :
                    'Submit Validation Feedback'}
                 </h2>
                 <p className="text-gray-600 font-medium">
                   {responseType === 'CLARIFICATION' ? 'Provide additional context or nuance that may improve the accuracy and completeness of a published Draft Finding.' :
                    responseType ? 'Complete the fields below to submit your feedback.' : 'Choose a validation action above to review, correct, support, or challenge a published Draft Finding.'}
                 </p>
              </div>

              {responseType ? (
                <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                   
                   {draftFindings.length === 0 && (
                      <div className="bg-yellow-50 text-yellow-800 p-6 rounded-xl border border-yellow-200 mb-6 font-bold text-center">
                         Public validation will open after approved Draft Findings are published.
                      </div>
                   )}

                   <fieldset disabled={draftFindings.length === 0} className="space-y-6 group">
                   
                   {/* DRAFT FINDING SELECTOR */}
                   <div className="bg-brand-primary/5 p-6 rounded-2xl border border-brand-primary/20 mb-6 group-disabled:opacity-50">
                      <label className="block text-xs font-bold text-brand-dark uppercase mb-2">Draft Finding *</label>
                      <select required className="w-full p-4 bg-white border border-brand-primary/30 rounded-xl font-bold text-brand-dark focus:outline-brand-primary disabled:cursor-not-allowed">
                         {draftFindings.length === 0 ? (
                           <option value="">No Draft Findings are currently available for validation.</option>
                         ) : (
                           <>
                             <option value="">Select a published finding to review...</option>
                             {draftFindings.map(f => (
                               <option key={f.id} value={f.id}>
                                 {f.referenceNumber || f.slug} - {f.title} (v{f.version || 1})
                               </option>
                             ))}
                           </>
                         )}
                      </select>
                   </div>

                   {/* COMMON FIELDS */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name *</label>
                         <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address *</label>
                         <input type="email" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Organization (Optional)</label>
                         <input type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary" />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Designation (Optional)</label>
                         <input type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary" />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Stakeholder Type *</label>
                         <select required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl">
                            <option value="">Select stakeholder type</option>
                            <option>Artisan</option>
                            <option>Exporter</option>
                            <option>Government</option>
                            <option>NGO / Civil Society</option>
                            <option>Academic / Researcher</option>
                            <option>Other</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">District or Geography</label>
                         <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl">
                            <option value="">Select district or geography</option>
                            <option>Srinagar</option>
                            <option>Budgam</option>
                            <option>Ganderbal</option>
                            <option>Anantnag</option>
                            <option>Bandipora</option>
                            <option>Baramulla</option>
                            <option>Other / Regional</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Craft Sector</label>
                         <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl">
                            <option value="">Select craft sector</option>
                            <option>Pashmina</option>
                            <option>Carpet Weaving</option>
                            <option>Papier Mache</option>
                            <option>Wood Carving</option>
                            <option>Crewel / Chainstitch</option>
                            <option>Multiple / General</option>
                         </select>
                      </div>
                   </div>

                   {/* ACTION SPECIFIC FIELDS */}
                   <div className="border-t border-gray-100 pt-6 space-y-6">
                     
                     {responseType === 'SUPPORT' && (
                       <>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Level of Support *</label>
                             <select required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary">
                               <option value="">Select level...</option>
                               <option>Strongly Agree</option>
                               <option>Generally Agree</option>
                               <option>Agree with minor reservations</option>
                             </select>
                           </div>
                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Relevant Experience *</label>
                             <input type="text" required placeholder="e.g. 15 years as Pashmina weaver" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary" />
                           </div>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Basis of Support *</label>
                            <textarea required rows={4} placeholder="Explain why this Draft Finding accurately reflects your experience, evidence, or institutional perspective." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-brand-primary"></textarea>
                         </div>
                       </>
                     )}

                     {responseType === 'CLARIFICATION' && (
                       <>
                         <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Finding Section or Claim *</label>
                           <input type="text" required placeholder="Identify the specific section, statement, or claim that requires clarification." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary" />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Clarification *</label>
                            <textarea required rows={4} placeholder="Provide the additional context, explanation, or nuance that should be considered." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-brand-primary"></textarea>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Why It Matters *</label>
                            <textarea required rows={2} placeholder="Explain how this clarification may affect the meaning, accuracy, scope, or interpretation of the Draft Finding." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-brand-primary"></textarea>
                         </div>
                       </>
                     )}

                     {responseType === 'FACTUAL_ERROR' && (
                       <>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Exact Statement or Statistic *</label>
                             <input type="text" required placeholder="Quote the exact error..." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary" />
                           </div>
                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Error Type *</label>
                             <select required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary">
                               <option value="">Select error type...</option>
                               <option>Statistical Error</option>
                               <option>Historical Inaccuracy</option>
                               <option>Misattribution</option>
                               <option>Outdated Information</option>
                               <option>Other</option>
                             </select>
                           </div>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Explanation *</label>
                            <textarea required rows={3} placeholder="Quote or identify the exact statement, statistic, date, or attribution you believe is incorrect." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-brand-primary"></textarea>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Proposed Correction *</label>
                            <textarea required rows={2} placeholder="What should it say instead?" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-brand-primary"></textarea>
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Source Citation *</label>
                           <input type="text" required placeholder="Cite the evidence supporting your correction" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary" />
                         </div>
                       </>
                     )}

                     {responseType === 'ADDITIONAL_EVIDENCE' && (
                       <>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Evidence Title *</label>
                             <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary" />
                           </div>
                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Evidence Type *</label>
                             <select required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary">
                               <option value="">Select type...</option>
                               <option>Document / Report</option>
                               <option>Data / Spreadsheet</option>
                               <option>Photograph / Media</option>
                               <option>Academic Research</option>
                             </select>
                           </div>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Relationship to Finding *</label>
                            <textarea required rows={2} placeholder="Does this support, challenge, or expand the draft finding?" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-brand-primary"></textarea>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Summary *</label>
                            <textarea required rows={3} placeholder="Briefly summarize what this evidence proves." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-brand-primary"></textarea>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Source / Author *</label>
                             <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary" />
                           </div>
                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Date of Evidence</label>
                             <input type="date" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary" />
                           </div>
                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Provenance *</label>
                             <input type="text" required placeholder="Where did this come from?" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary" />
                           </div>
                         </div>
                         <div className="flex items-center gap-2 mt-2">
                           <input type="checkbox" required id="copyright-ack" className="w-4 h-4" />
                           <label htmlFor="copyright-ack" className="text-xs text-gray-600">I confirm I have the authority to submit this evidence to the public repository.</label>
                         </div>
                       </>
                     )}

                     {responseType === 'MISSING_PERSPECTIVE' && (
                       <>
                         <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Missing Perspective Type *</label>
                           <select required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary">
                             <option value="">Select type...</option>
                             <option>Stakeholder Group</option>
                             <option>Geographic Area</option>
                             <option>Economic Issue</option>
                             <option>Social/Cultural Factor</option>
                           </select>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description *</label>
                            <textarea required rows={3} placeholder="Describe the stakeholder group, geography, craft, issue, or experience that is insufficiently represented." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-brand-primary"></textarea>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Why It Is Material *</label>
                            <textarea required rows={2} placeholder="How does this omission change the overall conclusion?" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-brand-primary"></textarea>
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Recommended Stakeholder or Source *</label>
                           <input type="text" required placeholder="Who should KHCRF consult to fill this gap?" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary" />
                         </div>
                       </>
                     )}

                     {responseType === 'REVIEW_MEETING_REQUEST' && (
                       <>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Reason for Request *</label>
                             <select required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary">
                               <option value="">Select reason...</option>
                               <option>Structural Disagreement</option>
                               <option>Complex Institutional Feedback</option>
                               <option>Confidential Testimony</option>
                             </select>
                           </div>
                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Preferred Meeting Format *</label>
                             <select required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary">
                               <option value="">Select format...</option>
                               <option>In-Person (Srinagar)</option>
                               <option>Virtual / Online</option>
                               <option>Phone Call</option>
                             </select>
                           </div>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Material Discrepancy *</label>
                            <textarea required rows={3} placeholder="Explain why written feedback may not be sufficient to resolve the discrepancy." className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-brand-primary"></textarea>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Desired Outcome *</label>
                            <textarea required rows={2} placeholder="What resolution are you seeking from this meeting?" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-brand-primary"></textarea>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Requested Participants</label>
                             <input type="text" placeholder="Who will attend from your side?" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary" />
                           </div>
                           <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Contact Phone *</label>
                             <input type="tel" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary" />
                           </div>
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Accessibility or Translation Requirements</label>
                           <input type="text" placeholder="e.g. Sign language, Kashmiri translation" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary" />
                         </div>
                       </>
                     )}

                     {/* SHARED FILE UPLOAD */}
                     <div className="mt-6 bg-gray-50 p-6 rounded-2xl border border-gray-200 group-disabled:opacity-50">
                        <label className="block text-xs font-bold text-brand-dark uppercase mb-2">
                           {responseType === 'ADDITIONAL_EVIDENCE' ? 'Upload Evidence Files *' : 'Supporting Files (Optional)'}
                        </label>
                        <input 
                           type="file" 
                           required={responseType === 'ADDITIONAL_EVIDENCE'} 
                           accept=".pdf,.docx,.jpg,.png,.csv,.xlsx"
                           className="w-full p-3 bg-white border border-gray-300 rounded-[12px] file:mr-4 file:py-2 file:px-4 file:rounded-[12px] file:border-0 file:text-sm file:font-bold file:bg-brand-primary/10 file:text-brand-primary cursor-pointer disabled:cursor-not-allowed" 
                        />
                        <div className="text-xs text-gray-500 mt-3 font-medium space-y-1">
                           <p><strong>Supported formats:</strong> PDF, DOCX, JPG, PNG, CSV, and XLSX</p>
                           <p><strong>Maximum size:</strong> 10 MB per file</p>
                           <p className="mt-2">Uploaded files are securely stored and reviewed before they are linked to the assessment record.</p>
                        </div>
                     </div>

                     {/* PRIVACY & CONSENT */}
                     <div className="space-y-4 pt-4 border-t border-gray-200 group-disabled:opacity-50">
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Confidentiality Level *</label>
                           <select required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-brand-primary disabled:cursor-not-allowed">
                             <option value="">Select confidentiality level...</option>
                             <option value="PUBLIC">Public Attribution: Your name and submission may be cited if approved for publication.</option>
                             <option value="ANONYMOUS">Anonymous Public Use: Your submission may be used publicly without identifying you.</option>
                             <option value="REVIEW_ONLY">Review Only: Available only to authorized assessment reviewers.</option>
                             <option value="CONFIDENTIAL">Confidential: Identity and material are restricted under the applicable evidence and privacy policies.</option>
                           </select>
                        </div>
                        <div className="flex items-start gap-3">
                           <input type="checkbox" required id="privacy-ack" className="mt-1 w-4 h-4 disabled:cursor-not-allowed" />
                           <label htmlFor="privacy-ack" className="text-sm text-gray-600">I consent to the processing of this response and any supporting files in accordance with KHCRF’s Validation Governance and Privacy policies. I understand that the submission will be recorded for review, accountability, and audit purposes and will not automatically be published or incorporated into the Draft Finding.</label>
                        </div>
                     </div>

                     {draftFindings.length > 0 && (
                        <button type="submit" className="w-full py-5 bg-brand-primary text-white font-black text-lg rounded-xl hover:bg-brand-secondary transition shadow-xl mt-6">
                           {responseType === 'SUPPORT' ? 'Support Finding' :
                            responseType === 'CLARIFICATION' ? 'Submit Clarification' :
                            responseType === 'FACTUAL_ERROR' ? 'Submit Error Report' :
                            responseType === 'ADDITIONAL_EVIDENCE' ? 'Submit Evidence' :
                            responseType === 'MISSING_PERSPECTIVE' ? 'Submit Missing Perspective' :
                            responseType === 'REVIEW_MEETING_REQUEST' ? 'Request Review Meeting' :
                            'Submit Feedback'}
                        </button>
                     )}
                   </div>
                   </fieldset>
                </form>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-200 border-dashed">
                   <FaCheckCircle className="text-4xl text-gray-300 mx-auto mb-4" />
                   <p className="text-gray-500 font-bold text-lg">Please select a Validation Action from the cards above to begin.</p>
                </div>
              )}
           </div>
        </div>
      </section>

      {/* 8. Validation Statistics & 12. Validation Resolution Tracker */}
      <section className="py-20 universal-hero relative overflow-hidden">
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
           
           <div className="flex justify-between items-end mb-12">
             <h2 className="text-3xl font-black text-white flex items-center gap-3"><FaChartPie data-ui-icon  className="" /> Live Validation Statistics</h2>
             <div>
               {loading && <p className="text-brand-secondary font-bold text-sm animate-pulse">Syncing metrics...</p>}
               {error && <p className="text-red-500 font-bold text-sm">Failed to sync live data.</p>}
             </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              <div>
                 <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Submissions Used in Draft", val: draftsCount.toString(), col: "text-blue-400" },
                      { label: "Validated Submissions", val: validatedCount.toString(), col: "text-green-400" },
                      { label: "Final Report Eligible", val: finalCount.toString(), col: "text-purple-400" },
                      { label: "Districts Represented", val: districtsCount.toString(), col: "text-orange-400" }
                    ].map((stat: any, idx: number) => (
                       <div key={idx} className="bg-white/10 p-6 rounded-2xl border border-white/20 text-center">
                          <div className={`text-4xl font-black mb-2 ${stat.col}`}>{stat.val}</div>
                          <div className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{stat.label}</div>
                       </div>
                    ))}
                 </div>
                 <div className="mt-8 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h3 className="font-bold text-white mb-4 text-sm">Stakeholder Categories Participating</h3>
                    <div className="flex flex-wrap gap-2">
                       {/* Placeholder for now until real mappings */}
                       <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-[10px]">{activeStakeholderTypes} Active Categories</span>
                    </div>
                 </div>
              </div>
              <div>
                 <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3"><FaSearch data-ui-icon  className="" /> Resolution Tracker</h2>
                 <p className="text-gray-300 mb-6 text-sm">Transparency mechanism showing exactly how validation feedback is being handled by the review team.</p>
                 <div className="space-y-4">
                     {resolutionTracker.length === 0 ? (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden shadow-inner">
                           <div data-editorial-accent-bg className="absolute top-0 left-0 w-full h-[2px] /40"></div>
                           <div className="mx-auto w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/10 mb-4">
                              <FaShieldAlt data-ui-icon  className="text-sm " />
                           </div>
                           <h4 className="text-sm font-extrabold text-white mb-1.5 tracking-tight">
                              Confidentiality Protocol Active
                           </h4>
                           <p className="text-gray-300 font-medium text-xs leading-relaxed max-w-sm mx-auto">
                              Individual validation submissions and detailed reviewer notes are not publicly disclosed at this stage to protect participant confidentiality. Mapped summary reports will be published in the final assessment index.
                           </p>
                        </div>
                     ) : resolutionTracker.map((res: any, idx: number) => (
                       <div key={idx} className="bg-white p-5 rounded-xl flex flex-col sm:flex-row gap-4 items-start shadow-lg">
                          <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider shrink-0 mt-1 ${
                             res.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                             res.status === 'Accepted' ? 'bg-blue-100 text-blue-700' :
                             res.status === 'Partially Accepted' ? 'bg-orange-100 text-orange-700' :
                             'bg-gray-200 text-gray-700'
                          }`}>
                             {res.status}
                          </div>
                          <div>
                             <div className="flex justify-between items-center mb-1">
                                <span className="font-black text-brand-dark text-sm">{res.id} <span className="text-gray-400 font-medium">| {res.type}</span></span>
                                <span className="text-xs font-bold text-gray-400">{res.date}</span>
                             </div>
                             <p className="text-sm text-gray-600 leading-snug font-medium">{res.desc}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* 10. Review Meeting Requests & 11. Public Validation Feed */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Meeting Requests */}
              <div className="lg:col-span-1">
                 <h2 className="text-2xl font-black text-brand-dark mb-6">Request Review Meeting</h2>
                 <p className="text-sm text-gray-600 mb-8 font-medium">For structural disagreements or complex institutional feedback, you may request a direct meeting with the assessment team.</p>
                 <form className="space-y-4">
                    <input type="text" placeholder="Organization / Group Name" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-brand-primary" />
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-brand-primary">
                       <option>Meeting Type</option>
                       <option>virtual (Srinagar)</option>
                       <option>Online / Virtual</option>
                       <option>Phone Call</option>
                    </select>
                    <textarea rows={3} placeholder="Reason for meeting..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:outline-brand-primary"></textarea>
                    <button className="w-full py-3 bg-brand-dark text-white font-bold rounded-lg hover:bg-brand-secondary transition text-sm">
                       Submit Meeting Request
                    </button>
                 </form>
              </div>

              {/* Public Feed & Common Issues */}
              <div className="lg:col-span-2">
                 <h2 className="text-2xl font-black text-brand-dark mb-6">Top Validation Themes (Aggregate)</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    {themes?.themes?.length > 0 ? themes.themes.slice(0, 4).map((theme: any, idx: number) => (
                        <div key={idx} className="p-4 border border-gray-200 rounded-xl hover:border-brand-primary transition">
                            <h4 className="font-bold text-gray-900 text-sm mb-1">{theme.name}</h4>
                            <p className="text-xs text-gray-500">{theme.count} validation insights or records concerning this theme.</p>
                        </div>
                    )) : (
                        <div className="p-4 border border-gray-200 rounded-xl hover:border-brand-primary transition col-span-full">
                            <p className="text-sm text-gray-500 font-bold">No theme data synchronized yet.</p>
                        </div>
                    )}
                 </div>

                 <h2 className="text-2xl font-black text-brand-dark mb-6">Live Validation Feed</h2>
                 <p className="text-gray-500 mb-6">Validation has not opened. Official validation activity will appear after draft findings are published and the formal validation round begins.</p>
              </div>
           </div>
        </div>
      </section>

      {/* 16. Validation Timeline */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-black text-brand-dark mb-16">Validation Timeline</h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
             <div className="hidden md:block absolute top-6 left-0 w-full h-1 bg-gray-200 z-0"></div>
             {timeline.map((step: any, idx: number) => (
                <div key={idx} className="relative z-10 flex flex-col items-center w-full md:w-32 px-2 group">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg mb-4 shadow-md border-4 border-white transition transform group-hover:scale-110 ${idx === 1 ? 'bg-green-500 text-white shadow-green-200' : idx === timeline.length - 1 ? 'bg-brand-secondary text-white' : 'bg-brand-primary text-white'}`}>
                     {idx + 1}
                   </div>
                   <h3 className={`font-bold text-xs text-center leading-tight uppercase tracking-wider ${idx === 1 ? 'text-green-600' : 'text-gray-700'}`}>{step}</h3>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 14. Validation Governance & 17. Downloads */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200">
                 <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-3"><FaShieldAlt data-ui-icon  className="" /> Validation Governance</h2>
                 <ul className="space-y-4">
                    {[
                      "All validation submissions are reviewed by the core assessment team.",
                      "Submission of feedback does not guarantee automatic revision of the draft.",
                      "Final editorial decisions remain with KHCRF to prevent lobbying bias.",
                      "Reasons for major revisions or rejection of widespread feedback must be documented.",
                      "Abusive or non-evidence-based submissions will be discarded."
                    ].map((item: any, idx: number) => (
                       <li key={idx} className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                          <FaRegCheckCircle data-ui-icon  className=" shrink-0 mt-0.5" /> {item}
                       </li>
                    ))}
                 </ul>
                 
                 {/* 15. Transparency Notice */}
                 <div className="mt-8 bg-brand-primary/10 border border-brand-primary/20 p-5 rounded-xl">
                    <h4 className="font-black text-brand-dark mb-2 text-sm flex items-center gap-2"><FaGlobe /> Transparency Notice</h4>
                    <p className="text-xs text-gray-700 leading-relaxed font-bold">The Validation Round exists to improve accuracy and credibility through evidence and clarification. It is not a voting process or a popularity contest.</p>
                 </div>
              </div>
              
              <div>
                 <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-3"><FaDownload data-ui-icon  className="" /> Validation Downloads</h2>
                 <div className="space-y-3">
                    {downloads.map((doc: any, idx: number) => (
                       <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-brand-primary transition cursor-pointer group shadow-sm">
                          <div className="flex items-center gap-3 font-bold text-sm text-gray-800">
                             <FaFilePdf data-ui-icon  className="" /> {doc}
                          </div>
                          <FaArrowDown className="text-gray-400 group-hover:text-brand-primary transition" />
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 19. Call to Action */}
      <section className="py-20 relative overflow-hidden universal-hero">
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
            <h3 className="text-3xl md:text-4xl font-black mb-10 tracking-tight text-white leading-tight">
              Help ensure the final report reflects reality.
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="#validation-form"
                className="px-8 py-4 bg-brand-primary text-white font-bold rounded-[14px] hover:bg-brand-secondary transition-all shadow-xl"
              >
                Submit Validation Feedback
              </Link>
              <Link
                href="/state-of-kashmir-crafts/draft-findings"
                className="px-8 py-4 bg-white text-brand-dark font-bold rounded-[14px] hover:bg-gray-100 transition-all shadow-xl"
              >
                Review Draft Findings
              </Link>
              <Link
                href="/state-of-kashmir-crafts/evidence-repository"
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-[14px] hover:bg-white/10 transition-all"
              >
                Submit Evidence
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
