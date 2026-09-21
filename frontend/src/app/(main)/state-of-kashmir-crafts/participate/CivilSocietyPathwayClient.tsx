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
  return `SKC-2026-CSO-${result}`;
};

export default function CivilSocietyPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_cso_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_cso_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_cso_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_cso_consultationData', JSON.stringify(consultationData));
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
  const isProgramsValid = consultationData.programs?.beneficiaries;
  const isPartnershipsValid = consultationData.partnerships?.collaboratesWith;
  const isCapacityValid = consultationData.capacity?.strengths;
  const isTechValid = consultationData.tech?.digitalTools;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isVisionValid = consultationData.vision?.vision2030;
  const isRecommendationsValid = consultationData.recommendations?.gov;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isProgramsValid, isPartnershipsValid, isCapacityValid, isTechValid, isChallengesValid, isVisionValid, isRecommendationsValid];
  const stepsCompleted = sectionsStatus.filter(Boolean).length;
  const progressPercent = Math.min(100, Math.floor((stepsCompleted / 9) * 100));

  return (
    <div className="animate-fade-in">
       {step < 11 && (
         <div className="bg-brand-dark pt-32 pb-16 relative overflow-hidden">
           
           <div className="container mx-auto px-4 relative z-10 text-center">
             <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-brand-secondary uppercase border border-brand-secondary/30 rounded-[12px]">
               CIVIL SOCIETY & NGO CONSULTATION
             </span>
             <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Participation Portal</h1>
             
             <div className="max-w-4xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
               <div className="flex items-center gap-4 text-left mb-4 md:mb-0">
                 <div className="bg-brand-primary/20 text-brand-secondary px-3 py-1 rounded-[10px] text-xs font-black uppercase tracking-wider border border-brand-secondary/30">
                   Civil Society Organization
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
                      <p>It is designed to map civil society participation, capacity, and partnerships in the handicrafts ecosystem. This is an institutional consultation, not a grant application or a compliance audit.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'respondentRole', 'Respondent Role', 'select', [
                  'Founder', 'Chairperson', 'President', 'Secretary', 'Executive Director', 'Program Director', 'Project Coordinator', 'Research Lead', 'Volunteer Coordinator', 'Board Member', 'Authorized Representative', 'Other'
                ])}
                
                {renderField('consent', 'submissionType', 'Submission Type', 'radio', [
                  'Official Organizational Response',
                  'Program Team Response',
                  'Regional Office Response',
                  'Personal Professional Perspective'
                ])}
                
                {renderField('consent', 'identity', 'Submission confidentiality preference', 'radio', [
                  'Organization may be publicly identified in policy reports',
                  'Organization name must remain confidential, but inputs can be used',
                  'Submission may be used only in anonymized, aggregate analysis'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact you regarding future civil society forums or policy dialogues?', 'radio', ['Yes', 'No'])}

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
                  'Society', 'Trust', 'Non-profit Company', 'Community Organization', 'Foundation', 'Social Enterprise', 'Volunteer Network', 'International NGO', 'Informal Community Group', 'Other'
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

                {renderField('profile', 'areasOfWork', 'Primary Areas of Work', 'multiselect', [
                  'Handicrafts', 'Livelihoods', 'Rural Development', 'Women Empowerment', 'Youth Development', 'Heritage', 'Environment', 'Climate', 'Education', 'Research', 'Tourism', 'Entrepreneurship', 'Digital Inclusion', 'Skill Development', 'Disability Inclusion', 'Community Health', 'Other'
                ])}

                {/* Intelligent Conditional Branching */}
                {consultationData.profile?.areasOfWork?.includes('Heritage') && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                    <p className="text-xs text-yellow-800 font-bold flex items-center gap-2"><FaInfoCircle /> Note on Heritage Organizations:</p>
                    <p className="text-xs text-yellow-700 mt-1">If your organization's primary focus is heritage preservation, museums, or historical archives, you may prefer the dedicated <b>Heritage Organization</b> pathway. However, you are welcome to continue here if it better reflects your broader civil society work.</p>
                  </div>
                )}

                {renderField('profile', 'geographicCoverage', 'Geographic Coverage', 'select', [
                  'Village', 'Block', 'District', 'Regional', 'UT', 'National', 'International'
                ])}

                <h3 className="font-bold text-gray-800 mb-4 mt-6">Approximate Organizational Size (Bands)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('profile', 'staff', 'Staff', 'select', ['0 (Volunteer only)', '1-10', '11-50', '51-200', '200+'])}
                  {renderField('profile', 'volunteers', 'Volunteers', 'select', ['0', '1-20', '21-100', '101-500', '500+'])}
                  {renderField('profile', 'beneficiaries', 'Beneficiaries (Annual)', 'select', ['< 100', '100 - 1,000', '1,000 - 10,000', '10,000+'])}
                  {renderField('profile', 'projects', 'Active Projects', 'select', ['1-3', '4-10', '11-20', '20+'])}
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Programs & Community Engagement */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Programs & Community Engagement</h2>

                {/* Conditional Logic: Not in Handicrafts directly */}
                {!consultationData.profile?.areasOfWork?.includes('Handicrafts') ? (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Cross-Sector Contribution</h3>
                    {renderField('programs', 'crossSector', 'Since your organization does not work directly in handicrafts, how could your expertise (e.g., in health, education, environment) contribute to the well-being of artisan communities?', 'textarea')}
                  </div>
                ) : (
                  <>
                    <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-4">
                      <h3 className="font-bold text-gray-800 mb-4">Current Programs in the Crafts Ecosystem</h3>
                      {renderField('programs', 'programName', 'Highlight a Key Program (Name)', 'text')}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderField('programs', 'programYear', 'Year Started', 'number')}
                        {renderField('programs', 'programStatus', 'Status', 'select', ['Active', 'Pilot', 'Completed', 'Planned'])}
                      </div>
                    </div>

                    {renderField('programs', 'activities', 'Program Activities', 'multiselect', [
                      'Skill Development', 'Documentation', 'Research', 'Community Mobilization', 'Awareness Campaigns', 'Heritage Conservation', 'Marketing Support', 'Design Support', 'Entrepreneurship', 'Digital Literacy', 'Financial Literacy', 'Policy Advocacy', 'Environmental Conservation', 'Tourism Promotion', 'Volunteer Programs', 'Other'
                    ])}
                  </>
                )}

                {renderField('programs', 'beneficiaries', 'Primary Beneficiaries', 'multiselect', [
                  'Artisans', 'Women', 'Youth', 'Cooperatives', 'Entrepreneurs', 'Students', 'Rural Communities', 'Urban Communities', 'Heritage Professionals', 'Tourists', 'Other'
                ])}
                
                {renderField('programs', 'communityParticipation', 'How do communities participate?', 'multiselect', [
                  'Planning', 'Decision-making', 'Volunteerism', 'Monitoring', 'Implementation', 'Feedback', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Partnerships & Collaboration */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Partnerships & Collaboration</h2>

                {renderField('partnerships', 'collaboratesWith', 'Organization collaborates with:', 'multiselect', [
                  'Government', 'Universities', 'Schools', 'Museums', 'Cooperatives', 'Manufacturers', 'Exporters', 'Retailers', 'Online Platforms', 'Financial Institutions', 'International Organizations', 'Media', 'Technology Companies', 'Other NGOs', 'Community Leaders', 'Other'
                ])}
                
                {renderField('partnerships', 'nature', 'Nature of Partnership', 'multiselect', [
                  'Joint Projects', 'Research', 'Funding', 'Training', 'Advcy', 'Events', 'Policy', 'Capacity Building', 'Technical Assistance', 'Other'
                ])}
                
                {renderField('partnerships', 'frequency', 'Frequency of Collaboration', 'radio', [
                  'Continuous', 'Regular', 'Occasional', 'Project Based'
                ])}

                {/* Conditional Logic */}
                {consultationData.profile?.legalStatus === 'International NGO' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">International Collaboration</h3>
                    {renderField('partnerships', 'internationalFocus', 'Describe your technical assistance programs and cross-border knowledge sharing initiatives for Kashmir\'s artisan sector.', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Organizational Capacity & Resources */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Organizational Capacity & Resources</h2>

                {consultationData.profile?.legalStatus === 'Informal Community Group' || consultationData.profile?.legalStatus === 'Volunteer Network' ? (
                  <div className="bg-blue-50 text-blue-900 p-5 rounded-2xl border border-blue-100 mb-4 text-sm font-medium">
                    <p>As a community group or volunteer network, this section focuses on your strengths and mobilization capacity rather than formal institutional metrics.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-gray-800 mb-4">Rate Organizational Capacity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {renderField('capacity', 'staffCap', 'Staff Capacity', 'select', ['Strong', 'Adequate', 'Developing', 'Needs Strengthening'])}
                      {renderField('capacity', 'finCap', 'Financial Management', 'select', ['Strong', 'Adequate', 'Developing', 'Needs Strengthening'])}
                      {renderField('capacity', 'meCap', 'Monitoring & Evaluation', 'select', ['Strong', 'Adequate', 'Developing', 'Needs Strengthening'])}
                      {renderField('capacity', 'techCap', 'Technology', 'select', ['Strong', 'Adequate', 'Developing', 'Needs Strengthening'])}
                    </div>
                  </>
                )}

                {renderField('capacity', 'strengths', 'Organizational Strengths', 'multiselect', [
                  'Community Trust', 'Technical Expertise', 'Volunteers', 'Partnerships', 'Research', 'Advocacy', 'Digital Skills', 'Innovation', 'Training', 'Other'
                ])}
                
                {renderField('capacity', 'fundingSources', 'Primary Funding Sources (No amounts required)', 'multiselect', [
                  'Donations', 'Grants', 'CSR', 'Government', 'International', 'Membership', 'Service Revenue', 'Social Enterprise', 'Crowdfunding', 'Other'
                ])}

                {/* Conditional Logic */}
                {consultationData.profile?.legalStatus === 'Social Enterprise' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Enterprise Sustainability</h3>
                    {renderField('capacity', 'earnedIncome', 'How does your social enterprise balance earned-income generation with your social impact mission?', 'textarea')}
                  </div>
                )}
                
                {consultationData.profile?.areasOfWork?.includes('Research') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Research & Evidence</h3>
                    {renderField('capacity', 'researchFocus', 'What are the main knowledge gaps your research addresses, and how do you ensure the findings reach policymakers?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Innovation, Digital Transformation & Sustainability */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Innovation, Digital Transformation & Sustainability</h2>

                {renderField('tech', 'digitalTools', 'Digital Tools Used', 'multiselect', [
                  'Website', 'Social Media', 'GIS', 'CRM', 'Mobile Apps', 'AI', 'Digital Archives', 'Cloud Collaboration', 'Online Learning', 'Volunteer Platforms', 'Other'
                ])}
                
                {renderField('tech', 'aiUsage', 'AI Usage in Operations', 'multiselect', [
                  'Research', 'Translation', 'Communications', 'Image Analysis', 'Documentation', 'Grant Writing', 'Data Analysis', 'Monitoring', 'None'
                ])}
                
                {renderField('tech', 'sustainability', 'Sustainability Activities', 'multiselect', [
                  'Climate Adaptation', 'Waste Reduction', 'Circular Economy', 'Sustainable Materials', 'Biodiversity', 'Water Conservation', 'Renewable Energy', 'Green Events', 'Environmental Education', 'Other'
                ])}

                {/* Conditional Logic */}
                {(consultationData.profile?.areasOfWork?.includes('Environment') || consultationData.profile?.areasOfWork?.includes('Climate')) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Environmental Action</h3>
                    {renderField('tech', 'environmentFocus', 'How is climate change specifically impacting artisan communities, and what adaptation strategies are you implementing?', 'textarea')}
                  </div>
                )}
                
                {consultationData.tech?.digitalTools?.includes('Volunteer Platforms') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Volunteer Management</h3>
                    {renderField('tech', 'volunteerFocus', 'How do you mobilize, train, and retain volunteers to support long-term heritage projects?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Challenges & Opportunities */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Challenges & Opportunities</h2>

                {renderField('challenges', 'topChallenges', 'Top Challenges (Select up to five)', 'multiselect', [
                  'Funding', 'Volunteers', 'Skilled Staff', 'Community Participation', 'Government Coordination', 'Research', 'Technology', 'Digital Skills', 'Policy Engagement', 'Monitoring', 'Documentation', 'Climate Change', 'Market Access', 'Other'
                ])}
                
                {renderField('challenges', 'opportunity', 'What is the biggest opportunity for civil society in Kashmir right now?', 'textarea')}
                
                {renderField('challenges', 'priorityAreas', 'Current Priority Areas', 'multiselect', [
                  'Heritage', 'Livelihoods', 'Women', 'Youth', 'Environment', 'AI', 'Tourism', 'Research', 'Innovation', 'Digital Inclusion', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Future Vision */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Future Vision</h2>

                {renderField('vision', 'vision2030', 'Vision for the sector in 2030-2040', 'textarea')}
                
                {renderField('vision', 'participateIn', 'Interested in Participating in:', 'multiselect', [
                  'State Advisory Network', 'Civil Society Forum', 'Volunteer Network', 'Research Consortium', 'Heritage Observatory', 'Community Monitoring', 'Annual Conference', 'Knowledge Platform', 'Policy Dialogue', 'International Collaboration', 'Other'
                ])}
                
                {renderField('vision', 'futurePriorities', 'Future Priorities', 'multiselect', [
                  'Expansion', 'Innovation', 'Community Leadership', 'Digital Transformation', 'Research', 'Environmental Action', 'Women', 'Youth', 'Heritage', 'Entrepreneurship', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'gov', 'Recommendations for Government', 'textarea')}
                {renderField('recommendations', 'industry', 'Recommendations for Financial Institutions, Tech & Industry', 'textarea')}
                {renderField('recommendations', 'society', 'Recommendations for Universities, Artisans, and Other NGOs', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence Upload</h3>
                  <p className="text-sm text-gray-600 mb-4">Organizations may upload Annual Reports, Strategic Plans, Project Reports, Case Studies, Research Reports, Community Surveys, Impact Assessments, Training Material, Policy Briefs, Advocacy Documents, Photographs, Videos, Maps, or Publications.</p>
                  
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
                              <option>Annual Report / Strategic Plan</option>
                              <option>Project Report / Case Study</option>
                              <option>Research / Impact Assessment</option>
                              <option>Policy Brief / Advocacy Doc</option>
                              <option>Community Survey / Map</option>
                              <option>Photograph / Video</option>
                              <option>Other</option>
                            </select>
                            <input type="text" placeholder="Title / Year" className="text-xs p-2 border border-gray-300 rounded w-full" />
                            <select className="text-xs p-2 border border-gray-300 rounded w-full md:col-span-2" defaultValue="">
                              <option value="" disabled>Select Permissions...</option>
                              <option>Publicly available for policy portal</option>
                              <option>For KHCRF internal policy analysis only</option>
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
                  <p className="text-gray-600 text-lg">Your organizational consultation response is ready. Please review the details before submitting.</p>
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
                      <span className={isProgramsValid ? "text-green-600" : "text-gray-400"}>Programs</span>
                      <span className={isPartnershipsValid ? "text-green-600" : "text-gray-400"}>Partnerships</span>
                      <span className={isCapacityValid ? "text-green-600" : "text-gray-400"}>Capacity</span>
                      <span className={isTechValid ? "text-green-600" : "text-gray-400"}>Tech/ESG</span>
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
                          participantType: "CivilSociety",
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
