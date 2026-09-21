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
  return `SKC-2026-RSR-${result}`;
};

export default function ResearcherPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_rsr_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_rsr_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_rsr_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_rsr_consultationData', JSON.stringify(consultationData));
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
  const isProfileValid = consultationData.profile?.discipline && consultationData.profile?.highestQual;
  const isExperienceValid = consultationData.experience?.conductedOn;
  const isThemesValid = consultationData.themes?.methods;
  const isDataValid = consultationData.data?.collaboration;
  const isTechValid = consultationData.tech?.challenges;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isFutureValid = consultationData.future?.priorityQuestions;
  const isRecommendationsValid = consultationData.recommendations?.govPriorities;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isExperienceValid, isThemesValid, isDataValid, isTechValid, isChallengesValid, isFutureValid, isRecommendationsValid];
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
                   Researcher Consultation Instrument
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
                  <h2 className="text-3xl font-black text-brand-dark mb-4">Step 1: Consent & Researcher Role</h2>
                  <div className="bg-blue-50 text-blue-900 p-5 rounded-2xl border border-blue-100 flex gap-4 text-sm font-medium leading-relaxed">
                    <FaInfoCircle className="text-blue-500 text-xl shrink-0 mt-0.5" />
                    <div>
                      <p className="mb-2">This scholarly consultation forms part of the State of Kashmir Crafts Assessment 2026–2027 initiative led by the Hamadan Craft Revival Foundation.</p>
                      <p>It seeks to understand the current state of research, evidence, knowledge gaps, data availability, policy priorities, and future research directions relating to Kashmir's handicrafts ecosystem. This is not a research ranking or academic evaluation.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'capacity', 'Researcher Role', 'select', [
                  'Independent Researcher', 'University Researcher', 'Research Fellow', 'PhD Scholar', 'Postdoctoral Researcher', 'Think Tank Researcher', 'Government Researcher', 'NGO Researcher', 'Museum Researcher', 'Industry Researcher', 'Consultant', 'Other'
                ])}
                
                {renderField('consent', 'affiliation', 'Current Institutional Affiliation (if any)', 'text')}
                
                {renderField('consent', 'identity', 'Submission confidentiality preference', 'radio', [
                  'My name and affiliation may be publicly cited',
                  'My name must remain confidential, but my research inputs can be used',
                  'Submission may be used only in anonymized, aggregate analysis'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact you regarding future research collaborations, data sharing, or policy panels?', 'radio', ['Yes', 'No'])}

                {consultationData.consent?.contact === 'Yes' && (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField('consent', 'contactName', 'Name', 'text')}
                    {renderField('consent', 'contactEmail', 'Email', 'email')}
                    {renderField('consent', 'contactPhone', 'Phone', 'tel')}
                  </div>
                )}
                
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
                  <label className="block font-bold text-gray-900 mb-4">Mandatory Consent</label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check1 || false} onChange={e => handleChange('consent', 'check1', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I understand the scholarly purpose of this consultation.</span>
                  </label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check2 || false} onChange={e => handleChange('consent', 'check2', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I confirm that participation is voluntary.</span>
                  </label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check3 || false} onChange={e => handleChange('consent', 'check3', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I confirm that the information provided represents my own research views.</span>
                  </label>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 2: Research Profile */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Research Profile</h2>
                
                {consultationData.consent?.capacity !== 'Independent Researcher' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {renderField('profile', 'department', 'Department / Faculty', 'text')}
                    {renderField('profile', 'country', 'Country', 'text', [], { defaultValue: 'India' })}
                    {renderField('profile', 'state', 'State / Province', 'text')}
                    {renderField('profile', 'city', 'City', 'text')}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('profile', 'website', 'Personal/Lab Website (Optional)', 'text')}
                  {renderField('profile', 'orcid', 'ORCID ID (Optional)', 'text')}
                  {renderField('profile', 'googleScholar', 'Google Scholar Link (Optional)', 'text')}
                  {renderField('profile', 'linkedIn', 'LinkedIn Link (Optional)', 'text')}
                </div>

                {renderField('profile', 'highestQual', 'Highest Qualification', 'select', [
                  'Bachelor\'s', 'Master\'s', 'MPhil', 'PhD', 'Postdoctoral', 'Professor', 'Other'
                ])}
                
                {renderField('profile', 'discipline', 'Primary Academic Discipline', 'select', [
                  'Economics', 'Anthropology', 'History', 'Environmental Science', 'Textiles', 'Business', 'Tourism', 'AI', 'Computer Science', 'Conservation', 'Architecture', 'Fashion', 'Design', 'Public Policy', 'Sociology', 'Political Science', 'Education', 'Law', 'Other'
                ])}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {renderField('profile', 'experienceYears', 'Years of Research Experience', 'select', ['< 2 Years', '2-5 Years', '6-10 Years', '11-20 Years', '20+ Years'])}
                  {renderField('profile', 'geography', 'Primary Research Geography Focus', 'select', ['Kashmir', 'Himalaya', 'India', 'South Asia', 'Global', 'Other'])}
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Research Experience */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Research Experience</h2>

                {renderField('experience', 'conductedOn', 'Have you conducted research on:', 'multiselect', [
                  'Handicrafts', 'Heritage', 'Artisans', 'Rural Development', 'Tourism', 'Culture', 'Environment', 'Design', 'Business', 'Trade', 'AI', 'Other'
                ])}
                
                {renderField('experience', 'publications', 'Publication Experience (Select all that apply)', 'multiselect', [
                  'None', 'Conference Papers', 'Journal Articles', 'Books', 'Book Chapters', 'Reports', 'Policy Briefs', 'Working Papers', 'Datasets', 'Digital Archives', 'Other'
                ])}
                
                {/* Condition: Hide publication metrics if None */}
                {(!consultationData.experience?.publications?.includes('None') && consultationData.experience?.publications?.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {renderField('experience', 'outputBand', 'Approximate Number of Research Outputs', 'select', ['1-5', '6-15', '16-30', '31-50', '50+'])}
                  </div>
                )}
                
                {renderField('experience', 'fieldExp', 'Field Experience (Have you done):', 'multiselect', [
                  'Visited artisan communities', 'Conducted interviews', 'Household surveys', 'Focus groups', 'Ethnography', 'Participatory research', 'Archival research', 'Laboratory work', 'Remote sensing', 'GIS', 'Digital Humanities', 'None'
                ])}
                
                {renderField('experience', 'funding', 'Primary Sources of Research Funding', 'multiselect', [
                  'Government', 'University', 'International', 'Private', 'NGO', 'Self-funded', 'None'
                ])}

                {/* Conditional Branching based on Researcher Type / Discipline */}
                {consultationData.consent?.capacity === 'PhD Scholar' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">PhD Dissertation</h3>
                    {renderField('experience', 'dissertationTopic', 'Briefly describe your dissertation topic as it relates to handicrafts or Kashmir.', 'textarea')}
                  </div>
                )}

                {consultationData.consent?.capacity === 'Government Researcher' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Policy Research</h3>
                    {renderField('experience', 'policyImpact', 'How does your research translate into policy making?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Research Themes & Methods */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Research Themes & Methods</h2>

                {renderField('themes', 'currentThemes', 'Current Research Themes', 'multiselect', [
                  'Heritage', 'Livelihoods', 'Gender', 'Economics', 'Markets', 'Exports', 'Tourism', 'Sustainability', 'Climate', 'Biodiversity', 'AI', 'Digital Documentation', 'Conservation', 'Education', 'Entrepreneurship', 'Intellectual Property', 'GI', 'Innovation', 'Traditional Knowledge', 'Other'
                ])}
                
                {renderField('themes', 'methods', 'Primary Research Methods', 'multiselect', [
                  'Qualitative', 'Quantitative', 'Mixed', 'Case Study', 'Survey', 'GIS', 'Machine Learning', 'Historical Analysis', 'Ethnography', 'Participatory Research', 'Experimental', 'Modeling', 'Other'
                ])}

                {/* Condition: Field Methodology */}
                {(!consultationData.experience?.fieldExp?.includes('None') && consultationData.experience?.fieldExp?.length > 0) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Field Methodology Insights</h3>
                    {renderField('themes', 'fieldMethodology', 'What are the unique methodological challenges you face when conducting field research in Kashmir?', 'textarea')}
                  </div>
                )}
                
                {renderField('themes', 'evidenceSources', 'Primary Sources of Evidence / Data', 'multiselect', [
                  'Government Data', 'Primary Surveys', 'Archives', 'Museums', 'NGOs', 'Universities', 'International Organizations', 'Industry', 'Satellite Data', 'Open Data', 'Other'
                ])}

                {/* Condition: Museum Researcher */}
                {consultationData.consent?.capacity === 'Museum Researcher' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Collections Research</h3>
                    {renderField('themes', 'museumCollections', 'What specific collections do you study, and what are the primary challenges in researching them?', 'textarea')}
                  </div>
                )}
                
                {/* Condition: Environmental Researcher */}
                {(consultationData.profile?.discipline === 'Environmental Science' || consultationData.themes?.currentThemes?.includes('Climate')) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Climate & Biodiversity Ecosystem</h3>
                    {renderField('themes', 'environmentResearch', 'How does your research intersect with raw material sustainability (e.g., Pashmina, Walnut Wood, Willow) in Kashmir?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Data, Evidence & Collaboration */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Data, Evidence & Collaboration</h2>

                {renderField('data', 'access', 'Do you currently have access to:', 'multiselect', [
                  'Government Data', 'Museum Collections', 'Archives', 'Institutional Datasets', 'Field Data', 'Digital Collections', 'Private Collections', 'GIS Data', 'Remote Sensing', 'AI Datasets', 'None'
                ])}
                
                {renderField('data', 'challenges', 'Major Data Challenges Encountered', 'multiselect', [
                  'Availability', 'Quality', 'Permissions', 'Funding', 'Language', 'Digitization', 'Accessibility', 'Standardization', 'Other'
                ])}
                
                {renderField('data', 'collaboration', 'Interested in Collaborating With:', 'multiselect', [
                  'Universities', 'Government', 'NGOs', 'Museums', 'Industry', 'International Researchers', 'Students', 'Artisans', 'Other', 'None'
                ])}
                
                {/* Collaboration Details */}
                {(!consultationData.data?.collaboration?.includes('None') && consultationData.data?.collaboration?.length > 0) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Collaboration Focus</h3>
                    {renderField('data', 'collabDetails', 'Briefly describe the type of collaborative projects you are interested in pursuing.', 'textarea')}
                  </div>
                )}
                
                {renderField('data', 'openScience', 'Open Science: Would you support or participate in:', 'multiselect', [
                  'Open Data', 'Open Publications', 'Shared Repositories', 'Collaborative Research', 'Citizen Science', 'Other', 'None'
                ])}

                {/* Open Data Details */}
                {consultationData.data?.openScience?.includes('Open Data') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Open Data Repository</h3>
                    {renderField('data', 'repoDetails', 'What standards or protections would you need to confidently share your data in an open repository?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Technology & Research Infrastructure */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Technology & Research Infrastructure</h2>

                {renderField('tech', 'tools', 'Technology / Tools Used in Research', 'multiselect', [
                  'GIS', 'Remote Sensing', 'AI', 'Machine Learning', 'NLP', 'Digital Archives', '3D Scanning', 'Photogrammetry', 'Databases', 'Statistical Software', 'Qualitative Software', 'Other'
                ])}
                
                {renderField('tech', 'aiUsage', 'How do you use AI in your research workflow?', 'multiselect', [
                  'Literature Review', 'Translation', 'Coding', 'Image Analysis', 'Data Cleaning', 'Visualization', 'Prediction', 'Documentation', 'Not Using AI'
                ])}
                
                {/* Condition: AI Researcher */}
                {(consultationData.profile?.discipline === 'AI' || consultationData.profile?.discipline === 'Computer Science' || consultationData.tech?.tools?.includes('Machine Learning')) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">AI Applications in Craft</h3>
                    {renderField('tech', 'aiCraft', 'What are the most promising applications of AI for analyzing or preserving traditional crafts?', 'textarea')}
                  </div>
                )}

                {renderField('tech', 'challenges', 'Research Infrastructure Challenges', 'multiselect', [
                  'Funding', 'Software', 'Hardware', 'Internet', 'Field Access', 'Data Storage', 'Laboratory', 'Research Assistants', 'Institutional Support', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Challenges & Research Gaps */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Challenges & Research Gaps</h2>

                {renderField('challenges', 'topChallenges', 'Top Five Challenges in conducting research on Kashmir Crafts:', 'multiselect', [
                  'Funding', 'Data', 'Access', 'Permissions', 'Field Safety', 'Language', 'Publication', 'Collaboration', 'Technology', 'Policy Access', 'Archives', 'Digitization', 'Other'
                ])}
                
                {renderField('challenges', 'knowledgeGaps', 'What are the major knowledge gaps you perceive in the current literature?', 'textarea')}
                
                {renderField('challenges', 'immediateNeeds', 'Which areas need immediate research attention?', 'multiselect', [
                  'Artisan Livelihoods', 'Youth', 'Women', 'Trade', 'Exports', 'Markets', 'Sustainability', 'Climate', 'Tourism', 'AI', 'Heritage', 'Digital Preservation', 'Education', 'Innovation', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Future Research Agenda */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Future Research Agenda</h2>

                {renderField('future', 'priorityQuestions', 'What are the priority research questions that the academic and policy communities must answer in the next decade?', 'textarea')}
                
                {renderField('future', 'missingDataset', 'What is the most important dataset that is currently missing and needs to be built?', 'textarea')}
                
                {renderField('future', 'collaborations', 'Who should lead future collaborations?', 'multiselect', [
                  'Universities', 'Government', 'Industry', 'NGOs', 'Museums', 'International', 'Students', 'Other'
                ])}
                
                {renderField('future', 'participateIn', 'Would you be willing to participate in:', 'multiselect', [
                  'Research Network', 'Peer Review', 'Policy Panels', 'Workshops', 'Data Repository', 'Annual Conference', 'Expert Groups', 'Mentoring', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'govPriorities', 'Top Priorities for Government Action in Research', 'multiselect', [
                  'Research Funding', 'Open Data', 'Archives', 'Museums', 'Field Support', 'Digitization', 'Research Grants', 'International Collaboration', 'Policy Research', 'AI', 'Other'
                ])}
                
                {renderField('recommendations', 'universities', 'What should Universities improve?', 'multiselect', [
                  'Research', 'Interdisciplinary Programs', 'Labs', 'Archives', 'Partnerships', 'Funding', 'Open Science', 'Other'
                ])}
                
                {renderField('recommendations', 'industry', 'What does the Industry need from researchers?', 'multiselect', [
                  'Research Partnerships', 'Innovation', 'Internships', 'Knowledge Transfer', 'Market Research', 'Other'
                ])}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence, Datasets & Publications</h3>
                  <p className="text-sm text-gray-600 mb-4">You may upload evidence to support your consultation. Examples: Research Papers, Reports, Policy Briefs, Books, Datasets, Working Papers, Survey Instruments, Photographs, Maps, Presentations, Conference Papers, Field Notes, or Research Proposals.</p>
                  
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
                              <option>Research Paper / Journal Article</option>
                              <option>Report / Policy Brief</option>
                              <option>Dataset / Survey Instrument</option>
                              <option>Field Notes / Maps / Photos</option>
                              <option>Presentation / Conference Paper</option>
                              <option>Other</option>
                            </select>
                            <select className="text-xs p-2 border border-gray-300 rounded w-full" defaultValue="">
                              <option value="" disabled>Select Publication Status...</option>
                              <option>Published (Peer Reviewed)</option>
                              <option>Pre-print / Working Paper</option>
                              <option>Internal Report / Unpublished</option>
                              <option>Raw Data / Field Material</option>
                            </select>
                            <select className="text-xs p-2 border border-gray-300 rounded w-full md:col-span-2" defaultValue="">
                              <option value="" disabled>Select Confidentiality...</option>
                              <option>Publicly available (Open Access)</option>
                              <option>Confidential - For KHCRF research analysis only</option>
                              <option>Embargoed - Contact before use</option>
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
                  <p className="text-gray-600 text-lg">Your scholarly consultation response is ready. Please review the details before submitting.</p>
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
                      <span className={isExperienceValid ? "text-green-600" : "text-gray-400"}>Experience</span>
                      <span className={isThemesValid ? "text-green-600" : "text-gray-400"}>Themes</span>
                      <span className={isDataValid ? "text-green-600" : "text-gray-400"}>Data Access</span>
                      <span className={isTechValid ? "text-green-600" : "text-gray-400"}>Tech/Infra</span>
                      <span className={isChallengesValid ? "text-green-600" : "text-gray-400"}>Challenges</span>
                      <span className={isFutureValid ? "text-green-600" : "text-gray-400"}>Future Agenda</span>
                      <span className={isRecommendationsValid ? "text-green-600" : "text-gray-400"}>Recommendations</span>
                      <span className={uploadedFiles.length > 0 ? "text-green-600" : "text-gray-400"}>Evidence (Optional)</span>
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
                          participantType: "Researcher",
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
