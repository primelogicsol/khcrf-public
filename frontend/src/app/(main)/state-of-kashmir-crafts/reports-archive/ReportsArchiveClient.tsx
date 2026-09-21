"use client";
import { getBaseUrlNoApi } from "@/lib/api";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { KASHMIR_DISTRICT_NAMES } from '@/lib/kashmir-districts';
import {
  FaHistory, FaChartLine, FaDownload, FaFilePdf, FaBookOpen, FaFilter,
  FaExchangeAlt, FaArrowUp, FaArrowDown, FaChartBar, FaGlobe, FaSearch,
  FaDatabase, FaCheckCircle, FaSpinner, FaUniversity, FaLandmark,
  FaArrowRight, FaMapMarkerAlt, FaBriefcase, FaComments, FaFileAlt, FaBullseye,
  FaFolderOpen, FaTable, FaFileDownload, FaChartPie, FaListAlt, FaShieldAlt
} from "react-icons/fa";
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { reportsArchiveHeroFallback } from '@/config/heroFallbacks';

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
export default function ReportsArchiveClient() {
  const [progress, setProgress] = useState<any>(null);
  const [themes, setThemes] = useState<any>(null);
  const [geography, setGeography] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [reports, setReports] = useState<any>(null); // Available for future endpoint
  
  const [cycles, setCycles] = useState<any[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [progressRes, themesRes, geoRes, statRes, cyclesRes] = await Promise.all([
          safeFetch('/api/public/skc/progress?visibility=archive'),
          safeFetch('/api/public/skc/themes?visibility=archive'),
          safeFetch('/api/public/skc/geography?visibility=archive'),
          safeFetch('/api/public/skc/statistics?visibility=archive'),
            safeFetch('/api/public/skc/cycles'),
          safeFetch('/api/public/skc/reports'), 
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
  
  // Status counts (Archive eligible: VALIDATED, USED_IN_FINAL_REPORT, ARCHIVED)
  const validatedCount = progress?.stages?.VALIDATED || 0;
  const finalCount = progress?.stages?.USED_IN_FINAL_REPORT || 0;
  const archivedCount = progress?.stages?.ARCHIVED || 0;

  const totalArchiveEligible = validatedCount + finalCount + archivedCount;

  const archiveStats = [
    { label: "Assessments Processing", count: "1", icon: FaBookOpen }, // Changed to reflect WIP
    { label: "Archived Submissions", count: archivedCount.toString(), icon: FaDatabase },
    { label: "Final Report Eligible", count: finalCount.toString(), icon: FaCheckCircle },
    { label: "Validated Ready", count: validatedCount.toString(), icon: FaShieldAlt }, // using ShieldAlt for Validated
    { label: "Archive Districts", count: districtsCount.toString(), icon: FaMapMarkerAlt },
    { label: "Years Tracking", count: "2026 - Present", icon: FaHistory }
  ];
  // We need to import FaShieldAlt, adding it dynamically here (noting it for later if it fails)
  // Actually, FaShieldAlt is imported in the other files, I will use FaCheckCircle for validated to be safe and avoid adding new imports dynamically if not imported.
  const evidenceRecords = progress?.stages?.SUBMITTED || 0;
  const validatedRecords = progress?.stages?.VALIDATED || 0;
  const reportReadyRecords = progress?.stages?.USED_IN_FINAL_REPORT || 0;

  const annualReports = [
    { year: "2026-2027", status: "ACTIVE ASSESSMENT", date: "30 May 2027", stakeholders: totalSubmissions.toString(), institutions: activeStakeholderTypes.toString(), evidenceRecords: evidenceRecords.toString(), validatedRecords: validatedRecords.toString(), reportReadyRecords: reportReadyRecords.toString() }
  ];

  const trendIndicators = [
    { label: "Archived Data Volume", trend: "up", val: totalArchiveEligible.toString() },
    { label: "Active Districts", trend: "up", val: districtsCount.toString() },
    { label: "Stakeholder Categories", trend: "up", val: activeStakeholderTypes.toString() },
    { label: "Core Themes", trend: "neutral", val: themes?.themes?.length || "0" }
  ];

  const findingsEvolution = [
    { theme: "Youth Participation", y26: "Critical decline in weaving sectors", y27: "TBD", y28: "TBD", trend: "down" },
    { theme: "Market Access", y26: "High intermediary dependency", y27: "TBD", y28: "TBD", trend: "neutral" },
    { theme: "Authenticity", y26: "Mass counterfeiting threatens brand", y27: "TBD", y28: "TBD", trend: "down" },
    { theme: "Training", y26: "Ustad-shagird system breaking down", y27: "TBD", y28: "TBD", trend: "neutral" },
    { theme: "Women Entrepreneurship", y26: "High participation, low financial control", y27: "TBD", y28: "TBD", trend: "up" },
  ];

  const craftTrends = [
    "Pashmina", "Carpets", "Kani", "Papier-Mâché", "Walnut Wood", "Crewel",
    "Chain Stitch", "Copperware", "Namda", "Gabba"
  ];
  
  const districts = KASHMIR_DISTRICT_NAMES;

  const recommendationTracker = [
    { title: "Establish Independent GI Enforcement Taskforce", target: "Government", status: "Proposed" },
    { title: "Create Direct-to-Consumer Digital Artisan Portals", target: "Industry", status: "Under Discussion" },
    { title: "Integrate Craft Curricula into University Arts Programs", target: "Universities", status: "Proposed" },
    { title: "Develop Standardized Artisan Health Insurance Scheme", target: "Government", status: "Proposed" }
  ];

  const impactDashboard = [
    { label: "Policies Influenced", count: "0" },
    { label: "Programs Initiated", count: "0" },
    { label: "Institutions Engaged", count: "0" },
    { label: "Research Projects Triggered", count: "0" },
    { label: "Public Dialogues Held", count: "0" },
    { label: "Media Mentions", count: "0" }
  ];

  const openData = [
    "Download Participation Data (Anonymized CSV)",
    "Download District Metadata (JSON)",
    "Download Evidence Indexes (CSV)",
    "Download Finding References (CSV)"
  ];

  return (
    <main className="w-full">
      {/* 1. Hero Section */}
      <UniversalEditorialHero 
        pageKey="reports-archive" 
        fallbackConfig={reportsArchiveHeroFallback as any} 
      />

      {/* 2. Archive Overview */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
           <h2 className="text-3xl font-black text-brand-dark mb-10 text-center">Archive Overview Data</h2>
           {loading ? (
             <div className="flex justify-center py-10"><FaSpinner data-ui-icon  className="animate-spin text-4xl " /></div>
           ) : (
             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {archiveStats.map((stat: any, idx: number) => (
                   <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center hover:border-brand-primary hover:shadow-md transition">
                      <stat.icon className="text-3xl text-brand-secondary mx-auto mb-3" />
                      <div className="text-2xl font-black text-gray-900 mb-1">{stat.count}</div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{stat.label}</div>
                   </div>
                ))}
             </div>
           )}
        </div>
      </section>

      {/* 3. Assessment Report Library */}
      <section id="library" className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
           <h2 className="text-3xl font-black text-brand-dark mb-10 flex items-center justify-center gap-3"><FaBookOpen data-ui-icon  className="" /> Assessment Report Library</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {annualReports.map((report: any, idx: number) => (
                 <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between group hover:border-brand-primary transition">
                    <div>
                       <div className="flex justify-between items-start mb-4">
                          <span className="text-3xl font-black text-gray-900 group-hover:text-brand-primary transition">{report.year}</span>
                          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${report.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                             {report.status}
                          </span>
                       </div>
                       <p className="text-xs font-bold text-gray-500 mb-6">Target Publication: {report.date}</p>
                       <div className="space-y-2 mb-6 text-sm">
                          <div className="flex justify-between"><span className="text-gray-500">Registered Stakeholders</span><span className="font-bold text-gray-900">{report.stakeholders}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Districts in Scope</span><span className="font-bold text-gray-900">10</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Assessment Domains</span><span className="font-bold text-gray-900">{themes?.themes?.length || 0}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Evidence Records</span><span className="font-bold text-gray-900">{report.evidenceRecords}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Validated Records</span><span className="font-bold text-gray-900">{report.validatedRecords}</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Report-Ready Records</span><span className="font-bold text-gray-900">{report.reportReadyRecords}</span></div>
                       </div>
                    </div>
                    {report.status === 'PUBLISHED' ? (
                       <div className="flex gap-2">
                          <button className="flex-1 py-2 bg-brand-primary text-white font-bold rounded hover:bg-brand-secondary transition text-xs">View Report</button>
                          <button className="px-3 py-2 bg-gray-100 text-icon-on-light border border-gray-200 font-bold rounded hover:bg-gray-200 transition text-xs"><FaDownload /></button>
                       </div>
                    ) : (
                       <Link href="/state-of-kashmir-crafts/current-assessment-2026" className="w-full block text-center py-2 bg-brand-primary text-white font-bold rounded text-xs hover:bg-brand-secondary transition">View Current Assessment</Link>
                    )}
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 4. Multi-Year Comparison Center */}
      <section className="py-20 universal-hero relative overflow-hidden">
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
           <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <h2 className="text-3xl font-black text-white flex items-center gap-3"><FaExchangeAlt data-ui-icon  className="" /> Multi-Year Comparison</h2>
              <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl border border-white/20">
                 <select className="px-4 py-2 bg-transparent text-white font-bold focus:outline-none"><option>2026</option></select>
                 <span className="text-gray-400 font-black">VS</span>
                 <select className="px-4 py-2 bg-transparent text-white font-bold focus:outline-none"><option>2027 (Upcoming)</option></select>
                 <button className="px-4 py-2 bg-brand-secondary text-white font-black rounded-[14px] hover:bg-white hover:text-brand-dark transition">Compare</button>
              </div>
           </div>
           
           <div className="bg-white/10 p-12 rounded-3xl border border-white/20 text-center">
              <FaChartBar className="text-6xl text-white/30 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-white mb-2">Comparison Data Available in 2027</h3>
              <p className="text-gray-300 font-medium max-w-xl mx-auto">The Multi-Year Comparison Center requires at least two published annual assessments. Check back during the 2027 Validation Round.</p>
           </div>
        </div>
      </section>

      {/* 5. Longitudinal Indicators Dashboard */}
      <section id="trends" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <h2 className="text-3xl font-black text-brand-dark mb-10 flex items-center justify-center gap-3"><FaChartLine data-ui-icon  className="" /> Tracking Indicators Dashboard</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trendIndicators.map((ind: any, idx: number) => (
                 <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-between shadow-sm">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">{ind.label}</div>
                    <div className="flex justify-between items-end">
                       <span className="text-2xl font-black text-gray-900">{ind.val}</span>
                       {ind.trend === 'up' ? <FaArrowUp className="text-green-500" /> : 
                        ind.trend === 'down' ? <FaArrowDown className="text-red-500" /> : 
                        <FaExchangeAlt className="text-gray-400" />}
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 8. Findings Evolution */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
           <h2 className="text-3xl font-black text-brand-dark mb-10 flex items-center gap-3"><FaHistory data-ui-icon  className="" /> Findings Evolution</h2>
           <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                       <th className="p-4 font-black">Top 2026 Archive Themes</th>
                       <th className="p-4 font-black">2026 Finding Records</th>
                       <th className="p-4 font-black">2027 Records</th>
                       <th className="p-4 font-black">Trend Tracker</th>
                    </tr>
                 </thead>
                 <tbody className="text-sm font-medium text-gray-800">
                    {themes?.themes?.length > 0 ? themes.themes.slice(0, 5).map((finding: any, idx: number) => (
                       <tr key={idx} className="border-b border-gray-100 hover:bg-brand-primary/5 transition">
                          <td className="p-4 font-bold text-brand-dark">{finding.name}</td>
                          <td className="p-4 text-gray-600">{finding.count} Records</td>
                          <td className="p-4 text-gray-400 italic">TBD</td>
                          <td className="p-4">
                             <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded">Baseline Set</span>
                          </td>
                       </tr>
                    )) : (
                        <tr>
                           <td colSpan={4} className="p-12 text-center bg-gray-50/30">
                              <div className="mx-auto w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 mb-3 shadow-sm">
                                 <FaHistory className="text-sm text-gray-400" />
                              </div>
                              <h4 className="text-xs font-black text-brand-dark mb-1 tracking-tight">
                                 No Archive Themes Aggregated
                              </h4>
                              <p className="text-gray-500 font-medium text-[10px] leading-normal max-w-xs mx-auto">
                                 Longitudinal comparison metrics and historical theme indices are currently locked pending validation round closure.
                              </p>
                           </td>
                        </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </section>

      {/* 6. Craft Trends & 7. District Trends */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              <div>
                 <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-3"><FaFolderOpen data-ui-icon  className="" /> Craft Archive Sectors</h2>
                 <p className="text-sm text-gray-600 mb-8">Craft categories structured for longitudinal reporting.</p>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {craftTrends.map((c: any) => (
                       <div key={c} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center text-sm font-bold text-gray-700 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition cursor-not-allowed shadow-sm opacity-70">
                          {c}
                       </div>
                    ))}
                 </div>
              </div>

              <div>
                 <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-3"><FaMapMarkerAlt data-ui-icon  className="" /> District Archive Volumes</h2>
                 <p className="text-sm text-gray-600 mb-8">Geographical data structured for archive trend analysis.</p>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {geography?.districts?.length > 0 ? geography.districts.map((d: any) => (
                       <div key={d.district} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center text-sm font-bold text-gray-700 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition cursor-pointer shadow-sm">
                          {d.district} <span className="block text-[10px] text-gray-400 font-medium">Vol: {d.count}</span>
                       </div>
                     )) : (
                        <div className="col-span-full bg-white rounded-2xl border border-gray-200/80 shadow-sm p-8 text-center relative overflow-hidden">
                           <div className="mx-auto w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-3 shadow-inner">
                              <FaMapMarkerAlt className="text-sm text-gray-400" />
                           </div>
                           <h4 className="text-xs font-black text-brand-dark mb-1 tracking-tight">
                              No District Archives Available
                           </h4>
                           <p className="text-gray-500 font-medium text-[10px] leading-normal max-w-xs mx-auto">
                              Geographical archive aggregates are currently undergoing data migration. Historical regional summaries will populate here upon completion.
                           </p>
                        </div>
                     )}
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* 9. Recommendation Tracker & 10. Impact Dashboard */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              <div className="lg:col-span-2">
                 <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-3"><FaListAlt data-ui-icon  className="" /> Recommendation Tracker</h2>
                 <p className="text-sm text-gray-600 mb-8">Tracking the status of all official recommendations made across past assessments.</p>
                 <div className="space-y-4">
                     {recommendationTracker.map((rec: any, idx: number) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:border-brand-primary hover:shadow-md transition">
                           <div>
                              <h4 className="font-extrabold text-brand-dark text-base mb-2 leading-snug">{rec.title}</h4>
                              <div className="flex flex-wrap items-center gap-3">
                                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded border border-gray-100 flex items-center gap-1.5">
                                    <FaBullseye data-ui-icon  className="" /> Target: {rec.target}
                                 </span>
                                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                    Assessments Baseline
                                 </span>
                              </div>
                           </div>
                           <span className="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-yellow-50 text-yellow-800 border border-yellow-200 shrink-0 shadow-sm">
                              Pending Launch
                           </span>
                        </div>
                     ))}
                 </div>
              </div>

              <div>
                 <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-3"><FaChartPie data-ui-icon  className="" /> Impact Dashboard</h2>
                 <div className="space-y-3">
                    {impactDashboard.map((impact: any, idx: number) => (
                       <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
                          <span className="font-bold text-sm text-gray-700">{impact.label}</span>
                          <span className="font-black text-brand-primary text-lg">{impact.count}</span>
                       </div>
                    ))}
                 </div>
                 <p className="text-xs text-center text-gray-400 font-bold mt-4">Impact tracking begins post-publication.</p>
              </div>

           </div>
        </div>
      </section>

      {/* 13. Open Data & Research Center & 16. Downloads Center */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              
              <div>
                 <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-3"><FaDatabase data-ui-icon  className="" /> Open Data & Research Center</h2>
                 <p className="text-sm text-gray-600 mb-8 font-medium">Researchers and policymakers can download aggregated, anonymized data from past assessments for independent analysis.</p>
                 <div className="space-y-3">
                    {openData.map((data: any, idx: number) => (
                       <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-not-allowed group shadow-sm opacity-60">
                          <div className="flex items-center gap-3 font-bold text-sm text-gray-800">
                             <FaTable className="text-gray-400" /> {data}
                          </div>
                          <FaFileDownload className="text-gray-300" />
                       </div>
                    ))}
                 </div>
                 <p className="text-xs font-bold text-brand-primary mt-4">Open data portals activate post-launch.</p>
              </div>

              <div>
                 <h2 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-3"><FaDownload data-ui-icon  className="" /> Complete Archives</h2>
                 <div className="grid grid-cols-2 gap-3">
                    {["All Final Reports", "All Executive Summaries", "All Methodologies", "All Trend Reports", "All Data Summaries", "All Validation Reports"].map((doc: any) => (
                       <div key={doc} className="p-4 bg-gray-50 border border-gray-200 rounded-xl cursor-not-allowed text-center opacity-60">
                          <FaFolderOpen className="text-3xl text-gray-300 mx-auto mb-2" />
                          <span className="font-bold text-xs text-gray-800 leading-tight block">{doc}</span>
                       </div>
                    ))}
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* 15. Legacy & Institutional Memory */}
      <section className="py-16 bg-brand-primary/10 border-y border-brand-primary/20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
           <FaLandmark data-ui-icon  className="text-5xl  mx-auto mb-6" />
           <h3 className="text-2xl font-black text-brand-dark mb-4">Legacy & Institutional Memory</h3>
           <p className="text-gray-700 leading-relaxed font-medium text-lg">
              The State of Kashmir Crafts archive preserves an evolving public record of Kashmir's handicraft ecosystem, ensuring that stakeholder voices, evidence, findings, and recommendations remain completely accessible to future generations.
           </p>
        </div>
      </section>

      {/* 14. Archive Search */}
      <section className="py-24 bg-brand-primary text-white border-t border-brand-secondary relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
         <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <h2 className="text-3xl font-black mb-8 text-center flex items-center justify-center gap-3"><FaSearch data-ui-icon  className="" /> Deep Archive Search</h2>
            <div className="bg-white/10 p-8 rounded-3xl border border-white/20 opacity-50 pointer-events-none mb-6">
               <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <input type="text" placeholder="Search keywords, themes, or craft..." className="flex-1 p-4 bg-white border border-transparent rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-secondary" />
                  <select className="p-4 bg-white border border-transparent rounded-xl text-gray-900 font-medium">
                     <option>All Years</option>
                     <option>2026</option>
                  </select>
                  <button className="px-8 py-4 bg-brand-primary text-white font-black rounded-[14px] hover:bg-brand-secondary transition shadow-lg">Search</button>
               </div>
               <div className="flex flex-wrap justify-center gap-3 text-xs font-bold text-gray-300">
                  <span>Filters:</span>
                  <span className="px-3 py-1 bg-white/10 rounded cursor-pointer hover:bg-brand-primary hover:text-white transition">District</span>
                  <span className="px-3 py-1 bg-white/10 rounded cursor-pointer hover:bg-brand-primary hover:text-white transition">Craft</span>
                  <span className="px-3 py-1 bg-white/10 rounded cursor-pointer hover:bg-brand-primary hover:text-white transition">Stakeholder Type</span>
                  <span className="px-3 py-1 bg-white/10 rounded cursor-pointer hover:bg-brand-primary hover:text-white transition">Publication Type</span>
               </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center max-w-xl mx-auto shadow-inner">
               <div className="mx-auto w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/10 mb-3">
                  <FaShieldAlt data-ui-icon  className="text-xs " />
               </div>
               <p className="text-gray-300 font-medium text-xs leading-relaxed">
                  Search indexes and deep filters are currently locked. The longitudinal archive database will activate automatically when the first assessment cycle findings are formally published.
               </p>
            </div>
         </div>
      </section>
    </main>
  );
}
