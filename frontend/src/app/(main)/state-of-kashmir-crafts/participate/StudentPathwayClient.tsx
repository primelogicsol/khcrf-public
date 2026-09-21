"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  FaCheckCircle, FaFileAlt, FaUpload, FaArrowRight, FaArrowLeft, FaInfoCircle, FaTimes
} from 'react-icons/fa';

const generateConsultationId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SKC-2026-STU-${result}`;
};

export default function StudentPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_stu_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_stu_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_stu_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_stu_consultationData', JSON.stringify(consultationData));
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
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

  const isConsentValid = consultationData.consent?.capacity && consultationData.consent?.identity;
  const isProfileValid = consultationData.profile?.institution && consultationData.profile?.level;
  const isAwarenessValid = consultationData.awareness?.level;
  const isExperienceValid = consultationData.experience?.activities;
  const isInnovationValid = consultationData.innovation?.career;
  const isTechValid = consultationData.tech?.help;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isVisionValid = consultationData.vision?.vision2030;
  const isRecommendationsValid = consultationData.recommendations?.govPriorities;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isAwarenessValid, isExperienceValid, isInnovationValid, isTechValid, isChallengesValid, isVisionValid, isRecommendationsValid];
  const stepsCompleted = sectionsStatus.filter(Boolean).length;
  const progressPercent = Math.min(100, Math.floor((stepsCompleted / 9) * 100));

  return (
    <div className="animate-fade-in">
       {step < 11 && (
         <div className="bg-brand-dark pt-32 pb-16 relative overflow-hidden">
           
           <div className="container mx-auto px-4 relative z-10 text-center">
             <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-brand-secondary uppercase border border-brand-secondary/30 rounded-[12px]">
               OFFICIAL CONSULTATION
             </span>
             <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Participation Portal</h1>
             
             <div className="max-w-4xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
               <div className="flex items-center gap-4 text-left mb-4 md:mb-0">
                 <div className="bg-brand-primary/20 text-brand-secondary px-3 py-1 rounded-[10px] text-xs font-black uppercase tracking-wider border border-brand-secondary/30">
                   Student Consultation Instrument
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
                  <h2 className="text-3xl font-black text-brand-dark mb-4">Step 1: Consent & Student Status</h2>
                  <div className="bg-blue-50 text-blue-900 p-5 rounded-2xl border border-blue-100 flex gap-4 text-sm font-medium leading-relaxed">
                    <FaInfoCircle className="text-blue-500 text-xl shrink-0 mt-0.5" />
                    <div>
                      <p className="mb-2">This consultation forms part of the State of Kashmir Crafts Assessment 2026–2027 initiative led by the Hamadan Craft Revival Foundation. It seeks your perspectives on learning, innovation, heritage, careers, and the future of Kashmir handicrafts.</p>
                      <p>Participation is voluntary. This is not an examination, grading survey, or admission form. Every student's perspective is valuable, even if you are entirely new to Kashmir crafts.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'capacity', 'Current Student Status', 'select', [
                  'School Student', 'Higher Secondary Student', 'Diploma Student', 'Undergraduate', 'Postgraduate', 'PhD Scholar', 'International Student', 'Exchange Student', 'Other'
                ])}
                
                {renderField('consent', 'ageConfirm', 'Are you above the legal age of consent (18 years) for independent participation?', 'radio', ['Yes', 'No'])}
                
                {consultationData.consent?.ageConfirm === 'No' && (
                  <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl mb-4">
                     {renderField('consent', 'parentalPerm', 'Do you have parental, guardian, or institutional permission to participate?', 'radio', ['Yes', 'No, I cannot proceed'])}
                  </div>
                )}
                
                {renderField('consent', 'identity', 'Submission identity preference', 'radio', [
                  'I may be publicly identified',
                  'My name must remain confidential',
                  'Submission may be used only in anonymized analysis'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact you for research opportunities, hackathons, or student programs?', 'radio', ['Yes', 'No'])}

                {consultationData.consent?.contact === 'Yes' && (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField('consent', 'contactName', 'Name', 'text')}
                    {renderField('consent', 'contactEmail', 'Email', 'email')}
                    {renderField('consent', 'contactPhone', 'Phone / WhatsApp', 'tel')}
                  </div>
                )}
                
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
                  <label className="block font-bold text-gray-900 mb-4">Mandatory Consent</label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check1 || false} onChange={e => handleChange('consent', 'check1', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I understand the purpose of this consultation.</span>
                  </label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check2 || false} onChange={e => handleChange('consent', 'check2', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I confirm that participation is voluntary.</span>
                  </label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check3 || false} onChange={e => handleChange('consent', 'check3', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I confirm that the information is accurate to my best knowledge.</span>
                  </label>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 2: Student Profile */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Student Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('profile', 'institution', 'Educational Institution Name', 'text')}
                  {renderField('profile', 'country', 'Country', 'text', [], { defaultValue: 'India' })}
                  {renderField('profile', 'state', 'State/Province', 'text')}
                  {renderField('profile', 'district', 'District / City', 'text')}
                </div>

                {renderField('profile', 'level', 'Current Level of Study', 'select', [
                  'School', 'Higher Secondary', 'Diploma', 'Bachelor\'s', 'Master\'s', 'PhD', 'Other'
                ])}
                
                {renderField('profile', 'discipline', 'Academic Discipline / Major', 'select', [
                  'Fine Arts', 'Textile Design', 'Fashion Design', 'Architecture', 'Business', 'Economics', 'Tourism', 'Environmental Science', 'Engineering', 'Computer Science', 'AI', 'History', 'Archaeology', 'Sociology', 'Anthropology', 'Public Policy', 'Education', 'Commerce', 'General Schooling', 'Other'
                ])}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {renderField('profile', 'yearOfStudy', 'Year of Study', 'select', ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5+'])}
                  {renderField('profile', 'residence', 'Current Residence', 'select', ['Kashmir', 'Jammu', 'Ladakh', 'Rest of India', 'Outside India'])}
                </div>

                {/* Conditional Branch: International */}
                {(consultationData.profile?.residence === 'Outside India' || consultationData.consent?.capacity === 'International Student') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">International Perspectives</h3>
                    {renderField('profile', 'intlAwareness', 'How are Kashmir handicrafts perceived in your current region?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Learning & Awareness */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Learning & Awareness</h2>

                {renderField('awareness', 'level', 'How familiar are you with Kashmir handicrafts?', 'select', [
                  'Very Familiar', 'Familiar', 'Limited Knowledge', 'Heard About Them', 'Completely New'
                ])}
                
                {renderField('awareness', 'sources', 'How did you learn about them?', 'multiselect', [
                  'Family', 'School', 'University', 'Internet', 'Social Media', 'Museums', 'Tourism', 'Artisan Family', 'Television', 'Books', 'Friends', 'Other'
                ])}
                
                {/* Condition: Completely New vs Familiar */}
                {consultationData.awareness?.level !== 'Completely New' ? (
                  <>
                    {renderField('awareness', 'craftsKnown', 'Which specific crafts do you know?', 'multiselect', [
                      'Pashmina', 'Carpet', 'Kani', 'Papier Mache', 'Walnut Wood', 'Copperware', 'Namdah', 'Crewel', 'Chain Stitch', 'Sozni', 'Willow', 'Other'
                    ])}
                  </>
                ) : (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-brand-dark mb-4">Discovering Handicrafts</h3>
                    {renderField('awareness', 'discovery', 'Since you are completely new to Kashmir handicrafts, what kind of information or experience would spark your interest?', 'textarea')}
                  </div>
                )}
                
                {renderField('awareness', 'preferredLearning', 'Which knowledge sources would you like more of in the future?', 'multiselect', [
                  'Videos', 'Workshops', 'Field Visits', 'University Courses', 'Online Courses', 'Museums', 'VR Experiences', 'AI Learning', 'Research Papers', 'Books'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Experience with Kashmir Crafts */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Experience with Kashmir Crafts</h2>

                {renderField('experience', 'activities', 'Have you ever:', 'multiselect', [
                  'Visited artisan workshop', 'Purchased handicrafts', 'Participated in exhibition', 'Worked with artisans', 'Visited museums', 'Attended craft workshops', 'Participated in competitions', 'Interned', 'Volunteered', 'None'
                ])}
                
                {renderField('experience', 'interestAreas', 'Which areas interest you the most?', 'multiselect', [
                  'Design', 'Heritage', 'Technology', 'Business', 'Tourism', 'Marketing', 'Sustainability', 'Documentation', 'Research', 'AI', 'Entrepreneurship', 'Other'
                ])}
                
                {renderField('experience', 'culturalImportance', 'How important are Kashmir handicrafts to the region\'s culture?', 'radio', [
                  'Very High', 'High', 'Moderate', 'Low', 'Unsure'
                ])}
                
                {renderField('experience', 'threats', 'What do you think are the biggest threats to the crafts sector?', 'multiselect', [
                  'Machine-made products', 'Loss of artisans', 'Climate Change', 'Low Income', 'Lack of Youth', 'Counterfeit', 'Poor Marketing', 'Global Competition', 'Policy', 'Tourism Decline', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Innovation & Career Aspirations */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Innovation & Career Aspirations</h2>

                {renderField('innovation', 'career', 'Would you consider a career related to handicrafts?', 'multiselect', [
                  'Working in handicrafts', 'Starting a business', 'Social enterprise', 'Research', 'Government', 'Teaching', 'Museum', 'Design', 'Technology', 'AI', 'Digital Marketing', 'Tourism', 'No Interest'
                ])}
                
                {renderField('innovation', 'entrepreneurship', 'Are you interested in entrepreneurship or starting a venture?', 'radio', ['Yes', 'Maybe', 'No'])}
                
                {/* Condition: Entrepreneurship */}
                {(consultationData.innovation?.entrepreneurship === 'Yes' || consultationData.profile?.discipline === 'Business' || consultationData.profile?.discipline === 'Commerce') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-brand-dark mb-4">Startup & Business Ideas</h3>
                    {renderField('innovation', 'businessIdeas', 'What kind of business or social enterprise would you build around Kashmir handicrafts?', 'textarea')}
                  </div>
                )}
                
                {/* Condition: Undergraduate Internships */}
                {(consultationData.profile?.level === 'Bachelor\'s' || consultationData.profile?.level === 'Diploma') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-brand-dark mb-4">Internships</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderField('innovation', 'internship', 'Interested in interning?', 'radio', ['Yes', 'No'])}
                      {renderField('innovation', 'internOrg', 'Preferred Organization Type', 'select', ['NGO', 'Export House', 'Design Studio', 'Government', 'Tech Startup', 'Retail Brand'])}
                    </div>
                  </div>
                )}
                
                {/* Condition: Research */}
                {(consultationData.innovation?.career?.includes('Research') || consultationData.experience?.interestAreas?.includes('Research') || consultationData.profile?.level === 'Master\'s' || consultationData.profile?.level === 'PhD') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-brand-dark mb-4">Research & Academic Collaboration</h3>
                    {renderField('innovation', 'researchInterest', 'What specific research topics in handicrafts interest you most?', 'textarea')}
                  </div>
                )}
                
                {/* Condition: Design */}
                {(consultationData.profile?.discipline === 'Fine Arts' || consultationData.profile?.discipline === 'Textile Design' || consultationData.profile?.discipline === 'Fashion Design' || consultationData.profile?.discipline === 'Architecture') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-brand-dark mb-4">Design Innovation</h3>
                    {renderField('innovation', 'designIdeas', 'How can contemporary design approaches benefit traditional Kashmir crafts?', 'textarea')}
                  </div>
                )}
                
                {renderField('innovation', 'skills', 'What skills do you want to acquire?', 'multiselect', [
                  'Design', 'Marketing', 'Photography', 'AI', 'Business', 'Export', 'Digital Commerce', 'Documentation', 'Storytelling', 'Research', 'Languages', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Technology & Sustainability */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Technology & Sustainability</h2>

                {renderField('tech', 'help', 'How can technology best help the handicrafts sector?', 'multiselect', [
                  'AI', 'VR', 'AR', 'Blockchain', 'QR', 'Digital Catalogues', '3D Scanning', 'Digital Museums', 'E-commerce', 'Social Media', 'Mobile Apps', 'Other'
                ])}
                
                {/* Condition: Tech & AI Students */}
                {(consultationData.profile?.discipline === 'Computer Science' || consultationData.profile?.discipline === 'Engineering' || consultationData.profile?.discipline === 'AI') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-brand-dark mb-4">Technology Application</h3>
                    {renderField('tech', 'techInnovation', 'What technological solutions or software could you imagine building to assist the artisan ecosystem?', 'textarea')}
                  </div>
                )}

                {renderField('tech', 'sustainability', 'Which areas of sustainability interest you?', 'multiselect', [
                  'Natural Materials', 'Climate', 'Waste Reduction', 'Circular Economy', 'Water', 'Energy', 'Fair Wages', 'Biodiversity', 'Other'
                ])}
                
                {renderField('tech', 'aiImpact', 'Do you think AI will:', 'radio', [
                  'Help artisans', 'Replace artisans', 'Improve design', 'Improve education', 'Preserve heritage', 'Increase marketing', 'Unsure'
                ])}
                
                {renderField('tech', 'digitalDoc', 'Would you participate in digital documentation or cataloguing projects?', 'radio', ['Yes', 'Maybe', 'No'])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Challenges & Opportunities */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Challenges & Growth Opportunities</h2>

                {renderField('challenges', 'topChallenges', 'Top Five Challenges facing youth entering this sector:', 'multiselect', [
                  'Lack of Awareness', 'Career Opportunities', 'Income', 'Technology', 'Education', 'Marketing', 'Funding', 'Innovation', 'Research', 'Policy', 'Tourism', 'Climate', 'Counterfeit', 'Other'
                ])}
                
                {renderField('challenges', 'opportunities', 'Greatest Growth Opportunities:', 'multiselect', [
                  'Education', 'Innovation', 'AI', 'Youth Entrepreneurship', 'Tourism', 'Research', 'Digital Commerce', 'International Collaboration', 'Museums', 'Public Awareness', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Future Vision */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Future Vision</h2>

                {consultationData.profile?.level === 'School' || consultationData.profile?.level === 'Higher Secondary' ? (
                  <>
                    {/* Simplified for School Students */}
                    {renderField('vision', 'vision2030', 'What do you hope Kashmir crafts will look like when you grow up?', 'textarea')}
                    {renderField('vision', 'youthContribution', 'How can young students like you help?', 'textarea')}
                  </>
                ) : (
                  <>
                    {/* Standard for Higher Ed */}
                    {renderField('vision', 'vision2030', 'Where should Kashmir crafts be in 2030, 2035, and 2040?', 'textarea')}
                    {renderField('vision', 'youthContribution', 'How can youth actively contribute to this vision?', 'textarea')}
                  </>
                )}

                {renderField('vision', 'educationIntegration', 'Should handicrafts become part of formal education?', 'radio', ['Yes', 'Maybe', 'No'])}
                
                {renderField('vision', 'activities', 'Preferred Educational Activities', 'multiselect', [
                  'School Curriculum', 'University Curriculum', 'Innovation Labs', 'Summer Schools', 'Hackathons', 'Design Challenges', 'Research Grants', 'Field Visits', 'Apprenticeships', 'Digital Learning', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'govPriorities', 'Top Priorities for Government', 'multiselect', [
                  'Craft Education', 'Innovation Labs', 'Scholarships', 'Internships', 'Youth Entrepreneurship', 'Research Grants', 'Digital Archives', 'Museums', 'AI', 'Tourism', 'International Exchanges', 'Other'
                ])}
                
                {renderField('recommendations', 'universities', 'What should Universities improve?', 'multiselect', [
                  'Curriculum', 'Research', 'Industry Links', 'Innovation', 'Field Visits', 'Labs', 'Design', 'Business', 'Other'
                ])}
                
                {renderField('recommendations', 'industry', 'What do students need most from the Industry?', 'multiselect', [
                  'Internships', 'Mentoring', 'Workshops', 'Innovation Challenges', 'Career Opportunities', 'Other'
                ])}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence, Ideas & Creative Contributions</h3>
                  <p className="text-sm text-gray-600 mb-4">You may upload your own creative or academic work relevant to handicrafts. Examples: Essays, Designs, Sketches, Research Papers, Photos, Videos, Presentations, Innovation Concepts, or Artwork.</p>
                  
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
                          <select className="text-xs p-2 border border-gray-300 rounded mt-2 w-full" defaultValue="">
                            <option value="" disabled>Select File Type...</option>
                            <option>Essay / Academic Paper</option>
                            <option>Design / Sketch / Art</option>
                            <option>Presentation / Project</option>
                            <option>Innovation Concept / Code</option>
                            <option>Photo / Video</option>
                            <option>Other</option>
                          </select>
                          <select className="text-xs p-2 border border-gray-300 rounded mt-2 w-full" defaultValue="">
                            <option value="" disabled>Select Confidentiality...</option>
                            <option>Public and attributable</option>
                            <option>Public but anonymized</option>
                            <option>Research team only</option>
                            <option>Contact me before any publication</option>
                          </select>
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
                  <p className="text-gray-600 text-lg">Your consultation response is ready. Please review the details before submitting.</p>
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
                      <span className={uploadedFiles.length > 0 ? "text-green-600" : "text-gray-400"}>Contributions (Optional)</span>
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
                          participantType: "Student",
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
