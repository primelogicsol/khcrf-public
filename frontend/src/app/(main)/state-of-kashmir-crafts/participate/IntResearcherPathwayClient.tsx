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
  return `SKC-2026-RES-${result}`;
};

export default function IntResearcherPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_res_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_res_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_res_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_res_consultationData', JSON.stringify(consultationData));
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

  const isConsentValid = consultationData.consent?.respondentRole && consultationData.consent?.submissionType;
  const isProfileValid = consultationData.profile?.country && consultationData.profile?.careerStage;
  const isInterestsValid = consultationData.interests?.researchAreas;
  const isPublicationsValid = consultationData.publications?.publishedResearch;
  const isMethodsValid = consultationData.methods?.researchMethods;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isVisionValid = consultationData.vision?.initiatives;
  const isCollaborationValid = consultationData.collaboration?.interestedIn;
  const isRecommendationsValid = consultationData.recommendations?.gov;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isInterestsValid, isPublicationsValid, isMethodsValid, isChallengesValid, isVisionValid, isCollaborationValid, isRecommendationsValid];
  const stepsCompleted = sectionsStatus.filter(Boolean).length;
  const progressPercent = Math.min(100, Math.floor((stepsCompleted / 9) * 100));

  const role = consultationData.consent?.respondentRole;
  const isPhd = role === 'PhD Candidate';
  const isSenior = ['Professor', 'Senior Researcher', 'Associate Professor'].includes(role);
  const isMuseum = role === 'Museum Researcher';
  const isAiDigital = consultationData.profile?.academicDiscipline?.toLowerCase().includes('ai') || consultationData.profile?.academicDiscipline?.toLowerCase().includes('digital');

  const geoExperience = consultationData.interests?.geographicExperience || [];
  const noKashmirExp = !geoExperience.includes('Kashmir') && !geoExperience.includes('Himalayas') && geoExperience.length > 0;
  
  const isPublishedOnKashmir = consultationData.publications?.publishedOnKashmir === 'Yes';
  const isOpenScience = consultationData.methods?.ethicalPriorities?.includes('Open Science');

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
                   International Researcher
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
                  <h2 className="text-3xl font-black text-brand-dark mb-4">Step 1: Consent & Professional Status</h2>
                  <div className="bg-blue-50 text-blue-900 p-5 rounded-2xl border border-blue-100 flex gap-4 text-sm font-medium leading-relaxed">
                    <FaInfoCircle className="text-blue-500 text-xl shrink-0 mt-0.5" />
                    <div>
                      <p className="mb-2">This consultation forms part of the State of Kashmir Crafts Assessment 2026–2027 initiative led by the Hamadan Craft Revival Foundation.</p>
                      <p>It maps international research, collaboration potential, and knowledge gaps. This is an evidence-based consultation, not an academic peer review or funding application.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'respondentRole', 'Respondent Role', 'select', [
                  'Professor', 'Associate Professor', 'Assistant Professor', 'Research Scientist', 'Postdoctoral Researcher', 'PhD Candidate', 'Independent Researcher', 'Museum Researcher', 'Heritage Specialist', 'Policy Researcher', 'Think Tank Researcher', 'Consultant', 'Other'
                ])}
                
                {renderField('consent', 'submissionType', 'Submission Type', 'radio', [
                  'Institutional Perspective',
                  'Research Group Perspective',
                  'Personal Professional Perspective'
                ])}
                
                {renderField('consent', 'identity', 'Submission confidentiality preference', 'radio', [
                  'My name/institution may be publicly identified in research reports',
                  'Identity must remain confidential, but inputs can be used',
                  'Submission may be used only in anonymized, aggregate analysis'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact you regarding future joint research or data sharing?', 'radio', ['Yes', 'No'])}

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
                    <span className="text-sm font-bold text-gray-700">I confirm my participation in this global research mapping initiative.</span>
                  </label>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 2: Research Profile */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Research Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('profile', 'institution', 'Institution (Optional)', 'text')}
                  {renderField('profile', 'country', 'Country', 'text')}
                  {renderField('profile', 'department', 'Department (Optional)', 'text')}
                  {renderField('profile', 'academicDiscipline', 'Academic Discipline', 'text', [], {placeholder: "e.g., Anthropology, Digital Humanities, Economics"})}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('profile', 'yearsResearch', 'Years of Research', 'select', [
                    '0-2 years', '3-5 years', '6-10 years', '11-20 years', '20+ years'
                  ])}
                  {renderField('profile', 'careerStage', 'Career Stage', 'select', [
                    'Early Career', 'Mid Career', 'Senior Researcher', 'Emeritus', 'Independent'
                  ])}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('profile', 'orcid', 'ORCID (Optional)', 'text')}
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Research Interests & Experience */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Research Interests & Experience</h2>

                {renderField('interests', 'researchAreas', 'Primary Research Areas', 'multiselect', [
                  'Handicrafts', 'Traditional Knowledge', 'Intangible Cultural Heritage', 'Museum Studies', 'Conservation', 'Anthropology', 'Design Innovation', 'Creative Economy', 'Rural Development', 'Tourism', 'Sustainability', 'Climate Change', 'Cultural Landscapes', 'Digital Heritage', 'AI', 'Education', 'Public Policy', 'Other'
                ])}
                
                {renderField('interests', 'conducted', 'Have you conducted:', 'multiselect', [
                  'Fieldwork', 'Interviews', 'Ethnography', 'Archival Research', 'Museum Research', 'Comparative Studies', 'Laboratory Analysis', 'Remote Research', 'None'
                ])}
                
                {renderField('interests', 'geographicExperience', 'Geographic Experience', 'multiselect', [
                  'Kashmir', 'Himalayas', 'South Asia', 'Asia', 'Europe', 'Africa', 'Americas', 'Global Comparative Studies', 'Other'
                ])}

                {/* Conditional Branching */}
                {noKashmirExp && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Comparative Research</h3>
                    {renderField('interests', 'comparativeFocus', 'Since your geographic focus is elsewhere, what global comparative methodologies could be applied to study the creative economy of Kashmir?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Publications, Data & Collaboration */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Publications, Data & Collaboration</h2>

                {renderField('publications', 'publishedOnKashmir', 'Have you published specifically on Kashmir?', 'radio', ['Yes', 'No'])}

                {renderField('publications', 'publishedResearch', 'Published Research Formats', 'multiselect', [
                  'Books', 'Journal Articles', 'Conference Papers', 'Policy Reports', 'Working Papers', 'Museum Catalogues', 'Digital Archives', 'Technical Reports', 'Other'
                ])}
                
                {renderField('publications', 'interestedIn', 'Interested In', 'multiselect', [
                  'Joint Research', 'Co-authorship', 'Visiting Fellowship', 'Student Exchange', 'Data Sharing', 'Conferences', 'Workshops', 'Capacity Building', 'Comparative Studies', 'Other'
                ])}
                
                {renderField('publications', 'dataNeeds', 'Research Data Needs', 'multiselect', [
                  'Statistics', 'GIS', 'Craft Census', 'Economic Data', 'Environmental Data', 'Museum Collections', 'Archives', 'Oral Histories', 'Images', 'Audio', 'Video', 'Other'
                ])}

                {/* Conditional Logic */}
                {isPublishedOnKashmir && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Publication Impact</h3>
                    {renderField('publications', 'impactFocus', 'What have been the primary citation networks or policy impacts of your research on Kashmir?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Research Methods & Innovation */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Research Methods & Innovation</h2>

                {renderField('methods', 'researchMethods', 'Research Methods', 'multiselect', [
                  'Quantitative', 'Qualitative', 'Mixed Methods', 'GIS', 'Remote Sensing', 'AI', 'Machine Learning', 'Ethnography', 'Historical Research', 'Conservation Science', 'Digital Humanities', 'Participatory Research', 'Survey Research', 'Other'
                ])}
                
                {renderField('methods', 'techUsed', 'Technology Used', 'multiselect', [
                  'GIS', 'AI', 'OCR', 'Computer Vision', 'NLP', 'Digital Archives', 'Photogrammetry', '3D Scanning', 'Statistical Software', 'Other'
                ])}
                
                {renderField('methods', 'ethicalPriorities', 'Ethical Priorities', 'multiselect', [
                  'Community Consent', 'Indigenous Knowledge Rights', 'Data Privacy', 'Open Science', 'Benefit Sharing', 'Cultural Sensitivity', 'Other'
                ])}

                {/* Conditional Logic */}
                {isAiDigital && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">AI & Computational Heritage</h3>
                    {renderField('methods', 'aiFocus', 'How can NLP, Computer Vision, or AI be leveraged to digitize, interpret, or preserve Kashmiri design motifs and archival texts?', 'textarea')}
                  </div>
                )}

                {isOpenScience && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Open Science & Reproducibility</h3>
                    {renderField('methods', 'openScienceFocus', 'What specific FAIR (Findable, Accessible, Interoperable, Reusable) data repositories do you recommend for sharing craft census or heritage data?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Challenges & Knowledge Gaps */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Challenges & Knowledge Gaps</h2>

                {renderField('challenges', 'topChallenges', 'Top Challenges for International Research', 'multiselect', [
                  'Limited Data', 'Limited Access', 'Funding', 'Collaboration', 'Language', 'Documentation', 'Digitization', 'Climate Information', 'Heritage Inventories', 'Comparative Research', 'Publication Access', 'Other'
                ])}
                
                {renderField('challenges', 'knowledgeGap', 'Most Important Knowledge Gap', 'textarea')}
                
                {renderField('challenges', 'priorityAreas', 'Priority Research Areas', 'multiselect', [
                  'Heritage', 'Economy', 'Climate', 'Tourism', 'AI', 'Sustainability', 'Education', 'Gender', 'Youth', 'Museums', 'Traditional Knowledge', 'Digital Heritage', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Future Research Priorities */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Future Research Priorities</h2>

                {renderField('vision', 'vision2030', 'Research Priorities for 2030, 2035, and 2040', 'textarea')}
                
                {renderField('vision', 'initiatives', 'Which initiatives should exist?', 'multiselect', [
                  'International Research Consortium', 'Open Data Portal', 'Craft Observatory', 'Heritage GIS', 'Digital Archive', 'Research Fellowship', 'Museum Research Network', 'AI Research Lab', 'Climate Observatory', 'Annual Global Conference', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Global Collaboration */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Global Collaboration</h2>

                {renderField('collaboration', 'interestedIn', 'Interested In:', 'multiselect', [
                  'Joint Projects', 'Visiting Faculty', 'Student Exchange', 'Comparative Studies', 'Museum Collaboration', 'UNESCO Projects', 'ICCROM Projects', 'International Publications', 'Research Advisory Board', 'Peer Review Network', 'Other'
                ])}
                
                {renderField('collaboration', 'preferred', 'Preferred Collaboration Partners', 'multiselect', [
                  'Universities', 'Museums', 'NGOs', 'Government', 'Communities', 'Artisans', 'International Organizations', 'Technology Companies', 'Other'
                ])}

                {/* Conditional Logic */}
                {isPhd && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Doctoral Research Support</h3>
                    {renderField('collaboration', 'phdFocus', 'What specific fieldwork support, archival access, or local supervision would facilitate your PhD research?', 'textarea')}
                  </div>
                )}
                
                {isSenior && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Academic Leadership & Policy</h3>
                    {renderField('collaboration', 'seniorFocus', 'How can international research networks more effectively influence public policy regarding the creative economy in South Asia?', 'textarea')}
                  </div>
                )}
                
                {isMuseum && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Museum & Heritage Collections</h3>
                    {renderField('collaboration', 'museumFocus', 'How can we improve international digital access to provenance records and conservation documentation for Kashmiri collections globally?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'gov', 'Recommendations for Government & Policy Makers', 'textarea')}
                {renderField('recommendations', 'universities', 'Recommendations for Universities, Museums & Researchers', 'textarea')}
                {renderField('recommendations', 'tech', 'Recommendations for Technology Companies & Funding Agencies', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence & Documentation Upload</h3>
                  <p className="text-sm text-gray-600 mb-4">Researchers may upload Journal Articles, Books, Datasets, GIS Layers, Policy Briefs, Conference Papers, Presentations, or Technical Reports.</p>
                  
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
                              <option>Journal Article / Book Chapter</option>
                              <option>Dataset / GIS Layer</option>
                              <option>Policy Brief / Technical Report</option>
                              <option>Conference Paper / Presentation</option>
                              <option>Other</option>
                            </select>
                            <input type="text" placeholder="Title / Year / DOI (Optional)" className="text-xs p-2 border border-gray-300 rounded w-full" />
                            <select className="text-xs p-2 border border-gray-300 rounded w-full md:col-span-2" defaultValue="">
                              <option value="" disabled>Select Permissions...</option>
                              <option>Open Access (Publicly available)</option>
                              <option>For KHCRF internal analysis only (Copyrighted)</option>
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
                  <p className="text-gray-600 text-lg">Your international research consultation response is ready. Please review the details before submitting.</p>
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
                      <span className={isInterestsValid ? "text-green-600" : "text-gray-400"}>Interests</span>
                      <span className={isPublicationsValid ? "text-green-600" : "text-gray-400"}>Publications</span>
                      <span className={isMethodsValid ? "text-green-600" : "text-gray-400"}>Methods</span>
                      <span className={isChallengesValid ? "text-green-600" : "text-gray-400"}>Challenges</span>
                      <span className={isVisionValid ? "text-green-600" : "text-gray-400"}>Vision</span>
                      <span className={isCollaborationValid ? "text-green-600" : "text-gray-400"}>Collaboration</span>
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
                          participantType: "IntResearcher",
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
