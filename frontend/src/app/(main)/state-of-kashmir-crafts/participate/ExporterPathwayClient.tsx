"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  FaCheckCircle, FaFileAlt, FaUpload, FaArrowRight, FaArrowLeft, FaInfoCircle, FaTimes
} from 'react-icons/fa';
import { KASHMIR_DISTRICT_NAMES } from '@/lib/kashmir-districts';

const generateConsultationId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SKC-2026-EXP-${result}`;
};

export default function ExporterPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_exp_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_exp_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_exp_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_exp_consultationData', JSON.stringify(consultationData));
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
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

  // Compute status for progress
  const isConsentValid = consultationData.consent?.capacity && consultationData.consent?.authority && consultationData.consent?.identity;
  const isProfileValid = consultationData.profile?.businessName && consultationData.profile?.district && consultationData.profile?.businessType;
  const isSupplyValid = consultationData.supply?.primaryCrafts && consultationData.supply?.source;
  const isMarketsValid = consultationData.markets?.countries && consultationData.markets?.buyerTypes;
  const isLogisticsValid = consultationData.profile?.registrations?.includes('None') ? true : consultationData.logistics?.shippingMode; // skip if no IEC/inactive
  const isFinanceValid = consultationData.finance?.paymentMethods;
  const isAuthValid = consultationData.auth?.quality;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isRecommendationsValid = consultationData.recommendations?.govPriorities;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isSupplyValid, isMarketsValid, isLogisticsValid, isFinanceValid, isAuthValid, isChallengesValid, isRecommendationsValid];
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
                   Exporter Consultation Instrument
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
                  <h2 className="text-3xl font-black text-brand-dark mb-4">Step 1: Consent & Submission Authority</h2>
                  <div className="bg-blue-50 text-blue-900 p-5 rounded-2xl border border-blue-100 flex gap-4 text-sm font-medium leading-relaxed">
                    <FaInfoCircle className="text-blue-500 text-xl shrink-0 mt-0.5" />
                    <div>
                      <p className="mb-2">This consultation forms part of the State of Kashmir Crafts Assessment 2026–2027 initiative led by the Hamadan Craft Revival Foundation. It seeks evidence about international markets, buyers, sourcing, logistics, export operations, barriers, and opportunities affecting Kashmir handicrafts.</p>
                      <p>Participation is voluntary. This is not a customs declaration, licensing process, or taxation assessment.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'capacity', 'In what capacity are you submitting this response?', 'select', [
                  'Owner', 'Managing Director', 'Export Manager', 'Marketing Director', 'International Sales Manager', 'Partner', 'Authorized Employee', 'Consultant', 'Other'
                ])}
                
                {renderField('consent', 'authority', 'Are you authorized to submit information on behalf of this enterprise?', 'radio', ['Yes, officially authorized', 'Partially authorized', 'No, this is my personal professional perspective'])}
                
                {renderField('consent', 'identity', 'Submission identity preference', 'radio', [
                  'Enterprise may be publicly identified',
                  'Enterprise name may remain confidential',
                  'Submission may be used only in anonymized analysis',
                  'Respondent name confidential, enterprise name public'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact the enterprise for clarification?', 'radio', ['Yes', 'No'])}

                {consultationData.consent?.contact === 'Yes' && (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField('consent', 'contactName', 'Contact Name', 'text')}
                    {renderField('consent', 'contactDesig', 'Designation', 'text')}
                    {renderField('consent', 'contactEmail', 'Email', 'email')}
                    {renderField('consent', 'contactPhone', 'Phone / WhatsApp', 'tel')}
                  </div>
                )}
                
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
                  <label className="block font-bold text-gray-900 mb-4">Mandatory Consent</label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check1 || false} onChange={e => handleChange('consent', 'check1', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I understand the purpose of this consultation.</span>
                  </label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check2 || false} onChange={e => handleChange('consent', 'check2', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I confirm that participation is voluntary.</span>
                  </label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check3 || false} onChange={e => handleChange('consent', 'check3', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I confirm the level of authority under which I am submitting.</span>
                  </label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check4 || false} onChange={e => handleChange('consent', 'check4', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I confirm that the information is accurate to the best of my knowledge.</span>
                  </label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check5 || false} onChange={e => handleChange('consent', 'check5', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I understand the selected confidentiality and publication permissions.</span>
                  </label>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 2: Business Profile */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Export Business Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('profile', 'businessName', 'Business Name', 'text')}
                  {renderField('profile', 'tradingName', 'Trading Name (if different)', 'text')}
                  {renderField('profile', 'yearStarted', 'Year Started', 'number')}
                  {renderField('profile', 'district', 'District', 'select', KASHMIR_DISTRICT_NAMES)}
                  {renderField('profile', 'office', 'Main Office Location', 'text')}
                  {renderField('profile', 'warehouse', 'Warehouse Location', 'text')}
                  {renderField('profile', 'website', 'Website', 'text')}
                  {renderField('profile', 'phone', 'Phone', 'text')}
                  {renderField('profile', 'email', 'Email', 'email')}
                </div>

                {renderField('profile', 'businessType', 'Export Business Type', 'select', [
                  'Merchant Exporter', 'Manufacturer Exporter', 'Buying House', 'Trading Company', 'Export House', 'Cooperative Exporter', 'Producer Company', 'Government Export Agency', 'Private Limited', 'Family Business', 'Startup', 'Other'
                ])}
                
                {renderField('profile', 'registrations', 'Which registrations apply?', 'multiselect', [
                  'IEC', 'GST', 'MSME', 'RCMC', 'EPCH', 'Handicrafts Registration', 'GI Authorization', 'Company Registration', 'None', 'Other'
                ])}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {renderField('profile', 'experience', 'Annual Export Experience', 'select', [
                    'Less than 1 year', '1–3', '3–5', '5–10', '10–20', '20+'
                  ])}
                  {renderField('profile', 'frequency', 'Export Frequency', 'select', [
                    'Monthly', 'Quarterly', 'Seasonal', 'Occasional', 'Project Based', 'Inactive'
                  ])}
                </div>
                
                {renderField('profile', 'turnover', 'Annual Export Turnover (Optional Band)', 'select', [
                  'Below ₹10 Lakh', '₹10–50 Lakh', '₹50 Lakh–₹1 Crore', '₹1–5 Crore', '₹5–10 Crore', '₹10–50 Crore', 'Above ₹50 Crore'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Products & Supply Chain */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Products & Supply Chain</h2>

                {renderField('supply', 'primaryCrafts', 'Primary Crafts Exported', 'multiselect', [
                  'Carpets', 'Pashmina', 'Kani', 'Papier Mache', 'Wood Carving', 'Copperware', 'Namdah', 'Crewel', 'Chain Stitch', 'Willow', 'Mixed', 'Other'
                ])}
                
                {renderField('supply', 'productTypes', 'Product Types', 'multiselect', [
                  'Shawls', 'Rugs', 'Furniture', 'Decor', 'Textiles', 'Accessories', 'Gift Items', 'Luxury Goods', 'Institutional Products', 'Custom Orders'
                ])}
                
                {renderField('supply', 'source', 'Source of Products', 'multiselect', [
                  'Manufactured In House', 'Purchased from Manufacturers', 'Purchased from Cooperatives', 'Purchased Directly from Artisans', 'Aggregators', 'Import then Re-export', 'Mixed'
                ])}
                
                {/* Conditional Logic for Supply Chain */}
                {(consultationData.profile?.businessType === 'Manufacturer Exporter' || consultationData.supply?.source?.includes('Manufactured In House')) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-brand-dark mb-4">In-House Manufacturing Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderField('supply', 'mfgWorkforce', 'Total production workforce', 'number')}
                      {renderField('supply', 'mfgCapacity', 'Production capacity utilized for export (%)', 'text')}
                    </div>
                  </div>
                )}
                
                {(consultationData.profile?.businessType === 'Buying House') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-brand-dark mb-4">Buying House Operations</h3>
                    {renderField('supply', 'bhSourcingServices', 'Sourcing services provided to buyers', 'textarea')}
                  </div>
                )}
                
                {(consultationData.supply?.source?.includes('Purchased Directly from Artisans')) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-brand-dark mb-4">Artisan Procurement</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderField('supply', 'artisanPayment', 'Artisan payment timeline', 'select', ['Advance', 'On delivery', 'Within 15 days', 'After export payment'])}
                      {renderField('supply', 'artisanSupport', 'Support provided to artisans', 'multiselect', ['Raw materials', 'Design', 'Credit', 'Tools'])}
                    </div>
                  </div>
                )}
                
                {(consultationData.supply?.productTypes?.includes('Luxury Goods')) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-brand-dark mb-4">Luxury Goods Export</h3>
                    {renderField('supply', 'luxuryPractices', 'Specific practices for luxury products (e.g., branding, packaging, storytelling, authenticity)', 'textarea')}
                  </div>
                )}

                {renderField('supply', 'districtSourcing', 'Districts from which products are sourced', 'multiselect', KASHMIR_DISTRICT_NAMES)}
                
                {renderField('supply', 'supplierTypes', 'Supplier Types', 'multiselect', [
                  'Manufacturers', 'Artisans', 'Master Artisans', 'SHGs', 'Cooperatives', 'Clusters', 'Agents', 'Other'
                ])}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('supply', 'activeSuppliers', 'Number of Active Suppliers', 'select', ['1-10', '11-50', '51-100', '100+'])}
                  {renderField('supply', 'longTerm', 'Are supply relationships long-term?', 'radio', ['Yes', 'No', 'Mixed'])}
                </div>
                
                {renderField('supply', 'supplierEval', 'Do you evaluate suppliers on:', 'multiselect', [
                  'Quality', 'Capacity', 'Authenticity', 'GI', 'Ethics', 'Delivery', 'Documentation', 'Environmental practices'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Export Markets & Buyers */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Export Markets & Buyers</h2>

                {renderField('markets', 'countries', 'Countries exported to (List main countries)', 'textarea')}
                {renderField('markets', 'topMarkets', 'Rank top 5 markets (e.g. 1. USA, 2. UK)', 'textarea')}
                
                {renderField('markets', 'buyerTypes', 'Buyer Types', 'multiselect', [
                  'Wholesalers', 'Luxury Retailers', 'Department Stores', 'Interior Designers', 'Museums', 'Collectors', 'Government', 'Hotels', 'Online Retailers', 'Importers', 'Private Labels', 'Distributors', 'Other'
                ])}
                
                {renderField('markets', 'buyerConcentration', 'Largest buyer share of exports', 'select', [
                  'Less than 10%', '10–25%', '26–50%', '51–75%', 'Over 75%'
                ])}
                
                {renderField('markets', 'buyerRelationship', 'Buyer Relationship', 'multiselect', [
                  'Long Term', 'Repeat Buyers', 'One Time', 'Agents', 'Marketplace', 'Other'
                ])}
                
                {renderField('markets', 'salesChannel', 'Sales Channel', 'multiselect', [
                  'Direct Export', 'Buying Agent', 'Distributor', 'Marketplace', 'Trade Fair', 'Government', 'Mixed'
                ])}
                
                {(consultationData.markets?.salesChannel?.includes('Marketplace')) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-brand-dark mb-4">Marketplace Module</h3>
                    {renderField('markets', 'marketplacePlatforms', 'Which global marketplaces do you use?', 'textarea')}
                    {renderField('markets', 'marketplaceChallenges', 'Key challenges with cross-border e-commerce', 'textarea')}
                  </div>
                )}
                
                {renderField('markets', 'marketGrowth', 'Market Growth Trend', 'radio', ['Growing', 'Stable', 'Declining', 'Unknown'])}
                
                {renderField('markets', 'marketChallenges', 'Market Entry Challenges', 'multiselect', [
                  'Language', 'Compliance', 'Competition', 'Price', 'Quality', 'Logistics', 'Marketing', 'Brand Recognition', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Logistics & Documentation */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Logistics & Documentation</h2>

                {(!consultationData.profile?.registrations?.includes('IEC') && consultationData.profile?.registrations?.length > 0) ? (
                  <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-orange-900 mb-4">Export Readiness (No IEC Identified)</h3>
                    <p className="text-sm text-orange-800 mb-4">As you have not selected IEC in your registrations, please detail the barriers preventing formal export certification.</p>
                    {renderField('logistics', 'iecBarriers', 'What are the main barriers to obtaining an IEC and exporting formally?', 'textarea')}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {renderField('logistics', 'shippingMode', 'Shipping Mode', 'multiselect', ['Sea', 'Air', 'Courier', 'Road', 'Mixed'])}
                      {renderField('logistics', 'freight', 'Freight Handling', 'multiselect', ['Own', 'Forwarder', 'Buyer', 'Mixed'])}
                    </div>
                    
                    {renderField('logistics', 'documentation', 'Documentation Required', 'multiselect', [
                      'Commercial Invoice', 'Packing List', 'Certificate of Origin', 'GI', 'Phytosanitary', 'Insurance', 'Inspection', 'Other'
                    ])}
                    
                    {renderField('logistics', 'customs', 'Customs Experience', 'radio', [
                      'Smooth', 'Occasional Delays', 'Frequent Delays', 'Serious Issues'
                    ])}
                    
                    {renderField('logistics', 'shipmentTime', 'Average Shipment Time', 'select', [
                      '1-7 Days', '8-14 Days', '15-30 Days', '31-60 Days', 'More than 60 Days'
                    ])}
                    
                    {renderField('logistics', 'exportDelays', 'Common Causes for Export Delays', 'multiselect', [
                      'Documentation', 'Transport', 'Buyer', 'Payment', 'Inspection', 'Weather', 'Political', 'Other'
                    ])}
                  </>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Finance & International Trade */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Finance & International Trade</h2>

                {renderField('finance', 'paymentMethods', 'Payment Methods Used', 'multiselect', [
                  'Advance', 'LC', 'Bank Transfer', 'CAD', 'Open Account', 'Escrow', 'Marketplace', 'Mixed'
                ])}
                
                {renderField('finance', 'avgPaymentTime', 'Average Payment Time (Days)', 'select', [
                  'Advance', '0-30', '31-60', '61-90', '90+'
                ])}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('finance', 'currency', 'Main Currencies Used', 'multiselect', ['USD', 'EUR', 'GBP', 'AED', 'JPY', 'AUD', 'Mixed'])}
                  {renderField('finance', 'currencyRisk', 'Currency Risk Exposure', 'radio', ['High', 'Medium', 'Low'])}
                </div>
                
                {renderField('finance', 'exportFinance', 'Sources of Export Finance', 'multiselect', [
                  'Bank', 'EXIM', 'Buyer Advance', 'Own Capital', 'Private Finance', 'Government', 'Other'
                ])}
                
                {renderField('finance', 'insurance', 'Insurance Used', 'multiselect', ['Cargo', 'Credit Insurance', 'None'])}
                
                {renderField('finance', 'financeChallenges', 'Trade Finance Challenges', 'multiselect', [
                  'Working Capital', 'High Interest', 'Payment Delay', 'Currency', 'Bank Documentation', 'Collateral', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Quality & Compliance */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Quality, Authenticity & Compliance</h2>

                {renderField('auth', 'quality', 'Quality Assurance', 'multiselect', [
                  'Internal QC', 'Manufacturer QC', 'Third Party', 'Buyer Inspection', 'Lab Testing', 'None'
                ])}
                
                {renderField('auth', 'gi', 'GI Utilization', 'radio', ['Uses GI', 'Not Applicable', 'Interested'])}
                
                {(consultationData.auth?.gi === 'Uses GI' || consultationData.profile?.registrations?.includes('GI Authorization')) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-brand-dark mb-4">GI Module</h3>
                    {renderField('auth', 'giChallenges', 'Challenges faced in exporting GI-certified products', 'textarea')}
                  </div>
                )}
                
                {renderField('auth', 'authenticity', 'Authenticity Measures', 'multiselect', [
                  'Certificates', 'QR', 'Traceability', 'Artisan Record', 'Production Record', 'Material Verification', 'Other'
                ])}
                
                {renderField('auth', 'counterfeit', 'Counterfeit Issues Encountered in Global Markets', 'multiselect', [
                  'Machine-made', 'Fake Pashmina', 'Wrong Origin', 'Design Copying', 'Brand Copying', 'Marketplace Counterfeit', 'Other'
                ])}
                
                {renderField('auth', 'certifications', 'International Certifications Held', 'multiselect', [
                  'Fair Trade', 'OEKO', 'ISO', 'Organic', 'Other', 'None'
                ])}
                
                {renderField('auth', 'environmental', 'Environmental Expectations from Buyers', 'multiselect', [
                  'Sustainability', 'Traceability', 'Worker Welfare', 'Packaging', 'Carbon', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Challenges & Opportunities */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Challenges & Future Opportunities</h2>

                {renderField('challenges', 'topChallenges', 'Top Challenges (Choose up to 5)', 'multiselect', [
                  'Freight Cost', 'Currency', 'Payment Delay', 'Raw Material', 'Quality', 'Competition', 'Counterfeit', 'Market Access', 'Compliance', 'Digital Marketing', 'Brand Recognition', 'Government Support', 'Trade Fair Access', 'Logistics', 'Political', 'Climate', 'Other'
                ])}
                
                {renderField('challenges', 'futureMarkets', 'Future Target Markets', 'multiselect', [
                  'North America', 'Europe', 'Middle East', 'Japan', 'Australia', 'South East Asia', 'Africa', 'Latin America'
                ])}
                
                {renderField('challenges', 'growthPriorities', 'Growth Priorities', 'multiselect', [
                  'Export Promotion', 'Branding', 'Buyer Network', 'Digital Export', 'Trade Missions', 'Trade Finance', 'Warehousing', 'Certification', 'Other'
                ])}
                
                {renderField('challenges', 'interest', 'Strategic Interest for Next 3 Years', 'multiselect', [
                  'Increase Export', 'Maintain', 'Diversify', 'New Products', 'New Countries', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'govPriorities', 'Top Government Priorities', 'multiselect', [
                  'Export Promotion', 'Trade Missions', 'Trade Finance', 'Market Intelligence', 'GI', 'Brand Kashmir', 'Infrastructure', 'Simplified Documentation', 'Testing Labs', 'Warehousing', 'Digital Export', 'Other'
                ])}
                
                {renderField('recommendations', 'indManufacturers', 'What should manufacturers improve?', 'textarea')}
                {renderField('recommendations', 'indArtisans', 'What should artisans improve?', 'textarea')}
                {renderField('recommendations', 'indBuyers', 'What should international buyers improve?', 'textarea')}
                {renderField('recommendations', 'intlPartners', 'How can international organizations help?', 'textarea')}
                
                {renderField('recommendations', 'action12m', 'What one action could most improve your export operations within the next 12 months?', 'textarea')}
                {renderField('recommendations', 'reform5y', 'What structural reform is most important for the export sector during the next 3 to 5 years?', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence & Documentation</h3>
                  <p className="text-sm text-gray-600 mb-4">Suggested Uploads: Export Invoice, Packing List, Buyer Orders, Shipping Documents, Certificates, Country Registrations, Trade Fair Photos, Buyer Testimonials, Quality Reports, Inspection Reports, Contracts, Catalogues, Product/Warehouse Photos.</p>
                  
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-4">
                    <p className="text-xs font-bold text-orange-800 uppercase">Important Security Warning</p>
                    <p className="text-sm text-orange-700 mt-1">Remove or redact bank account numbers, government identity numbers, member phone numbers, signatures, private addresses, personal financial information, and unrelated buyer information before uploading. (Commercial sensitivity controls available below).</p>
                  </div>

                  <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-brand-primary text-icon-on-light rounded-xl font-bold hover:bg-brand-primary hover:text-white transition">
                    <FaUpload /> Upload Evidence Files
                  </button>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-6 space-y-3">
                      {uploadedFiles.map((uf, idx) => (
                        <div key={idx} className="flex flex-col bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-gray-800 flex items-center gap-2"><FaFileAlt data-ui-icon  className=""/> {uf.file.name}</span>
                            <button onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700"><FaTimes /></button>
                          </div>
                          <select className="text-xs p-2 border border-gray-300 rounded mt-2 w-full" defaultValue="">
                            <option value="" disabled>Select Evidence Type...</option>
                            <option>Export Invoice</option>
                            <option>Packing List / Shipping Doc</option>
                            <option>Certificates / Registrations</option>
                            <option>Photos (Products/Trade Fair/Warehouse)</option>
                            <option>Reports / Contracts / Orders</option>
                            <option>Other</option>
                          </select>
                          <select className="text-xs p-2 border border-gray-300 rounded mt-2 w-full" defaultValue="">
                            <option value="" disabled>Select Confidentiality...</option>
                            <option>Public and attributable</option>
                            <option>Public but commercial data redacted</option>
                            <option>Public but enterprise anonymized</option>
                            <option>Research team only</option>
                            <option>Aggregate analysis only</option>
                            <option>Contact enterprise before any publication</option>
                          </select>
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
                  <p className="text-gray-600 text-lg">Your consultation response is ready. Please review the details before submitting.</p>
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
                      <span className={isProfileValid ? "text-green-600" : "text-gray-400"}>Business Profile</span>
                      <span className={isSupplyValid ? "text-green-600" : "text-gray-400"}>Products & Supply</span>
                      <span className={isMarketsValid ? "text-green-600" : "text-gray-400"}>Export Markets</span>
                      <span className={isLogisticsValid ? "text-green-600" : "text-gray-400"}>Logistics</span>
                      <span className={isFinanceValid ? "text-green-600" : "text-gray-400"}>Finance</span>
                      <span className={isAuthValid ? "text-green-600" : "text-gray-400"}>Quality & Auth</span>
                      <span className={isChallengesValid ? "text-green-600" : "text-gray-400"}>Challenges</span>
                      <span className={isRecommendationsValid ? "text-green-600" : "text-gray-400"}>Recommendations</span>
                      <span className={uploadedFiles.length > 0 ? "text-green-600" : "text-gray-400"}>Evidence (Optional)</span>
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
                          participantType: "Exporter",
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
