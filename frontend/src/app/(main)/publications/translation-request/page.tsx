"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { FaGlobe, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

function TranslationRequestForm() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "your preferred language";
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [publication, setPublication] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const subject = `[Translation Request] ${lang}`;
      const message = `Requested Language: ${lang}\nSpecific Publication: ${publication || "General Library"}`;
      
      const parts = fullName.trim().split(" ");
      const firstName = parts[0];
      const lastName = parts.slice(1).join(" ") || "N/A";
      
      await api.post("/contact", {
        firstName,
        lastName,
        email,
        subject,
        message
      });
      
      setSubmitted(true);
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-10 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 max-w-2xl mx-auto mt-20">
        <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle data-ui-icon  className="text-4xl " />
        </div>
        <h2 className="text-3xl font-black text-brand-dark mb-4">Request Received!</h2>
        <p className="text-gray-500 font-medium mb-8">
          Thank you. Our editorial board has logged your request for the {lang} translation of our publications. We will notify you via email once the translated edition is available.
        </p>
        <Link
          href="/publications"
          className="inline-flex items-center gap-2 bg-brand-dark text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider text-xs hover:bg-brand-primary transition-colors"
        >
          <FaArrowLeft /> Return to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 mt-20 mb-32">
      <div className="mb-8">
        <Link href="/publications" className="text-xs font-black text-gray-400 hover:text-brand-primary uppercase tracking-widest flex items-center gap-2 mb-6">
          <FaArrowLeft /> Back to Publications
        </Link>
        <h1 className="text-4xl font-black text-brand-dark leading-tight mb-4">
          Request <span className="text-brand-primary">{lang}</span> Translation
        </h1>
        <p className="text-gray-500 font-medium text-lg">
          Currently, our full digital library is available in English. Please fill out this form to request access to the {lang} edition, and we will prioritize its localization.
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Full Name
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              required
              className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none text-sm font-semibold bg-gray-50"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none text-sm font-semibold bg-gray-50"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Requested Language
            </label>
            <div className="relative">
              <FaGlobe className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={lang}
                readOnly
                className="w-full pl-12 pr-5 py-4 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 text-sm font-bold outline-none cursor-not-allowed"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Specific Publication (Optional)
            </label>
            <input
              value={publication}
              onChange={(e) => setPublication(e.target.value)}
              type="text"
              className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none text-sm font-semibold bg-gray-50"
              placeholder="e.g. Kashmir Craft Best Practices"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-primary hover:bg-brand-dark text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all mt-4"
          >
            {submitting ? "Submitting Request..." : "Submit Translation Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function TranslationRequestPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <Suspense fallback={<div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest">Loading...</div>}>
        <TranslationRequestForm />
      </Suspense>
    </div>
  );
}
