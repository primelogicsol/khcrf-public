"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaUser, 
  FaClipboardList, 
  FaAward, 
  FaBookOpen, 
  FaCheckCircle, 
  FaSpinner, 
  FaArrowLeft, 
  FaCheck,
  FaTimes,
  FaSearch
} from "react-icons/fa";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const stripHtml = (str: string): string => {
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript\s*:/gi, '')
    .trim();
};

export default function ContributorIntakeFormPage() {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [existingTrackingId, setExistingTrackingId] = useState('');

  const [formData, setFormData] = useState({
    fullName: user ? user.name : "",
    email: user ? user.email : "",
    phone: "",
    country: "",
    roleType: "Research Contributor",
    institution: "",
    profileLink: "",
    purpose: "Apply as recurring contributor",
    expertise: "Research",
    craftFocus: "Pashmina",
    title: "",
    summary: "",
    contributionType: "Research Paper",
    evidence: "",
    fileUrl: "",
    sourceNotes: "",
    consentOriginal: false,
    consentReview: false,
    consentApproval: false
  });

  useEffect(() => {
    const checkEmail = formData.email?.trim();
    if (!checkEmail) return;

    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/intake/check-duplicate?email=${encodeURIComponent(checkEmail)}`);
        if (res.data.exists) {
          setAlreadySubmitted(true);
          setExistingTrackingId(res.data.trackingId || '');
        } else {
          setAlreadySubmitted(false);
          setExistingTrackingId('');
        }
      } catch {
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consentOriginal || !formData.consentReview || !formData.consentApproval) {
      toast.error("Please agree to all consent and verification terms.");
      return;
    }

    setSubmitting(true);
    try {
      const sanitized = {
        ...formData,
        fullName: stripHtml(formData.fullName),
        email: stripHtml(formData.email),
        phone: stripHtml(formData.phone),
        country: stripHtml(formData.country),
        institution: stripHtml(formData.institution),
        profileLink: stripHtml(formData.profileLink),
        title: stripHtml(formData.title),
        summary: stripHtml(formData.summary),
        evidence: stripHtml(formData.evidence),
        fileUrl: stripHtml(formData.fileUrl),
        sourceNotes: stripHtml(formData.sourceNotes),
      };

      const res = await api.post("/intake/submit", sanitized);
      setTrackingId(res.data.trackingId);
      setSubmitted(true);
    } catch (err: any) {
      const errData = err.response?.data;
      if (errData?.alreadySubmitted) {
        setAlreadySubmitted(true);
        setExistingTrackingId(errData.trackingId || '');
      }
      const errMsg = errData?.error || "Failed to submit contributor intake.";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const validateStep1 = () => {
    if (!formData.fullName || !formData.email || !formData.country) {
      toast.error("Please complete all required identity fields.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.title || !formData.summary) {
      toast.error("Please complete the proposed contribution fields.");
      return false;
    }
    return true;
  };

  if (alreadySubmitted) {
    return (
      <div className="min-h-screen bg-stone-50/30 py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-3xl mx-auto space-y-8">
          <Link href="/publications" className="group inline-flex items-center text-stone-400 hover:text-brand-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
            <FaArrowLeft className="mr-3 transition-transform group-hover:-translate-x-1" />
            Back to Library Hub
          </Link>
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center">
            <FaCheckCircle className="text-amber-500 text-5xl mx-auto mb-4" />
            <h2 className="text-xl font-bold text-brand-dark mb-2">You have already submitted a contributor application.</h2>
            <p className="text-stone-600 text-sm mb-4">
              Your submission is being reviewed by our editorial team.
            </p>
            {existingTrackingId && (
              <p className="text-sm text-stone-500">
                Your tracking ID: <span className="font-bold text-brand-primary">{existingTrackingId}</span>
              </p>
            )}
            <div className="mt-6 flex gap-3 justify-center">
              <Link href="/publications" className="border border-stone-200 text-stone-600 font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-stone-50 transition-all text-xs">
                Back to Publications
              </Link>
              <Link href={`/publications/track?trackingId=${existingTrackingId}`} className="bg-brand-primary hover:bg-brand-dark text-white font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all text-xs inline-flex items-center gap-2">
                <FaSearch /> Track Submission
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50/30 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <Link 
          href="/publications" 
          className="group inline-flex items-center text-stone-400 hover:text-brand-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <FaArrowLeft className="mr-3 transition-transform group-hover:-translate-x-1" />
          Back to Library Hub
        </Link>

        <div className="bg-brand-dark rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <span className="bg-brand-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md">
            Knowledge Contributor
          </span>
          <h1 className="text-3xl font-bold font-serif mt-4 text-white leading-tight">
            Apply as Knowledge Contributor
          </h1>
          <p className="text-stone-300 text-xs mt-2 max-w-xl leading-relaxed">
            Join KHCRF as a verified knowledge contributor. Submit your expertise, propose knowledge assets, and collaborate with our editorial panel.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-emerald-600 text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-brand-dark mb-2">
              Application Submitted Successfully!
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed mb-4">
              Thank you for applying as a Knowledge Contributor. Our editorial team will review your submission and contact you at the provided email address.
            </p>
            {trackingId && (
              <p className="text-sm bg-white border border-emerald-200 rounded-xl px-4 py-3 inline-block mb-4">
                Your tracking ID is: <span className="font-bold text-brand-primary text-base">{trackingId}</span>
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <Link href="/publications" className="border border-stone-200 text-stone-600 font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-stone-50 transition-all text-xs">
                Back to Publications
              </Link>
              <Link href={`/publications/track?trackingId=${trackingId}`} className="bg-brand-primary hover:bg-brand-dark text-white font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all text-xs inline-flex items-center gap-2">
                <FaSearch /> Track Submission
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center bg-white border border-stone-200/60 p-4 rounded-2xl shadow-sm text-xs font-bold text-stone-500">
              <button 
                type="button" 
                onClick={() => currentStep > 1 && setCurrentStep(1)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${currentStep === 1 ? 'text-brand-primary bg-brand-primary/5' : 'hover:bg-stone-50'}`}
              >
                <span className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center text-[10px]">1</span>
                Identity & Focus
              </button>
              <div className="h-px bg-stone-200 grow mx-2" />
              <button 
                type="button"
                onClick={() => currentStep > 2 && setCurrentStep(2)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${currentStep === 2 ? 'text-brand-primary bg-brand-primary/5' : 'hover:bg-stone-50'}`}
                disabled={currentStep < 2}
              >
                <span className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center text-[10px]">2</span>
                Proposed Asset
              </button>
              <div className="h-px bg-stone-200 grow mx-2" />
              <button 
                type="button"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${currentStep === 3 ? 'text-brand-primary bg-brand-primary/5' : 'text-stone-300'}`}
                disabled={currentStep < 3}
              >
                <span className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center text-[10px]">3</span>
                Consent & Verify
              </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-stone-200/65 rounded-3xl p-8 shadow-sm space-y-6 text-xs text-stone-700">
              
              {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-stone-100 pb-3">
                    <h2 className="text-base font-bold text-brand-dark flex items-center gap-2"><FaUser data-ui-icon  className="" /> 1. Contributor Identity</h2>
                    <p className="text-stone-400 text-[11px] mt-0.5">Please provide your verified details for authentication</p>
                  </div>

                  {!user && (
                    <div className="bg-amber-50 border border-amber-250/20 rounded-xl p-4 text-[11px] text-amber-800">
                      You are completing this intake as a Guest. To automatically track your submission and unlock contributor dashboards, we recommend logging in first.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider block">Full Name *</label>
                      <input type="text" required name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 outline-none focus:border-brand-primary font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider block">Email Address *</label>
                      <input type="email" required name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 outline-none focus:border-brand-primary font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider block">Phone / WhatsApp</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91-XXXX-XXXXXX" className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 outline-none focus:border-brand-primary font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider block">Country Focus *</label>
                      <input type="text" required name="country" value={formData.country} onChange={handleChange} placeholder="e.g. India, UK, Germany" className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 outline-none focus:border-brand-primary font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider block">Institution / Organization</label>
                      <input type="text" name="institution" value={formData.institution} onChange={handleChange} placeholder="e.g. University, Cooperatives, Exporters Guild" className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 outline-none focus:border-brand-primary font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider block">Website / Profile link</label>
                      <input type="text" name="profileLink" value={formData.profileLink} onChange={handleChange} placeholder="https://scholar.google.com/..." className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 outline-none focus:border-brand-primary font-medium" />
                    </div>
                  </div>

                  <div className="border-b border-stone-100 pb-3 pt-4">
                    <h2 className="text-base font-bold text-brand-dark flex items-center gap-2"><FaClipboardList data-ui-icon  className="" /> 2. Classification & Focus</h2>
                    <p className="text-stone-400 text-[11px] mt-0.5">Determine how your contribution should be categorized</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider block">Contributor Role Type *</label>
                      <select name="roleType" value={formData.roleType} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 outline-none focus:border-brand-primary font-semibold text-stone-700">
                        <option value="Research Contributor">Research Contributor</option>
                        <option value="Field Contributor">Field Contributor</option>
                        <option value="Artisan Contributor">Artisan Contributor</option>
                        <option value="Industry Contributor">Industry Contributor</option>
                        <option value="Policy Contributor">Policy Contributor</option>
                        <option value="Institutional Partner">Institutional Partner</option>
                        <option value="Editor / Reviewer">Editor / Reviewer</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider block">Contribution Purpose *</label>
                      <select name="purpose" value={formData.purpose} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 outline-none focus:border-brand-primary font-semibold text-stone-700">
                        <option value="Apply as recurring contributor">Apply as recurring contributor</option>
                        <option value="Submit one knowledge asset">Submit one knowledge asset</option>
                        <option value="Field documentation collaboration">Field documentation collaboration</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider block">Expertise Area *</label>
                      <select name="expertise" value={formData.expertise} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 outline-none focus:border-brand-primary font-semibold text-stone-700">
                        <option value="Research">Research & Analysis</option>
                        <option value="Artisan knowledge">Artisan Lived Experience</option>
                        <option value="Export / market intelligence">Export & Market Intelligence</option>
                        <option value="GI / authentication">GI & Authenticity Standards</option>
                        <option value="Policy">Policy & Advocacy</option>
                        <option value="Craft documentation">Craft & Motif Documentation</option>
                        <option value="Cluster fieldwork">Cluster Fieldwork</option>
                        <option value="Technical standards">Technical Loom & Material Standards</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider block">Craft Focus *</label>
                      <select name="craftFocus" value={formData.craftFocus} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 outline-none focus:border-brand-primary font-semibold text-stone-700">
                        <option value="Pashmina">Pashmina</option>
                        <option value="Kani">Kani</option>
                        <option value="Carpet">Carpet</option>
                        <option value="Papier-Mâché">Papier-Mâché</option>
                        <option value="Walnut Wood">Walnut Wood</option>
                        <option value="Sozni">Sozni</option>
                        <option value="Copperware">Copperware</option>
                        <option value="Chain Stitch">Chain Stitch</option>
                        <option value="Multi-Craft">Multi-Craft</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-stone-100">
                    <button type="button" onClick={() => validateStep1() && setCurrentStep(2)} className="bg-brand-primary hover:bg-brand-dark text-white font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all">
                      Continue to Proposed Asset
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-stone-100 pb-3">
                    <h2 className="text-base font-bold text-brand-dark flex items-center gap-2"><FaBookOpen data-ui-icon  className="" /> 3. Proposed Contribution</h2>
                    <p className="text-stone-400 text-[11px] mt-0.5">Tell us about the knowledge asset you wish to submit or author</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold uppercase tracking-wider block">Title / Topic *</label>
                      <input type="text" required name="title" value={formData.title} onChange={handleChange} placeholder="Enter submission title or proposed topic" className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 outline-none focus:border-brand-primary font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider block">Contribution Type *</label>
                      <select name="contributionType" value={formData.contributionType} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 outline-none focus:border-brand-primary font-semibold text-stone-700">
                        <option value="Research Paper">Research Paper</option>
                        <option value="Best Practice">Best Practice</option>
                        <option value="Case Study">Case Study</option>
                        <option value="E-Book">E-Book</option>
                        <option value="Craft Manual">Craft Manual</option>
                        <option value="Policy Brief">Policy Brief</option>
                        <option value="Market Intelligence Report">Market Intelligence Report</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold uppercase tracking-wider block">Document / Evidence Link (URL)</label>
                      <input type="text" name="fileUrl" value={formData.fileUrl} onChange={handleChange} placeholder="https://drive.google.com/... (optional)" className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 outline-none focus:border-brand-primary font-medium" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold uppercase tracking-wider block">Short Summary / Abstract *</label>
                    <textarea required rows={4} name="summary" value={formData.summary} onChange={handleChange} placeholder="Outline the core thesis, methodology, results, or craft observations in 150-300 words..." className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:border-brand-primary font-serif resize-none" />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold uppercase tracking-wider block">Supporting Evidence Description</label>
                    <textarea rows={2} name="evidence" value={formData.evidence} onChange={handleChange} placeholder="Describe data, interviews, historic certificates, or lab analysis backing this submission..." className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:border-brand-primary font-serif resize-none" />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold uppercase tracking-wider block">Source Notes / References</label>
                    <textarea rows={2} name="sourceNotes" value={formData.sourceNotes} onChange={handleChange} placeholder="Bibliographic sources, elder names, raw data archives (optional)..." className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:border-brand-primary font-serif resize-none" />
                  </div>

                  <div className="flex justify-between pt-4 border-t border-stone-100">
                    <button type="button" onClick={() => setCurrentStep(1)} className="border border-stone-200 text-stone-600 font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-stone-50 transition-all">
                      Back
                    </button>
                    <button type="button" onClick={() => validateStep2() && setCurrentStep(3)} className="bg-brand-primary hover:bg-brand-dark text-white font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all">
                      Continue to Verification
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-stone-100 pb-3">
                    <h2 className="text-base font-bold text-brand-dark flex items-center gap-2"><FaAward data-ui-icon  className="" /> 4. Consent & Verification</h2>
                    <p className="text-stone-400 text-[11px] mt-0.5">Affirm editorial terms before adding to the publishing pipeline</p>
                  </div>

                  <div className="bg-stone-50 border border-stone-200 p-6 rounded-2xl space-y-4 font-medium text-stone-700">
                    <div className="flex items-start gap-3">
                      <input type="checkbox" id="consentOriginal" checked={formData.consentOriginal} onChange={(e) => handleCheckboxChange("consentOriginal", e.target.checked)} className="accent-brand-primary w-4 h-4 rounded mt-0.5" />
                      <label htmlFor="consentOriginal" className="cursor-pointer select-none">I confirm that this submission is original research, authentic traditional artisan knowledge, or properly cited secondary audit work.</label>
                    </div>
                    <div className="flex items-start gap-3">
                      <input type="checkbox" id="consentReview" checked={formData.consentReview} onChange={(e) => handleCheckboxChange("consentReview", e.target.checked)} className="accent-brand-primary w-4 h-4 rounded mt-0.5" />
                      <label htmlFor="consentReview" className="cursor-pointer select-none">I agree to allow the editorial panel to review, edit, fact-check, and peer-review this submission.</label>
                    </div>
                    <div className="flex items-start gap-3">
                      <input type="checkbox" id="consentApproval" checked={formData.consentApproval} onChange={(e) => handleCheckboxChange("consentApproval", e.target.checked)} className="accent-brand-primary w-4 h-4 rounded mt-0.5" />
                      <label htmlFor="consentApproval" className="cursor-pointer select-none">I understand that publication is subject to editorial panel approval and role-based assignment.</label>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-stone-100">
                    <button type="button" onClick={() => setCurrentStep(2)} className="border border-stone-200 text-stone-600 font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-stone-50 transition-all">
                      Back
                    </button>
                    <button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2">
                      {submitting ? <><FaSpinner className="animate-spin" /> Submitting...</> : <><FaCheck /> Submit Contributor Application</>}
                    </button>
                  </div>
                </div>
              )}

            </form>
          </>
        )}
      </div>
    </div>
  );
}
