"use client";
import { getBaseUrlNoApi } from "@/lib/api";
import * as FaIcons from "react-icons/fa";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { skcGovernanceHeroFallback } from "@/config/heroFallbacks";
import {
  FaBalanceScale, FaUsers, FaUserCheck, FaFileAlt, FaHandshake, FaChartLine, FaCheckDouble, FaEye,
  FaFilePdf, FaBook, FaClipboardCheck, FaUniversity, FaLandmark, FaShieldAlt, FaKey, FaLock, FaUserSecret
} from "react-icons/fa";
import FeatureCard from "@/components/common/FeatureCard";



export default function GovernanceFrameworkPage() {
  const [principles, setPrinciples] = useState<any[]>([]);
  const [consentEthics, setConsentEthics] = useState<any[]>([]);
  const [accountabilityMeasures, setAccountabilityMeasures] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [documentGroups, setDocumentGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
const API_BASE_URL = getBaseUrlNoApi();
    fetch(`/api/backend/v1/knowledge?entityType=SKC_RECORD&take=100`)
      .then(res => res.json())
      .then(data => {
        const all = (data.data || data);
        const mapItems = (kind: string) => all.filter((d: any) => d.metadata?.kind === kind).map((d: any) => ({
          ...d.metadata,
          title: d.title,
          desc: d.summary || d.metadata?.desc,
          slug: d.slug,
          id: d.id,
          icon: d.metadata?.icon ? ((FaIcons as any)[d.metadata.icon] || FaIcons.FaCircle) : null
        }));
        setPrinciples(mapItems('PRINCIPLES'));
        setConsentEthics(mapItems('CONSENTETHICS'));
        setAccountabilityMeasures(mapItems('ACCOUNTABILITYMEASURES'));
        setTimeline(mapItems('TIMELINE'));
        setDocumentGroups(mapItems('DOCUMENTGROUPS'));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load governance data:', err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="w-full">
      {/* 1. Hero Section */}
      <UniversalEditorialHero pageKey="skc-governance-framework" fallbackConfig={skcGovernanceHeroFallback} />

      {/* 2. Governance Purpose */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-black text-brand-dark mb-6">
            Why Governance Comes Before the Report
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            The report is the final output, but the first step is a clear governance and consultation framework. This ensures credibility, transparency, inclusion, neutrality, evidence quality, and public trust. A robust governance model guarantees that the findings reflect ground realities, free from undue bias.
          </p>
        </div>
      </section>

      {/* 3. Core Principles */}
      {principles.length > 0 && (
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black text-brand-dark mb-12 text-center">Core Principles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {principles.map((item: any, idx: number) => (
               <FeatureCard
                 key={item.id || idx}
                 icon={item.icon}
                 title={item.title}
                 description={item.desc}
               />
             ))}
          </div>
        </div>
      </section>
      )}

      {/* 4. Governance Structure */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-black text-brand-dark mb-12 text-center">Governance Structure</h2>
          <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-8 before:w-1 before:bg-brand-primary/20">
            {[
              { letter: "A", title: "Convening Institution", desc: "Hamadan Craft Revival Foundation" },
              { letter: "B", title: "Advisory Council", desc: "Respected voices from artisans, academia, industry, heritage, media, women, youth, and former officials." },
              { letter: "C", title: "Research & Documentation Team", desc: "Responsible for data collection, interviews, records, evidence, field notes, and report drafting." },
              { letter: "D", title: "Stakeholder Groups", desc: "Artisans, manufacturers, exporters, retailers, institutions, government, political parties, media, citizens, diaspora, and others." },
              { letter: "E", title: "Expert Review Panel", desc: "Subject experts, former officials, academics, export specialists, GI experts, and master artisans." },
              { letter: "F", title: "Public Validation", desc: "Draft findings are opened for correction, clarification, and public response before finalization." },
            ].map((layer: any) => (
              <div key={layer.letter} className="relative flex items-start gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 ml-4 hover:border-brand-primary transition">
                <div className="w-10 h-10 shrink-0 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold text-lg -ml-11 shadow-md z-10 border-4 border-white">
                  {layer.letter}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{layer.title}</h3>
                  <p className="text-gray-600">{layer.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Non-Partisan Statement */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl text-center">
           <div className="bg-brand-dark text-white p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
             <FaBalanceScale data-ui-icon  className="absolute -bottom-10 -right-10 text-9xl  opacity-10" />
             <h2 className="text-2xl md:text-3xl font-black mb-6 flex items-center justify-center gap-3">
               <FaShieldAlt data-ui-icon  className="" /> Non-Partisan Statement
             </h2>
             <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-200 relative z-10">
               The State of Kashmir Crafts assessment is a non-partisan public-interest initiative. Participation is open to all stakeholders regardless of political, institutional, professional, social, or ideological affiliation. No political party, institution, or individual controls the findings.
             </p>
           </div>
        </div>
      </section>

      {/* 6. Conflict of Interest Disclosure */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-black text-brand-dark mb-8 text-center">Conflict of Interest Disclosure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
               <FaEye data-ui-icon className="text-2xl mt-1 shrink-0" />
               <p className="text-gray-700 font-medium">All assessment participants must disclose material interests relevant to: business relationships, institutional affiliations, commercial affiliations, funding relationships, evaluation relationships, grant relationships, and partner relationships.</p>
            </div>
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
               <FaUsers data-ui-icon className="text-2xl mt-1 shrink-0" />
               <p className="text-gray-700 font-medium">Strict protocols are enforced for the declaration, mitigation, recusal, and documentation of conflicts.</p>
            </div>
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
               <FaLandmark data-ui-icon className="text-2xl mt-1 shrink-0" />
               <p className="text-gray-700 font-medium">Political parties may contribute policy perspectives, but do not control methodology or findings.</p>
            </div>
            <div className="flex items-start gap-4 p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/20">
               <FaFileAlt data-ui-icon className="text-2xl mt-1 shrink-0" />
               <p className="text-brand-dark font-bold">KHCRF retains independent editorial responsibility for the report.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Consent & Data Ethics */}
      {consentEthics.length > 0 && (
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black text-brand-dark mb-12 text-center">Consent & Data Ethics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {consentEthics.map((item: any, idx: number) => (
               <div key={item.id || idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:border-brand-primary transition">
                 {item.icon && <item.icon className="text-3xl text-brand-primary mb-4" />}
                 <span className="font-bold text-gray-800 text-sm">{item.title}</span>
               </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 8. Consultation Governance Timeline */}
      {timeline.length > 0 && (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl font-black text-brand-dark mb-12">Consultation Governance Timeline</h2>
          <div className="flex flex-wrap justify-center gap-3">
             {timeline.map((item: any, idx: number) => (
                <div key={item.id || idx} className="flex items-center">
                   <div className="px-5 py-3 bg-brand-dark text-white text-sm font-bold rounded-[14px] shadow-md">
                     {idx + 1}. {item.title || item.label}
                   </div>
                   {idx < timeline.length - 1 && (
                     <div className="hidden md:block w-8 h-0.5 bg-gray-300 mx-1"></div>
                   )}
                </div>
             ))}
          </div>
        </div>
      </section>
      )}

      {/* 9. Decision Rights */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-black text-brand-dark mb-12 text-center">Decision Rights</h2>
          <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-gray-200">
             <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                   <tr className="bg-brand-primary text-white">
                      <th className="p-4 font-bold border-b border-brand-primary">Activity</th>
                      <th className="p-4 font-bold border-b border-brand-primary">Responsible Body</th>
                   </tr>
                </thead>
                <tbody>
                   {[
                     { activity: "Initiative Convening", body: "KHCRF" },
                     { activity: "Stakeholder Outreach", body: "KHCRF Field Team" },
                     { activity: "Data Collection", body: "Research & Documentation Team" },
                     { activity: "Public Submissions", body: "Stakeholder Registry Portal" },
                     { activity: "Advisory Input", body: "Advisory Council" },
                     { activity: "Expert Review", body: "Expert Review Panel" },
                     { activity: "Draft Validation", body: "Public and Stakeholders" },
                     { activity: "Final Editorial Decision", body: "KHCRF Editorial Team" },
                     { activity: "Final Publication", body: "KHCRF" },
                   ].map((row: any, idx: number) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                         <td className="p-4 text-gray-800 font-medium">{row.activity}</td>
                         <td className="p-4 text-gray-600">{row.body}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      </section>

      {/* 10. Accountability Measures */}
      {accountabilityMeasures.length > 0 && (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black text-brand-dark mb-12 text-center">Accountability Measures</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {accountabilityMeasures.map((item: any, idx: number) => (
               <div key={item.id || idx} className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center hover:shadow-md transition">
                 {item.icon && <item.icon className="text-3xl text-brand-secondary mb-4" />}
                 <span className="font-bold text-gray-800">{item.title}</span>
               </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 11. Download Section */}
      {documentGroups.length > 0 && (
      <section id="documents" className="py-24 universal-hero text-white border-t-4 border-brand-secondary">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Official Documents</h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">A complete governance, methodology, participation, review, publication, and compliance architecture.</p>
          </div>
          
          <div className="space-y-16">
            {documentGroups.map((group: any, groupIdx: number) => (
              <div key={group.id || groupIdx}>
                <h3 className="text-2xl font-black text-brand-secondary mb-8 border-b border-white/10 pb-4">{group.category || group.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {(group.docs || []).map((doc: any, idx: number) => (
                     <div key={doc.id || idx} className="bg-white/10 p-6 rounded-2xl border border-white/10 hover:border-brand-secondary transition flex flex-col h-full text-left relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                          <FaFilePdf data-ui-icon  className="text-9xl " />
                        </div>
                        
                        <div className="flex-1 relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                             <FaFilePdf data-ui-icon  className="text-2xl  shrink-0" />
                             <h4 className="font-bold text-lg text-white leading-tight">{doc.title}</h4>
                          </div>
                          
                          {doc.desc && (
                          <p className="text-sm text-gray-300 font-medium leading-relaxed mb-6">
                            {doc.desc}
                          </p>
                          )}
                          
                          <div className="space-y-1.5 mb-8 mt-auto">
                            {doc.version && (
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                               <span className="text-gray-400">Version</span>
                               <span className="text-white">{doc.version}</span>
                            </div>
                            )}
                            {doc.status && (
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                               <span className="text-gray-400">Status</span>
                               <span className={doc.status === "Approved" ? "text-green-400" : "text-amber-400"}>{doc.status}</span>
                            </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-auto relative z-10">
                          <span className="block w-full px-4 py-3 bg-white/5 text-gray-400 font-bold rounded-[12px] border border-white/10 text-sm text-center cursor-not-allowed">
                            Document Pending
                          </span>
                        </div>
                     </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 12. Call to Action */}
      <section className="py-20 relative overflow-hidden universal-hero">
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
            <h3 className="text-3xl md:text-4xl font-black mb-10 tracking-tight text-white leading-tight">
              A credible report begins with a credible process.
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/state-of-kashmir-crafts/stakeholder-registry"
                className="px-8 py-4 bg-brand-primary text-white font-bold rounded-[14px] hover:bg-brand-secondary transition-all shadow-xl"
              >
                Register as Stakeholder
              </Link>
              <Link
                href="/state-of-kashmir-crafts/methodology"
                className="px-8 py-4 bg-white text-brand-dark font-bold rounded-[14px] hover:bg-gray-100 transition-all shadow-xl"
              >
                View Methodology
              </Link>
              <Link
                href="/state-of-kashmir-crafts/participate"
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-[14px] hover:bg-white/10 transition-all"
              >
                Participate Online
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

