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
  return `SKC-2026-ONS-${result}`;
};

export default function OnlineSellerPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_ons_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_ons_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_ons_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_ons_consultationData', JSON.stringify(consultationData));
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
  const isProfileValid = consultationData.profile?.businessName && consultationData.profile?.type;
  const isChannelsValid = consultationData.channels?.categories && consultationData.channels?.primary;
  const isMarketingValid = consultationData.marketing?.customerTypes && consultationData.marketing?.acquisition;
  const isFulfillmentValid = consultationData.fulfillment?.model && consultationData.fulfillment?.paymentMethods;
  const isTrustValid = consultationData.trust?.authenticity;
  const isTechValid = consultationData.tech?.challenges;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isRecommendationsValid = consultationData.recommendations?.govPriorities;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isChannelsValid, isMarketingValid, isFulfillmentValid, isTrustValid, isTechValid, isChallengesValid, isRecommendationsValid];
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
                   Online Seller Consultation Instrument
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
                      <p className="mb-2">This consultation forms part of the State of Kashmir Crafts Assessment 2026–2027 initiative led by the Hamadan Craft Revival Foundation. It seeks evidence about digital commerce, online marketplaces, customer behaviour, fulfillment, marketing, authenticity, and future opportunities for Kashmir handicrafts.</p>
                      <p>Participation is voluntary. This is not an e-commerce seller onboarding form, marketplace registration, or payment gateway application.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'capacity', 'In what capacity are you submitting this response?', 'select', [
                  'Owner', 'Founder', 'Co-Founder', 'Store Manager', 'Marketplace Manager', 'Marketing Manager', 'Digital Commerce Manager', 'Operations Manager', 'Authorized Employee', 'Other'
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
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Online Business Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('profile', 'businessName', 'Business Name', 'text')}
                  {renderField('profile', 'brandName', 'Brand Name', 'text')}
                  {renderField('profile', 'yearStarted', 'Year Started', 'number')}
                  {renderField('profile', 'district', 'District (if based in Kashmir)', 'select', KASHMIR_DISTRICT_NAMES)}
                  {renderField('profile', 'website', 'Website', 'text')}
                  {renderField('profile', 'phone', 'Phone', 'text')}
                  {renderField('profile', 'email', 'Email', 'email')}
                </div>

                {renderField('profile', 'type', 'Online Business Type', 'multiselect', [
                  'Independent Website', 'Shopify', 'WooCommerce', 'Magento', 'Amazon', 'Amazon Handmade', 'Etsy', 'eBay', 'Flipkart', 'Meesho', 'Instagram Shop', 'Facebook Shop', 'WhatsApp Commerce', 'Custom Platform', 'Marketplace Aggregator', 'Other'
                ])}
                
                {renderField('profile', 'model', 'Business Model', 'multiselect', [
                  'Own Inventory', 'Dropshipping', 'Made to Order', 'Print on Demand', 'Marketplace Fulfillment', 'Self Fulfillment', 'Mixed'
                ])}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {renderField('profile', 'yearsSelling', 'Years Selling Online', 'select', ['Less than 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years'])}
                  {renderField('profile', 'teamSize', 'Team Size', 'select', ['1-2', '3-5', '6-10', '11-50', '50+'])}
                  {renderField('profile', 'annualSales', 'Annual Online Sales (Optional)', 'select', ['Below ₹10 Lakh', '₹10–50 Lakh', '₹50 Lakh–₹1 Crore', '₹1–5 Crore', 'Above ₹5 Crore'])}
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Products & Sales Channels */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Products & Sales Channels</h2>

                {renderField('channels', 'categories', 'Product Categories', 'multiselect', [
                  'Pashmina', 'Carpets', 'Shawls', 'Kani', 'Papier Mache', 'Walnut Wood', 'Copperware', 'Namdah', 'Crewel', 'Chain Stitch', 'Willow', 'Fashion', 'Home Decor', 'Accessories', 'Mixed', 'Other'
                ])}
                
                {renderField('channels', 'salesChannels', 'Sales Channels Used', 'multiselect', [
                  'Website', 'Amazon', 'Etsy', 'Flipkart', 'eBay', 'Instagram', 'Facebook', 'WhatsApp', 'Pinterest', 'Google Shopping', 'Other'
                ])}
                
                {renderField('channels', 'primary', 'Primary Sales Channel', 'select', [
                  'Website', 'Amazon', 'Etsy', 'Flipkart', 'eBay', 'Instagram', 'Facebook', 'WhatsApp', 'Pinterest', 'Google Shopping', 'Other'
                ])}
                
                <h3 className="font-bold text-gray-800 mt-6 mb-4">Inventory & Sourcing</h3>
                {renderField('channels', 'inventorySource', 'Inventory Source', 'multiselect', [
                  'Own Manufacturing', 'Manufacturers', 'Artisans', 'Cooperatives', 'Producer Groups', 'Wholesalers', 'Mixed'
                ])}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('channels', 'numSuppliers', 'Number of Suppliers', 'select', ['1-5', '6-20', '21-50', '51-100', '100+'])}
                  {renderField('channels', 'inventoryMgmt', 'Inventory Management', 'select', [
                    'Manual', 'Excel', 'POS', 'ERP', 'Inventory Software', 'Marketplace Inventory', 'Other'
                  ])}
                </div>

                {/* Conditional Logics */}
                {consultationData.profile?.type?.includes('Shopify') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Shopify Merchant Module</h3>
                    {renderField('channels', 'shopifyChallenges', 'Key challenges and best apps used on Shopify for selling handicrafts', 'textarea')}
                  </div>
                )}
                
                {(consultationData.profile?.type?.includes('Amazon') || consultationData.profile?.type?.includes('Amazon Handmade') || consultationData.channels?.salesChannels?.includes('Amazon')) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Marketplace Module: Amazon</h3>
                    {renderField('channels', 'amazonFba', 'Do you use FBA (Fulfillment by Amazon)?', 'radio', ['Yes', 'No'])}
                    {renderField('channels', 'amazonChallenges', 'What are the main challenges selling on Amazon?', 'textarea')}
                  </div>
                )}
                
                {(consultationData.profile?.type?.includes('Etsy') || consultationData.channels?.salesChannels?.includes('Etsy')) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Handmade Marketplace: Etsy</h3>
                    {renderField('channels', 'etsyVisibility', 'How do you differentiate authentic Kashmiri crafts from mass-produced items on Etsy?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Customers & Marketing */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Customers & Marketing</h2>

                {renderField('marketing', 'customerTypes', 'Customer Types', 'multiselect', [
                  'Local', 'Domestic', 'International', 'Repeat Buyers', 'Gift Buyers', 'Collectors', 'Interior Designers', 'Hotels', 'Corporate', 'Other'
                ])}
                
                {renderField('marketing', 'topCountries', 'Top Countries (if exporting)', 'textarea')}
                
                {renderField('marketing', 'acquisition', 'Customer Acquisition Channels', 'multiselect', [
                  'Organic Search', 'Google Ads', 'Facebook Ads', 'Instagram Ads', 'Influencers', 'Email Marketing', 'WhatsApp', 'Repeat Customers', 'Referrals', 'Marketplace Search', 'SEO', 'Content Marketing', 'Other'
                ])}
                
                {renderField('marketing', 'marketingSpend', 'Monthly Marketing Spend', 'select', [
                  'None', 'Below ₹10k', '₹10k - ₹50k', '₹50k - ₹2 Lakh', 'Above ₹2 Lakh'
                ])}
                
                <h3 className="font-bold text-gray-800 mt-6 mb-4">Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('marketing', 'socialPlatforms', 'Platforms Used', 'multiselect', ['Instagram', 'Facebook', 'Pinterest', 'YouTube', 'TikTok', 'X/Twitter'])}
                  {renderField('marketing', 'followers', 'Total Followers Band', 'select', ['< 1k', '1k - 10k', '10k - 50k', '50k - 100k', '100k+'])}
                </div>
                {renderField('marketing', 'postFrequency', 'Posting Frequency', 'select', ['Daily', 'Few times a week', 'Weekly', 'Rarely'])}
                
                {/* Social Commerce Condition */}
                {(!consultationData.profile?.type?.includes('Independent Website') && !consultationData.profile?.type?.includes('Shopify') && !consultationData.profile?.type?.includes('WooCommerce')) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Social Commerce Focus</h3>
                    {renderField('marketing', 'socialCommSales', 'How do you handle orders placed via Instagram/Facebook DMs or WhatsApp?', 'textarea')}
                  </div>
                )}
                
                {renderField('marketing', 'storytelling', 'Product Storytelling Elements Used', 'multiselect', [
                  'Artisan Stories', 'Videos', 'Blogs', 'Product History', 'GI Information', 'QR Codes', 'None'
                ])}
                
                {renderField('marketing', 'customerQuestions', 'Most Common Customer Questions', 'multiselect', [
                  'Authenticity', 'Shipping', 'Price', 'Material', 'Care', 'Returns', 'Origin', 'Sustainability', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Orders, Payments & Fulfillment */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Orders, Payments & Fulfillment</h2>

                {renderField('fulfillment', 'orderVol', 'Monthly Order Volume', 'select', ['< 50', '50 - 200', '201 - 1000', '1000+'])}
                
                {renderField('fulfillment', 'model', 'Fulfillment Model', 'multiselect', [
                  'Self', 'Amazon FBA', '3PL', 'Courier Partner', 'Marketplace', 'Dropshipping', 'Mixed'
                ])}
                
                {renderField('fulfillment', 'shippingArea', 'Shipping Coverage', 'radio', ['Domestic', 'International', 'Both'])}
                
                {renderField('fulfillment', 'paymentMethods', 'Payment Methods Accepted', 'multiselect', [
                  'Credit Card', 'Debit Card', 'UPI', 'PayPal', 'Stripe', 'Razorpay', 'COD', 'Bank Transfer', 'Other'
                ])}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('fulfillment', 'timeDomestic', 'Average Delivery Time (Domestic)', 'text')}
                  {renderField('fulfillment', 'timeIntl', 'Average Delivery Time (Intl)', 'text')}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('fulfillment', 'returnRate', 'Average Return Rate', 'select', ['< 2%', '2% - 5%', '6% - 10%', '11% - 20%', '> 20%'])}
                  {renderField('fulfillment', 'returnReasons', 'Main Return Reasons', 'multiselect', [
                    'Wrong Size', 'Damage', 'Quality', 'Delay', 'Customer Changed Mind', 'Other'
                  ])}
                </div>
                
                {renderField('fulfillment', 'support', 'Customer Support Channels', 'multiselect', [
                  'Email', 'Phone', 'Chat', 'WhatsApp', 'Social Media', 'AI Chatbot', 'Other'
                ])}
                
                {/* Inventory Branching */}
                {consultationData.profile?.model?.includes('Own Inventory') && !consultationData.profile?.model?.includes('Dropshipping') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Warehouse & Inventory Management</h3>
                    {renderField('fulfillment', 'warehouseIssues', 'What are your biggest inventory and warehousing challenges?', 'textarea')}
                  </div>
                )}
                
                {/* Export / International Branching */}
                {(consultationData.marketing?.customerTypes?.includes('International') || consultationData.fulfillment?.shippingArea === 'International' || consultationData.fulfillment?.shippingArea === 'Both') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">International Customs & Shipping</h3>
                    {renderField('fulfillment', 'intlChallenges', 'What are your main challenges regarding customs clearance and international shipping costs?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Customer Experience & Trust */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Customer Experience & Trust</h2>

                {renderField('trust', 'ratings', 'Average Customer Rating Band', 'select', ['4.5 - 5.0', '4.0 - 4.4', '3.0 - 3.9', 'Below 3.0', 'Not Tracked'])}
                
                {renderField('trust', 'reviews', 'Primary Source of Reviews', 'select', [
                  'Website', 'Amazon', 'Google', 'Facebook', 'Other'
                ])}
                
                {renderField('trust', 'authenticity', 'How do customers verify product authenticity?', 'multiselect', [
                  'GI', 'QR', 'Certificates', 'Supplier Documentation', 'Expert Verification', 'None'
                ])}
                
                {/* GI Condition */}
                {(consultationData.trust?.authenticity?.includes('GI') || consultationData.marketing?.storytelling?.includes('GI Information')) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">GI E-Commerce Module</h3>
                    {renderField('trust', 'giOnline', 'How do you communicate the GI tag online, and does it demonstrably increase conversion rates?', 'textarea')}
                  </div>
                )}
                
                {renderField('trust', 'trustSignals', 'Trust Signals Displayed', 'multiselect', [
                  'Verified Reviews', 'Secure Payments', 'Return Policy', 'Certificates', 'Artisan Stories', 'Videos', 'Media Coverage', 'Awards', 'Other'
                ])}
                
                {renderField('trust', 'sustainability', 'Sustainability Aspects Customers Ask About', 'multiselect', [
                  'Eco Packaging', 'Fair Trade', 'Artisan Welfare', 'Materials', 'Carbon Footprint', 'Other'
                ])}
                
                {renderField('trust', 'repeatBuyers', 'Repeat Customers (%)', 'select', ['< 10%', '10% - 30%', '31% - 50%', '> 50%'])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Digital Operations & Technology */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Digital Operations & Technology</h2>

                {renderField('tech', 'features', 'Website / Store Features', 'multiselect', [
                  'Mobile Friendly', 'Search', 'Wishlist', 'Reviews', 'Live Chat', 'Multi Currency', 'Multi Language', 'Analytics', 'AI Search', 'Recommendations', 'Other'
                ])}
                
                {/* Website Analytics Condition */}
                {(consultationData.profile?.type?.includes('Independent Website') || consultationData.profile?.type?.includes('Shopify') || consultationData.profile?.type?.includes('WooCommerce')) && (
                  <>
                    {renderField('tech', 'analytics', 'Analytics Tools Used', 'multiselect', [
                      'Google Analytics', 'Search Console', 'Marketplace Dashboard', 'Meta Analytics', 'Shopify Analytics', 'Other'
                    ])}
                  </>
                )}
                
                {renderField('tech', 'aiUsage', 'AI Usage in Business', 'multiselect', [
                  'Product Descriptions', 'Images', 'Customer Support', 'Marketing', 'SEO', 'Inventory Forecasting', 'Personalization', 'None'
                ])}
                
                {/* AI Condition */}
                {(consultationData.tech?.aiUsage?.length > 0 && !consultationData.tech?.aiUsage?.includes('None')) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">AI Adoption Insights</h3>
                    {renderField('tech', 'aiDetails', 'Describe the impact of AI tools on your digital operations.', 'textarea')}
                  </div>
                )}
                
                {renderField('tech', 'cybersecurity', 'Cybersecurity Measures', 'multiselect', [
                  'SSL', 'MFA', 'Backups', 'Fraud Detection', 'Secure Payments', 'Other'
                ])}
                
                {renderField('tech', 'challenges', 'Technology Challenges', 'multiselect', [
                  'Skills', 'Cost', 'Developers', 'Cybersecurity', 'Platform Fees', 'Analytics', 'Marketing', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Challenges & Future Growth */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Challenges & Future Growth</h2>

                {renderField('challenges', 'topChallenges', 'Top Five Challenges', 'multiselect', [
                  'Customer Acquisition', 'Advertising Cost', 'Competition', 'Counterfeit', 'Logistics', 'Returns', 'Inventory', 'Marketplace Fees', 'Technology', 'Cash Flow', 'Digital Skills', 'Trust', 'International Shipping', 'Other'
                ])}
                
                {renderField('challenges', 'opportunities', 'Growth Opportunities', 'multiselect', [
                  'Own Website', 'Marketplace Expansion', 'International Sales', 'Luxury Positioning', 'AI', 'Personalization', 'Mobile Apps', 'Social Commerce', 'B2B', 'Corporate Gifts', 'Subscription', 'Other'
                ])}
                
                {renderField('challenges', 'plans', 'Expansion Plans', 'multiselect', [
                  'New Products', 'New Markets', 'Export', 'Marketplace Expansion', 'Omnichannel', 'Physical Store', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'govPriorities', 'Top Priorities for Government Support', 'multiselect', [
                  'Digital Export', 'Marketplace Support', 'Logistics', 'Payments', 'Digital Skills', 'Branding', 'GI', 'Cybersecurity', 'Marketing', 'International Promotion', 'Other'
                ])}
                
                {renderField('recommendations', 'industry', 'What should the industry improve?', 'multiselect', [
                  'Packaging', 'Product Quality', 'Storytelling', 'Photography', 'Authenticity', 'Consistency', 'Other'
                ])}
                
                {renderField('recommendations', 'action12m', 'Immediate Action (Next 12 Months)', 'textarea')}
                {renderField('recommendations', 'reform5y', 'Long-term Reform (Next 5 Years)', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence & Documentation</h3>
                  <p className="text-sm text-gray-600 mb-4">Suggested Uploads: Website Screenshots, Marketplace Dashboards, Sales Reports, Reviews, Marketing Reports, Analytics, Catalogues, Product Photos, Certificates, GI Documents, Customer Feedback, Packaging Photos.</p>
                  
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-4">
                    <p className="text-xs font-bold text-orange-800 uppercase">Important Security Warning</p>
                    <p className="text-sm text-orange-700 mt-1">Remove or redact personal customer data (PII), sensitive financial records, passwords, API keys, and bank account numbers before uploading.</p>
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
                            <option>Website / Storefront Screenshot</option>
                            <option>Analytics / Dashboard Report</option>
                            <option>Marketing / Campaign Report</option>
                            <option>Authenticity / GI Certificates</option>
                            <option>Customer Reviews / Feedback</option>
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
                      <span className={isChannelsValid ? "text-green-600" : "text-gray-400"}>Products & Channels</span>
                      <span className={isMarketingValid ? "text-green-600" : "text-gray-400"}>Marketing</span>
                      <span className={isFulfillmentValid ? "text-green-600" : "text-gray-400"}>Orders & Fulfillment</span>
                      <span className={isTrustValid ? "text-green-600" : "text-gray-400"}>Experience & Trust</span>
                      <span className={isTechValid ? "text-green-600" : "text-gray-400"}>Digital Ops</span>
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
                          participantType: "OnlineSeller",
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
