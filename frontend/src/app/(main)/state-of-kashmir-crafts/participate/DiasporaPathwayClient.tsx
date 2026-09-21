"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  FaCheckCircle, FaFileAlt, FaUpload, FaArrowRight, FaArrowLeft, FaInfoCircle, FaTimes
} from 'react-icons/fa';

const generateConsultationId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SKC-2026-DIA-${result}`;
};

export default function DiasporaPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_dia_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_dia_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_dia_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_dia_consultationData', JSON.stringify(consultationData));
    }
  }, [consultationData]);

  useEffect(() => {
    setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const interval = setInterval(() => {
       setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(interval);
  }, [consultationData]);

  const handleChange = (section: string, id: string, value: any) => {
    setConsultationData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [id]: value
      }
    }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (step === 1) {
      onBackToCategories();
    } else {
      setStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({ file: f, metadata: {} }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const renderField = (section: string, id: string, label: string, type: string, options?: string[], props?: any) => {
    const value = consultationData[section]?.[id];

    if (type === 'radio') {
       return (
         <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-4">
           <label className="block font-bold text-gray-900 mb-4">{label}</label>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             {options?.map((opt: string) => (
               <label key={opt} className="flex items-center gap-3 p-3 border border-gray-300 rounded-xl cursor-pointer bg-white hover:border-brand-primary transition">
                 <input type="radio" name={`${section}_${id}`} value={opt} checked={value === opt} onChange={() => handleChange(section, id, opt)} className="accent-brand-primary w-4 h-4" />
                 <span className="text-sm font-bold text-gray-700">{opt}</span>
               </label>
             ))}
           </div>
         </div>
       );
    }
    
    if (type === 'multiselect') {
       return (
         <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-4">
           <label className="block font-bold text-gray-900 mb-4">{label}</label>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
             {options?.map((opt: string) => {
               const isChecked = Array.isArray(value) && value.includes(opt);
               return (
                 <label key={opt} className="flex items-start gap-3 p-3 border border-gray-300 rounded-xl cursor-pointer bg-white hover:border-brand-primary transition">
                   <input type="checkbox" checked={isChecked} onChange={(e) => {
                     const curr = Array.isArray(value) ? value : [];
                     if (e.target.checked) handleChange(section, id, [...curr, opt]);
                     else handleChange(section, id, curr.filter((x: string) => x !== opt));
                   }} className="accent-brand-primary mt-1 w-4 h-4 shrink-0" />
                   <span className="text-sm font-bold text-gray-700 leading-tight">{opt}</span>
                 </label>
               );
             })}
           </div>
         </div>
       );
    }

    if (type === 'textarea') {
      return (
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">{label}</label>
          <textarea rows={3} value={value || ""} onChange={e => handleChange(section, id, e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary resize-none" {...props}></textarea>
        </div>
      );
    }

    if (type === 'select') {
      return (
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">{label}</label>
          <select value={value || ""} onChange={e => handleChange(section, id, e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary">
            <option value="" disabled>Select Option</option>
            {options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      );
    }

    return (
      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">{label}</label>
        <input type={type} value={value || ""} onChange={e => handleChange(section, id, e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-primary" {...props} />
      </div>
    );
  };

  const getWizardNav = () => (
    <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
      <button 
        onClick={handleBack} 
        className="flex items-center gap-2 px-6 py-3 rounded-[14px] font-bold transition bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        <FaArrowLeft /> {step === 1 ? 'Change Category' : 'Back'}
      </button>
      {step < 10 && (
        <button 
          onClick={handleNext} 
          className="flex items-center gap-2 px-8 py-3 bg-brand-primary text-white rounded-[14px] font-bold hover:bg-brand-secondary transition shadow-md"
        >
          {step === 9 ? "Review and Submit" : "Continue"} <FaArrowRight />
        </button>
      )}
    </div>
  );

  const isConsentValid = consultationData.consent?.respondentType && consultationData.consent?.submissionType;
  const isProfileValid = consultationData.profile?.country && consultationData.profile?.relationship;
  const isCultureValid = consultationData.culture?.connectionStrength;
  const isCraftsValid = consultationData.crafts?.engagement;
  const isBusinessValid = consultationData.business?.interestedIn;
  const isTechValid = consultationData.tech?.technologyHelp;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isVisionValid = consultationData.vision?.vision2030;
  const isRecommendationsValid = consultationData.recommendations?.gov;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isCultureValid, isCraftsValid, isBusinessValid, isTechValid, isChallengesValid, isVisionValid, isRecommendationsValid];
  const stepsCompleted = sectionsStatus.filter(Boolean).length;
  const progressPercent = Math.min(100, Math.floor((stepsCompleted / 9) * 100));

  const role = consultationData.consent?.respondentType;
  const isFirstGen = role === 'First-generation Diaspora';
  const isSecondThirdGen = role === 'Second-generation Diaspora' || role === 'Third-generation Diaspora';
  const isEntrepreneur = role === 'Entrepreneur';
  const isAcademic = role === 'Academic' || role === 'Researcher';
  
  const expertise = consultationData.business?.professionalExpertise || [];
  const isTech = expertise.includes('Technology') || expertise.includes('AI') || role === 'Technology professional';
  
  const engagement = consultationData.crafts?.engagement || [];
  const neverPurchased = engagement.includes('None') || (!engagement.includes('Purchased Kashmir handicrafts') && !engagement.includes('Gifted handicrafts'));

  return (
    <div className="animate-fade-in">
       {step < 11 && (
         <div className="bg-brand-dark pt-32 pb-16 relative overflow-hidden">
           
           <div className="container mx-auto px-4 relative z-10 text-center">
             <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-brand-secondary uppercase border border-brand-secondary/30 rounded-[12px]">
               GLOBAL COMMUNITY CONSULTATION
             </span>
             <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Participation Portal</h1>
             
             <div className="max-w-4xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
               <div className="flex items-center gap-4 text-left mb-4 md:mb-0">
                 <div className="bg-brand-primary/20 text-brand-secondary px-3 py-1 rounded-[10px] text-xs font-black uppercase tracking-wider border border-brand-secondary/30">
                   Diaspora Member
                 </div>
                 <div className="text-gray-300 text-sm font-bold hidden md:block">
                   Consultation ID: <span className="text-white font-mono">{consId}</span>
                 </div>
               </div>
               <div className="flex flex-col md:items-end w-full md:w-auto">
                 <div className="flex justify-between md:justify-end gap-6 text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide w-full">
                   <span className="text-brand-secondary">Progress Saved | {lastSaved}</span>
                   <span>Step {step} of 10 | {progressPercent}% complete</span>
                 </div>
                 <div className="w-full md:w-64 bg-white/10 rounded-full h-2 overflow-hidden">
                   <div className="bg-brand-secondary h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}

       <div className="container mx-auto px-4 -mt-8 relative z-20 pb-20">
         <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
            
            {/* STEP 1: Consent */}
            {step === 1 && (
              <div className="animate-fade-in-up">
                <div className="mb-10">
                  <h2 className="text-3xl font-black text-brand-dark mb-4">Step 1: Consent & Role</h2>
                  <div className="bg-blue-50 text-blue-900 p-5 rounded-2xl border border-blue-100 flex gap-4 text-sm font-medium leading-relaxed">
                    <FaInfoCircle className="text-blue-500 text-xl shrink-0 mt-0.5" />
                    <div>
                      <p className="mb-2">This consultation forms part of the State of Kashmir Crafts Assessment 2026–2027 initiative led by the Hamadan Craft Revival Foundation.</p>
                      <p>It is designed to map the experiences, professional expertise, and global networks of the Kashmiri diaspora. This is an evidence-based cultural and economic mapping initiative, not a donor registration or political survey.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'respondentType', 'Respondent Type', 'select', [
                  'First-generation Diaspora', 'Second-generation Diaspora', 'Third-generation Diaspora', 'Overseas Student', 'Overseas Professional', 'Entrepreneur', 'Academic', 'Researcher', 'Investor', 'Community Leader', 'Volunteer', 'Other'
                ])}
                
                {renderField('consent', 'submissionType', 'Submission Type', 'radio', [
                  'Personal Perspective',
                  'Family Perspective',
                  'Community Organization Perspective'
                ])}
                
                {renderField('consent', 'identity', 'Submission confidentiality preference', 'radio', [
                  'My name may be publicly identified in diaspora reports',
                  'My identity must remain confidential, but inputs can be used',
                  'Submission may be used only in anonymized, aggregate analysis'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact you regarding future global networks or mentorship initiatives?', 'radio', ['Yes', 'No'])}

                {consultationData.consent?.contact === 'Yes' && (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField('consent', 'contactName', 'Contact Name', 'text')}
                    {renderField('consent', 'contactEmail', 'Email', 'email')}
                    {renderField('consent', 'contactPhone', 'Phone', 'tel')}
                  </div>
                )}
                
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
                  <label className="block font-bold text-gray-900 mb-4">Mandatory Consent</label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check1 || false} onChange={e => handleChange('consent', 'check1', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I confirm my participation in this global engagement mapping initiative.</span>
                  </label>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 2: Diaspora Profile */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Diaspora Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {renderField('profile', 'country', 'Country of Residence', 'text')}
                  {renderField('profile', 'state', 'State / Province', 'text')}
                  {renderField('profile', 'city', 'City (Optional)', 'text')}
                </div>
                
                {renderField('profile', 'relationship', 'Relationship with Kashmir', 'select', [
                  'Born in Kashmir', 'Parents from Kashmir', 'Grandparents from Kashmir', 'Family Heritage', 'Married into Kashmiri Family', 'Other'
                ])}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('profile', 'yearsLivingAbroad', 'Years Living Abroad', 'select', [
                    '0-5 years', '6-10 years', '11-20 years', '20-30 years', '30+ years', 'Born Abroad'
                  ])}
                  {renderField('profile', 'profession', 'Profession (e.g., Engineer, Entrepreneur)', 'text')}
                </div>

                {/* Conditional Branching */}
                {isFirstGen && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Personal Experiences & Heritage</h3>
                    {renderField('profile', 'firstGenFocus', 'Optional: Briefly share any memories of traditional crafts or artisan communities from when you lived in Kashmir.', 'textarea')}
                  </div>
                )}
                
                {isSecondThirdGen && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Identity & Cultural Transmission</h3>
                    {renderField('profile', 'secondGenFocus', 'How do you navigate your Kashmiri heritage, and how is cultural identity transmitted to the younger generation in your community?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Cultural Connection & Heritage */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Cultural Connection & Heritage</h2>

                {renderField('culture', 'connectionStrength', 'How connected do you feel to Kashmir?', 'radio', [
                  'Very Strong', 'Strong', 'Moderate', 'Limited', 'Minimal'
                ])}
                
                {renderField('culture', 'connectionMethods', 'How do you stay connected?', 'multiselect', [
                  'Family', 'Community Organizations', 'Social Media', 'Visits', 'Cultural Events', 'Language', 'Food', 'Music', 'Literature', 'Handicrafts', 'Religious Institutions', 'Other'
                ])}
                
                {renderField('culture', 'language', 'Language(s) Spoken', 'multiselect', [
                  'Kashmiri', 'Urdu', 'Hindi', 'English', 'Other'
                ])}
                
                {renderField('culture', 'craftKnowledge', 'Knowledge of Kashmir Handicrafts', 'radio', [
                  'Extensive', 'Good', 'Basic', 'Limited', 'None'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Crafts, Tourism & Community Engagement */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Crafts, Tourism & Community Engagement</h2>

                {renderField('crafts', 'engagement', 'Have you ever:', 'multiselect', [
                  'Purchased Kashmir handicrafts', 'Gifted handicrafts', 'Visited artisan workshops', 'Visited museums', 'Recommended Kashmir crafts', 'Participated in exhibitions', 'Promoted crafts internationally', 'None'
                ])}
                
                {!neverPurchased && (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-gray-800 mb-4">Consumer Experience</h3>
                    {renderField('crafts', 'consumerFocus', 'What factors influence your decision to purchase or gift Kashmir handicrafts while living abroad? (e.g., authenticity, shipping, design)', 'textarea')}
                  </div>
                )}
                
                {neverPurchased && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Craft Awareness</h3>
                    {renderField('crafts', 'barrierFocus', 'Since you have not engaged directly with Kashmir crafts, what are the primary barriers? (e.g., lack of awareness, difficulty buying, shipping concerns)', 'textarea')}
                  </div>
                )}

                {renderField('crafts', 'tourismReasons', 'Would you visit Kashmir for:', 'multiselect', [
                  'Heritage Tourism', 'Craft Tourism', 'Family', 'Research', 'Business', 'Volunteer Work', 'Festivals', 'Education', 'Other'
                ])}
                
                {renderField('crafts', 'preventEngagement', 'What prevents greater engagement?', 'multiselect', [
                  'Distance', 'Limited Information', 'Travel', 'Trust', 'Authenticity Concerns', 'Limited Opportunities', 'Time', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Business, Investment & Professional Contribution */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Business, Investment & Professional Contribution</h2>

                {renderField('business', 'interestedIn', 'Interested in:', 'multiselect', [
                  'Buying Crafts', 'Business Partnerships', 'Mentorship', 'Startup Support', 'Investment', 'Export Promotion', 'International Marketing', 'Technology Transfer', 'Research Collaboration', 'Education', 'Scholarships', 'Tourism Promotion', 'Policy Dialogue', 'Philanthropy', 'Other'
                ])}
                
                {renderField('business', 'professionalExpertise', 'Professional Expertise', 'multiselect', [
                  'Technology', 'Finance', 'Business', 'Marketing', 'Design', 'AI', 'Law', 'Medicine', 'Education', 'Tourism', 'Heritage', 'Sustainability', 'Research', 'Media', 'Government', 'Other'
                ])}
                
                {renderField('business', 'preferredContribution', 'Preferred Contribution Method', 'multiselect', [
                  'Time', 'Knowledge', 'Mentorship', 'Networking', 'Funding', 'Market Access', 'Training', 'Volunteerism', 'Other'
                ])}

                {/* Conditional Branching */}
                {isEntrepreneur && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">International Business & Exports</h3>
                    {renderField('business', 'entrepreneurFocus', 'What specific market access or supply-chain barriers exist for exporting Kashmir crafts to your country of residence?', 'textarea')}
                  </div>
                )}
                
                {isAcademic && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Research & Knowledge Exchange</h3>
                    {renderField('business', 'academicFocus', 'How could your academic institution or research network collaborate with universities or museums in Kashmir?', 'textarea')}
                  </div>
                )}
                
                {consultationData.business?.interestedIn?.includes('Mentorship') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Mentorship & Expert Network</h3>
                    {renderField('business', 'mentorshipFocus', 'What skills or knowledge would you be most passionate about transferring to young artisans or craft startups?', 'textarea')}
                  </div>
                )}

                {consultationData.business?.interestedIn?.includes('Philanthropy') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Philanthropic Support</h3>
                    {renderField('business', 'philanthropyFocus', 'Are you interested in supporting specific initiatives such as artisan healthcare, scholarships for artisan children, or heritage conservation? Please detail.', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Technology, Innovation & Global Networks */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Technology, Innovation & Global Networks</h2>

                {renderField('tech', 'technologyHelp', 'Could technology help through:', 'multiselect', [
                  'AI', 'Digital Museums', 'Global Marketplace', 'Blockchain Authentication', 'Digital Archives', 'Online Learning', 'Virtual Exhibitions', 'Digital Storytelling', 'Mobile Apps', 'GIS', 'Other'
                ])}
                
                {renderField('tech', 'interestedNetworks', 'Interested in joining:', 'multiselect', [
                  'Global Expert Network', 'Diaspora Mentorship Network', 'Annual Global Summit', 'Research Collaboration', 'Business Network', 'Investment Forum', 'Innovation Challenge', 'Volunteer Network', 'Other'
                ])}

                {/* Conditional Branching */}
                {isTech && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Digital Heritage & Innovation</h3>
                    {renderField('tech', 'techFocus', 'Given your technology background, how could AI, Blockchain, or Digital Platforms be practically deployed to solve supply chain or authenticity issues in Kashmir crafts?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Challenges & Opportunities */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Challenges & Opportunities</h2>

                {renderField('challenges', 'topChallenges', 'Top Challenges for the Sector Globally', 'multiselect', [
                  'Limited Global Awareness', 'Weak Branding', 'Counterfeit Products', 'Market Access', 'Digital Presence', 'Heritage Preservation', 'Youth Engagement', 'Investment Opportunities', 'Tourism', 'Information Gap', 'International Shipping', 'Other'
                ])}
                
                {renderField('challenges', 'opportunity', 'What is the biggest global opportunity for Kashmir handicrafts? (Open response)', 'textarea')}
                
                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Future Vision */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Future Vision</h2>

                {renderField('vision', 'vision2030', 'How should Kashmir handicrafts evolve by 2030, 2035, and 2040?', 'textarea')}
                
                {renderField('vision', 'establishments', 'Should Kashmir establish:', 'multiselect', [
                  'Global Diaspora Network', 'International Craft Centers', 'Digital Heritage Platform', 'Craft Investment Forum', 'Global Mentorship Program', 'International Fellowships', 'Annual Diaspora Summit', 'Global Marketplace', 'Craft Innovation Fund', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'gov', 'Recommendations for Government & Policymakers', 'textarea')}
                {renderField('recommendations', 'industry', 'Recommendations for Manufacturers, Exporters & Technology Companies', 'textarea')}
                {renderField('recommendations', 'community', 'Recommendations for Diaspora Organizations, Universities & Artisans', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence & Documentation Upload</h3>
                  <p className="text-sm text-gray-600 mb-4">Diaspora members may upload Family Archives, Historical Photographs, Community Publications, Research, Business Ideas, Market Studies, or Heritage Documentation.</p>
                  
                  <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-brand-primary text-icon-on-light rounded-xl font-bold hover:bg-brand-primary hover:text-white transition">
                    <FaUpload /> Upload Files
                  </button>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-6 space-y-3">
                      {uploadedFiles.map((uf, idx) => (
                        <div key={idx} className="flex flex-col bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-gray-800 flex items-center gap-2"><FaFileAlt data-ui-icon  className=""/> {uf.file.name}</span>
                            <button onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700"><FaTimes /></button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                            <select className="text-xs p-2 border border-gray-300 rounded w-full" defaultValue="">
                              <option value="" disabled>Select Document Type...</option>
                              <option>Historical Photograph / Archive</option>
                              <option>Community Publication / Research</option>
                              <option>Business Idea / Market Study</option>
                              <option>Oral History / Video</option>
                              <option>Innovation Concept / Article</option>
                              <option>Other</option>
                            </select>
                            <input type="text" placeholder="Title / Year / Country" className="text-xs p-2 border border-gray-300 rounded w-full" />
                            <select className="text-xs p-2 border border-gray-300 rounded w-full md:col-span-2" defaultValue="">
                              <option value="" disabled>Select Permissions...</option>
                              <option>Publicly available for policy portal</option>
                              <option>For KHCRF internal analysis only</option>
                              <option>Contact me before use</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 10: Review and Submit */}
            {step === 10 && (
              <div className="animate-fade-in-up">
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCheckCircle className="text-4xl" />
                  </div>
                  <h2 className="text-4xl font-black text-brand-dark mb-4">Review Your Contribution</h2>
                  <p className="text-gray-600 text-lg">Your global community consultation response is ready. Please review the details before submitting.</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mb-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-black text-brand-primary">{stepsCompleted}/9</div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Sections Completed</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-brand-secondary">{uploadedFiles.length}</div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Files Attached</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xl font-mono font-bold text-gray-800">{consId}</div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Consultation ID</div>
                    </div>
                  </div>
                  
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase">Submission Completeness</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs font-medium">
                      <span className={isConsentValid ? "text-green-600" : "text-gray-400"}>Consent</span>
                      <span className={isProfileValid ? "text-green-600" : "text-gray-400"}>Profile</span>
                      <span className={isCultureValid ? "text-green-600" : "text-gray-400"}>Culture</span>
                      <span className={isCraftsValid ? "text-green-600" : "text-gray-400"}>Crafts/Tourism</span>
                      <span className={isBusinessValid ? "text-green-600" : "text-gray-400"}>Business/Exp</span>
                      <span className={isTechValid ? "text-green-600" : "text-gray-400"}>Tech/Networks</span>
                      <span className={isChallengesValid ? "text-green-600" : "text-gray-400"}>Challenges</span>
                      <span className={isVisionValid ? "text-green-600" : "text-gray-400"}>Vision</span>
                      <span className={isRecommendationsValid ? "text-green-600" : "text-gray-400"}>Recommendations</span>
                      <span className={uploadedFiles.length > 0 ? "text-green-600" : "text-gray-400"}>Evidence</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 flex-wrap gap-4">
                  <button onClick={() => setStep(9)} className="flex items-center gap-2 px-6 py-3 rounded-[14px] font-bold transition bg-gray-100 text-gray-700 hover:bg-gray-200">
                    <FaArrowLeft /> Back to Editing
                  </button>
                  <button onClick={() => alert("Draft downloaded.")} className="flex items-center gap-2 px-6 py-3 rounded-[14px] font-bold transition bg-gray-100 text-gray-700 hover:bg-gray-200">
                    Download Draft
                  </button>
                  <button onClick={async () => {
                      try {
                        const payload = {
                          participantType: "Diaspora",
                          district: consultationData?.profile?.district || "Unknown",
                          rawConsultationData: consultationData || {}
                        };
                        const formData = new FormData();
                        formData.append("payload", JSON.stringify(payload));
                        if (typeof uploadedFiles !== 'undefined' && uploadedFiles.length > 0) {
                          uploadedFiles.forEach((f: any) => formData.append("evidenceFiles", f.file || f));
                        }
                        const res = await fetch("/api/backend/consultation/submit", { method: "POST", body: formData });
                        if (res.ok) {
                          alert("Submission Successful!");
                          window.location.href = '/state-of-kashmir-crafts/participate';
                        } else {
                          alert("Submission Failed.");
                        }
                      } catch (e) {
                        alert("Submission Error.");
                      }
                    }} className="flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-[14px] font-bold hover:bg-green-700 transition shadow-lg text-lg">
                    Submit Contribution <FaCheckCircle />
                  </button>
                </div>
              </div>
            )}
            
         </div>
       </div>
    </div>
  );
}
