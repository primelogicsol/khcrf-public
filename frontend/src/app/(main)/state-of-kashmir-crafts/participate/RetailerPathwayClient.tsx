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
  return `SKC-2026-RTL-${result}`;
};

export default function RetailerPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_rtl_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_rtl_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_rtl_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_rtl_consultationData', JSON.stringify(consultationData));
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

  const isConsentValid = consultationData.consent?.capacity && consultationData.consent?.authority && consultationData.consent?.identity;
  const isProfileValid = consultationData.profile?.storeName && consultationData.profile?.district && consultationData.profile?.format;
  const isSupplyValid = consultationData.supply?.categories && consultationData.supply?.supplierTypes;
  const isCustomersValid = consultationData.customers?.segments && consultationData.customers?.primary;
  const isOpsValid = consultationData.ops?.inventorySystem && consultationData.ops?.facilities;
  const isFinanceValid = consultationData.finance?.pricingStrategy;
  const isAuthValid = consultationData.auth?.verification;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isRecommendationsValid = consultationData.recommendations?.govPriorities;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isSupplyValid, isCustomersValid, isOpsValid, isFinanceValid, isAuthValid, isChallengesValid, isRecommendationsValid];
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
                   Retailer Consultation Instrument
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
                      <p className="mb-2">This consultation forms part of the State of Kashmir Crafts Assessment 2026–2027 initiative led by the Hamadan Craft Revival Foundation. It seeks evidence about retail operations, customer demand, sourcing, pricing, authenticity, market trends, and business challenges affecting Kashmir handicrafts.</p>
                      <p>Participation is voluntary. This is not a registration form, business license, GST application, POS onboarding form, or marketplace seller registration.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'capacity', 'In what capacity are you submitting this response?', 'select', [
                  'Owner', 'Store Manager', 'Operations Manager', 'Retail Director', 'Sales Manager', 'Franchise Manager', 'Government Emporium Manager', 'Cooperative Store Manager', 'Authorized Employee', 'Other'
                ])}
                
                {renderField('consent', 'authority', 'Are you authorized to submit information on behalf of this business?', 'radio', ['Yes, officially authorized', 'Partially authorized', 'No, this is my personal professional perspective'])}
                
                {renderField('consent', 'identity', 'Submission identity preference', 'radio', [
                  'Business may be publicly identified',
                  'Business name may remain confidential',
                  'Submission may be used only in anonymized analysis',
                  'Respondent name confidential, business name public'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact the business for clarification?', 'radio', ['Yes', 'No'])}

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
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Retail Business Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('profile', 'storeName', 'Store Name', 'text')}
                  {renderField('profile', 'tradingName', 'Trading Name (if different)', 'text')}
                  {renderField('profile', 'yearStarted', 'Year Started', 'number')}
                  {renderField('profile', 'district', 'District', 'select', KASHMIR_DISTRICT_NAMES)}
                  {renderField('profile', 'town', 'Town / City', 'text')}
                  {renderField('profile', 'address', 'Address (Optional)', 'textarea')}
                  {renderField('profile', 'website', 'Website', 'text')}
                  {renderField('profile', 'phone', 'Phone', 'text')}
                  {renderField('profile', 'email', 'Email', 'email')}
                </div>

                {renderField('profile', 'format', 'Retail Format', 'multiselect', [
                  'Independent Retail Store', 'Artisan-owned Shop', 'Luxury Boutique', 'Government Emporium', 'Cooperative Outlet', 'Museum Store', 'Tourist Gift Shop', 'Department Store', 'Interior Design Store', 'Lifestyle Store', 'Pop-up Store', 'Seasonal Store', 'Wholesale & Retail', 'Franchise', 'Other'
                ])}
                
                {renderField('profile', 'ownership', 'Store Ownership', 'select', [
                  'Sole Proprietorship', 'Partnership', 'Company', 'Cooperative', 'Government', 'NGO', 'Family Business', 'Other'
                ])}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {renderField('profile', 'numStores', 'Number of Stores', 'select', ['One', 'Two to Five', 'Six to Ten', 'More than Ten'])}
                  {renderField('profile', 'yearsRetail', 'Years in Retail', 'select', ['Less than 1 year', '1–3', '4–10', '11–20', 'More than 20'])}
                </div>
                
                {renderField('profile', 'turnover', 'Annual Retail Turnover (Optional)', 'select', [
                  'Below ₹10 Lakh', '₹10–50 Lakh', '₹50 Lakh–₹1 Crore', '₹1–5 Crore', '₹5–10 Crore', 'Above ₹10 Crore'
                ])}

                {/* Conditional Logic specific to Retail Business Profile */}
                {consultationData.profile?.format?.includes('Government Emporium') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Government Emporium Module</h3>
                    {renderField('profile', 'govAgency', 'Managing Agency / Corporation', 'text')}
                    {renderField('profile', 'govChallenges', 'Specific challenges operating government emporia', 'textarea')}
                  </div>
                )}
                
                {consultationData.profile?.format?.includes('Museum Store') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Heritage Interpretation Module</h3>
                    {renderField('profile', 'heritageRole', 'How does the store interpret heritage for visitors?', 'textarea')}
                  </div>
                )}
                
                {['Two to Five', 'Six to Ten', 'More than Ten'].includes(consultationData.profile?.numStores) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Multi-Store Expansion</h3>
                    {renderField('profile', 'expansionChallenges', 'Key challenges in managing multiple retail locations', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Products & Suppliers */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Products & Suppliers</h2>

                {renderField('supply', 'categories', 'Product Categories Sold', 'multiselect', [
                  'Pashmina', 'Carpets', 'Kani', 'Shawls', 'Papier Mache', 'Walnut Wood', 'Copperware', 'Namdah', 'Crewel', 'Chain Stitch', 'Willow', 'Home Décor', 'Fashion Accessories', 'Mixed', 'Other'
                ])}
                
                <h3 className="font-bold text-gray-800 mt-6 mb-4">Product Mix (Approximate Percentage)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('supply', 'mixKashmir', 'Kashmir Handicrafts %', 'text')}
                  {renderField('supply', 'mixIndian', 'Other Indian Handicrafts %', 'text')}
                  {renderField('supply', 'mixImported', 'Imported Products %', 'text')}
                  {renderField('supply', 'mixLifestyle', 'Lifestyle Products %', 'text')}
                </div>
                
                {/* Mixed Inventory Condition */}
                {(Number(consultationData.supply?.mixKashmir || 100) < 100) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-brand-dark mb-4">Mixed Inventory</h3>
                    {renderField('supply', 'mixReason', 'Why do you stock non-Kashmir products?', 'textarea')}
                  </div>
                )}
                
                {renderField('supply', 'supplierTypes', 'Supplier Types', 'multiselect', [
                  'Artisans', 'Manufacturers', 'Cooperatives', 'Producer Groups', 'Exporters', 'Wholesalers', 'Government Emporia', 'Importers', 'Mixed'
                ])}
                
                {/* Artisan-owned Store Condition */}
                {consultationData.profile?.format?.includes('Artisan-owned Shop') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-brand-dark mb-4">Artisan Relationship</h3>
                    {renderField('supply', 'artisanOwnedBenefits', 'What are the main benefits and challenges of running an artisan-owned retail shop?', 'textarea')}
                  </div>
                )}
                
                {renderField('supply', 'relationships', 'Supplier Relationships', 'multiselect', [
                  'Long Term', 'Occasional', 'Spot Purchase', 'Consignment', 'Exclusive', 'Mixed'
                ])}
                
                {renderField('supply', 'activeSuppliers', 'Number of Active Suppliers', 'select', [
                  '1-5', '6-20', '21-50', '51-100', 'More than 100'
                ])}
                
                <h3 className="font-bold text-gray-800 mt-6 mb-4">Supplier Evaluation</h3>
                <p className="text-sm text-gray-600 mb-4">Rate the importance of the following when selecting suppliers (High, Medium, Low).</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('supply', 'evalQuality', 'Product Quality', 'select', ['High', 'Medium', 'Low'])}
                  {renderField('supply', 'evalDelivery', 'Delivery Reliability', 'select', ['High', 'Medium', 'Low'])}
                  {renderField('supply', 'evalAuth', 'Authenticity', 'select', ['High', 'Medium', 'Low'])}
                  {renderField('supply', 'evalPricing', 'Pricing', 'select', ['High', 'Medium', 'Low'])}
                  {renderField('supply', 'evalPackaging', 'Packaging', 'select', ['High', 'Medium', 'Low'])}
                  {renderField('supply', 'evalComm', 'Communication', 'select', ['High', 'Medium', 'Low'])}
                  {renderField('supply', 'evalSustain', 'Sustainability', 'select', ['High', 'Medium', 'Low'])}
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Customers & Sales */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Customers & Sales</h2>

                {renderField('customers', 'segments', 'Customer Segments', 'multiselect', [
                  'Local Residents', 'Domestic Tourists', 'International Tourists', 'Collectors', 'Interior Designers', 'Hotels', 'Institutions', 'Government', 'Corporate Buyers', 'Repeat Customers', 'Online Walk-ins', 'Other'
                ])}
                
                {renderField('customers', 'primary', 'Primary Customer', 'select', [
                  'Local Residents', 'Domestic Tourists', 'International Tourists', 'Collectors', 'Corporate Buyers', 'Wholesale Buyers'
                ])}
                
                {renderField('customers', 'touristDep', 'Tourist Dependency (% of Sales)', 'select', [
                  'Below 10%', '10–25%', '26–50%', '51–75%', 'Above 75%'
                ])}
                
                {/* Tourism Condition */}
                {(consultationData.profile?.format?.includes('Tourist Gift Shop') || consultationData.customers?.touristDep?.includes('75%') || consultationData.customers?.touristDep?.includes('50%')) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-brand-dark mb-4">Tourism Dependency</h3>
                    {renderField('customers', 'touristChallenges', 'How does tourism volatility affect your retail business?', 'textarea')}
                  </div>
                )}
                
                {renderField('customers', 'salesTrend', 'Sales Trend (Compared to 3 years ago)', 'radio', ['Increased', 'Stable', 'Declined'])}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('customers', 'peakSeason', 'Peak Season', 'text', [], { placeholder: 'e.g. May - July' })}
                  {renderField('customers', 'lowSeason', 'Low Season', 'text', [], { placeholder: 'e.g. Dec - Feb' })}
                </div>
                
                {renderField('customers', 'bestSelling', 'Best Selling Products (Top 5)', 'textarea')}
                {renderField('customers', 'slowMoving', 'Slow Moving Products (Top 5)', 'textarea')}
                
                {renderField('customers', 'expectations', 'Customer Expectations', 'multiselect', [
                  'Authenticity', 'Quality', 'Storytelling', 'Price', 'Packaging', 'Sustainability', 'Certification', 'Personalization', 'Fast Service', 'Other'
                ])}
                
                {/* Luxury Boutique Condition */}
                {consultationData.profile?.format?.includes('Luxury Boutique') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Luxury Customer Expectations</h3>
                    {renderField('customers', 'luxuryService', 'What specialized services do luxury buyers demand?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Store Operations */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Store Operations</h2>

                {renderField('ops', 'inventoryHolding', 'Average Inventory Holding', 'select', [
                  'Less than 1 month', '1–3 Months', '3–6 Months', '6–12 Months', 'More than 1 year'
                ])}
                
                {renderField('ops', 'inventorySystem', 'Inventory System', 'select', [
                  'Manual', 'Excel', 'POS', 'ERP', 'Other'
                ])}
                
                {/* Digital POS Analytics Condition */}
                {['POS', 'ERP'].includes(consultationData.ops?.inventorySystem) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-brand-dark mb-4">Digital Retail Analytics</h3>
                    {renderField('ops', 'posInsights', 'How do you use POS data to improve sales or inventory?', 'textarea')}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('ops', 'stockouts', 'Stock-outs Frequency', 'select', ['Rarely', 'Sometimes', 'Frequently'])}
                  {renderField('ops', 'overstock', 'Overstock Frequency', 'select', ['Rarely', 'Sometimes', 'Frequently'])}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('ops', 'returnsFreq', 'Product Returns Frequency', 'select', ['Rarely', 'Sometimes', 'Frequently'])}
                  {renderField('ops', 'returnsReason', 'Main Reasons for Returns', 'text')}
                </div>
                
                {renderField('ops', 'staff', 'Number of Staff', 'select', ['1-2', '3-5', '6-10', '11-20', 'More than 20'])}
                
                {renderField('ops', 'staffTraining', 'Staff Training Topics', 'multiselect', [
                  'Product Knowledge', 'Customer Service', 'Authenticity', 'Sales', 'GI', 'Sustainability', 'Storytelling'
                ])}
                
                {renderField('ops', 'facilities', 'Store Facilities', 'multiselect', [
                  'Product Displays', 'Climate Control', 'Secure Storage', 'POS', 'Digital Payments', 'Customer Lounge', 'Accessibility', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Pricing, Inventory & Finance */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Pricing, Inventory & Finance</h2>

                {renderField('finance', 'pricingStrategy', 'Pricing Strategy', 'select', [
                  'Cost Plus', 'Market Based', 'Competitor Based', 'Premium', 'Dynamic', 'Fixed', 'Other'
                ])}
                
                {renderField('finance', 'marginPressure', 'Margin Pressure', 'radio', ['High', 'Medium', 'Low'])}
                
                {renderField('finance', 'workingCapital', 'Working Capital', 'radio', [
                  'Sufficient', 'Sometimes Short', 'Frequently Short', 'Critical'
                ])}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('finance', 'supplierPayment', 'Payment to Suppliers', 'select', [
                    'Advance', 'On Delivery', '30 Days', '60 Days', '90 Days', 'Consignment', 'Other'
                  ])}
                  {renderField('finance', 'customerPayment', 'Customer Payment Methods', 'multiselect', [
                    'Cash', 'Card', 'UPI', 'Bank Transfer', 'Mixed'
                  ])}
                </div>
                
                {renderField('finance', 'financeSources', 'Finance Sources', 'multiselect', [
                  'Owner', 'Bank', 'Government', 'Private', 'Investor', 'Other'
                ])}
                
                {renderField('finance', 'challenges', 'Biggest Financial Challenges', 'multiselect', [
                  'Working Capital', 'Rent', 'Slow Sales', 'Competition', 'Inventory', 'Taxes', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Authenticity & Customer Experience */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Authenticity & Customer Experience</h2>

                {renderField('auth', 'verification', 'How is authenticity verified?', 'multiselect', [
                  'Supplier Trust', 'Documentation', 'GI', 'QR', 'Expert Verification', 'Laboratory', 'None'
                ])}
                
                {renderField('auth', 'giAwareness', 'GI Awareness', 'radio', ['Yes', 'No', 'Interested'])}
                
                {/* GI Products Condition */}
                {consultationData.auth?.giAwareness === 'Yes' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-brand-dark mb-4">GI Retail Operations</h3>
                    {renderField('auth', 'giImpact', 'Has displaying GI labels affected sales or customer trust?', 'textarea')}
                  </div>
                )}
                
                {renderField('auth', 'counterfeit', 'Counterfeit Issues Encountered', 'multiselect', [
                  'Fake Pashmina', 'Machine-made', 'Wrong Origin', 'Design Copying', 'Imported Copies', 'Other'
                ])}
                
                {renderField('auth', 'customerQuestions', 'Most Common Customer Questions', 'multiselect', [
                  'Authenticity', 'Price', 'Origin', 'Materials', 'Artisan Story', 'Care', 'Certification', 'Other'
                ])}
                
                {renderField('auth', 'storytelling', 'Storytelling Provided to Customers', 'multiselect', [
                  'Artisan Stories', 'Craft History', 'GI Information', 'Videos', 'QR Codes', 'Printed Material', 'None'
                ])}
                
                {renderField('auth', 'sustainability', 'Customers Ask About', 'multiselect', [
                  'Natural Materials', 'Fair Wages', 'Environment', 'Packaging', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Challenges & Growth */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Challenges & Growth Opportunities</h2>

                {renderField('challenges', 'topChallenges', 'Top Challenges (Select Top 5)', 'multiselect', [
                  'Competition', 'Online Competition', 'Tourism Decline', 'Rent', 'Inventory', 'Cash Flow', 'Authenticity', 'Counterfeit', 'Supply', 'Staff', 'Marketing', 'Brand Awareness', 'Digital', 'Economic Slowdown', 'Climate', 'Other'
                ])}
                
                {renderField('challenges', 'growthOps', 'Growth Opportunities', 'multiselect', [
                  'Luxury Retail', 'Tourism', 'International Tourists', 'Experiential Retail', 'Digital Integration', 'Private Labels', 'Brand Partnerships', 'Other'
                ])}
                
                {renderField('challenges', 'futurePlans', 'Future Plans', 'multiselect', [
                  'Expand Stores', 'Renovate', 'Add Products', 'Improve Branding', 'Digital', 'International Customers', 'No Expansion', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'govPriorities', 'Top Priorities for Government', 'multiselect', [
                  'Tourism Promotion', 'Brand Kashmir', 'Retail Infrastructure', 'Trade Events', 'Marketing', 'Authenticity', 'GI', 'Retail Finance', 'Training', 'Parking', 'Other'
                ])}
                
                {renderField('recommendations', 'indImprove', 'What should the industry improve?', 'multiselect', [
                  'Packaging', 'Consistency', 'Quality', 'Pricing', 'Supply', 'Storytelling', 'Innovation', 'Other'
                ])}
                
                {renderField('recommendations', 'action12m', 'One Immediate Action (Next 12 Months)', 'textarea')}
                {renderField('recommendations', 'reform5y', 'One Structural Reform (Next 5 Years)', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence & Documentation</h3>
                  <p className="text-sm text-gray-600 mb-4">Suggested Uploads: Store Photos, Display Photos, Invoices, Supplier Lists, Sales Reports, Inventory Reports, Customer Feedback, Marketing Material, Catalogues, GI Documents, Authenticity Certificates, Other.</p>
                  
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-4">
                    <p className="text-xs font-bold text-orange-800 uppercase">Important Security Warning</p>
                    <p className="text-sm text-orange-700 mt-1">Remove or redact personal customer data, sensitive financial records, passwords, bank account numbers, and any unrelated proprietary information before uploading.</p>
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
                            <option>Store / Display Photos</option>
                            <option>Sales / Inventory Reports</option>
                            <option>Marketing / Catalogues</option>
                            <option>Authenticity / GI Certificates</option>
                            <option>Supplier Lists / Invoices</option>
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
                      <span className={isSupplyValid ? "text-green-600" : "text-gray-400"}>Products & Suppliers</span>
                      <span className={isCustomersValid ? "text-green-600" : "text-gray-400"}>Customers & Sales</span>
                      <span className={isOpsValid ? "text-green-600" : "text-gray-400"}>Store Operations</span>
                      <span className={isFinanceValid ? "text-green-600" : "text-gray-400"}>Pricing & Finance</span>
                      <span className={isAuthValid ? "text-green-600" : "text-gray-400"}>Authenticity</span>
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
                          participantType: "Retailer",
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
