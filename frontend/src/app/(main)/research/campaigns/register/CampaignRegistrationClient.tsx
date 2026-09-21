"use client";

import React, { useState } from "react";
import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";
import { motion } from "framer-motion";
import { FaUserPlus, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function CampaignRegistrationClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    district: "",
    organization: "",
    website: "",
    linkedin: "",
    applicantType: "",
    areasOfInterest: [] as string[],
    skills: [] as string[],
    whyJoin: "",
    experience: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const APPLICANT_TYPES = [
    "Individual Supporter",
    "Volunteer",
    "Researcher",
    "Academic",
    "NGO",
    "Artisan Organization",
    "Industry Association",
    "Journalist",
    "Legal Expert",
    "Policy Expert",
    "Corporate Partner",
    "Student",
    "Campaign Coordinator",
  ];

  const AREAS_OF_INTEREST = [
    "Artisan Welfare",
    "Pashmina Protection",
    "GI Enforcement",
    "Anti-Counterfeit Campaigns",
    "Women Artisan Rights",
    "Child Labour Prevention",
    "Sustainable Craft Production",
    "Fair Trade",
    "Market Access",
    "Export Promotion",
    "Craft Education",
    "Cultural Heritage Protection",
    "Climate & Craft Resilience",
  ];

  const SKILLS = [
    "Research",
    "Writing",
    "Social Media",
    "Graphic Design",
    "Video Production",
    "Translation",
    "Public Speaking",
    "Event Management",
    "Policy Analysis",
    "Legal Support",
    "Community Outreach",
    "Fundraising",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field: "areasOfInterest" | "skills", value: string) => {
    setFormData((prev) => {
      const currentList = prev[field];
      if (currentList.includes(value)) {
        return { ...prev, [field]: currentList.filter((item) => item !== value) };
      } else {
        return { ...prev, [field]: [...currentList, value] };
      }
    });
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-roboto">
      <UniversalEditorialHero pageKey="auto-generated-CampaignRegistrationClient" fallbackConfig={{
          id: 'auto-generated-CampaignRegistrationClient-fallback',
          pageKey: 'auto-generated-CampaignRegistrationClient',
          autoplayEnabled: false,
          autoplayIntervalMs: 6000,
          slides: [
            {
              id: 'slide-1',
              internalName: 'Auto Slide',
              eyebrow: 'RESEARCH & POLICY',
              titleLineOne: 'CAMPAIGN PARTNER APPLICATION',
              titleConnector: '',
              titleLineTwo: 'ENROLLMENT',
              description: 'Join KHCRF'
            }
          ]
        }} />

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-10 md:p-16 rounded-3xl shadow-xl text-center border border-stone-100"
            >
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <FaCheckCircle className="text-5xl" />
              </div>
              <h2 className="text-3xl font-playfair font-black text-stone-900 mb-4">
                Application Submitted Successfully
              </h2>
              <p className="text-stone-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Thank you for applying to the KHCRF Campaign Partner Network. Your application has been received and is currently marked as <strong className="text-amber-600">Pending Review</strong>.
              </p>
              <div className="bg-[#fdfbf7] border border-amber-200/50 rounded-2xl p-6 inline-block mb-10">
                <span className="block text-stone-500 text-sm font-bold uppercase tracking-widest mb-2">Temporary Partner ID</span>
                <span className="text-2xl font-black text-stone-900">KHCRF-CP-2026-PENDING</span>
              </div>
              <div>
                <a href="/research/campaigns" className="inline-block px-8 py-4 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors">
                  Return to Campaigns
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg border border-stone-100 overflow-hidden">
              {/* Progress Steps */}
              <div className="bg-[#fdfbf7] p-8 border-b border-stone-100">
                <div className="flex items-center justify-between mb-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${
                          currentStep >= step
                            ? "bg-stone-900 text-white"
                            : "bg-stone-200 text-stone-400"
                        }`}
                      >
                        {step}
                      </div>
                      <span className={`text-xs font-bold mt-2 uppercase tracking-widest ${currentStep >= step ? "text-stone-900" : "text-stone-400"}`}>
                        {step === 1 ? "Identity" : step === 2 ? "Role" : step === 3 ? "Skills" : "Review"}
                      </span>
                    </div>
                  ))}
                  {/* Progress Line */}
                  <div className="absolute top-12 left-10 right-10 h-1 bg-stone-200 -z-0">
                    <div
                      className="h-full bg-stone-900 transition-all duration-300"
                      style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12">
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Identity */}
                  {currentStep === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <h3 className="text-2xl font-playfair font-black text-stone-900 mb-6">Identity & Contact</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-bold text-stone-700 mb-2">First Name *</label>
                          <input required type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors" placeholder="e.g. Tariq" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-stone-700 mb-2">Last Name *</label>
                          <input required type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors" placeholder="e.g. Bhat" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-stone-700 mb-2">Email Address *</label>
                          <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors" placeholder="tariq@example.com" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-stone-700 mb-2">Phone Number *</label>
                          <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors" placeholder="+91 98765 43210" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-stone-700 mb-2">Country</label>
                          <input type="text" name="country" value={formData.country} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-brand-primary outline-none" placeholder="e.g. India" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-stone-700 mb-2">State & District</label>
                          <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-brand-primary outline-none" placeholder="e.g. J&K, Srinagar" />
                        </div>
                      </div>
                      
                      <hr className="border-stone-100 my-8" />
                      
                      <h4 className="text-lg font-bold text-stone-900 mb-4">Professional Presence (Optional)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-stone-700 mb-2">Organization</label>
                          <input type="text" name="organization" value={formData.organization} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-stone-300 outline-none" placeholder="Company, NGO, or Institution" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-stone-700 mb-2">LinkedIn URL</label>
                          <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-stone-300 outline-none" placeholder="https://linkedin.com/in/..." />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Role & Interest */}
                  {currentStep === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <h3 className="text-2xl font-playfair font-black text-stone-900 mb-6">Applicant Type & Interests</h3>
                      
                      <div className="mb-8">
                        <label className="block text-sm font-bold text-stone-700 mb-3">Applicant Type *</label>
                        <select required name="applicantType" value={formData.applicantType} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-colors bg-white">
                          <option value="">Select your primary role...</option>
                          {APPLICANT_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-8">
                        <label className="block text-sm font-bold text-stone-700 mb-3">Areas of Interest (Select multiple)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {AREAS_OF_INTEREST.map(area => (
                            <label key={area} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${formData.areasOfInterest.includes(area) ? "bg-amber-50 border-amber-300" : "bg-white border-stone-200 hover:border-stone-300"}`}>
                              <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={formData.areasOfInterest.includes(area)}
                                onChange={() => handleCheckboxChange("areasOfInterest", area)}
                              />
                              <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${formData.areasOfInterest.includes(area) ? "bg-amber-500 border-amber-500" : "border-stone-300"}`}>
                                {formData.areasOfInterest.includes(area) && <FaCheckCircle className="text-white text-xs" />}
                              </div>
                              <span className={`text-sm ${formData.areasOfInterest.includes(area) ? "font-bold text-amber-900" : "text-stone-600"}`}>{area}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Skills & Experience */}
                  {currentStep === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <h3 className="text-2xl font-playfair font-black text-stone-900 mb-6">Skills & Experience</h3>
                      
                      <div className="mb-8">
                        <label className="block text-sm font-bold text-stone-700 mb-3">What skills can you contribute? (Select multiple)</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {SKILLS.map(skill => (
                            <label key={skill} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-colors ${formData.skills.includes(skill) ? "bg-stone-900 border-stone-900 text-white" : "bg-white border-stone-200 hover:border-stone-300 text-stone-600"}`}>
                              <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={formData.skills.includes(skill)}
                                onChange={() => handleCheckboxChange("skills", skill)}
                              />
                              <span className="text-sm font-bold">{skill}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-bold text-stone-700 mb-2">Why do you want to join the network? *</label>
                        <textarea required name="whyJoin" value={formData.whyJoin} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-brand-primary outline-none transition-colors" placeholder="Share your motivation..." />
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-bold text-stone-700 mb-2">Relevant Experience (Optional)</label>
                        <p className="text-xs text-stone-500 mb-2">Previous campaigns, advocacy work, volunteer experience, or publications.</p>
                        <textarea name="experience" value={formData.experience} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-brand-primary outline-none transition-colors" placeholder="Detail your background..." />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Review */}
                  {currentStep === 4 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                      <h3 className="text-2xl font-playfair font-black text-stone-900 mb-6">Review Application</h3>
                      
                      <div className="bg-[#fdfbf7] p-6 rounded-2xl border border-stone-200 mb-8 space-y-4">
                        <div className="grid grid-cols-2 border-b border-stone-100 pb-4">
                          <span className="text-stone-500 text-sm font-bold uppercase">Name</span>
                          <span className="text-stone-900 font-bold">{formData.firstName} {formData.lastName}</span>
                        </div>
                        <div className="grid grid-cols-2 border-b border-stone-100 pb-4">
                          <span className="text-stone-500 text-sm font-bold uppercase">Email</span>
                          <span className="text-stone-900 font-bold">{formData.email}</span>
                        </div>
                        <div className="grid grid-cols-2 border-b border-stone-100 pb-4">
                          <span className="text-stone-500 text-sm font-bold uppercase">Type</span>
                          <span className="text-stone-900 font-bold">{formData.applicantType || "Not specified"}</span>
                        </div>
                        <div className="grid grid-cols-2 border-b border-stone-100 pb-4">
                          <span className="text-stone-500 text-sm font-bold uppercase">Interests</span>
                          <span className="text-stone-900 font-bold">{formData.areasOfInterest.length} selected</span>
                        </div>
                        <div className="grid grid-cols-2 pb-2">
                          <span className="text-stone-500 text-sm font-bold uppercase">Skills</span>
                          <span className="text-stone-900 font-bold">{formData.skills.length} selected</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-8">
                        <FaExclamationTriangle className="text-amber-500 text-xl mt-0.5" />
                        <div>
                          <h4 className="font-bold text-amber-900 mb-1">Approval Workflow</h4>
                          <p className="text-amber-800 text-sm">Upon submission, your application will be reviewed by the KHCRF Campaign Administrators. You will be notified via email regarding your approval and Role-Based System assignment.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between mt-10 pt-6 border-t border-stone-100">
                    {currentStep > 1 ? (
                      <button type="button" onClick={prevStep} className="px-6 py-3 bg-white border border-stone-300 text-stone-600 font-bold rounded-xl hover:bg-stone-50 transition-colors">
                        Back
                      </button>
                    ) : (
                      <div></div>
                    )}
                    
                    {currentStep < 4 ? (
                      <button type="button" onClick={nextStep} className="px-8 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors shadow-md">
                        Continue
                      </button>
                    ) : (
                      <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-md flex items-center gap-2">
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
