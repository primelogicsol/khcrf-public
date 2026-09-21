const fs = require('fs');
let c = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/become-a-fellow/page.tsx', 'utf8');

const rewrite = `"use client";

import * as FaIcons from "react-icons/fa";
import React, { useState, useEffect, useRef } from 'react';
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

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [programConfig, setProgramConfig] = useState<any>(null);
  const [configLoading, setConfigLoading] = useState(true);
  
  const cvInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/backend/skc/fellowships/config')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setProgramConfig(data.data);
        }
        setConfigLoading(false);
      })
      .catch(err => {
        console.error(err);
        setConfigLoading(false);
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cv' | 'portfolio') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'cv') {
      if (file.type !== 'application/pdf') {
        setFieldErrors(prev => ({ ...prev, cv: 'Invalid file type. Only PDFs are allowed.' }));
        setCvFile(null);
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFieldErrors(prev => ({ ...prev, cv: 'CV exceeds the 5 MB limit. Please upload a smaller PDF.' }));
        setCvFile(null);
        e.target.value = '';
        return;
      }
      setFieldErrors(prev => ({ ...prev, cv: '' }));
      setCvFile(file);
    } else {
      const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowed.includes(file.type)) {
        setFieldErrors(prev => ({ ...prev, portfolio: 'Invalid file type. Allowed: PDF, JPG, PNG.' }));
        setPortfolioFile(null);
        e.target.value = '';
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setFieldErrors(prev => ({ ...prev, portfolio: 'Portfolio exceeds the 10 MB limit.' }));
        setPortfolioFile(null);
        e.target.value = '';
        return;
      }
      setFieldErrors(prev => ({ ...prev, portfolio: '' }));
      setPortfolioFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setFormMessage('');
    
    let hasError = false;
    const errors: Record<string, string> = {};

    if (!formData.fullName) { errors.fullName = 'Required'; hasError = true; }
    if (!formData.email) { errors.email = 'Required'; hasError = true; }
    if (!formData.district) { errors.district = 'Required'; hasError = true; }
    if (!formData.education) { errors.education = 'Required'; hasError = true; }
    if (!formData.position) { errors.position = 'Required'; hasError = true; }
    if (!formData.statement) { errors.statement = 'Required'; hasError = true; }
    if (!formData.consent) { errors.consent = 'Required'; hasError = true; }
    
    if (!cvFile) {
      errors.cv = 'CV file is required (PDF only).';
      hasError = true;
      cvInputRef.current?.focus();
    }
    
    if (hasError) {
      setFieldErrors(errors);
      return;
    }
    
    setFormStatus('submitting');
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, typeof value === 'boolean' ? String(value) : value);
      });
      submitData.append('cvFile', cvFile!);
      if (portfolioFile) submitData.append('portfolioFile', portfolioFile);

      const res = await fetch('/api/backend/skc/fellowships/register', {
        method: 'POST',
        body: submitData
      });
      const data = await res.json();

      if (res.status === 201 && data.status === 'success') {
        setFormStatus('success');
        setFormMessage(JSON.stringify({ ref: data.data?.referenceNumber, pos: data.data?.position, time: data.data?.submittedAt, duplicate: false }));
      } else if (res.status === 409 || data.status === 'already_submitted') {
        setFormStatus('success'); // Intentional UI success for duplicate
        setFormMessage(JSON.stringify({ ref: data.data?.referenceNumber || 'ALREADY_RECEIVED', duplicate: true }));
      } else if (res.status === 413 || data.error?.code === 'CV_FILE_TOO_LARGE') {
        setFormStatus('idle');
        setFieldErrors({ cv: 'CV exceeds the 5 MB limit. Please upload a smaller PDF.' });
        cvInputRef.current?.focus();
      } else if (res.status === 415 || data.error?.code === 'CV_INVALID_TYPE') {
        setFormStatus('idle');
        setFieldErrors({ cv: 'Invalid file type. Only PDFs are allowed.' });
        cvInputRef.current?.focus();
      } else if (res.status === 400 && data.error?.code === 'POSITION_INVALID') {
        setFormStatus('idle');
        setFieldErrors({ position: data.error.message });
      } else if (res.status === 400 && data.error?.code === 'CV_REQUIRED') {
        setFormStatus('idle');
        setFieldErrors({ cv: 'CV file is required (PDF only).' });
        cvInputRef.current?.focus();
      } else if (res.status === 403 || data.error?.code === 'APPLICATIONS_CLOSED') {
        setFormStatus('error');
        setFormMessage(data.error?.message || 'Applications are currently closed.');
      } else {
        setFormStatus('error');
        setFormMessage('We could not confirm your submission. Please check your application status before trying again.');
      }
    } catch (err: any) {
      setFormStatus('error');
      setFormMessage('We could not confirm your submission. Please check your application status before trying again.');
    }
  };

  useEffect(() => {
    fetch('/api/backend/v1/knowledge?entityType=SKC_RECORD&take=100')
      .then(res => res.json())
      .then(data => {
        const all = Array.isArray(data?.data) ? data.data : [];
        setPositions(all.filter((r: any) => r.category === 'Fellowship Position'));
        setEligibility(all.filter((r: any) => r.category === 'Fellowship Eligibility'));
        setBenefits(all.filter((r: any) => r.category === 'Fellowship Benefit'));
        setResponsibilities(all.filter((r: any) => r.category === 'Fellowship Responsibility'));
        setSelectionProcess(all.filter((r: any) => r.category === 'Fellowship Selection Step'));
        setFaqs(all.filter((r: any) => r.category === 'Fellowship FAQ'));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getIcon = (iconName: string) => {
    const Icon = (FaIcons as any)[iconName];
    return Icon ? <Icon /> : <FaCheckCircle />;
  };

  if (loading || configLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-brand-primary font-bold animate-pulse">Loading form...</div></div>;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <UniversalEditorialHero 
        title={becomeAFellowHeroFallback.title}
        subtitle={becomeAFellowHeroFallback.subtitle}
        description={becomeAFellowHeroFallback.description}
        primaryCta={becomeAFellowHeroFallback.primaryCta}
        align="center"
      />

      {/* Program Status Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm">
            <div className="flex items-center text-gray-600 mb-2 md:mb-0">
              <FaInfoCircle className="text-brand-primary mr-2" />
              <span>Status: <strong>{programConfig?.state === 'APPLICATIONS_OPEN' ? 'Applications Open' : 'Under Review'}</strong></span>
            </div>
            {programConfig?.state === 'APPLICATIONS_OPEN' && (
              <div className="text-gray-600">
                Window: <strong>{new Date(programConfig.applicationsOpenAt).toLocaleDateString()}</strong> - <strong>{new Date(programConfig.applicationsCloseAt).toLocaleDateString()}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
              <h2 className="text-3xl font-black text-brand-dark mb-2">Application Form</h2>
              <p className="text-gray-500 mb-10">Please fill out all required fields to apply for the 2026 cohort.</p>
              
              {formStatus === 'success' ? (
                <div className="bg-green-50 p-8 rounded-2xl border border-green-200">
                  <div className="flex items-center text-green-800 mb-4">
                    <FaCheckCircle className="text-3xl mr-3" />
                    <h3 className="text-2xl font-bold">
                      {JSON.parse(formMessage).duplicate ? 'APPLICATION ALREADY RECEIVED' : 'APPLICATION SUBMITTED'}
                    </h3>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-green-100 mb-6">
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Application Reference</p>
                    <p className="text-2xl font-mono text-gray-900 mb-4">{JSON.parse(formMessage).ref}</p>
                    
                    {!JSON.parse(formMessage).duplicate && JSON.parse(formMessage).pos && (
                      <>
                        <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Position</p>
                        <p className="text-lg font-bold text-gray-900 mb-4">
                           {programConfig?.positions?.find((p:any) => p.id === JSON.parse(formMessage).pos)?.title || JSON.parse(formMessage).pos}
                        </p>
                        
                        <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Submitted</p>
                        <p className="text-gray-900">{new Date(JSON.parse(formMessage).time).toLocaleString()}</p>
                      </>
                    )}
                  </div>
                  <p className="text-green-800 font-medium">Please retain this reference for future correspondence.</p>
                </div>
              ) : programConfig?.state !== 'APPLICATIONS_OPEN' ? (
                <div className="bg-yellow-50 p-8 rounded-2xl border border-yellow-200 text-center">
                  <h3 className="text-xl font-bold text-yellow-900 mb-2">Applications Closed</h3>
                  <p className="text-yellow-800 text-sm">Fellowship applications are not currently open.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {formStatus === 'error' && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-200 mb-6 flex items-start">
                      <FaInfoCircle className="mt-0.5 mr-2 shrink-0" />
                      <span>{formMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">Full Name *</label>
                      <input type="text" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50" />
                      {fieldErrors.fullName && <p className="text-red-500 text-xs mt-1">{fieldErrors.fullName}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">Email Address *</label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50" />
                      {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">Phone Number</label>
                      <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">District / Region *</label>
                      <input type="text" required value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})} className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">Highest Education *</label>
                      <input type="text" required value={formData.education} onChange={(e) => setFormData({...formData, education: e.target.value})} className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">Current/Last Institution</label>
                      <input type="text" value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Fellowship Position *</label>
                    <select required value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50">
                      <option value="">Select a position...</option>
                      {programConfig?.positions?.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                    {fieldErrors.position && <p className="text-red-500 text-xs mt-1">{fieldErrors.position}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Relevant Skills (Optional)</label>
                    <input type="text" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} placeholder="e.g. Data Analysis, Content Writing, SEO, Excel" className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Statement of Purpose *</label>
                    <textarea required value={formData.statement} onChange={(e) => setFormData({...formData, statement: e.target.value})} rows={4} className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50" placeholder="Why are you interested in this fellowship?"></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">Upload CV (PDF, Max 5MB) *</label>
                      <input 
                        type="file" 
                        accept=".pdf"
                        required
                        ref={cvInputRef}
                        onChange={(e) => handleFileChange(e, 'cv')}
                        className={\`w-full text-sm \${fieldErrors.cv ? 'border-red-500 text-red-500' : ''}\`}
                      />
                      {fieldErrors.cv && <p className="text-red-500 text-xs mt-2 font-medium">{fieldErrors.cv}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">Portfolio / Sample (Optional, Max 10MB)</label>
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.png"
                        onChange={(e) => handleFileChange(e, 'portfolio')}
                        className="w-full text-sm"
                      />
                      {fieldErrors.portfolio && <p className="text-red-500 text-xs mt-2 font-medium">{fieldErrors.portfolio}</p>}
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input type="checkbox" id="consent" required checked={formData.consent} onChange={(e) => setFormData({...formData, consent: e.target.checked})} className="mt-1" />
                    <label htmlFor="consent" className="ml-3 text-sm text-gray-600">
                      I certify that the information provided is true and accurate. I consent to my data being processed in accordance with KHCRF privacy policies.
                    </label>
                  </div>

                  <button type="submit" disabled={formStatus === 'submitting'} className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                    {formStatus === 'submitting' ? 'Submitting Application...' : 'Submit Application'}
                  </button>
                </form>
              )}
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Sidebar Content */}
            <div className="bg-brand-dark text-white rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Contact Support</h3>
              <p className="text-gray-300 text-sm mb-4">Having trouble with your application? Our team is here to help.</p>
              <a href="mailto:fellowships@khcrf.org" className="text-brand-primary hover:text-white transition-colors font-bold text-sm">fellowships@khcrf.org</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
`;

fs.writeFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/become-a-fellow/page.tsx', rewrite);
