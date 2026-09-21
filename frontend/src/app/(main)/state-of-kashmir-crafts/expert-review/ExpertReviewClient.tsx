"use client";
import { getBaseUrlNoApi } from "@/lib/api";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FaUserTie, FaSearch, FaFileAlt, FaCheckCircle, 
  FaChartPie, FaComments, FaHistory, FaShieldAlt, 
  FaAward, FaUniversity, FaBuilding, FaGlobe,
  FaBookOpen, FaPenNib, FaDownload, FaArrowDown,
  FaLock
} from 'react-icons/fa';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { expertReviewHeroFallback } from '@/config/heroFallbacks';

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
export default function ExpertReviewClient() {
  const [progress, setProgress] = useState<any>(null);
  const [themes, setThemes] = useState<any>(null);
  const [geography, setGeography] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cycles, setCycles] = useState<any[]>([]);
  

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [progressRes, themesRes, geoRes, statRes, cyclesRes] = await Promise.all([
          safeFetch('/api/public/skc/progress?visibility=expert'),
          safeFetch('/api/public/skc/themes?visibility=expert'),
          safeFetch('/api/public/skc/geography?visibility=expert'),
          safeFetch('/api/public/skc/statistics?visibility=expert'),
            safeFetch('/api/public/skc/cycles'),
        ]);
        
        if (progressRes.success) setProgress(progressRes.data);
        if (themesRes.success) setThemes(themesRes.data);
        if (geoRes.success) setGeography(geoRes.data);
        if (statRes.success) setStatistics(statRes.data);
          if (cyclesRes && cyclesRes.success) setCycles(cyclesRes.data);
      } catch (e) {
        console.error("Failed to fetch expert review metrics", e);
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

  // Status counts (Expert eligible: VERIFIED, USED_IN_DRAFT, VALIDATED, USED_IN_FINAL_REPORT, ARCHIVED)
  const draftsCount = progress?.stages?.USED_IN_DRAFT || 0;
  const verifiedCount = progress?.stages?.VERIFIED || 0;
  const validatedCount = progress?.stages?.VALIDATED || 0;
  const finalCount = progress?.stages?.USED_IN_FINAL_REPORT || 0;

  const totalExpertEligible = verifiedCount + draftsCount + validatedCount + finalCount;

  const whyMatters = [
    { title: "Quality Assurance", icon: FaShieldAlt },
    { title: "Evidence Review", icon: FaSearch },
    { title: "Technical Accuracy", icon: FaCheckCircle },
    { title: "Sector Expertise", icon: FaUserTie },
    { title: "Gap Identification", icon: FaSearch },
    { title: "Credibility Enhancement", icon: FaAward }
  ];

  const expertCategories = [
    "Master Artisans", "National Awardees", "Shilp Gurus", "Export Specialists", 
    "Manufacturers", "Researchers", "Academics", "Former Government Officials", 
    "GI Experts", "Pashmina Specialists", "Carpet Specialists", "Heritage Experts", 
    "Tourism Experts", "Financial Experts", "Digital Commerce Experts", "Media Experts", 
    "Policy Experts", "Design & Innovation Experts"
  ];

  const expertReviewScope = [
    { title: "Methodology Review", icon: FaSearch },
    { title: "Evidence Review", icon: FaBookOpen },
    { title: "Findings Review", icon: FaCheckCircle },
    { title: "Craft-Specific Review", icon: FaFileAlt },
    { title: "District Analysis Review", icon: FaChartPie },
    { title: "Data Interpretation Review", icon: FaSearch },
    { title: "Recommendation Review", icon: FaComments },
    { title: "Future Outlook Review", icon: FaGlobe }
  ];

  const craftReviewPanels = [
    "Pashmina Panel", "Carpet Panel", "Papier-Mâché Panel", "Wood Carving Panel", 
    "Copperware Panel", "Textiles Panel", "GI & Authenticity Panel", "Heritage & Conservation Panel"
  ];

  const institutionalReviewers = [
    "Universities", "Research Institutes", "Government Experts", "Museums", 
    "Archives", "Trade Associations", "Professional Bodies", "Independent Researchers"
  ];

  const downloads = [
    "Review Guidelines", "Reviewer Handbook", "Terms of Reference", "Conflict of Interest Declaration", "Review Template"
  ];

  const workflow = [
    "Reviewer Invited", "Materials Shared", "Review Submitted", "Review Logged", "Editorial Assessment", "Accepted / Rejected / Partially Accepted", "Integrated into Final Report"
  ];

  return (
    <main className="w-full">
      {/* 1. Hero Section */}
      <UniversalEditorialHero 
        pageKey="expert-review" 
        fallbackConfig={expertReviewHeroFallback as any} 
      />

      {/* 3. Expert Review Dashboard */}
      <section className="py-12 bg-brand-primary/5 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-end mb-6">
             <h2 className="text-2xl font-black text-brand-dark">Live Review Pool Statistics</h2>
             <div>
               {loading && <p className="text-brand-secondary font-bold text-sm animate-pulse">Syncing metrics...</p>}
               {error && <p className="text-red-500 font-bold text-sm">Failed to sync live data.</p>}
             </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Verified Data Points", count: verifiedCount.toString(), icon: FaCheckCircle },
              { label: "Draft Elements", count: draftsCount.toString(), icon: FaPenNib },
              { label: "Validated Submissions", count: validatedCount.toString(), icon: FaShieldAlt },
              { label: "Final Report Eligible", count: finalCount.toString(), icon: FaFileAlt },
              { label: "Districts Represented", count: districtsCount.toString(), icon: FaGlobe },
              { label: "Total Eligible Submissions", count: totalExpertEligible.toString(), icon: FaChartPie }
            ].map((stat: any, idx: number) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <stat.icon className="text-3xl text-brand-secondary mb-3" />
                <div className="text-2xl font-black text-gray-900 mb-1">{stat.count}</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm font-bold text-brand-primary mt-6">Expert Review Phase activates following Draft Findings publication.</p>
        </div>
      </section>

      {/* 2. Why Expert Review Matters */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="w-full lg:w-1/2">
                 <h2 className="text-3xl font-black text-brand-dark mb-6">Why Expert Review Matters</h2>
                 <p className="text-gray-600 mb-6 leading-relaxed font-medium">
                   The assessment benefits from the deep knowledge of practitioners, researchers, former officials, artisans, exporters, heritage professionals, and sector specialists.
                 </p>
                 <p className="text-gray-600 leading-relaxed font-medium">
                   Professional review before publication strengthens quality, accuracy, and long-term credibility. While reviewers do not control the findings, their role is crucial in identifying gaps, challenging assumptions, and highlighting missing evidence.
                 </p>
              </div>
              <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
                 {whyMatters.map((item: any, idx: number) => (
                   <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center gap-4 hover:border-brand-primary transition shadow-sm">
                      <div data-ui-icon className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center  shrink-0">
                         <item.icon />
                      </div>
                      <span className="font-bold text-sm text-gray-800">{item.title}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 4. Expert Categories */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
           <h2 className="text-3xl font-black text-brand-dark mb-12 text-center">Expert Categories</h2>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {expertCategories.map((cat: any, i: number) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center flex items-center justify-center min-h-[80px] hover:border-brand-primary transition cursor-pointer">
                   <span className="text-xs font-bold text-gray-700">{cat}</span>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 5. Expert Review Scope */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <h2 className="text-3xl font-black text-brand-dark mb-12 text-center">Expert Review Scope</h2>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {expertReviewScope.map((scope: any, idx: number) => (
                <div key={idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                   <scope.icon className="text-3xl text-brand-secondary mb-4" />
                   <h3 className="font-bold text-gray-900 text-sm">{scope.title}</h3>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 8. Expert Review Workflow */}
      <section id="workflow" className="py-24 bg-brand-primary text-white border-y-4 border-brand-secondary relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
         <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <div className="text-center mb-16">
               <span data-editorial-accent-text className=" text-xs font-black uppercase tracking-widest block mb-3">Assessment Lifecycle</span>
               <h2 className="text-3xl md:text-5xl font-black mb-6">Expert Review Workflow</h2>
               <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed font-medium">
                  The rigorous path from expert invitation to the final integration of peer recommendations into the State of Kashmir Crafts Assessment Report:
               </p>
            </div>
            
            <div className="relative border-l-2 border-white/20 ml-4 md:ml-32 space-y-12 pb-4">
               {[
                  { title: "Reviewer Invited", desc: "Secretariat issues formal invitations to accredited subject-matter experts and academic reviewers." },
                  { title: "Materials Shared", desc: "Draft findings, transcript indices, and evidence repositories are shared via the secure reviewer portal." },
                  { title: "Review Submitted", desc: "Panellists complete evaluations including code audits, reference validations, and comments." },
                  { title: "Review Logged", desc: "Submissions are formally logged in the KHCRF validation registry for tracking and audit checks." },
                  { title: "Editorial Assessment", desc: "The editorial committee reviews feedback against KHCRF evidence quality standards." },
                  { title: "Advisory Resolution", desc: "Formal resolution decision is reached (Accepted, Rejected, or Partially Accepted) with reviewer notes." },
                  { title: "Report Integration", desc: "Approved improvements are integrated into the pre-publication version of the Annual Assessment." }
               ].map((step, idx) => (
                  <div key={idx} className="relative pl-8 md:pl-12 group">
                     {/* Timeline marker */}
                     <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-brand-primary border-2 border-brand-secondary flex items-center justify-center font-black text-xs text-brand-secondary group-hover:bg-brand-secondary group-hover:text-brand-dark transition shadow-md">
                        {idx + 1}
                     </div>
                     <div>
                        <h4 className="font-extrabold text-white text-lg mb-1 leading-tight group-hover:text-brand-secondary transition">{step.title}</h4>
                        <p className="text-white/70 text-sm font-medium leading-relaxed max-w-2xl">{step.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 6. Expert Reviewer Directory */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-4">Expert Reviewer Directory</h2>
               <p className="text-gray-600 font-medium max-w-2xl mx-auto">Public listing of official review panellists for the current assessment cycle.</p>
            </div>
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-16 text-center max-w-3xl mx-auto my-4 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-secondary to-brand-primary"></div>
               <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-6 shadow-inner">
                  <FaLock className="text-2xl text-gray-400" />
               </div>
               <h3 className="text-xl font-black text-brand-dark mb-2 tracking-tight">Reviewers Not Yet Published</h3>
               <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-md mx-auto">
                  Panellist profiles and formal reviewer registrations are currently undergoing verification. Official directory listings will be published following confirmation and formal consent during the validation round.
               </p>
            </div>
        </div>
      </section>

      {/* 7. Review Submission Portal */}
      <section id="portal" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
           <div className="bg-gray-50 p-8 md:p-12 rounded-3xl shadow-xl border border-gray-200">
              <div className="text-center mb-10">
                 <FaPenNib data-ui-icon  className="text-4xl  mx-auto mb-4" />
                 <h2 className="text-3xl font-black text-brand-dark mb-2">Review Submission Portal</h2>
                 <p className="text-gray-600 font-medium">Submit structured expert feedback directly to the editorial committee.</p>
              </div>
              <form className="space-y-6 opacity-50 pointer-events-none">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-xs font-bold text-gray-700 mb-2">Reviewer Name</label>
                     <input type="text" className="w-full p-4 border border-gray-300 rounded-xl bg-white" disabled />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-700 mb-2">Organization / Affiliation</label>
                     <input type="text" className="w-full p-4 border border-gray-300 rounded-xl bg-white" disabled />
                   </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-xs font-bold text-gray-700 mb-2">Expert Category</label>
                     <select className="w-full p-4 border border-gray-300 rounded-xl bg-white" disabled>
                        <option>Select Category</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-700 mb-2">Section Being Reviewed</label>
                     <select className="w-full p-4 border border-gray-300 rounded-xl bg-white" disabled>
                        <option>Select Section</option>
                     </select>
                   </div>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-700 mb-2">Review Type</label>
                   <select className="w-full p-4 border border-gray-300 rounded-xl bg-white" disabled>
                      <option>Methodology</option>
                      <option>Evidence</option>
                      <option>Findings</option>
                      <option>District Analysis</option>
                      <option>Craft Analysis</option>
                      <option>Recommendations</option>
                      <option>Other</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-700 mb-2">Review Comments & Recommendations</label>
                   <textarea className="w-full p-4 border border-gray-300 rounded-xl bg-white h-32" disabled></textarea>
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-700 mb-2">Upload Supporting Documents (Optional)</label>
                   <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl bg-white text-center text-gray-400 text-sm font-bold">
                      Choose File
                   </div>
                 </div>
                 <button type="button" className="w-full py-4 bg-gray-300 text-white font-black rounded-xl text-lg" disabled>
                   Portal Opens Post-Validation
                 </button>
              </form>
           </div>
        </div>
      </section>

      {/* 9. Expert Recommendations Dashboard & 10. Key Expert Observations */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
           <h2 className="text-3xl font-black text-brand-dark mb-12 text-center">Expert Recommendations Dashboard (Aggregate)</h2>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {[
                { label: "High-Level Themes", count: themes?.themes?.length || 0, col: "text-gray-900" },
                { label: "Active Stakeholder Categories", count: activeStakeholderTypes, col: "text-green-600" },
                { label: "Pending Verification", count: "0", col: "text-orange-500" },
                { label: "Review Submissions", count: "0", col: "text-blue-500" } // Hidden individual data
              ].map((stat: any, idx: number) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                   <div className={`text-3xl font-black mb-2 ${stat.col}`}>{stat.count}</div>
                   <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
           </div>

           <h3 className="text-2xl font-black text-brand-dark mb-8">Top Expert Themes (Aggregate)</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {themes?.themes?.length > 0 ? themes.themes.slice(0, 3).map((theme: any, idx: number) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-brand-primary transition">
                        <h4 className="font-black text-brand-dark text-lg mb-2">{theme.name}</h4>
                        <p className="text-sm text-gray-500">{theme.count} associated review insights from independent panellists.</p>
                    </div>
                )) : (
                    <div className="bg-white p-12 text-center border border-gray-200 rounded-2xl shadow-sm col-span-full">
                        <FaComments className="text-4xl text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-bold">Dynamic observations will populate here once formal reviews commence.</p>
                    </div>
                )}
           </div>
        </div>
      </section>

      {/* 11. Craft Review Panels & 12. Institutional Reviewers */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                 <h2 className="text-3xl font-black text-brand-dark mb-8">Craft Review Panels</h2>
                 <div className="grid grid-cols-2 gap-4">
                    {craftReviewPanels.map((panel: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm cursor-pointer hover:border-brand-primary transition">
                         <span className="font-bold text-sm text-gray-800">{panel}</span>
                         <span className="text-[10px] font-bold bg-gray-200 text-gray-500 px-2 py-1 rounded">0 Reviews</span>
                      </div>
                    ))}
                 </div>
              </div>
              <div>
                 <h2 className="text-3xl font-black text-brand-dark mb-8">Institutional Reviewers</h2>
                 <div className="grid grid-cols-2 gap-4">
                    {institutionalReviewers.map((inst: any, idx: number) => (
                      <div key={idx} className="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/10 flex items-center gap-3">
                         <FaUniversity data-ui-icon  className="" />
                         <span className="font-bold text-sm text-brand-dark">{inst}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 13. Review Transparency Center & 14. Accepted Changes Log */}
      <section className="py-20 universal-hero text-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                 <h2 className="text-3xl font-black mb-8 flex items-center gap-3"><FaShieldAlt data-ui-icon  className="" /> Review Transparency Center</h2>
                 <div className="space-y-6 text-gray-300 font-medium leading-relaxed bg-white/10 p-8 rounded-3xl border border-white/20">
                    <p>Expert review strengthens the report and provides vital checks and balances.</p>
                    <p>Reviewers advise but do not determine conclusions. KHCRF retains full editorial responsibility.</p>
                    <p>Review comments may be summarized publicly to demonstrate analytical rigor.</p>
                    <p>Confidential reviews and anonymous stakeholder challenges remain legally protected.</p>
                 </div>
              </div>
              <div>
                  <h2 className="text-3xl font-black mb-8">Accepted Changes Log</h2>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden shadow-inner">
                     <div data-editorial-accent-bg className="absolute top-0 left-0 w-full h-[2px] /40"></div>
                     <div className="mx-auto w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/10 mb-4">
                        <FaHistory data-ui-icon  className="text-xl " />
                     </div>
                     <h4 className="text-sm font-extrabold text-white mb-2 tracking-tight">
                        Tracking Log Inactive
                     </h4>
                     <p className="text-gray-300 font-medium text-xs leading-relaxed max-w-sm mx-auto mb-6">
                        The accepted changes register will validate and list update logs once expert panel recommendations are formally validated and incorporated.
                     </p>
                     <div className="flex flex-wrap justify-center gap-2">
                        {["Finding Updated", "Evidence Added", "Methodology Clarified"].map((badge: any) => (
                          <span key={badge} className="text-[10px] bg-white/10 text-white px-3 py-1 rounded-[10px] border border-white/20 font-bold uppercase tracking-wider">{badge}</span>
                        ))}
                     </div>
                  </div>
               </div>
           </div>
        </div>
      </section>

      {/* 15. Expert Review Downloads & 16. Expert Recognition */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                 <h2 className="text-3xl font-black text-brand-dark mb-8 flex items-center gap-3"><FaDownload data-ui-icon  className="" /> Resource Downloads</h2>
                 <div className="space-y-3">
                    {downloads.map((doc: any, idx: number) => (
                       <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:border-brand-primary cursor-pointer transition">
                          <div className="flex items-center gap-3">
                             <FaFileAlt data-ui-icon  className="" />
                             <span className="font-bold text-sm text-gray-800">{doc}</span>
                          </div>
                          <FaDownload className="text-gray-400" />
                       </div>
                    ))}
                 </div>
              </div>
              <div>
                 <h2 className="text-3xl font-black text-brand-dark mb-8 flex items-center gap-3"><FaAward data-ui-icon  className="" /> Expert Recognition</h2>
                 <p className="text-gray-600 font-medium mb-6">Subject to formal consent, contributing experts will be formally acknowledged across official publication channels:</p>
                 <div className="grid grid-cols-2 gap-4">
                    {["Final Report", "Acknowledgements Section", "Expert Contributors List", "Annual Assessment Archive"].map((rec: any, i: number) => (
                       <div key={i} className="bg-brand-secondary/10 p-4 rounded-xl border border-brand-secondary/20 flex items-center gap-3">
                          <FaCheckCircle data-ui-icon  className="" />
                          <span className="font-bold text-sm text-brand-dark">{rec}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 17. Annual Review Archive */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
           <FaHistory className="text-4xl text-gray-300 mx-auto mb-6" />
           <h3 className="text-2xl font-black text-brand-dark mb-4">Annual Review Archive</h3>
           <p className="text-gray-600 font-medium mb-8">Access historical review statistics and summaries from previous assessment cycles.</p>
           <div className="grid grid-cols-1 md:grid-cols-[minmax(280px,560px)_minmax(220px,auto)] gap-4 md:gap-6 items-center justify-center max-w-4xl mx-auto text-left">
              <select>
                 {cycles && cycles.length > 0 ? cycles.map((c: any) => (
                    <option key={c.cycle_id} value={c.cycle_id}>{c.cycle_label} Cycle</option>
                 )) : (
                    <option value="SOC-2026-2027">2026�2027 Cycle</option>
                 )}
              </select>
              <div 
                 role="status" 
                 className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 flex flex-col justify-center h-full min-h-[58px]"
              >
                 <span className="font-bold text-gray-800 mb-1">The 2026�2027 Assessment is the inaugural cycle. No historical expert review records are available yet.</span>
                 <span className="text-xs text-gray-500">Published expert reviews will appear here after the current assessment cycle is completed and archived.</span>
              </div>
           </div>
        </div>
      </section>

      {/* 18. Call to Action */}
      <section className="relative py-24 bg-brand-primary overflow-hidden">
        
        <div className="container mx-auto px-4 text-center relative z-10">
            <h3 className="text-3xl md:text-4xl font-black mb-10 tracking-tight text-white leading-tight">
              Strong reports are strengthened<br className="hidden md:block"/> through independent review.
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="#portal"
                className="px-8 py-4 bg-white text-brand-dark font-black rounded-[14px] hover:bg-gray-100 transition-all shadow-xl"
              >
                Become a Reviewer
              </Link>
              <Link
                href="#portal"
                className="px-8 py-4 bg-brand-dark text-white font-bold rounded-[14px] hover:bg-brand-secondary transition-all shadow-xl"
              >
                Submit Expert Review
              </Link>
              <Link
                href="/state-of-kashmir-crafts/draft-findings"
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-[14px] hover:bg-white/10 transition-all"
              >
                View Draft Findings
              </Link>
            </div>
        </div>
      </section>
    </main>
  );
}
