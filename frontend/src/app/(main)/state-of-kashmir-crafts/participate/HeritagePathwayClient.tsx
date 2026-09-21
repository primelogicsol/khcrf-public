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
  return `SKC-2026-HER-${result}`;
};

export default function HeritagePathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_her_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_her_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_her_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_her_consultationData', JSON.stringify(consultationData));
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
  const isProfileValid = consultationData.profile?.orgName && consultationData.profile?.legalStatus;
  const isAssetsValid = consultationData.assets?.worksWith;
  const isConservationValid = consultationData.conservation?.activities;
  const isCollectionsValid = consultationData.profile?.primaryFocus?.includes('Museums') ? consultationData.collections?.status : true; 
  const isRiskValid = consultationData.risk?.majorRisks;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isVisionValid = consultationData.vision?.vision2030;
  const isRecommendationsValid = consultationData.recommendations?.gov;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isAssetsValid, isConservationValid, isCollectionsValid, isRiskValid, isChallengesValid, isVisionValid, isRecommendationsValid];
  const stepsCompleted = sectionsStatus.filter(Boolean).length;
  const progressPercent = Math.min(100, Math.floor((stepsCompleted / 9) * 100));

  const hasCollections = consultationData.profile?.primaryFocus?.includes('Museums') || consultationData.profile?.primaryFocus?.includes('Archives');

  return (
    <div className="animate-fade-in">
       {step < 11 && (
         <div className="bg-brand-dark pt-32 pb-16 relative overflow-hidden">
           
           <div className="container mx-auto px-4 relative z-10 text-center">
             <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-brand-secondary uppercase border border-brand-secondary/30 rounded-[12px]">
               HERITAGE CONSERVATION CONSULTATION
             </span>
             <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Participation Portal</h1>
             
             <div className="max-w-4xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
               <div className="flex items-center gap-4 text-left mb-4 md:mb-0">
                 <div className="bg-brand-primary/20 text-brand-secondary px-3 py-1 rounded-[10px] text-xs font-black uppercase tracking-wider border border-brand-secondary/30">
                   Heritage Organization
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
                  <h2 className="text-3xl font-black text-brand-dark mb-4">Step 1: Consent & Organizational Authority</h2>
                  <div className="bg-blue-50 text-blue-900 p-5 rounded-2xl border border-blue-100 flex gap-4 text-sm font-medium leading-relaxed">
                    <FaInfoCircle className="text-blue-500 text-xl shrink-0 mt-0.5" />
                    <div>
                      <p className="mb-2">This consultation forms part of the State of Kashmir Crafts Assessment 2026–2027 initiative led by the Hamadan Craft Revival Foundation.</p>
                      <p>It is designed to collect institutional knowledge regarding the preservation, documentation, and conservation of Kashmir's tangible and intangible craft heritage. This is not a funding proposal or a UNESCO nomination form.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'respondentRole', 'Respondent Role', 'select', [
                  'Chairperson', 'Director', 'Museum Director', 'Curator', 'Archivist', 'Conservator', 'Heritage Manager', 'Documentation Officer', 'Research Director', 'Project Coordinator', 'Trustee', 'Authorized Representative', 'Other'
                ])}
                
                {renderField('consent', 'submissionType', 'Submission Type', 'radio', [
                  'Official Organizational Response',
                  'Museum Response',
                  'Archive Response',
                  'Regional Office Response',
                  'Personal Professional Perspective'
                ])}
                
                {renderField('consent', 'identity', 'Submission confidentiality preference', 'radio', [
                  'Organization may be publicly identified in policy reports',
                  'Organization name must remain confidential, but inputs can be used',
                  'Submission may be used only in anonymized, aggregate analysis'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact you regarding future heritage networks or digital archives?', 'radio', ['Yes', 'No'])}

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
                    <span className="text-sm font-bold text-gray-700">I confirm my authority to submit these perspectives on behalf of the organization/program.</span>
                  </label>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 2: Organization Profile */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Organization Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('profile', 'orgName', 'Organization Name', 'text')}
                  {renderField('profile', 'yearEstablished', 'Year Established', 'number')}
                </div>
                
                {renderField('profile', 'legalStatus', 'Legal Status', 'select', [
                  'Trust', 'Foundation', 'Society', 'Museum', 'Archive', 'Cultural Institution', 'Research Institute', 'Community Heritage Group', 'Government Heritage Institution', 'International Organization', 'Other'
                ])}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {renderField('profile', 'country', 'Country', 'text')}
                  {renderField('profile', 'state', 'State', 'text')}
                  {renderField('profile', 'district', 'District', 'text')}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('profile', 'website', 'Website', 'text')}
                  {renderField('profile', 'email', 'Official Email', 'email')}
                </div>

                {renderField('profile', 'primaryFocus', 'Primary Heritage Focus', 'multiselect', [
                  'Handicrafts', 'Intangible Cultural Heritage', 'Traditional Knowledge', 'Museums', 'Archives', 'Conservation', 'Archaeology', 'Architecture', 'Oral History', 'Cultural Landscapes', 'Folk Traditions', 'Performing Arts', 'Documentation', 'Heritage Education', 'Other'
                ])}

                {/* Conditional Branching */}
                {consultationData.profile?.legalStatus === 'UNESCO-related Organization' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">International Frameworks</h3>
                    {renderField('profile', 'unescoFocus', 'How does your work align with or implement international safeguarding conventions (e.g., 2003 Convention)?', 'textarea')}
                  </div>
                )}
                
                {consultationData.profile?.legalStatus === 'Community Heritage Group' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Community Custodianship</h3>
                    {renderField('profile', 'communityFocus', 'How do you empower local community members to act as primary custodians of their own intangible heritage?', 'textarea')}
                  </div>
                )}

                {renderField('profile', 'geographicCoverage', 'Geographic Coverage', 'select', [
                  'Village', 'District', 'Regional', 'UT', 'National', 'International'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Heritage Assets & Documentation */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Heritage Assets & Documentation</h2>

                {renderField('assets', 'worksWith', 'Organization works with:', 'multiselect', [
                  'Living Craft Traditions', 'Traditional Knowledge', 'Historic Collections', 'Museum Objects', 'Manuscripts', 'Photographs', 'Audio Archives', 'Video Archives', 'Oral Histories', 'Design Archives', 'Technical Documentation', 'Digital Collections', 'Community Archives', 'Other'
                ])}
                
                {renderField('assets', 'documentation', 'Documentation Activities', 'multiselect', [
                  'Surveys', 'Inventories', 'Oral Histories', 'Audio Recording', 'Photography', 'Video Documentation', '3D Scanning', 'GIS Mapping', 'Cataloguing', 'Translation', 'Community Documentation', 'Other'
                ])}
                
                {renderField('assets', 'crafts', 'Crafts Covered', 'multiselect', [
                  'Pashmina', 'Carpet', 'Kani', 'Papier Mâché', 'Walnut Wood', 'Copperware', 'Sozni', 'Crewel', 'Namdah', 'Chain Stitch', 'Willow Work', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Conservation, Research & Community Engagement */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Conservation, Research & Community Engagement</h2>

                {renderField('conservation', 'activities', 'Activities', 'multiselect', [
                  'Conservation', 'Restoration', 'Preventive Conservation', 'Research', 'Publications', 'Community Workshops', 'Exhibitions', 'Documentation', 'Apprenticeship Programs', 'Heritage Education', 'Museum Interpretation', 'Public Outreach', 'Other'
                ])}

                {/* Conditional Branching */}
                {consultationData.conservation?.activities?.includes('Conservation') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Conservation Science</h3>
                    {renderField('conservation', 'conservationFocus', 'Describe your primary approaches to preventive conservation and risk management for historic textiles and organic materials.', 'textarea')}
                  </div>
                )}
                
                {renderField('conservation', 'communityParticipation', 'Communities involved in:', 'multiselect', [
                  'Documentation', 'Decision-making', 'Traditional Knowledge Sharing', 'Oral History', 'Conservation', 'Events', 'Monitoring', 'Other'
                ])}
                
                {renderField('conservation', 'researchAreas', 'Research Areas', 'multiselect', [
                  'Heritage', 'Conservation Science', 'Anthropology', 'Craft History', 'Traditional Knowledge', 'Digital Heritage', 'Museums', 'Tourism', 'Climate', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Collections, Archives & Digital Heritage */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Collections, Archives & Digital Heritage</h2>

                {renderField('collections', 'maintains', 'Organization maintains:', 'multiselect', [
                  'Museum Collection', 'Archive', 'Library', 'Digital Repository', 'Image Collection', 'Audio Collection', 'Video Collection', 'GIS Database', 'Oral History Repository', 'Craft Samples', 'Conservation Records', 'Other'
                ])}
                
                {!hasCollections ? (
                  <div className="bg-blue-50 text-blue-900 p-5 rounded-2xl border border-blue-100 mb-4 text-sm font-medium">
                    <p>Since your organization does not maintain physical collections, the remaining sections will focus on living heritage, digital innovation, and community engagement.</p>
                  </div>
                ) : (
                  <>
                    {/* Conditional Logic: Museum */}
                    {consultationData.profile?.primaryFocus?.includes('Museums') && (
                      <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                        <h3 className="font-bold text-brand-dark mb-4">Museum Interpretation & Visitor Engagement</h3>
                        {renderField('collections', 'museumFocus', 'How do you interpret historic craft objects to communicate the living intangible heritage of the artisans who made them?', 'textarea')}
                      </div>
                    )}

                    {/* Conditional Logic: Archive */}
                    {consultationData.profile?.primaryFocus?.includes('Archives') && (
                      <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                        <h3 className="font-bold text-brand-dark mb-4">Archival Management</h3>
                        {renderField('collections', 'archiveFocus', 'What metadata standards and preservation protocols do you use for your audio-visual and oral history archives?', 'textarea')}
                      </div>
                    )}
                  </>
                )}
                
                {renderField('collections', 'status', 'Digitization Status', 'radio', [
                  'Fully Digitized', 'Partially Digitized', 'Planned', 'Not Started'
                ])}
                
                {renderField('collections', 'technologies', 'Digital Technologies', 'multiselect', [
                  'Collection Management Software', 'GIS', 'AI', 'OCR', '3D Scanning', 'Photogrammetry', 'Digital Preservation Systems', 'Cloud Archive', 'QR Systems', 'Other'
                ])}
                
                {renderField('collections', 'publicAccess', 'Public Access to Collections/Data', 'radio', [
                  'Open', 'Registration Required', 'Research Access', 'Restricted', 'Internal Only'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Risk Management, Sustainability & Innovation */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Risk Management, Sustainability & Innovation</h2>

                {renderField('risk', 'majorRisks', 'Major Risks to Heritage', 'multiselect', [
                  'Climate Change', 'Flooding', 'Fire', 'Earthquake', 'Humidity', 'Biological Damage', 'Theft', 'Loss of Knowledge', 'Aging Practitioners', 'Lack of Documentation', 'Urbanization', 'Tourism Pressure', 'Other'
                ])}
                
                {renderField('risk', 'preparedness', 'Disaster & Risk Preparedness', 'multiselect', [
                  'Disaster Plan', 'Emergency Collections Plan', 'Backup Archive', 'Digital Backup', 'Risk Assessment', 'None'
                ])}
                
                {renderField('risk', 'innovation', 'Innovation in Heritage', 'multiselect', [
                  'AI', 'Digital Heritage', 'Virtual Museums', 'Interactive Exhibitions', 'Mobile Apps', 'Community Mapping', 'Blockchain Authentication', 'Citizen Science', 'Other'
                ])}

                {/* Conditional Logic */}
                {consultationData.risk?.innovation?.includes('AI') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">AI in Digital Heritage</h3>
                    {renderField('risk', 'aiFocus', 'How is your organization utilizing AI for tasks such as automated cataloguing, translation of historical texts, or digital preservation?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Challenges & Heritage Gaps */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Challenges & Heritage Gaps</h2>

                {renderField('challenges', 'topChallenges', 'Top Five Challenges', 'multiselect', [
                  'Funding', 'Conservation Skills', 'Documentation', 'Digitization', 'Climate Change', 'Community Participation', 'Research', 'Skilled Conservators', 'Technology', 'Public Awareness', 'Policy Support', 'Other'
                ])}
                
                {renderField('challenges', 'endangered', 'Most Endangered Heritage (Open Response)', 'textarea')}
                
                {renderField('challenges', 'knowledgeGaps', 'Critical Knowledge Gaps (Open Response)', 'textarea')}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Future Vision */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Future Vision</h2>

                {renderField('vision', 'vision2030', 'Vision for Kashmir Craft Heritage in 2030-2040', 'textarea')}
                
                {renderField('vision', 'priorityInitiatives', 'Priority Initiatives for the Sector', 'multiselect', [
                  'Digital Heritage Platform', 'Craft Heritage Observatory', 'Living Heritage Registry', 'National Craft Archive', 'Museum Network', 'Community Heritage Network', 'Apprenticeship Revival', 'Heritage Tourism', 'AI Documentation', 'International Cooperation', 'Other'
                ])}
                
                {renderField('vision', 'interestedIn', 'Interested in participating in:', 'multiselect', [
                  'Heritage Consortium', 'Shared Digital Repository', 'International Research', 'Conservation Network', 'Museum Network', 'Annual Heritage Forum', 'Community Archive Initiative', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'gov', 'Recommendations for Government & Museums', 'textarea')}
                {renderField('recommendations', 'academic', 'Recommendations for Universities & Researchers', 'textarea')}
                {renderField('recommendations', 'community', 'Recommendations for Communities, Artisans & NGOs', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence Upload</h3>
                  <p className="text-sm text-gray-600 mb-4">Organizations may upload Collection Catalogues, Conservation Reports, Heritage Inventories, Museum Guides, Research Publications, Oral History Records, Audio/Video Archives, Photographs, GIS Data, or Digitization Reports.</p>
                  
                  <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-brand-primary text-icon-on-light rounded-xl font-bold hover:bg-brand-primary hover:text-white transition">
                    <FaUpload /> Upload Files
                  </button>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                        <p className="text-xs text-yellow-800 font-bold">Important Notice regarding Cultural IP:</p>
                        <p className="text-xs text-yellow-700 mt-1">Ensure that uploading digital heritage records does not violate community traditional knowledge rights or compromise security-sensitive collection locations.</p>
                      </div>
                      
                      {uploadedFiles.map((uf, idx) => (
                        <div key={idx} className="flex flex-col bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-gray-800 flex items-center gap-2"><FaFileAlt data-ui-icon  className=""/> {uf.file.name}</span>
                            <button onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700"><FaTimes /></button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                            <select className="text-xs p-2 border border-gray-300 rounded w-full" defaultValue="">
                              <option value="" disabled>Select Evidence Type...</option>
                              <option>Collection Catalogue / Inventory</option>
                              <option>Conservation / Condition Report</option>
                              <option>Oral History / Audio / Video</option>
                              <option>GIS Data / Map / Photograph</option>
                              <option>Research Publication / Guide</option>
                              <option>Other</option>
                            </select>
                            <input type="text" placeholder="Title / Year" className="text-xs p-2 border border-gray-300 rounded w-full" />
                            <select className="text-xs p-2 border border-gray-300 rounded w-full md:col-span-2" defaultValue="">
                              <option value="" disabled>Select Permissions...</option>
                              <option>Publicly available for digital archive</option>
                              <option>For KHCRF internal heritage mapping only</option>
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
                  <p className="text-gray-600 text-lg">Your heritage organization consultation response is ready. Please review the details before submitting.</p>
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
                      <span className={isAssetsValid ? "text-green-600" : "text-gray-400"}>Assets</span>
                      <span className={isConservationValid ? "text-green-600" : "text-gray-400"}>Conservation</span>
                      <span className={isCollectionsValid ? "text-green-600" : "text-gray-400"}>Collections</span>
                      <span className={isRiskValid ? "text-green-600" : "text-gray-400"}>Risk Mgt</span>
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
                          participantType: "Heritage",
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
