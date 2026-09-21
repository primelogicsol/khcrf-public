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
  return `SKC-2026-FIN-${result}`;
};

export default function FinancialPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_fin_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_fin_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_fin_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_fin_consultationData', JSON.stringify(consultationData));
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
  const isProfileValid = consultationData.profile?.institutionName && consultationData.profile?.type;
  const isServicesValid = consultationData.services?.products;
  const isLendingValid = consultationData.lending?.sectors;
  const isInclusionValid = consultationData.inclusion?.worksWith;
  const isDigitalValid = consultationData.digital?.services;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isVisionValid = consultationData.vision?.vision2030;
  const isRecommendationsValid = consultationData.recommendations?.govPriorities;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isServicesValid, isLendingValid, isInclusionValid, isDigitalValid, isChallengesValid, isVisionValid, isRecommendationsValid];
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
                   Financial Institution
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
                      <p>It seeks to understand how the financial ecosystem supports, finances, insures, and enables the growth of Kashmir's handicrafts sector. This is not a loan application or compliance audit.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'role', 'Respondent Role', 'select', [
                  'Chairman', 'Managing Director', 'CEO', 'Executive Director', 'Regional Head', 'Branch Head', 'Credit Manager', 'MSME Head', 'CSR Head', 'Risk Officer', 'Investment Manager', 'Research Officer', 'Relationship Manager', 'Authorized Representative', 'Other'
                ])}
                
                {renderField('consent', 'authority', 'Submission Authority', 'radio', [
                  'Official Institutional Response',
                  'Regional Office Response',
                  'Branch Response',
                  'Personal Professional Perspective'
                ])}
                
                {renderField('consent', 'identity', 'Submission confidentiality preference', 'radio', [
                  'Institution may be publicly identified in ecosystem reports',
                  'Institution name must remain confidential, but inputs can be used',
                  'Submission may be used only in anonymized, aggregate policy analysis'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact the institution regarding future financial networks or policy roundtables?', 'radio', ['Yes', 'No'])}

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
                    <span className="text-sm font-bold text-gray-700">I understand the ecosystem mapping and consultation purpose of this instrument.</span>
                  </label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check2 || false} onChange={e => handleChange('consent', 'check2', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I confirm the level of authority under which I am submitting this response.</span>
                  </label>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 2: Institutional Profile */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Institutional Profile</h2>
                
                {renderField('profile', 'institutionName', 'Institution Name (Optional if submitting confidentially)', 'text')}
                
                {renderField('profile', 'type', 'Institution Type', 'select', [
                  'Commercial Bank', 'Cooperative Bank', 'Regional Rural Bank', 'Small Finance Bank', 'Development Finance Institution', 'NBFC', 'Microfinance Institution', 'Insurance Company', 'Venture Capital Fund', 'Impact Investor', 'CSR Foundation', 'Export Credit Agency', 'FinTech Company', 'Payment Company', 'Investment Fund', 'Government Financial Institution', 'International Development Institution', 'Other'
                ])}

                {renderField('profile', 'ownership', 'Ownership', 'radio', [
                  'Public', 'Private', 'Cooperative', 'International', 'Non-profit', 'Other'
                ])}
                
                {renderField('profile', 'jurisdiction', 'Jurisdiction', 'radio', [
                  'National', 'Regional', 'State', 'District', 'International'
                ])}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {renderField('profile', 'yearsOperating', 'Years Operating', 'select', [
                    '0-5 years', '6-20 years', '20-50 years', '50+ years'
                  ])}
                  {renderField('profile', 'website', 'Official Website', 'text')}
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Financial Products & Services */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Financial Products & Services</h2>

                {renderField('services', 'products', 'Which services does your institution provide?', 'multiselect', [
                  'Working Capital Loans', 'MSME Loans', 'Artisan Loans', 'Cooperative Finance', 'Export Finance', 'Equipment Finance', 'Trade Finance', 'Supply Chain Finance', 'Startup Finance', 'Women Entrepreneurship Finance', 'Youth Entrepreneurship Finance', 'Insurance', 'Digital Payments', 'Investment Products', 'Credit Guarantees', 'CSR Grants', 'Financial Literacy', 'Advisory Services', 'Other'
                ])}

                {renderField('services', 'financesCrafts', 'Does your institution currently finance the handicrafts sector?', 'radio', [
                  'Yes', 'Limited', 'Planned', 'No'
                ])}

                {consultationData.services?.financesCrafts !== 'No' && (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-gray-900 mb-4">Crafts Portfolio</h3>
                    {renderField('services', 'segments', 'Which segments?', 'multiselect', [
                      'Individual Artisans', 'Manufacturers', 'Cooperatives', 'Exporters', 'Retailers', 'Online Sellers', 'Startups', 'Women Entrepreneurs', 'Youth Entrepreneurs', 'Other'
                    ])}
                    {renderField('services', 'avgSize', 'Average financing size per entity', 'select', [
                      'Under ₹50,000', '₹50,000 - ₹5 Lakhs', '₹5 Lakhs - ₹20 Lakhs', '₹20 Lakhs - ₹1 Crore', 'Above ₹1 Crore'
                    ])}
                  </div>
                )}
                
                {/* Conditional Branching for No Portfolio */}
                {consultationData.services?.financesCrafts === 'No' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Future Interest</h3>
                    {renderField('services', 'futureConditions', 'What enabling conditions or policy changes would be required for your institution to engage with the handicrafts sector?', 'textarea')}
                  </div>
                )}

                {/* Conditional Branching based on Type */}
                {consultationData.profile?.type === 'Commercial Bank' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Commercial Lending</h3>
                    {renderField('services', 'commercialLending', 'Detail any tailored credit products designed for traditional manufacturing clusters.', 'textarea')}
                  </div>
                )}
                
                {(consultationData.profile?.type === 'Venture Capital Fund' || consultationData.profile?.type === 'Impact Investor') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Investment & Growth Financing</h3>
                    {renderField('services', 'vcFocus', 'What specific growth metrics or business models attract your investment in traditional/heritage sectors?', 'textarea')}
                  </div>
                )}
                
                {consultationData.profile?.type === 'CSR Foundation' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Grants & Social Investment</h3>
                    {renderField('services', 'csrFocus', 'What are your primary themes for CSR funding within artisanal or rural development contexts?', 'textarea')}
                  </div>
                )}
                
                {consultationData.profile?.type === 'FinTech Company' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Embedded Finance & Technology</h3>
                    {renderField('services', 'fintechFocus', 'How is your technology bridging the credit gap for unbanked informal sector workers?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Lending, Investment & Risk */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Lending, Investment & Risk</h2>

                {renderField('lending', 'sectors', 'Priority Sectors', 'multiselect', [
                  'Handicrafts', 'MSMEs', 'Tourism', 'Women Enterprises', 'Rural Development', 'Innovation', 'Green Businesses', 'Export Businesses', 'Social Enterprises', 'Heritage Economy', 'Other'
                ])}
                
                {renderField('lending', 'challenges', 'Main financing challenges in the informal / craft sector', 'multiselect', [
                  'Lack of Collateral', 'Limited Financial Records', 'Credit History', 'Market Risk', 'Climate Risk', 'Business Skills', 'Documentation', 'Small Loan Size', 'Informal Economy', 'Other'
                ])}
                
                {renderField('lending', 'riskFactors', 'Primary Risk Assessment Factors', 'multiselect', [
                  'Cash Flow', 'Credit History', 'Business Plan', 'Market Demand', 'Asset Quality', 'Supply Chain', 'Export Potential', 'ESG Factors', 'Digital Records', 'Other'
                ])}
                
                {renderField('lending', 'defaultRisk', 'Rate perceived default risk for traditional artisans / MSMEs', 'radio', [
                  'High', 'Moderate', 'Low', 'Very Low'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Financial Inclusion & Sector Engagement */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Financial Inclusion & Engagement</h2>

                {renderField('inclusion', 'worksWith', 'Institution currently works with:', 'multiselect', [
                  'Artisans', 'Cooperatives', 'Manufacturers', 'Exporters', 'Retailers', 'NGOs', 'Universities', 'Government', 'Women Groups', 'Youth Groups', 'Other'
                ])}
                
                {renderField('inclusion', 'literacy', 'Financial Literacy Programs provided', 'radio', [
                  'Yes', 'No', 'Planned'
                ])}

                {renderField('inclusion', 'support', 'Support Provided', 'multiselect', [
                  'Business Planning', 'Digital Payments', 'Bookkeeping', 'Loan Counseling', 'Insurance Awareness', 'Export Readiness', 'Entrepreneurship', 'Other'
                ])}
                
                {renderField('inclusion', 'specialProducts', 'Special Financial Products available for:', 'multiselect', [
                  'Women', 'Youth', 'Climate', 'Startups', 'Rural', 'Social Enterprise', 'Heritage', 'None'
                ])}
                
                {/* Conditional Branches */}
                {(consultationData.profile?.type === 'Cooperative Bank' || consultationData.profile?.type === 'Regional Rural Bank') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Cooperative & Artisan Finance</h3>
                    {renderField('inclusion', 'coopFinance', 'Describe your strategies for supporting cluster-based lending and collective borrowing among artisan groups.', 'textarea')}
                  </div>
                )}
                
                {consultationData.profile?.type === 'International Development Institution' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Development & Blended Finance</h3>
                    {renderField('inclusion', 'intlFinance', 'Detail any capacity-building technical assistance programs intended for heritage sectors.', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Digital Finance, Sustainability & Innovation */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Digital Finance, Sustainability & Innovation</h2>

                {renderField('digital', 'services', 'Digital Services', 'multiselect', [
                  'Mobile Banking', 'Internet Banking', 'QR Payments', 'UPI', 'POS', 'Digital Lending', 'AI Credit Assessment', 'Blockchain', 'Digital Documentation', 'Other'
                ])}
                
                {renderField('digital', 'ai', 'AI Usage in Operations', 'multiselect', [
                  'Risk Assessment', 'Fraud Detection', 'Customer Support', 'Credit Scoring', 'Portfolio Analysis', 'Forecasting', 'Not Using AI'
                ])}
                
                {renderField('digital', 'sustainability', 'Sustainability / ESG Finance', 'multiselect', [
                  'Green Finance', 'Climate Finance', 'ESG', 'Circular Economy', 'Carbon Reduction', 'Biodiversity', 'Sustainable Tourism', 'Other'
                ])}
                
                {renderField('digital', 'insurance', 'Insurance Products', 'multiselect', [
                  'Health', 'Business', 'Asset', 'Export', 'Climate', 'Crop', 'Livestock', 'Other', 'None'
                ])}

                {/* Conditional Branches */}
                {consultationData.profile?.type === 'Insurance Company' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Risk Management & Claims</h3>
                    {renderField('digital', 'insuranceModule', 'What are the main barriers to providing affordable business and asset insurance to rural artisans?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Challenges & Financing Gaps */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Challenges & Financing Gaps</h2>

                {renderField('challenges', 'topChallenges', 'Top Five Challenges', 'multiselect', [
                  'Limited Credit Demand', 'Limited Credit Supply', 'Poor Documentation', 'Lack of Collateral', 'Market Volatility', 'Digital Divide', 'Climate Risks', 'Low Financial Literacy', 'Weak Business Models', 'Limited Insurance', 'Regulatory Constraints', 'Other'
                ])}
                
                {renderField('challenges', 'gap', 'Biggest Financing Gap', 'textarea')}
                
                {renderField('challenges', 'priorities', 'Priority Areas for Ecosystem Financing', 'multiselect', [
                  'Working Capital', 'Equipment', 'Innovation', 'Digital Commerce', 'Exports', 'Tourism', 'Sustainability', 'Research', 'Skill Development', 'Women', 'Youth', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Future Vision */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Future Vision</h2>

                {renderField('vision', 'vision2030', 'Vision for Financing Kashmir Crafts (2030-2040)', 'textarea')}
                
                {renderField('vision', 'participateIn', 'Would your institution participate in:', 'multiselect', [
                  'Dedicated Craft Finance Program', 'Credit Guarantee Scheme', 'Annual Financial Forum', 'Investment Network', 'Startup Accelerator', 'Innovation Fund', 'Green Finance Initiative', 'Public-Private Partnership', 'Research Collaboration', 'Other'
                ])}
                
                {renderField('vision', 'futurePriorities', 'Future Financing Priorities', 'multiselect', [
                  'Inclusive Finance', 'Export Finance', 'AI', 'FinTech', 'Insurance', 'Climate Finance', 'Women Entrepreneurs', 'Youth Entrepreneurs', 'Digital Payments', 'Financial Literacy', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'govPriorities', 'Top Government Priorities for Financial Inclusion (Select Five)', 'multiselect', [
                  'Credit Guarantee', 'Interest Subsidy', 'Financial Literacy', 'Export Support', 'Digital Payments', 'Insurance', 'Startup Support', 'Innovation Finance', 'Climate Finance', 'Women Entrepreneurship', 'Youth Entrepreneurship', 'Cooperative Finance', 'ESG', 'Other'
                ])}
                
                {renderField('recommendations', 'generalRecs', 'Recommendations for Government, Industry, Universities, NGOs, and International Organizations', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence Upload</h3>
                  <p className="text-sm text-gray-600 mb-4">Upload relevant public documentation. Examples: Financial Product Brochures, MSME Policies, CSR Reports, Annual Reports, Financial Inclusion Reports, Credit Guidelines. DO NOT upload confidential customer data or sensitive financial information.</p>
                  
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
                              <option>Financial Product Brochure</option>
                              <option>MSME Policy / Credit Guideline</option>
                              <option>CSR / Sustainability Report</option>
                              <option>Annual Report</option>
                              <option>Financial Inclusion / Research Report</option>
                              <option>Other</option>
                            </select>
                            <select className="text-xs p-2 border border-gray-300 rounded w-full" defaultValue="">
                              <option value="" disabled>Select Publication Status...</option>
                              <option>Public / Published Document</option>
                              <option>Internal Policy Guideline</option>
                            </select>
                            <select className="text-xs p-2 border border-gray-300 rounded w-full md:col-span-2" defaultValue="">
                              <option value="" disabled>Select Confidentiality...</option>
                              <option>Publicly available</option>
                              <option>Confidential - For KHCRF policy analysis only</option>
                              <option>Contact Institution before publication</option>
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
                  <p className="text-gray-600 text-lg">Your financial consultation response is ready. Please review the details before submitting.</p>
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
                      <span className={isServicesValid ? "text-green-600" : "text-gray-400"}>Services</span>
                      <span className={isLendingValid ? "text-green-600" : "text-gray-400"}>Lending/Risk</span>
                      <span className={isInclusionValid ? "text-green-600" : "text-gray-400"}>Inclusion</span>
                      <span className={isDigitalValid ? "text-green-600" : "text-gray-400"}>Digital/ESG</span>
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
                          participantType: "Financial",
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
