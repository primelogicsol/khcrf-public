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
  return `SKC-2026-MUS-${result}`;
};

export default function IntMuseumPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_mus_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_mus_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_mus_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_mus_consultationData', JSON.stringify(consultationData));
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
  const isProfileValid = consultationData.profile?.orgType && consultationData.profile?.primaryAreas;
  const isCollectionsValid = consultationData.collections?.holdsKashmir;
  const isExhibitionsValid = consultationData.exhibitions?.conducts;
  const isConservationValid = consultationData.conservation?.undertakes;
  const isCollaborationValid = consultationData.collaboration?.interestedIn;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isVisionValid = consultationData.vision?.vision2030;
  const isRecommendationsValid = consultationData.recommendations?.gov;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isCollectionsValid, isExhibitionsValid, isConservationValid, isCollaborationValid, isChallengesValid, isVisionValid, isRecommendationsValid];
  const stepsCompleted = sectionsStatus.filter(Boolean).length;
  const progressPercent = Math.min(100, Math.floor((stepsCompleted / 9) * 100));

  const orgType = consultationData.profile?.orgType;
  const isMuseum = ['Museum', 'University Museum', 'Research Museum', 'Living Heritage Institution', 'National Museum', 'Private Museum'].includes(orgType);
  const isArchiveLib = ['Archive', 'Library'].includes(orgType);
  
  const holdsKashmir = consultationData.collections?.holdsKashmir;
  
  const tech = consultationData.conservation?.digitalTech || [];
  const usesAI = tech.includes('AI');
  
  const diplomacy = consultationData.collaboration?.diplomacy || [];
  const doesLoans = diplomacy.includes('Loan Programs');
  
  const conservation = consultationData.conservation?.undertakes || [];
  const hasActiveResearch = conservation.includes('Collection Research') || conservation.includes('Provenance Research') || conservation.includes('Publication');

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
                   International Museum / Cultural Institution
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
                  <h2 className="text-3xl font-black text-brand-dark mb-4">Step 1: Consent & Institutional Authority</h2>
                  <div className="bg-blue-50 text-blue-900 p-5 rounded-2xl border border-blue-100 flex gap-4 text-sm font-medium leading-relaxed">
                    <FaInfoCircle className="text-blue-500 text-xl shrink-0 mt-0.5" />
                    <div>
                      <p className="mb-2">This consultation forms part of the State of Kashmir Crafts Assessment 2026–2027 initiative led by the Hamadan Craft Revival Foundation.</p>
                      <p>It maps collections, research, conservation capabilities, and international cultural collaboration. This is an evidence-based institutional consultation, not a loan request or collection audit.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'respondentRole', 'Respondent Role', 'select', [
                  'Museum Director', 'Curator', 'Chief Curator', 'Registrar', 'Archivist', 'Conservator', 'Collections Manager', 'Exhibition Manager', 'Education Officer', 'Digital Collections Manager', 'Research Director', 'Library Director', 'Cultural Institution Director', 'Authorized Representative', 'Other'
                ])}
                
                {renderField('consent', 'submissionType', 'Submission Type', 'radio', [
                  'Official Institutional Response',
                  'Department Response',
                  'Personal Professional Perspective'
                ])}
                
                {renderField('consent', 'identity', 'Submission confidentiality preference', 'radio', [
                  'Institution may be publicly identified in museum reports',
                  'Institution must remain confidential, but inputs can be used',
                  'Submission may be used only in anonymized, aggregate analysis'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact you regarding future exhibition collaboration or heritage documentation?', 'radio', ['Yes', 'No'])}

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
                    <span className="text-sm font-bold text-gray-700">I confirm my authority to submit these perspectives on behalf of the institution/department.</span>
                  </label>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 2: Institution Profile */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Institution Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('profile', 'orgName', 'Institution Name', 'text')}
                  {renderField('profile', 'orgType', 'Institution Type', 'select', [
                    'Museum', 'Gallery', 'Cultural Centre', 'Archive', 'Library', 'Heritage Trust', 'Foundation', 'University Museum', 'Research Museum', 'Living Heritage Institution', 'National Museum', 'Private Museum', 'Other'
                  ])}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {renderField('profile', 'country', 'Country', 'text')}
                  {renderField('profile', 'city', 'City', 'text')}
                  {renderField('profile', 'yearEstablished', 'Year Established', 'select', [
                    'Pre-1900', '1900-1950', '1951-2000', '2001-Present'
                  ])}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('profile', 'website', 'Website', 'text')}
                  {renderField('profile', 'governance', 'Governance', 'select', [
                    'Government', 'University', 'Private', 'Non-profit', 'Foundation', 'Community', 'Other'
                  ])}
                </div>
                
                {renderField('profile', 'primaryAreas', 'Primary Areas of Focus', 'multiselect', [
                  'Handicrafts', 'Decorative Arts', 'Textiles', 'Anthropology', 'Ethnography', 'Archaeology', 'Design', 'Folk Art', 'Intangible Heritage', 'Conservation', 'Archives', 'Education', 'Cultural History', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Collections & Documentation */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Collections & Documentation</h2>

                {renderField('collections', 'maintains', 'Institution Maintains:', 'multiselect', [
                  'Permanent Collection', 'Archive', 'Library', 'Digital Repository', 'Textile Collection', 'Decorative Arts Collection', 'Craft Collection', 'Oral History Collection', 'Audio Archive', 'Video Archive', 'Photography Archive', 'Other'
                ])}
                
                {renderField('collections', 'holdsKashmir', 'Does the institution hold material related to Kashmir?', 'radio', ['Yes', 'No', 'Unsure'])}

                {holdsKashmir === 'Yes' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    {renderField('collections', 'categories', 'Collection Categories (Kashmir)', 'multiselect', [
                      'Textiles', 'Carpets', 'Pashmina', 'Shawls', 'Papier Mâché', 'Woodwork', 'Metalwork', 'Manuscripts', 'Photography', 'Archival Documents', 'Contemporary Craft', 'Other'
                    ])}
                  </div>
                )}
                
                {renderField('collections', 'documentation', 'Documentation Methods Used', 'multiselect', [
                  'Collection Database', 'Digital Catalogues', 'Photography', '3D Scanning', 'Metadata Standards', 'GIS', 'Oral Histories', 'Conservation Records', 'Other'
                ])}

                {/* Conditional Logic */}
                {holdsKashmir === 'Yes' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Provenance & Interpretation</h3>
                    {renderField('collections', 'provenanceFocus', 'How does your institution research provenance and culturally interpret its Kashmir collections for the public?', 'textarea')}
                  </div>
                )}
                
                {holdsKashmir === 'No' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Future Acquisitions & Partnerships</h3>
                    {renderField('collections', 'noKashmirFocus', 'Since your institution does not hold Kashmir collections, what comparative collections do you hold, and are there future interests in exhibitions or partnerships?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Exhibitions, Education & Public Engagement */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Exhibitions, Education & Public Engagement</h2>

                {renderField('exhibitions', 'conducts', 'Institution Conducts:', 'multiselect', [
                  'Permanent Exhibitions', 'Temporary Exhibitions', 'Traveling Exhibitions', 'Virtual Exhibitions', 'Workshops', 'Lectures', 'Public Programs', 'School Programs', 'Community Outreach', 'Artist Residencies', 'Craft Demonstrations', 'Other'
                ])}
                
                {renderField('exhibitions', 'audiences', 'Audience Types', 'multiselect', [
                  'Schools', 'Universities', 'Researchers', 'Families', 'Tourists', 'Collectors', 'General Public', 'International Visitors', 'Professionals', 'Other'
                ])}
                
                {renderField('exhibitions', 'education', 'Educational Activities', 'multiselect', [
                  'Museum Education', 'Heritage Interpretation', 'Publications', 'Online Learning', 'Guided Tours', 'Digital Learning', 'Other'
                ])}

                {/* Conditional Logic */}
                {isMuseum && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Visitor Engagement</h3>
                    {renderField('exhibitions', 'museumFocus', 'How do you engage contemporary artisans or source communities in the curation and exhibition of traditional crafts?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Conservation, Research & Digital Heritage */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Conservation, Research & Digital Heritage</h2>

                {renderField('conservation', 'undertakes', 'Institution Undertakes:', 'multiselect', [
                  'Preventive Conservation', 'Restoration', 'Scientific Conservation', 'Documentation', 'Provenance Research', 'Publication', 'Collection Research', 'Digitization', 'Climate Monitoring', 'Disaster Planning', 'Other'
                ])}
                
                {renderField('conservation', 'digitalTech', 'Digital Technologies Used', 'multiselect', [
                  'Collection Management System', 'AI', 'OCR', 'Computer Vision', '3D Scanning', 'Photogrammetry', 'Digital Preservation', 'Linked Open Data', 'IIIF', 'Other'
                ])}
                
                {renderField('conservation', 'researchAreas', 'Research Areas', 'multiselect', [
                  'Craft History', 'Textile Studies', 'Conservation Science', 'Museum Studies', 'Anthropology', 'Design', 'Material Culture', 'Heritage Policy', 'Digital Heritage', 'Other'
                ])}

                {/* Conditional Logic */}
                {usesAI && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">AI & Computational Heritage</h3>
                    {renderField('conservation', 'aiFocus', 'How is AI deployed within your institution for cataloguing, image recognition, multilingual metadata, or digital preservation?', 'textarea')}
                  </div>
                )}
                
                {isArchiveLib && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Archival Standards & Access</h3>
                    {renderField('conservation', 'archiveFocus', 'What metadata standards and digital preservation frameworks govern access to your historical manuscripts and cultural archives?', 'textarea')}
                  </div>
                )}
                
                {hasActiveResearch && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Academic & Research Collaboration</h3>
                    {renderField('conservation', 'researchFocus', 'Detail your institution\'s approach to academic collaboration, fellowships, and joint publications with international researchers.', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: International Collaboration & Cultural Exchange */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: International Collaboration & Cultural Exchange</h2>

                {renderField('collaboration', 'current', 'Current Collaboration Partners', 'multiselect', [
                  'Museums', 'Universities', 'UNESCO', 'ICOM', 'ICCROM', 'Researchers', 'Governments', 'Communities', 'Artists', 'Other'
                ])}
                
                {renderField('collaboration', 'interestedIn', 'Interested In:', 'multiselect', [
                  'Joint Exhibitions', 'Collection Research', 'Conservation Projects', 'Staff Exchange', 'Student Exchange', 'Traveling Exhibitions', 'Shared Digital Collections', 'Heritage Documentation', 'Joint Publications', 'International Conferences', 'Other'
                ])}
                
                {renderField('collaboration', 'diplomacy', 'Cultural Diplomacy Participation', 'multiselect', [
                  'International Exhibitions', 'Cultural Exchange', 'Loan Programs', 'Heritage Partnerships', 'Global Networks', 'None', 'Other'
                ])}

                {/* Conditional Logic */}
                {doesLoans && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">International Loans & Mobility</h3>
                    {renderField('collaboration', 'loansFocus', 'What are your primary requirements regarding insurance, facility reports, and conservation standards for international collection mobility?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Challenges & Opportunities */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Challenges & Opportunities</h2>

                {renderField('challenges', 'topChallenges', 'Top Challenges', 'multiselect', [
                  'Conservation Resources', 'Funding', 'Documentation', 'Digitization', 'Climate Change', 'Collection Storage', 'Public Engagement', 'Skilled Staff', 'Technology', 'International Collaboration', 'Provenance Research', 'Other'
                ])}
                
                {renderField('challenges', 'opportunity', 'Greatest Opportunity for Impact', 'textarea')}
                
                {renderField('challenges', 'heritageGap', 'Most Important Heritage / Collection Gap', 'textarea')}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Future Vision */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Future Vision</h2>

                {renderField('vision', 'vision2030', 'Vision for the Cultural Sector by 2030, 2035, and 2040', 'textarea')}
                
                {renderField('vision', 'priorities', 'Future Priorities & Initiatives', 'multiselect', [
                  'Shared Digital Museum', 'Kashmir Craft Collection Network', 'Global Exhibition Programme', 'International Conservation Initiative', 'Craft Documentation Programme', 'AI Heritage Platform', 'Research Consortium', 'Museum Fellowship', 'Cultural Diplomacy Network', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'gov', 'Recommendations for Government & Museums', 'textarea')}
                {renderField('recommendations', 'research', 'Recommendations for Universities & Researchers', 'textarea')}
                {renderField('recommendations', 'international', 'Recommendations for UNESCO, ICOM, ICCROM & Tech Companies', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence & Documentation Upload</h3>
                  <p className="text-sm text-gray-600 mb-4">Institutions may upload Collection Catalogues, Exhibition Catalogues, Conservation Reports, Strategic Plans, Heritage Policies, or Sample Database Records.</p>
                  
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
                              <option>Collection / Exhibition Catalogue</option>
                              <option>Conservation / Research Report</option>
                              <option>Strategic Plan / Heritage Policy</option>
                              <option>Educational Material / Museum Guide</option>
                              <option>Digital Collection Record (Sample)</option>
                              <option>Other</option>
                            </select>
                            <input type="text" placeholder="Title / Year" className="text-xs p-2 border border-gray-300 rounded w-full" />
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
                  <p className="text-gray-600 text-lg">Your international cultural institution consultation response is ready. Please review the details before submitting.</p>
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
                      <span className={isCollectionsValid ? "text-green-600" : "text-gray-400"}>Collections</span>
                      <span className={isExhibitionsValid ? "text-green-600" : "text-gray-400"}>Exhibitions</span>
                      <span className={isConservationValid ? "text-green-600" : "text-gray-400"}>Conservation</span>
                      <span className={isCollaborationValid ? "text-green-600" : "text-gray-400"}>Collaboration</span>
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
                          participantType: "IntMuseum",
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
