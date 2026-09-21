"use client";

import { useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaCheckCircle, FaUpload } from "react-icons/fa";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ContributeResearchPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [submissionType, setSubmissionType] = useState("Research Paper");
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const subject = `[Research Proposal] ${submissionType}: ${title}`;
      const message = `Institution/Affiliation: ${institution || "None"}\n\nAbstract / Summary:\n${abstract}`;
      
      await api.post("/contact", {
        firstName,
        lastName,
        email,
        subject,
        message
      });
      
      setSubmitted(true);
    } catch (error) {
      toast.error("Failed to submit proposal. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 flex items-center justify-center px-4">
        <div className="text-center p-12 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 max-w-2xl w-full">
          <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle data-ui-icon  className="text-4xl " />
          </div>
          <h2 className="text-3xl font-serif font-black text-brand-dark mb-4">Proposal Submitted!</h2>
          <p className="text-gray-500 font-medium mb-8">
            Thank you for contributing to the preservation of Kashmir craft knowledge. Our editorial board will review your research proposal and contact you shortly.
          </p>
          <Link
            href="/publications"
            className="inline-flex items-center gap-2 bg-brand-dark text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider text-xs hover:bg-brand-primary transition-colors"
          >
            <FaArrowLeft /> Return to Library
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 mt-10 mb-32">
        <div className="mb-10">
          <Link href="/publications" className="text-xs font-black text-gray-400 hover:text-brand-primary uppercase tracking-widest flex items-center gap-2 mb-6">
            <FaArrowLeft /> Back to Publications
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-brand-dark leading-tight mb-4">
            Contribute <span className="text-brand-primary">Research</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Submit your research, case studies, or policy proposals to be considered for publication in the KHCRF Knowledge Hub. We welcome rigorous academic and practical insights.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  First Name
                </label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required type="text" className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none text-sm font-semibold bg-gray-50" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Last Name
                </label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} required type="text" className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none text-sm font-semibold bg-gray-50" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none text-sm font-semibold bg-gray-50" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Institution / Affiliation
                </label>
                <input value={institution} onChange={(e) => setInstitution(e.target.value)} type="text" className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none text-sm font-semibold bg-gray-50" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Submission Type
              </label>
              <select value={submissionType} onChange={(e) => setSubmissionType(e.target.value)} className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none text-sm font-semibold bg-white text-gray-700">
                <option>Research Paper</option>
                <option>Case Study</option>
                <option>Policy Brief</option>
                <option>Best Practice Guideline</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Proposal Title
              </label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required type="text" className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none text-sm font-semibold bg-gray-50" />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Abstract / Summary
              </label>
              <textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} required rows={5} className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none text-sm font-medium bg-gray-50 resize-none" placeholder="Provide a 200-300 word summary of your research..." />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-dark text-white font-black uppercase tracking-widest text-sm py-5 rounded-xl transition-all shadow-lg"
            >
              {submitting ? "Sending to Editorial Board..." : <><FaUpload /> Submit Proposal</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
