"use client";
import { getBaseUrlNoApi } from "@/lib/api";
import * as FaIcons from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaUserGraduate, FaSearch, FaCamera, FaGlobe, 
  FaFileAlt, FaCheckCircle, FaUsers, FaTasks, 
  FaQuestionCircle, FaClock, FaRupeeSign, FaCertificate, 
  FaMedal, FaLaptop, FaChevronDown, FaHandshake,
  FaInfoCircle
} from 'react-icons/fa';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { becomeAFellowHeroFallback } from '@/config/heroFallbacks';

export default function BecomeAFellowPage() {
  const [positions, setPositions] = useState<any[]>([]);
  const [eligibility, setEligibility] = useState<any[]>([]);
  const [benefits, setBenefits] = useState<any[]>([]);
  const [responsibilities, setResponsibilities] = useState<any[]>([]);
  const [selectionProcess, setSelectionProcess] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    district: '',
    education: '',
    institution: '',
    position: '',
    skills: '',
    statement: '',
    consent: false
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [formStatus, setFormStatus] = useState<'idle'|'submitting'|'success'|'error'>('idle');
  const [formMessage, setFormMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setFieldErrors({});
    
    if (!cvFile) {
        setFormStatus('idle');
        setFieldErrors({ cv: 'CV file is required (PDF only).' });
        return;
    }
    if (cvFile.type !== 'application/pdf') {
        setFormStatus('idle');
        setFieldErrors({ cv: 'Invalid file type. Only PDFs are allowed.' });
        return;
    }
    if (cvFile.size > 5 * 1024 * 1024) {
        setFormStatus('idle');
        setFieldErrors({ cv: 'CV exceeds the 5 MB limit. Please upload a smaller PDF.' });
        return;
    }

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, typeof value === 'boolean' ? String(value) : value);
      });
      submitData.append('cvFile', cvFile);
      if (portfolioFile) submitData.append('portfolioFile', portfolioFile);

      const res = await fetch('/api/backend/skc/fellowships/register', {
        method: 'POST',
        body: submitData
      });
      
      let data;
      try { data = await res.json(); } catch(e) { data = {}; }
      
      if (res.status === 201 && data.status === 'success') {
        setFormStatus('success');
        setFormMessage(JSON.stringify({ ref: data.data?.referenceNumber, pos: data.data?.position, time: data.data?.submittedAt, duplicate: false }));
      } else if (res.status === 409 || data.status === 'already_submitted') {
        setFormStatus('success');
        setFormMessage(JSON.stringify({ ref: data.data?.referenceNumber || 'ALREADY_RECEIVED', duplicate: true }));
      } else if (res.status === 413 || data.error?.code === 'CV_FILE_TOO_LARGE') {
        setFormStatus('idle');
        setFieldErrors({ cv: 'CV exceeds the 5 MB limit. Please upload a smaller PDF.' });
      } else if (res.status === 415 || data.error?.code === 'CV_INVALID_TYPE') {
        setFormStatus('idle');
        setFieldErrors({ cv: 'Invalid file type. Only PDFs are allowed.' });
      } else if (res.status === 400 && data.error?.code === 'CV_REQUIRED') {
        setFormStatus('idle');
        setFieldErrors({ cv: 'CV file is required (PDF only).' });
      } else if (res.status === 400 && data.error?.code === 'POSITION_INVALID') {
        setFormStatus('idle');
        setFieldErrors({ position: data.error?.message });
      } else if (res.status === 403 || data.error?.code === 'APPLICATIONS_CLOSED') {
        setFormStatus('error');
        setFormMessage(data.error?.message || 'Applications are currently closed.');
      } else {
        setFormStatus('error');
        setFormMessage('We could not confirm your submission. Please check your application status before trying again.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setFormStatus('error');
      setFormMessage('We could not confirm your submission. Please check your application status before trying again.');
    }
  };

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

        setPositions(mapItems('POSITIONS'));
        setEligibility(mapItems('ELIGIBILITY'));
        setBenefits(mapItems('BENEFITS'));
        setResponsibilities(mapItems('RESPONSIBILITIES'));
        setSelectionProcess(mapItems('SELECTIONPROCESS'));
        setFaqs(mapItems('FAQS'));
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
        pageKey="become-a-fellow" 
        fallbackConfig={becomeAFellowHeroFallback as any} 
      />

      {/* 2. Fellowship Overview & 4. Duration */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="w-full lg:w-1/2">
                 <h2 className="text-3xl font-black text-brand-dark mb-6">Fellowship Overview</h2>
                 <p className="text-gray-600 mb-6 leading-relaxed font-medium">
                   Selected fellows will play a crucial role in supporting the comprehensive online consultation and assessment process for the State of Kashmir Crafts Assessment 2026–2027 report. This is a unique opportunity to contribute directly to the documentation and analysis of Kashmir&apos;s artisan ecosystem.
                 </p>
                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700"><FaCheckCircle data-ui-icon  className="" /> Stakeholder outreach</div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700"><FaCheckCircle data-ui-icon  className="" /> Online consultations</div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700"><FaCheckCircle data-ui-icon  className="" /> Documentation</div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700"><FaCheckCircle data-ui-icon  className="" /> Research support</div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700"><FaCheckCircle data-ui-icon  className="" /> Media coordination</div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700"><FaCheckCircle data-ui-icon  className="" /> Evidence review</div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700"><FaCheckCircle data-ui-icon  className="" /> Public participation support</div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700"><FaCheckCircle data-ui-icon  className="" /> Report preparation</div>
                 </div>
              </div>
              <div className="w-full lg:w-1/2 bg-gray-50 p-8 rounded-3xl border border-gray-200 shadow-sm">
                 <h3 className="text-xl font-black text-brand-dark mb-6 border-b border-gray-200 pb-4">Programme Details</h3>
                 <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                       <div data-ui-icon className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center  shrink-0"><FaClock /></div>
                       <div>
                          <span className="block font-bold text-gray-900">Duration: Project Based</span>
                          <span className="text-sm text-gray-500">Duration varies based on the specific role and project requirements.</span>
                       </div>
                    </li>
                    <li className="flex items-start gap-4">
                       <div data-ui-icon className="w-10 h-10 bg-brand-secondary/10 rounded-full flex items-center justify-center  shrink-0"><FaLaptop /></div>
                       <div>
                          <span className="block font-bold text-gray-900">Mode: Online / Remote</span>
                          <span className="text-sm text-gray-500">100% online at launch, with central coordination from Kashmir.</span>
                       </div>
                    </li>
                    <li className="flex items-start gap-4">
                       <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0"><FaRupeeSign /></div>
                       <div>
                          <span className="block font-bold text-gray-900">Stipend: Paid</span>
                          <span className="text-sm text-gray-500">Selected fellows receive a structured monthly fellowship stipend.</span>
                       </div>
                    </li>
                 </ul>
              </div>
           </div>
        </div>
      </section>

      {/* 3. Fellowship Positions */}
      {positions.length > 0 ? (
        <section id="positions" className="py-20 bg-gray-50 border-y border-gray-200">
          <div className="container mx-auto px-4 max-w-6xl">
             <h2 className="text-3xl font-black text-brand-dark mb-12 text-center">Fellowship Positions</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {positions.map((pos: any, idx: number) => (
                  <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-brand-primary transition">
                     <div data-ui-icon className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-6 text-2xl ">
                        {pos.icon && <pos.icon />}
                     </div>
                     <h3 className="font-black text-xl text-gray-900 mb-4">{pos.title}</h3>
                     <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Role Overview</div>
                     <p className="text-sm text-gray-600 leading-relaxed font-medium mb-6">{pos.role || pos.desc}</p>
                     <Link href="#apply" className="text-icon-on-light font-bold text-sm hover:underline flex items-center gap-2">Apply for this role <FaCheckCircle /></Link>
                  </div>
                ))}
             </div>
          </div>
        </section>
      ) : (
        <section id="positions" className="py-24 bg-gray-50 border-y border-gray-200">
           <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="text-3xl md:text-4xl font-black text-brand-dark mb-12 text-center">Fellowship Positions</h2>
              <div className="bg-white border border-gray-200 shadow-sm rounded-3xl p-16 text-center max-w-2xl mx-auto relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-secondary to-brand-primary"></div>
                 <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-6 shadow-inner">
                    <FaUserGraduate className="text-2xl text-gray-400" />
                 </div>
                 <h3 className="text-xl font-black text-brand-dark mb-3 tracking-tight">Positions Under Advisory Review</h3>
                 <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-md mx-auto mb-6">
                    Fellowship descriptors, academic roles, and research tracks are undergoing final curriculum vetting by the KHCRF Advisory Council. Vetted positions will unlock for public applications shortly.
                 </p>
                 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-150 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
                    Awaiting Secretariat Release
                 </div>
              </div>
           </div>
        </section>
      )}

      {/* 5. Eligibility & 6. Benefits */}
      {(eligibility.length > 0 || benefits.length > 0) && (
        <section className="py-20 universal-hero text-white">
          <div className="container mx-auto px-4 max-w-6xl">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Eligibility */}
                {eligibility.length > 0 && (
                  <div>
                     <h2 className="text-3xl font-black mb-8 flex items-center gap-3"><FaCheckCircle data-ui-icon  className="" /> Eligibility & Criteria</h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {eligibility.map((req: any, i: number) => (
                          <div key={i} className="bg-white/10 p-4 rounded-xl border border-white/20 flex items-center gap-3">
                             {req.icon && <req.icon className="text-brand-secondary shrink-0" />}
                             <span className="font-bold text-sm">{req.title}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                )}
                
                {/* Benefits */}
                {benefits.length > 0 && (
                  <div>
                     <h2 className="text-3xl font-black mb-8 flex items-center gap-3"><FaMedal data-ui-icon  className="" /> Fellowship Benefits</h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {benefits.map((ben: any, i: number) => (
                          <div key={i} className="bg-white p-4 rounded-xl shadow-lg flex items-center gap-3">
                             {ben.icon && <ben.icon className="text-brand-primary shrink-0" />}
                             <span className="font-bold text-sm text-brand-dark">{ben.title}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                )}
             </div>
          </div>
        </section>
      )}

      {/* 7. Responsibilities & 9. Selection Process */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <div className="flex flex-col lg:flex-row gap-16">
              {/* Responsibilities */}
              <div className="w-full lg:w-1/2">
                 <h2 className="text-3xl font-black text-brand-dark mb-8">Core Responsibilities</h2>
                 {responsibilities.length > 0 ? (
                   <div className="space-y-4">
                      {responsibilities.map((resp: any, i: number) => (
                        <div key={i} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                           <FaTasks data-ui-icon  className=" shrink-0" />
                           <span className="font-bold text-gray-700 text-sm">{resp.title || resp.name || resp.desc}</span>
                        </div>
                      ))}
                   </div>
                 ) : (
                   <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                     <p className="text-gray-500 font-medium text-sm">Detailed responsibilities will be published alongside position listings.</p>
                   </div>
                 )}
              </div>
              
              {/* Selection Process */}
              <div className="w-full lg:w-1/2">
                 <h2 className="text-3xl font-black text-brand-dark mb-8">Selection Process</h2>
                 {selectionProcess.length > 0 ? (
                   <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                      <div className="space-y-6 relative border-l-2 border-gray-200 ml-4">
                         {selectionProcess.map((step: any, i: number) => (
                           <div key={i} className="relative pl-8">
                              <div className="absolute -left-[9px] top-1 w-4 h-4 bg-white border-4 border-gray-300 rounded-full"></div>
                              <div>
                                 <h3 className="font-bold text-gray-800">{step.title || step.step || step.name || step.desc}</h3>
                                 {(step.date || step.timeline) && (
                                   <span className="text-xs font-bold text-brand-primary">{step.date || step.timeline}</span>
                                 )}
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                 ) : (
                   <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                     <p className="text-gray-500 font-medium text-sm">The selection process timeline will be published when applications open.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </section>

      {/* 8. Application Form */}
      <section id="apply" className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-bl-full z-0"></div>
              <div className="relative z-10">
                 <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-brand-dark mb-2">Application Form</h2>
                    <p className="text-gray-600 font-medium">Applications are now open for the 2026 fellowship cohort. Complete the form below to apply.</p>
                 </div>
                 
                 <form onSubmit={handleSubmit} className="space-y-6">
                   {formStatus === 'error' && (
  <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-bold mb-6">
    {formMessage}
  </div>
)}
{formStatus === 'success' && (
  <div className="bg-green-50 p-8 rounded-2xl border border-green-200 mb-6">
    <div className="flex items-center text-green-800 mb-4">
      <FaCheckCircle className="text-3xl mr-3" />
      <h3 className="text-2xl font-bold">
        {formMessage && formMessage.includes('{') ? (JSON.parse(formMessage).duplicate ? 'APPLICATION ALREADY RECEIVED' : 'APPLICATION SUBMITTED') : 'APPLICATION SUBMITTED'}
      </h3>
    </div>
    <div className="bg-white p-6 rounded-xl border border-green-100 mb-6">
      <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Application Reference</p>
      <p className="text-2xl font-mono text-gray-900 mb-4">{formMessage && formMessage.includes('{') ? JSON.parse(formMessage).ref : formMessage}</p>
    </div>
    <p className="text-green-800 font-medium">Please retain this reference for future correspondence.</p>
  </div>
)}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-xs font-bold text-gray-700 mb-2">Full Name *</label>
                       <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-700 mb-2">Email *</label>
                       <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50" />
                     </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-xs font-bold text-gray-700 mb-2">Phone Number</label>
                       <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-700 mb-2">District / Current Location</label>
                       <input type="text" value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50" />
                     </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-xs font-bold text-gray-700 mb-2">Highest Education / Degree</label>
                       <input type="text" value={formData.education} onChange={(e) => setFormData({...formData, education: e.target.value})} className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-700 mb-2">Current Institution / Organisation</label>
                       <input type="text" value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50" />
                     </div>
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-700 mb-2">Position Applied For *</label>
                     <select required value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50">
                        <option value="">Select a position</option>
                        {positions.length > 0 ? (
                           positions.map((p: any, i: number) => <option key={i} value={p.title}>{p.title}</option>)
                        ) : (
                           <>
                             <option value="Research Fellow (Craft Documentation)">Research Fellow (Craft Documentation)</option>
                             <option value="Research Fellow (Supply Chain Analysis)">Research Fellow (Supply Chain Analysis)</option>
                             <option value="Data Analyst (Artisan Demographics)">Data Analyst (Artisan Demographics)</option>
                             <option value="Community Outreach Coordinator">Community Outreach Coordinator</option>
                             <option value="Policy Assistant">Policy Assistant</option>
                             <option value="Media & Communications Fellow">Media & Communications Fellow</option>
                             <option value="Digital Archiving Fellow">Digital Archiving Fellow</option>
                             <option value="General Interest">General Interest</option>
                           </>
                        )}
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-700 mb-2">Relevant Skills (Keywords)</label>
                     <input type="text" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50" placeholder="e.g. Data Analysis, Content Writing, SEO, Excel" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-700 mb-2">Short Statement of Interest (Why do you want to join?)</label>
                     <textarea value={formData.statement} onChange={(e) => setFormData({...formData, statement: e.target.value})} className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 h-32"></textarea>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-xs font-bold text-gray-700 mb-2">Upload CV (PDF)</label>
                       <div className="w-full relative">
                         <input type="file" accept=".pdf" onChange={(e) => setCvFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                         <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center text-gray-700 text-sm font-bold hover:border-brand-primary transition">
                            {cvFile ? cvFile.name : 'Choose File'}
                         </div>
                       </div>
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-700 mb-2">Upload Portfolio (Optional)</label>
                       <div className="w-full relative">
                         <input type="file" onChange={(e) => setPortfolioFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                         <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center text-gray-700 text-sm font-bold hover:border-brand-primary transition">
                            {portfolioFile ? portfolioFile.name : 'Choose File'}
                         </div>
                       </div>
                     </div>
                   </div>
                   <div className="flex items-start gap-3 mt-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
                     <input type="checkbox" checked={formData.consent} onChange={(e) => setFormData({...formData, consent: e.target.checked})} className="mt-1" required />
                     <label className="text-xs text-gray-600 font-medium">
                       I confirm that all information provided is accurate and I can commit to the duration of the online fellowship. *
                     </label>
                   </div>
                   <button type="submit" disabled={formStatus === 'submitting'} className="w-full py-4 bg-brand-primary text-white font-black rounded-xl text-lg hover:bg-brand-secondary transition shadow-xl disabled:opacity-50">
                     {formStatus === 'submitting' ? 'Submitting...' : 'Submit Application'}
                   </button>
                 </form>
              </div>
           </div>
        </div>
      </section>

      {/* 11. Current Fellows Directory */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
           <h2 className="text-3xl font-black text-brand-dark mb-12 text-center">2026 Fellowship Cohort</h2>
           <div className="bg-gray-50 border border-gray-200 rounded-3xl p-16 text-center shadow-sm max-w-3xl mx-auto">
              <FaUsers className="text-6xl text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No fellows selected yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">Applications are now open. The selected cohort will be published here upon completion of the selection process.</p>
           </div>
        </div>
      </section>

      {/* 10. FAQ */}
      {faqs.length > 0 && (
        <section className="py-20 universal-hero text-white">
          <div className="container mx-auto px-4 max-w-4xl">
             <h2 className="text-3xl font-black mb-12 text-center flex items-center justify-center gap-3"><FaQuestionCircle data-ui-icon  className="" /> Fellowship FAQ</h2>
             <div className="space-y-4">
                {faqs.map((faq: any, idx: number) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
                     <h3 className="font-bold text-lg mb-2 text-white flex justify-between items-center">
                       {faq.q || faq.title}
                       <FaChevronDown data-ui-icon  className=" text-sm" />
                     </h3>
                     <p className="text-gray-300 text-sm leading-relaxed">{faq.a || faq.desc}</p>
                  </div>
                ))}
             </div>
          </div>
        </section>
      )}

      {/* 12. Call to Action */}
      <section className="relative py-24 bg-brand-primary overflow-hidden">
        
        <div className="container mx-auto px-4 text-center relative z-10">
            <h3 className="text-3xl md:text-4xl font-black mb-10 tracking-tight text-white leading-tight">
              Help document the future of Kashmir crafts.
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="#apply"
                className="px-8 py-4 bg-white text-brand-dark font-black rounded-[14px] hover:bg-gray-100 transition-all shadow-xl"
              >
                Apply Now
              </Link>
              <Link
                href="/state-of-kashmir-crafts/faq#cat-7"
                className="px-8 py-4 bg-brand-dark text-white font-bold rounded-[14px] hover:bg-brand-secondary transition-all shadow-xl"
              >
                Fellowship FAQ
              </Link>
              <Link
                href="mailto:contact@khcrf.org"
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-[14px] hover:bg-white/10 transition-all"
              >
                Contact Team
              </Link>
            </div>
        </div>
      </section>
    </main>
  );
}
