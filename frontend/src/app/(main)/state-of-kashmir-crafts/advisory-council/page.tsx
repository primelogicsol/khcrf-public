"use client";
import { getBaseUrlNoApi } from "@/lib/api";
import * as FaIcons from "react-icons/fa";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { advisoryCouncilHeroFallback } from "@/config/heroFallbacks";
import {
  FaUsers, FaBalanceScale, FaEye, FaHandshake, FaGlobe, FaBookOpen,
  FaLightbulb, FaShieldAlt, FaComments, FaChartLine, FaCheckCircle,
  FaTimesCircle, FaHammer, FaGlobeAmericas, FaUniversity, FaBuilding,
  FaUserGraduate, FaNewspaper, FaHistory, FaPlane, FaLandmark, FaWallet,
  FaAward, FaPalette, FaBriefcase, FaUser, FaMapMarkerAlt, FaFilePdf,
  FaUpload, FaUserPlus, FaUserTie, FaRegCheckCircle
} from "react-icons/fa";
import FeatureCard from "@/components/common/FeatureCard";
import AdvisorForm from "./AdvisorForm";



export default function AdvisoryCouncilPage() {
  const [whyCouncil, setWhyCouncil] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [composition, setComposition] = useState<any[]>([]);
  const [principles, setPrinciples] = useState<any[]>([]);
  const [structure, setStructure] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [contributions, setContributions] = useState<any[]>([]);
  const [downloads, setDownloads] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Members");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
const API_BASE_URL = getBaseUrlNoApi();
    fetch(`/api/backend/v1/knowledge?entityType=SKC_RECORD&take=100`)
      .then(res => res.json())
      .then(data => {
        const allItems = data.data || data;
        const mapItems = (kind: string) =>
          allItems.filter((d: any) => d.metadata?.kind === kind).map((d: any) => ({
            ...d.metadata,
            title: d.title,
            desc: d.summary || d.metadata.desc,
            slug: d.slug,
            id: d.id,
            icon: d.metadata.icon ? ((FaIcons as any)[d.metadata.icon] || FaIcons.FaCircle) : null
          }));

        setWhyCouncil(mapItems('WHYCOUNCIL'));
        setRoles(mapItems('ROLES'));
        setComposition(mapItems('COMPOSITION'));
        setPrinciples(mapItems('PRINCIPLES'));
        setStructure(mapItems('STRUCTURE'));
        setMeetings(mapItems('MEETINGS'));
        setContributions(mapItems('CONTRIBUTIONS'));
        setDownloads(mapItems('DOWNLOADS'));
        setMembers(mapItems('ADVISORY_MEMBER'));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch advisory council data:', err);
        setLoading(false);
      });
  }, []);

  const filteredMembers = members.filter(m => {
    const matchesSearch = !searchQuery || 
      (m.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       m.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       m.institution?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = activeFilter === "All Members" || m.category === activeFilter || m.committeeRole === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const uniqueCountries = new Set(members.map(m => m.country).filter(Boolean)).size;
  const uniqueInstitutions = new Set(members.map(m => m.institution).filter(Boolean)).size;
  // Make sure we handle if expertise is a string or an array
  const uniqueDomains = new Set(members.map(m => Array.isArray(m.expertise) ? m.expertise : [m.expertise]).flat().filter(Boolean)).size;

  return (
    <main className="w-full">
      {/* 1. Hero Section */}
      <UniversalEditorialHero pageKey="skc-advisory-council" fallbackConfig={advisoryCouncilHeroFallback} />

      {/* 2. Why an Advisory Council? */}
      {whyCouncil.length > 0 && (
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-black text-brand-dark mb-6">Why an Advisory Council?</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Large public assessments require trusted advisors to ensure that the methodology and execution remain firmly grounded in reality. An independent Advisory Council protects the initiative from tunnel vision and brings critical, on-the-ground context that pure data cannot capture.
              </p>
              <div className="w-20 h-1 bg-brand-secondary rounded"></div>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
               {whyCouncil.map((item: any, idx: number) => (
                 <FeatureCard key={item.id || idx} icon={item.icon} title={item.title} description={item.desc} />
               ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 3. Role of the Advisory Council */}
      {roles.length > 0 && (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl font-black text-brand-dark mb-12">Role of the Advisory Council</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
             {roles.map((role: any, idx: number) => (
               <div key={role.id || idx} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center hover:border-brand-primary transition">
                 {role.icon && <role.icon className="text-3xl text-brand-secondary mb-4" />}
                 <span className="font-bold text-gray-800 text-sm">{role.title}</span>
               </div>
             ))}
          </div>
          <div className="p-6 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-2xl inline-block max-w-3xl">
             <FaLightbulb className="text-2xl text-yellow-600 mb-3 mx-auto" />
             <p className="font-bold">Important note:</p>
             <p className="text-sm mt-1">Advisory Council members provide guidance but do not determine findings, recommendations, or editorial conclusions.</p>
          </div>
        </div>
      </section>
      )}

      {/* 4. What the Advisory Council Does Not Do */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="bg-brand-dark text-white p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden">
             <FaTimesCircle data-ui-icon  className="absolute -top-10 -right-10 text-9xl  opacity-10" />
             <h2 className="text-3xl font-black mb-8 text-center text-red-400">What the Advisory Council Does Not Do</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
               {[
                 "Approve report findings",
                 "Control methodology",
                 "Select conclusions",
                 "Direct editorial decisions",
                 "Represent official government positions",
                 "Speak on behalf of all stakeholders"
               ].map((item: any) => (
                 <div key={item} className="flex items-center gap-3 p-4 bg-white/10 rounded-xl border border-white/20">
                   <FaTimesCircle className="text-red-400 shrink-0" />
                   <span className="font-bold text-gray-200 text-sm">{item}</span>
                 </div>
               ))}
             </div>
             <p className="text-center font-black text-brand-secondary">Final responsibility remains with KHCRF.</p>
           </div>
        </div>
      </section>

      {/* 5. Council Composition */}
      {composition.length > 0 && (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-black text-brand-dark mb-12">Council Composition</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
             {composition.map((comp: any, idx: number) => (
               <div key={comp.id || idx} className="flex items-center justify-start gap-[18px] p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition group text-left">
                 <div className="w-[32px] min-w-[32px] flex justify-center items-center shrink-0">
                   {comp.icon && <comp.icon className="text-brand-primary text-xl group-hover:text-brand-secondary transition" />}
                 </div>
                 <span className="font-bold text-gray-700 text-sm flex-1 text-left leading-[1.25]">{comp.title}</span>
               </div>
             ))}
          </div>
        </div>
      </section>
      )}

      {/* 6. Council Membership Principles */}
      {principles.length > 0 && (
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl font-black text-brand-dark mb-12">Council Membership Principles</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {principles.map((item: any, idx: number) => (
               <div key={item.id || idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                 {item.icon && <item.icon className="text-3xl text-brand-secondary mb-4" />}
                 <span className="font-bold text-gray-800">{item.title}</span>
               </div>
             ))}
          </div>
        </div>
      </section>
      )}

      {/* 7. Proposed Council Structure */}
      {structure.length > 0 && (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl font-black text-brand-dark mb-12">Proposed Council Structure</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {structure.map((item: any, idx: number) => (
               <div key={item.id || idx} className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.33%-1rem)] bg-gray-50 p-6 rounded-2xl border border-gray-200">
                 <h3 className="font-black text-brand-primary text-lg mb-2">{item.title}</h3>
                 <p className="text-sm text-gray-600 mb-4">{item.desc}</p>
                 <div className="px-3 py-1 bg-white border border-gray-200 rounded-[10px] text-xs font-bold text-gray-400 inline-block">
                   To Be Announced
                 </div>
               </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 8. Meet the Advisory Council */}
      <section className="py-24 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl">
           <div className="text-center mb-12 max-w-3xl mx-auto">
             <FaUsers data-ui-icon  className="text-5xl  mx-auto mb-6" />
             <h2 className="text-4xl font-black mb-4 text-brand-dark">Meet the Advisory Council</h2>
             <p className="text-lg text-gray-600 font-medium">
               Member profiles will be published following formal confirmation and acceptance.
             </p>
           </div>
           
           {/* Statistics Strip */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
             {[
               { label: "Confirmed Members", value: members.length > 0 ? members.length : "—" },
               { label: "Countries Represented", value: members.length > 0 ? uniqueCountries : "—" },
               { label: "Institutions", value: members.length > 0 ? uniqueInstitutions : "—" },
               { label: "Expert Domains", value: members.length > 0 ? uniqueDomains : "—" }
             ].map((stat, idx) => (
               <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 text-center shadow-sm">
                 <div className="text-3xl font-black text-brand-primary mb-2">{stat.value}</div>
                 <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">{stat.label}</div>
               </div>
             ))}
           </div>

           {/* Search & Filter Bar */}
           <div className="mb-12 space-y-6">
             <div className="relative max-w-2xl mx-auto">
               <input 
                 type="text" 
                 disabled={members.length === 0}
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search Advisory Members..." 
                 className={`w-full pl-6 pr-12 py-4 rounded-xl border border-gray-200 font-medium outline-none transition ${members.length === 0 ? 'bg-gray-100/50 text-gray-500 cursor-not-allowed' : 'bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'}`}
               />
               <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
               </div>
             </div>
             
             <div className="flex flex-wrap justify-center gap-2">
               {["All Members", "Chairperson", "Policy", "Academia", "Industry", "Artisans", "International", "Observers"].map((filter) => (
                 <button 
                   key={filter}
                   disabled={members.length === 0}
                   onClick={() => setActiveFilter(filter)}
                   className={`px-5 py-2.5 rounded-full text-sm font-bold border transition ${
                     members.length === 0 
                       ? (filter === 'All Members' ? 'bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-200 text-gray-400 cursor-not-allowed opacity-70')
                       : (activeFilter === filter ? 'bg-brand-primary text-white border-brand-primary shadow-md' : 'bg-white border-gray-200 text-gray-700 hover:border-brand-primary hover:text-brand-primary')
                   }`}
                 >
                   {filter}
                 </button>
               ))}
             </div>
           </div>

           {/* Cards Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {members.length === 0 ? (
               Array.from({ length: 8 }).map((_, idx) => (
                 <div key={idx} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition">
                   <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mb-6"></div>
                   <div className="w-3/4 h-5 bg-gray-200 rounded animate-pulse mb-3"></div>
                   <div className="w-1/2 h-4 bg-gray-100 rounded animate-pulse mb-4"></div>
                   <div className="w-2/3 h-4 bg-gray-100 rounded animate-pulse mb-6"></div>
                   
                   <div className="flex flex-wrap justify-center gap-2 mb-8 w-full">
                     <div className="w-16 h-6 bg-gray-100 rounded-full animate-pulse"></div>
                     <div className="w-20 h-6 bg-gray-100 rounded-full animate-pulse"></div>
                   </div>
                   
                   <div className="w-full mt-auto h-11 bg-gray-100 rounded-xl animate-pulse"></div>
                 </div>
               ))
             ) : filteredMembers.length > 0 ? (
               filteredMembers.map((member: any) => (
                 <div key={member.id} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition duration-300">
                   {member.photoUrl ? (
                     <img src={member.photoUrl} alt={member.title} className="w-24 h-24 rounded-full object-cover mb-4 shadow-sm border-2 border-brand-secondary/20" />
                   ) : (
                     <div data-ui-icon className="w-24 h-24 rounded-full bg-brand-primary/10  flex items-center justify-center text-3xl font-black mb-4">
                       {member.title?.charAt(0) || <FaUser />}
                     </div>
                   )}
                   <h3 className="text-xl font-black text-brand-dark mb-1 leading-tight">{member.title}</h3>
                   <div className="text-brand-primary font-bold text-sm mb-2">{member.designation}</div>
                   
                   {member.institution && (
                     <div className="text-gray-500 text-xs font-medium mb-1 flex items-center justify-center gap-1">
                       <FaBuilding className="inline opacity-70"/> {member.institution}
                     </div>
                   )}
                   
                   {member.country && (
                     <div className="text-gray-400 text-xs mb-4 flex items-center justify-center gap-1">
                       <FaGlobeAmericas className="inline opacity-70"/> {member.country}
                     </div>
                   )}
                   
                   {member.expertise && (
                     <div className="flex flex-wrap justify-center gap-1.5 mb-6 w-full">
                       {(Array.isArray(member.expertise) ? member.expertise : [member.expertise]).map((exp: string, i: number) => (
                         <span key={i} className="px-2 py-1 bg-gray-50 border border-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                           {exp}
                         </span>
                       ))}
                     </div>
                   )}
                   
                   <p className="text-sm text-gray-600 line-clamp-3 mb-6 leading-relaxed">
                     {member.desc}
                   </p>
                   
                   <Link href={`/state-of-kashmir-crafts/advisory-council/${member.slug || member.id}`} className="mt-auto w-full px-4 py-3 bg-gray-50 text-brand-dark font-bold rounded-xl hover:bg-brand-primary hover:text-white transition shadow-sm text-sm border border-gray-200 hover:border-brand-primary">
                     View Full Profile
                   </Link>
                 </div>
               ))
             ) : (
               <div className="col-span-full py-12 text-center text-gray-500 font-medium">
                 No members found matching your search or filters.
               </div>
             )}
           </div>
        </div>
      </section>

      {/* 9. Advisory Council Meetings */}
      {meetings.length > 0 && (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl font-black text-brand-dark mb-12">Advisory Council Meetings</h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative">
            <div className="hidden md:block absolute top-6 left-0 w-full h-1 bg-gray-200 z-0"></div>
            {meetings.map((meeting: any, idx: number) => (
              <div key={meeting.id || idx} className="relative z-10 flex flex-col items-center text-center w-full md:w-1/5 bg-white p-2">
                 <div className="w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center font-black text-lg mb-4 shadow-md border-4 border-white">
                   {idx + 1}
                 </div>
                 <h3 className="font-bold text-gray-800 text-sm">{meeting.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 10. Advisory Contributions */}
      {contributions.length > 0 && (
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-black text-brand-dark mb-12">Advisory Contributions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
             {contributions.map((item: any, idx: number) => (
               <div key={item.id || idx} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 flex flex-col h-full border-t-4 border-t-brand-secondary transition">
                 <FaRegCheckCircle data-ui-icon  className="text-3xl  mb-4 shrink-0" />
                 <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                 <p className="text-sm text-gray-600 leading-relaxed flex-1">{item.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>
      )}

      {/* 11. Join as an Advisor */}
      <section id="apply" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-brand-dark mb-4">Join as an Advisor</h2>
            <p className="text-gray-600">Submit your interest to serve on the KHCRF Advisory Council, the State of Kashmir Crafts Advisory Council, or both.</p>
          </div>
          <AdvisorForm />
        </div>
      </section>

      {/* 12. Transparency & Disclosure */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-5xl">
           <div className="bg-white border-l-4 border-[var(--card-left-accent)] p-6 md:p-8 rounded-r-2xl shadow-sm">
             <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2"><FaShieldAlt data-ui-icon  className="" /> Transparency & Disclosure</h3>
             <ul className="space-y-3 text-gray-700 font-medium list-disc list-inside marker:text-brand-primary">
               <li>Advisory Council members may publicly disclose relevant affiliations.</li>
               <li>Participation on the Advisory Council does not imply endorsement of report findings.</li>
               <li>KHCRF retains editorial independence.</li>
             </ul>
           </div>
        </div>
      </section>

      {/* 13. Downloads */}
      {downloads.length > 0 && (
      <section className="py-24 universal-hero text-white border-t-4 border-brand-secondary">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-14 text-white">Official Documents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {downloads.map((doc: any, idx: number) => (
               <div key={doc.id || idx} className="bg-white/10 p-8 rounded-2xl border border-white/10 hover:border-brand-secondary transition flex flex-col h-full text-left relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                    <FaFilePdf data-ui-icon  className="text-9xl " />
                  </div>
                  
                  <div className="flex-1 relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                       <FaFilePdf data-ui-icon  className="text-3xl " />
                       <h3 className="font-bold text-xl text-white leading-tight">{doc.title}</h3>
                    </div>
                    
                    <p className="text-sm text-gray-300 font-medium leading-relaxed mb-6">
                      {doc.desc}
                    </p>
                    
                    <div className="space-y-1.5 mb-8">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                         <span className="text-gray-400">Version</span>
                         <span className="text-white">{doc.version || '—'}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                         <span className="text-gray-400">Status</span>
                         <span className={doc.status === "Approved" ? "text-green-400" : "text-amber-400"}>{doc.status || 'Pending'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-auto relative z-10">
                    <Link href={`/state-of-kashmir-crafts/documents/${(doc.title || '').toLowerCase().replace(/ /g, '-')}`} className="block w-full px-4 py-3 bg-white/10 text-white font-bold rounded-[14px] hover:bg-white/20 transition shadow-md border border-white/20 text-sm text-center">
                      View
                    </Link>
                    <button className="w-full px-4 py-3 bg-[#fdfbf7] text-brand-dark font-black rounded-[14px] hover:bg-brand-secondary hover:text-white transition shadow-md text-sm">
                      Download
                    </button>
                  </div>
               </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 14. Call to Action */}
      <section className="py-20 relative overflow-hidden universal-hero">
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
            <h3 className="text-3xl md:text-4xl font-black mb-10 tracking-tight text-white leading-tight">
              Strong assessments are built through diverse voices.
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="#apply"
                className="px-8 py-4 bg-brand-primary text-white font-bold rounded-[14px] hover:bg-brand-secondary transition-all shadow-xl"
              >
                Apply for Advisory Council
              </Link>
              <Link
                href="/state-of-kashmir-crafts/stakeholder-registry"
                className="px-8 py-4 bg-white text-brand-dark font-bold rounded-[14px] hover:bg-gray-100 transition-all shadow-xl"
              >
                Register as Stakeholder
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
