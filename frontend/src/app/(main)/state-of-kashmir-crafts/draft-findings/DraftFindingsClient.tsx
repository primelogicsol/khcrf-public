"use client";
import { getBaseUrlNoApi } from "@/lib/api";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  FaFileAlt, FaMapMarkerAlt, FaUsers, FaArrowRight, FaCalendarAlt, FaChartPie, 
  FaMicrophone, FaFileSignature, FaBuilding, FaSearch, FaHandshake, FaExclamationTriangle,
  FaShieldAlt, FaGlobe, FaDownload, FaCheckCircle, FaSpinner, FaInfoCircle, FaBookOpen
} from "react-icons/fa";
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { draftFindingsHeroFallback } from '@/config/heroFallbacks';

const API_BASE_URL = getBaseUrlNoApi();

export default function DraftFindingsClient() {
  const [findings, setFindings] = useState<any[]>([]);
  const [cycleStage, setCycleStage] = useState<string>("Evidence Collection and Review");
  const [snapshot, setSnapshot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [findingsRes, statsRes] = await Promise.all([
           fetch(`/api/backend/skc/draft-findings/public`),
           fetch(`/api/backend/public/skc/statistics?visibility=draft`).catch(() => null)
        ]);

        if (!findingsRes.ok) throw new Error('Failed to fetch findings');
        
        const data = await findingsRes.json();
        if (data.success) {
          setFindings(data.data.findings || []);
          setCycleStage(data.data.cycleStage || "Evidence Collection and Review");
        }

        if (statsRes && statsRes.ok) {
           const statsData = await statsRes.json();
           const data = statsData.status === 'success' && statsData.data ? statsData.data : statsData;
           if (data.success) {
              setSnapshot(data.data);
           }
        }
      } catch (e) {
        console.error("Failed to fetch draft findings data", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const hasFindings = findings.length > 0;
  const totalSubmissions = snapshot?.stakeholders ? snapshot.stakeholders.reduce((sum: number, s: any) => sum + s.count, 0) : 0;
  
  // Categorize findings if they exist
  const themeFindings = findings.filter(f => f.findingType === 'THEMATIC');
  const craftFindings = findings.filter(f => f.findingType === 'CRAFT');
  const districtFindings = findings.filter(f => f.findingType === 'DISTRICT');
  const stakeholderFindings = findings.filter(f => f.findingType === 'STAKEHOLDER');

  // Hardcoded structure for when no findings exist
  const coreThemesList = [
    "Artisan Livelihoods", "Markets and Sales", "Exports", "Tourism and Crafts",
    "Women in Crafts", "Youth Participation", "Training and Skills", "GI and Authenticity",
    "Digital Commerce", "Access to Finance", "Heritage Preservation", "Public Policy and Governance"
  ];

  return (
    <main className="w-full bg-gray-50 min-h-screen">
      {/* 1. HERO */}
      <UniversalEditorialHero 
        pageKey="draft-findings" 
        fallbackConfig={draftFindingsHeroFallback as any} 
      />

      {/* 2. PURPOSE OF DRAFT FINDINGS */}
      <section className="py-20 bg-white border-b border-gray-200">
         <div className="container mx-auto px-4 max-w-5xl">
            <div className="bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-[var(--card-left-accent)]"></div>
               <h2 className="text-3xl font-black text-brand-dark mb-2">Purpose of Draft Findings</h2>
               <h3 className="text-xl font-bold text-brand-secondary mb-6">Preliminary Analysis Before Final Conclusions</h3>
               <div className="space-y-4 text-gray-700 leading-relaxed font-medium">
                  <p>Draft findings are an essential transparency and quality-control stage within the annual assessment process.</p>
                  <p>They are intended to present preliminary aggregate themes emerging from stakeholder consultations, public submissions, institutional evidence, hearings, research, and expert analysis. They do not represent final conclusions, institutional positions, or approved recommendations.</p>
                  <p>Before the Final Report is completed, stakeholders will be invited to review published drafts, correct factual errors, challenge interpretations, identify missing perspectives, and provide additional supporting evidence.</p>
                  <p>This process helps ensure that the final assessment accurately reflects the experiences and realities documented across Kashmir’s handicraft ecosystem.</p>
               </div>
            </div>
         </div>
      </section>

      {/* 3. CURRENT ASSESSMENT STATUS */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
         <div className="container mx-auto px-4 max-w-5xl text-center">
            <h2 className="text-3xl font-black text-brand-dark mb-4">Current Assessment Status</h2>
            <div className="inline-block px-6 py-3 bg-brand-primary text-white font-bold rounded-xl mb-8">
               Evidence Collection and Review in Progress
            </div>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
               The assessment is currently gathering and reviewing evidence from artisans, enterprises, institutions, researchers, public bodies, civil society, buyers, and other stakeholders.
            </p>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-3xl mx-auto text-left">
               <h4 className="font-bold text-gray-900 mb-4">Draft findings will be published only after:</h4>
               <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3"><FaCheckCircle data-ui-icon  className=" mt-1 shrink-0" /> sufficient participation has been recorded</li>
                  <li className="flex items-start gap-3"><FaCheckCircle data-ui-icon  className=" mt-1 shrink-0" /> evidence has passed initial review</li>
                  <li className="flex items-start gap-3"><FaCheckCircle data-ui-icon  className=" mt-1 shrink-0" /> duplicate and unsupported submissions have been removed</li>
                  <li className="flex items-start gap-3"><FaCheckCircle data-ui-icon  className=" mt-1 shrink-0" /> preliminary themes have been analysed</li>
                  <li className="flex items-start gap-3"><FaCheckCircle data-ui-icon  className=" mt-1 shrink-0" /> confidentiality and privacy checks have been completed</li>
                  <li className="flex items-start gap-3"><FaCheckCircle data-ui-icon  className=" mt-1 shrink-0" /> findings have received internal publication approval</li>
               </ul>
            </div>
            <div className="mt-8 flex justify-center gap-4">
               <Link href="/state-of-kashmir-crafts/participate" className="px-6 py-3 bg-brand-dark text-white rounded-lg font-bold hover:bg-brand-primary transition">
                  Participate Online
               </Link>
               <Link href="/state-of-kashmir-crafts/evidence-repository" className="px-6 py-3 bg-white border border-gray-300 text-brand-dark rounded-lg font-bold hover:bg-gray-50 transition">
                  Submit Evidence
               </Link>
            </div>
         </div>
      </section>

      {/* 4. CONSULTATION SNAPSHOT */}
      <section className="py-20 bg-white border-b border-gray-200">
         <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-black text-brand-dark mb-12 text-center">Consultation Snapshot</h2>
            
            {loading ? (
               <div className="flex justify-center items-center py-12 text-brand-secondary">
                  <FaSpinner className="animate-spin text-4xl" />
               </div>
            ) : error ? (
               <div className="bg-red-50 text-red-700 p-6 rounded-xl text-center max-w-2xl mx-auto border border-red-200">
                  <p className="font-bold">Consultation statistics are temporarily unavailable.</p>
               </div>
            ) : !snapshot || totalSubmissions === 0 ? (
               <div className="bg-gray-50 text-gray-600 p-8 rounded-xl text-center max-w-2xl mx-auto border border-gray-200">
                  <div className="text-4xl text-gray-300 mb-4 flex justify-center"><FaChartPie /></div>
                  <p className="font-bold text-lg mb-2">0</p>
                  <p className="font-medium">No verified records have yet been included in the published consultation snapshot.</p>
               </div>
            ) : (
               <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Safely map the returned snapshot data when available */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center gap-6">
                     <div data-ui-icon className="w-16 h-16 bg-white rounded-full flex items-center justify-center  text-2xl border border-gray-200 shrink-0"><FaUsers /></div>
                     <div><div className="text-3xl font-black text-gray-900">{totalSubmissions}</div><div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Stakeholders Consulted</div></div>
                  </div>
                  {/* ... Add other metrics once API officially supports them ... */}
               </div>
            )}
         </div>
      </section>

      {/* 5. WHAT WILL BE PUBLISHED HERE */}
      <section className="py-20 universal-hero text-white border-y-4 border-brand-secondary">
         <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-black mb-6">What Will Be Published Here</h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed font-medium">
               When approved draft findings become available, this page will present analysis across multiple dimensions to ensure comprehensive representation.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-bold tracking-wider uppercase">
               <div className="bg-white/10 py-4 rounded-xl border border-white/20">Core Theme</div>
               <div className="bg-white/10 py-4 rounded-xl border border-white/20">Stakeholder Group</div>
               <div className="bg-white/10 py-4 rounded-xl border border-white/20">Craft</div>
               <div className="bg-white/10 py-4 rounded-xl border border-white/20">District</div>
            </div>
         </div>
      </section>

      {/* 6. CORE THEMES */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
         <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-black text-brand-dark mb-4 text-center">Core Themes</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
               Key thematic areas structured for cross-cutting analysis.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {themeFindings.length > 0 ? (
                  themeFindings.map(finding => (
                     <div key={finding.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col group hover:border-brand-primary transition">
                        <h3 className="font-bold text-lg text-gray-900 mb-3">{finding.title}</h3>
                        <p className="text-sm text-gray-600 mb-6 flex-grow line-clamp-3">{finding.summary}</p>
                        <Link href={`/state-of-kashmir-crafts/draft-findings/${finding.slug}`} className="w-full py-2 bg-gray-50 text-brand-primary text-center font-bold border border-gray-200 rounded-lg hover:bg-brand-primary hover:text-white transition text-xs">
                           View Draft Finding
                        </Link>
                     </div>
                  ))
               ) : (
                  coreThemesList.map((theme, idx) => (
                     <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
                        <h3 className="font-bold text-gray-900 mb-3">{theme}</h3>
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                           Not Yet Published
                        </span>
                        <p className="text-xs text-gray-400 font-medium">Analysis pending</p>
                     </div>
                  ))
               )}
            </div>
         </div>
      </section>

      {/* 7. FINDINGS BY STAKEHOLDER TYPE */}
      <section className="py-20 bg-white border-b border-gray-200">
         <div className="container mx-auto px-4 max-w-6xl text-center">
            <h2 className="text-3xl font-black text-brand-dark mb-4">Findings by Stakeholder Group</h2>
            <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
               Draft findings will be organized by the perspectives of participating stakeholder groups.
            </p>
            {stakeholderFindings.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {stakeholderFindings.map(finding => (
                     <div key={finding.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-3">{finding.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{finding.summary}</p>
                        <Link href={`/state-of-kashmir-crafts/draft-findings/${finding.slug}`} className="text-brand-primary text-sm font-bold hover:underline">View Finding →</Link>
                     </div>
                  ))}
               </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 text-center max-w-2xl mx-auto my-4 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary/50"></div>
                   <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-4 shadow-inner">
                      <FaShieldAlt className="text-xl text-gray-400" />
                   </div>
                   <h4 className="text-lg font-black text-brand-dark mb-2 tracking-tight">
                      Analysis & Classification in Progress
                   </h4>
                   <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-md mx-auto">
                      Stakeholder-level perspectives and feedback records are currently undergoing verification by the KHCRF Secretariat. Approved findings will be published here for public validation once the review gate is complete.
                   </p>
                </div>
            )}
         </div>
      </section>

      {/* 8. FINDINGS BY CRAFT */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
         <div className="container mx-auto px-4 max-w-6xl text-center">
            <h2 className="text-3xl font-black text-brand-dark mb-4">Findings by Craft</h2>
            <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
               Craft-specific findings will examine the distinct conditions, risks, strengths, and opportunities affecting individual craft traditions.
            </p>
            {craftFindings.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {craftFindings.map(finding => (
                     <div key={finding.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-3">{finding.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{finding.summary}</p>
                        <Link href={`/state-of-kashmir-crafts/draft-findings/${finding.slug}`} className="text-brand-primary text-sm font-bold hover:underline">View Finding →</Link>
                     </div>
                  ))}
               </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 text-center max-w-2xl mx-auto my-4 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary/50"></div>
                   <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-4 shadow-inner">
                      <FaGlobe className="text-xl text-gray-400" />
                   </div>
                   <h4 className="text-lg font-black text-brand-dark mb-2 tracking-tight">
                      Craft Analysis Under Review
                   </h4>
                   <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-md mx-auto">
                      Craft-specific findings covering pashmina, carpets, and heritage sectors are currently in editorial drafting. Verified reports will be listed here following technical review.
                   </p>
                </div>
            )}
         </div>
      </section>

      {/* 9. FINDINGS BY DISTRICT */}
      <section className="py-20 bg-white border-b border-gray-200">
         <div className="container mx-auto px-4 max-w-6xl text-center">
            <h2 className="text-3xl font-black text-brand-dark mb-4">Findings by District</h2>
            <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
               District-level findings will help identify geographic differences in production systems, livelihoods, market access, infrastructure, participation, and institutional support.
            </p>
            {districtFindings.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {districtFindings.map(finding => (
                     <div key={finding.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-3">{finding.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{finding.summary}</p>
                        <Link href={`/state-of-kashmir-crafts/draft-findings/${finding.slug}`} className="text-brand-primary text-sm font-bold hover:underline">View Finding →</Link>
                     </div>
                  ))}
               </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 text-center max-w-2xl mx-auto my-4 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary/50"></div>
                   <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-4 shadow-inner">
                      <FaShieldAlt className="text-xl text-gray-400" />
                   </div>
                   <h4 className="text-lg font-black text-brand-dark mb-2 tracking-tight">
                      District Data Consolidation
                   </h4>
                   <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-md mx-auto">
                      Geographic findings mapped across the ten Kashmir districts are undergoing synthesis. Summary matrices will be published here upon validation round closure.
                   </p>
                </div>
            )}
         </div>
      </section>

      {/* 10. REPRESENTATIVE VOICES & 11. EVIDENCE TRACEABILITY */}
      <section className="py-20 universal-hero relative overflow-hidden">
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                 <h2 className="text-3xl font-black text-white mb-6">Representative Voices</h2>
                 <div className="bg-white/10 p-8 rounded-2xl border border-white/20">
                    <p className="text-gray-300 font-medium leading-relaxed italic text-center">
                       Representative stakeholder voices will be published only after consent, verification, editorial review, and confidentiality assessment.
                    </p>
                 </div>
              </div>

              <div>
                 <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3"><FaSearch data-ui-icon  className="" /> Evidence Traceability</h2>
                 <div className="bg-white p-8 rounded-3xl shadow-xl">
                    <p className="text-gray-600 mb-6 font-medium">Every published draft finding will be linked to approved supporting records in the Evidence Repository.</p>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center text-gray-500">
                       <p className="font-bold text-sm">Evidence linkages will appear once draft findings have been approved for public validation.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 12. AREAS OF AGREEMENT & 13. AREAS OF DIVERGENCE */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl"><FaHandshake /></div>
                    <h2 className="text-2xl font-black text-brand-dark">Areas of Agreement</h2>
                 </div>
                 <p className="text-gray-600 mb-6 text-sm">This section will identify themes supported across multiple stakeholder groups, locations, crafts, and evidence sources.</p>
                 <div className="p-8 bg-gray-50/50 border border-gray-200/80 rounded-2xl text-center relative overflow-hidden shadow-sm">
                     <div className="mx-auto w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 mb-3 shadow-sm">
                        <FaShieldAlt className="text-sm text-gray-400" />
                     </div>
                     <p className="text-gray-500 font-medium text-xs leading-relaxed max-w-sm mx-auto">
                        Consensus mapping across stakeholder groups is currently under administrative analysis. Verified themes will be published here upon validation round launch.
                     </p>
                  </div>
              </div>
              <div>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl"><FaExclamationTriangle /></div>
                    <h2 className="text-2xl font-black text-brand-dark">Areas of Divergence</h2>
                 </div>
                 <p className="text-gray-600 mb-6 text-sm">This section will identify questions where stakeholder perspectives differ, evidence remains contested, or further research is required.</p>
                 <div className="p-8 bg-gray-50/50 border border-gray-200/80 rounded-2xl text-center relative overflow-hidden shadow-sm">
                     <div className="mx-auto w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 mb-3 shadow-sm">
                        <FaShieldAlt className="text-sm text-gray-400" />
                     </div>
                     <p className="text-gray-500 font-medium text-xs leading-relaxed max-w-sm mx-auto">
                        Divergent perspectives, contested evidence, and research gap inventories are currently undergoing consolidation. Detailed logs will appear once cleared.
                     </p>
                  </div>
              </div>
           </div>
        </div>
      </section>

      {/* 14. VALIDATION */}
      <section className="py-24 bg-brand-primary text-white border-y-4 border-brand-secondary relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
         <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <div className="text-center mb-16">
               <span className="text-brand-secondary text-xs font-black uppercase tracking-widest block mb-3">Stakeholder Engagement</span>
               <h2 className="text-3xl md:text-5xl font-black mb-6">How Validation Works</h2>
               <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed font-medium">
                  The KHCRF validation round is an open audit process. Once draft findings are released, participating stakeholders are empowered to challenge, refine, and support the evidence repository:
               </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
               {[
                  { title: "Correct Factual Errors", desc: "Submit verifiable corrections for district data, historical timelines, or naming records.", icon: FaCheckCircle },
                  { title: "Challenge Interpretation", desc: "Contest the contextual analysis of testimonies or representation of artisan concerns.", icon: FaExclamationTriangle },
                  { title: "Provide Clarification", desc: "Add detailed background notes or regional nuances to clarify specific statements.", icon: FaInfoCircle },
                  { title: "Submit Evidence", desc: "Attach supporting files, records, or photographs to the public evidence index.", icon: FaFileAlt },
                  { title: "Advocate Perspectives", desc: "Flag under-represented craft sectors, youth concerns, or women-artisan issues.", icon: FaUsers },
                  { title: "Review Policy Advisory", desc: "Comment on draft policy governance recommendations prior to finalization.", icon: FaBookOpen },
                  { title: "Appeal Findings", desc: "Request formal Advisory Council review on contested or disputed findings.", icon: FaShieldAlt }
               ].map((item, idx) => (
                  <div key={idx} className="bg-white/10 border border-white/20 hover:border-white/40 rounded-2xl p-6 transition flex gap-4 group hover:bg-white/15">
                     <item.icon className="text-brand-secondary text-2xl shrink-0 mt-1 transition group-hover:scale-110" />
                     <div>
                        <h4 className="font-extrabold text-white text-base mb-1.5 leading-tight">{item.title}</h4>
                        <p className="text-white/70 text-xs font-medium leading-relaxed">{item.desc}</p>
                     </div>
                  </div>
               ))}
            </div>

            <div className="bg-white text-brand-dark rounded-3xl p-8 max-w-3xl mx-auto text-center shadow-2xl border-t-4 border-brand-secondary flex flex-col md:flex-row items-center gap-6 justify-between">
               <div className="text-left">
                  <span data-editorial-accent-text className="text-[10px] font-black  uppercase tracking-widest block mb-1">Status: Pre-Launch</span>
                  <p className="font-extrabold text-lg text-brand-dark leading-tight">Public validation will open following draft findings approval.</p>
               </div>
               <button className="px-6 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-black text-xs rounded-xl shadow-md transition whitespace-nowrap" disabled>
                  Validation Protocol
               </button>
            </div>
         </div>
      </section>

      {/* 15. DRAFT REPORTS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-black text-brand-dark mb-4 flex items-center justify-center gap-3"><FaDownload data-ui-icon  className="" /> Draft Reports</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
             Official draft reports and supporting indexes will be published here once they have completed internal review and are approved for public validation.
          </p>
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-12 text-center max-w-2xl mx-auto my-4 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-brand-primary/50"></div>
             <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-4 shadow-inner">
                <FaDownload className="text-xl text-gray-400" />
             </div>
             <h4 className="text-lg font-black text-brand-dark mb-2 tracking-tight">
                No Draft Publications Available
             </h4>
             <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-md mx-auto">
                Official draft findings reports, district-level summaries, and evidence reference indexes will be released here for download once they pass internal peer review.
             </p>
          </div>
        </div>
      </section>

      {/* 16. TRANSPARENCY NOTICE */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
           <div className="bg-white border-l-4 border-[var(--card-left-accent)] p-6 md:p-8 rounded-r-2xl shadow-sm flex items-start gap-4">
             <FaGlobe data-ui-icon  className="text-3xl  shrink-0 mt-1" />
             <div>
                <h3 className="font-black text-gray-900 mb-2 text-xl">Transparency Notice</h3>
                <p className="text-gray-600 font-medium text-sm leading-relaxed mb-4">
                   Draft findings are preliminary analytical outputs and do not constitute final conclusions or official recommendations of the Hamadan Craft Revival Foundation.
                </p>
                <p className="text-gray-600 font-medium text-sm leading-relaxed mb-4">
                   They remain subject to correction, clarification, additional evidence, public validation, expert review, and revision until the assessment process is formally completed.
                </p>
                <p className="text-gray-600 font-medium text-sm leading-relaxed">
                   KHCRF serves as the institutional convener and steward of the assessment process. Findings must arise from documented evidence and approved analytical procedures rather than predetermined institutional positions.
                </p>
             </div>
           </div>
        </div>
      </section>

      {/* 17. FINAL CTA */}
      <section className="py-20 relative overflow-hidden universal-hero">
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
            <h3 className="text-3xl md:text-5xl font-black mb-6 tracking-tight text-white leading-tight">
              Help Strengthen the Evidence Base
            </h3>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
               The quality of future draft findings depends on the depth, diversity, and credibility of public participation. Contribute your experience, institutional knowledge, research, documentation, or supporting evidence to the 2026–2027 Assessment.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/state-of-kashmir-crafts/participate" className="px-8 py-4 bg-brand-primary text-white font-bold rounded-[14px] hover:bg-brand-secondary transition-all shadow-xl">
                Participate Online
              </Link>
              <Link href="/state-of-kashmir-crafts/evidence-repository" className="px-8 py-4 bg-white text-brand-dark font-bold rounded-[14px] hover:bg-gray-100 transition-all shadow-xl">
                Submit Evidence
              </Link>
              <Link href="/state-of-kashmir-crafts/methodology" className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-[14px] hover:bg-white/10 transition-all">
                View Methodology
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
