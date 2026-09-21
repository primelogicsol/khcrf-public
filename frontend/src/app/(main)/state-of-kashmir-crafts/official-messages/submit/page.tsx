"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { FaSpinner, FaCheckCircle, FaArrowLeft, FaFileAlt, FaLock, FaExclamationTriangle, FaUser, FaBuilding } from "react-icons/fa";

interface SessionData { id: string; applicantName: string; institution: string; codeDisplaySuffix: string; }

export default function OfficialMessageSubmitPage() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", fullBody: "", excerpt: "", language: "English", honorific: "", publicDisplayName: "", department: "", country: "India" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ referenceNumber: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    api.get("/skc/official-messages/session")
      .then(res => {
        // checkSession returns bare { success, valid, invitation } — NOT wrapped by responseFormatter
        // because it calls res.json() directly. Check both shapes for safety.
        const p = res.data?.data || res.data;
        const inv = p?.invitation;
        if (p?.valid && inv) {
          setSession(inv);
          setForm(f => ({ ...f, publicDisplayName: inv.applicantName }));
        } else { setSessionError("no_session"); }
      })
      .catch((err: any) => {
        if (err.response?.status === 403 || err.response?.status === 410) {
          setSessionError("expired");
        } else {
          setSessionError("no_session");
        }
      })
      .finally(() => setSessionLoading(false));
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim() || form.title.length < 10) e.title = "Please provide a title (min 10 characters)";
    if (!form.fullBody.trim() || form.fullBody.length < 100) e.fullBody = "Your message must be at least 100 characters";
    if (form.fullBody.length > 10000) e.fullBody = "Message must not exceed 10,000 characters";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setFormErrors({});
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.post("/skc/official-messages/submit", form);
      // submitMessage returns bare { success, referenceNumber, slug } (no wrapper)
      const p = res.data?.data || res.data;
      const didSucceed = p?.success === true || res.data?.status === "success";
      if (didSucceed) {
        setSubmitted({ referenceNumber: p.referenceNumber || res.data?.data?.referenceNumber });
      } else {
        setError(p?.error || "We could not submit your message. Please try again.");
      }
    } catch (err: any) {
      const body = err.response?.data?.data || err.response?.data;
      const msg = body?.error || body?.message || "";
      if (err.response?.status === 401) { setSessionError("expired"); }
      else if (err.response?.status === 409) { setError("This invitation has already been used to submit a message."); }
      else if (err.response?.status === 410) { setError("Your invitation has expired. Please contact the Secretariat."); }
      else if (err.response?.status === 403) { setSessionError("expired"); }
      else if (err.response?.status === 400 && msg) { setError(msg); }
      else { setError(msg || "We could not submit your message. Please try again."); }
    } finally { setSubmitting(false); }
  };

  if (sessionLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-gray-500">
        <FaSpinner data-ui-icon  className="animate-spin text-4xl " />
        <p className="text-sm font-medium">Verifying your invitation…</p>
      </div>
    </div>
  );

  if (sessionError) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaLock className="text-3xl text-amber-600" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">
          {sessionError === "expired" ? "Session Expired" : "Invitation Required"}
        </h1>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          {sessionError === "expired"
            ? "Your secure session has expired. Please re-enter your invitation code to continue."
            : "This page is only accessible after verifying a valid invitation code issued by the KHCRF Assessment Secretariat."}
        </p>
        <Link href="/state-of-kashmir-crafts/official-messages/invitation"
          className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-primary/90 transition-colors">
          Enter Invitation Code
        </Link>
        <div className="mt-4">
          <Link href="/state-of-kashmir-crafts/official-messages/request-invitation" className="text-sm text-gray-400 hover:text-brand-primary">
            Don&apos;t have a code? Request access
          </Link>
        </div>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle className="text-3xl text-emerald-600" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Official Message Submitted</h1>
        <p className="text-gray-500 text-sm mb-4">Your message has been received and is pending editorial review.</p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Reference Number</p>
          <p className="font-mono font-bold text-lg text-gray-900">{submitted.referenceNumber}</p>
        </div>
        <Link href="/state-of-kashmir-crafts/official-messages" className="inline-flex items-center gap-2 text-icon-on-light font-bold hover:underline">
          <FaArrowLeft /> Return to Official Messages
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/state-of-kashmir-crafts/official-messages" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary mb-8 font-medium">
          <FaArrowLeft /> Back to Official Messages
        </Link>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <FaLock className="text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-emerald-800">Secure Invitation Session Active</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Submitting as <strong>{session!.applicantName}</strong> · <strong>{session!.institution}</strong> · Code ending <strong>···{session!.codeDisplaySuffix}</strong>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-8 text-white">
            <FaFileAlt className="text-3xl mb-4 opacity-80" />
            <h1 className="text-2xl font-black mb-2">Submit Your Official Message</h1>
            <p className="text-white/80 text-sm">Your contribution will be reviewed by the Assessment Secretariat before publication.</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 items-start text-sm text-red-700 mb-6">
                <FaExclamationTriangle className="mt-0.5 shrink-0" />{error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1.5">Honorific <span className="font-normal text-gray-400">(Optional)</span></label>
                  <select value={form.honorific} onChange={e => setForm({ ...form, honorific: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20">
                    <option value="">None</option>
                    {["Dr.", "Prof.", "Mr.", "Ms.", "Mrs.", "Shri", "Smt.", "H.E.", "H.H."].map(h => <option key={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-1.5">Public Display Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-gray-400 text-sm" />
                    <input type="text" value={form.publicDisplayName} onChange={e => setForm({ ...form, publicDisplayName: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      placeholder="Name as it will appear publicly" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-800 mb-1.5">Department / Division <span className="font-normal text-gray-400">(Optional)</span></label>
                  <div className="relative">
                    <FaBuilding className="absolute left-3 top-3 text-gray-400 text-sm" />
                    <input type="text" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      placeholder="e.g. Department of Handicrafts, Ministry of Commerce" />
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">Message Title <span className="text-red-500">*</span></label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${formErrors.title ? "border-red-400" : "border-gray-200"}`}
                  placeholder="A concise, descriptive title for your official message" />
                {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">Language</label>
                <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20">
                  {["English", "Urdu", "Hindi", "Kashmiri", "French", "Arabic", "Other"].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">
                  Full Message Body <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-2">({form.fullBody.length}/10,000 · min 100)</span>
                </label>
                <textarea rows={12} maxLength={10000} value={form.fullBody} onChange={e => setForm({ ...form, fullBody: e.target.value })}
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none leading-relaxed ${formErrors.fullBody ? "border-red-400" : "border-gray-200"}`}
                  placeholder="Write your complete official message here. This will be reviewed by the Assessment Secretariat before publication." />
                {formErrors.fullBody && <p className="text-red-500 text-xs mt-1">{formErrors.fullBody}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">Short Excerpt <span className="font-normal text-gray-400">(Optional — for listing preview)</span></label>
                <textarea rows={3} maxLength={500} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none"
                  placeholder="A 1-2 sentence summary (max 500 chars)" />
              </div>

              <hr className="border-gray-100" />

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <strong>Before submitting:</strong> Ensure your message is accurate and represents your institutional position. Once submitted it cannot be edited. The Secretariat will conduct identity, authority, and editorial review before publication.
              </div>

              <button type="submit" disabled={submitting}
                className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-base">
                {submitting ? <><FaSpinner className="animate-spin" /> Submitting…</> : "Submit Official Message"}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Your submission is cryptographically linked to invitation code ···{session!.codeDisplaySuffix} and cannot be attributed to another contributor.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
