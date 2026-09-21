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
  return `SKC-2026-GOV-${result}`;
};

export default function GovernmentPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_gov_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_gov_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_gov_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_gov_consultationData', JSON.stringify(consultationData));
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
  const isProfileValid = consultationData.profile?.departmentName && consultationData.profile?.type;
  const isPolicyValid = consultationData.policy?.responsibilities;
  const isCoordValid = consultationData.coordination?.collaborates;
  const isDataValid = consultationData.data?.maintains;
  const isDigitalValid = consultationData.digital?.initiatives;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isVisionValid = consultationData.vision?.vision2030;
  const isRecommendationsValid = consultationData.recommendations?.govPriorities;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isPolicyValid, isCoordValid, isDataValid, isDigitalValid, isChallengesValid, isVisionValid, isRecommendationsValid];
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
                   Government Department
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
                      <p>It seeks to map institutional mandates, understand policy implementation challenges, and identify future administrative priorities. This is not a departmental performance evaluation, compliance audit, or vigilance inquiry.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'role', 'Respondent Role', 'select', [
                  'Secretary', 'Commissioner', 'Director', 'Joint Director', 'Deputy Director', 'Chief Executive Officer', 'Project Officer', 'District Officer', 'Planning Officer', 'Technical Officer', 'Research Officer', 'Authorized Representative', 'Other'
                ])}
                
                {renderField('consent', 'authority', 'Submission Status', 'radio', [
                  'Official Department Response',
                  'Directorate Response',
                  'Division Response',
                  'District Office Response',
                  'Personal Professional Perspective'
                ])}
                
                {renderField('consent', 'identity', 'Submission confidentiality preference', 'radio', [
                  'Department may be publicly identified in reports',
                  'Department name must remain confidential, but inputs can be used',
                  'Submission may be used only in anonymized, aggregate policy analysis'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact the department regarding policy roundtables or future research networks?', 'radio', ['Yes', 'No'])}

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
                    <span className="text-sm font-bold text-gray-700">I confirm the level of institutional authority under which I am submitting.</span>
                  </label>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 2: Department Profile */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Department Profile</h2>
                
                {renderField('profile', 'departmentName', 'Department Name', 'text')}
                
                {renderField('profile', 'government', 'Government Level', 'select', [
                  'Union', 'UT', 'State', 'Local Government', 'Autonomous Body', 'Public Authority'
                ])}

                {renderField('profile', 'type', 'Department Type', 'select', [
                  'Handicrafts', 'Industries', 'Tourism', 'Rural Development', 'Planning', 'Finance', 'Culture', 'Environment', 'Forest', 'Education', 'Higher Education', 'Skill Development', 'MSME', 'Labour', 'Commerce', 'Women & Child Development', 'Youth Services', 'Agriculture', 'Horticulture', 'Heritage', 'Other'
                ])}
                
                {renderField('profile', 'jurisdiction', 'Jurisdiction', 'radio', [
                  'National', 'UT', 'Division', 'District', 'Block', 'Local'
                ])}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {renderField('profile', 'yearsWorking', 'Years Working in/with Handicrafts Ecosystem', 'select', [
                    '0-2 years', '3-5 years', '6-10 years', '10+ years', 'Not directly involved'
                  ])}
                  {renderField('profile', 'website', 'Official Website', 'text')}
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Policies, Programs & Responsibilities */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Policies, Programs & Responsibilities</h2>

                {renderField('policy', 'responsibilities', 'Areas of Responsibility (Select all that apply)', 'multiselect', [
                  'Artisan Welfare', 'Skill Development', 'Heritage Conservation', 'Marketing', 'Exports', 'Tourism', 'Environment', 'Infrastructure', 'Design', 'Education', 'Research', 'Digital Services', 'Finance', 'Women Empowerment', 'Youth Development', 'Cooperatives', 'Climate Adaptation', 'Other'
                ])}

                <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-4">
                  <h3 className="font-bold text-gray-900 mb-4">Current Programs</h3>
                  {renderField('policy', 'programDetails', 'List major current programs related to crafts, including Status (Active/Pilot/Planned), Target Beneficiaries, and Objectives.', 'textarea')}
                </div>
                
                {renderField('policy', 'instruments', 'Policy Instruments Managed', 'multiselect', [
                  'Acts', 'Rules', 'Schemes', 'Guidelines', 'Mission', 'Policy', 'Master Plans', 'Standards', 'Other'
                ])}
                
                {renderField('policy', 'evaluation', 'Program Evaluation: How is success measured?', 'multiselect', [
                  'KPIs', 'Field Monitoring', 'Audits', 'Independent Evaluation', 'Beneficiary Feedback', 'GIS', 'Digital Dashboards', 'Other'
                ])}

                {/* Conditional Branches */}
                {consultationData.profile?.type === 'Handicrafts' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Artisan, Production & Marketing</h3>
                    {renderField('policy', 'handicraftModule', 'Describe the specific marketing support, GI registration efforts, and production incentives currently deployed.', 'textarea')}
                  </div>
                )}
                
                {consultationData.profile?.jurisdiction === 'District' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">District Implementation Focus</h3>
                    {renderField('policy', 'districtImplementation', 'Describe the operational challenges of implementing UT/State-level schemes at the district level.', 'textarea')}
                  </div>
                )}

                {consultationData.profile?.jurisdiction === 'Division' || consultationData.profile?.authority === 'Directorate Response' ? (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Statewide Program Management</h3>
                    {renderField('policy', 'directorateFocus', 'Describe the mechanisms used for statewide monitoring and cross-district resource allocation.', 'textarea')}
                  </div>
                ) : null}

                {consultationData.profile?.yearsWorking === 'Not directly involved' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Future Engagement Potential</h3>
                    {renderField('policy', 'futureEngagement', 'How could your department potentially support the crafts ecosystem in the future, even if indirectly?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Coordination & Stakeholder Engagement */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Coordination & Stakeholder Engagement</h2>

                {renderField('coordination', 'collaborates', 'Department collaborates with:', 'multiselect', [
                  'Artisans', 'Manufacturers', 'Cooperatives', 'Universities', 'NGOs', 'Industry Associations', 'Exporters', 'Retailers', 'Online Platforms', 'Tourism Sector', 'Financial Institutions', 'Other Departments', 'International Organizations', 'Other'
                ])}
                
                {renderField('coordination', 'frequency', 'Engagement Frequency', 'select', [
                  'Regular', 'Occasional', 'Project Based', 'Rare', 'None'
                ])}

                {renderField('coordination', 'mechanisms', 'Engagement Mechanisms', 'multiselect', [
                  'Consultations', 'Public Hearings', 'Committees', 'Workshops', 'Advisory Groups', 'Field Visits', 'Digital Platforms', 'Citizen Feedback', 'Other'
                ])}
                
                {renderField('coordination', 'interdepartmental', 'How effective is interdepartmental coordination?', 'radio', [
                  'Excellent', 'Good', 'Moderate', 'Limited', 'Poor'
                ])}
                
                {renderField('coordination', 'interdeptNotes', 'Elaborate on interdepartmental coordination challenges or successes', 'textarea')}

                {/* Conditional Branches */}
                {consultationData.profile?.type === 'Planning' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Policy Coordination</h3>
                    {renderField('coordination', 'planningCoordination', 'How does the Planning Department integrate handicraft development with broader economic and infrastructural master plans?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Data, Monitoring & Institutional Capacity */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Data, Monitoring & Institutional Capacity</h2>

                {renderField('data', 'maintains', 'Department maintains data on:', 'multiselect', [
                  'Artisans', 'Enterprises', 'Cooperatives', 'Production', 'Employment', 'Exports', 'Tourism', 'Training', 'Heritage', 'GI', 'Environment', 'Women', 'Youth', 'Other'
                ])}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('data', 'format', 'Primary Data Format', 'select', ['Digital', 'Paper', 'Mixed'])}
                  {renderField('data', 'frequency', 'Update Frequency', 'select', ['Monthly', 'Quarterly', 'Annual', 'Ad Hoc'])}
                </div>

                {renderField('data', 'tools', 'Monitoring Tools Used', 'multiselect', [
                  'MIS', 'GIS', 'Dashboards', 'Mobile Apps', 'Field Surveys', 'Third Party', 'AI', 'Other'
                ])}

                <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mt-6">
                  <h3 className="font-bold text-gray-900 mb-4">Rate Institutional Capacity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Staff', 'Funding', 'Training', 'Technology', 'Research', 'Coordination', 'Legal Authority', 'Infrastructure'].map((cap) => (
                      <div key={cap}>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">{cap}</label>
                        <select className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none" onChange={e => handleChange('data', `cap_${cap}`, e.target.value)} value={consultationData.data?.[`cap_${cap}`] || ""}>
                          <option value="" disabled>Select Rating</option>
                          <option>Strong</option>
                          <option>Adequate</option>
                          <option>Limited</option>
                          <option>Critical Gap</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Digital Transformation & Sustainability */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Digital Transformation & Sustainability</h2>

                {renderField('digital', 'initiatives', 'Digital Initiatives', 'multiselect', [
                  'Online Services', 'Digital Registry', 'GIS', 'AI', 'Mobile Apps', 'Open Data', 'Digital Archives', 'Digital Payments', 'QR', 'Other'
                ])}
                
                {renderField('digital', 'ai', 'AI Usage in Department', 'multiselect', [
                  'Planning', 'Monitoring', 'Translation', 'Analytics', 'Prediction', 'Decision Support', 'Citizen Services', 'Not Using AI'
                ])}

                {renderField('digital', 'sustainability', 'Sustainability Initiatives', 'multiselect', [
                  'Climate', 'Waste', 'Water', 'Energy', 'Circular Economy', 'Green Procurement', 'Eco Tourism', 'Natural Materials', 'Biodiversity', 'Other'
                ])}
                
                {renderField('digital', 'disaster', 'Disaster Preparedness', 'multiselect', [
                  'Response Plan', 'Recovery Plan', 'Climate Strategy', 'Risk Assessment', 'None'
                ])}

                {/* Conditional Branches */}
                {consultationData.profile?.type === 'Environment' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Biodiversity & Climate Resilience</h3>
                    {renderField('digital', 'envModule', 'Detail current policies regarding the sustainable harvesting of raw materials (wood, willow, wool) and climate adaptation strategies for craft clusters.', 'textarea')}
                  </div>
                )}
                
                {consultationData.profile?.type === 'Tourism' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Visitor Economy</h3>
                    {renderField('digital', 'tourismModule', 'Detail initiatives linking heritage craft circuits, eco-tourism, and experiential visitor activities.', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Challenges & Policy Gaps */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Challenges & Policy Gaps</h2>

                {renderField('challenges', 'topChallenges', 'Top Five Implementation Challenges', 'multiselect', [
                  'Funding', 'Staff', 'Technology', 'Policy', 'Coordination', 'Legal Issues', 'Public Awareness', 'Research', 'Climate', 'Data', 'Infrastructure', 'Market Access', 'Skill Gaps', 'Monitoring', 'Other'
                ])}
                
                {renderField('challenges', 'gaps', 'Major Policy Gaps', 'textarea')}
                
                {renderField('challenges', 'reform', 'Areas Needing Reform', 'multiselect', [
                  'Marketing', 'Education', 'Finance', 'Exports', 'Research', 'Environment', 'Digital', 'Governance', 'Tourism', 'Innovation', 'Other'
                ])}

                {/* Conditional Branches */}
                {consultationData.profile?.type === 'Finance' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Funding Mechanisms</h3>
                    {renderField('challenges', 'financeModule', 'What are the biggest financial bottlenecks preventing effective policy execution and institutional credit access for artisans?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Future Vision */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Future Vision</h2>

                {renderField('vision', 'vision2030', 'What is the Department\'s vision for the Kashmir Crafts ecosystem by 2030, 2035, and 2040?', 'textarea')}
                
                {renderField('vision', 'priorities', 'Future Priorities', 'multiselect', [
                  'Infrastructure', 'Digital Transformation', 'Research', 'AI', 'Tourism', 'Climate', 'Exports', 'Skill Development', 'Heritage', 'International Collaboration', 'Other'
                ])}
                
                {renderField('vision', 'participateIn', 'Would the Department participate in:', 'multiselect', [
                  'Annual Policy Forum', 'Joint Research', 'Shared Data Platform', 'Cross Department Working Group', 'National Knowledge Network', 'International Collaboration', 'Advisory Council', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'govPriorities', 'Top Government Priorities (Select Five)', 'multiselect', [
                  'Craft Policy', 'Digital Registry', 'Market Intelligence', 'Research', 'Education', 'Innovation', 'Climate', 'Heritage', 'Exports', 'Finance', 'Tourism', 'Infrastructure', 'Other'
                ])}
                
                {renderField('recommendations', 'generalRecs', 'Institutional Recommendations for Government, Universities, Industry, Civil Society, and International Organizations', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence Upload</h3>
                  <p className="text-sm text-gray-600 mb-4">Upload official reports and documentation. Examples: Policies, Guidelines, Schemes, Annual Reports, Strategic Plans, Budgets, Monitoring Reports, Datasets, Maps.</p>
                  
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
                              <option>Policy / Guideline / Scheme</option>
                              <option>Annual Report / Strategic Plan</option>
                              <option>Evaluation / Monitoring Report</option>
                              <option>Dataset / Statistics</option>
                              <option>Budget Summary</option>
                              <option>Other</option>
                            </select>
                            <select className="text-xs p-2 border border-gray-300 rounded w-full" defaultValue="">
                              <option value="" disabled>Select Publication Status...</option>
                              <option>Public / Gazetted Document</option>
                              <option>Internal Departmental Working Document</option>
                            </select>
                            <select className="text-xs p-2 border border-gray-300 rounded w-full md:col-span-2" defaultValue="">
                              <option value="" disabled>Select Confidentiality...</option>
                              <option>Publicly available</option>
                              <option>Confidential - For KHCRF policy analysis only</option>
                              <option>Contact Department before publication</option>
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
                  <p className="text-gray-600 text-lg">Your departmental consultation response is ready. Please review the details before submitting.</p>
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
                      <span className={isPolicyValid ? "text-green-600" : "text-gray-400"}>Policies</span>
                      <span className={isCoordValid ? "text-green-600" : "text-gray-400"}>Coordination</span>
                      <span className={isDataValid ? "text-green-600" : "text-gray-400"}>Data/Monitoring</span>
                      <span className={isDigitalValid ? "text-green-600" : "text-gray-400"}>Digital/Climate</span>
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
                          participantType: "Government",
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
