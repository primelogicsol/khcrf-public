"use client";
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { 
  FaCheckCircle, FaSpinner, FaExclamationTriangle, 
  FaCopy, FaPrint, FaDownload
} from 'react-icons/fa';
import { KASHMIR_DISTRICT_NAMES } from '@/lib/kashmir-districts';
import { INSTITUTIONAL_CATEGORIES } from '@/lib/skc/participant-categories';

interface Props {
  participationScope?: 'KHCRF' | 'SKC' | 'BOTH';
  initialCategory?: string;
}

function InstitutionRegistrationFormInner({ participationScope: defaultScope = 'BOTH', initialCategory = '' }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interestParam = searchParams.get('interest');
  interface FormData {
  participationScope: string;
  institutionName: string;
  category: string;
  representativeName: string;
  designation: string;
  districtCity: string;
  country: string;
  stateProvince: string;
  operationalCoverage: string;
  email: string;
  website: string;
  participationTypes: string;
  phone: string;
  authConsent: boolean;
  privacyConsent: boolean;
  publicDirectoryConsent: boolean;
  communicationsConsent: boolean;
}

  const [formData, setFormData] = useState<FormData>({
    participationScope: defaultScope as string,
    institutionName: '',
    category: initialCategory,
    representativeName: '',
    designation: '',
    districtCity: '',
    country: 'India',
    stateProvince: '',
    operationalCoverage: '',
    email: '',
    website: '',
    participationTypes: '',
    phone: '',
    authConsent: true,
    privacyConsent: true,
    publicDirectoryConsent: true,
    communicationsConsent: true
  });
  React.useEffect(() => {
    if (interestParam && defaultScope === 'KHCRF') {
      let mappedInterest = '';
      let mappedType = '';
      switch (interestParam.toLowerCase()) {
        case 'knowledge': 
          mappedInterest = 'Research & Policy Collaboration'; 
          mappedType = 'University / Research Institution';
          break;
        case 'technology': 
          mappedInterest = 'Multiple Ecosystem Platforms'; 
          mappedType = 'Technology Provider';
          break;
        case 'tourism': 
          mappedInterest = 'Kashmir ArtStay'; 
          mappedType = 'Tourism / Hospitality';
          break;
        case 'trade': 
          mappedInterest = 'Offshore Integration, DKC B2B Connect'; 
          mappedType = 'Retailer / Buyer';
          break;
        case 'enterprise': 
          mappedInterest = 'DKC B2B Connect, Purple Soul USA'; 
          mappedType = 'Artisan / Workshop';
          break;
        case 'institutional': 
          mappedInterest = 'Research & Policy Collaboration'; 
          mappedType = 'NGO / Development Organization';
          break;
      }
      setFormData(prev => ({ 
        ...prev, 
        participationTypes: mappedInterest,
        category: mappedType || prev.category
      }));
    }
  }, [interestParam, defaultScope]);

  const locationMode = ["International Organization / Development Agency", "International Museum / Cultural Institution"].includes(formData.category) ? "INTERNATIONAL" : "KASHMIR_DISTRICT";

  
  const [registeredCategory, setRegisteredCategory] = useState(initialCategory);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successData, setSuccessData] = useState<{
      referenceNumber: string;
      status: string;
      participationScope: string;
      institutionName: string;
      category: string;
      representativeName: string;
      designation: string;
      districtCity: string;
      country?: string;
      locationType?: string;
      email: string;
      website: string;
      participationTypes: string;
    } | null>(null);

  React.useEffect(() => {
    const isDirty = 
      formData.participationScope !== defaultScope ||
      formData.institutionName !== '' ||
      formData.category !== '' ||
      formData.representativeName !== '' ||
      formData.designation !== '' ||
      formData.districtCity !== '' ||
        formData.stateProvince !== '' ||
        formData.operationalCoverage !== '' ||
      formData.email !== '' ||
      formData.website !== '' ||
      formData.participationTypes !== '' ||
      formData.phone !== '';
      
    if (isDirty) {
      sessionStorage.setItem('skc_form_dirty', 'true');
    } else {
      sessionStorage.removeItem('skc_form_dirty');
    }
  }, [formData, defaultScope]);

  // Restore success confirmation on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSuccess = sessionStorage.getItem('skc_institution_success_data');
      if (storedSuccess) {
        try {
          const parsed = JSON.parse(storedSuccess);
          if (parsed && parsed.referenceNumber) {
            setSuccessData(parsed);
            setStatus('success');
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);

  // Read common fields from shared storage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = sessionStorage.getItem('skc_shared_registration_data');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setFormData(prev => ({
            ...prev,
            participationScope: parsed.participationScope || prev.participationScope,
            representativeName: parsed.fullName || prev.representativeName,
            institutionName: parsed.organization || prev.institutionName,
            designation: parsed.designation || prev.designation,
            districtCity: parsed.district || prev.districtCity,
            email: parsed.email || prev.email,
            phone: parsed.phone || prev.phone,
            website: parsed.website || prev.website
          }));
        } catch (e) {
          console.error('Error loading shared registry data', e);
        }
      }
    }
  }, []);

  // Save changes to shared storage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const sharedData = {
        participationScope: formData.participationScope,
        fullName: formData.representativeName,
        organization: formData.institutionName,
        designation: formData.designation,
        district: formData.districtCity,
        email: formData.email,
        phone: formData.phone,
        website: formData.website
      };
      sessionStorage.setItem('skc_shared_registration_data', JSON.stringify(sharedData));
    }
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    
const isInstRequired = !(formData.participationScope === 'KHCRF' && formData.category === 'Artisan / Workshop');
if (!formData.participationScope || (isInstRequired && !formData.institutionName) || !formData.category || !formData.representativeName || !formData.email || !formData.authConsent) {
        setStatus('error');
        setMessage('Please fill in all required fields and accept the required consent.');
        return;
    }

    setStatus('submitting');
    setMessage('');
    setFieldErrors({});

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20_000);

    try {
const API_BASE_URL = getBaseUrlNoApi();
      
      // The backend expects an array for participationTypes, but it will also parse a stringified array. 
      // We will parse the textarea into an array by newlines or commas.
      const parsedParticipationTypes = formData.participationTypes
        .split(/[\n,]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

      // If they didn't provide any participation types, provide a default
      if (parsedParticipationTypes.length === 0) {
        parsedParticipationTypes.push('General Collaboration');
      }

      // Backend requires phone, if none provided by user use dummy 0000000 to bypass
      const phoneToSubmit = formData.phone?.trim() ? formData.phone : '0000000000';

      const res = await fetch(`/api/backend/skc/institutions/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: phoneToSubmit,
          participationTypes: parsedParticipationTypes
        }),
        signal: controller.signal
      });

      const contentType = res.headers.get("content-type") || "";
      let data: any;
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = {
          success: false,
          error: text || `Request failed with status ${res.status}`,
        };
      }

      const actualData = data?.data || data;
      if (!res.ok || !(data?.status === 'success' || data?.success || actualData?.success)) {
        if (data?.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        throw new Error(actualData?.error || data?.error || 'Failed to submit registration.');
      }

      const catVal = formData.category;
      setRegisteredCategory(catVal);

      // Next.js API proxy sometimes wraps the backend response in an extra 'data' object.
      // So the actual record might be in actualData.data
      const resultData = actualData?.data || actualData;
      const extractedReference = resultData?.referenceNumber || resultData?.reference || resultData?.registrationId || resultData?.applicationNumber || actualData?.referenceNumber || '';

              const record = {
          participationScope: formData.participationScope,
          institutionName: formData.institutionName,
          category: catVal,
          representativeName: formData.representativeName,
          designation: formData.designation,
          districtCity: formData.districtCity,
          country: locationMode === "INTERNATIONAL" ? formData.country : "India",
          stateProvince: formData.stateProvince,
          operationalCoverage: formData.operationalCoverage,
          locationType: locationMode,
          email: formData.email,
          website: formData.website,
          participationTypes: formData.participationTypes
        };
      setSuccessData({ ...record, referenceNumber: extractedReference, status: 'SUBMITTED' });

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('skc_registered_profile', JSON.stringify({
          fullName: formData.representativeName || '',
          organization: formData.institutionName || '',
          category: catVal || '',
          designation: formData.designation || '',
          district: formData.districtCity || '',
          email: formData.email || '',
          website: formData.website || '',
          referenceNumber: extractedReference
        }));
      }

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('skc_form_dirty');
        sessionStorage.setItem('skc_institution_success_data', JSON.stringify(record));
      }

      setStatus('success');
      setMessage(`Organization registered successfully! Reference Number: ${extractedReference}`);
      
      // Reset form
              setFormData({
          participationScope: '',
          institutionName: '', category: '', representativeName: '', designation: '', 
          districtCity: '', country: 'India', stateProvince: '', operationalCoverage: '', email: '', website: '', participationTypes: '', 
          phone: '',
          authConsent: true, privacyConsent: true, publicDirectoryConsent: true, communicationsConsent: true
        });
      
    } catch (err: any) {
      setStatus('error');
      if (err.name === 'AbortError') {
        setMessage('Registration could not be completed because the server did not respond. Your information has not been lost. Please try again.');
      } else {
        setMessage(err.message || 'An unexpected error occurred.');
      }
    } finally {
      window.clearTimeout(timeoutId);
      // Ensure we don't stay stuck on submitting if something weird happens
      setStatus((current) => current === 'submitting' ? 'error' : current);
    }
  };

  const getInstitutionRoleSlug = (cat: string) => {
    if (cat === 'Government Department') return 'government-department';
    if (cat === 'University') return 'university-academic-institution';
    return 'civil-society-organization';
  };

  const handleCopyReference = async () => {
    if (!successData?.referenceNumber) return;

    try {
      await navigator.clipboard.writeText(successData.referenceNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Provide a visible fallback error
      alert("Clipboard access denied. Please copy the reference number manually.");
    }
  };

  const handleDownload = () => {
    if (!successData) return;
    const content = `HAMADAN CRAFT REVIVAL FOUNDATION
STATE OF KASHMIR CRAFTS — CURRENT ASSESSMENT 2026-27

STAKEHOLDER REGISTRATION CONFIRMATION

Reference Number: ${successData.referenceNumber}
Registration Type: Institution
Stakeholder Role: ${successData.category}
Name: ${successData.representativeName}
Organization: ${successData.institutionName || 'N/A'}
Submission Date: ${new Date().toLocaleString()}
Status: Received

Please retain this confirmation for future correspondence and participation tracking.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SKC-Stakeholder-Confirmation-${successData.referenceNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (status === 'success' && successData) {
    const {
      referenceNumber,
      participationScope,
      institutionName,
      category,
      representativeName,
      designation,
      districtCity,
      country,
      locationType,
      email,
      website,
      participationTypes
    } = successData;

    const roleSlug = getInstitutionRoleSlug(category);

    if (!successData?.referenceNumber) {
      return (
        <div className="flex flex-col items-center justify-center p-12">
          <FaSpinner className="animate-spin text-4xl text-[#6B2A08] mb-4" />
          <p className="text-gray-500 font-bold">Processing registration...</p>
        </div>
      );
    }

    return (
      <section id="stakeholder-confirmation" className="space-y-8 animate-fadeIn text-gray-800">
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #stakeholder-confirmation,
            #stakeholder-confirmation * {
              visibility: visible;
            }
            #stakeholder-confirmation {
              position: absolute;
              inset: 0;
              width: 100%;
              padding: 32px;
              background: white;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-2">
            <FaCheckCircle className="text-4xl" />
          </div>
          <h2 className="text-3xl font-black text-brand-dark tracking-tight">Institutional Profile Submitted Successfully</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm leading-relaxed">
            Thank you for registering {institutionName}'s participation in the State of Kashmir Crafts Assessment 2026.
            The institutional profile has been received and recorded successfully.
          </p>
        </div>

        {/* Reference Number Panel */}
        <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-6 text-center space-y-4 max-w-lg mx-auto shadow-sm">
          <div>
            <span className="text-xs font-black tracking-widest text-amber-800 uppercase block mb-1">REFERENCE NUMBER</span>
            <p className="text-2xl font-bold tracking-wider text-[#6B2A08]">
              {successData?.referenceNumber}
            </p>
          </div>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            Please save this reference number for future correspondence and participation tracking.
          </p>
          <div className="flex flex-wrap gap-2 justify-center pt-2 no-print">
            <button
              type="button"
              onClick={handleCopyReference}
              disabled={!successData?.referenceNumber}
              aria-label={`Copy reference number ${successData?.referenceNumber}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-xs font-bold text-gray-600 rounded-lg hover:bg-gray-50 hover:text-brand-primary transition shadow-sm font-semibold"
            >
              <FaCopy /> {copied ? 'Copied' : 'Copy Reference'}
            </button>
            <button
              type="button"
              onClick={() => typeof window !== 'undefined' && window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-xs font-bold text-gray-600 rounded-lg hover:bg-gray-50 hover:text-brand-primary transition shadow-sm font-semibold"
            >
              <FaPrint /> Print Confirmation
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-xs font-bold text-gray-600 rounded-lg hover:bg-gray-50 hover:text-brand-primary transition shadow-sm font-semibold"
            >
              <FaDownload /> Download
            </button>
          </div>
        </div>

        {/* Summary Block */}
        <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h4 className="font-bold text-gray-900 text-sm tracking-wide uppercase">Institutional Submission Summary</h4>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1 col-span-2">
              <span className="text-xs font-bold text-gray-400 uppercase block">Institution Name</span>
              <span className="font-bold text-gray-800 text-base">{institutionName}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase block">Institution Type</span>
              <span className="font-bold text-gray-800">{category}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase block">Representative Name</span>
              <span className="font-bold text-gray-800">{representativeName} ({designation})</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase block">{successData?.locationType === 'KASHMIR_DISTRICT' ? 'District' : 'Location'}</span>
                <span className="font-bold text-gray-800">{successData?.locationType === 'KASHMIR_DISTRICT' ? successData?.districtCity : (successData?.country || 'International')}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase block">Participation Scope</span>
              <span className="font-bold text-gray-800">
                {participationScope === 'BOTH' ? 'Both KHCRF and State of Kashmir Crafts' : participationScope === 'SKC' ? 'State of Kashmir Crafts Assessment' : 'Hamadan Craft Revival Foundation'}
              </span>
            </div>
            {participationTypes && (
              <div className="space-y-1 col-span-2 border-t border-gray-100 pt-3">
                <span className="text-xs font-bold text-gray-400 uppercase block">Interests / Proposed Contributions</span>
                <p className="text-gray-700 font-medium leading-relaxed mt-1 whitespace-pre-wrap">{participationTypes}</p>
              </div>
            )}
            <div className="space-y-1 md:col-span-2 border-t border-gray-100 pt-3 flex justify-between items-center text-xs text-gray-400 font-medium">
              <span>Submitted via Institutional Registry</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Personalized Message block */}
        <div className="bg-[#6B2A08]/5 border border-[#6B2A08]/20 rounded-2xl p-6 space-y-4 no-print">
          <h4 className="font-black text-brand-dark text-base">Recommended Institutional Next Steps</h4>
          <p className="text-sm text-gray-700 leading-relaxed font-medium">
            Your institutional profile is under review by the Assessment Secretariat. Please check your registration status before accessing specific participation modes.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={`/state-of-kashmir-crafts/participate`}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-primary text-white font-black rounded-xl hover:bg-brand-secondary transition shadow-md text-sm uppercase tracking-wider font-bold"
            >
              View Registration Status
            </a>
          </div>
        </div>

        {/* Scope routing */}
        <div className="pt-6 border-t border-gray-200 space-y-4 no-print">
          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Ecosystem Integration Pathways</h4>
          {participationScope === 'BOTH' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col justify-between gap-4">
                <div>
                  <h5 className="font-bold text-gray-900 text-sm">Continue with KHCRF Engagement</h5>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Access local chapter campaigns, explore policy lobbying, and discover membership benefits.
                  </p>
                </div>
                <div>
                  <a href="/about/memberships/join" className="inline-flex px-4 py-2 bg-white border border-gray-300 text-gray-700 font-bold text-xs rounded-lg hover:bg-gray-50 hover:text-brand-primary transition uppercase tracking-wider shadow-sm font-bold">
                    Explore KHCRF Membership
                  </a>
                </div>
              </div>
              <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col justify-between gap-4">
                <div>
                  <h5 className="font-bold text-gray-900 text-sm">Continue with State of Kashmir Crafts Participation</h5>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Your stakeholder profile has been registered successfully and is now awaiting Secretariat verification. Once approved, you will receive access to the participation pathways associated with your stakeholder category and selected participation modes.
                  </p>
                  <div className="mt-2 text-xs font-bold text-amber-700">Current status: Pending Verification</div>
                </div>
                <div>
                  <a href="/state-of-kashmir-crafts/participate" className="inline-flex px-4 py-2 bg-[#6B2A08] text-white font-bold text-xs rounded-lg hover:bg-brand-secondary transition uppercase tracking-wider shadow-sm font-bold">
                    View Registration Status
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h5 className="font-bold text-gray-900 text-sm">Return to Assessment Overview</h5>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Track upcoming draft releases, read current field reports, and browse the public documents archive.
                </p>
              </div>
              <a href="/state-of-kashmir-crafts" className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 hover:text-brand-primary transition shrink-0 uppercase tracking-wider font-bold">
                Return to Overview
              </a>
            </div>
          )}
        </div>

        {/* Action Panel Footer */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center no-print">
          <button
            type="button"
            onClick={() => { 
              setStatus('idle'); 
              setSuccessData(null); 
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('skc_institution_success_data');
              }
            }}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-brand-primary transition text-sm font-bold"
          >
            Register Another Institution
          </button>
          <a
            href="/state-of-kashmir-crafts"
            className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition text-sm text-center font-bold"
          >
            Return to Assessment Home
          </a>
        </div>
      </section>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3">
          <FaExclamationTriangle className="text-red-500 mt-1 shrink-0" />
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      {/* ── SCOPE ── */}
      <div>
        <h3 className="text-base font-black text-gray-900 mb-1">Participation Scope <span className="text-red-500">*</span></h3>
        <p className="text-sm text-gray-500 mb-4">Select the institutional programme(s) you wish to participate in.</p>
        <div className="space-y-3">
          {[
            { value: "KHCRF", label: "Hamadan Craft Revival Foundation (KHCRF)", desc: "Institutional registry, partnership, and membership portal." },
            { value: "SKC", label: "State of Kashmir Crafts Assessment 2026", desc: "Official institutional participation and consultation registry." },
            { value: "BOTH", label: "Both KHCRF and State of Kashmir Crafts", desc: "Participate across both ecosystems through a single unified registration." }
          ].map(opt => (
            <label key={opt.value} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${formData.participationScope === opt.value ? "border-brand-primary bg-brand-primary/5" : "border-gray-200 hover:border-gray-300"}`}>
              <input type="radio" name="participationScope" value={opt.value} checked={formData.participationScope === opt.value} onChange={() => setFormData({...formData, participationScope: opt.value})} className="mt-1 accent-brand-primary" />
              <div>
                <p className="font-bold text-gray-900 text-sm">{opt.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
        {fieldErrors.participationScope && (
          <p className="text-red-600 text-xs font-bold mt-2">{fieldErrors.participationScope[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            
<label className="block text-sm font-bold text-gray-700 mb-2">
  {(formData.participationScope === 'KHCRF' && formData.category === 'Artisan / Workshop') ? 'Workshop / Enterprise Name' : 'Institution Name *'}
</label>
            
<input type="text" required={!(formData.participationScope === 'KHCRF' && formData.category === 'Artisan / Workshop')} value={formData.institutionName}
              onChange={e => setFormData({...formData, institutionName: e.target.value})}
              className={`w-full p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 ${fieldErrors.institutionName ? "border-red-500" : "border-gray-200"}`} 
            />
            {fieldErrors.institutionName && (
              <p className="text-red-600 text-xs font-bold mt-1">{fieldErrors.institutionName[0]}</p>
            )}
          </div>
          <div>
            
<label className="block text-sm font-bold text-gray-700 mb-2">
  {formData.participationScope === 'KHCRF' ? 'Partner Type *' : 'Institution Type *'}
</label>
            <select 
              required
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className={`w-full p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 ${fieldErrors.category ? "border-red-500" : "border-gray-200"}`}
            >
              <option value="">Select {formData.participationScope === 'KHCRF' ? 'Type' : 'Category'}</option>
              {(formData.participationScope === 'KHCRF' ? ['Artisan / Workshop', 'Craft Enterprise', 'Association / Cooperative', 'Retailer / Buyer', 'Distributor / Importer', 'Tourism / Hospitality', 'Technology Provider', 'University / Research Institution', 'Museum / Cultural Institution', 'NGO / Development Organization', 'Government Agency', 'CSR / Corporate Partner', 'Policy / Think Tank', 'Other'] : INSTITUTIONAL_CATEGORIES).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {fieldErrors.category && (
              <p className="text-red-600 text-xs font-bold mt-1">{fieldErrors.category[0]}</p>
            )}
          </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Representative *</label>
            <input 
              type="text" 
              required
              value={formData.representativeName}
              onChange={e => setFormData({...formData, representativeName: e.target.value})}
              className={`w-full p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 ${fieldErrors.representativeName ? "border-red-500" : "border-gray-200"}`} 
            />
            {fieldErrors.representativeName && (
              <p className="text-red-600 text-xs font-bold mt-1">{fieldErrors.representativeName[0]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Designation *</label>
            <input 
              type="text" 
              required
              value={formData.designation}
              onChange={e => setFormData({...formData, designation: e.target.value})}
              className={`w-full p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 ${fieldErrors.designation ? "border-red-500" : "border-gray-200"}`} 
            />
            {fieldErrors.designation && (
              <p className="text-red-600 text-xs font-bold mt-1">{fieldErrors.designation[0]}</p>
            )}
          </div>
          
            {locationMode === 'KASHMIR_DISTRICT' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">District *</label>
                <select 
                  required
                  value={formData.districtCity}
                  onChange={e => setFormData({...formData, districtCity: e.target.value})}
                  className={`w-full p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 ${fieldErrors.districtCity ? "border-red-500" : "border-gray-200"}`}
                >
                  <option value="">Select</option>
                  {KASHMIR_DISTRICT_NAMES.map((d: string) => <option key={d} value={d}>{d}</option>)}
                </select>
                {fieldErrors.districtCity && (
                  <p className="text-red-600 text-xs font-bold mt-1">{fieldErrors.districtCity[0]}</p>
                )}
              </div>
            )}
            
            {locationMode === 'INTERNATIONAL' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Country *</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                    placeholder="Enter country"
                    className="w-full p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Headquarters City</label>
                  <input
                    type="text"
                    value={formData.districtCity}
                    onChange={e => setFormData({...formData, districtCity: e.target.value})}
                    placeholder="City"
                    className="w-full p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 border-gray-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Operational Region</label>
                  <input
                    type="text"
                    value={formData.operationalCoverage}
                    onChange={e => setFormData({...formData, operationalCoverage: e.target.value})}
                    placeholder="E.g., South Asia, Europe, Global"
                    className="w-full p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 border-gray-200"
                  />
                </div>
              </>
            )}

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Official Email *</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className={`w-full p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 ${fieldErrors.email ? "border-red-500" : "border-gray-200"}`} 
            />
            {fieldErrors.email && (
              <p className="text-red-600 text-xs font-bold mt-1">{fieldErrors.email[0]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Website</label>
            <input 
              type="url" 
              value={formData.website}
              onChange={e => setFormData({...formData, website: e.target.value})}
              className={`w-full p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 ${fieldErrors.website ? "border-red-500" : "border-gray-200"}`} 
            />
            {fieldErrors.website && (
              <p className="text-red-600 text-xs font-bold mt-1">{fieldErrors.website[0]}</p>
            )}
          </div>
      </div>
      <div>
          
<label className="block text-sm font-bold text-gray-700 mb-2">
    {formData.participationScope === 'KHCRF' ? 'Areas of Ecosystem Interest' : 'Participation Interests'}
</label>
{formData.participationScope === 'KHCRF' ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
      {['Craftlore', 'Kashmir ArtStay', 'Offshore Integration', 'Purple Soul USA', 'DKC B2B Connect', 'Research & Policy Collaboration', 'Multiple Ecosystem Platforms'].map(interest => (
        <label key={interest} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition bg-white">
          <input 
            type="checkbox" 
            checked={formData.participationTypes.includes(interest)}
            onChange={(e) => {
              let current = formData.participationTypes.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
              if (e.target.checked) {
                if (!current.includes(interest)) current.push(interest);
              } else {
                current = current.filter(i => i !== interest);
              }
              setFormData({...formData, participationTypes: current.join(', ')});
            }}
            className="form-checkbox h-5 w-5 text-brand-primary rounded"
          />
          <span className="text-sm text-gray-700 font-medium">{interest}</span>
        </label>
      ))}
      <div className="col-span-1 sm:col-span-2 mt-2">
         <label className="block text-sm font-bold text-gray-700 mb-2">Other Contributions / Details</label>
         <textarea 
          rows={3} 
          value={formData.participationTypes}
          onChange={e => setFormData({...formData, participationTypes: e.target.value})}
          placeholder="Optional: Describe specific collaboration interests..."
          className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none"
        ></textarea>
      </div>
    </div>
) : (
    <textarea 
      rows={3} 
      value={formData.participationTypes}
      onChange={e => setFormData({...formData, participationTypes: e.target.value})}
      placeholder="E.g., Research Collaboration, Capacity Building..."
      className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none"
    ></textarea>
)}

      </div>
      <button 
        type="submit" 
        disabled={status === 'submitting'}
        className="w-full flex items-center justify-center gap-3 py-5 bg-brand-dark text-white font-black text-lg rounded-xl hover:bg-brand-secondary transition shadow-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? (
          <><FaSpinner className="animate-spin" /> Submitting...</>
        ) : 'Submit Institutional Profile'}
      </button>
    </form>
  );
}

export default function InstitutionRegistrationForm(props: Props) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading form...</div>}>
      <InstitutionRegistrationFormInner {...props} />
    </Suspense>
  );
}


