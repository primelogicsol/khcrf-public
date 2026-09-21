"use client";
import { getBaseUrlNoApi } from "@/lib/api";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaBuilding, FaClipboardList, FaCheckCircle, FaExclamationTriangle, FaDownload, FaEnvelope, FaSpinner, FaCopy, FaPrint, FaArrowRight, FaGlobe, FaChevronRight } from "react-icons/fa";
import { KASHMIR_DISTRICT_NAMES } from '@/lib/kashmir-districts';
import { INDIVIDUAL_CATEGORIES } from '@/lib/skc/participant-categories';

export default function StakeholderProfileForm({ initialCategory = "" }: { initialCategory?: string }) {
  const router = useRouter();
  
  

    interface FormData {
  participationScope: string;
  fullName: string;
  organization: string;
  category: string;
  designation: string;
  district: string;
  country: string;
  stateProvinceRegion: string;
  city: string;
  districtOfOrigin: string;
  locationType: string;
  craftSector: string;
  email: string;
  phone: string;
  website: string;
  consent: boolean;
}

  const [formData, setFormData] = useState<FormData>({
    participationScope: '',
    fullName: '',
    organization: '',
    category: initialCategory,
    designation: '',
    district: '',
    country: '',
    stateProvinceRegion: '',
    city: '',
    districtOfOrigin: '',
    locationType: '',
    craftSector: '',
    email: '',
    phone: '',
    website: '',
    consent: false
  });
  const locationMode = ["Diaspora Member"].includes(formData.category) ? "DIASPORA" :
                       ["International Buyer / Collector", "International Researcher", "International Organization / Development Agency", "International Museum / Cultural Institution"].includes(formData.category) ? "INTERNATIONAL" : 
                       "KASHMIR_DISTRICT";
  const [participationModes, setParticipationModes] = useState<string[]>([]);
  const [registeredCategory, setRegisteredCategory] = useState(initialCategory);
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [successData, setSuccessData] = useState<{
    referenceNumber: string;
    status: string;
    participationScope: string;
    fullName: string;
    organization: string;
    category: string;
    designation: string;
    district: string;
  country?: string;
  locationType?: string;
    craftSector: string;
    email: string;
    phone: string;
    website: string;
    participationModes: string[];
  } | null>(null);

  React.useEffect(() => {
    const isDirty = 
      formData.participationScope !== '' ||
      formData.fullName !== '' ||
      formData.organization !== '' ||
      formData.category !== '' ||
      formData.designation !== '' ||
      formData.district !== '' ||
      formData.craftSector !== '' ||
      formData.email !== '' ||
      formData.phone !== '' ||
      formData.website !== '' ||
      participationModes.length > 0;
      
    if (isDirty) {
      sessionStorage.setItem('skc_form_dirty', 'true');
    } else {
      sessionStorage.removeItem('skc_form_dirty');
    }
  }, [formData, participationModes]);

  // Restore success confirmation on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedSuccess = sessionStorage.getItem('skc_individual_success_data');
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
            fullName: parsed.fullName || prev.fullName,
            organization: parsed.organization || prev.organization,
            designation: parsed.designation || prev.designation,
            district: parsed.district || prev.district,
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
        fullName: formData.fullName,
        organization: formData.organization,
        designation: formData.designation,
        district: formData.district,
        email: formData.email,
        phone: formData.phone,
        website: formData.website
      };
      sessionStorage.setItem('skc_shared_registration_data', JSON.stringify(sharedData));
    }
  }, [formData]);


  const MODES = [
    "Online Survey", "Field Consultation", "Public Hearing",
    "Written Submission", "Expert Review", "Validation Review"
  ];

  const handleModeToggle = (mode: string) => {
    setParticipationModes(prev => 
      prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    
      if (locationMode === "KASHMIR_DISTRICT" && !formData.district) {
          setStatus('error');
          setMessage('Please select a district.');
          return;
      }
      if (["INTERNATIONAL", "DIASPORA"].includes(locationMode) && !formData.country) {
          setStatus('error');
          setMessage('Please select a country.');
          return;
      }
      if (!formData.participationScope || !formData.fullName || !formData.category || !formData.email || !formData.consent) {

        setStatus('error');
        setMessage('Please fill in all required fields (including Participation Scope) and accept the consent.');
        return;
    }

    setStatus('submitting');
    setMessage('');
    setFieldErrors({});

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20_000);

    try {
const API_BASE_URL = getBaseUrlNoApi();
      const res = await fetch(`/api/backend/skc/stakeholders/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          participationModes
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
        throw new Error(actualData?.error || data?.error || 'Failed to submit profile.');
      }

      const catVal = formData.category;
      setRegisteredCategory(catVal);

      // Next.js API proxy sometimes wraps the backend response in an extra 'data' object.
      // So the actual record might be in actualData.data
      const resultData = actualData?.data || actualData;
      const extractedReference = resultData?.referenceNumber || resultData?.reference || resultData?.registrationId || resultData?.applicationNumber || actualData?.referenceNumber || '';

      const record = {
        referenceNumber: extractedReference,
        status: resultData?.status || actualData?.status || 'SUBMITTED',
        participationScope: formData.participationScope,
        fullName: formData.fullName,
        organization: formData.organization,
        category: catVal,
        designation: formData.designation,
        district: formData.district,
        craftSector: formData.craftSector,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        participationModes: [...participationModes]
      };
      setSuccessData(record);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('skc_registered_profile', JSON.stringify({
          fullName: formData.fullName || '',
          organization: formData.organization || '',
          category: catVal || '',
          designation: formData.designation || '',
          district: formData.district || '',
          craftSector: formData.craftSector || '',
          email: formData.email || '',
          phone: formData.phone || '',
          website: formData.website || '',
          referenceNumber: extractedReference
        }));
      }

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('skc_form_dirty');
        sessionStorage.setItem('skc_individual_success_data', JSON.stringify(record));
      }

      setStatus('success');
      setMessage(`Profile created successfully! Reference Number: ${extractedReference}`);
      
      // Reset form
      setFormData({
        participationScope: '',
        fullName: '', organization: '', category: '', designation: '', 
        district: '',
      country: '',
      stateProvinceRegion: '',
      city: '',
      districtOfOrigin: '',
      locationType: '', craftSector: '', email: '', phone: '', website: '', consent: false
      });
      setParticipationModes([]);
      
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

  const getCategorySlug = (cat: string) => {
    if (!cat) return "citizen";
    if (cat === "Student / Scholar") return "student";
    if (cat === "University / Academic Institution") return "university-academic-institution";
    return cat.toLowerCase().replace(/ & /g, "-").replace(/ \/ /g, "-").replace(/ /g, "-");
  };

  const getPrimaryMode = (modes: string[]) => {
    if (modes.includes("Online Survey")) return "Online Survey";
    if (modes.includes("Written Submission")) return "Written Submission";
    if (modes.includes("Public Hearing")) return "Public Hearing";
    if (modes.includes("Field Consultation")) return "Field Consultation";
    if (modes.includes("Expert Review")) return "Expert Review";
    if (modes.includes("Validation Review")) return "Validation Review";
    return "General";
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
Registration Type: Individual
Stakeholder Role: ${successData.category}
Name: ${successData.fullName}
Organization: ${successData.organization || 'N/A'}
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

  const getWhatHappensNext = () => {
    if (!successData) return '';
    const parts = [
      `Your profile has been added to the stakeholder registry for the State of Kashmir Crafts Assessment 2026.`
    ];

    if (successData.craftSector || successData.district) {
      const craftPart = successData.craftSector ? ` ${successData.craftSector}` : '';
      const districtPart = successData.district ? ` ${successData.district} district` : (successData.country ? ` ${successData.country}` : '');
      const modePart = successData.participationModes.length > 0 ? ` ${successData.participationModes[0]}` : ' participation';

      parts.push(
        `Because you selected${craftPart}${districtPart ? ' and' + districtPart : ''}, and${modePart}, your profile may be considered for consultations, evidence review, or draft-finding validation related to these selections.`
      );
    }

    parts.push(
      `You will be contacted or notified where relevant, and you may also continue immediately to the participation portal to complete any currently active participation pathways.`
    );

    return parts.join(' ');
  };

  if (status === 'success' && successData) {
    const {
      referenceNumber,
      participationScope,
      fullName,
      organization,
      category,
      designation,
      district,
      craftSector,
      email,
      phone,
      website,
      participationModes: modes
    } = successData;

    const categorySlug = getCategorySlug(category);
    const primaryMode = getPrimaryMode(modes);
    const secondaryModes = modes.filter(m => m !== primaryMode);

    // Primary CTA and action info based on priority
    let primaryCtaLabel = "View Registration Status";
    let primaryCtaUrl = `/state-of-kashmir-crafts/participate`;
    let modeDescription = "Your profile is under review by the Assessment Secretariat. Please check your registration status before accessing specific participation modes.";

    if (!successData?.referenceNumber) {
      return (
        <div className="flex flex-col items-center justify-center p-12">
          <FaSpinner data-ui-icon  className="animate-spin text-4xl  mb-4" />
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
          <h2 className="text-3xl font-black text-brand-dark tracking-tight">Stakeholder Profile Submitted Successfully</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm leading-relaxed">
            Thank you for registering your interest in the State of Kashmir Crafts Assessment 2026.
            Your stakeholder profile has been received and recorded successfully.
          </p>
        </div>

        {/* Reference Number Panel */}
        <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-6 text-center space-y-4 max-w-lg mx-auto shadow-sm">
          <div>
            <span className="text-xs font-black tracking-widest text-amber-800 uppercase block mb-1">REFERENCE NUMBER</span>
            <p className="text-2xl font-bold tracking-wider text-brand-primary">
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
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-xs font-bold text-gray-600 rounded-lg hover:bg-gray-50 hover:text-brand-primary transition shadow-sm"
            >
              <FaCopy /> {copied ? 'Copied' : 'Copy Reference'}
            </button>
            <button
              type="button"
              onClick={() => typeof window !== 'undefined' && window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-xs font-bold text-gray-600 rounded-lg hover:bg-gray-50 hover:text-brand-primary transition shadow-sm"
            >
              <FaPrint /> Print Confirmation
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-xs font-bold text-gray-600 rounded-lg hover:bg-gray-50 hover:text-brand-primary transition shadow-sm"
            >
              <FaDownload /> Download
            </button>
          </div>
        </div>

        {/* Summary Block */}
        <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h4 className="font-bold text-gray-900 text-sm tracking-wide uppercase">Submission Summary</h4>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase block">Participation Scope</span>
              <span className="font-bold text-gray-800">
                {participationScope === 'BOTH' ? 'Both KHCRF and State of Kashmir Crafts' : participationScope === 'SKC' ? 'State of Kashmir Crafts Assessment' : 'Hamadan Craft Revival Foundation'}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase block">Stakeholder Category</span>
              <span className="font-bold text-gray-800">{category}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase block">{formData.locationType === 'KASHMIR_DISTRICT' ? 'District' : 'Location'}</span>
                <span className="font-bold text-gray-800">{formData.locationType === 'KASHMIR_DISTRICT' ? formData.district : (formData.country || 'International')}</span>
            </div>
            {craftSector && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase block">Craft Sector</span>
                <span className="font-bold text-gray-800">{craftSector}</span>
              </div>
            )}
            {organization && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase block">Organization</span>
                <span className="font-bold text-gray-800">{organization}</span>
              </div>
            )}
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase block">Preferred Participation Modes</span>
              <span className="font-bold text-gray-800">{modes.join(', ') || 'General'}</span>
            </div>
            <div className="space-y-1 md:col-span-2 border-t border-gray-100 pt-3 flex justify-between items-center text-xs text-gray-400 font-medium">
              <span>Submitted via Unified Portal</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Personalized Message block */}
        <div className="bg-[#6B2A08]/5 border border-[#6B2A08]/20 rounded-2xl p-6 space-y-4 no-print">
          <h4 className="font-black text-brand-dark text-base">Recommended Next Step</h4>
          <p className="text-sm text-gray-700 leading-relaxed font-medium">
            {modeDescription}
          </p>
          <div className="pt-2">
            <a
              href={primaryCtaUrl}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-primary text-white font-black rounded-xl hover:bg-brand-secondary transition shadow-md text-sm uppercase tracking-wider font-bold"
            >
              {primaryCtaLabel} <FaArrowRight />
            </a>
          </div>
        </div>

        {/* Secondary options if multiple selected */}
        {secondaryModes.length > 0 && (
          <div className="space-y-3 no-print">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Other Selected Modes & Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {secondaryModes.map(mode => {
                let label = "Explore participation options";
                let url = `/state-of-kashmir-crafts/participate?type=${categorySlug}`;
                if (mode === "Written Submission") {
                  label = "Submit evidence / document";
                  url = `/state-of-kashmir-crafts/participate?type=${categorySlug}&mode=written`;
                } else if (mode === "Public Hearing") {
                  label = "View public hearing slots";
                  url = `/state-of-kashmir-crafts/participate?type=${categorySlug}&mode=hearing`;
                } else if (mode === "Expert Review") {
                  label = "Access expert review info";
                  url = `/state-of-kashmir-crafts/participate?type=${categorySlug}&mode=expert`;
                } else if (mode === "Validation Review") {
                  label = "Access validation briefs";
                  url = `/state-of-kashmir-crafts/participate?type=${categorySlug}&mode=validation`;
                } else if (mode === "Field Consultation") {
                  label = "Explore consultation guidelines";
                  url = `/state-of-kashmir-crafts/participate?type=${categorySlug}&mode=consultation`;
                }
                return (
                  <div key={mode} className="p-4 border border-gray-200 rounded-xl bg-white flex justify-between items-center shadow-sm">
                    <div>
                      <span className="text-xs font-bold text-gray-400 block uppercase">Mode: {mode}</span>
                      <span className="text-sm font-bold text-gray-700">{label}</span>
                    </div>
                    <a href={url} className="text-icon-on-light hover:text-brand-secondary transition p-2 hover:bg-brand-primary/5 rounded-lg">
                      <FaChevronRight className="text-sm" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Scope routing */}
        <div className="pt-6 border-t border-gray-200 space-y-4 no-print">
          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Ecosystem Integration Pathways</h4>
          {participationScope === 'KHCRF' && (
            <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h5 className="font-bold text-gray-900 text-sm">Hamadan Craft Revival Foundation (KHCRF)</h5>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Your registry allows KHCRF to contact you regarding artisan rights advocacy, global campaigns, and membership pathways.
                </p>
              </div>
              <a href="/about/memberships/join" className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 hover:text-brand-primary transition shrink-0 uppercase tracking-wider font-bold">
                Explore Membership
              </a>
            </div>
          )}
          {participationScope === 'SKC' && (
            <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h5 className="font-bold text-gray-900 text-sm">Continue with State of Kashmir Crafts Participation</h5>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Your stakeholder profile has been registered successfully and is now awaiting Secretariat verification. Once approved, you will receive access to the participation pathways associated with your stakeholder category and selected participation modes.
                </p>
                <div className="mt-2 text-xs font-bold text-amber-700">Current status: Pending Verification</div>
              </div>
              <a href="/state-of-kashmir-crafts/participate" className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 hover:text-brand-primary transition shrink-0 uppercase tracking-wider font-bold">
                View Registration Status
              </a>
            </div>
          )}
          {participationScope === 'BOTH' && (
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
          )}
        </div>

        {/* Dynamic What Happens Next Narrative */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-2 no-print">
          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">What Happens Next</h4>
          <p className="text-xs text-gray-600 leading-relaxed font-medium">
            {getWhatHappensNext()}
          </p>
        </div>

        {/* Email confirmation message */}
        {email && (
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 font-semibold bg-gray-100 px-4 py-2 rounded-lg no-print">
            <FaEnvelope className="text-gray-400" />
            Confirmation email dispatched to <span className="text-gray-700 font-bold">{email}</span>
          </div>
        )}

        {/* Action Panel Footer */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center no-print">
          <button
            type="button"
            onClick={() => { 
              setStatus('idle'); 
              setSuccessData(null); 
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('skc_individual_success_data');
              }
            }}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-[#6B2A08] transition text-sm font-bold"
          >
            Register Another Stakeholder
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
        <p className="text-sm text-gray-500 mb-4">Select the programme(s) you wish to participate in.</p>
        <div className="space-y-3">
          {[
            { value: "KHCRF", label: "Hamadan Craft Revival Foundation (KHCRF)", desc: "Individual registry, partnership, and membership portal." },
            { value: "SKC", label: "State of Kashmir Crafts Assessment 2026", desc: "Official individual participation and consultation registry." },
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
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
            <input 
              type="text" 
              required
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
              className={`w-full p-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 ${fieldErrors.fullName ? "border-red-500" : "border-gray-200"}`} 
            />
            {fieldErrors.fullName && (
              <p className="text-red-600 text-xs font-bold mt-1">{fieldErrors.fullName[0]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Organization</label>
            <input 
              type="text" 
              value={formData.organization}
              onChange={e => setFormData({...formData, organization: e.target.value})}
              className={`w-full p-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 ${fieldErrors.organization ? "border-red-500" : "border-gray-200"}`} 
            />
            {fieldErrors.organization && (
              <p className="text-red-600 text-xs font-bold mt-1">{fieldErrors.organization[0]}</p>
            )}
          </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Stakeholder Category *</label>
            <select 
              required
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className={`w-full p-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 ${fieldErrors.category ? "border-red-500" : "border-gray-200"}`}
            >
              <option value="">Select Category</option>
              {INDIVIDUAL_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {fieldErrors.category && (
              <p className="text-red-600 text-xs font-bold mt-1">{fieldErrors.category[0]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Designation</label>
            <input 
              type="text" 
              value={formData.designation}
              onChange={e => setFormData({...formData, designation: e.target.value})}
              className={`w-full p-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 ${fieldErrors.designation ? "border-red-500" : "border-gray-200"}`} 
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
                  value={formData.district}
                  onChange={e => setFormData({...formData, district: e.target.value})}
                  className={`w-full p-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 ${fieldErrors.district ? "border-red-500" : "border-gray-200"}`}
                >
                  <option value="">Select</option>
                  {KASHMIR_DISTRICT_NAMES.map((d: string) => <option key={d}>{d}</option>)}
                </select>
                {fieldErrors.district && (
                  <p className="text-red-600 text-xs font-bold mt-1">{fieldErrors.district[0]}</p>
                )}
              </div>
            )}
            
            {['INTERNATIONAL', 'DIASPORA'].includes(locationMode) && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {locationMode === 'DIASPORA' ? 'Current Country of Residence *' : 'Country *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                    placeholder="Enter country"
                    className="w-full p-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">State / Province / Region</label>
                  <input
                    type="text"
                    value={formData.stateProvinceRegion}
                    onChange={e => setFormData({...formData, stateProvinceRegion: e.target.value})}
                    placeholder="Optional"
                    className="w-full p-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    placeholder="Optional"
                    className="w-full p-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 border-gray-200"
                  />
                </div>
              </>
            )}

            {locationMode === 'DIASPORA' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kashmir District of Origin</label>
                <select 
                  value={formData.districtOfOrigin}
                  onChange={e => setFormData({...formData, districtOfOrigin: e.target.value})}
                  className="w-full p-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 border-gray-200"
                >
                  <option value="">Select (Optional)</option>
                  {KASHMIR_DISTRICT_NAMES.map((d: string) => <option key={d}>{d}</option>)}
                </select>
              </div>
            )}

      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Craft Sector</label>
            <input 
              type="text" 
              value={formData.craftSector}
              onChange={e => setFormData({...formData, craftSector: e.target.value})}
              className={`w-full p-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 ${fieldErrors.craftSector ? "border-red-500" : "border-gray-200"}`} 
            />
            {fieldErrors.craftSector && (
              <p className="text-red-600 text-xs font-bold mt-1">{fieldErrors.craftSector[0]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className={`w-full p-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 ${fieldErrors.email ? "border-red-500" : "border-gray-200"}`} 
            />
            {fieldErrors.email && (
              <p className="text-red-600 text-xs font-bold mt-1">{fieldErrors.email[0]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className={`w-full p-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 ${fieldErrors.phone ? "border-red-500" : "border-gray-200"}`} 
            />
            {fieldErrors.phone && (
              <p className="text-red-600 text-xs font-bold mt-1">{fieldErrors.phone[0]}</p>
            )}
          </div>
      </div>
      <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Website (optional)</label>
          <input 
            type="url" 
            value={formData.website}
            onChange={e => setFormData({...formData, website: e.target.value})}
            className={`w-full p-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 ${fieldErrors.website ? "border-red-500" : "border-gray-200"}`} 
          />
          {fieldErrors.website && (
            <p className="text-red-600 text-xs font-bold mt-1">{fieldErrors.website[0]}</p>
          )}
      </div>
      
      <div className="pt-6 border-t border-gray-100">
          <label className="block text-sm font-bold text-gray-900 mb-4">Preferred Participation Mode</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {MODES.map((mode: string) => (
                <label key={mode} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-brand-primary/5 transition">
                  <input 
                    type="checkbox" 
                    checked={participationModes.includes(mode)}
                    onChange={() => handleModeToggle(mode)}
                    className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" 
                  />
                  <span className="text-sm font-bold text-gray-700">{mode}</span>
                </label>
            ))}
          </div>
      </div>

      <div className="pt-6">
          <label className="flex items-start gap-3 p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl cursor-pointer">
            <input 
              type="checkbox" 
              required
              checked={formData.consent}
              onChange={e => setFormData({...formData, consent: e.target.checked})}
              className="w-5 h-5 mt-0.5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" 
            />
            <span className="text-sm font-medium text-gray-700 leading-snug">
              I consent to joining the Stakeholder Registry. I understand my information is used for assessment purposes and my public visibility is optional.
            </span>
          </label>
      </div>

      <button 
        type="submit" 
        disabled={status === 'submitting'}
        className="w-full flex items-center justify-center gap-3 py-5 bg-brand-primary text-white font-black text-lg rounded-xl hover:bg-brand-secondary transition shadow-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? (
          <><FaSpinner className="animate-spin" /> Submitting...</>
        ) : 'Submit Stakeholder Profile'}
      </button>
    </form>
  );
}
