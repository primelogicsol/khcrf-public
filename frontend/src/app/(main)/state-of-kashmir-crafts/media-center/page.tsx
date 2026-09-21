"use client";
import { getBaseUrlNoApi } from "@/lib/api";
import * as FaIcons from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaBullhorn, FaNewspaper, FaGlobe, FaShieldAlt, 
  FaUsers, FaHandshake, FaBookOpen, FaDownload, 
  FaImage, FaVideo, FaMicrophone, FaRegCalendarAlt, 
  FaCheckCircle, FaHistory, FaBuilding, FaComments, FaFilePdf,
  FaInfoCircle
} from 'react-icons/fa';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { mediaCenterHeroFallback } from '@/config/heroFallbacks';

export default function MediaCenterPage() {
  const [whyExists, setWhyExists] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any[]>([]);
  const [resourceLibrary, setResourceLibrary] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [prCategories, setPrCategories] = useState<any[]>([]);
  const [participationCategories, setParticipationCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArchiveCycle, setSelectedArchiveCycle] = useState("2026");

  useEffect(() => {
const API_BASE_URL = getBaseUrlNoApi();
    fetch(`/api/backend/v1/knowledge?entityType=SKC_RECORD&take=100`)
      .then(res => res.json())
      .then(data => {
        const all = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        const mapItems = (kind: string) =>
          all.filter((d: any) => d.metadata?.kind === kind).map((d: any) => ({
            ...d.metadata,
            title: d.title,
            desc: d.summary || d.metadata.desc,
            slug: d.slug,
            id: d.id,
            icon: d.metadata.icon ? ((FaIcons as any)[d.metadata.icon] || FaIcons.FaCircle) : null
          }));

        setWhyExists(mapItems('WHYEXISTS'));
        setDashboardStats(mapItems('DASHBOARDSTATS'));
        setResourceLibrary(mapItems('RESOURCELIBRARY'));
        setCampaigns(mapItems('CAMPAIGNS'));
        setPrCategories(mapItems('PRCATEGORIES'));
        setParticipationCategories(mapItems('PARTICIPATIONCATEGORIES'));
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="w-full">
      {/* 1. Hero Section */}
      <UniversalEditorialHero 
        pageKey="media-center" 
        fallbackConfig={mediaCenterHeroFallback as any} 
      />

      {/* 2 & 14. Communications Dashboard */}
      {dashboardStats.length > 0 && (
        <section className="py-12 bg-brand-primary/5 border-b border-gray-200">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {dashboardStats.map((stat: any, idx: number) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                  {stat.icon && <stat.icon className="text-3xl text-brand-secondary mb-3" />}
                  <div className="text-2xl font-black text-gray-900 mb-1">{stat.count || '—'}</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase">{stat.label || stat.title || 'Metric'}</div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm font-bold text-brand-primary mt-6">Communications dashboard — data updates in real time.</p>
          </div>
        </section>
      )}

      {/* 3. Why This Media Centre Exists */}
      {whyExists.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-black text-brand-dark mb-12 text-center">Core Objectives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyExists.map((item: any, idx: number) => (
                <div key={idx} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-brand-primary transition shadow-sm">
                  <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    {item.icon && <item.icon className="text-2xl text-brand-primary" />}
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Media Partner Programme */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100 flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/2">
               <span className="inline-block px-3 py-1 bg-brand-secondary/10 text-brand-secondary text-xs font-bold rounded mb-4">Media Partner Programme</span>
               <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-6 leading-tight">Media Partners & Media Participation Network</h2>
               <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                 The initiative welcomes newspapers, digital publications, radio stations, television channels, journalism platforms, podcasts, newsletters, and independent media organisations to cover the state of the sector.
               </p>
               {participationCategories.length > 0 && (
                 <div className="space-y-4 mb-8">
                   {participationCategories.map((cat: any, i: number) => (
                     <div key={i} className="flex items-center gap-3">
                       <FaCheckCircle data-ui-icon  className="" />
                       <span className="font-bold text-gray-800">{cat.title || cat.name || cat.desc}</span>
                     </div>
                   ))}
                 </div>
               )}
               <div className="flex gap-4">
                 <Link href="/state-of-kashmir-crafts/stakeholder-registry" className="px-6 py-3 bg-brand-primary text-white font-bold rounded-[14px] hover:bg-brand-secondary transition">Register as Stakeholder</Link>
               </div>
            </div>
            
            {/* 5. Media Organisation Registration — Disabled with notice */}
            <div id="register" className="w-full lg:w-1/2 bg-gray-50 p-8 rounded-2xl border border-gray-200">
               <h3 className="text-xl font-black text-brand-dark mb-4">Media Registration</h3>
               <div className="flex items-start gap-3 bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-4 mb-6">
                 <FaInfoCircle data-ui-icon  className=" shrink-0 mt-0.5" />
                 <p className="text-sm font-medium text-gray-700">
                   Media partner registration is processed through the KHCRF Stakeholder Registry. Please register as a stakeholder and select &ldquo;Media Organisation&rdquo; as your category.
                 </p>
               </div>
               <Link
                 href="/state-of-kashmir-crafts/stakeholder-registry"
                 className="block w-full py-3 bg-brand-dark text-white font-bold rounded-lg hover:bg-gray-800 transition text-center"
               >
                 Go to Stakeholder Registry
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Press Release Centre & 7. Official Announcements */}
      <section id="press-releases" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-black text-brand-dark mb-4">Press Release Centre & Announcements</h2>
                <p className="text-gray-600 font-medium">Official communications are published here as they become available.</p>
              </div>
              {prCategories.length > 0 && (
                <div className="flex gap-2">
                   <select className="px-4 py-2 border border-gray-300 rounded-[12px] text-sm font-bold text-gray-700">
                      <option>All Categories</option>
                      {prCategories.map((c: any, i: number) => <option key={i}>{c.title || c.name || c.desc}</option>)}
                   </select>
                </div>
              )}
           </div>
           
           <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
              <FaNewspaper className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Releases Published Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">Press releases and official announcements will appear here as they are issued during the assessment cycle.</p>
           </div>
        </div>
      </section>

      {/* 8. Media Resource Library */}
      {resourceLibrary.length > 0 ? (
        <section id="media-resources" className="py-20 universal-hero text-white">
          <div className="container mx-auto px-4 max-w-6xl">
             <h2 className="text-3xl font-black mb-12 text-center flex items-center justify-center gap-3"><FaDownload data-ui-icon  className="" /> Media Resource Library</h2>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {resourceLibrary.map((res: any, i: number) => (
                  <div key={i} className="bg-white/10 p-6 rounded-xl border border-white/20 text-center hover:bg-white/20 transition cursor-pointer flex flex-col items-center justify-between h-36">
                     <FaFilePdf data-ui-icon  className="text-3xl " />
                     <div className="font-bold text-xs">{res.title || res.name || res.desc}</div>
                     <div className="text-[10px] text-gray-300">PDF Document</div>
                  </div>
                ))}
             </div>
          </div>
        </section>
      ) : (
        <section id="media-resources" className="py-20 universal-hero text-white">
          <div className="container mx-auto px-4 max-w-6xl">
             <h2 className="text-3xl font-black mb-12 text-center flex items-center justify-center gap-3"><FaDownload data-ui-icon  className="" /> Media Resource Library</h2>
             <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
               <FaFilePdf className="text-6xl text-white/20 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-white/70 mb-2">No Resources Published</h3>
               <p className="text-gray-400 max-w-md mx-auto">Media kits, brand assets, and press materials will be published here as the assessment progresses.</p>
             </div>
          </div>
        </section>
      )}

      {/* 9. Campaign Centre */}
      {campaigns.length > 0 && (
        <section className="py-20 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 max-w-6xl">
             <h2 className="text-3xl font-black text-brand-dark mb-12">Campaign Centre</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {campaigns.map((camp: any, i: number) => (
                  <div key={i} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 hover:border-brand-primary transition">
                     <h3 className="font-bold text-xl text-gray-900 mb-3">{camp.title || camp.name || camp.desc}</h3>
                     <div className="flex items-center gap-4 text-sm font-medium text-gray-500 mb-6">
                        <span className="flex items-center gap-1"><FaRegCalendarAlt /> 2026–2027 Assessment Cycle</span>
                     </div>
                     <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-[10px]">Active</span>
                  </div>
                ))}
             </div>
          </div>
        </section>
      )}

      {/* 10. Hearing Coverage & 11. Multimedia Gallery & 12. Interview Centre */}
      <section id="latest-updates" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Hearing Coverage */}
               <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
                  <div>
                     <FaMicrophone data-ui-icon  className="text-4xl  mb-6" />
                     <h3 className="text-2xl font-black text-brand-dark mb-4">Hearing Coverage Centre</h3>
                     <p className="text-gray-600 font-medium mb-6 text-sm">Archive of all hearing summaries, attendance stats, and coverage materials.</p>
                  </div>
                  <div className="pt-6 border-t border-gray-100 flex items-center gap-2 mt-4">
                     <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shrink-0"></div>
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        Publishing on Conclusion
                     </span>
                  </div>
               </div>
               
               {/* Multimedia */}
               <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
                  <div>
                     <FaImage data-ui-icon  className="text-4xl  mb-6" />
                     <h3 className="text-2xl font-black text-brand-dark mb-4">Multimedia Gallery</h3>
                     <p className="text-gray-600 font-medium mb-6 text-sm">High-resolution photos, graphics, and video coverage of consultations.</p>
                  </div>
                  <div className="pt-6 border-t border-gray-100 flex items-center gap-2 mt-4">
                     <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shrink-0"></div>
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        Adding as Consultations Proceed
                     </span>
                  </div>
               </div>
               
               {/* Interviews */}
               <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between h-full">
                  <div>
                     <FaComments data-ui-icon  className="text-4xl  mb-6" />
                     <h3 className="text-2xl font-black text-brand-dark mb-4">Interview Centre</h3>
                     <p className="text-gray-600 font-medium mb-6 text-sm">Expert interviews, artisan voices, and institutional perspectives.</p>
                  </div>
                  <div className="pt-6 border-t border-gray-100 flex items-center gap-2 mt-4">
                     <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shrink-0"></div>
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        Rolling Basis Publication
                     </span>
                  </div>
               </div>
           </div>
        </div>
      </section>

      {/* 15. Annual Archive & 13. Media Contact Desk */}
      <section className="py-20 universal-hero text-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="flex flex-col lg:flex-row gap-16">
              {/* Annual Archive */}
              <div className="w-full lg:w-1/3">
                 <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><FaHistory data-ui-icon  className="" /> Media Archive</h3>
                 <p className="text-gray-300 font-medium mb-8">Access press materials and historical records from previous assessment cycles.</p>
                  <div className="flex flex-col gap-4">
                     <select 
                        value={selectedArchiveCycle}
                        onChange={(e) => setSelectedArchiveCycle(e.target.value)}
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white font-bold outline-none hover:border-white/40 focus:ring-2 focus:ring-white/20 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:calc(100%-1rem)_center]"
                     >
                        <option value="2026" className="text-brand-dark">2026 Cycle</option>
                        <option value="2027" className="text-brand-dark">2027 Cycle</option>
                        <option value="2028" className="text-brand-dark">2028 Cycle</option>
                     </select>
                     <div 
                        role="status" 
                        className="p-4 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-gray-300 flex flex-col justify-center min-h-[58px]"
                     >
                        {selectedArchiveCycle === "2026" ? (
                           <>
                              <span className="font-bold text-white mb-1">The 2026–2027 Assessment is the inaugural cycle. No historical media records are available yet.</span>
                              <span className="text-xs text-gray-400">Published media materials will appear here after the current assessment cycle is completed and archived.</span>
                           </>
                        ) : (
                           <>
                              <span className="font-bold text-white mb-1">The {selectedArchiveCycle} assessment cycle has not yet commenced.</span>
                              <span className="text-xs text-gray-400">Archived media updates and press releases for {selectedArchiveCycle} will become available once the cycle is initialized.</span>
                           </>
                        )}
                     </div>
                  </div>
              </div>
              
              {/* Media Contact Desk — Redirect to support */}
              <div className="w-full lg:w-2/3 bg-white/5 p-8 rounded-3xl border border-white/10">
                 <h3 className="text-2xl font-black mb-4">Media Contact Desk</h3>
                 <p className="text-gray-300 font-medium mb-6">
                   For media enquiries, interview requests, partnership proposals, or data requests, please reach out through the KHCRF contact channels.
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                   <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                     <div className="font-bold text-sm mb-1">General Enquiries</div>
                     <a href="mailto:media@khcrf.org" className="text-brand-secondary text-sm font-medium hover:underline">media@khcrf.org</a>
                   </div>
                   <div className="bg-white/10 p-4 rounded-xl border border-white/20">
                     <div className="font-bold text-sm mb-1">Partnership Requests</div>
                     <a href="mailto:contact@khcrf.org" className="text-brand-secondary text-sm font-medium hover:underline">contact@khcrf.org</a>
                   </div>
                 </div>
                 <Link
                   href="/state-of-kashmir-crafts/faq#support"
                   className="inline-block px-6 py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition"
                 >
                   Submit a Support Request
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* 16. Transparency Notice */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="bg-gray-50 border-l-4 border-[var(--card-left-accent)] p-6 md:p-8 rounded-r-2xl shadow-sm flex items-start gap-4">
             <FaShieldAlt data-ui-icon  className="text-3xl  shrink-0 mt-1" />
             <div>
                <h3 className="font-black text-gray-900 mb-2">Transparency Notice</h3>
                <p className="text-gray-600 font-medium text-sm leading-relaxed">
                  Media coverage, announcements, and communication materials published on this page are archived as part of the public record of the State of Kashmir Crafts annual assessment.
                </p>
             </div>
           </div>
        </div>
      </section>

      {/* 17. Call to Action */}
      <section className="relative py-24 bg-brand-primary overflow-hidden">
        
        <div className="container mx-auto px-4 text-center relative z-10">
            <h3 className="text-3xl md:text-4xl font-black mb-10 tracking-tight text-white leading-tight">
              Help bring Kashmir&apos;s craft conversation <br className="hidden md:block"/>to a wider audience.
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/state-of-kashmir-crafts/stakeholder-registry"
                className="px-8 py-4 bg-white text-brand-dark font-black rounded-[14px] hover:bg-gray-100 transition-all shadow-xl"
              >
                Register as Stakeholder
              </Link>
              <Link
                href="/state-of-kashmir-crafts/participate"
                className="px-8 py-4 bg-brand-dark text-white font-bold rounded-[14px] hover:bg-brand-secondary transition-all shadow-xl"
              >
                Participate Online
              </Link>
              <Link
                href="#media-resources"
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-[14px] hover:bg-white/10 transition-all"
              >
                Media Resources
              </Link>
            </div>
        </div>
      </section>
    </main>
  );
}
