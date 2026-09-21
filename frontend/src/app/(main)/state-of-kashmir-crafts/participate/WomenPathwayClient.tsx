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
  return `SKC-2026-WEN-${result}`;
};

export default function WomenPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_wen_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_wen_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_wen_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_wen_consultationData', JSON.stringify(consultationData));
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

  const isConsentValid = consultationData.consent?.respondentType && consultationData.consent?.submissionType;
  const isProfileValid = consultationData.profile?.country && consultationData.profile?.relationship;
  const isBusinessValid = consultationData.consent?.respondentType === 'Aspiring Entrepreneur' || consultationData.business?.stage;
  const isMarketsValid = consultationData.consent?.respondentType === 'Aspiring Entrepreneur' || consultationData.markets?.salesChannels;
  const isFinanceValid = consultationData.finance?.supportNeeded;
  const isTechValid = consultationData.tech?.used;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isVisionValid = consultationData.vision?.businessGoals;
  const isRecommendationsValid = consultationData.recommendations?.gov;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isBusinessValid, isMarketsValid, isFinanceValid, isTechValid, isChallengesValid, isVisionValid, isRecommendationsValid];
  const stepsCompleted = sectionsStatus.filter(Boolean).length;
  const progressPercent = Math.min(100, Math.floor((stepsCompleted / 9) * 100));

  const isAspiring = consultationData.consent?.respondentType === 'Aspiring Entrepreneur';

  return (
    <div className="animate-fade-in">
       {step < 11 && (
         <div className="bg-brand-dark pt-32 pb-16 relative overflow-hidden">
           
           <div className="container mx-auto px-4 relative z-10 text-center">
             <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-brand-secondary uppercase border border-brand-secondary/30 rounded-[12px]">
               WOMEN-LED ENTERPRISE CONSULTATION
             </span>
             <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Participation Portal</h1>
             
             <div className="max-w-4xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
               <div className="flex items-center gap-4 text-left mb-4 md:mb-0">
                 <div className="bg-brand-primary/20 text-brand-secondary px-3 py-1 rounded-[10px] text-xs font-black uppercase tracking-wider border border-brand-secondary/30">
                   Women Entrepreneur
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
                  <h2 className="text-3xl font-black text-brand-dark mb-4">Step 1: Consent</h2>
                  <div className="bg-blue-50 text-blue-900 p-5 rounded-2xl border border-blue-100 flex gap-4 text-sm font-medium leading-relaxed">
                    <FaInfoCircle className="text-blue-500 text-xl shrink-0 mt-0.5" />
                    <div>
                      <p className="mb-2">This consultation forms part of the State of Kashmir Crafts Assessment 2026–2027 initiative led by the Hamadan Craft Revival Foundation.</p>
                      <p>It is designed to map the realities, barriers, and aspirations of women running enterprises in the crafts ecosystem. This is not a loan application or a business competition.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'respondentType', 'Respondent Type', 'select', [
                  'Business Owner', 'Co-owner', 'Startup Founder', 'Home-based Entrepreneur', 'Artisan Entrepreneur', 'Manufacturer', 'Retailer', 'Online Seller', 'Cooperative Leader', 'SHG Leader', 'Social Entrepreneur', 'Freelancer', 'Aspiring Entrepreneur', 'Other'
                ])}
                
                {renderField('consent', 'submissionType', 'Submission Type', 'radio', [
                  'Personal Business Perspective',
                  'Organizational Perspective'
                ])}
                
                {renderField('consent', 'identity', 'Submission confidentiality preference', 'radio', [
                  'Business may be publicly identified in policy reports',
                  'Business name must remain confidential, but inputs can be used',
                  'Submission may be used only in anonymized, aggregate analysis'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact you regarding future women\'s business networks or policy roundtables?', 'radio', ['Yes', 'No'])}

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
                    <span className="text-sm font-bold text-gray-700">I understand the policy mapping and economic empowerment purpose of this instrument.</span>
                  </label>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 2: Entrepreneur Profile */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Entrepreneur Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {renderField('profile', 'country', 'Country', 'text')}
                  {renderField('profile', 'state', 'State / Province', 'text')}
                  {renderField('profile', 'district', 'District (Optional)', 'text')}
                </div>
                
                {renderField('profile', 'relationship', 'Relationship with Kashmir', 'select', [
                  'Resident', 'Originally from Kashmir', 'Diaspora', 'Outside Kashmir', 'Other'
                ])}
                
                {renderField('profile', 'ageGroup', 'Age Group', 'radio', [
                  'Under 25', '25–34', '35–44', '45–54', '55+'
                ])}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {renderField('profile', 'education', 'Education (Optional)', 'text')}
                  {renderField('profile', 'occupation', 'Occupation', 'text')}
                </div>

                {!isAspiring && renderField('profile', 'yearsInBusiness', 'Years in Business', 'select', [
                  '0-2 years (Startup)', '3-5 years', '6-10 years', '10-20 years', '20+ years'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Business Profile */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Business Profile</h2>

                {isAspiring ? (
                  <div className="bg-blue-50 text-blue-900 p-5 rounded-2xl border border-blue-100 mb-4 text-sm font-medium">
                    <p>As an Aspiring Entrepreneur, this section focuses on your business aspirations rather than current operations.</p>
                  </div>
                ) : (
                  <>
                    {renderField('business', 'stage', 'Business Stage', 'select', [
                      'Idea Stage', 'Startup', 'Early Growth', 'Established', 'Scaling', 'Mature', 'Seasonal', 'Part-time'
                    ])}
                    
                    {renderField('business', 'type', 'Business Type', 'select', [
                      'Sole Proprietorship', 'Partnership', 'Cooperative', 'SHG', 'Producer Group', 'Company', 'Home-based', 'Informal Business', 'Other'
                    ])}
                    
                    {renderField('business', 'products', 'Products', 'multiselect', [
                      'Pashmina', 'Carpets', 'Shawls', 'Papier Mâché', 'Walnut Wood', 'Copperware', 'Crewel', 'Chain Stitch', 'Fashion', 'Jewellery', 'Home Decor', 'Gifts', 'Other'
                    ])}
                    
                    {renderField('business', 'activities', 'Business Activities', 'multiselect', [
                      'Manufacturing', 'Retail', 'Export', 'Online Sales', 'Wholesale', 'Tourism', 'Training', 'Design', 'Consulting', 'Education', 'Other'
                    ])}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
                      {renderField('business', 'employees', 'Total Employees', 'select', ['0 (Solo)', '1-5', '6-20', '21-50', '50+'])}
                      {renderField('business', 'womenEmployees', 'Women Employees', 'select', ['0', '1-5', '6-20', '21-50', '50+'])}
                    </div>

                    {/* Conditional Branching for Business Profile */}
                    {consultationData.business?.type === 'Home-based' && (
                      <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                        <h3 className="font-bold text-brand-dark mb-4">Home-based Enterprise</h3>
                        {renderField('business', 'homeFocus', 'Describe the challenges and benefits of integrating your business with your household responsibilities.', 'textarea')}
                      </div>
                    )}
                    
                    {(consultationData.business?.type === 'Cooperative' || consultationData.business?.type === 'SHG' || consultationData.consent?.respondentType === 'Cooperative Leader' || consultationData.consent?.respondentType === 'SHG Leader') && (
                      <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                        <h3 className="font-bold text-brand-dark mb-4">Collective Leadership & Governance</h3>
                        {renderField('business', 'collectiveFocus', 'How does collective ownership impact decision-making, income distribution, and women\'s empowerment in your group?', 'textarea')}
                      </div>
                    )}
                  </>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Markets & Customers */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Markets & Customers</h2>

                {isAspiring ? (
                  <>
                     {renderField('markets', 'targetMarkets', 'Where do you plan to sell? (Target Markets)', 'multiselect', [
                      'Local', 'Kashmir', 'India', 'International', 'Online', 'Tourism', 'Exhibitions', 'Wholesale', 'Corporate', 'Other'
                    ])}
                  </>
                ) : (
                  <>
                    {renderField('markets', 'sellLocation', 'Where do you sell?', 'multiselect', [
                      'Local', 'Kashmir', 'India', 'International', 'Online', 'Tourism', 'Exhibitions', 'Wholesale', 'Corporate', 'Other'
                    ])}
                    
                    {renderField('markets', 'salesChannels', 'Sales Channels', 'multiselect', [
                      'Own Store', 'Marketplace', 'Instagram', 'Facebook', 'WhatsApp', 'Website', 'Amazon', 'Etsy', 'Other'
                    ])}
                    
                    {renderField('markets', 'customerTypes', 'Customer Types', 'multiselect', [
                      'Residents', 'Tourists', 'Collectors', 'Businesses', 'Hotels', 'Interior Designers', 'Government', 'Other'
                    ])}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {renderField('markets', 'growth', 'Business Growth Trend', 'select', [
                        'Sales increasing', 'Stable', 'Declining', 'Seasonal'
                      ])}
                      {renderField('markets', 'exportInterest', 'Export Interest', 'select', [
                        'Yes', 'Planning', 'No'
                      ])}
                    </div>

                    {/* Conditional Branching */}
                    {(consultationData.markets?.exportInterest === 'Yes' || consultationData.business?.activities?.includes('Export')) && (
                      <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                        <h3 className="font-bold text-brand-dark mb-4">Export Readiness</h3>
                        {renderField('markets', 'exportFocus', 'What are the main barriers you face in international shipping, payments, and global marketing?', 'textarea')}
                      </div>
                    )}
                  </>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Finance & Business Growth */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Finance & Business Growth</h2>

                {!isAspiring && (
                  <>
                    {renderField('finance', 'source', 'Current Business Finance Sources', 'multiselect', [
                      'Own Savings', 'Family', 'Bank', 'Government', 'Microfinance', 'Investor', 'CSR', 'Other'
                    ])}
                  </>
                )}
                
                {renderField('finance', 'challenges', 'Finance Challenges', 'multiselect', [
                  'Working Capital', 'Collateral', 'Documentation', 'Interest Rates', 'Financial Literacy', 'Cash Flow', 'Insurance', 'Other'
                ])}
                
                {renderField('finance', 'supportNeeded', 'Business Support Needed', 'multiselect', [
                  'Loans', 'Training', 'Mentorship', 'Marketing', 'Export Support', 'Digital Skills', 'Technology', 'Legal', 'Branding', 'Packaging', 'Other'
                ])}

                {/* Conditional Branching */}
                {(consultationData.business?.stage === 'Startup' || consultationData.consent?.respondentType === 'Startup Founder') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Startup Ecosystem</h3>
                    {renderField('finance', 'startupFocus', 'Describe your experience securing seed funding or accessing incubation support in Kashmir.', 'textarea')}
                  </div>
                )}
                
                {(consultationData.business?.stage === 'Established' || consultationData.business?.stage === 'Scaling') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Scaling & Hiring</h3>
                    {renderField('finance', 'scalingFocus', 'What limits your ability to scale operations and hire more employees?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Technology, Innovation & Sustainability */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Technology, Innovation & Sustainability</h2>

                {renderField('tech', 'used', 'Technology Used', 'multiselect', [
                  'Website', 'Social Media', 'AI', 'Digital Payments', 'QR Codes', 'Inventory Software', 'Accounting Software', 'CRM', 'Other'
                ])}
                
                {renderField('tech', 'aiUsage', 'AI Usage', 'multiselect', [
                  'Marketing', 'Design', 'Photography', 'Content Creation', 'Translation', 'Customer Support', 'Inventory', 'None'
                ])}
                
                {renderField('tech', 'innovation', 'Innovation Areas in your business', 'multiselect', [
                  'Product Design', 'Packaging', 'Business Model', 'Marketing', 'Tourism', 'Technology', 'Other'
                ])}
                
                {renderField('tech', 'sustainability', 'Sustainability Practices', 'multiselect', [
                  'Natural Materials', 'Waste Reduction', 'Circular Economy', 'Eco Packaging', 'Energy', 'Climate Adaptation', 'Fair Production', 'Other'
                ])}

                {/* Conditional Branches */}
                {consultationData.consent?.respondentType === 'Online Seller' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Digital Commerce</h3>
                    {renderField('tech', 'ecommerceFocus', 'How do platform fees, logistics, and digital marketing costs impact your profit margins?', 'textarea')}
                  </div>
                )}
                
                {consultationData.consent?.respondentType === 'Manufacturer' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Production & Workforce</h3>
                    {renderField('tech', 'manufacturingFocus', 'What innovations are you bringing to traditional manufacturing processes to improve efficiency or working conditions?', 'textarea')}
                  </div>
                )}
                
                {consultationData.tech?.used?.includes('AI') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">AI Adoption</h3>
                    {renderField('tech', 'aiFocus', 'How has AI transformed your business operations or creative process?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Challenges & Support Needs */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Challenges & Support Needs</h2>

                {renderField('challenges', 'topChallenges', 'Top Challenges', 'multiselect', [
                  'Access to Finance', 'Market Access', 'Family Responsibilities', 'Mobility', 'Digital Skills', 'Technology', 'Competition', 'Counterfeit', 'Raw Materials', 'Business Networks', 'Exports', 'Legal Compliance', 'Marketing', 'Other'
                ])}
                
                {renderField('challenges', 'leadership', 'Leadership Challenges', 'multiselect', [
                  'Confidence', 'Networking', 'Decision-making', 'Negotiation', 'Public Speaking', 'Investment Access', 'Policy Awareness', 'Other'
                ])}
                
                {renderField('challenges', 'networks', 'Support Networks', 'multiselect', [
                  'Family', 'Friends', 'Women\'s Groups', 'Government', 'NGOs', 'Business Associations', 'Mentors', 'None'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Future Vision */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Future Vision</h2>

                {renderField('vision', 'businessGoals', 'Business Goals (2030-2040)', 'textarea')}
                
                {renderField('vision', 'interestedIn', 'Interested In:', 'multiselect', [
                  'Export', 'Scaling', 'Hiring', 'Innovation', 'AI', 'Tourism', 'Training Others', 'Mentorship', 'Digital Commerce', 'International Markets', 'Other'
                ])}
                
                {renderField('vision', 'participateIn', 'Would you participate in:', 'multiselect', [
                  'Women\'s Business Network', 'Mentorship Program', 'Leadership Academy', 'Trade Missions', 'Innovation Lab', 'Export Accelerator', 'Business Incubator', 'Annual Women Entrepreneurs Forum', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'gov', 'Recommendations for Government & Banks', 'textarea')}
                {renderField('recommendations', 'industry', 'Recommendations for Industry & Export Agencies', 'textarea')}
                {renderField('recommendations', 'womenNetworks', 'Recommendations for NGOs, Universities & Women\'s Networks', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence Upload</h3>
                  <p className="text-sm text-gray-600 mb-4">Women entrepreneurs may upload Business Profiles, Product Catalogues, Business Plans, Marketing Material, Product Photos, Packaging Designs, Success Stories, Innovation Concepts, Certificates, Awards, or Videos.</p>
                  
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
                              <option>Business Profile / Pitch Deck</option>
                              <option>Product Catalogue / Photos</option>
                              <option>Marketing / Packaging Material</option>
                              <option>Certificate / Award</option>
                              <option>Success Story / Case Study</option>
                              <option>Video / Interview</option>
                              <option>Other</option>
                            </select>
                            <input type="text" placeholder="Year / Description" className="text-xs p-2 border border-gray-300 rounded w-full" />
                            <select className="text-xs p-2 border border-gray-300 rounded w-full md:col-span-2" defaultValue="">
                              <option value="" disabled>Select Permissions...</option>
                              <option>Publicly available for promotion</option>
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
                  <p className="text-gray-600 text-lg">Your business consultation response is ready. Please review the details before submitting.</p>
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
                      <span className={isBusinessValid ? "text-green-600" : "text-gray-400"}>Business</span>
                      <span className={isMarketsValid ? "text-green-600" : "text-gray-400"}>Markets</span>
                      <span className={isFinanceValid ? "text-green-600" : "text-gray-400"}>Finance</span>
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
                          participantType: "Women",
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
