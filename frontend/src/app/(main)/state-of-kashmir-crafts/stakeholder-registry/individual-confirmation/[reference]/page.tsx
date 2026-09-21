"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FaCheckCircle, FaExclamationTriangle, FaCopy, FaPrint, 
  FaDownload, FaArrowRight, FaEnvelope, FaChevronRight, FaSpinner 
} from 'react-icons/fa';

interface StakeholderData {
  referenceNumber: string;
  fullName: string;
  organization: string | null;
  category: string;
  designation: string | null;
  district: string;
  craftSector: string | null;
  email: string;
  phone: string | null;
  website: string | null;
  participationModes: string[];
  participationScope: string;
  status: string;
  submittedAt: string;
}

export default function IndividualConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const reference = params?.reference as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<StakeholderData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!reference || !reference.startsWith('SKC-STK-')) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    fetch(`/api/backend/skc/stakeholders/reference/${reference}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(resData => {
        if (resData.success && resData.data) {
          setData(resData.data);
          
          // Prefill participation portal session cache
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('skc_registered_profile', JSON.stringify({
              fullName: resData.data.fullName || '',
              organization: resData.data.organization || '',
              category: resData.data.category || '',
              designation: resData.data.designation || '',
              district: resData.data.district || '',
              email: resData.data.email || '',
              website: resData.data.website || '',
              referenceNumber: resData.data.referenceNumber || ''
            }));
          }
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [reference]);

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

  const handleCopy = () => {
    if (data?.referenceNumber) {
      navigator.clipboard.writeText(data.referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!data) return;
    const content = `STATE OF KASHMIR CRAFTS ASSESSMENT 2026
STAKEHOLDER REGISTRATION CONFIRMATION

Reference Number: ${data.referenceNumber}
Status: ${data.status}
Submitted On: ${new Date(data.submittedAt).toLocaleString()}

STAKEHOLDER DETAILS:
Name: ${data.fullName}
Organization: ${data.organization || 'None'}
Category: ${data.category}
Designation: ${data.designation || 'None'}
District: ${data.district}
Craft Sector: ${data.craftSector || 'None'}
Email: ${data.email}
Phone: ${data.phone || 'None'}
Website: ${data.website || 'None'}

PARTICIPATION INFORMATION:
Scope: ${data.participationScope === 'BOTH' ? 'Both KHCRF and State of Kashmir Crafts' : data.participationScope === 'SKC' ? 'State of Kashmir Crafts Assessment' : 'Hamadan Craft Revival Foundation'}
Preferred Modes: ${data.participationModes.join(', ') || 'General'}

Thank you for registering. Please retain this reference number for your records.
Hamadan Craft Revival Foundation - Kashmir.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SKC-Stakeholder-Confirmation-${data.referenceNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getWhatHappensNext = () => {
    if (!data) return '';
    const parts = [
      `Your profile has been added to the stakeholder registry for the State of Kashmir Crafts Assessment 2026.`
    ];

    if (data.craftSector || data.district) {
      const craftPart = data.craftSector ? ` ${data.craftSector}` : '';
      const districtPart = data.district ? ` ${data.district} district` : '';
      const modePart = data.participationModes.length > 0 ? ` ${data.participationModes[0]}` : ' participation';

      parts.push(
        `Because you selected${craftPart}${districtPart ? ' and' + districtPart : ''}, and${modePart}, your profile may be considered for consultations, evidence review, or draft-finding validation related to these selections.`
      );
    }

    parts.push(
      `You will be contacted or notified where relevant, and you may also continue immediately to the participation portal to complete any currently active participation pathways.`
    );

    return parts.join(' ');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <FaSpinner data-ui-icon  className="animate-spin text-4xl " />
        <p className="text-sm text-gray-500 font-semibold">Loading registration confirmation details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-red-200 rounded-3xl text-center shadow-lg space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600">
          <FaExclamationTriangle className="text-3xl" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Confirmation Not Available</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          The requested stakeholder registration reference is either invalid, belongs to a different registration path, or is not available for public viewing.
        </p>
        <a href="/state-of-kashmir-crafts/stakeholder-registry" className="inline-block px-6 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition text-sm font-semibold">
          Return to Registry Selection
        </a>
      </div>
    );
  }

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
    participationModes: modes,
    submittedAt
  } = data;

  const categorySlug = getCategorySlug(category);
  const primaryMode = getPrimaryMode(modes);
  const secondaryModes = modes.filter(m => m !== primaryMode);

  // Primary CTA and action info based on priority
  let primaryCtaLabel = "Continue to Participation Portal";
  let primaryCtaUrl = `/state-of-kashmir-crafts/participate?type=${categorySlug}`;
  let modeDescription = "You can proceed to participate across various platforms in the portal.";

  if (primaryMode === "Online Survey") {
    primaryCtaLabel = "Proceed to Online Participation Survey";
    primaryCtaUrl = `/state-of-kashmir-crafts/participate?type=${categorySlug}`;
    modeDescription = "You selected Online Survey as one of your preferred participation modes. You may now proceed directly to the online participation survey. Your stakeholder reference will be used to associate your survey responses with your registered profile.";
  } else if (primaryMode === "Written Submission") {
    primaryCtaLabel = "Submit Evidence or Written Contribution";
    primaryCtaUrl = `/state-of-kashmir-crafts/participate?type=${categorySlug}&mode=written`;
    modeDescription = "You selected Written Submission as a preferred participation mode. You may submit documentary evidence, observations, institutional records, data, photographs, reports, or policy recommendations through the participation portal.";
  } else if (primaryMode === "Public Hearing") {
    primaryCtaLabel = "View Public Hearing Opportunities";
    primaryCtaUrl = `/state-of-kashmir-crafts/participate?type=${categorySlug}&mode=hearing`;
    modeDescription = "You expressed interest in participating in a Public Hearing. Public hearing schedules and participation opportunities will be announced through the State of Kashmir Crafts participation portal. Your stakeholder profile may be considered for relevant hearing invitations.";
  } else if (primaryMode === "Field Consultation") {
    primaryCtaLabel = "Explore Field Consultation Tracks";
    primaryCtaUrl = `/state-of-kashmir-crafts/participate?type=${categorySlug}&mode=consultation`;
    modeDescription = "You selected Field Consultation as a preferred mode. The assessment team may contact you when a consultation relevant to your district, craft sector, or stakeholder category is scheduled.";
  } else if (primaryMode === "Expert Review") {
    primaryCtaLabel = "View Expert Participation Pathways";
    primaryCtaUrl = `/state-of-kashmir-crafts/participate?type=${categorySlug}&mode=expert`;
    modeDescription = "You selected Expert Review as a preferred participation mode. Expert-review opportunities are assigned according to subject relevance, professional background, stakeholder category, and the needs of the assessment cycle.";
  } else if (primaryMode === "Validation Review") {
    primaryCtaLabel = "Participate in Validation Review";
    primaryCtaUrl = `/state-of-kashmir-crafts/participate?type=${categorySlug}&mode=validation`;
    modeDescription = "You selected Validation Review as a preferred participation mode. Validation opportunities will become available when draft findings enter public and expert review stages.";
  }

  return (
    <div id="stakeholder-confirmation" className="max-w-[1080px] mx-auto px-4 py-16 space-y-8 animate-fadeIn text-gray-800">
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
            left: 0;
            top: 0;
            width: 100%;
            padding: 32px;
            background: white;
            margin: 0;
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
        <h2 className="text-3xl font-black text-brand-dark tracking-tight font-bold">Stakeholder Profile Submitted Successfully</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm leading-relaxed font-semibold">
          Thank you for registering your interest in the State of Kashmir Crafts Assessment 2026.
          Your stakeholder profile has been received and recorded successfully.
        </p>
      </div>

      {/* Reference Number Panel */}
      <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-6 text-center space-y-4 max-w-lg mx-auto shadow-sm">
        <div>
          <span className="text-xs font-black tracking-widest text-amber-800 uppercase block mb-1">REFERENCE NUMBER</span>
          <span className="font-mono text-3xl font-black text-brand-primary block tracking-wide select-all">{referenceNumber}</span>
        </div>
        <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
          Please save this reference number for future correspondence and participation tracking.
        </p>
        <div className="flex flex-wrap gap-2 justify-center pt-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-xs font-bold text-gray-600 rounded-lg hover:bg-gray-50 hover:text-brand-primary transition shadow-sm font-semibold"
          >
            <FaCopy /> {copied ? 'Copied!' : 'Copy Reference'}
          </button>
          <button
            onClick={() => typeof window !== 'undefined' && window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-xs font-bold text-gray-600 rounded-lg hover:bg-gray-50 hover:text-brand-primary transition shadow-sm font-semibold"
          >
            <FaPrint /> Print Confirmation
          </button>
          <button
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
          <h4 className="font-bold text-gray-900 text-sm tracking-wide uppercase">Submission Summary</h4>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase block">Full Name</span>
            <span className="font-bold text-gray-800">{fullName}</span>
          </div>
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
            <span className="text-xs font-bold text-gray-400 uppercase block">District</span>
            <span className="font-bold text-gray-800">{district}</span>
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
            <span>{new Date(submittedAt).toLocaleString()}</span>
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
                    <span className="text-xs font-bold text-gray-400 block uppercase font-semibold">Mode: {mode}</span>
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
              <h5 className="font-bold text-gray-900 text-sm">
                {participationScope === 'KHCRF' ? 'Hamadan Craft Revival Foundation (KHCRF)' : 'Continue with State of Kashmir Crafts Participation'}
              </h5>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {participationScope === 'KHCRF'
                  ? 'Your registry allows KHCRF to contact you regarding artisan rights advocacy, global campaigns, and membership pathways.'
                  : 'Your stakeholder profile has been registered successfully and is now awaiting Secretariat verification. Once approved, you will receive access to the participation pathways associated with your stakeholder category and selected participation modes.'}
              </p>
              {participationScope !== 'KHCRF' && (
                <div className="mt-2 text-xs font-bold text-amber-700">Current status: Pending Verification</div>
              )}
            </div>
            <a href={participationScope === 'KHCRF' ? "/about/memberships/join" : "/state-of-kashmir-crafts/participate"} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 hover:text-brand-primary transition shrink-0 uppercase tracking-wider font-bold">
              {participationScope === 'KHCRF' ? 'Explore Membership' : 'View Registration Status'}
            </a>
          </div>
        )}
      </div>

      {/* Dynamic What Happens Next Narrative */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-2 no-print">
        <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">What Happens Next</h4>
        <p className="text-xs text-gray-600 leading-relaxed font-semibold">
          {getWhatHappensNext()}
        </p>
      </div>

      {/* Action Panel Footer */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center no-print">
        <a
          href="/state-of-kashmir-crafts/stakeholder-registry?type=individual"
          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-[#6B2A08] transition text-sm text-center font-bold"
        >
          Register Another Individual
        </a>
        <a
          href="/state-of-kashmir-crafts"
          className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-200 transition text-sm text-center font-bold"
        >
          Return to Assessment Home
        </a>
      </div>
    </div>
  );
}
