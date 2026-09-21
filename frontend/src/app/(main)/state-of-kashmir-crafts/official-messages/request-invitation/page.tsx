"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaEnvelopeOpenText, FaCheckCircle, FaArrowLeft, FaSpinner } from "react-icons/fa";
import api from "@/lib/api";

const CATEGORIES = [
  { value: "GOVERNMENT_PUBLIC_INSTITUTIONS", label: "Government and Public Institutions" },
  { value: "INDUSTRY_TRADE", label: "Industry and Trade" },
  { value: "ACADEMIA_RESEARCH", label: "Academia and Research" },
  { value: "ARTISANS_CRAFT_COMMUNITIES", label: "Artisans and Craft Communities" },
  { value: "CIVIL_SOCIETY_HERITAGE", label: "Civil Society and Heritage" },
  { value: "MEDIA_COMMUNICATION", label: "Media and Communication" },
  { value: "INTERNATIONAL_INSTITUTIONS", label: "International Institutions" },
  { value: "POLICY_LEGAL", label: "Policy and Legal" },
  { value: "OTHER_RELEVANT_AUTHORITY", label: "Other Relevant Authority" },
];

export default function RequestInvitationPage() {
  const [form, setForm] = useState({
    fullName: "", designation: "", institution: "", officialEmail: "",
    contributorCategory: "", reasonForRequest: "", proposedRelevance: "", consentAccepted: false
  });
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ referenceNumber: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.officialEmail.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.officialEmail)) e.officialEmail = "Valid official email is required";
    if (!form.institution.trim()) e.institution = "Institution is required";
    if (!form.contributorCategory) e.contributorCategory = "Category is required";
    if (!form.reasonForRequest.trim() || form.reasonForRequest.length < 50) e.reasonForRequest = "Please provide at least 50 characters explaining your interest";
    if (!form.consentAccepted) e.consentAccepted = "You must agree to the terms";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Basic focus for first error
      const firstErrorKey = Object.keys(validationErrors)[0];
      const element = document.getElementsByName(firstErrorKey)[0];
      if (element) element.focus();
      return;
    }
    setErrors({});
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/skc/official-messages/invitation-requests", form);
      const payload = res.data?.data || res.data;
      if (payload?.success || res.data?.status === 'success') {
        setSuccessData({ referenceNumber: payload.referenceNumber });
      } else {
        setError(payload?.message || "We could not complete your request at this time. Please try again shortly.");
      }
    } catch (err: any) {
      const payload = err.response?.data?.data || err.response?.data;
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError("We could not reach the invitation service. Please check your connection and try again.");
      } else {
        setError(payload?.message || err.message || "We could not complete your request at this time. Please try again shortly.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-3xl text-emerald-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-3">Your request for consideration has been received.</h1>
          <p className="text-gray-600 mb-4 font-mono font-bold">
            Reference number: {successData.referenceNumber}
          </p>
          <p className="text-gray-600 mb-6">
            The Assessment Secretariat will review your request. Submission does not guarantee an invitation.
          </p>
          <Link 
            href="/state-of-kashmir-crafts/official-messages" 
            onClick={() => setSuccessData(null)}
            className="inline-flex items-center gap-2 text-icon-on-light font-bold hover:underline"
          >
            <FaArrowLeft /> Return to Official Messages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/state-of-kashmir-crafts/official-messages" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary mb-8 font-medium">
          <FaArrowLeft /> Back to Official Messages
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-8 text-white">
            <FaEnvelopeOpenText className="text-3xl mb-4 opacity-80" />
            <h1 className="text-2xl font-black mb-2">Request an Invitation to Contribute</h1>
            <p className="text-white/80 text-sm leading-relaxed">
              The Official Messages Register accepts contributions by invitation. This form allows you to request consideration.
              All requests are reviewed by the Assessment Secretariat.
            </p>
          </div>

          <div className="p-8">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
              <strong>Please note:</strong> Submission of this form does not guarantee an invitation. 
              Priority is given to individuals who hold formal institutional authority relevant to the Kashmir crafts sector.
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                  <input
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${errors.fullName ? "border-red-400" : "border-gray-200"}`}
                    placeholder="Your full legal name"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1.5">Designation / Title</label>
                  <input
                    name="designation"
                    type="text"
                    value={form.designation}
                    onChange={e => setForm({ ...form, designation: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    placeholder="e.g. Director, Secretary, Professor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1.5">Institution / Organisation <span className="text-red-500">*</span></label>
                  <input
                    name="institution"
                    type="text"
                    value={form.institution}
                    onChange={e => setForm({ ...form, institution: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${errors.institution ? "border-red-400" : "border-gray-200"}`}
                    placeholder="Your affiliated institution"
                  />
                  {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1.5">Official Email <span className="text-red-500">*</span></label>
                  <input
                    name="officialEmail"
                    type="email"
                    value={form.officialEmail}
                    onChange={e => setForm({ ...form, officialEmail: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${errors.officialEmail ? "border-red-400" : "border-gray-200"}`}
                    placeholder="your@institution.org"
                  />
                  {errors.officialEmail && <p className="text-red-500 text-xs mt-1">{errors.officialEmail}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-800 mb-1.5">Relevance to the Assessment (Optional)</label>
                  <input
                    name="proposedRelevance"
                    type="text"
                    value={form.proposedRelevance}
                    onChange={e => setForm({ ...form, proposedRelevance: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    placeholder="E.g. representing artisan communities, research findings..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Briefly explain the institutional, sectoral, research, policy, or community perspective you may contribute.</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-800 mb-1.5">Contributor Category <span className="text-red-500">*</span></label>
                  <select
                    name="contributorCategory"
                    value={form.contributorCategory}
                    onChange={e => setForm({ ...form, contributorCategory: e.target.value })}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-white ${errors.contributorCategory ? 'border-red-400' : 'border-gray-200'}`}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  {errors.contributorCategory && <p className="text-red-500 text-xs mt-1">{errors.contributorCategory}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">
                  Reason for Request and Proposed Contribution <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-2">({form.reasonForRequest.length}/500 chars, minimum 50)</span>
                </label>
                <textarea
                  name="reasonForRequest"
                  rows={5}
                  maxLength={500}
                  value={form.reasonForRequest}
                  onChange={e => setForm({ ...form, reasonForRequest: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none ${errors.reasonForRequest ? "border-red-400" : "border-gray-200"}`}
                  placeholder="Explain your institutional role, your connection to the Kashmir crafts sector, and why your perspective would be a valuable contribution to this assessment..."
                />
                {errors.reasonForRequest && <p className="text-red-500 text-xs mt-1">{errors.reasonForRequest}</p>}
              </div>
              
              <div className="flex items-start gap-3 pt-2">
                <input 
                  name="consentAccepted"
                  type="checkbox" 
                  id="consent" 
                  checked={form.consentAccepted}
                  onChange={e => setForm({ ...form, consentAccepted: e.target.checked })}
                  className="mt-1"
                />
                <label htmlFor="consent" className={`text-sm ${errors.consentAccepted ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                  I consent to the KHCRF Assessment Secretariat reviewing this information and contacting me at the email address provided regarding this invitation request. I understand that submission does not guarantee an invitation.
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? <><FaSpinner className="animate-spin" /> Submitting Request...</> : "Submit Invitation Request"}
                </button>
                <p className="text-xs text-gray-400 text-center mt-3">
                  Your information will be used only for reviewing and administering this request.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
