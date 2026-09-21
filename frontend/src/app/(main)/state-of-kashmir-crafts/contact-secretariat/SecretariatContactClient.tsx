"use client";
import { getBaseUrlNoApi } from "@/lib/api";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  FaShieldAlt, FaHourglassHalf, FaExclamationCircle, FaCheckCircle, FaBan, 
  FaQuestionCircle, FaEnvelope, FaSearch, FaKey, FaChevronDown, FaSpinner, FaArrowRight 
} from 'react-icons/fa';

export default function SecretariatContactClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<'status' | 'recover' | 'help' | 'contact'>('help');
  const [lifecycle, setLifecycle] = useState<any[]>([]);
  const [lifecycleLastUpdated, setLifecycleLastUpdated] = useState<string>('');

  useEffect(() => {
    if (tabParam === 'status') setActiveTab('status');
    else if (tabParam === 'recover') setActiveTab('recover');
    else if (tabParam === 'help') setActiveTab('help');
    else if (tabParam === 'contact') setActiveTab('contact');
  }, [tabParam]);

  useEffect(() => {
    const fetchLifecycle = async () => {
      try {
const API_BASE_URL = getBaseUrlNoApi();
        const res = await fetch(`/api/backend/state-of-kashmir-crafts/assessment-cycles/2026/lifecycle`);
        const data = await res.json();
        if (data.success && data.data) {
          setLifecycle(data.data.stages.filter((s: any) => s.publicVisible));
          setLifecycleLastUpdated(data.data.lastUpdated);
        }
      } catch (err) {
        console.error("Failed to load lifecycle config", err);
      }
    };
    fetchLifecycle();
  }, []);

  // STATUS LOOKUP STATES
  const [statusRef, setStatusRef] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusResult, setStatusResult] = useState<any>(null);
  const [statusError, setStatusError] = useState('');

  // REFERENCE RECOVERY STATES
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryResult, setRecoveryResult] = useState<any>(null);
  const [recoveryError, setRecoveryError] = useState('');

  // CONTACT FORM STATES
  const [fullName, setFullName] = useState('');
  const [contactRef, setContactRef] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Registration');
  const [subject, setSubject] = useState('');
  const [messageText, setMessageText] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

  // ACCORDION STATE
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // Status Lookup logic
  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusRef.trim()) return;

    setStatusLoading(true);
    setStatusResult(null);
    setStatusError('');

    try {
      const isInst = statusRef.toUpperCase().includes('INS') || statusRef.toUpperCase().includes('INST');
      const endpoint = isInst
        ? `/api/backend/skc/institutions/reference/${statusRef.trim()}`
        : `/api/backend/skc/stakeholders/reference/${statusRef.trim()}`;

      const res = await fetch(endpoint);
      const data = await res.json();

      if (res.ok && data.success) {
        setStatusResult({
          referenceNumber: statusRef.trim().toUpperCase(),
          type: isInst ? 'INSTITUTION' : 'INDIVIDUAL',
          status: data.data.status,
          submittedAt: data.data.submittedAt || data.data.createdAt,
          details: data.data
        });
      } else {
        setStatusError(data.error || 'We could not locate a registration using this reference number.');
      }
    } catch (err) {
      console.error(err);
      setStatusError('We could not locate a registration using this reference number. Please verify your reference or contact the Secretariat.');
    } finally {
      setStatusLoading(false);
    }
  };

  // Recovery logic
  const handleRecoverReference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) return;

    setRecoveryLoading(true);
    setRecoveryResult(null);
    setRecoveryError('');

    try {
      const res = await fetch('/api/backend/skc/stakeholders/recover-reference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail.trim() })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setRecoveryResult(data.results);
      } else {
        setRecoveryError(data.error || 'No registrations found associated with this email address.');
      }
    } catch (err) {
      console.error(err);
      setRecoveryError('Failed to verify email address. Please try again later.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  // Support Form logic
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !subject || !messageText) {
      setContactError('Please complete all required fields.');
      return;
    }

    setContactLoading(true);
    setContactError('');
    setContactSuccess(false);

    try {
      // Split name cleanly
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '.';

      // Formulate message with metadata
      const formattedSubject = `[Category: ${category}] ${subject}`;
      const formattedMessage = `Reference Number: ${contactRef || 'None'}\n\n${messageText}`;

      const res = await fetch('/api/backend/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: email.trim(),
          subject: formattedSubject,
          message: formattedMessage
        })
      });

      const data = await res.json();
      if (res.ok) {
        setContactSuccess(true);
        // Reset form
        setFullName('');
        setContactRef('');
        setEmail('');
        setSubject('');
        setMessageText('');
      } else {
        setContactError(data.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setContactError('Failed to submit enquiry. Please check your connection and try again.');
    } finally {
      setContactLoading(false);
    }
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl text-gray-800 animate-fadeIn">
      
      {/* Concise Dynamic Lifecycle Tracker */}
      {lifecycle.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm text-brand-dark flex items-center gap-2">
              <span data-editorial-accent-bg className="inline-block w-2.5 h-2.5 rounded-full  animate-pulse" />
              2026–2027 Assessment Lifecycle
            </h3>
            {lifecycleLastUpdated && (
              <span className="text-[10px] text-gray-500 font-semibold">
                Last updated: {new Date(lifecycleLastUpdated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between relative pt-2">
            <div className="absolute top-4 left-2 right-2 h-0.5 bg-gray-100 z-0"></div>
            {lifecycle.map((stage: any, idx: number) => {
              const statusUpper = (stage.status || '').toUpperCase();
              let dotClass = 'bg-gray-300 border-white';
              let titleClass = 'text-gray-400';

              if (statusUpper === 'COMPLETED') {
                dotClass = 'bg-green-500 border-white ring-2 ring-green-100';
                titleClass = 'text-green-700 font-bold';
              } else if (statusUpper === 'IN_PROGRESS') {
                dotClass = 'bg-yellow-500 border-white ring-2 ring-yellow-200 animate-pulse';
                titleClass = 'text-yellow-700 font-extrabold';
              } else if (statusUpper === 'DELAYED') {
                dotClass = 'bg-red-500 border-white ring-2 ring-red-100';
                titleClass = 'text-red-700 font-bold';
              } else if (statusUpper === 'PAUSED') {
                dotClass = 'bg-blue-500 border-white ring-2 ring-blue-100';
                titleClass = 'text-blue-700 font-bold';
              }

              return (
                <div key={stage.id || stage.key} className="flex flex-col items-center relative z-10 flex-1 group">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 ${dotClass} cursor-pointer flex items-center justify-center`} title={`${stage.title}: ${stage.status}`}>
                    {statusUpper === 'COMPLETED' && <span className="w-1 h-1 rounded-full bg-white" />}
                  </div>
                  <span className={`hidden md:block text-[9px] mt-2 text-center max-w-[80px] leading-tight truncate ${titleClass}`}>
                    {stage.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dynamic Tabs Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <button
          onClick={() => setActiveTab('help')}
          className={`px-4 py-3 font-bold rounded-xl border text-xs uppercase tracking-wider text-center transition ${
            activeTab === 'help' 
              ? 'bg-[#6B2A08] border-[#6B2A08] text-white shadow-sm' 
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Help Centre FAQs
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`px-4 py-3 font-bold rounded-xl border text-xs uppercase tracking-wider text-center transition ${
            activeTab === 'status' 
              ? 'bg-[#6B2A08] border-[#6B2A08] text-white shadow-sm' 
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Check Status
        </button>
        <button
          onClick={() => setActiveTab('recover')}
          className={`px-4 py-3 font-bold rounded-xl border text-xs uppercase tracking-wider text-center transition ${
            activeTab === 'recover' 
              ? 'bg-[#6B2A08] border-[#6B2A08] text-white shadow-sm' 
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Recover Reference
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-3 font-bold rounded-xl border text-xs uppercase tracking-wider text-center transition ${
            activeTab === 'contact' 
              ? 'bg-[#6B2A08] border-[#6B2A08] text-white shadow-sm' 
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Contact Secretariat
        </button>
      </div>

      {/* 1. HELP CENTRE FAQs TAB */}
      {activeTab === 'help' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 font-bold">Frequently Requested Assistance</h3>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
              Find help with registration, approval, participation, and technical support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Registration FAQ Category */}
            <div className="space-y-3">
              <h4 className="text-xs font-black tracking-widest text-[#6B2A08] uppercase border-b border-gray-100 pb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6B2A08]" /> Registration
              </h4>
              <div className="space-y-2">
                {[
                  {
                    id: 'reg-1',
                    q: "I haven't received my confirmation email.",
                    a: "Confirmation emails are sent automatically upon submission. Please verify your spam/junk folder. If you still cannot locate it, use the 'Recover Reference' tab above to find your reference number using your registered email address."
                  },
                  {
                    id: 'reg-2',
                    q: "I lost my reference number.",
                    a: "You can securely search for and retrieve your individual or institutional reference number by entering your registered email address under the 'Recover Reference' tab above."
                  },
                  {
                    id: 'reg-3',
                    q: "I registered using the wrong email address.",
                    a: "Please submit a support ticket via the 'Contact Secretariat' tab, providing your name, correct email, and correct phone number. An administrator will verify your identity and update the record."
                  },
                  {
                    id: 'reg-4',
                    q: "I want to update my registration details.",
                    a: "If your registration status is 'Action Required', you can open your registration status page to upload requested data. If it is already 'Submitted' or 'Under Review', contact the secretariat to request modification."
                  }
                ].map(faq => (
                  <div key={faq.id} className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-4 py-3.5 text-left font-bold text-xs text-gray-800 flex justify-between items-center hover:bg-gray-50 transition"
                    >
                      {faq.q}
                      <FaChevronDown className={`text-xs transition-transform ${openFaq === faq.id ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === faq.id && (
                      <div className="px-4 pb-4 text-xs text-gray-500 font-semibold leading-relaxed border-t border-gray-50 pt-3 bg-gray-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Approval FAQ Category */}
            <div className="space-y-3">
              <h4 className="text-xs font-black tracking-widest text-[#6B2A08] uppercase border-b border-gray-100 pb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6B2A08]" /> Approval
              </h4>
              <div className="space-y-2">
                {[
                  {
                    id: 'app-1',
                    q: "Why is my application still under review?",
                    a: "The Assessment Secretariat reviews applications in batches to verify eligibility, regional parameters, and identity details. This review process usually takes 2–4 working days."
                  },
                  {
                    id: 'app-2',
                    q: "Additional information has been requested.",
                    a: "This means the assessment team requires clarification or verification files. Use the Status Tracker tab above or open your confirmation email to submit the requested updates."
                  }
                ].map(faq => (
                  <div key={faq.id} className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-4 py-3.5 text-left font-bold text-xs text-gray-800 flex justify-between items-center hover:bg-gray-50 transition"
                    >
                      {faq.q}
                      <FaChevronDown className={`text-xs transition-transform ${openFaq === faq.id ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === faq.id && (
                      <div className="px-4 pb-4 text-xs text-gray-500 font-semibold leading-relaxed border-t border-gray-50 pt-3 bg-gray-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Participation FAQ Category */}
            <div className="space-y-3">
              <h4 className="text-xs font-black tracking-widest text-[#6B2A08] uppercase border-b border-gray-100 pb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6B2A08]" /> Participation
              </h4>
              <div className="space-y-2">
                {[
                  {
                    id: 'prt-1',
                    q: "I cannot access the Participation Portal.",
                    a: "Access to the participation dashboard requires approved registration. Please check your registration status. If your status is 'Approved', make sure you are logged in using the same email address used during registration."
                  },
                  {
                    id: 'prt-2',
                    q: "I cannot upload evidence or access specific surveys.",
                    a: "Your active dashboard tasks depend on the category and preferred modes chosen in your registry application. If you need to participate in validation rounds or review technical drafts but do not see the cards, contact the secretariat."
                  }
                ].map(faq => (
                  <div key={faq.id} className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-4 py-3.5 text-left font-bold text-xs text-gray-800 flex justify-between items-center hover:bg-gray-50 transition"
                    >
                      {faq.q}
                      <FaChevronDown className={`text-xs transition-transform ${openFaq === faq.id ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === faq.id && (
                      <div className="px-4 pb-4 text-xs text-gray-500 font-semibold leading-relaxed border-t border-gray-50 pt-3 bg-gray-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Support FAQ Category */}
            <div className="space-y-3">
              <h4 className="text-xs font-black tracking-widest text-[#6B2A08] uppercase border-b border-gray-100 pb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6B2A08]" /> Technical Support
              </h4>
              <div className="space-y-2">
                {[
                  {
                    id: 'tech-1',
                    q: "Sign-in problems or session timeouts.",
                    a: "Ensure cookies and Javascript are enabled in your browser. Clear browser cache and log in again at /login."
                  },
                  {
                    id: 'tech-2',
                    q: "File upload issues.",
                    a: "Evidence files must be in PDF, DOCX, JPG, or PNG format and smaller than 10MB. Ensure a stable network connection before starting uploads."
                  }
                ].map(faq => (
                  <div key={faq.id} className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-4 py-3.5 text-left font-bold text-xs text-gray-800 flex justify-between items-center hover:bg-gray-50 transition"
                    >
                      {faq.q}
                      <FaChevronDown className={`text-xs transition-transform ${openFaq === faq.id ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === faq.id && (
                      <div className="px-4 pb-4 text-xs text-gray-500 font-semibold leading-relaxed border-t border-gray-50 pt-3 bg-gray-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. REGISTRATION STATUS TRACKER TAB */}
      {activeTab === 'status' && (
        <div className="space-y-8 animate-fadeIn max-w-2xl mx-auto">
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-bold text-gray-900 font-bold">Registration Status Lookup</h3>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-md mx-auto">
              Already submitted a stakeholder or institutional registration? Enter your reference number below to securely check the current status of your application.
            </p>
          </div>

          <form onSubmit={handleCheckStatus} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="refInput" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Reference Number
              </label>
              <div className="relative">
                <input
                  id="refInput"
                  type="text"
                  placeholder="e.g. SKC-STK-000254"
                  value={statusRef}
                  onChange={e => setStatusRef(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-primary font-mono text-gray-800 uppercase"
                  required
                />
                <FaSearch className="absolute left-3.5 top-4 text-gray-400 text-sm" />
              </div>
              <p className="text-[10px] text-gray-400 font-medium">
                Example: <span className="font-mono">SKC-STK-000254</span> (Individual) or <span className="font-mono">SKC-INS-000031</span> (Institution)
              </p>
            </div>

            <button
              type="submit"
              disabled={statusLoading || !statusRef.trim()}
              className="w-full py-3 bg-[#6B2A08] text-white font-bold rounded-xl hover:bg-brand-secondary transition text-xs uppercase tracking-wider flex items-center justify-center gap-2 font-bold"
            >
              {statusLoading ? <FaSpinner className="animate-spin" /> : 'Check Status'}
            </button>
          </form>

          {/* STATUS LOOKUP ERRORS */}
          {statusError && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs font-semibold leading-relaxed max-w-md mx-auto text-center">
              <FaBan className="inline mr-2 text-sm" /> {statusError}
            </div>
          )}

          {/* STATUS RESULTS COMPONENT */}
          {statusResult && (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md animate-scaleUp">
              
              {/* Submitted status */}
              {statusResult.status === 'SUBMITTED' && (
                <div className="p-8 text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 border border-amber-200 text-amber-600">
                    <FaHourglassHalf className="text-xl animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-amber-800 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      🟡 Submitted
                    </span>
                    <h4 className="text-lg font-bold text-gray-900 font-bold">Application Received</h4>
                    <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-md mx-auto">
                      Your registration has been received successfully. The Assessment Secretariat will begin verification shortly.
                    </p>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-3 bg-gray-50 max-w-xs mx-auto text-xs font-mono font-bold text-gray-600">
                    Ref: {statusResult.referenceNumber}
                  </div>
                </div>
              )}

              {/* Under review status */}
              {statusResult.status === 'UNDER_REVIEW' && (
                <div className="p-8 space-y-6">
                  <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 border border-amber-200 text-amber-600 animate-pulse">
                      <FaHourglassHalf className="text-xl" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-amber-800 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
                        🟡 Under Review
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 font-bold">Verification in Progress</h4>
                  </div>

                  <div className="border border-gray-200 rounded-2xl bg-gray-50 text-xs overflow-hidden shadow-inner">
                    <div className="p-3.5 border-b border-gray-100 flex justify-between">
                      <span className="font-bold text-gray-400 uppercase">Reference Number</span>
                      <span className="font-mono font-bold text-gray-700">{statusResult.referenceNumber}</span>
                    </div>
                    <div className="p-3.5 border-b border-gray-100 flex justify-between">
                      <span className="font-bold text-gray-400 uppercase">Registration Type</span>
                      <span className="font-bold text-gray-700">
                        {statusResult.type === 'INDIVIDUAL' ? 'Individual Stakeholder' : 'Institutional Registration'}
                      </span>
                    </div>
                    {statusResult.submittedAt && (
                      <div className="p-3.5 flex justify-between">
                        <span className="font-bold text-gray-400 uppercase">Submission Date</span>
                        <span className="font-bold text-gray-700">
                          {new Date(statusResult.submittedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs space-y-2.5 pt-2 border-t border-gray-100">
                    <span className="font-bold text-gray-800 block">Current Review Activities</span>
                    <ul className="list-disc pl-4 space-y-1 text-gray-400 font-semibold">
                      <li>Identity and contact details validation</li>
                      <li>Stakeholder eligibility parameters check</li>
                      <li>Duplication and security registration screening</li>
                    </ul>
                  </div>

                  <div className="flex gap-3 justify-center pt-4">
                    <button
                      onClick={() => setActiveTab('contact')}
                      className="px-5 py-2.5 bg-[#6B2A08] text-white font-bold rounded-xl hover:bg-brand-secondary transition text-xs uppercase tracking-wider font-bold"
                    >
                      Contact Secretariat
                    </button>
                  </div>
                </div>
              )}

              {/* Action Required status */}
              {(statusResult.status.includes('INFO') || statusResult.status.includes('CLARIFICATION') || statusResult.status.includes('REVISION') || statusResult.status.includes('REQUIRED') || statusResult.status.includes('NEED')) && (
                <div className="p-8 space-y-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-50 border border-orange-200 text-orange-600 animate-bounce">
                    <FaExclamationCircle className="text-xl" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-orange-800 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      🟠 Action Required
                    </span>
                    <h4 className="text-lg font-bold text-gray-900 font-bold">Additional Information Required</h4>
                    <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-md mx-auto">
                      The Assessment Secretariat requires updates or verification files before your registration can proceed.
                    </p>
                  </div>

                  <div className="text-xs text-orange-800 bg-orange-50/50 border border-orange-100 p-4 rounded-xl text-left max-w-md mx-auto space-y-2">
                    <span className="font-bold block">Required Updates</span>
                    <ul className="list-disc pl-4 space-y-1 text-gray-500 font-semibold">
                      <li>Verify identity credentials</li>
                      <li>Provide proof of regional organization activity</li>
                      <li>Clarify Preferred Participation Modes</li>
                    </ul>
                  </div>

                  <div className="flex justify-center pt-2">
                    <Link
                      href={statusResult.type === 'INDIVIDUAL' 
                        ? `/state-of-kashmir-crafts/stakeholder-registry/individual-confirmation/${statusResult.referenceNumber}`
                        : `/state-of-kashmir-crafts/stakeholder-registry/institution-confirmation/${statusResult.referenceNumber}`
                      }
                      className="px-6 py-3 bg-[#6B2A08] text-white font-bold rounded-xl hover:bg-brand-secondary transition text-xs uppercase tracking-wider font-bold"
                    >
                      Update Registration
                    </Link>
                  </div>
                </div>
              )}

              {/* Approved status */}
              {(statusResult.status === 'APPROVED' || statusResult.status === 'VERIFIED' || statusResult.status === 'ACTIVE') && (
                <div className="p-8 text-center space-y-6 animate-scaleUp">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 border border-green-200 text-green-600">
                    <FaCheckCircle className="text-xl" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-green-800 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      🟢 Approved
                    </span>
                    <h4 className="text-lg font-bold text-gray-900 font-bold">Registration Approved</h4>
                    <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-md mx-auto">
                      Congratulations! Your registration has been approved. You now have full access permissions for the State of Kashmir Crafts Participation Portal.
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <Link
                      href="/state-of-kashmir-crafts/participate"
                      className="px-6 py-3 bg-[#6B2A08] text-white font-bold rounded-xl hover:bg-brand-secondary transition text-xs uppercase tracking-wider font-bold"
                    >
                      Open Participation Portal
                    </Link>
                    <Link
                      href="/login"
                      className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition text-xs uppercase tracking-wider font-bold"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              )}

              {/* Declined / Rejected status */}
              {statusResult.status === 'REJECTED' && (
                <div className="p-8 text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 border border-red-200 text-red-600">
                    <FaBan className="text-xl" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-red-800 bg-red-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      🔴 Registration Not Approved
                    </span>
                    <h4 className="text-lg font-bold text-gray-900 font-bold">Application Declined</h4>
                    <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-md mx-auto">
                      Your registration has not been approved for participation at this time. Contact support for further enquiries or appeals.
                    </p>
                  </div>

                  <div className="flex gap-3 justify-center pt-2">
                    <button
                      onClick={() => setActiveTab('contact')}
                      className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition text-xs uppercase tracking-wider font-bold"
                    >
                      Contact Secretariat
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* 3. RECOVER REFERENCE TAB */}
      {activeTab === 'recover' && (
        <div className="space-y-8 animate-fadeIn max-w-2xl mx-auto">
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-bold text-gray-900 font-bold">Recover Reference Number</h3>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-md mx-auto">
              Lost your stakeholder or institutional reference code? Enter your registered email address below to securely retrieve your codes.
            </p>
          </div>

          <form onSubmit={handleRecoverReference} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="recoveryEmailInput" className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-bold">
                Registered Email Address
              </label>
              <div className="relative">
                <input
                  id="recoveryEmailInput"
                  type="email"
                  placeholder="e.g. fayaz@example.com"
                  value={recoveryEmail}
                  onChange={e => setRecoveryEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-primary font-medium text-gray-800"
                  required
                />
                <FaKey className="absolute left-3.5 top-4 text-gray-400 text-sm" />
              </div>
            </div>

            <button
              type="submit"
              disabled={recoveryLoading || !recoveryEmail.trim()}
              className="w-full py-3 bg-[#6B2A08] text-white font-bold rounded-xl hover:bg-brand-secondary transition text-xs uppercase tracking-wider flex items-center justify-center gap-2 font-bold"
            >
              {recoveryLoading ? <FaSpinner className="animate-spin" /> : 'Recover Reference'}
            </button>
          </form>

          {/* RECOVERY ERRORS */}
          {recoveryError && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs font-semibold leading-relaxed max-w-md mx-auto text-center">
              <FaBan className="inline mr-2 text-sm" /> {recoveryError}
            </div>
          )}

          {/* RECOVERY RESULTS */}
          {recoveryResult && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-4 animate-scaleUp">
              <span className="font-bold text-gray-800 text-xs uppercase tracking-wider block border-b border-gray-100 pb-2">
                Associated Reference Records Found
              </span>

              <div className="space-y-3">
                {recoveryResult.map((reg: any, idx: number) => (
                  <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-gray-50 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="space-y-1">
                      <span data-editorial-accent-text className="text-[10px] font-black  uppercase tracking-wider block">
                        {reg.type === 'INDIVIDUAL' ? 'Individual Stakeholder' : 'Institutional Registry'}
                      </span>
                      <span className="font-mono font-bold text-sm text-gray-700 block">{reg.referenceNumber}</span>
                      <span className="text-xs text-gray-500 font-semibold block">{reg.name}</span>
                    </div>
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        reg.status === 'APPROVED' || reg.status === 'VERIFIED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {reg.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. CONTACT SECRETARIAT FORM TAB */}
      {activeTab === 'contact' && (
        <div className="space-y-8 animate-fadeIn max-w-2xl mx-auto">
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-bold text-gray-900 font-bold">Contact the Assessment Secretariat</h3>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed max-w-md mx-auto">
              Have questions regarding registration status, draft feedback, or portal technical errors? Submit a structured support request below.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="bg-white border border-gray-200 rounded-3xl p-8 shadow-md space-y-6">
            
            {/* Split Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-bold">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fayaz Ahmad"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#6B2A08] font-semibold text-gray-800"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-bold">
                  Reference Number <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. SKC-STK-000254"
                  value={contactRef}
                  onChange={e => setContactRef(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#6B2A08] font-mono text-gray-800 uppercase"
                />
              </div>

            </div>

            {/* Split Fields 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-bold">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. email@domain.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#6B2A08] font-semibold text-gray-800"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-bold">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#6B2A08] font-bold text-gray-700"
                >
                  <option value="Registration">Registration Issues</option>
                  <option value="Approval">Approval Process</option>
                  <option value="Participation">Participation Portal Access</option>
                  <option value="Technical Support">Technical / Upload Issues</option>
                  <option value="Evidence Submission">Evidence Submission</option>
                  <option value="Expert Review">Expert Review tracks</option>
                  <option value="Public Hearing">Public Hearings</option>
                  <option value="Other">Other Query</option>
                </select>
              </div>

            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-bold">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Brief summary of your enquiry"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#6B2A08] font-semibold text-gray-800"
                required
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-bold">
                Message Content <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Please describe your support request in detail..."
                rows={5}
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#6B2A08] font-semibold text-gray-800"
                required
              />
            </div>

            {/* Form feedback alerts */}
            {contactError && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs font-semibold leading-relaxed">
                <FaBan className="inline mr-2 text-sm" /> {contactError}
              </div>
            )}

            {contactSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-xs font-semibold leading-relaxed">
                <FaCheckCircle className="inline mr-2 text-sm" /> Support request submitted successfully! The Assessment Secretariat will contact you at your email address within 3–5 working days.
              </div>
            )}

            <button
              type="submit"
              disabled={contactLoading}
              className="w-full py-3.5 bg-[#6B2A08] text-white font-bold rounded-xl hover:bg-brand-secondary transition text-xs uppercase tracking-wider flex items-center justify-center gap-2 font-bold"
            >
              {contactLoading ? <FaSpinner className="animate-spin" /> : 'Submit Support Request'}
            </button>

          </form>
        </div>
      )}

    </div>
  );
}
