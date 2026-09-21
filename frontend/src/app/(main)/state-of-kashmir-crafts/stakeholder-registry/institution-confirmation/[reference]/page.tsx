"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FaCheckCircle, FaExclamationTriangle, FaCopy, FaPrint, 
  FaDownload, FaSpinner 
} from 'react-icons/fa';

interface InstitutionData {
  referenceNumber: string;
  participationScope: string;
  institutionName: string;
  category: string;
  representativeName: string;
  designation: string;
  districtCity: string | null;
  email: string;
  website: string | null;
  participationTypes: string[];
  status: string;
  submittedAt: string;
}

export default function InstitutionConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const reference = params?.reference as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<InstitutionData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!reference || !reference.startsWith('SKC-INS-')) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    fetch(`/api/backend/skc/institutions/reference/${reference}`)
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
              fullName: resData.data.representativeName || '',
              organization: resData.data.institutionName || '',
              category: resData.data.category || '',
              designation: resData.data.designation || '',
              district: resData.data.districtCity || '',
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
INSTITUTIONAL REGISTRATION CONFIRMATION

Reference Number: ${data.referenceNumber}
Status: ${data.status}
Submitted On: ${new Date(data.submittedAt).toLocaleString()}

ORGANIZATION DETAILS:
Institution Name: ${data.institutionName}
Institution Type: ${data.category}
Representative: ${data.representativeName}
Designation: ${data.designation}
District: ${data.districtCity || 'None'}
Official Email: ${data.email}
Website: ${data.website || 'None'}
Interests: ${data.participationTypes.join(', ') || 'None'}

PARTICIPATION INFORMATION:
Scope: ${data.participationScope === 'BOTH' ? 'Both KHCRF and State of Kashmir Crafts' : data.participationScope === 'SKC' ? 'State of Kashmir Crafts Assessment' : 'Hamadan Craft Revival Foundation'}

Thank you for registering. Please retain this reference number for your records.
Hamadan Craft Revival Foundation - Kashmir.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SKC-Institution-Confirmation-${data.referenceNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
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
          The requested institutional registration reference is either invalid, belongs to a different registration path, or is not available for public viewing.
        </p>
        <a href="/state-of-kashmir-crafts/stakeholder-registry" className="inline-block px-6 py-3 bg-[#6B2A08] text-white font-bold rounded-xl hover:bg-brand-secondary transition text-sm font-semibold">
          Return to Registry Selection
        </a>
      </div>
    );
  }

  const {
    referenceNumber,
    participationScope,
    institutionName,
    category,
    representativeName,
    designation,
    districtCity,
    email,
    website,
    participationTypes,
    submittedAt
  } = data;

  const getInstitutionRoleSlug = (cat: string) => {
    if (cat === 'Government Department') return 'government-department';
    if (cat === 'University') return 'university-academic-institution';
    return 'civil-society-organization';
  };

  const roleSlug = getInstitutionRoleSlug(category);

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
        <h2 className="text-3xl font-black text-brand-dark tracking-tight font-bold">Institutional Profile Submitted Successfully</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm leading-relaxed font-semibold">
          Thank you for registering your institution in the State of Kashmir Crafts Assessment 2026.
          Your institutional profile has been received and recorded successfully.
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
          {districtCity && (
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase block">District</span>
              <span className="font-bold text-gray-800">{districtCity}</span>
            </div>
          )}
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase block">Participation Scope</span>
            <span className="font-bold text-gray-800">
              {participationScope === 'BOTH' ? 'Both KHCRF and State of Kashmir Crafts' : participationScope === 'SKC' ? 'State of Kashmir Crafts Assessment' : 'Hamadan Craft Revival Foundation'}
            </span>
          </div>
          {participationTypes.length > 0 && (
            <div className="space-y-1 col-span-2 border-t border-gray-100 pt-3">
              <span className="text-xs font-bold text-gray-400 uppercase block font-semibold">Interests / Proposed Contributions</span>
              <p className="text-gray-700 font-medium leading-relaxed mt-1 whitespace-pre-wrap">{participationTypes.join(', ')}</p>
            </div>
          )}
          <div className="space-y-1 md:col-span-2 border-t border-gray-100 pt-3 flex justify-between items-center text-xs text-gray-400 font-medium">
            <span>Submitted via Institutional Registry</span>
            <span>{new Date(submittedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Personalized Message block */}
      <div className="bg-[#6B2A08]/5 border border-[#6B2A08]/20 rounded-2xl p-6 space-y-4 no-print">
        <h4 className="font-black text-brand-dark text-base">Recommended Institutional Next Steps</h4>
        <p className="text-sm text-gray-700 leading-relaxed font-medium">
          Your institution is registered. You may continue to complete the institutional survey and submit documentary evidence.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={`/state-of-kashmir-crafts/participate?type=${roleSlug}`}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-primary text-white font-black rounded-xl hover:bg-brand-secondary transition shadow-md text-sm uppercase tracking-wider font-bold"
          >
            Continue to Institutional Participation
          </a>
          <a
            href={`/state-of-kashmir-crafts/participate?type=${roleSlug}&mode=evidence`}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-gray-300 text-gray-700 font-black rounded-xl hover:bg-gray-50 hover:text-brand-primary transition shadow-sm text-sm uppercase tracking-wider font-bold"
          >
            Submit Institutional Evidence
          </a>
          <a
            href="/state-of-kashmir-crafts/participate"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gray-100 text-gray-700 font-black rounded-xl hover:bg-gray-200 transition text-sm uppercase tracking-wider font-bold"
          >
            Explore Participation Opportunities
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
        <a
          href="/state-of-kashmir-crafts/stakeholder-registry?type=institution"
          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-[#6B2A08] transition text-sm text-center font-bold"
        >
          Register Another Institution
        </a>
        <a
          href="/state-of-kashmir-crafts"
          className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition text-sm text-center font-bold"
        >
          Return to Assessment Home
        </a>
      </div>
    </div>
  );
}
