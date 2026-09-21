"use client";
import { getBaseUrlNoApi } from "@/lib/api";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { KASHMIR_DISTRICT_NAMES } from '@/lib/kashmir-districts';
import {
  FaFilePdf, FaBookOpen, FaDownload, FaChartPie, FaUsers, FaMapMarkerAlt,
  FaFileAlt, FaMicrophone, FaFolderOpen, FaArrowRight, FaChartLine, FaShieldAlt,
  FaUniversity, FaGlobe, FaSearch, FaCheckCircle, FaComments, FaArrowDown,
  FaBuilding, FaHandshake, FaBullseye, FaChartBar, FaCamera, FaStar, FaQuoteLeft,
  FaLandmark, FaVideo, FaInfoCircle, FaClock
} from "react-icons/fa";
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { finalReportHeroFallback } from '@/config/heroFallbacks';


const API_BASE_URL = getBaseUrlNoApi();

async function safeFetch(path: string) {
  const url = path.startsWith('http') ? path : `/api/backend${path.replace(/^\/api/, '')}`;
  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return { success: false, data: null };
    }
    const resData = await response.json();
    const data = resData.status === 'success' && resData.data ? resData.data : resData;
    return data;
  } catch (error) {
    return { success: false, data: null };
  }
}
export default function FinalReportClient() {
  const [progress, setProgress] = useState<any>(null);
  const [themes, setThemes] = useState<any>(null);
  const [geography, setGeography] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [reports, setReports] = useState<any>(null); // For future endpoint usage if needed
  
  const [cycles, setCycles] = useState<any[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [progressRes, themesRes, geoRes, statRes, cyclesRes] = await Promise.all([
          safeFetch('/api/public/skc/progress?visibility=report'),
          safeFetch('/api/public/skc/themes?visibility=report'),
          safeFetch('/api/public/skc/geography?visibility=report'),
          safeFetch('/api/public/skc/statistics?visibility=report'),
            safeFetch('/api/public/skc/cycles'),
          safeFetch('/api/public/skc/reports'), // The one endpoint from prompt request without visibility flag, though not strictly required
        ]);
        
        if (progressRes.success) setProgress(progressRes.data);
        if (themesRes.success) setThemes(themesRes.data);
        if (geoRes.success) setGeography(geoRes.data);
        if (statRes.success) setStatistics(statRes.data);
        if (cyclesRes.success) setCycles(cyclesRes.data);
      } catch (e) {
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
  
  // Status counts (Final report eligible: VALIDATED, USED_IN_FINAL_REPORT)
  const validatedCount = progress?.stages?.VALIDATED || 0;
  const finalCount = progress?.stages?.USED_IN_FINAL_REPORT || 0;

  const totalFinalEligible = validatedCount + finalCount;

  const getStatusText = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed: 0=Jan, 7=Aug, 8=Sep, 9=Oct, 10=Nov, 11=Dec

    if (year < 2026) {
      return "Pre-Publication Planning";
    }
    if (year === 2026) {
      if (month <= 7) {
        return "Pre-Publication Planning";
      } else if (month <= 9) {
        return "Public Consultation in Progress";
      } else if (month === 10) {
        return "Evidence Review & Drafting";
      } else if (month === 11) {
        if (progress?.status === 'Report Published') {
          return "Published";
        }
        return "Final Review & Validation";
      }
    }
    return "Published";
  };

  // Static fallback values
  const crafts = ["Pashmina", "Carpets", "Kani", "Papier-Mâché", "Walnut Wood", "Crewel", "Chain Stitch", "Copperware", "Namda", "Gabba"];
  const recommendationCategories = [
    "Government", "Industry", "Universities", "Media", "Civil Society",
    "Tourism Sector", "Financial Institutions", "Youth Organizations", "Heritage Bodies"
  ];
  const reportSections = [
    "Overview", "Methodology", "Stakeholder Participation", "District Analysis",
    "Craft Analysis", "Public Hearings", "Evidence Base", "Findings",
    "Recommendations", "Future Scenarios", "Acknowledgements", "References", "Appendices"
  ];
  const downloads = [
    "Full Report PDF", "Executive Summary", "Methodology", "Participation Report",
    "District Summary Report", "Craft Summary Report", "Evidence Index",
    "Consultation Report", "Validation Report", "Expert Review Summary", "Media Kit"
  ];
  const evidenceChecks = [
    { label: "Methodology Published", link: "/state-of-kashmir-crafts/methodology" },
    { label: "Governance Framework Published", link: "/state-of-kashmir-crafts/governance-framework" },
    { label: "Evidence Repository Available", link: "/state-of-kashmir-crafts/evidence-repository" },
    { label: "Validation Conducted", link: "/state-of-kashmir-crafts/validation-round" },
    { label: "Expert Review Completed", link: "/state-of-kashmir-crafts/expert-review" },
    { label: "Participation Statistics Published", link: "#" }
  ];

  const evidenceRecords = progress?.stages?.SUBMITTED || 0;
  const assessmentDomains = themes?.themes?.length || 0;
  const districtsInScope = 10;
  
  // Example progressive readiness calculation
  // Base weights: Registration (10%), Collection (30%), Draft Findings (20%), Validation (20%), Final Review (20%)
  const calculateReadiness = () => {
    // For now, hardcode to 0% based on actual completion, as the report is not ready.
    return 0;
  };
  
  const reportReadiness = calculateReadiness();

  return (
    <main className="w-full">
      {/* 1. Hero Section */}
      <UniversalEditorialHero 
        pageKey="final-report" 
        fallbackConfig={finalReportHeroFallback as any} 
      />

      {/* 2. Publication Status Board */}
      <section className="bg-brand-primary border-y-4 border-brand-secondary py-8 relative z-20 shadow-xl text-white">
         <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-6 text-center lg:text-left">
                  <div className="w-20 h-24 bg-white/10 border border-white/30 rounded-xl shadow-lg flex items-center justify-center shrink-0">
                     <FaFilePdf data-ui-icon  className="text-4xl text-white/50" />
                  </div>
                  <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/70 block mb-1">Official Publication</span>
                      <h2 className="text-2xl font-black mb-1">State of Kashmir Crafts Assessment 2026–2027</h2>
                      <div className="text-sm font-bold flex flex-col gap-1">
                         <span>Status: <span className="text-white font-extrabold underline decoration-white/50">Assessment in Progress</span></span>
                         <span className="text-white/80">Current Phase: Stakeholder Registration & Public Participation</span>
                         <span className="text-brand-secondary font-black mt-1">Target Publication: 30 May 2027</span>
                      </div>
                  </div>
               </div>
               
               <div className="flex flex-col items-center lg:items-end w-full lg:w-auto">
                 <div className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-2">Report Readiness: {reportReadiness}%</div>
                 <div className="w-full lg:w-64 bg-black/20 h-2 rounded-full overflow-hidden mb-2">
                   <div className="bg-brand-secondary h-full" style={{ width: `${reportReadiness}%` }}></div>
                 </div>
                 <div className="text-[9px] text-white/60 font-bold max-w-xs text-center lg:text-right">
                   Stakeholder Evidence → Draft Findings → Validation → Expert Review → Final Publication
                 </div>
               </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-10 text-center border-t border-white/20 pt-8">
               <div><div className="text-2xl font-black mb-1">{totalSubmissions}</div><div className="text-[9px] font-black uppercase tracking-wider text-white/70">Registered Stakeholders</div></div>
               <div><div className="text-2xl font-black mb-1">{assessmentDomains}</div><div className="text-[9px] font-black uppercase tracking-wider text-white/70">Assessment Domains</div></div>
               <div><div className="text-2xl font-black mb-1">{districtsInScope}</div><div className="text-[9px] font-black uppercase tracking-wider text-white/70">Districts in Scope</div></div>
               <div><div className="text-2xl font-black mb-1">{evidenceRecords}</div><div className="text-[9px] font-black uppercase tracking-wider text-white/70">Evidence Records</div></div>
               <div><div className="text-2xl font-black mb-1">{validatedCount}</div><div className="text-[9px] font-black uppercase tracking-wider text-white/70">Validated Records</div></div>
               <div><div className="text-2xl font-black mb-1">{totalFinalEligible}</div><div className="text-[9px] font-black uppercase tracking-wider text-white/70">Report-Ready Records</div></div>
            </div>
         </div>
      </section>

        {/* Annual Validation Archive */}
        <div className="bg-gray-100 border-b border-gray-200 py-3">
           <div className="container mx-auto px-4 flex justify-center items-center gap-4">
              <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">Assessment Cycle:</span>
              <select>
                 {cycles && cycles.length > 0 ? cycles.map((c: any) => (
                    <option key={c.cycle_id} value={c.cycle_id}>{c.cycle_label}</option>
                 )) : (
                    <option value="SOC-2026-2027">2026�2027</option>
                 )}
              </select>
           </div>
        </div>

      {/* 3. Executive Summary */}
      <section id="executive-summary" className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
           <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-brand-primary/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[var(--card-left-accent)]"></div>
              <h2 className="text-3xl font-black text-brand-dark mb-6 flex items-center justify-between">
                 Executive Summary
                 <button className="text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-[12px] hover:bg-brand-primary hover:text-white transition" disabled>Read Full Text <FaArrowRight className="inline ml-1" /></button>
              </h2>
               <div className="bg-gray-50/50 border border-gray-200/80 rounded-2xl p-12 text-center relative overflow-hidden shadow-inner my-4">
                  <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-100 mb-4 shadow-sm">
                     <FaShieldAlt className="text-xl text-gray-400" />
                  </div>
                  <h4 className="text-base font-extrabold text-brand-dark mb-1.5 tracking-tight">
                     Executive Summary Locked
                  </h4>
                  <p className="text-gray-500 font-medium text-xs leading-relaxed max-w-sm mx-auto">
                     The official executive brief and assessment synopsis are locked pending final report approval and publication.
                  </p>
               </div>
           </div>
        </div>
      </section>

      {/* 4. Report Navigation Center */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <h2 className="text-3xl font-black text-brand-dark mb-12 text-center">Explore the Report Structure</h2>
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {reportSections.map((section: any, idx: number) => (
                 <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center hover:border-brand-primary hover:shadow-md transition cursor-not-allowed opacity-75 group flex flex-col items-center justify-center min-h-[100px]">
                    <span className="font-bold text-gray-800 text-sm leading-tight group-hover:text-brand-primary transition">{section}</span>
                 </div>
              ))}
           </div>
           <p className="text-center text-sm font-bold text-brand-primary mt-6">Sections are locked prior to publication.</p>
        </div>
      </section>

      {/* 5. Participation Statistics */}
      <section id="statistics" className="py-20 universal-hero text-white border-y-4 border-brand-secondary">
        <div className="container mx-auto px-4 max-w-6xl">
           <h2 className="text-3xl font-black mb-12 text-center flex items-center justify-center gap-3">
              <FaChartPie data-ui-icon  className="" /> Final Report Readiness
           </h2>
           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                  { label: "Validated (Not Finalized)", count: validatedCount.toString(), icon: FaShieldAlt },
                  { label: "Used In Final Report", count: finalCount.toString(), icon: FaCheckCircle },
                  { label: "Report-Ready Districts", count: districtsCount.toString(), icon: FaMapMarkerAlt },
                  { label: "Approved Top Themes", count: themes?.themes?.length || 0, icon: FaChartLine }
              ].map((stat: any, idx: number) => (
                 <div key={idx} className="bg-white/10 p-6 rounded-2xl border border-white/20 text-center hover:bg-white/20 transition">
                    <stat.icon className="text-3xl text-brand-secondary mx-auto mb-3" />
                    <div className="text-3xl font-black mb-1">{stat.count}</div>
                    <div className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{stat.label}</div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 6. District Analysis & 7. Craft Analysis */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* District Analysis */}
              <div>
                 <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-3"><FaMapMarkerAlt data-ui-icon  className="" /> District Analysis Center</h2>
                 <p className="text-sm text-gray-600 mb-8">Regions with validated insights ready for the final report publication.</p>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {geography?.districts?.length > 0 ? geography.districts.map((d: any) => (
                       <div key={d.district} className="bg-white p-3 rounded-lg border border-gray-200 text-center text-sm font-bold text-gray-700 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition cursor-pointer shadow-sm">
                          {d.district} <span className="block text-[10px] text-gray-400 font-medium">Vol: {d.count}</span>
                       </div>
                    )) : (
                        <div className="col-span-full bg-white rounded-2xl border border-gray-200/80 shadow-sm p-8 text-center relative overflow-hidden">
                           <div className="mx-auto w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-3 shadow-inner">
                              <FaMapMarkerAlt className="text-sm text-gray-400" />
                           </div>
                           <h4 className="text-xs font-black text-brand-dark mb-1 tracking-tight">
                              No District Aggregates Available
                           </h4>
                           <p className="text-gray-500 font-medium text-[10px] leading-normal max-w-xs mx-auto">
                              Geographic aggregate analysis is currently undergoing verification. Regional summaries will populate here upon report validation.
                           </p>
                        </div>
                    )}
                 </div>
              </div>

              {/* Craft Analysis */}
              <div>
                 <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-3"><FaFolderOpen data-ui-icon  className="" /> Craft Analysis Center</h2>
                 <p className="text-sm text-gray-600 mb-8">Sector-specific assessments, participation statistics, and targeted future priorities.</p>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {crafts.map((c: any) => (
                       <div key={c} className="bg-white p-3 rounded-lg border border-gray-200 text-center text-sm font-bold text-gray-700 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition cursor-not-allowed shadow-sm">
                          {c}
                       </div>
                    ))}
                 </div>
                 <p className="text-xs text-gray-400 mt-4 text-center">Detailed craft findings unlock post-publication.</p>
              </div>

           </div>
        </div>
      </section>

      {/* 8. Major Findings Dashboard & 9. Recommendations Center */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="mb-20">
              <h2 className="text-3xl font-black text-brand-dark mb-10 text-center">Top Finding Themes (Aggregate)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {themes?.themes?.length > 0 ? themes.themes.slice(0, 6).map((theme: any, idx: number) => (
                    <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col justify-between group">
                       <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-4">{theme.name}</h3>
                          <div className="flex gap-4 mb-4">
                             <div className="bg-white px-3 py-1.5 rounded-[10px] border border-gray-200 text-center">
                                <div className="text-lg font-black text-brand-primary leading-none">{theme.count}</div>
                                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Report Records</div>
                             </div>
                          </div>
                       </div>
                    </div>
                 )) : (
                      <div className="col-span-full bg-white rounded-2xl border border-gray-200/80 shadow-sm p-12 text-center relative overflow-hidden">
                         <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-4 shadow-inner">
                            <FaChartLine className="text-xl text-gray-400" />
                         </div>
                         <h4 className="text-base font-extrabold text-brand-dark mb-1.5 tracking-tight">
                            No Themes Aggregated Yet
                         </h4>
                         <p className="text-gray-500 font-medium text-xs leading-relaxed max-w-md mx-auto">
                            Thematic metrics from verified hearing transcripts and consultation records are undergoing consolidation. Aggregate indices will populate here upon review cycle completion.
                         </p>
                      </div>
                 )}
              </div>
           </div>

           <div className="border-t border-gray-200 pt-16">
              <h2 className="text-3xl font-black text-brand-dark mb-10 text-center">Recommendations Framework</h2>
              <div className="flex flex-wrap gap-3 justify-center mb-10">
                 {recommendationCategories.map((cat: any) => (
                    <span key={cat} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-[12px] text-sm font-bold text-gray-700 transition opacity-70">
                       {cat}
                    </span>
                 ))}
              </div>
               <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 text-center max-w-2xl mx-auto my-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-secondary to-brand-primary"></div>
                  <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-4 shadow-inner">
                     <FaShieldAlt className="text-xl text-gray-400" />
                  </div>
                  <h3 className="text-lg font-black text-brand-dark mb-2 tracking-tight">Final Recommendations Locked</h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-md mx-auto">
                     Policy and sector-specific recommendations are currently undergoing final expert panel and editorial review. They will be unlocked and published alongside the full assessment report.
                  </p>
               </div>
           </div>
        </div>
      </section>

      {/* 11. Downloads Center & 15. Media Center */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              <div>
                 <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-3"><FaDownload data-ui-icon  className="" /> Downloads Center</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {downloads.map((doc: any, idx: number) => (
                       <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg cursor-not-allowed group shadow-sm opacity-60">
                          <span className="font-bold text-xs leading-tight text-gray-600">{doc}</span>
                          <FaFilePdf className="text-gray-300 shrink-0" />
                       </div>
                    ))}
                 </div>
                 <p className="text-xs font-bold text-brand-primary mt-4">Downloads available post-launch.</p>
              </div>

              <div>
                 <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-3"><FaCamera data-ui-icon  className="" /> Media Center</h2>
                 <div className="space-y-3">
                    {["Press Release: 2026–2027 Assessment Launch", "Assessment Launch Video Coverage", "Executive Interviews & Audio", "High-Res Report Graphics for Media"].map((media: any, idx: number) => (
                       <div key={idx} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl cursor-not-allowed opacity-60 shadow-sm">
                          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 shrink-0 border border-gray-100">
                             {idx === 1 ? <FaVideo /> : idx === 2 ? <FaMicrophone /> : idx === 3 ? <FaCamera /> : <FaFileAlt />}
                          </div>
                          <span className="font-bold text-sm text-gray-500">{media}</span>
                       </div>
                    ))}
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* 12. Evidence & Transparency Center */}
      <section className="py-16 universal-hero text-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <h2 className="text-2xl font-black mb-8 text-center flex items-center justify-center gap-3"><FaShieldAlt data-ui-icon  className="" /> Evidence & Transparency Center</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {evidenceChecks.map((check: any, idx: number) => (
                 <Link href={check.link} key={idx} className="flex items-center gap-3 p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition">
                    <FaCheckCircle className="text-green-400 shrink-0 text-xl" />
                    <span className="font-bold text-sm">{check.label}</span>
                 </Link>
              ))}
           </div>
        </div>
      </section>

      {/* 13. Acknowledgements & 14. Citation & Referencing */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2">
                 <h2 className="text-2xl font-black text-brand-dark mb-6">Acknowledgements</h2>
                 <p className="text-sm text-gray-600 mb-6 font-medium">The State of Kashmir Crafts assessment is made possible through the unprecedented cooperation of thousands of individuals and organizations.</p>
                 <div className="flex flex-wrap gap-2">
                    {["Advisory Council", "Expert Reviewers", "Participating Institutions", "Government Departments", "Universities", "Trade Bodies", "Artisans", "Contributors", "Sponsors", "Partners"].map((tag: any) => (
                       <span key={tag} className="px-3 py-1.5 bg-white border border-gray-200 text-xs font-bold text-gray-700 rounded shadow-sm cursor-pointer hover:bg-brand-primary hover:text-white transition">{tag}</span>
                    ))}
                 </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <h2 className="text-lg font-black text-brand-dark mb-4 flex items-center gap-2"><FaQuoteLeft data-ui-icon  className="" /> Recommended Citation</h2>
                 <div className="bg-gray-50 p-4 rounded border border-gray-100 mb-4 text-xs font-medium text-gray-700 leading-relaxed font-mono">
                  <h4 className="text-sm font-black text-brand-dark mb-4 uppercase tracking-widest">Recommended Citation</h4>
                  <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded text-brand-dark font-medium leading-relaxed mb-4 text-sm">
                     Hamadan Craft Revival Foundation (KHCRF). (2027). State of Kashmir Crafts Assessment 2026–2027. Srinagar, J&K.
                  </div>
                  <div className="space-y-2 text-xs font-bold text-gray-500">
                     <div>DOI: <span className="text-gray-800">10.XXXX/hcrf.2026-2027</span></div>
                     <div>URL: <span className="text-brand-primary hover:underline cursor-pointer">khcrf.org/report/2026-2027</span></div>
                  </div></div>
              </div>
           </div>
        </div>
      </section>

      {/* 20. Call to Action */}
      <section className="py-20 relative overflow-hidden universal-hero">
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
            <h3 className="text-3xl md:text-4xl font-black mb-10 tracking-tight text-white leading-tight">
              The report is not the end of the conversation.
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 bg-brand-primary text-white font-bold rounded-[14px] hover:bg-brand-secondary transition-all shadow-xl">
                View Next Assessment
              </button>
              <Link
                href="/state-of-kashmir-crafts/stakeholder-registry"
                className="px-8 py-4 bg-white text-brand-dark font-bold rounded-[14px] hover:bg-gray-100 transition-all shadow-xl"
              >
                Register as Stakeholder
              </Link>
              <Link
                href="/state-of-kashmir-crafts/evidence-repository"
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-[14px] hover:bg-white/10 transition-all"
              >
                Explore Evidence Repository
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
