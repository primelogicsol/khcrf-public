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
  return `SKC-2026-POL-${result}`;
};

export default function PoliticalPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_pol_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_pol_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_pol_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_pol_consultationData', JSON.stringify(consultationData));
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

  const isConsentValid = consultationData.consent?.role && consultationData.consent?.authority;
  const isProfileValid = consultationData.profile?.partyName && consultationData.profile?.jurisdiction;
  const isPrioritiesValid = consultationData.priorities?.highestPriority;
  const isGovValid = consultationData.gov?.mechanisms;
  const isEcoValid = consultationData.eco?.priorities;
  const isInnovValid = consultationData.innov?.invest;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isVisionValid = consultationData.vision?.vision2030;
  const isRecommendationsValid = consultationData.recommendations?.gov;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isPrioritiesValid, isGovValid, isEcoValid, isInnovValid, isChallengesValid, isVisionValid, isRecommendationsValid];
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
                   Political Party Consultation
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
                  <h2 className="text-3xl font-black text-brand-dark mb-4">Step 1: Consent & Authority</h2>
                  <div className="bg-blue-50 text-blue-900 p-5 rounded-2xl border border-blue-100 flex gap-4 text-sm font-medium leading-relaxed">
                    <FaInfoCircle className="text-blue-500 text-xl shrink-0 mt-0.5" />
                    <div>
                      <p className="mb-2">This consultation forms part of the State of Kashmir Crafts Assessment 2026–2027 initiative led by the Hamadan Craft Revival Foundation.</p>
                      <p>It seeks to understand the public policy perspectives of political organizations regarding Kashmir's handicrafts ecosystem. This instrument is politically neutral and does not evaluate, rank, or compare political ideologies or electoral strategies.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'role', 'Respondent Role', 'select', [
                  'Party President', 'Vice President', 'General Secretary', 'Spokesperson', 'Policy Advisor', 'Research Cell', 'Manifesto Committee', 'Legislative Member', 'Youth Wing Representative', 'Women\'s Wing Representative', 'Authorized Representative', 'Other'
                ])}
                
                {renderField('consent', 'authority', 'Submission Authority', 'radio', [
                  'Official Party Response',
                  'Official Policy Cell Response',
                  'Individual Party Representative',
                  'Personal Professional Perspective'
                ])}
                
                {renderField('consent', 'identity', 'Submission confidentiality preference', 'radio', [
                  'Party may be publicly identified in policy mapping reports',
                  'Party name must remain confidential, but policy inputs can be used',
                  'Submission may be used only in anonymized, aggregate policy analysis'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact the party regarding future policy roundtables or legislative dialogues?', 'radio', ['Yes', 'No'])}

                {consultationData.consent?.contact === 'Yes' && (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField('consent', 'contactName', 'Contact Name', 'text')}
                    {renderField('consent', 'contactEmail', 'Official Email', 'email')}
                    {renderField('consent', 'contactPhone', 'Phone', 'tel')}
                  </div>
                )}
                
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
                  <label className="block font-bold text-gray-900 mb-4">Mandatory Consent</label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check1 || false} onChange={e => handleChange('consent', 'check1', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I understand the policy mapping and consultation purpose of this instrument.</span>
                  </label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check2 || false} onChange={e => handleChange('consent', 'check2', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I confirm the level of authority under which I am submitting this response.</span>
                  </label>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 2: Party Profile */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Party Profile</h2>
                
                {renderField('profile', 'partyName', 'Party Name (Optional if submitting confidentially)', 'text')}
                
                {renderField('profile', 'jurisdiction', 'Jurisdiction', 'radio', [
                  'National', 'Regional', 'State', 'District', 'Local'
                ])}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {renderField('profile', 'yearsActive', 'Years Active', 'select', [
                    '0-5 years', '6-20 years', '20-50 years', '50+ years'
                  ])}
                  {renderField('profile', 'website', 'Official Website', 'text')}
                </div>

                {renderField('profile', 'representation', 'Current Representation Level', 'radio', [
                  'Parliament', 'Legislative Assembly', 'Local Government', 'Opposition', 'No Current Representation', 'Other'
                ])}
                
                {renderField('profile', 'policyAreas', 'Primary Areas of Public Policy Focus', 'multiselect', [
                  'Economy', 'Rural Development', 'Tourism', 'MSMEs', 'Heritage', 'Environment', 'Education', 'Employment', 'Women', 'Youth', 'Innovation', 'Digital Governance', 'Infrastructure', 'Agriculture', 'Trade', 'Other'
                ])}

                {/* Conditional Branching based on Wing */}
                {consultationData.consent?.role === 'Youth Wing Representative' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Youth Participation</h3>
                    {renderField('profile', 'youthFocus', 'Describe the party\'s specific initiatives for engaging youth in traditional heritage and new economy sectors.', 'textarea')}
                  </div>
                )}
                
                {consultationData.consent?.role === "Women's Wing Representative" && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Women's Economic Empowerment</h3>
                    {renderField('profile', 'womenFocus', 'Detail the party\'s specific policy priorities for female artisans and women-led craft enterprises.', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Policy Priorities */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Policy Priorities</h2>

                {renderField('priorities', 'highestPriority', 'Which handicraft-related areas deserve the highest public policy priority? (Select up to 10)', 'multiselect', [
                  'Artisan Welfare', 'Income Security', 'Market Access', 'Export Promotion', 'Tourism', 'Heritage Conservation', 'Education', 'Research', 'Skill Development', 'Women Entrepreneurs', 'Youth Employment', 'Cooperative Strengthening', 'Climate Adaptation', 'Sustainable Raw Materials', 'GI Protection', 'Anti-counterfeit Measures', 'Digital Commerce', 'AI & Technology', 'Infrastructure', 'Credit Access', 'Innovation', 'Design', 'International Branding', 'Other'
                ])}

                {renderField('priorities', 'manifesto', 'Does the party currently include handicrafts in its published policy documents / manifesto?', 'radio', [
                  'Yes', 'Partially', 'Planned', 'No'
                ])}

                {consultationData.priorities?.manifesto === 'Yes' && (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-gray-900 mb-4">Manifesto Commitments</h3>
                    {renderField('priorities', 'manifestoDetails', 'Please summarize the key commitments or policy positions regarding handicrafts included in recent manifestos.', 'textarea')}
                  </div>
                )}

                {/* Conditional logic based on representation */}
                {consultationData.profile?.jurisdiction === 'National' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">National Policy Coordination</h3>
                    {renderField('priorities', 'nationalCoordination', 'How does the party view the integration of Kashmir\'s crafts into national economic frameworks (e.g., Make in India, export missions)?', 'textarea')}
                  </div>
                )}
                
                {consultationData.profile?.jurisdiction === 'Regional' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Regional Development Priorities</h3>
                    {renderField('priorities', 'regionalPriorities', 'How does the party prioritize handicrafts within the broader context of regional economic autonomy and development?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Governance & Legislative Perspectives */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Governance & Legislative Perspectives</h2>

                {renderField('gov', 'mechanisms', 'Which policy mechanisms should receive greater attention?', 'multiselect', [
                  'New Legislation', 'Amendment of Existing Laws', 'Administrative Reforms', 'Institutional Coordination', 'Dedicated Craft Policy', 'Dedicated Budget', 'Independent Research', 'Monitoring Framework', 'Digital Registry', 'Public Participation', 'Heritage Protection', 'Export Policy', 'Tourism Policy', 'Other'
                ])}

                {(consultationData.profile?.representation === 'Parliament' || consultationData.profile?.representation === 'Legislative Assembly') ? (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-gray-900 mb-4">Legislative Priorities</h3>
                    {renderField('gov', 'legPriorities', 'What specific legislative actions or bills does the party intend to support or propose regarding the artisan economy?', 'textarea')}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-gray-900 mb-4">Future Policy Proposals</h3>
                    {renderField('gov', 'futurePriorities', 'What specific policy proposals would the party champion if elected to legislative office?', 'textarea')}
                  </div>
                )}

                {renderField('gov', 'coordination', 'Rate the current effectiveness of Interdepartmental Coordination regarding crafts', 'radio', [
                  'Excellent', 'Good', 'Moderate', 'Limited', 'Needs Improvement'
                ])}
                
                {renderField('gov', 'consultation', 'Should future policy be developed through:', 'multiselect', [
                  'Public Consultation', 'Artisan Consultation', 'Industry Consultation', 'Academic Consultation', 'Multi-stakeholder Forums', 'Independent Research', 'Parliamentary Committees', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Economic & Social Development */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Economic & Social Development</h2>

                {renderField('eco', 'priorities', 'Select Economic Priorities', 'multiselect', [
                  'Employment', 'Rural Livelihoods', 'Women\'s Empowerment', 'Youth Employment', 'MSMEs', 'Cooperatives', 'Tourism', 'Entrepreneurship', 'Financial Inclusion', 'Infrastructure', 'Export Growth', 'Digital Economy', 'Local Manufacturing', 'Cultural Economy', 'Other'
                ])}
                
                {renderField('eco', 'environmental', 'Select Environmental Priorities', 'multiselect', [
                  'Sustainable Materials', 'Forest Conservation', 'Climate Adaptation', 'Circular Economy', 'Water Conservation', 'Renewable Energy', 'Waste Reduction', 'Biodiversity', 'Other'
                ])}

                {renderField('eco', 'social', 'Select Social Priorities', 'multiselect', [
                  'Inclusion', 'Traditional Knowledge', 'Cultural Identity', 'Artisan Recognition', 'Social Security', 'Health', 'Education', 'Housing', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Innovation, Sustainability & Future Readiness */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Innovation, Sustainability & Future Readiness</h2>

                {renderField('innov', 'invest', 'Should government invest more in:', 'multiselect', [
                  'AI', 'Digital Heritage', 'Innovation Labs', 'Design Centres', 'Startup Incubation', 'Export Technology', 'Digital Marketplaces', 'Craft Museums', 'Research Networks', 'GIS', 'Digital Documentation', 'Other'
                ])}
                
                {renderField('innov', 'climate', 'Climate Readiness Policy Priorities', 'multiselect', [
                  'Disaster Preparedness', 'Climate Adaptation', 'Sustainable Tourism', 'Green Manufacturing', 'Environmental Monitoring', 'Other'
                ])}
                
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-4">
                  <h3 className="font-bold text-gray-900 mb-4">Rate the importance of Technology Adoption for policy support:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['AI', 'Digital Payments', 'QR Authentication', 'Blockchain', 'E-commerce', 'Digital Registries', 'Open Data'].map((tech) => (
                      <div key={tech}>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">{tech}</label>
                        <select className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none" onChange={e => handleChange('innov', `tech_${tech}`, e.target.value)} value={consultationData.innov?.[`tech_${tech}`] || ""}>
                          <option value="" disabled>Select Rating</option>
                          <option>Very High</option>
                          <option>High</option>
                          <option>Moderate</option>
                          <option>Low</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Challenges & Reform Priorities */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Challenges & Reform Priorities</h2>

                {renderField('challenges', 'topChallenges', 'Select Top Challenges facing the sector', 'multiselect', [
                  'Declining Artisan Income', 'Youth Leaving Crafts', 'Counterfeit Products', 'Weak Market Access', 'Limited Exports', 'Tourism Dependency', 'Climate Change', 'Weak Coordination', 'Poor Infrastructure', 'Lack of Research', 'Weak Branding', 'Finance', 'Digital Divide', 'Raw Material Shortages', 'Policy Fragmentation', 'Other'
                ])}
                
                {renderField('challenges', 'urgentReform', 'What is the most urgent institutional or legislative reform needed?', 'textarea')}

                <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mt-4">
                  <h3 className="font-bold text-gray-900 mb-4">Five Highest Priorities (Rank 1 to 5)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={num}>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Priority {num}</label>
                        <input type="text" className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none" placeholder={`Enter priority ${num}`} onChange={e => handleChange('challenges', `rank_${num}`, e.target.value)} value={consultationData.challenges?.[`rank_${num}`] || ""} />
                      </div>
                    ))}
                  </div>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Future Vision */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Future Vision</h2>

                {renderField('vision', 'vision2030', 'What is the party\'s vision for Kashmir Crafts in 2030, 2035, and 2040?', 'textarea')}
                
                {renderField('vision', 'institutions', 'Should Kashmir have:', 'multiselect', [
                  'Dedicated Craft Policy', 'National Mission', 'Innovation Mission', 'Research Institute', 'Digital Registry', 'Craft University', 'International Promotion Program', 'Annual State of Crafts Report', 'Craft Observatory', 'Other'
                ])}
                
                {renderField('vision', 'participate', 'The party is interested in participating in:', 'multiselect', [
                  'Annual Policy Dialogue', 'Expert Panels', 'Public Hearings', 'Research Partnerships', 'Advisory Council', 'Legislative Roundtables', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'gov', 'Recommendations for Government & Administration', 'textarea')}
                {renderField('recommendations', 'industry', 'Recommendations for Industry, Artisans & Cooperatives', 'textarea')}
                {renderField('recommendations', 'other', 'Recommendations for Universities, NGOs & Media', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence Upload</h3>
                  <p className="text-sm text-gray-600 mb-4">Upload public policy documents to support your consultation. Examples: Manifesto Sections, Legislative Proposals, Policy Notes, Position Papers, Research Reports, Speeches, White Papers.</p>
                  
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
                              <option>Manifesto Section</option>
                              <option>Legislative Proposal</option>
                              <option>Policy Note / Position Paper</option>
                              <option>Research Report</option>
                              <option>Speech / Press Release</option>
                              <option>Other</option>
                            </select>
                            <select className="text-xs p-2 border border-gray-300 rounded w-full" defaultValue="">
                              <option value="" disabled>Select Publication Status...</option>
                              <option>Public / Published Document</option>
                              <option>Internal Policy Draft</option>
                            </select>
                            <select className="text-xs p-2 border border-gray-300 rounded w-full md:col-span-2" defaultValue="">
                              <option value="" disabled>Select Confidentiality...</option>
                              <option>Publicly available</option>
                              <option>Confidential - For KHCRF policy analysis only</option>
                              <option>Contact Party Representative before publication</option>
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
                  <p className="text-gray-600 text-lg">Your policy consultation response is ready. Please review the details before submitting.</p>
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
                      <span className={isPrioritiesValid ? "text-green-600" : "text-gray-400"}>Priorities</span>
                      <span className={isGovValid ? "text-green-600" : "text-gray-400"}>Governance</span>
                      <span className={isEcoValid ? "text-green-600" : "text-gray-400"}>Economic/Social</span>
                      <span className={isInnovValid ? "text-green-600" : "text-gray-400"}>Innovation</span>
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
                          participantType: "Political",
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
