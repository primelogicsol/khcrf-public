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
  return `SKC-2026-TOU-${result}`;
};

export default function TourismPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_tou_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_tou_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_tou_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_tou_consultationData', JSON.stringify(consultationData));
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
  const isProfileValid = consultationData.profile?.orgType && consultationData.profile?.primaryFocus;
  const isProductsValid = consultationData.products?.visitorProfile;
  const isCraftValid = consultationData.craft?.communityBenefits;
  const isTechValid = consultationData.tech?.marketingChannels;
  const isInfrastructureValid = consultationData.infrastructure?.destinationChallenges;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isVisionValid = consultationData.vision?.vision2030;
  const isRecommendationsValid = consultationData.recommendations?.gov;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isProductsValid, isCraftValid, isTechValid, isInfrastructureValid, isChallengesValid, isVisionValid, isRecommendationsValid];
  const stepsCompleted = sectionsStatus.filter(Boolean).length;
  const progressPercent = Math.min(100, Math.floor((stepsCompleted / 9) * 100));

  const orgType = consultationData.profile?.orgType;
  const isAccommodation = ['Hotel', 'Resort', 'Houseboat', 'Homestay', 'Guest House', 'Eco-lodge'].includes(orgType);
  const isTourOperator = ['Tour Operator', 'Tourist Guide', 'Travel Agency'].includes(orgType);
  const isDMO = ['Destination Management Organization', 'Tourism Board'].includes(orgType);
  const isHeritageWalk = orgType === 'Heritage Walk Organization';
  const isFestival = orgType === 'Festival Organizer';
  const isResearch = orgType === 'Tourism Research Organization';

  const hasCraftFocus = consultationData.profile?.primaryFocus?.includes('Craft Tourism') || consultationData.products?.services?.includes('Craft Demonstrations') || consultationData.products?.experiences?.includes('Artisan Visits') || consultationData.products?.experiences?.includes('Workshops');

  return (
    <div className="animate-fade-in">
       {step < 11 && (
         <div className="bg-brand-dark pt-32 pb-16 relative overflow-hidden">
           
           <div className="container mx-auto px-4 relative z-10 text-center">
             <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-brand-secondary uppercase border border-brand-secondary/30 rounded-[12px]">
               COMMUNICATION & TOURISM CONSULTATION
             </span>
             <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Participation Portal</h1>
             
             <div className="max-w-4xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
               <div className="flex items-center gap-4 text-left mb-4 md:mb-0">
                 <div className="bg-brand-primary/20 text-brand-secondary px-3 py-1 rounded-[10px] text-xs font-black uppercase tracking-wider border border-brand-secondary/30">
                   Tourism Stakeholder
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
                      <p>It is designed to map the tourism value chain and understand how the visitor economy interacts with Kashmir's handicrafts ecosystem. This is not a tourism rating platform or business registration.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'respondentRole', 'Respondent Role', 'select', [
                  'Owner', 'Director', 'Tourism Manager', 'Tour Operator', 'Guide', 'Hospitality Manager', 'Destination Manager', 'Marketing Manager', 'Event Organizer', 'Association Representative', 'Government Tourism Officer', 'Researcher', 'Authorized Representative', 'Other'
                ])}
                
                {renderField('consent', 'submissionType', 'Submission Type', 'radio', [
                  'Official Organizational Response',
                  'Regional Office Response',
                  'Personal Professional Perspective'
                ])}
                
                {renderField('consent', 'identity', 'Submission confidentiality preference', 'radio', [
                  'Organization may be publicly identified in tourism reports',
                  'Organization name must remain confidential, but inputs can be used',
                  'Submission may be used only in anonymized, aggregate analysis'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact you regarding future craft tourism networks or destination planning?', 'radio', ['Yes', 'No'])}

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
                    <span className="text-sm font-bold text-gray-700">I confirm my authority to submit these perspectives on behalf of the organization.</span>
                  </label>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 2: Tourism Profile */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Tourism Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('profile', 'orgName', 'Organization Name', 'text')}
                  {renderField('profile', 'yearsOperating', 'Years Operating', 'select', [
                    '0-2 years', '3-5 years', '6-10 years', '11-20 years', '20+ years'
                  ])}
                </div>
                
                {renderField('profile', 'orgType', 'Organization Type', 'select', [
                  'Tour Operator', 'Travel Agency', 'Hotel', 'Resort', 'Houseboat', 'Homestay', 'Guest House', 'Eco-lodge', 'Tourist Guide', 'Destination Management Organization', 'Tourism Board', 'Heritage Walk Organization', 'Craft Village', 'Festival Organizer', 'Hospitality Business', 'Airline', 'Transport Provider', 'Tourism Research Organization', 'NGO', 'Other'
                ])}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {renderField('profile', 'country', 'Country', 'text')}
                  {renderField('profile', 'state', 'State', 'text')}
                  {renderField('profile', 'district', 'District', 'text')}
                </div>
                
                {renderField('profile', 'website', 'Website', 'text')}

                {renderField('profile', 'primaryFocus', 'Primary Tourism Focus', 'multiselect', [
                  'Leisure Tourism', 'Cultural Tourism', 'Heritage Tourism', 'Craft Tourism', 'Eco Tourism', 'Rural Tourism', 'Religious Tourism', 'Adventure Tourism', 'Educational Tourism', 'Luxury Tourism', 'Community Tourism', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Tourism Products & Visitor Experience */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Tourism Products & Visitor Experience</h2>

                {renderField('products', 'visitorProfile', 'Visitor Profile', 'multiselect', [
                  'Local Visitors', 'Domestic Tourists', 'International Tourists', 'Students', 'Researchers', 'Luxury Travelers', 'Backpackers', 'Families', 'Business Travelers', 'Other'
                ])}
                
                {renderField('products', 'services', 'Tourism Services Provided', 'multiselect', [
                  'Guided Tours', 'Accommodation', 'Transport', 'Heritage Walks', 'Museum Visits', 'Craft Demonstrations', 'Workshops', 'Shopping Tours', 'Festivals', 'Food Experiences', 'Other'
                ])}

                {renderField('products', 'purchaseFreq', 'How often do visitors purchase handicrafts?', 'radio', [
                  'Very Frequently', 'Frequently', 'Occasionally', 'Rarely', 'Never', 'Unknown'
                ])}
                
                {renderField('products', 'experiences', 'Popular Craft Experiences', 'multiselect', [
                  'Artisan Visits', 'Live Demonstrations', 'Museums', 'Workshops', 'Shopping', 'Cultural Performances', 'Heritage Walks', 'Other'
                ])}

                {/* Conditional Branching */}
                {isAccommodation && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Accommodation & Guest Experience</h3>
                    {renderField('products', 'accommodationFocus', 'How do you integrate local handicrafts into your hotel decor, boutiques, or guest welcome experiences?', 'textarea')}
                  </div>
                )}
                
                {isTourOperator && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Tour Operations & Itineraries</h3>
                    {renderField('products', 'tourFocus', 'Describe how craft-related activities are structured within your tour itineraries and how artisans are compensated.', 'textarea')}
                  </div>
                )}
                
                {isHeritageWalk && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Heritage Interpretation</h3>
                    {renderField('products', 'walkFocus', 'How do you weave the history of Kashmir\'s craft guilds into your heritage walks and storytelling?', 'textarea')}
                  </div>
                )}
                
                {isFestival && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Event Programming</h3>
                    {renderField('products', 'festivalFocus', 'How do you measure the economic impact of your festival/event directly on local artisans?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Craft Tourism & Community Engagement */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Craft Tourism & Community Engagement</h2>

                {!hasCraftFocus ? (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Integrating Craft Tourism</h3>
                    {renderField('craft', 'futureIntegration', 'Since you do not currently offer craft-related experiences, what are the primary barriers, and how might you integrate them in the future?', 'textarea')}
                  </div>
                ) : (
                  <>
                    {renderField('craft', 'worksWith', 'Do you work with:', 'multiselect', [
                      'Artisans', 'Cooperatives', 'Manufacturers', 'Museums', 'NGOs', 'Government', 'Universities', 'Local Communities', 'Heritage Organizations', 'Other'
                    ])}
                  </>
                )}
                
                {renderField('craft', 'communityBenefits', 'Community Benefits from your Tourism Operations', 'multiselect', [
                  'Employment', 'Income', 'Cultural Preservation', 'Youth Engagement', 'Women Empowerment', 'Entrepreneurship', 'Heritage Conservation', 'Environmental Awareness', 'Other'
                ])}
                
                {renderField('craft', 'visitorInterests', 'Top Visitor Interests (Select leading drivers)', 'multiselect', [
                  'Authenticity', 'Local Culture', 'Handicrafts', 'Food', 'Nature', 'History', 'Festivals', 'Workshops', 'Sustainability', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Marketing, Technology & Sustainability */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Marketing, Technology & Sustainability</h2>

                {renderField('tech', 'marketingChannels', 'Marketing Channels', 'multiselect', [
                  'Website', 'Instagram', 'Facebook', 'YouTube', 'Travel Platforms', 'Print', 'Television', 'Influencers', 'Email', 'Tourism Fairs', 'Other'
                ])}
                
                {renderField('tech', 'digitalTech', 'Digital Technologies Used', 'multiselect', [
                  'Online Booking', 'Mobile Apps', 'QR Codes', 'Virtual Tours', 'GIS', 'AI', 'Digital Maps', 'AR', 'VR', 'Analytics', 'Other'
                ])}
                
                {renderField('tech', 'aiUsage', 'AI Usage', 'multiselect', [
                  'Marketing', 'Translation', 'Customer Support', 'Trip Planning', 'Recommendation Systems', 'Visitor Analytics', 'Not Using AI'
                ])}
                
                {renderField('tech', 'sustainability', 'Sustainability Practices', 'multiselect', [
                  'Waste Reduction', 'Water Conservation', 'Renewable Energy', 'Eco-friendly Transport', 'Local Procurement', 'Climate Adaptation', 'Biodiversity Protection', 'Plastic Reduction', 'Other'
                ])}

                {/* Conditional Branching */}
                {(consultationData.tech?.digitalTech?.includes('AI') || !consultationData.tech?.aiUsage?.includes('Not Using AI')) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">AI & Digital Transformation</h3>
                    {renderField('tech', 'aiFocus', 'How has AI or advanced analytics shifted your understanding of visitor preferences or optimized your marketing?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Infrastructure & Destination Management */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Infrastructure & Destination Management</h2>

                {renderField('infrastructure', 'needs', 'Infrastructure Needs', 'multiselect', [
                  'Roads', 'Parking', 'Public Toilets', 'Signage', 'Internet', 'Interpretation Centres', 'Visitor Centres', 'Museums', 'Craft Villages', 'Public Transport', 'Safety', 'Accessibility', 'Other'
                ])}
                
                {renderField('infrastructure', 'destinationChallenges', 'Destination Challenges', 'multiselect', [
                  'Overcrowding', 'Waste', 'Traffic', 'Seasonality', 'Climate', 'Poor Infrastructure', 'Limited Marketing', 'Weak Coordination', 'Lack of Craft Experiences', 'Other'
                ])}
                
                {renderField('infrastructure', 'coordination', 'How effective is coordination among tourism stakeholders?', 'radio', [
                  'Excellent', 'Good', 'Moderate', 'Limited', 'Poor'
                ])}

                {/* Conditional Branching */}
                {isDMO && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Destination Management & Policy</h3>
                    {renderField('infrastructure', 'dmoFocus', 'How do you balance high-volume tourism demand with the preservation of sensitive cultural and heritage sites?', 'textarea')}
                  </div>
                )}
                
                {isResearch && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Tourism Research & Data</h3>
                    {renderField('infrastructure', 'researchFocus', 'What are the most critical gaps in current visitor economy data regarding cultural and craft tourism?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Challenges & Opportunities */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Challenges & Opportunities</h2>

                {renderField('challenges', 'topChallenges', 'Top Five Challenges', 'multiselect', [
                  'Seasonality', 'Limited Craft Tourism', 'Weak Branding', 'Infrastructure', 'Marketing', 'Climate Change', 'Digital Skills', 'Visitor Awareness', 'Funding', 'Coordination', 'Heritage Preservation', 'Workforce Skills', 'Other'
                ])}
                
                {renderField('challenges', 'opportunity', 'What is the biggest opportunity for Kashmir tourism? (Open response)', 'textarea')}
                
                {renderField('challenges', 'priorityAreas', 'Priority Areas for Sector Development', 'multiselect', [
                  'Craft Tourism', 'Heritage Tourism', 'Rural Tourism', 'Community Tourism', 'Women\'s Tourism Enterprises', 'Youth Tourism', 'Digital Tourism', 'International Promotion', 'Sustainability', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Future Vision */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Future Vision</h2>

                {renderField('vision', 'vision2030', 'Vision for Tourism & Crafts by 2030-2040', 'textarea')}
                
                {renderField('vision', 'interestedIn', 'Interested In Participating In:', 'multiselect', [
                  'Craft Tourism Network', 'Heritage Tourism Alliance', 'Tourism Innovation Lab', 'Destination Observatory', 'Sustainable Tourism Network', 'Annual Tourism Forum', 'Digital Tourism Platform', 'International Promotion', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'gov', 'Recommendations for Government & DMOs', 'textarea')}
                {renderField('recommendations', 'industry', 'Recommendations for Hotels, Tour Operators & Tech Companies', 'textarea')}
                {renderField('recommendations', 'community', 'Recommendations for Artisans, NGOs & Museums', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence & Documentation Upload</h3>
                  <p className="text-sm text-gray-600 mb-4">Stakeholders may upload Tourism Reports, Visitor Surveys, Marketing Material, Itineraries, Brochures, Visitor Analytics, Sustainability Reports, or Event Documentation.</p>
                  
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
                              <option>Tourism Report / Analytics</option>
                              <option>Marketing Material / Brochure</option>
                              <option>Tour Itinerary</option>
                              <option>Visitor Survey</option>
                              <option>Sustainability Report</option>
                              <option>Event Documentation / Photos</option>
                              <option>Other</option>
                            </select>
                            <input type="text" placeholder="Title / Year" className="text-xs p-2 border border-gray-300 rounded w-full" />
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
                  <p className="text-gray-600 text-lg">Your tourism stakeholder consultation response is ready. Please review the details before submitting.</p>
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
                      <span className={isProductsValid ? "text-green-600" : "text-gray-400"}>Products</span>
                      <span className={isCraftValid ? "text-green-600" : "text-gray-400"}>Craft Tourism</span>
                      <span className={isTechValid ? "text-green-600" : "text-gray-400"}>Tech/Mktg</span>
                      <span className={isInfrastructureValid ? "text-green-600" : "text-gray-400"}>Infrastructure</span>
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
                          participantType: "Tourism",
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
