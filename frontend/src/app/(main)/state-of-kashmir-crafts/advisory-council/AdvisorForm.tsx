"use client";

import React, { useState } from "react";
import { FaUpload, FaCheckCircle, FaInfoCircle, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import api from "@/lib/api";

const DISTRICTS = [
  "Srinagar", "Anantnag", "Baramulla", "Bandipora", "Budgam",
  "Ganderbal", "Kulgam", "Kupwara", "Pulwama", "Shopian"
];

const CATEGORIES = [
  "Academic", "Government", "Policy Expert", "Economist", 
  "Heritage Expert", "Artisan", "Museum Professional", 
  "International Organization", "NGO", "Private Sector", 
  "Legal Expert", "Sustainability Expert", "Media Professional", 
  "Technology Expert", "Cultural Institution", "Independent Researcher"
];

export default function AdvisorForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    advisoryScope: "",
    email: "",
    phone: "",
    category: "",
    organization: "",
    district: "",
    statement: "",
    consentAccepted: false,
  });
  
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ applicationId: string; status: string } | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.advisoryScope) newErrors.advisoryScope = "Advisory Interest is required";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Valid Email is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.category) newErrors.category = "Category is required";
    if (formData.advisoryScope !== 'KHCRF' && !formData.district) newErrors.district = "District is required";
    if (!formData.statement || formData.statement.length < 50) newErrors.statement = "Statement must be at least 50 characters";
    if (!formData.consentAccepted) newErrors.consentAccepted = "You must agree to the terms";
    
    if (cvFile) {
      if (cvFile.type !== "application/pdf") newErrors.cvFile = "Only PDF files are allowed";
      if (cvFile.size > 5 * 1024 * 1024) newErrors.cvFile = "File must be under 5MB";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
      if (errors.cvFile) setErrors(prev => ({ ...prev, cvFile: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        submitData.append(key, String(val));
      });
      if (cvFile) {
        submitData.append("cvFile", cvFile);
      }

      // Use the Next.js proxy (/api/backend) — never hardcode port 4000
      const res = await api.post("/advisory/apply", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Backend returns bare { success, referenceNumber, submittedAt } — no data wrapper
      const payload = res.data?.data || res.data;
      setSuccessData({
        applicationId: payload?.referenceNumber || "N/A",
        status: payload?.status || "SUBMITTED",
      });
    } catch (err: any) {
      const body = err.response?.data?.data || err.response?.data;
      const msg = body?.message || body?.error || "";

      if (!err.response || err.message === "Network Error") {
        setErrors({ form: "We could not reach the application service. Please check your connection and try again." });
      } else if (err.response.status === 400) {
        setErrors({ form: msg || "Please review the highlighted fields and try again." });
      } else if (err.response.status === 409) {
        setErrors({ form: "An advisory application with these details already exists." });
      } else if (err.response.status === 413) {
        setErrors({ form: "The selected CV exceeds the 5 MB limit." });
      } else if (err.response.status === 415) {
        setErrors({ form: "Please upload a PDF file." });
      } else {
        setErrors({ form: msg || "We could not complete your application at this time. Please try again shortly." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="bg-brand-primary/5 p-8 md:p-12 rounded-3xl border border-brand-primary/20 text-center">
        <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
        <h3 className="text-3xl font-black text-brand-dark mb-4">✅ Thank you</h3>
        <p className="text-xl text-gray-700 mb-8 font-medium">Your advisory application has been received.</p>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-md mx-auto mb-8 text-left">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
            <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Reference Number</span>
            <span className="font-black text-brand-primary text-lg">{successData.applicationId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Status</span>
            <span className="font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm">{successData.status}</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-left mb-10 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-3">What happens next:</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm">
            <li>We'll review your application and contact you if additional information is required.</li>
            <li>Confirmed Advisory Council members will be published after consent and approval.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => { setSuccessData(null); setFormData({fullName: "", advisoryScope: "", email: "", phone: "", category: "", organization: "", district: "", statement: "", consentAccepted: false}); setCvFile(null); }}
            className="px-6 py-3 bg-white text-gray-700 font-bold border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm"
          >
            Submit Another Interest
          </button>
          <button
            onClick={() => {
              setSuccessData(null);
              setFormData({fullName: "", advisoryScope: "", email: "", phone: "", category: "", organization: "", district: "", statement: "", consentAccepted: false});
              setCvFile(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition shadow-md text-center"
          >
            Return to Advisory Council
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100">
       <form className="space-y-6" onSubmit={handleSubmit}>
          {errors.form && <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-bold mb-6">{errors.form}</div>}
          
          <div className="mb-6">
             <label className="block text-sm font-bold text-gray-700 mb-2">Advisory Interest *</label>
             <select name="advisoryScope" value={formData.advisoryScope} onChange={handleChange} className={`w-full p-4 bg-gray-50 border ${errors.advisoryScope ? 'border-red-400' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600`}>
               <option value="">Select Advisory Interest</option>
               <option value="KHCRF">KHCRF Advisory Council</option>
               <option value="SKC">State of Kashmir Crafts Advisory Council</option>
               <option value="BOTH">Both Advisory Councils</option>
             </select>
             {errors.advisoryScope && <p className="text-red-500 text-xs mt-1 font-bold">{errors.advisoryScope}</p>}
             
             {formData.advisoryScope === 'KHCRF' && (
               <div className="mt-3 bg-[#FBF8F1] border-l-4 border-[var(--card-left-accent)] p-3 rounded-r-lg flex items-start gap-2">
                 <FaInfoCircle data-ui-icon  className=" shrink-0 mt-0.5" />
                 <div>
                   <span className="block text-xs font-bold text-brand-dark mb-0.5">About this advisory role</span>
                   <p className="text-gray-600 text-xs leading-relaxed">Provide strategic guidance across KHCRF's mission, governance, policy, research, and institutional development.</p>
                 </div>
               </div>
             )}
             
             {formData.advisoryScope === 'SKC' && (
               <div className="mt-3 bg-[#FBF8F1] border-l-4 border-[var(--card-left-accent)] p-3 rounded-r-lg flex items-start gap-2">
                 <FaInfoCircle data-ui-icon  className=" shrink-0 mt-0.5" />
                 <div>
                   <span className="block text-xs font-bold text-brand-dark mb-0.5">About this advisory role</span>
                   <p className="text-gray-600 text-xs leading-relaxed">Support the State of Kashmir Crafts assessment through sector expertise, evidence review, methodology guidance, stakeholder engagement, and strategic recommendations.</p>
                 </div>
               </div>
             )}
             
             {formData.advisoryScope === 'BOTH' && (
               <div className="mt-3 bg-[#FBF8F1] border-l-4 border-[var(--card-left-accent)] p-3 rounded-r-lg flex items-start gap-2">
                 <FaInfoCircle data-ui-icon  className=" shrink-0 mt-0.5" />
                 <div>
                   <span className="block text-xs font-bold text-brand-dark mb-0.5">About this advisory role</span>
                   <p className="text-gray-600 text-xs leading-relaxed">Your application will be reviewed for suitability across KHCRF’s institutional advisory work and the State of Kashmir Crafts assessment.</p>
                 </div>
               </div>
             )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
               <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={`w-full p-4 bg-gray-50 border ${errors.fullName ? 'border-red-400' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50`} placeholder="Your Name" />
               {errors.fullName && <p className="text-red-500 text-xs mt-1 font-bold">{errors.fullName}</p>}
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
               <select name="category" value={formData.category} onChange={handleChange} className={`w-full p-4 bg-gray-50 border ${errors.category ? 'border-red-400' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600`}>
                 <option value="">Select Category</option>
                 <option value="Not Applicable">Not Applicable</option>
                 {CATEGORIES.map((cat: any) => (
                   <option key={cat} value={cat}>{cat}</option>
                 ))}
               </select>
               {errors.category && <p className="text-red-500 text-xs mt-1 font-bold">{errors.category}</p>}
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Organization / Institution</label>
               <input type="text" name="organization" value={formData.organization} onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50" placeholder="Optional" />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
               <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full p-4 bg-gray-50 border ${errors.email ? 'border-red-400' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50`} placeholder="you@example.com" />
               {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email}</p>}
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
               <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={`w-full p-4 bg-gray-50 border ${errors.phone ? 'border-red-400' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50`} placeholder="+91 00000 00000" />
               {errors.phone && <p className="text-red-500 text-xs mt-1 font-bold">{errors.phone}</p>}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">District {formData.advisoryScope !== 'KHCRF' ? '*' : '(Optional)'}</label>
               <select name="district" value={formData.district} onChange={handleChange} className={`w-full p-4 bg-gray-50 border ${errors.district ? 'border-red-400' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600`}>
                 <option value="">Select District</option>
                 {DISTRICTS.map((dist: any) => (
                   <option key={dist} value={dist}>{dist}</option>
                 ))}
               </select>
               {errors.district && <p className="text-red-500 text-xs mt-1 font-bold">{errors.district}</p>}
             </div>
          </div>
          
          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Statement of Interest *</label>
             <textarea name="statement" value={formData.statement} onChange={handleChange} rows={4} className={`w-full p-4 bg-gray-50 border ${errors.statement ? 'border-red-400' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none`} placeholder="Why do you wish to join the Advisory Council? (Min 50 characters)"></textarea>
             {errors.statement && <p className="text-red-500 text-xs mt-1 font-bold">{errors.statement}</p>}
             <div className="flex justify-between items-center mt-1">
               <p className="text-xs text-gray-400">Minimum 50 characters</p>
               <p className={`text-xs ${formData.statement.length < 50 ? 'text-red-400' : 'text-green-500'}`}>{formData.statement.length} entered</p>
             </div>
          </div>
          
          <div>
             <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
               <FaUpload className="text-gray-400" /> Curriculum Vitae / Resume (Optional)
             </label>
             <p className="text-xs text-gray-400 mb-3">PDF only • Maximum 5 MB</p>
             <input type="file" accept="application/pdf" onChange={handleFileChange} className="w-full p-3 bg-white border border-gray-200 rounded-[12px] text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-[12px] file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20 transition cursor-pointer" />
             {errors.cvFile && <p className="text-red-500 text-xs mt-1 font-bold">{errors.cvFile}</p>}
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
             <input type="checkbox" name="consentAccepted" checked={formData.consentAccepted} onChange={handleChange} id="consentAccepted" className="mt-1 w-5 h-5 accent-brand-primary shrink-0" />
             <label htmlFor="consentAccepted" className="text-sm text-gray-600">
               I consent to KHCRF holding and reviewing my application data for advisory roles within KHCRF, the State of Kashmir Crafts initiative, or both, according to the option I selected. I understand that submitting this form does not guarantee appointment or selection.
             </label>
          </div>
          {errors.consentAccepted && <p className="text-red-500 text-xs font-bold">{errors.consentAccepted}</p>}
          
          <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-brand-primary text-white font-black text-lg rounded-xl hover:bg-brand-secondary transition shadow-xl mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
            {isSubmitting ? <><FaSpinner className="animate-spin inline mr-2"/> Submitting...</> : "Submit Advisory Interest"}
          </button>
       </form>
    </div>
  );
}

