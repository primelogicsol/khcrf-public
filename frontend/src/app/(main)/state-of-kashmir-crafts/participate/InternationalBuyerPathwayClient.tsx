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
  return `SKC-2026-IBC-${result}`;
};

export default function InternationalBuyerPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_ibc_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_ibc_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_ibc_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_ibc_consultationData', JSON.stringify(consultationData));
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
  const isProfileValid = consultationData.profile?.country && consultationData.profile?.purchaseFreq;
  const isPurchasingValid = consultationData.purchasing?.productsPurchased;
  const isEvaluationValid = consultationData.evaluation?.factors;
  const isMarketValid = consultationData.market?.problems;
  const isSustainabilityValid = consultationData.sustainability?.fairTrade;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isVisionValid = consultationData.vision?.sectors;
  const isRecommendationsValid = consultationData.recommendations?.gov;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isPurchasingValid, isEvaluationValid, isMarketValid, isSustainabilityValid, isChallengesValid, isVisionValid, isRecommendationsValid];
  const stepsCompleted = sectionsStatus.filter(Boolean).length;
  const progressPercent = Math.min(100, Math.floor((stepsCompleted / 9) * 100));

  const role = consultationData.consent?.respondentType;
  const isMuseum = role === 'Museum Buyer';
  const isDesigner = role === 'Interior Designer' || role === 'Architect';
  const isLuxury = role === 'Luxury Retail Buyer';
  const isCorporate = role === 'Corporate Procurement';
  const isCollector = role === 'Individual Collector';
  const isOnline = role === 'Online Buyer';
  const isFirstTime = consultationData.profile?.purchaseFreq === 'First Purchase';

  const isEcoImportant = ['Very Important', 'Important'].includes(consultationData.sustainability?.environmental);

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
                   International Buyer / Collector
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
                  <h2 className="text-3xl font-black text-brand-dark mb-4">Step 1: Consent & Category</h2>
                  <div className="bg-blue-50 text-blue-900 p-5 rounded-2xl border border-blue-100 flex gap-4 text-sm font-medium leading-relaxed">
                    <FaInfoCircle className="text-blue-500 text-xl shrink-0 mt-0.5" />
                    <div>
                      <p className="mb-2">This consultation forms part of the State of Kashmir Crafts Assessment 2026–2027 initiative led by the Hamadan Craft Revival Foundation.</p>
                      <p>It maps global market intelligence, collecting behaviours, and international demand. This is an evidence-based market consultation, not a procurement portal or supplier onboarding system.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'respondentType', 'Respondent Type', 'select', [
                  'Individual Collector', 'Museum Buyer', 'Gallery Owner', 'Luxury Retail Buyer', 'Interior Designer', 'Architect', 'Hospitality Buyer', 'Corporate Procurement', 'Boutique Owner', 'Art Dealer', 'Auction Specialist', 'Design Consultant', 'International Retailer', 'Online Buyer', 'Other'
                ])}
                
                {renderField('consent', 'submissionType', 'Submission Type', 'radio', [
                  'Personal Perspective',
                  'Organizational Perspective'
                ])}
                
                {renderField('consent', 'identity', 'Submission confidentiality preference', 'radio', [
                  'My name/organization may be publicly identified in market reports',
                  'Identity must remain confidential, but inputs can be used',
                  'Submission may be used only in anonymized, aggregate analysis'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact you regarding future international exhibitions or buyer networks?', 'radio', ['Yes', 'No'])}

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
                    <span className="text-sm font-bold text-gray-700">I confirm my participation in this international market mapping initiative.</span>
                  </label>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 2: Buyer / Collector Profile */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Buyer / Collector Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {renderField('profile', 'country', 'Country', 'text')}
                  {renderField('profile', 'state', 'State / Province', 'text')}
                  {renderField('profile', 'city', 'City (Optional)', 'text')}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('profile', 'yearsBuying', 'Years Buying Crafts', 'select', [
                    '0-2 years', '3-5 years', '6-10 years', '11-20 years', '20+ years'
                  ])}
                  {renderField('profile', 'primaryInterest', 'Primary Interest', 'select', [
                    'Personal Collection', 'Museum Collection', 'Interior Design', 'Retail', 'Hospitality', 'Corporate Gifts', 'Cultural Preservation', 'Investment', 'Other'
                  ])}
                </div>
                
                {renderField('profile', 'purchaseFreq', 'Purchase Frequency', 'radio', [
                  'First Purchase', 'Occasionally', 'Annually', 'Multiple Times Per Year', 'Regular Buyer'
                ])}
                
                {renderField('profile', 'discovery', 'How did you discover Kashmir handicrafts?', 'multiselect', [
                  'Museum', 'Gallery', 'Retail Store', 'Online Marketplace', 'Social Media', 'Friends', 'Designer', 'Travel', 'Trade Fair', 'Exhibition', 'Auction', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Purchasing Behaviour */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Purchasing Behaviour</h2>

                {isFirstTime ? (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">First-Time Buyer Expectations</h3>
                    {renderField('purchasing', 'firstTimeExpectations', 'Since you are a first-time buyer, what are your primary expectations and concerns regarding purchasing Kashmir crafts internationally?', 'textarea')}
                  </div>
                ) : (
                  <>
                    {renderField('purchasing', 'productsPurchased', 'Products Purchased', 'multiselect', [
                      'Pashmina', 'Carpet', 'Kani', 'Papier Mâché', 'Walnut Wood', 'Copperware', 'Sozni', 'Crewel', 'Namdah', 'Willow', 'Home Décor', 'Furniture', 'Fashion', 'Other'
                    ])}
                    
                    {renderField('purchasing', 'avgValue', 'Average Purchase Value (Range)', 'select', [
                      'Under $100', '$100 - $500', '$500 - $2,000', '$2,000 - $10,000', 'Over $10,000'
                    ])}
                    
                    {renderField('purchasing', 'channel', 'Purchase Channel', 'multiselect', [
                      'Gallery', 'Museum Shop', 'Boutique', 'Direct Artisan', 'Exporter', 'Retailer', 'Online Marketplace', 'Auction', 'Trade Fair', 'Other'
                    ])}
                    
                    {renderField('purchasing', 'purpose', 'Purpose of Purchase', 'multiselect', [
                      'Personal Use', 'Collection', 'Interior Design', 'Resale', 'Gift', 'Corporate', 'Museum', 'Investment', 'Other'
                    ])}
                  </>
                )}

                {/* Conditional Logic */}
                {isDesigner && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Design & Customization Procurement</h3>
                    {renderField('purchasing', 'designerFocus', 'How critical are customizable dimensions, color palettes, and bulk project procurement timelines to your interior design/architecture projects?', 'textarea')}
                  </div>
                )}
                
                {isCorporate && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Corporate Procurement</h3>
                    {renderField('purchasing', 'corporateFocus', 'What are your primary requirements for corporate gifting or bulk institutional procurement? (e.g., branding, volume, consistency)', 'textarea')}
                  </div>
                )}
                
                {isOnline && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Digital Commerce & E-commerce</h3>
                    {renderField('purchasing', 'onlineFocus', 'What features build your trust when buying luxury crafts online? (e.g., payment gateways, high-res images, shipping guarantees)', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Product Evaluation & Authenticity */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Product Evaluation & Authenticity</h2>

                {renderField('evaluation', 'factors', 'Most Important Buying Factors (Select top priorities)', 'multiselect', [
                  'Authenticity', 'Quality', 'Design', 'Heritage', 'Artisan Story', 'Sustainability', 'Certification', 'GI', 'Materials', 'Price', 'Exclusivity', 'Packaging', 'Shipping', 'Brand', 'Other'
                ])}
                
                {renderField('evaluation', 'verification', 'Preferred Methods of Authenticity Verification', 'multiselect', [
                  'GI Certification', 'QR Code', 'Blockchain', 'Expert Certificate', 'Laboratory', 'Artisan Profile', 'Documentation', 'Other'
                ])}
                
                {renderField('evaluation', 'premiumPricing', 'Would you pay a premium for:', 'multiselect', [
                  'Certified Authentic Products', 'Signed Artisan Pieces', 'Limited Editions', 'Museum Quality', 'Sustainability Certification', 'Heritage Documentation'
                ])}

                {/* Conditional Logic */}
                {isCollector && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Collecting & Provenance</h3>
                    {renderField('evaluation', 'collectorFocus', 'As a collector, how important is historical significance, artisan attribution, and provenance documentation to your acquisition decisions?', 'textarea')}
                  </div>
                )}
                
                {isMuseum && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Museum Acquisition</h3>
                    {renderField('evaluation', 'museumFocus', 'Detail your institution\'s acquisition policies, conservation requirements, and need for historical provenance when procuring crafts.', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Market Expectations & Experience */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Market Expectations & Experience</h2>

                <h3 className="font-bold text-gray-800 mb-4">Rate Your Experience With:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {renderField('market', 'expPackaging', 'Packaging', 'select', ['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable'])}
                  {renderField('market', 'expShipping', 'Shipping', 'select', ['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable'])}
                  {renderField('market', 'expCommunication', 'Communication', 'select', ['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable'])}
                  {renderField('market', 'expConsistency', 'Product Consistency', 'select', ['Excellent', 'Good', 'Average', 'Poor', 'Not Applicable'])}
                </div>
                
                {renderField('market', 'problems', 'Most Common Problems Encountered', 'multiselect', [
                  'Counterfeit', 'Poor Packaging', 'Delayed Shipping', 'Customs', 'Product Damage', 'Limited Information', 'Inconsistent Quality', 'Difficult Payments', 'Other'
                ])}

                {/* Conditional Logic */}
                {isLuxury && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Luxury Retail Positioning</h3>
                    {renderField('market', 'luxuryFocus', 'What specific packaging, branding, and exclusivity standards do you require to position Kashmir crafts within a luxury retail environment?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Sustainability, Innovation & Future Trends */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Sustainability, Innovation & Future Trends</h2>

                <h3 className="font-bold text-gray-800 mb-4">How important are the following?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {renderField('sustainability', 'fairTrade', 'Fair Trade / Artisan Welfare', 'select', ['Very Important', 'Important', 'Neutral', 'Not Important'])}
                  {renderField('sustainability', 'environmental', 'Environmental Sustainability', 'select', ['Very Important', 'Important', 'Neutral', 'Not Important'])}
                  {renderField('sustainability', 'women', 'Women-led Enterprises', 'select', ['Very Important', 'Important', 'Neutral', 'Not Important'])}
                </div>
                
                {renderField('sustainability', 'innovation', 'Innovation Interests', 'multiselect', [
                  'Modern Design', 'Limited Editions', 'Collaborations', 'Designer Collections', 'Smart Authentication', 'Digital Certificates', 'Virtual Showrooms', 'AI Assisted Discovery', 'Custom Orders', 'Other'
                ])}

                {/* Conditional Logic */}
                {isEcoImportant && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">ESG & Ethical Sourcing</h3>
                    {renderField('sustainability', 'ecoFocus', 'What specific environmental certifications or traceability records do you require before making a high-value purchase?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Challenges & Market Gaps */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Challenges & Market Gaps</h2>

                {renderField('challenges', 'topChallenges', 'Top Challenges for International Buyers', 'multiselect', [
                  'Counterfeit Products', 'Limited Availability', 'Authenticity', 'Shipping', 'High Prices', 'Low Product Information', 'Weak Branding', 'Limited Collections', 'Payment Issues', 'Import Barriers', 'Sustainability Information', 'Other'
                ])}
                
                {renderField('challenges', 'wishAvailable', 'Products or Services You Wish Were Available', 'textarea')}
                
                {renderField('challenges', 'marketGaps', 'Major Market Gaps', 'textarea')}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Future Demand */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Future Demand</h2>

                {renderField('vision', 'sectors', 'Which sectors have the greatest global potential for Kashmir crafts?', 'multiselect', [
                  'Luxury Home', 'Fashion', 'Hospitality', 'Museums', 'Interior Design', 'Corporate Gifts', 'Architecture', 'Art Collections', 'Tourism', 'Sustainable Products', 'Contemporary Design', 'Other'
                ])}
                
                {renderField('vision', 'participateIn', 'Would you participate in:', 'multiselect', [
                  'Buyer Advisory Council', 'Product Testing', 'Design Collaboration', 'Museum Collaboration', 'International Exhibitions', 'Collector Network', 'Digital Marketplace Advisory Group', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'gov', 'Recommendations for Government & Policymakers', 'textarea')}
                {renderField('recommendations', 'industry', 'Recommendations for Exporters, Artisans & Manufacturers', 'textarea')}
                {renderField('recommendations', 'community', 'Recommendations for Designers & Technology Companies', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence & Documentation Upload</h3>
                  <p className="text-sm text-gray-600 mb-4">Buyers and collectors may upload Collection Photographs, Product Reviews, Market Studies, Buying Guides, Exhibition Catalogues, Procurement Standards, or Design Briefs.</p>
                  
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
                              <option>Collection Photograph / Review</option>
                              <option>Market Study / Buying Guide</option>
                              <option>Exhibition Catalogue</option>
                              <option>Procurement Standards / Policy</option>
                              <option>Design Brief</option>
                              <option>Other</option>
                            </select>
                            <input type="text" placeholder="Title / Year / Country" className="text-xs p-2 border border-gray-300 rounded w-full" />
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
                  <p className="text-gray-600 text-lg">Your international buyer consultation response is ready. Please review the details before submitting.</p>
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
                      <span className={isPurchasingValid ? "text-green-600" : "text-gray-400"}>Purchasing</span>
                      <span className={isEvaluationValid ? "text-green-600" : "text-gray-400"}>Evaluation</span>
                      <span className={isMarketValid ? "text-green-600" : "text-gray-400"}>Market Exp</span>
                      <span className={isSustainabilityValid ? "text-green-600" : "text-gray-400"}>Sustainability</span>
                      <span className={isChallengesValid ? "text-green-600" : "text-gray-400"}>Challenges</span>
                      <span className={isVisionValid ? "text-green-600" : "text-gray-400"}>Future</span>
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
                          participantType: "InternationalBuyer",
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
