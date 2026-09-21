import os

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\participate\ParticipateClient.tsx'

content = '''"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FaUserTie, FaCheckCircle, FaFileAlt, FaVideo, FaMicrophone, 
  FaFilePdf, FaImage, FaUpload, FaChartLine, FaShareAlt,
  FaArrowRight, FaArrowLeft, FaRegCheckCircle, FaLock, FaTags
} from 'react-icons/fa';

export default function ParticipateClient() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", district: "", organization: "", sector: "", age: "", gender: "" });
  const [consent, setConsent] = useState({ consent: false, policy: false, review: false });
  const [recommendations, setRecommendations] = useState({ challenge: "", opportunity: "", gov: "", industry: "", uni: "", hcrf: "" });
  const [additional, setAdditional] = useState({ hearings: false, validation: false, expert: false, updates: false, volunteer: false, fellowship: false });
  const [progress, setProgress] = useState(11);
  
  const categories = [
    "Artisan", "Manufacturer", "Exporter", "Retailer", 
    "Online Seller", "Citizen", "Youth", "Government", 
    "Researcher", "Political Party", "Institution"
  ];

  const getInstrumentConfig = (cat: string) => {
    switch(cat) {
      case "Artisan":
        return { count: 50, sections: ["Profile", "Current Situation", "Challenges", "Opportunities", "Institutional Support", "Future Priorities", "Recommendations", "Evidence & Documentation"] };
      case "Manufacturer":
        return { count: 40, sections: ["Business Profile", "Production Capacity", "Workforce", "Supply Chains", "Technology", "Markets", "Challenges", "Recommendations"] };
      case "Exporter":
        return { count: 40, sections: ["Export Profile", "Markets", "Buyer Trends", "Compliance", "Logistics", "Trade Barriers", "Future Opportunities"] };
      case "Retailer":
      case "Online Seller":
        return { count: 30, sections: ["Customer Demand", "Product Preferences", "Pricing", "Competition", "Marketing", "Future Outlook"] };
      case "Government":
        return { count: 25, sections: ["Policy Priorities", "Achievements", "Funding", "Export Promotion", "Skill Development", "Future Plans"] };
      case "Researcher":
        return { count: 30, sections: ["Research Gaps", "Data Availability", "Preservation", "Technology Adoption", "Policy Gaps"] };
      case "Youth":
      case "Citizen":
        return { count: 20, sections: ["Awareness", "Purchasing Behavior", "Trust & Authenticity", "Career Preferences", "Future Priorities"] };
      case "Political Party":
        return { count: 20, sections: ["Artisan Welfare", "Employment Generation", "Tourism Linkages", "Export Support", "Future Policy"] };
      case "Institution":
      default:
        return { count: 25, sections: ["Institution Role", "Current Involvement", "Research Activities", "Training Programs", "Recommendations"] };
    }
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
    setProgress(Math.min(100, progress + 11));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    setProgress(Math.max(0, progress - 11));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getWizardNav = () => (
    <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
      <button 
        onClick={handleBack} 
        disabled={step === 1}
        className={lex items-center gap-2 px-6 py-3 rounded-xl font-bold transition }
      >
        <FaArrowLeft /> Back
      </button>
      {step < 9 && (
        <button 
          onClick={handleNext} 
          className="flex items-center gap-2 px-8 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-secondary transition shadow-md"
        >
          {step === 8 ? "Submit Participation" : "Continue"} <FaArrowRight />
        </button>
      )}
    </div>
  );

  return (
    <main className="w-full bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-brand-dark pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/images/pattern.png')] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-brand-secondary uppercase border border-brand-secondary/30 rounded-full">
            OFFICIAL CONSULTATION
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Participation Portal</h1>
          
          {/* Progress Bar */}
          {step < 9 && (
            <div className="max-w-3xl mx-auto mt-12">
              <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
                <span>Step {step} of 8</span>
                <span>{progress}% Complete</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div className="bg-brand-secondary h-3 rounded-full transition-all duration-500 ease-out" style={{ width: ${progress}% }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">

          {/* STEP 1: Choose Stakeholder Category */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-black text-brand-dark mb-4 text-center">Step 1: Choose Your Path</h2>
              <p className="text-gray-600 text-center mb-10 font-medium">Select the category that best describes your relationship to Kashmir crafts.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {categories.map((cat) => (
                  <div 
                    key={cat} 
                    onClick={() => { setCategory(cat); setTimeout(handleNext, 300); }}
                    className={p-4 rounded-2xl border-2 cursor-pointer transition-all text-center flex flex-col items-center gap-3 }
                  >
                    <FaUserTie className={	ext-2xl } />
                    <span className="font-bold text-gray-800 text-xs">{cat}</span>
                  </div>
                ))}
              </div>
              {getWizardNav()}
            </div>
          )}

          {/* STEP 2: Create Participant Profile */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-black text-brand-dark mb-4">Step 2: Participant Profile</h2>
              <p className="text-gray-600 mb-8 font-medium">Basic information to officially log your participation in the 2026 assessment.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
                  <input type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder="E.g. Tariq Ahmad" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
                  <input type="email" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} placeholder="tariq@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Phone Number (Optional)</label>
                  <input type="tel" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="+91..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">District</label>
                  <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary" value={profile.district} onChange={e => setProfile({...profile, district: e.target.value})}>
                    <option value="">Select District</option>
                    <option value="Srinagar">Srinagar</option>
                    <option value="Budgam">Budgam</option>
                    <option value="Ganderbal">Ganderbal</option>
                    <option value="Anantnag">Anantnag</option>
                    <option value="Baramulla">Baramulla</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Organization / Business</label>
                  <input type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary" value={profile.organization} onChange={e => setProfile({...profile, organization: e.target.value})} placeholder="Company or independent" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Primary Craft Sector</label>
                  <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary" value={profile.sector} onChange={e => setProfile({...profile, sector: e.target.value})}>
                    <option value="">Select Sector</option>
                    <option value="Pashmina">Pashmina</option>
                    <option value="Carpet">Carpet Weaving</option>
                    <option value="Papier-Mache">Papier-Mâché</option>
                    <option value="Wood Carving">Wood Carving</option>
                    <option value="Copperware">Copperware</option>
                    <option value="General">General / All</option>
                  </select>
                </div>
              </div>
              {getWizardNav()}
            </div>
          )}

          {/* STEP 3: Eligibility & Consent */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-black text-brand-dark mb-4">Step 3: Participation Consent</h2>
              <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-2xl p-6 mb-8">
                <FaLock className="text-3xl text-brand-primary mb-4" />
                <p className="font-bold text-gray-800 mb-2">Data Protection & Privacy</p>
                <p className="text-sm text-gray-600 mb-2">Your responses may contribute to the official State of Kashmir Crafts 2026 Report.</p>
                <p className="text-sm text-gray-600 mb-2">Personal contact information remains strictly protected and will not be published.</p>
                <p className="text-sm text-gray-600">Only aggregated data and anonymized quotes will be used in public findings.</p>
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                  <input type="checkbox" className="w-5 h-5 accent-brand-primary" checked={consent.consent} onChange={e => setConsent({...consent, consent: e.target.checked})} />
                  <span className="font-medium text-gray-800">I voluntarily consent to participate in this assessment.</span>
                </label>
                <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                  <input type="checkbox" className="w-5 h-5 accent-brand-primary" checked={consent.policy} onChange={e => setConsent({...consent, policy: e.target.checked})} />
                  <span className="font-medium text-gray-800">I agree to the KHCRF evidence and data publication policy.</span>
                </label>
                <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                  <input type="checkbox" className="w-5 h-5 accent-brand-primary" checked={consent.review} onChange={e => setConsent({...consent, review: e.target.checked})} />
                  <span className="font-medium text-gray-800">I understand that submissions may be peer-reviewed for accuracy.</span>
                </label>
              </div>
              {getWizardNav()}
            </div>
          )}

          {/* STEP 4: Assessment Questionnaire (Consultation Instrument) */}
          {step === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-black text-brand-dark mb-4">Step 4: Consultation Instrument</h2>
              <p className="text-gray-600 mb-8 font-medium">Please complete the {category || "Stakeholder"} consultation instrument ({getInstrumentConfig(category || "Artisan").count} questions). This generates quantitative data, qualitative insights, and policy references.</p>
              
              <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
                {getInstrumentConfig(category || "Artisan").sections.map((section, i) => (
                  <div key={i} className={shrink-0 px-4 py-2 rounded-full text-xs font-bold border }>
                    {section}
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center min-h-[300px] flex flex-col justify-center items-center relative overflow-hidden">
                <FaFileAlt className="text-6xl text-gray-300 mb-6" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">Interactive Consultation Platform</h3>
                <p className="text-gray-500 max-w-md">In the live system, this interface renders the {getInstrumentConfig(category || "Artisan").count}-question dynamic assessment block for your stakeholder group.</p>
                <div className="mt-8 text-xs font-bold text-gray-400 bg-white px-4 py-2 rounded-full shadow-sm">Auto-saving...</div>
                
                {/* Auto-Tagging Indicator */}
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-200 shadow-sm text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-primary mb-1"><FaTags /> Auto-Tagging Engine</div>
                  <div className="text-[10px] text-gray-500">
                    <div><strong>Stakeholder:</strong> {category || "Artisan"}</div>
                    <div><strong>District:</strong> {profile.district || "Pending"}</div>
                    <div><strong>Craft:</strong> {profile.sector || "Pending"}</div>
                    <div><strong>Year:</strong> 2026</div>
                  </div>
                </div>
              </div>
              {getWizardNav()}
            </div>
          )}

          {/* STEP 5: Recommendations */}
          {step === 5 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-black text-brand-dark mb-4">Step 5: Your Recommendations</h2>
              <p className="text-gray-600 mb-8 font-medium">This is the most critical section. Your direct input shapes the policy recommendations in the final report.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">What is the biggest challenge facing the sector today?</label>
                  <textarea rows={3} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary resize-none" value={recommendations.challenge} onChange={e => setRecommendations({...recommendations, challenge: e.target.value})}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">What is the biggest opportunity for the future?</label>
                  <textarea rows={3} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary resize-none" value={recommendations.opportunity} onChange={e => setRecommendations({...recommendations, opportunity: e.target.value})}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">What action should the government take immediately?</label>
                  <textarea rows={3} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary resize-none" value={recommendations.gov} onChange={e => setRecommendations({...recommendations, gov: e.target.value})}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">What should universities or KHCRF study further?</label>
                  <textarea rows={3} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary resize-none" value={recommendations.uni} onChange={e => setRecommendations({...recommendations, uni: e.target.value})}></textarea>
                </div>
              </div>
              {getWizardNav()}
            </div>
          )}

          {/* STEP 6: Evidence Upload */}
          {step === 6 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-black text-brand-dark mb-4">Step 6: Upload Evidence (Optional)</h2>
              <p className="text-gray-600 mb-8 font-medium">Support your recommendations by submitting raw evidence. Acceptable files include photos of workshops, market surveys, PDF reports, or audio testimonies.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "PDF Reports", icon: FaFilePdf },
                  { label: "Photographs", icon: FaImage },
                  { label: "Video Clips", icon: FaVideo },
                  { label: "Audio Testimony", icon: FaMicrophone }
                ].map((item, idx) => (
                  <div key={idx} className="bg-brand-primary/5 rounded-xl p-4 text-center border border-brand-primary/20">
                    <item.icon className="text-2xl text-brand-secondary mx-auto mb-2" />
                    <div className="text-xs font-bold text-brand-dark">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-800 mb-2">Drag & Drop Files Here</h3>
                <p className="text-sm text-gray-500 mb-6">or click to browse from your device</p>
                <button className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 shadow-sm">Browse Files</button>
              </div>
              {getWizardNav()}
            </div>
          )}

          {/* STEP 7: Additional Options */}
          {step === 7 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-black text-brand-dark mb-4">Step 7: Additional Participation</h2>
              <p className="text-gray-600 mb-8 font-medium">Beyond this questionnaire, how else would you like to be involved in the 2026 assessment?</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'hearings', label: "Join a Public Hearing (Online)", desc: "Present your views live" },
                  { key: 'validation', label: "Join Validation Round", desc: "Review draft findings before release" },
                  { key: 'expert', label: "Join Expert Review Panel", desc: "For established industry experts" },
                  { key: 'updates', label: "Receive Email Updates", desc: "Get notified when reports launch" },
                  { key: 'volunteer', label: "Volunteer for KHCRF", desc: "Help with field data collection" },
                  { key: 'fellowship', label: "Apply for 2026 Fellowship", desc: "Join the official 90-day program" }
                ].map((item) => (
                  <label key={item.key} className="flex gap-4 p-5 border border-gray-200 rounded-xl cursor-pointer hover:border-brand-primary transition bg-gray-50">
                    <input type="checkbox" className="w-5 h-5 mt-1 accent-brand-primary" checked={additional[item.key as keyof typeof additional]} onChange={e => setAdditional({...additional, [item.key]: e.target.checked})} />
                    <div>
                      <div className="font-bold text-gray-900">{item.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              {getWizardNav()}
            </div>
          )}

          {/* STEP 8: Review & Submit */}
          {step === 8 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-black text-brand-dark mb-8 text-center">Step 8: Review & Submit</h2>
              
              <div className="space-y-6 mb-10">
                <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Participant Profile</h3>
                    <p className="text-sm text-gray-600">{profile.name || "Tariq Ahmad"} • {category || "Artisan"} • {profile.district || "Srinagar"}</p>
                  </div>
                  <button onClick={() => setStep(2)} className="text-brand-secondary text-sm font-bold hover:underline">Edit</button>
                </div>
                
                <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Questionnaire & Consent</h3>
                    <p className="text-sm text-green-600 font-medium flex items-center gap-2"><FaRegCheckCircle /> Completed securely</p>
                  </div>
                  <button onClick={() => setStep(4)} className="text-brand-secondary text-sm font-bold hover:underline">Edit</button>
                </div>

                <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Policy Recommendations</h3>
                    <p className="text-sm text-gray-600">4 responses recorded</p>
                  </div>
                  <button onClick={() => setStep(5)} className="text-brand-secondary text-sm font-bold hover:underline">Edit</button>
                </div>

                <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Supporting Evidence</h3>
                    <p className="text-sm text-gray-600">0 files attached</p>
                  </div>
                  <button onClick={() => setStep(6)} className="text-brand-secondary text-sm font-bold hover:underline">Edit</button>
                </div>
              </div>
              {getWizardNav()}
            </div>
          )}

          {/* STEP 9: Dashboard */}
          {step === 9 && (
            <div className="animate-fade-in py-8">
              <div className="text-center mb-12">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheckCircle className="text-5xl text-green-500" />
                </div>
                <h2 className="text-4xl font-black text-brand-dark mb-4">Submission Successful</h2>
                <p className="text-xl text-gray-600 font-medium">Your voice is now part of the State of Kashmir Crafts 2026 public consultation process.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-brand-dark text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
                  <FaChartLine className="absolute -right-4 -bottom-4 text-9xl text-white opacity-5" />
                  <div className="text-sm font-bold text-brand-secondary mb-2 uppercase tracking-wider">Official Receipt</div>
                  <h3 className="text-2xl font-black mb-6">Participation ID</h3>
                  <div className="font-mono text-xl bg-white/10 px-4 py-3 rounded-xl mb-6 inline-block">SKC-2026-{category ? category.substring(0,3).toUpperCase() : "ART"}-00125</div>
                  <div className="space-y-3 font-medium text-gray-300">
                    <div className="flex justify-between border-b border-white/10 pb-2"><span>Status</span><span className="text-white">Logged</span></div>
                    <div className="flex justify-between border-b border-white/10 pb-2"><span>Date</span><span className="text-white">July 18, 2026</span></div>
                    <div className="flex justify-between border-b border-white/10 pb-2"><span>Category</span><span className="text-white">{category || "Artisan"}</span></div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-8 rounded-3xl shadow-md">
                  <h3 className="text-xl font-black text-brand-dark mb-6 border-b border-gray-100 pb-4">Your Contribution Scorecard</h3>
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-gray-700 flex items-center gap-3"><FaFileAlt className="text-brand-secondary" /> Questionnaire</div>
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Completed</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-gray-700 flex items-center gap-3"><FaUpload className="text-brand-secondary" /> Evidence</div>
                      <span className="text-gray-500 font-bold text-sm">0 Uploads</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-gray-700 flex items-center gap-3"><FaShareAlt className="text-brand-secondary" /> Recommendations</div>
                      <span className="text-gray-500 font-bold text-sm">Submitted</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-gray-700 flex items-center gap-3"><FaMicrophone className="text-brand-secondary" /> Public Hearings</div>
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{additional.hearings ? "Registered" : "Opted Out"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-gray-700 flex items-center gap-3"><FaCheckCircle className="text-brand-secondary" /> Validation Round</div>
                      <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">Pending</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-3xl p-8 text-center">
                <h3 className="text-2xl font-black text-brand-dark mb-4">What happens next?</h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">You are now officially integrated into the assessment lifecycle. You will receive exclusive invitations to upcoming milestones based on your preferences.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/state-of-kashmir-crafts/public-hearings" className="px-6 py-3 bg-white text-brand-dark border border-gray-200 font-bold rounded-xl hover:border-brand-primary transition shadow-sm">View Public Hearings</Link>
                  <Link href="/state-of-kashmir-crafts/validation-round" className="px-6 py-3 bg-white text-brand-dark border border-gray-200 font-bold rounded-xl hover:border-brand-primary transition shadow-sm">View Validation Round</Link>
                  <Link href="/state-of-kashmir-crafts/draft-findings" className="px-6 py-3 bg-white text-brand-dark border border-gray-200 font-bold rounded-xl hover:border-brand-primary transition shadow-sm">Track Draft Findings</Link>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </main>
  );
}
'''

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ParticipateClient.tsx with 11 dynamic Consultation Instruments and Auto-Tagging system")
