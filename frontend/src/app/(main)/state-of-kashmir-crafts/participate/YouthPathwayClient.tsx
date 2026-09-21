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
  return `SKC-2026-YTH-${result}`;
};

export default function YouthPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_yth_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_yth_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_yth_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_yth_consultationData', JSON.stringify(consultationData));
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

  const isConsentValid = consultationData.consent?.respondentType && consultationData.consent?.ageGroup;
  const isProfileValid = consultationData.profile?.country && consultationData.profile?.relationship;
  const isAwarenessValid = consultationData.awareness?.familiarity;
  const isExperienceValid = consultationData.experience?.participateIn;
  const isInnovationValid = consultationData.innovation?.consider;
  const isTechValid = consultationData.tech?.help;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isVisionValid = consultationData.vision?.vision2030;
  const isRecommendationsValid = consultationData.recommendations?.gov;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isAwarenessValid, isExperienceValid, isInnovationValid, isTechValid, isChallengesValid, isVisionValid, isRecommendationsValid];
  const stepsCompleted = sectionsStatus.filter(Boolean).length;
  const progressPercent = Math.min(100, Math.floor((stepsCompleted / 9) * 100));

  return (
    <div className="animate-fade-in">
       {step < 11 && (
         <div className="bg-brand-dark pt-32 pb-16 relative overflow-hidden">
           
           <div className="container mx-auto px-4 relative z-10 text-center">
             <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-brand-secondary uppercase border border-brand-secondary/30 rounded-[12px]">
               YOUTH CONSULTATION
             </span>
             <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Participation Portal</h1>
             
             <div className="max-w-4xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
               <div className="flex items-center gap-4 text-left mb-4 md:mb-0">
                 <div className="bg-brand-primary/20 text-brand-secondary px-3 py-1 rounded-[10px] text-xs font-black uppercase tracking-wider border border-brand-secondary/30">
                   Youth Participant
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
                      <p>It is designed to give young people a meaningful voice in shaping the future of Kashmir's handicrafts. This is not a survey or an exam, but an opportunity to share your ideas, aspirations, and recommendations.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'respondentType', 'Respondent Type', 'select', [
                  'School Student', 'College Student', 'University Student', 'Young Professional', 'Young Entrepreneur', 'Young Artisan', 'Apprentice', 'Job Seeker', 'Volunteer', 'NGO Worker', 'Freelancer', 'Content Creator', 'Designer', 'Researcher', 'Other'
                ])}
                
                {renderField('consent', 'ageGroup', 'Age Group', 'radio', [
                  'Under 18', '18–24', '25–29', '30–35'
                ])}
                
                {consultationData.consent?.ageGroup === 'Under 18' && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                    <p className="text-xs text-yellow-800 font-bold">Parental/Guardian Acknowledgement Notice:</p>
                    <p className="text-xs text-yellow-700 mt-1">By continuing, you acknowledge that you have discussed participating in this consultation with your parent or guardian.</p>
                  </div>
                )}
                
                {renderField('consent', 'submissionType', 'Submission Type', 'radio', [
                  'Personal Perspective',
                  'Community Perspective'
                ])}
                
                {renderField('consent', 'identity', 'Submission confidentiality preference', 'radio', [
                  'I may be publicly identified as a contributor',
                  'My name must remain confidential, but inputs and creative works can be used',
                  'Submission may be used only in anonymized, aggregate analysis'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact you regarding youth fellowships or future innovation labs?', 'radio', ['Yes', 'No'])}

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

            {/* STEP 2: Youth Profile */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Youth Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {renderField('profile', 'country', 'Country', 'text')}
                  {renderField('profile', 'state', 'State / Province', 'text')}
                  {renderField('profile', 'district', 'District (Optional)', 'text')}
                </div>
                
                {renderField('profile', 'relationship', 'Relationship with Kashmir', 'select', [
                  'Resident', 'Originally from Kashmir', 'Diaspora', 'Frequent Visitor', 'Tourist', 'No Direct Connection', 'Other'
                ])}
                
                {renderField('profile', 'occupation', 'Occupation', 'select', [
                  'Student', 'Entrepreneur', 'Software Developer', 'Teacher', 'Designer', 'Artist', 'Photographer', 'Videographer', 'Engineer', 'Government Employee', 'Private Employee', 'Freelancer', 'Self-employed', 'Homemaker', 'Unemployed', 'Other'
                ])}

                {/* Conditional Logic: Diaspora/Tourist */}
                {consultationData.profile?.relationship === 'Diaspora' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Cultural Connection</h3>
                    {renderField('profile', 'diasporaFocus', 'How do you connect with Kashmiri heritage from afar, and what role do crafts play in that connection?', 'textarea')}
                  </div>
                )}
                
                {consultationData.profile?.relationship === 'Tourist' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Visitor Experience</h3>
                    {renderField('profile', 'touristFocus', 'As a young visitor, what was your impression of the crafts sector, and what would make it more engaging?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Awareness & Identity */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Awareness & Identity</h2>

                {renderField('awareness', 'familiarity', 'How familiar are you with Kashmir handicrafts?', 'radio', [
                  'Very Familiar', 'Familiar', 'Limited Knowledge', 'Heard About Them', 'Completely New'
                ])}

                {consultationData.awareness?.familiarity !== 'Completely New' && (
                  <>
                    {renderField('awareness', 'learned', 'Where did you learn about them?', 'multiselect', [
                      'Family', 'School', 'University', 'Social Media', 'Internet', 'Friends', 'Tourism', 'Museums', 'Exhibitions', 'Television', 'Books', 'Other'
                    ])}
                    
                    {renderField('awareness', 'crafts', 'Which crafts do you know?', 'multiselect', [
                      'Pashmina', 'Carpet', 'Papier Mâché', 'Walnut Wood Carving', 'Kani', 'Sozni', 'Crewel', 'Copperware', 'Namdah', 'Willow Work', 'Chain Stitch', 'Other'
                    ])}
                  </>
                )}
                
                {consultationData.awareness?.familiarity === 'Completely New' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Awareness Building</h3>
                    {renderField('awareness', 'newAwareness', 'What is the best way to introduce traditional crafts to a younger generation that is completely new to them?', 'textarea')}
                  </div>
                )}

                {renderField('awareness', 'importance', 'How important are handicrafts for Kashmir\'s identity?', 'radio', [
                  'Very High', 'High', 'Moderate', 'Low', 'Unsure'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Experience & Participation */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Experience & Participation</h2>

                {renderField('experience', 'activities', 'Have you ever:', 'multiselect', [
                  'Visited an artisan', 'Purchased handicrafts', 'Volunteered', 'Participated in workshops', 'Attended exhibitions', 'Created digital content', 'Photographed crafts', 'Promoted crafts online', 'Worked with artisans', 'Interned', 'None'
                ])}
                
                {renderField('experience', 'participateIn', 'How would you like to participate in the future?', 'multiselect', [
                  'Volunteer', 'Research', 'Business', 'Design', 'Tourism', 'Digital Marketing', 'AI', 'Storytelling', 'Photography', 'Film Making', 'Events', 'Education', 'Environmental Projects', 'Other'
                ])}

                {/* Conditional Branching based on Role / Interests */}
                {consultationData.experience?.participateIn?.includes('Volunteer') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Community Engagement</h3>
                    {renderField('experience', 'volunteerRoles', 'What specific volunteer roles or community projects would you most like to join?', 'textarea')}
                  </div>
                )}
                
                {consultationData.consent?.respondentType === 'Content Creator' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Digital Storytelling</h3>
                    {renderField('experience', 'contentFocus', 'How can photography, film, and social media be best utilized to promote traditional heritage to a global youth audience?', 'textarea')}
                  </div>
                )}
                
                {consultationData.consent?.respondentType === 'Young Artisan' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Design & Production</h3>
                    {renderField('experience', 'artisanFocus', 'As a young artisan, what are the biggest challenges you face in producing and selling your work today?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Innovation, Careers & Entrepreneurship */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Innovation, Careers & Entrepreneurship</h2>

                {consultationData.consent?.respondentType !== 'School Student' && (
                  <>
                    {renderField('innovation', 'consider', 'Would you consider working in the crafts sector in the following areas?', 'multiselect', [
                      'Working in handicrafts', 'Starting a craft business', 'Designing products', 'Exporting', 'Digital Commerce', 'Craft Tourism', 'Research', 'Teaching', 'Innovation', 'Policy', 'No Interest'
                    ])}
                    
                    {renderField('innovation', 'entrepreneurship', 'Interested in entrepreneurship in the heritage sector?', 'radio', [
                      'Yes', 'Maybe', 'No'
                    ])}
                    
                    {(consultationData.innovation?.entrepreneurship === 'Yes' || consultationData.consent?.respondentType === 'Young Entrepreneur') && (
                      <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                        <h3 className="font-bold text-brand-dark mb-4">Startup & Innovation</h3>
                        {renderField('innovation', 'businessIdea', 'What is your business idea or innovation concept for the crafts sector?', 'textarea')}
                      </div>
                    )}
                  </>
                )}

                {consultationData.consent?.respondentType === 'School Student' && (
                  <div className="bg-blue-50 text-blue-900 p-5 rounded-2xl border border-blue-100 mb-4 text-sm font-medium">
                    <p>Since you are a school student, we want to know what skills you'd like to learn for the future!</p>
                  </div>
                )}

                {renderField('innovation', 'skills', 'What skills do you want to develop?', 'multiselect', [
                  'Design', 'AI', 'Marketing', 'Photography', 'Videography', 'Digital Commerce', 'Branding', 'Export', 'Business Planning', 'Leadership', 'Fundraising', 'Research', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Technology, AI & Sustainability */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Technology, AI & Sustainability</h2>

                {renderField('tech', 'help', 'Technology can help the sector through:', 'multiselect', [
                  'AI', 'AR', 'VR', 'QR Authentication', 'Digital Museums', '3D Scanning', 'Blockchain', 'Social Media', 'E-commerce', 'Mobile Apps', 'Digital Storytelling', 'Other'
                ])}
                
                {renderField('tech', 'aiRole', 'AI can help in:', 'multiselect', [
                  'Education', 'Design', 'Marketing', 'Translation', 'Documentation', 'Research', 'Prediction', 'Customer Service', 'Unsure'
                ])}
                
                {consultationData.experience?.participateIn?.includes('AI') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Digital Innovation</h3>
                    {renderField('tech', 'aiInnovation', 'How would you apply AI or digital innovation to solve a specific problem in the crafts sector?', 'textarea')}
                  </div>
                )}

                <h3 className="font-bold text-xl text-brand-dark mt-8 mb-4">Sustainability & Environment</h3>
                {renderField('tech', 'environment', 'Environmental Priorities for the sector', 'multiselect', [
                  'Climate', 'Forests', 'Natural Materials', 'Water', 'Waste', 'Circular Economy', 'Biodiversity', 'Green Tourism', 'Other'
                ])}
                
                {renderField('tech', 'participation', 'Would you participate in:', 'multiselect', [
                  'Tree Plantation', 'Craft Mapping', 'Documentation', 'Citizen Science', 'Environmental Monitoring', 'Volunteer Programs', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Challenges & Opportunities */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Challenges & Opportunities</h2>

                {renderField('challenges', 'topChallenges', 'Top Five Challenges facing youth in this sector', 'multiselect', [
                  'Youth Leaving Crafts', 'Low Income', 'Poor Marketing', 'Counterfeit', 'Climate Change', 'Technology Gap', 'Lack of Innovation', 'Poor Education', 'Limited Opportunities', 'Weak Branding', 'Limited Tourism', 'Other'
                ])}
                
                {renderField('challenges', 'opportunity', 'What is the biggest opportunity for young people in Kashmir Crafts?', 'textarea')}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Future Vision */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Future Vision</h2>

                {renderField('vision', 'vision2030', 'Imagine Kashmir Crafts in 2030, 2035, and 2040. What does it look like?', 'textarea')}
                
                {renderField('vision', 'initiatives', 'Which initiatives should exist?', 'multiselect', [
                  'Craft Startup Accelerator', 'Innovation Labs', 'Youth Fellowship', 'Youth Advisory Council', 'International Exchange', 'Digital Museum', 'AI Innovation Centre', 'Annual Youth Festival', 'Volunteer Network', 'Digital Heritage Platform', 'Research Network', 'Other'
                ])}
                
                {renderField('vision', 'join', 'Would you join a:', 'multiselect', [
                  'Youth Advisory Council', 'Volunteer Network', 'Innovation Lab', 'Digital Documentation Team', 'Mentorship Program', 'Hackathon', 'Research Fellowship', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'gov', 'Recommendations for Government & Policymakers', 'textarea')}
                {renderField('recommendations', 'education', 'Recommendations for Schools, Universities & Educators', 'textarea')}
                {renderField('recommendations', 'industry', 'Recommendations for Tech Companies, NGOs, Media & Brands', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Share Evidence, Ideas & Creative Work</h3>
                  <p className="text-sm text-gray-600 mb-4">Youth may upload Videos, Short Films, Photography, Artwork, Posters, Business Ideas, Innovation Concepts, Research, Designs, Social Media Campaigns, or Podcasts.</p>
                  
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
                              <option value="" disabled>Select Evidence Type...</option>
                              <option>Business Idea / Pitch</option>
                              <option>Creative Design / Artwork</option>
                              <option>Video / Short Film</option>
                              <option>Photography</option>
                              <option>Research Paper / Essay</option>
                              <option>Social Media Campaign</option>
                              <option>Other</option>
                            </select>
                            <input type="text" placeholder="Title / Description" className="text-xs p-2 border border-gray-300 rounded w-full" />
                            <select className="text-xs p-2 border border-gray-300 rounded w-full md:col-span-2" defaultValue="">
                              <option value="" disabled>Select Permissions...</option>
                              <option>Publicly available for promotion</option>
                              <option>For KHCRF internal review only</option>
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
                  <p className="text-gray-600 text-lg">Your youth consultation response is ready. Please review the details before submitting.</p>
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
                      <span className={isExperienceValid ? "text-green-600" : "text-gray-400"}>Experience</span>
                      <span className={isInnovationValid ? "text-green-600" : "text-gray-400"}>Innovation</span>
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
                          participantType: "Youth",
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
