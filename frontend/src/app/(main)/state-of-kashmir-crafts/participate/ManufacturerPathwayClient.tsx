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
  return `SKC-2026-MFR-${result}`;
};

export default function ManufacturerPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_manufacturer_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_manufacturer_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_manufacturer_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_manufacturer_consultationData', JSON.stringify(consultationData));
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
  const isProfileValid = consultationData.profile?.enterpriseName && consultationData.profile?.district && consultationData.profile?.legalStructure;
  const isProductionValid = consultationData.production?.model;
  const isWorkforceValid = consultationData.workforce?.composition;
  const isMaterialsValid = consultationData.materials?.main;
  const isQualityValid = consultationData.quality?.controlSystem;
  const isMarketsValid = consultationData.markets?.channels;
  const isTechValid = consultationData.tech?.use;
  const isRecommendationsValid = consultationData.recommendations?.govPriorities;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isProductionValid, isWorkforceValid, isMaterialsValid, isQualityValid, isMarketsValid, isTechValid, isRecommendationsValid];
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
                   Manufacturer Consultation Instrument
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
                      <p className="mb-2">This consultation forms part of the State of Kashmir Crafts Assessment 2026–2027 initiative led by the Hamadan Craft Revival Foundation. It seeks evidence concerning production systems, enterprise conditions, artisan engagement, supply chains, markets, authenticity, sustainability, and policy needs within Kashmir's handicrafts manufacturing sector.</p>
                      <p>Participation is voluntary. This is not a licensing, inspection, taxation, grant, or certification process.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'capacity', 'In what capacity are you submitting this response?', 'select', [
                  'Owner', 'Co-owner', 'Director', 'Partner', 'Proprietor', 'Chief executive', 'General manager', 'Production manager', 'Authorized employee', 'Cooperative or institutional representative', 'Consultant authorized by the enterprise', 'Other'
                ])}
                
                {renderField('consent', 'authority', 'Are you authorized to provide information on behalf of this enterprise?', 'radio', ['Yes', 'Partially', 'No, I am providing personal professional observations'])}
                
                {renderField('consent', 'identity', 'Submission identity preference', 'radio', [
                  'Enterprise may be publicly identified',
                  'Enterprise name may be retained confidentially',
                  'Submission may be used only in anonymized analysis'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact the enterprise for clarification?', 'radio', ['Yes', 'No'])}

                {consultationData.consent?.contact === 'Yes' && (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField('consent', 'contactName', 'Contact Name', 'text')}
                    {renderField('consent', 'contactDesig', 'Designation', 'text')}
                    {renderField('consent', 'contactEmail', 'Email', 'email')}
                    {renderField('consent', 'contactPhone', 'Phone', 'tel')}
                  </div>
                )}
                
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
                  <label className="block font-bold text-gray-900 mb-4">Mandatory Consent</label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check1 || false} onChange={e => handleChange('consent', 'check1', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I understand the purpose of the consultation and confirm participation is voluntary.</span>
                  </label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check2 || false} onChange={e => handleChange('consent', 'check2', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I confirm that I am authorized to provide the information submitted, or have clearly indicated otherwise.</span>
                  </label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check3 || false} onChange={e => handleChange('consent', 'check3', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I confirm that the information is accurate to the best of my knowledge and understand the selected confidentiality conditions.</span>
                  </label>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 2: Enterprise Profile */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Enterprise Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('profile', 'enterpriseName', 'Enterprise name', 'text')}
                  {renderField('profile', 'tradingName', 'Trading name, if different', 'text')}
                  {renderField('profile', 'yearEst', 'Year established', 'number')}
                  {renderField('profile', 'district', 'District', 'select', KASHMIR_DISTRICT_NAMES)}
                  {renderField('profile', 'tehsil', 'Tehsil or town', 'text')}
                  {renderField('profile', 'locality', 'Village, locality, or cluster', 'text')}
                </div>

                {renderField('profile', 'legalStructure', 'What is the legal or operational form of the enterprise?', 'select', [
                  'Sole proprietorship', 'Partnership', 'Private limited company', 'Public limited company', 'Producer company', 'Cooperative', 'Society', 'Trust', 'Self-help group enterprise', 'Family enterprise', 'Informal manufacturing unit', 'Home-based production enterprise', 'Unregistered workshop', 'Other'
                ])}
                
                {renderField('profile', 'registrations', 'Which registrations apply?', 'multiselect', [
                  'Business registration', 'Udyam or MSME registration', 'GST registration', 'Import Export Code', 'Handicrafts registration', 'GI authorization', 'Cooperative registration', 'Factory or workshop registration', 'Labour registration', 'Export promotion council membership', 'Chamber or trade association membership', 'None', 'Unsure'
                ])}
                
                {renderField('profile', 'scale', 'Enterprise Scale (Full-time employees)', 'select', ['1–5', '6–10', '11–25', '26–50', '51–100', '101–250', 'More than 250'])}
                
                {renderField('profile', 'ownership', 'Ownership characteristics', 'multiselect', ['Family-owned', 'Artisan-owned', 'Women-owned or women-led', 'Youth-led', 'Cooperative-owned', 'Investor-owned', 'Exporter-owned', 'Manufacturer-exporter integrated enterprise'])}
                
                {renderField('profile', 'primaryCraft', 'Primary Craft Category', 'select', ['Carpet', 'Pashmina', 'Kani', 'Sozni', 'Crewel', 'Chain stitch', 'Papier-mâché', 'Walnut wood carving', 'Namdah', 'Gabba', 'Willow work', 'Copperware', 'Silverware', 'Woodwork', 'Textiles', 'Shawls', 'Furnishings', 'Accessories', 'Home décor', 'Mixed handicrafts', 'Other'])}

                {renderField('profile', 'productLines', 'Product lines (e.g. Shawls, Carpets, Bags)', 'textarea')}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Production Model */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Production Model & Capacity</h2>

                {renderField('production', 'model', 'Which production model best describes the enterprise?', 'multiselect', [
                  'Production within an owned workshop', 'Production through home-based artisans', 'Production through independent contractors', 'Production through master artisans', 'Production through cooperatives', 'Production through multiple subcontracting layers', 'Made-to-order production', 'Inventory-based production', 'Seasonal production', 'Export-order production', 'Custom commission production', 'Mixed model'
                ])}
                
                {renderField('production', 'ownership', 'Ownership of production stages', 'radio', [
                  'Enterprise performs all stages internally', 'Enterprise performs major stages internally', 'Enterprise outsources selected processes', 'Enterprise outsources most production', 'Enterprise primarily coordinates and markets production', 'Enterprise functions mainly as an aggregator'
                ])}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('production', 'maxCapacity', 'Approx. max monthly capacity', 'text')}
                  {renderField('production', 'avgCapacity', 'Avg monthly production (last 12m)', 'text')}
                  {renderField('production', 'unit', 'Main unit of measurement', 'text')}
                </div>
                
                {renderField('production', 'capacityUtil', 'Percentage of capacity currently utilized', 'select', ['Below 25%', '25–49%', '50–74%', '75–89%', '90–100%', 'Above normal capacity', 'Unable to estimate'])}
                
                {renderField('production', 'trend', 'Compared with three years ago, production volume has:', 'radio', ['Increased significantly', 'Increased slightly', 'Remained broadly similar', 'Decreased slightly', 'Decreased significantly', 'Unable to estimate'])}
                
                {renderField('production', 'orderStructure', 'What share of production is made against confirmed orders?', 'select', ['Less than 25%', '25–49%', '50–74%', '75–100%'])}
                
                {renderField('production', 'constraints', 'Capacity constraints (factors preventing full utilization)', 'multiselect', [
                  'Insufficient orders', 'Raw-material shortage', 'Working-capital shortage', 'Labour shortage', 'Skilled-artisan shortage', 'Equipment limitations', 'Electricity', 'Workspace', 'Quality problems', 'Transport', 'Seasonal demand', 'Export barriers', 'Regulatory burden'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Workforce */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Workforce & Artisan Engagement</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('workforce', 'permWorkers', 'Permanent employees', 'number')}
                  {renderField('workforce', 'tempWorkers', 'Temporary / seasonal workers', 'number')}
                  {renderField('workforce', 'homeWorkers', 'Home-based workers', 'number')}
                  {renderField('workforce', 'contractWorkers', 'Contract workers', 'number')}
                </div>

                {renderField('workforce', 'directEngagement', 'What proportion of production workers are directly engaged by the enterprise?', 'radio', ['All', 'Most', 'About half', 'A minority', 'None', 'Unable to estimate'])}
                
                {renderField('workforce', 'subcontractingLayers', 'How many subcontracting layers may exist between the enterprise and the artisan?', 'radio', ['None', 'One', 'Two', 'Three or more', 'Unknown'])}
                
                {renderField('workforce', 'paymentModels', 'Which payment models apply?', 'multiselect', ['Monthly salary', 'Daily wage', 'Weekly wage', 'Piece rate', 'Per-order payment', 'Commission', 'Family profit share', 'Contractor-managed payment', 'Mixed'])}
                
                {renderField('workforce', 'paymentDirect', 'Are workers paid directly by the enterprise?', 'radio', ['Yes, all', 'Most', 'No, mostly via contractors'])}
                
                {renderField('workforce', 'pieceRateTransparency', 'If piece-rate is used, are rates documented and agreed before production?', 'radio', ['Yes, fully documented', 'Verbally agreed', 'Determined after production', 'Not applicable'])}
                
                {renderField('workforce', 'rejectionRate', 'Percentage of work rejected or returned', 'select', ['Below 2%', '2–5%', '6–10%', '11–20%', 'Above 20%', 'Not measured'])}
                
                {renderField('workforce', 'socialProtection', 'Social protection and welfare provided/facilitated', 'multiselect', ['Health insurance', 'Accident insurance', 'Pension', 'Paid leave', 'Maternity support', 'Sick leave', 'Provident fund', 'Worker registration', 'Artisan cards', 'Access to government welfare schemes', 'None'])}
                
                {renderField('workforce', 'workingConditions', 'Working conditions (Facilities available)', 'multiselect', ['Workspace safety', 'Ventilation', 'Lighting', 'Heating', 'Sanitation', 'Drinking water', 'Fire safety', 'Protective equipment', 'Ergonomics', 'Emergency preparedness', 'First aid', 'Occupational-health awareness'])}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('workforce', 'apprenticesCount', 'Number of apprentices', 'number')}
                  {renderField('workforce', 'apprenticeshipStipend', 'Do apprentices receive stipends?', 'select', ['Yes', 'No', 'Not applicable'])}
                </div>
                
                {renderField('workforce', 'challenges', 'Workforce challenges', 'multiselect', ['Shortage of skilled artisans', 'Ageing workforce', 'Youth unwilling to enter the craft', 'Migration', 'High labour cost', 'Low productivity', 'Training gaps', 'High worker turnover', 'Seasonal availability', 'Gender-related access barriers', 'Lack of master artisans'])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Raw Materials */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Raw Materials & Supply Chain</h2>

                {renderField('materials', 'main', 'Main raw materials used', 'multiselect', ['Pashmina fibre', 'Wool', 'Silk', 'Cotton', 'Yarn', 'Dyes', 'Wood', 'Walnut wood', 'Willow', 'Copper', 'Silver', 'Papier-mâché inputs', 'Adhesives', 'Lacquer', 'Packaging materials'])}
                
                {renderField('materials', 'supplierConcentration', 'Supplier concentration for primary materials', 'radio', ['One primary supplier', 'Two suppliers', 'Three to five', 'More than five', 'Purchased through open market', 'Buyer-controlled supply', 'Contractor-controlled supply'])}
                
                {renderField('materials', 'costTrend', 'Compared with three years ago, raw-material costs have:', 'radio', ['Decreased significantly', 'Decreased slightly', 'Remained stable', 'Increased slightly', 'Increased significantly', 'Unable to estimate'])}
                
                {renderField('materials', 'verification', 'Raw-material verification practices', 'multiselect', ['Origin documented', 'Fibre/material testing used', 'Supplier invoices retained', 'Batch-level traceability maintained', 'Buyer specifies the material', 'Have encountered counterfeit materials', 'Accessible laboratory testing'])}
                
                {renderField('materials', 'disruptions', 'Supply-chain disruptions experienced', 'multiselect', ['Road closures', 'Political disruption', 'Internet shutdowns', 'Extreme weather', 'Freight delays', 'Supplier closure', 'Import restrictions', 'Price shocks', 'Payment constraints'])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Quality & Compliance */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Quality, Authenticity & Compliance</h2>

                {renderField('quality', 'controlSystem', 'How is product quality checked?', 'multiselect', ['Artisan self-check', 'Master artisan review', 'Workshop supervisor', 'Dedicated quality-control employee', 'Buyer inspection', 'Exporter inspection', 'Laboratory testing', 'Third-party certification', 'No formal quality-control process'])}
                
                {renderField('quality', 'authenticity', 'Authenticity and GI systems', 'multiselect', ['Produces GI-covered products', 'Enterprise is GI-authorized', 'GI labels are used', 'Product serial numbers used', 'Artisan identity recorded', 'Production location recorded', 'Material declarations provided', 'Authenticity documentation given to buyers', 'Digital traceability used'])}
                
                {renderField('quality', 'counterfeit', 'Encountered counterfeit or mislabelling issues?', 'multiselect', ['Machine-made goods sold as handmade', 'Non-Kashmir products sold as Kashmir crafts', 'Synthetic materials sold as natural', 'False pashmina claims', 'Copied designs', 'Unauthorized use of enterprise brand', 'Unauthorized GI labels', 'Online counterfeit listings', 'False country-of-origin declarations'])}
                
                {renderField('quality', 'certifications', 'Current certifications and standards', 'multiselect', ['GI authorization', 'Handicraft certification', 'Quality certification', 'Organic or natural-material certification', 'Fair-trade certification', 'Social compliance', 'Environmental certification', 'Export-market certification', 'Buyer-specific standard', 'None'])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Markets & Finance */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Markets, Orders & Finance</h2>

                {renderField('markets', 'channels', 'Market channels used during the last 12 months', 'multiselect', ['Local wholesale', 'Local retail', 'Retail outside Kashmir', 'Domestic distributors', 'Exporters', 'Direct export', 'Government emporia', 'Institutional procurement', 'Tourism market', 'Exhibitions and fairs', 'Own retail outlet', 'Own website', 'Online marketplaces', 'Social media', 'Private-label manufacturing', 'Corporate gifting', 'Interior design or hospitality sector'])}
                
                {(consultationData.markets?.channels?.includes('Direct export') || consultationData.markets?.channels?.includes('Exporters')) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-brand-dark mb-4">Export Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {renderField('markets', 'exportCountries', 'Countries served', 'text')}
                      {renderField('markets', 'exportValue', 'Export value band', 'select', ['Below ₹10 lakh', '₹10–50 lakh', '₹50 lakh–₹1 crore', 'Above ₹1 crore'])}
                    </div>
                    {renderField('markets', 'exportBarriers', 'Main export barriers', 'textarea')}
                  </div>
                )}
                
                {renderField('markets', 'buyerConcentration', 'What share of annual sales comes from the largest buyer?', 'select', ['Less than 10%', '10–24%', '25–49%', '50–74%', '75% or more', 'Unable to estimate'])}
                
                {renderField('markets', 'paymentCycle', 'Typical buyer-payment period', 'select', ['Advance', 'On delivery', 'Within 7 days', '8–30 days', '31–60 days', '61–90 days', 'More than 90 days'])}
                
                {renderField('markets', 'workingCapital', 'Working capital adequacy', 'radio', ['Sufficient', 'Usually sufficient', 'Sometimes insufficient', 'Frequently insufficient', 'Critically insufficient'])}
                
                {renderField('markets', 'financeSources', 'Sources of finance used', 'multiselect', ['Owner funds', 'Family funds', 'Bank loan', 'Working-capital facility', 'Government scheme', 'Cooperative credit', 'Buyer advance', 'Export finance', 'Informal borrowing', 'Supplier credit', 'Investor funding', 'Grant'])}
                
                {renderField('markets', 'financeBarriers', 'Barriers to finance', 'multiselect', ['Collateral', 'Interest rate', 'Documentation', 'Credit history', 'Lack of formal registration', 'Seasonal income', 'Long buyer-payment cycle', 'Limited bank understanding of crafts', 'Loan size insufficient', 'Application delays', 'Rejection without explanation', 'Religious or ethical financing concerns'])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Tech & Risk */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Technology, Sustainability & Risks</h2>

                {renderField('tech', 'use', 'Technology used in enterprise', 'multiselect', ['Inventory software', 'Accounting software', 'Customer relationship management', 'E-commerce', 'Digital payments', 'Production planning', 'Barcode system', 'QR traceability', 'Computer-aided design', 'Digital catalogues', 'Product photography', 'Enterprise resource planning', 'AI-assisted design or content', 'None'])}
                
                {renderField('tech', 'environmental', 'Environmental practices and monitoring', 'multiselect', ['Water use', 'Energy use', 'Fuel use', 'Dye discharge', 'Chemical use', 'Wood sourcing', 'Fibre sourcing', 'Packaging waste', 'Production waste', 'Recycling', 'Wastewater', 'Air quality', 'Worker exposure'])}
                
                {renderField('tech', 'risks', 'Select the most significant enterprise risks (up to 5)', 'multiselect', ['Demand decline', 'Raw-material inflation', 'Skilled-artisan shortage', 'Buyer concentration', 'Payment delays', 'Debt', 'Counterfeit products', 'Export disruption', 'Tourism dependence', 'Political instability', 'Infrastructure', 'Technology gap', 'Regulatory burden', 'Climate or disaster risk', 'Loss of traditional skills', 'Competition from machine-made products'])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'govPriorities', 'Select priority areas for government intervention', 'multiselect', ['Working-capital finance', 'Raw-material support', 'Common facility centres', 'Testing laboratories', 'GI enforcement', 'Counterfeit control', 'Export facilitation', 'Logistics support', 'Artisan social protection', 'Skill development', 'Apprenticeship support', 'Design support', 'Digital-commerce support', 'Infrastructure', 'Cluster development', 'Simplified registration', 'Public procurement', 'Market intelligence', 'Environmental compliance support'])}
                
                {renderField('recommendations', 'highestPriority', 'What is the single highest priority?', 'text')}
                
                {renderField('recommendations', 'industryResp', 'What should the industry (manufacturers, buyers) prioritize?', 'multiselect', ['Fair artisan rates', 'Timely payments', 'Written contracts', 'Transparent deductions', 'Traceability', 'Authentic materials', 'Product-quality standards', 'Long-term buyer commitments', 'No design copying', 'Worker safety', 'Skills investment', 'Environmental responsibility', 'Shared market intelligence'])}
                
                {renderField('recommendations', 'action12m', 'What one action could materially improve your enterprise and its artisan network within the next 12 months?', 'textarea')}
                
                {renderField('recommendations', 'action3y', 'What structural reform is most important for the handicrafts manufacturing sector during the next 3 to 5 years?', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence & Documentation</h3>
                  <p className="text-sm text-gray-600 mb-4">You may upload records, photographs, documents, or other evidence that supports your response (e.g. Business registration, Production records, Export documents, GI authorization).</p>
                  
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-4">
                    <p className="text-xs font-bold text-orange-800 uppercase">Important Security Warning</p>
                    <p className="text-sm text-orange-700 mt-1">Remove or redact bank details, tax identifiers, employee identity numbers, signatures, personal addresses, private buyer information, and any unrelated commercially sensitive information before uploading.</p>
                  </div>

                  <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-brand-primary text-icon-on-light rounded-xl font-bold hover:bg-brand-primary hover:text-white transition">
                    <FaUpload /> Upload Evidence Files
                  </button>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-6 space-y-3">
                      {uploadedFiles.map((uf, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200">
                          <span className="text-sm font-bold text-gray-800 flex items-center gap-2"><FaFileAlt data-ui-icon  className=""/> {uf.file.name}</span>
                          <button onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700"><FaTimes /></button>
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
                </div>

                <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
                  <button onClick={() => setStep(9)} className="flex items-center gap-2 px-6 py-3 rounded-[14px] font-bold transition bg-gray-100 text-gray-700 hover:bg-gray-200">
                    <FaArrowLeft /> Back to Editing
                  </button>
                  <button onClick={async () => {
                      try {
                        const payload = {
                          participantType: "Manufacturer",
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
