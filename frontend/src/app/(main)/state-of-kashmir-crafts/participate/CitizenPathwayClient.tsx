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
  return `SKC-2026-CIT-${result}`;
};

export default function CitizenPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_cit_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_cit_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_cit_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_cit_consultationData', JSON.stringify(consultationData));
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
  const isAwarenessValid = consultationData.awareness?.familiarity;
  const isCommunityValid = consultationData.community?.importance;
  const isHeritageValid = consultationData.heritage?.values;
  const isTechValid = consultationData.tech?.support;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isVisionValid = consultationData.vision?.vision2030;
  const isRecommendationsValid = consultationData.recommendations?.gov;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isAwarenessValid, isCommunityValid, isHeritageValid, isTechValid, isChallengesValid, isVisionValid, isRecommendationsValid];
  const stepsCompleted = sectionsStatus.filter(Boolean).length;
  const progressPercent = Math.min(100, Math.floor((stepsCompleted / 9) * 100));

  return (
    <div className="animate-fade-in">
       {step < 11 && (
         <div className="bg-brand-dark pt-32 pb-16 relative overflow-hidden">
           
           <div className="container mx-auto px-4 relative z-10 text-center">
             <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-brand-secondary uppercase border border-brand-secondary/30 rounded-[12px]">
               PUBLIC CONSULTATION
             </span>
             <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Participation Portal</h1>
             
             <div className="max-w-4xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
               <div className="flex items-center gap-4 text-left mb-4 md:mb-0">
                 <div className="bg-brand-primary/20 text-brand-secondary px-3 py-1 rounded-[10px] text-xs font-black uppercase tracking-wider border border-brand-secondary/30">
                   Citizen Consultation
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
                  <h2 className="text-3xl font-black text-brand-dark mb-4">Step 1: Consent</h2>
                  <div className="bg-blue-50 text-blue-900 p-5 rounded-2xl border border-blue-100 flex gap-4 text-sm font-medium leading-relaxed">
                    <FaInfoCircle className="text-blue-500 text-xl shrink-0 mt-0.5" />
                    <div>
                      <p className="mb-2">This consultation forms part of the State of Kashmir Crafts Assessment 2026–2027 initiative led by the Hamadan Craft Revival Foundation.</p>
                      <p>It is a structured public consultation designed to collect observations, experiences, local knowledge, cultural memories, and recommendations from citizens. It is not a test of knowledge, public opinion poll, or grievance portal.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'respondentType', 'Respondent Type', 'select', [
                  'Resident', 'Citizen originally from Kashmir', 'Citizen living outside Kashmir', 'Indian citizen', 'International citizen', 'Tourist', 'Consumer', 'Artisan family member', 'Community volunteer', 'Other'
                ])}
                
                {renderField('consent', 'submissionType', 'Submission Type', 'radio', [
                  'Personal Perspective',
                  'Community Perspective',
                  'Family Perspective'
                ])}
                
                {renderField('consent', 'identity', 'Submission confidentiality preference', 'radio', [
                  'I may be publicly identified as a contributor',
                  'My name must remain confidential, but inputs and stories can be used',
                  'Submission may be used only in anonymized, aggregate analysis'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact you regarding future community events or civic roundtables?', 'radio', ['Yes', 'No'])}

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
                    <span className="text-sm font-bold text-gray-700">I understand the public consultation purpose of this instrument.</span>
                  </label>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 2: Citizen Profile */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Citizen Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {renderField('profile', 'country', 'Country', 'text')}
                  {renderField('profile', 'state', 'State / Province', 'text')}
                  {renderField('profile', 'district', 'District (Optional)', 'text')}
                </div>
                
                {renderField('profile', 'ageGroup', 'Age Group', 'select', [
                  'Under 18', '18–24', '25–34', '35–44', '45–59', '60+'
                ])}
                
                {renderField('profile', 'occupation', 'Occupation', 'select', [
                  'Teacher', 'Engineer', 'Doctor', 'Homemaker', 'Business Owner', 'Government Employee', 'Student', 'Retired', 'Private Employee', 'Self-employed', 'Other'
                ])}
                
                {renderField('profile', 'relationship', 'Relationship with Kashmir', 'select', [
                  'Resident', 'Originally from Kashmir', 'Frequently Visit', 'Occasional Visitor', 'Tourist', 'No Direct Connection', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Awareness & Personal Experience */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Awareness & Personal Experience</h2>

                {renderField('awareness', 'familiarity', 'How familiar are you with Kashmir handicrafts?', 'radio', [
                  'Very Familiar', 'Familiar', 'Some Knowledge', 'Heard About Them', 'Completely New'
                ])}

                {consultationData.awareness?.familiarity !== 'Completely New' && (
                  <>
                    {renderField('awareness', 'learned', 'How did you learn about them?', 'multiselect', [
                      'Family', 'School', 'Friends', 'Tourism', 'Internet', 'Social Media', 'Television', 'Museums', 'Shopping', 'Books', 'Other'
                    ])}
                    
                    {renderField('awareness', 'experience', 'Have you ever:', 'multiselect', [
                      'Purchased handicrafts', 'Visited artisan workshops', 'Visited handicraft exhibitions', 'Gifted handicrafts', 'Seen handicraft demonstrations', 'Visited museums', 'Collected handicrafts', 'None'
                    ])}
                    
                    {renderField('awareness', 'crafts', 'Which crafts do you recognize?', 'multiselect', [
                      'Pashmina', 'Carpets', 'Papier Mâché', 'Walnut Wood Carving', 'Kani', 'Sozni', 'Crewel', 'Copperware', 'Namdah', 'Willow Work', 'Chain Stitch', 'Other'
                    ])}
                  </>
                )}

                {/* Conditional Branches based on relationships and experience */}
                {consultationData.awareness?.familiarity === 'Completely New' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Awareness Building</h3>
                    {renderField('awareness', 'newAwareness', 'What would make you interested in learning more about the heritage crafts of Kashmir?', 'textarea')}
                  </div>
                )}
                
                {consultationData.awareness?.experience?.includes('Purchased handicrafts') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Consumer Experience</h3>
                    {renderField('awareness', 'consumerExperience', 'Describe your experience buying Kashmir handicrafts. Was it easy to verify authenticity? Were you satisfied with the quality?', 'textarea')}
                  </div>
                )}
                
                {consultationData.consent?.respondentType === 'Artisan family member' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Family & Livelihood</h3>
                    {renderField('awareness', 'familyLivelihood', 'How has the craft impacted your family\'s livelihood over the generations? What are your hopes for the future?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Community Observations */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Community Observations</h2>

                {renderField('community', 'importance', 'In your opinion, how important are handicrafts to Kashmir?', 'radio', [
                  'Extremely Important', 'Important', 'Moderately Important', 'Slightly Important', 'Unsure'
                ])}
                
                {renderField('community', 'observed', 'Have you observed any of the following?', 'multiselect', [
                  'Decline in artisans', 'Youth leaving crafts', 'Growth in tourism', 'Increase in machine-made products', 'Loss of traditional skills', 'Improved marketing', 'Better government support', 'Women\'s participation increasing', 'Digital selling increasing', 'None'
                ])}
                
                {renderField('community', 'publicAwareness', 'How would you describe public awareness of authentic Kashmir crafts?', 'radio', [
                  'Excellent', 'Good', 'Average', 'Poor', 'Very Poor'
                ])}
                
                {renderField('community', 'encourageBuy', 'Have you ever encouraged someone to buy Kashmir handicrafts?', 'radio', [
                  'Yes', 'No', 'Maybe'
                ])}

                {/* Conditional Branches */}
                {consultationData.profile?.relationship === 'Resident' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Local Community Impact</h3>
                    {renderField('community', 'localImpact', 'As a resident, how do you see handicrafts impacting your local neighborhood or community today compared to the past?', 'textarea')}
                  </div>
                )}
                
                {consultationData.consent?.respondentType === 'Tourist' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Tourism Experience</h3>
                    {renderField('community', 'tourismExperience', 'As a visitor, how accessible and visible were local artisans and authentic crafts during your trip?', 'textarea')}
                  </div>
                )}
                
                {consultationData.consent?.respondentType === 'International citizen' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Global Perception</h3>
                    {renderField('community', 'globalPerception', 'How are Kashmir\'s crafts perceived internationally, and what could be done to improve global awareness?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Heritage, Environment & Society */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Heritage, Environment & Society</h2>

                {renderField('heritage', 'values', 'Which values are most important regarding Kashmir Crafts? (Select up to five)', 'multiselect', [
                  'Heritage', 'Culture', 'Identity', 'Employment', 'Tourism', 'Rural Development', 'Women Empowerment', 'Youth Employment', 'Sustainability', 'Environment', 'Innovation', 'Education', 'International Recognition', 'Other'
                ])}
                
                {renderField('heritage', 'preserve', 'Should traditional crafts be preserved?', 'radio', [
                  'Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'
                ])}
                
                {renderField('heritage', 'environmental', 'Environmental Concerns (Select all that apply)', 'multiselect', [
                  'Deforestation', 'Climate Change', 'Pollution', 'Waste', 'Raw Material Availability', 'Unsure', 'Other'
                ])}
                
                {renderField('heritage', 'schools', 'Should schools teach Kashmir handicrafts?', 'radio', [
                  'Yes', 'No', 'Maybe'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Technology & Future Generations */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Technology & Future Generations</h2>

                {renderField('tech', 'help', 'Technology can help through:', 'multiselect', [
                  'AI', 'Digital Museums', 'E-commerce', 'Social Media', 'QR Authentication', 'Digital Catalogues', 'VR', 'AR', 'Mobile Apps', 'Online Learning', 'Other'
                ])}
                
                {renderField('tech', 'support', 'Would you support:', 'multiselect', [
                  'Digital Documentation', 'Digital Archive', 'Craft Mapping', 'Volunteer Programs', 'Community Events', 'Craft Festivals', 'Museum Visits', 'Other'
                ])}

                {renderField('tech', 'youthInterest', 'Do young people show enough interest in traditional crafts?', 'radio', [
                  'Yes', 'No', 'Unsure'
                ])}
                
                {renderField('tech', 'youthComments', 'Open comments on youth and future generations', 'textarea')}

                {consultationData.tech?.support?.includes('Volunteer Programs') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Community Engagement</h3>
                    {renderField('tech', 'volunteerIdeas', 'What specific volunteer roles or community projects would you be most interested in participating in?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Challenges & Priorities */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Challenges & Priorities</h2>

                {renderField('challenges', 'topChallenges', 'Select top five challenges facing Kashmir crafts', 'multiselect', [
                  'Declining Artisan Income', 'Youth Leaving Crafts', 'Counterfeit Products', 'Tourism Challenges', 'Marketing', 'Low Awareness', 'Poor Design Innovation', 'Climate Change', 'Raw Materials', 'Digital Skills', 'Limited Exports', 'Weak Branding', 'Other'
                ])}
                
                {renderField('challenges', 'addressFirst', 'What should be addressed first? (Open response)', 'textarea')}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Future Vision */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Future Vision</h2>

                {renderField('vision', 'vision2030', 'How would you like Kashmir handicrafts to look in 2030, 2035, and 2040?', 'textarea')}
                
                {renderField('vision', 'institutions', 'Should Kashmir have:', 'multiselect', [
                  'Craft Museums', 'Craft Villages', 'Heritage Schools', 'Annual Craft Festival', 'International Promotion', 'Digital Archive', 'Innovation Centre', 'Craft University', 'Craft Research Institute', 'Other'
                ])}
                
                {renderField('vision', 'volunteer', 'Would you volunteer for:', 'multiselect', [
                  'Awareness Campaigns', 'Documentation', 'Festivals', 'Community Projects', 'Craft Promotion', 'School Programs', 'Digital Archives', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'gov', 'Recommendations for Government & Policy Makers', 'textarea')}
                {renderField('recommendations', 'industry', 'Recommendations for Artisans, Manufacturers & Retailers', 'textarea')}
                {renderField('recommendations', 'society', 'Recommendations for Schools, Universities, Youth & Media', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Share Evidence, Stories & Memories</h3>
                  <p className="text-sm text-gray-600 mb-4">Citizens may upload photographs, videos, historical documents, family collections, oral histories, local stories, newspaper clippings, or maps.</p>
                  
                  <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-brand-primary text-icon-on-light rounded-xl font-bold hover:bg-brand-primary hover:text-white transition">
                    <FaUpload /> Upload Files
                  </button>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                        <p className="text-xs text-yellow-800 font-bold">Important Notice regarding Historical Material & Provenance:</p>
                        <p className="text-xs text-yellow-700 mt-1">Ensure you have the right to share historical photographs, documents, or family collections. Uploading indicates your permission for KHCRF to archive this material for cultural preservation research.</p>
                      </div>

                      {uploadedFiles.map((uf, idx) => (
                        <div key={idx} className="flex flex-col bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-gray-800 flex items-center gap-2"><FaFileAlt data-ui-icon  className=""/> {uf.file.name}</span>
                            <button onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700"><FaTimes /></button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                            <select className="text-xs p-2 border border-gray-300 rounded w-full" defaultValue="">
                              <option value="" disabled>Select Material Type...</option>
                              <option>Photograph / Video</option>
                              <option>Historical Document</option>
                              <option>Family Collection / Object</option>
                              <option>Oral History / Story</option>
                              <option>Newspaper Clipping</option>
                              <option>Artwork / Map</option>
                              <option>Other</option>
                            </select>
                            <input type="text" placeholder="Location / Date of Material" className="text-xs p-2 border border-gray-300 rounded w-full" />
                            <select className="text-xs p-2 border border-gray-300 rounded w-full md:col-span-2" defaultValue="">
                              <option value="" disabled>Select Permissions...</option>
                              <option>Publicly available for archive and display</option>
                              <option>For KHCRF internal research only</option>
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
                  <p className="text-gray-600 text-lg">Your citizen consultation response is ready. Please review the details before submitting.</p>
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
                      <span className={isAwarenessValid ? "text-green-600" : "text-gray-400"}>Awareness</span>
                      <span className={isCommunityValid ? "text-green-600" : "text-gray-400"}>Community</span>
                      <span className={isHeritageValid ? "text-green-600" : "text-gray-400"}>Heritage/Env</span>
                      <span className={isTechValid ? "text-green-600" : "text-gray-400"}>Technology</span>
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
                          participantType: "Citizen",
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
