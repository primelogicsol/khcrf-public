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
  return `SKC-2026-MED-${result}`;
};

export default function MediaPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_med_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_med_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_med_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_med_consultationData', JSON.stringify(consultationData));
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
  const isProfileValid = consultationData.profile?.primaryMedium && consultationData.profile?.primaryBeat;
  const isCoverageValid = consultationData.coverage?.reportedOn;
  const isAudienceValid = consultationData.audience?.primaryAudience;
  const isPracticesValid = consultationData.practices?.reportingMethods;
  const isTechValid = consultationData.tech?.digitalTools;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isVisionValid = consultationData.vision?.wouldParticipateIn;
  const isRecommendationsValid = consultationData.recommendations?.gov;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isCoverageValid, isAudienceValid, isPracticesValid, isTechValid, isChallengesValid, isVisionValid, isRecommendationsValid];
  const stepsCompleted = sectionsStatus.filter(Boolean).length;
  const progressPercent = Math.min(100, Math.floor((stepsCompleted / 9) * 100));

  const hasCoveredHandicrafts = consultationData.coverage?.reportedOn?.includes('Handicrafts');

  return (
    <div className="animate-fade-in">
       {step < 11 && (
         <div className="bg-brand-dark pt-32 pb-16 relative overflow-hidden">
           
           <div className="container mx-auto px-4 relative z-10 text-center">
             <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-brand-secondary uppercase border border-brand-secondary/30 rounded-[12px]">
               COMMUNICATION & TOURISM CONSULTATION
             </span>
             <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Participation Portal</h1>
             
             <div className="max-w-4xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
               <div className="flex items-center gap-4 text-left mb-4 md:mb-0">
                 <div className="bg-brand-primary/20 text-brand-secondary px-3 py-1 rounded-[10px] text-xs font-black uppercase tracking-wider border border-brand-secondary/30">
                   Media Professional
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
                  <h2 className="text-3xl font-black text-brand-dark mb-4">Step 1: Consent & Professional Authority</h2>
                  <div className="bg-blue-50 text-blue-900 p-5 rounded-2xl border border-blue-100 flex gap-4 text-sm font-medium leading-relaxed">
                    <FaInfoCircle className="text-blue-500 text-xl shrink-0 mt-0.5" />
                    <div>
                      <p className="mb-2">This consultation forms part of the State of Kashmir Crafts Assessment 2026–2027 initiative led by the Hamadan Craft Revival Foundation.</p>
                      <p>It maps the media landscape to understand how communication professionals report, document, and interpret Kashmir's handicrafts ecosystem. This is an evidence-based consultation, not a press registration portal.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'respondentRole', 'Respondent Role', 'select', [
                  'Journalist', 'Editor', 'Publisher', 'Documentary Producer', 'Documentary Director', 'News Editor', 'Bureau Chief', 'Photojournalist', 'Videographer', 'Podcast Producer', 'Content Creator', 'YouTuber', 'Communications Officer', 'Media Researcher', 'Freelance Journalist', 'Other'
                ])}
                
                {renderField('consent', 'submissionType', 'Submission Type', 'radio', [
                  'Official Media Organization Response',
                  'Editorial Response',
                  'Personal Professional Perspective'
                ])}
                
                {renderField('consent', 'identity', 'Submission confidentiality preference', 'radio', [
                  'My name/organization may be publicly identified',
                  'My identity must remain confidential, but inputs can be used',
                  'Submission may be used only in anonymized, aggregate analysis'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact you regarding future media fellowships or documentation initiatives?', 'radio', ['Yes', 'No'])}

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
                    <span className="text-sm font-bold text-gray-700">I confirm my participation in this public communication mapping initiative.</span>
                  </label>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 2: Professional Profile */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Professional Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('profile', 'orgName', 'Media Organization (Optional)', 'text')}
                  {renderField('profile', 'yearsExperience', 'Years of Experience', 'select', [
                    '0-2 years', '3-5 years', '6-10 years', '11-20 years', '20+ years'
                  ])}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {renderField('profile', 'country', 'Country', 'text')}
                  {renderField('profile', 'state', 'State', 'text')}
                  {renderField('profile', 'district', 'District (Optional)', 'text')}
                </div>
                
                {renderField('profile', 'website', 'Website / Portfolio Link', 'text')}

                {renderField('profile', 'primaryMedium', 'Primary Medium', 'select', [
                  'Newspaper', 'Magazine', 'Television', 'Radio', 'Digital News', 'Documentary', 'Podcast', 'YouTube', 'Social Media', 'Newsletter', 'Independent Media', 'Other'
                ])}
                
                {renderField('profile', 'primaryBeat', 'Primary Beat / Focus', 'select', [
                  'Handicrafts', 'Culture', 'Heritage', 'Tourism', 'Business', 'Economy', 'Environment', 'Education', 'Government', 'Society', 'Rural Development', 'Lifestyle', 'International Affairs', 'Other'
                ])}

                {/* Conditional Branching */}
                {consultationData.consent?.respondentRole === 'International Correspondent' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">International Perspective</h3>
                    {renderField('profile', 'intlFocus', 'How do international audiences perceive Kashmir\'s cultural heritage, and what challenges exist in cross-border reporting?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Coverage Areas & Story Development */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Coverage Areas & Story Development</h2>

                {renderField('coverage', 'reportedOn', 'Have you reported on:', 'multiselect', [
                  'Handicrafts', 'Artisan Livelihoods', 'Heritage', 'Museums', 'Tourism', 'Environment', 'Women Entrepreneurs', 'Youth', 'Rural Economy', 'Exports', 'Design', 'Innovation', 'GI', 'Sustainability', 'Climate', 'Traditional Knowledge', 'Other'
                ])}
                
                {/* Conditional Branching: If never covered handicrafts */}
                {!hasCoveredHandicrafts ? (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Future Interest & Barriers</h3>
                    {renderField('coverage', 'futureInterest', 'Since you have not covered handicrafts previously, what information, data, or access would help you report on the sector in the future?', 'textarea')}
                  </div>
                ) : (
                  <>
                    {renderField('coverage', 'storySources', 'Typical Story Sources', 'multiselect', [
                      'Field Reporting', 'Interviews', 'Government Reports', 'Researchers', 'NGOs', 'Artisans', 'Museums', 'Archives', 'Universities', 'Industry', 'Community Members', 'Public Data', 'Other'
                    ])}
                  </>
                )}
                
                {renderField('coverage', 'storyFormats', 'Story Formats Produced', 'multiselect', [
                  'News', 'Feature', 'Investigative', 'Opinion', 'Documentary', 'Podcast', 'Photo Essay', 'Video Story', 'Explainer', 'Interactive Story', 'Data Journalism', 'Other'
                ])}

                {/* Conditional Branching */}
                {consultationData.profile?.primaryMedium === 'Newspaper' || consultationData.profile?.primaryMedium === 'Magazine' ? (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Investigative & Long-form Reporting</h3>
                    {renderField('coverage', 'printFocus', 'What are the main obstacles to publishing in-depth, long-form investigative pieces on the rural craft economy?', 'textarea')}
                  </div>
                ) : null}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Audience, Platforms & Engagement */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Audience, Platforms & Engagement</h2>

                {renderField('audience', 'primaryAudience', 'Primary Audience', 'multiselect', [
                  'Local', 'National', 'International', 'Tourists', 'Researchers', 'Government', 'Students', 'Industry', 'Artisans', 'General Public', 'Other'
                ])}
                
                {renderField('audience', 'platforms', 'Publishing Platforms', 'multiselect', [
                  'Website', 'Print', 'TV', 'Radio', 'YouTube', 'Facebook', 'Instagram', 'X', 'LinkedIn', 'Podcast', 'Newsletter', 'Other'
                ])}
                
                {renderField('audience', 'engagement', 'Audience Engagement Mechanisms', 'multiselect', [
                  'Comments', 'Community Events', 'Interviews', 'Public Forums', 'Live Sessions', 'Social Media', 'Other'
                ])}

                {/* Conditional Branching */}
                {(consultationData.consent?.respondentRole === 'Content Creator' || consultationData.consent?.respondentRole === 'YouTuber') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Digital Audience Growth</h3>
                    {renderField('audience', 'digitalFocus', 'How do you build trust and engagement with a younger digital audience when discussing traditional heritage topics?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Journalism Practices & Content Production */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Journalism Practices & Content Production</h2>

                {renderField('practices', 'reportingMethods', 'Reporting Methods', 'multiselect', [
                  'Field Visits', 'Interviews', 'Archival Research', 'Photography', 'Drone', 'Audio Recording', 'Video Production', 'Data Journalism', 'Fact Checking', 'Investigative Reporting', 'Other'
                ])}
                
                {renderField('practices', 'verification', 'Verification Methods', 'multiselect', [
                  'Multiple Sources', 'Official Documents', 'Expert Review', 'Community Verification', 'Image Verification', 'Open Source Intelligence', 'Other'
                ])}
                
                {renderField('practices', 'contentChallenges', 'Content Production Challenges', 'multiselect', [
                  'Access', 'Travel', 'Data', 'Documentation', 'Funding', 'Language', 'Time', 'Fact Verification', 'Safety', 'Other'
                ])}

                {/* Conditional Branching */}
                {(consultationData.consent?.respondentRole === 'Documentary Producer' || consultationData.consent?.respondentRole === 'Documentary Director') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Documentary Production</h3>
                    {renderField('practices', 'docFocus', 'What challenges do you face in securing funding and archival footage for long-form heritage documentaries?', 'textarea')}
                  </div>
                )}

                {consultationData.practices?.reportingMethods?.includes('Video Production') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Multimedia Workflow</h3>
                    {renderField('practices', 'videoFocus', 'How has mobile journalism (MoJo) or new video technology altered your field reporting in rural craft clusters?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Digital Media, AI & Innovation */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Digital Media, AI & Innovation</h2>

                {renderField('tech', 'digitalTools', 'Digital Tools Used', 'multiselect', [
                  'CMS', 'Analytics', 'GIS', 'Editing Software', 'AI', 'Cloud Collaboration', 'Transcription', 'Translation', 'Other'
                ])}
                
                {renderField('tech', 'aiUsage', 'AI Usage in Workflow', 'multiselect', [
                  'Research', 'Translation', 'Video Editing', 'Image Enhancement', 'Transcription', 'Headline Suggestions', 'Content Summaries', 'Fact Organization', 'Not Using AI'
                ])}
                
                {renderField('tech', 'futureTech', 'Future Technologies of Interest', 'multiselect', [
                  'Interactive Maps', 'VR', 'AR', 'Digital Archives', 'AI Search', 'Immersive Storytelling', '3D Heritage', 'Other'
                ])}

                {/* Conditional Branching */}
                {(consultationData.tech?.digitalTools?.includes('AI') || !consultationData.tech?.aiUsage?.includes('Not Using AI')) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">AI in Journalism</h3>
                    {renderField('tech', 'aiFocus', 'How are you integrating AI into your editorial workflow, and what ethical guardrails do you apply regarding fact-checking?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Challenges & Information Gaps */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Challenges & Information Gaps</h2>

                {renderField('challenges', 'topChallenges', 'Top Challenges', 'multiselect', [
                  'Lack of Reliable Data', 'Limited Access to Artisans', 'Language Barriers', 'Heritage Documentation', 'Funding', 'Time', 'Misinformation', 'Limited Archives', 'Digital Skills', 'Public Awareness', 'Climate Information', 'Other'
                ])}
                
                {renderField('challenges', 'topicsNeedingCoverage', 'Topics Needing Better Coverage (Open response)', 'textarea')}
                
                {renderField('challenges', 'underreportedIssue', 'What is the most underreported issue in Kashmir Crafts? (Open response)', 'textarea')}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Future Vision */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Future Vision</h2>

                {renderField('vision', 'vision2030', 'How should media support Kashmir Crafts by 2030, 2035, and 2040?', 'textarea')}
                
                {renderField('vision', 'wouldParticipateIn', 'Would you participate in:', 'multiselect', [
                  'Craft Media Network', 'Media Fellowship', 'Documentary Initiative', 'Fact-checking Network', 'Knowledge Repository', 'Journalism Workshops', 'International Collaboration', 'Annual Media Forum', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'gov', 'Recommendations for Government & Policymakers', 'textarea')}
                {renderField('recommendations', 'industry', 'Recommendations for Tourism Sector, Museums & Universities', 'textarea')}
                {renderField('recommendations', 'media', 'Recommendations for Media Houses & Tech Companies', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence & Portfolio Upload</h3>
                  <p className="text-sm text-gray-600 mb-4">Media professionals may upload Published Articles, Documentary Films, Podcasts, Photo Essays, Interviews, Editorials, or Media Research.</p>
                  
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
                              <option value="" disabled>Select Content Type...</option>
                              <option>Published Article / Feature</option>
                              <option>Documentary / Video Report</option>
                              <option>Podcast / Audio Story</option>
                              <option>Photo Essay / Photography</option>
                              <option>Editorial / Opinion</option>
                              <option>Media Research / Publication</option>
                              <option>Other</option>
                            </select>
                            <input type="text" placeholder="Publication / Year / URL" className="text-xs p-2 border border-gray-300 rounded w-full" />
                            <select className="text-xs p-2 border border-gray-300 rounded w-full md:col-span-2" defaultValue="">
                              <option value="" disabled>Select Permissions...</option>
                              <option>Publicly available / Creative Commons</option>
                              <option>For KHCRF internal policy analysis only</option>
                              <option>Contact me for copyright permission</option>
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
                  <p className="text-gray-600 text-lg">Your media consultation response is ready. Please review the details before submitting.</p>
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
                      <span className={isCoverageValid ? "text-green-600" : "text-gray-400"}>Coverage</span>
                      <span className={isAudienceValid ? "text-green-600" : "text-gray-400"}>Audience</span>
                      <span className={isPracticesValid ? "text-green-600" : "text-gray-400"}>Practices</span>
                      <span className={isTechValid ? "text-green-600" : "text-gray-400"}>Tech/AI</span>
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
                          participantType: "Media",
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
