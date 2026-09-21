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
  return `SKC-2026-INTORG-${result}`;
};

export default function IntOrgPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_intorg_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_intorg_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_intorg_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_intorg_consultationData', JSON.stringify(consultationData));
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
  const isStrategyValid = consultationData.strategy?.strategicPriorities;
  const isProgramsValid = consultationData.programs?.areasSupport;
  const isKnowledgeValid = consultationData.knowledge?.knowledgeProducts;
  const isSustainableValid = consultationData.sustainable?.priorityThemes;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isVisionValid = consultationData.vision?.vision2030;
  const isRecommendationsValid = consultationData.recommendations?.gov;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isStrategyValid, isProgramsValid, isKnowledgeValid, isSustainableValid, isChallengesValid, isVisionValid, isRecommendationsValid];
  const stepsCompleted = sectionsStatus.filter(Boolean).length;
  const progressPercent = Math.min(100, Math.floor((stepsCompleted / 9) * 100));

  const orgType = consultationData.profile?.orgType;
  const isUN = orgType === 'UN Agency';
  const isDevBank = orgType === 'Multilateral Development Bank';
  const isHeritageOrg = ['Cultural Organization', 'Heritage Organization'].includes(orgType);
  const isNGO = orgType === 'International NGO';
  const isResearch = ['Research Organization', 'International Think Tank'].includes(orgType);
  
  const areas = consultationData.profile?.primaryAreas || [];
  const strat = consultationData.strategy?.strategicPriorities || [];
  const noHandicrafts = !areas.includes('Handicrafts') && !strat.includes('Cultural Heritage') && !strat.includes('Creative Economy');
  
  const innovation = consultationData.knowledge?.innovationAreas || [];
  const digitalFocus = consultationData.sustainable?.digitalFocus || [];
  const isAI = innovation.includes('AI') || digitalFocus.includes('Data Platforms') || digitalFocus.includes('Decision Support');

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
                   International Org / Agency
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
                      <p>It maps institutional capacity, technical assistance capabilities, and partnership opportunities. This is an evidence-based institutional consultation, not a grant application or procurement portal.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'respondentRole', 'Respondent Role', 'select', [
                  'Country Representative', 'Regional Director', 'Program Director', 'Project Manager', 'Technical Specialist', 'Policy Advisor', 'Partnership Manager', 'Knowledge Management Officer', 'Research Lead', 'Development Specialist', 'Programme Officer', 'Authorized Representative', 'Other'
                ])}
                
                {renderField('consent', 'submissionType', 'Submission Type', 'radio', [
                  'Official Organizational Response',
                  'Regional Office Response',
                  'Country Office Response',
                  'Personal Professional Perspective'
                ])}
                
                {renderField('consent', 'identity', 'Submission confidentiality preference', 'radio', [
                  'Organization may be publicly identified in partnership reports',
                  'Organization must remain confidential, but inputs can be used',
                  'Submission may be used only in anonymized, aggregate analysis'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact you regarding future technical cooperation or policy dialogue?', 'radio', ['Yes', 'No'])}

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
                    <span className="text-sm font-bold text-gray-700">I confirm my authority to submit these perspectives on behalf of the organization/office.</span>
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
                  {renderField('profile', 'orgType', 'Organization Type', 'select', [
                    'UN Agency', 'Multilateral Development Bank', 'Bilateral Development Agency', 'International NGO', 'International Foundation', 'Development Finance Institution', 'Cultural Organization', 'Heritage Organization', 'Research Organization', 'Technical Cooperation Agency', 'International Think Tank', 'Other'
                  ])}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('profile', 'countryHQ', 'Country / Headquarters', 'text')}
                  {renderField('profile', 'regionalCoverage', 'Regional Coverage', 'select', [
                    'Global', 'Regional', 'Multi-country', 'National', 'Other'
                  ])}
                </div>
                
                {renderField('profile', 'primaryAreas', 'Primary Areas of Work', 'multiselect', [
                  'Cultural Heritage', 'Handicrafts', 'Livelihoods', 'Poverty Reduction', 'Women Empowerment', 'Youth Development', 'Climate Change', 'Environment', 'Tourism', 'Trade', 'Education', 'Research', 'Innovation', 'AI', 'Digital Transformation', 'Governance', 'Inclusive Development', 'Sustainable Development', 'Other'
                ])}
                
                {renderField('profile', 'yearsOperating', 'Years Operating globally', 'select', [
                  '0-5 years', '6-10 years', '11-20 years', '20-50 years', '50+ years'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Strategic Priorities & Areas of Work */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Strategic Priorities & Areas of Work</h2>

                {renderField('strategy', 'strategicPriorities', 'Current Strategic Priorities', 'multiselect', [
                  'Cultural Heritage', 'Creative Economy', 'MSMEs', 'Rural Development', 'Climate Resilience', 'Sustainable Tourism', 'Women\'s Economic Empowerment', 'Youth Employment', 'Innovation', 'Digital Transformation', 'Sustainable Livelihoods', 'Biodiversity', 'Circular Economy', 'Skills Development', 'Policy Reform', 'Other'
                ])}
                
                {renderField('strategy', 'currentEngagement', 'Current Engagement Modalities', 'multiselect', [
                  'Direct Projects', 'Technical Assistance', 'Capacity Building', 'Research', 'Knowledge Products', 'Policy Support', 'Networking', 'Conferences', 'None', 'Other'
                ])}
                
                {renderField('strategy', 'sdgs', 'Relevant SDGs', 'multiselect', [
                  'SDG 1', 'SDG 4', 'SDG 5', 'SDG 8', 'SDG 9', 'SDG 10', 'SDG 11', 'SDG 12', 'SDG 13', 'SDG 16', 'SDG 17'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Programs, Partnerships & Technical Cooperation */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Programs, Partnerships & Technical Cooperation</h2>

                {noHandicrafts ? (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Strategic Relevance</h3>
                    {renderField('programs', 'relevanceFocus', 'Since your organization does not directly work on handicrafts, how do your priorities (e.g. climate resilience, poverty reduction, digital inclusion) intersect with the artisan economy?', 'textarea')}
                  </div>
                ) : (
                  <>
                    {renderField('programs', 'collaboratesWith', 'Organization collaborates with:', 'multiselect', [
                      'Governments', 'Universities', 'Museums', 'NGOs', 'Cooperatives', 'Artisans', 'Private Sector', 'Financial Institutions', 'International Organizations', 'Community Organizations', 'Other'
                    ])}
                    
                    {renderField('programs', 'areasSupport', 'Areas of Support', 'multiselect', [
                      'Technical Assistance', 'Policy Development', 'Research', 'Capacity Building', 'Knowledge Sharing', 'Innovation', 'Digital Transformation', 'Monitoring & Evaluation', 'Heritage Conservation', 'Enterprise Development', 'Other'
                    ])}
                  </>
                )}

                {renderField('programs', 'preferredModels', 'Preferred Partnership Models', 'multiselect', [
                  'Joint Programmes', 'Technical Cooperation', 'Research Partnerships', 'Capacity-building', 'Policy Dialogue', 'Knowledge Networks', 'Public-Private Partnerships', 'South-South Cooperation', 'Triangular Cooperation', 'Other'
                ])}

                {/* Conditional Logic */}
                {isNGO && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Community & Implementation</h3>
                    {renderField('programs', 'ngoFocus', 'How does your organization localize its field operations and build capacity among local implementing partners in the creative economy?', 'textarea')}
                  </div>
                )}
                
                {isResearch && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Evidence Generation & Policy</h3>
                    {renderField('programs', 'researchFocus', 'What specific policy analysis or evidence generation capabilities can your institution provide to support sustainable heritage frameworks?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Knowledge, Innovation & Capacity Building */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Knowledge, Innovation & Capacity Building</h2>

                {renderField('knowledge', 'knowledgeProducts', 'Knowledge Products Produced', 'multiselect', [
                  'Research Reports', 'Policy Briefs', 'Toolkits', 'Standards', 'Guidelines', 'Databases', 'Training Modules', 'Online Courses', 'Case Studies', 'Other'
                ])}
                
                {renderField('knowledge', 'innovationAreas', 'Innovation Areas Supported', 'multiselect', [
                  'AI', 'GIS', 'Remote Sensing', 'Digital Heritage', 'Digital Commerce', 'Blockchain', 'Smart Authentication', 'Climate Technologies', 'Open Data', 'Other'
                ])}
                
                {renderField('knowledge', 'capacityPriorities', 'Capacity Building Priorities', 'multiselect', [
                  'Institutional Strengthening', 'Leadership', 'Research', 'Heritage Conservation', 'Entrepreneurship', 'Women', 'Youth', 'Monitoring & Evaluation', 'Digital Skills', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Sustainable Development & Global Frameworks */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Sustainable Development & Global Frameworks</h2>

                {renderField('sustainable', 'frameworks', 'Relevant International Frameworks', 'multiselect', [
                  'Sustainable Development Goals', 'UNESCO Conventions', 'Sendai Framework', 'Paris Agreement', 'New Urban Agenda', 'Convention on Biological Diversity', 'Creative Economy Frameworks', 'ICH Convention 2003', 'Other'
                ])}
                
                {renderField('sustainable', 'priorityThemes', 'Priority Themes', 'multiselect', [
                  'Climate Adaptation', 'Inclusive Growth', 'Heritage Protection', 'Social Inclusion', 'Green Economy', 'Circular Economy', 'Local Economic Development', 'Digital Inclusion', 'Disaster Risk Reduction', 'Other'
                ])}
                
                {renderField('sustainable', 'digitalFocus', 'AI and Digital Transformation Current Focus', 'multiselect', [
                  'Research', 'Data Platforms', 'Decision Support', 'Knowledge Management', 'Translation', 'Digital Archives', 'Analytics', 'None', 'Other'
                ])}

                {/* Conditional Logic */}
                {isUN && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Normative Guidance & SDGs</h3>
                    {renderField('sustainable', 'unFocus', 'How does your agency align its normative frameworks to support creative economies and decent work for marginalized artisan groups?', 'textarea')}
                  </div>
                )}
                
                {isDevBank && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Development Financing</h3>
                    {renderField('sustainable', 'bankFocus', 'What financing instruments or investment frameworks does your institution deploy to support MSME growth in traditional heritage sectors?', 'textarea')}
                  </div>
                )}
                
                {isHeritageOrg && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Heritage Conservation Cooperation</h3>
                    {renderField('sustainable', 'heritageFocus', 'Detail your organization\'s approach to international cooperation for safeguarding intangible cultural heritage and museum networks.', 'textarea')}
                  </div>
                )}

                {isAI && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">AI & Data Governance</h3>
                    {renderField('sustainable', 'aiFocus', 'What data governance standards or digital public goods frameworks do you require when deploying AI or digital technologies in development projects?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Challenges & Opportunities */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Challenges & Opportunities</h2>

                {renderField('challenges', 'topChallenges', 'Top Challenges for International Cooperation', 'multiselect', [
                  'Limited Data', 'Institutional Coordination', 'Funding Constraints', 'Capacity Gaps', 'Climate Risks', 'Heritage Loss', 'Digital Divide', 'Policy Gaps', 'Research Gaps', 'Monitoring Challenges', 'Community Participation', 'Other'
                ])}
                
                {renderField('challenges', 'opportunity', 'Greatest Opportunity for Impact', 'textarea')}
                
                {renderField('challenges', 'priorityAreas', 'Priority Areas for Future Cooperation (List up to 10)', 'textarea')}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Future Collaboration Vision */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Future Collaboration Vision</h2>

                {renderField('vision', 'interestedIn', 'Would your organization be interested in:', 'multiselect', [
                  'International Advisory Council', 'Knowledge Partnership', 'Technical Working Group', 'Joint Research', 'Annual Global Forum', 'Capacity-building Network', 'Digital Heritage Initiative', 'AI Innovation Network', 'Sustainable Craft Alliance', 'International Observatory', 'Other'
                ])}
                
                {renderField('vision', 'vision2030', 'Vision for International Cooperation by 2030, 2035, and 2040', 'textarea')}
                
                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'gov', 'Recommendations for Government & Policy Makers', 'textarea')}
                {renderField('recommendations', 'private', 'Recommendations for Private Sector & Financial Institutions', 'textarea')}
                {renderField('recommendations', 'civil', 'Recommendations for Civil Society, Museums & Research Institutions', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence & Documentation Upload</h3>
                  <p className="text-sm text-gray-600 mb-4">Organizations may upload Strategy Documents, Country Programmes, Policy Papers, Technical Guidelines, Toolkits, Evaluation Reports, or Standards.</p>
                  
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
                              <option>Strategy Document / Country Programme</option>
                              <option>Policy Paper / Technical Guideline</option>
                              <option>Evaluation Report / Research Report</option>
                              <option>Knowledge Product / Toolkit</option>
                              <option>Standard / Framework</option>
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
                  <p className="text-gray-600 text-lg">Your international organization consultation response is ready. Please review the details before submitting.</p>
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
                      <span className={isStrategyValid ? "text-green-600" : "text-gray-400"}>Strategy</span>
                      <span className={isProgramsValid ? "text-green-600" : "text-gray-400"}>Programs</span>
                      <span className={isKnowledgeValid ? "text-green-600" : "text-gray-400"}>Knowledge</span>
                      <span className={isSustainableValid ? "text-green-600" : "text-gray-400"}>Sustainable</span>
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
                          participantType: "IntOrg",
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
