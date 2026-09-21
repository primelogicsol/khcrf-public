"use client";


import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  FaCheckCircle, FaFileAlt, FaVideo, FaMicrophone, 
  FaFilePdf, FaImage, FaUpload, FaChartLine, FaShareAlt,
  FaArrowRight, FaArrowLeft, FaRegCheckCircle, FaLock, FaTags,
  FaGlobe, FaUniversity, FaStore, FaLandmark, FaSeedling, FaUsers, FaBoxOpen,
  FaHammer, FaBuilding, FaLaptop, FaUserGraduate, FaFlag, FaUser, FaBookOpen, FaNewspaper, FaPlane,
  FaCalendarAlt, FaInfoCircle, FaSearch, FaCogs, FaProjectDiagram, FaDownload, FaClock, FaRobot, FaBrain,
  FaTimes
} from 'react-icons/fa';
import { KASHMIR_DISTRICT_NAMES } from '@/lib/kashmir-districts';

// Utility to generate a persistent ID
const generateConsultationId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SKC-2026-ART-${result}`;
};

export default function ArtisanPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Persistent consultation ID
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_artisan_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_artisan_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_artisan_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_artisan_consultationData', JSON.stringify(consultationData));
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

  const requiredSections = ['consent', 'profile', 'production', 'livelihood', 'markets', 'heritage', 'challenges', 'recommendations'];
  let completedRequired = 0;
  requiredSections.forEach(sec => {
      const data = consultationData[sec] || {};
      if (Object.keys(data).length > 0) completedRequired++;
  });
  
  const isConsentValid = consultationData.consent?.purpose && consultationData.consent?.voluntary && consultationData.consent?.accurate && consultationData.consent?.storage && consultationData.consent?.identity;
  const isProfileValid = consultationData.profile?.ageBand && consultationData.profile?.district && consultationData.profile?.primaryCraft && consultationData.profile?.mainRole;
  const isProductionValid = consultationData.production?.workPattern;
  const isLivelihoodValid = consultationData.livelihood?.paymentBasis;
  const isMarketsValid = consultationData.markets?.salesChannels && consultationData.markets?.salesChannels.length > 0;
  const isHeritageValid = consultationData.heritage?.youthInterest;
  const isChallengesValid = consultationData.challenges?.topThree && consultationData.challenges?.topThree.length > 0;
  const isRecommendationsValid = consultationData.recommendations?.govPriorities && consultationData.recommendations?.govPriorities.length > 0;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isProductionValid, isLivelihoodValid, isMarketsValid, isHeritageValid, isChallengesValid, isRecommendationsValid];
  const stepsCompleted = sectionsStatus.filter(Boolean).length;
  const progressPercent = Math.min(100, Math.floor((stepsCompleted / 8) * 100));

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
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files as FileList)]);
    }
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

  const renderField = (section: string, id: string, label: string, type: string, options?: string[], props?: any) => {
    const value = consultationData[section]?.[id];

    if (type === 'radio') {
       return (
         <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-4">
           <label className="block font-bold text-gray-900 mb-4">{label}</label>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             {options?.map((opt: string) => (
               <label key={opt} className="flex items-center gap-3 p-3 border border-gray-300 rounded-xl cursor-pointer bg-white hover:border-brand-primary transition">
                 <input type="radio" name={id} value={opt} checked={value === opt} onChange={() => handleChange(section, id, opt)} className="accent-brand-primary w-4 h-4" />
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

  return (
    <div className="animate-fade-in">
       {/* Top Header/Progress */}
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
                   Artisan / Weaver Pathway
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
            
            {/* STEP 1 */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-black text-brand-dark mb-4">Step 1: Consent and Participation Preferences</h2>
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-8">
                  <p className="text-gray-700 text-sm font-medium mb-4">
                    This consultation is part of the State of Kashmir Crafts Assessment 2026–2027 initiative conducted by the Hamadan Craft Revival Foundation.
                  </p>
                  <p className="text-gray-700 text-sm font-medium mb-4">
                    Your participation is voluntary. Your responses will help build an evidence-based understanding of artisan livelihoods, production conditions, market access, heritage continuity, and policy needs.
                  </p>
                  <p className="text-gray-700 text-sm font-medium">
                    You may participate by name, confidentially, or anonymously. You may skip optional questions and withdraw your submission before final publication.
                  </p>
                </div>
                
                {renderField('consent', 'identity', 'How would you like your contribution to be recorded?', 'radio', ['Named and attributable', 'Named but confidential', 'Anonymous'])}
                
                {(consultationData.consent?.identity === 'Named and attributable' || consultationData.consent?.identity === 'Named but confidential') && (
                  renderField('consent', 'fullName', 'Full Name', 'text')
                )}

                {renderField('consent', 'contactPermission', 'May KHCRF contact you if clarification is required?', 'radio', ['Yes', 'No'])}

                {consultationData.consent?.contactPermission === 'Yes' && (
                  renderField('consent', 'preferredContact', 'Preferred contact method', 'radio', ['Phone', 'Email', 'WhatsApp'])
                )}

                {renderField('consent', 'language', 'Preferred language for this consultation', 'select', ['English', 'Urdu', 'Kashmiri', 'Hindi', 'Other'])}
                {renderField('consent', 'completionMethod', 'How is this form being completed?', 'select', ['Independently by participant', 'With family assistance', 'With KHCRF field-enumerator assistance', 'By telephone interview', 'Through an institutional representative', 'Other'])}

                <div className="mt-8 space-y-3">
                  <h3 className="font-bold text-gray-900">Mandatory Consent</h3>
                  {[
                    {id: 'purpose', label: 'I understand the purpose of this consultation.'},
                    {id: 'voluntary', label: 'I understand that participation is voluntary.'},
                    {id: 'accurate', label: 'I confirm that the information provided will be accurate to the best of my knowledge.'},
                    {id: 'storage', label: 'I understand how my information will be stored and analysed.'}
                  ].map(c => (
                    <label key={c.id} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer">
                      <input type="checkbox" checked={!!consultationData.consent?.[c.id]} onChange={e => handleChange('consent', c.id, e.target.checked)} className="mt-1" />
                      <span className="text-sm font-bold text-gray-700">{c.label}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-8 space-y-3">
                  <h3 className="font-bold text-gray-900">Optional Permissions</h3>
                  {[
                    {id: 'quote', label: 'My anonymized comments may be quoted.'},
                    {id: 'publishName', label: 'My name may be published with selected comments.'},
                    {id: 'evidencePublic', label: 'My uploaded evidence may be used in the public evidence repository.'},
                    {id: 'location', label: 'I permit my location to be used in aggregate district-level analysis.'}
                  ].map(c => (
                    <label key={c.id} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer">
                      <input type="checkbox" checked={!!consultationData.consent?.[c.id]} onChange={e => handleChange('consent', c.id, e.target.checked)} className="mt-1" />
                      <span className="text-sm font-bold text-gray-700">{c.label}</span>
                    </label>
                  ))}
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-black text-brand-dark mb-4">Step 2: Artisan and Craft Profile</h2>
                {renderField('profile', 'ageBand', 'Age band', 'select', ['Under 18', '18–24', '25–34', '35–44', '45–54', '55–64', '65 and above', 'Prefer not to answer'])}
                {consultationData.profile?.ageBand === 'Under 18' && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl mb-4 text-sm font-bold text-yellow-800">
                    Note: Minor participation consent rules apply.
                  </div>
                )}
                {renderField('profile', 'district', 'District', 'select', KASHMIR_DISTRICT_NAMES)}
                {renderField('profile', 'tehsil', 'Tehsil or town', 'text')}
                {renderField('profile', 'village', 'Village, locality, or craft cluster (optional)', 'text')}
                {renderField('profile', 'ruralUrban', 'Rural or urban', 'radio', ['Rural', 'Urban'])}
                {renderField('profile', 'primaryCraft', 'What is your primary craft?', 'select', ['Carpet weaving', 'Pashmina spinning', 'Pashmina weaving', 'Kani weaving', 'Sozni embroidery', 'Aari or crewel embroidery', 'Papier-mâché', 'Walnut wood carving', 'Copperware', 'Silverware', 'Namdah', 'Gabba', 'Willow work', 'Chain-stitch embroidery', 'Wood joinery', 'Shawl finishing', 'Carpet washing', 'Natural dyeing', 'Other'])}
                {renderField('profile', 'additionalCrafts', 'Do you practice any additional crafts or production roles?', 'multiselect', ['Carpet weaving', 'Pashmina spinning', 'Pashmina weaving', 'Kani weaving', 'Sozni embroidery', 'Aari or crewel embroidery', 'Papier-mâché', 'Walnut wood carving', 'Other'])}
                {renderField('profile', 'mainRole', 'Which role best describes your main work?', 'radio', ['Master artisan', 'Independent artisan', 'Weaver', 'Spinner', 'Embroiderer', 'Carver', 'Painter', 'Finisher', 'Washer or processor', 'Designer', 'Apprentice', 'Wage worker', 'Home-based worker', 'Workshop worker', 'Other'])}
                {renderField('profile', 'yearsExperience', 'Years of experience', 'number')}
                {renderField('profile', 'learningMethod', 'Method of learning', 'select', ['Parent or family member', 'Master artisan or ustad', 'Government training programme', 'Cooperative', 'Private training centre', 'University or design institute', 'Self-taught', 'Employer', 'Other'])}
                {renderField('profile', 'certification', 'Do you hold any craft-related certificate, artisan card, GI authorization, award, or formal recognition?', 'radio', ['Yes', 'No', 'Unsure'])}
                {renderField('profile', 'workArrangement', 'How do you currently work?', 'multiselect', ['Independently', 'With family', 'For an employer', 'Through a contractor or middleman', 'Through a manufacturer', 'Through an exporter', 'Through a cooperative', 'Through a producer group', 'Through government-supported production', 'Through several arrangements', 'Other'])}
                
                {getWizardNav()}
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-black text-brand-dark mb-4">Step 3: Production and Raw Materials</h2>
                {renderField('production', 'workPattern', 'Is craft work full-time, part-time, seasonal, or occasional?', 'radio', ['Full-time', 'Part-time', 'Seasonal', 'Occasional'])}
                {renderField('production', 'daysPerMonth', 'Average working days per month', 'number')}
                {renderField('production', 'volumeChange', 'Has the volume of work increased, decreased, or remained stable compared with three years ago?', 'radio', ['Increased significantly', 'Increased slightly', 'Remained broadly similar', 'Decreased slightly', 'Decreased significantly', 'Do not know'])}
                {renderField('production', 'productionModel', 'What type of production do you mainly undertake?', 'radio', ['Made to order', 'Piece-rate production', 'Inventory production', 'Seasonal production', 'Custom commissions', 'Employer-assigned production', 'Cooperative production', 'Mixed'])}
                
                <h3 className="font-bold mt-8 mb-4">Raw-material Matrix</h3>
                <div className="overflow-x-auto mb-8">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3">Dimension</th>
                        <th className="p-3 text-center">Very good</th>
                        <th className="p-3 text-center">Good</th>
                        <th className="p-3 text-center">Fair</th>
                        <th className="p-3 text-center">Poor</th>
                        <th className="p-3 text-center">Very poor</th>
                        <th className="p-3 text-center">N/A</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['Availability', 'Affordability', 'Quality', 'Authenticity', 'Timely delivery', 'Supplier reliability'].map(dim => (
                        <tr key={dim} className="border-b">
                          <td className="p-3 font-bold">{dim}</td>
                          {['Very good', 'Good', 'Fair', 'Poor', 'Very poor', 'Not applicable'].map(opt => (
                            <td key={opt} className="p-3 text-center">
                              <input type="radio" name={`raw_${dim}`} checked={consultationData.production?.[`raw${dim}`] === opt} onChange={() => handleChange('production', `raw${dim}`, opt)} className="accent-brand-primary w-4 h-4" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {renderField('production', 'rawCostTrend', 'Compared with three years ago, raw-material costs have:', 'radio', ['Decreased significantly', 'Decreased slightly', 'Remained broadly similar', 'Increased slightly', 'Increased significantly', 'Do not know'])}
                {renderField('production', 'supplierDependence', 'How many regular raw-material suppliers do you depend on?', 'radio', ['One', 'Two', 'Three or more', 'No regular supplier', 'Supplied by employer or buyer'])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-black text-brand-dark mb-4">Step 4: Livelihood and Working Conditions</h2>
                {renderField('livelihood', 'paymentBasis', 'How are you mainly paid?', 'radio', ['Daily wage', 'Weekly wage', 'Monthly wage', 'Piece rate', 'Per completed order', 'Profit from direct sales', 'Commission', 'Mixed', 'Unpaid family work', 'Other'])}
                {renderField('livelihood', 'incomeTrend', 'Compared with three years ago, your real craft income has:', 'radio', ['Increased significantly', 'Increased slightly', 'Remained broadly similar', 'Decreased slightly', 'Decreased significantly', 'Do not know'])}
                {renderField('livelihood', 'paymentDelay', 'Typical payment delay', 'radio', ['Paid immediately', 'Within 7 days', '8–30 days', '31–60 days', 'More than 60 days', 'Payment remains outstanding', 'Not applicable'])}
                {renderField('livelihood', 'buyerDependence', 'Are you dependent on one buyer for most work?', 'radio', ['Yes', 'No'])}
                
                {renderField('livelihood', 'priceSetting', 'Who mainly determines the price or wage rate?', 'select', ['I determine it', 'Negotiated jointly', 'Buyer', 'Employer', 'Contractor or middleman', 'Manufacturer', 'Exporter', 'Cooperative', 'Government-fixed rate', 'Other'])}
                
                {(consultationData.profile?.workArrangement?.includes('For an employer')) && (
                  <div className="p-6 bg-brand-primary/5 rounded-2xl mb-4 border border-brand-primary/20">
                    <h3 className="font-bold text-brand-dark mb-4">Employer Worker Questions</h3>
                    {renderField('livelihood', 'writtenAgreement', 'Do you have a written agreement?', 'radio', ['Yes', 'No'])}
                    {renderField('livelihood', 'unfairDeductions', 'Are unfair deductions made from your wages?', 'radio', ['Frequently', 'Sometimes', 'Never'])}
                  </div>
                )}
                
                <h3 className="font-bold mt-8 mb-4">Occupational Health</h3>
                {renderField('livelihood', 'healthIssues', 'Do you experience any of the following?', 'multiselect', ['Eye strain', 'Back or neck pain', 'Joint pain', 'Respiratory problems', 'Skin irritation', 'Hearing problems', 'Hand injury', 'Stress or anxiety related to work', 'No major work-related health issue', 'Other'])}

                <h3 className="font-bold mt-8 mb-4">Welfare and Social Protection</h3>
                {renderField('livelihood', 'artisanCard', 'Artisan Card Status', 'select', ['Available and used', 'Available but not used', 'Applied but not received', 'Not available', 'Not aware'])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-black text-brand-dark mb-4">Step 5: Markets and Authenticity</h2>
                {renderField('markets', 'salesChannels', 'Through which channels did your work reach buyers during the last 12 months?', 'multiselect', ['Direct local customers', 'Tourists', 'Local retailer', 'Retailer outside Kashmir', 'Manufacturer', 'Contractor or middleman', 'Exporter', 'Cooperative', 'Government emporium', 'Exhibition or fair', 'WhatsApp', 'Social media', 'Online marketplace', 'Own website', 'Did not sell directly', 'Other'])}
                
                {consultationData.markets?.salesChannels?.includes('Online marketplace') && (
                  <div className="p-6 bg-brand-primary/5 rounded-2xl mb-4 border border-brand-primary/20">
                    <h3 className="font-bold text-brand-dark mb-4">Online Selling</h3>
                    {renderField('markets', 'onlinePlatform', 'Which platforms?', 'text')}
                  </div>
                )}

                {renderField('markets', 'smartphoneAccess', 'Do you have access to a smartphone for business?', 'radio', ['Yes', 'No'])}
                {renderField('markets', 'digitalPaymentUse', 'Do you use digital payments?', 'radio', ['Yes', 'No'])}

                <h3 className="font-bold mt-8 mb-4">Authenticity and Counterfeit Issues</h3>
                {renderField('markets', 'giAwareness', 'Awareness of GI protection', 'radio', ['High', 'Some', 'None'])}
                {renderField('markets', 'machineImitation', 'Experience with machine-made imitation reducing prices', 'radio', ['Frequently', 'Sometimes', 'Never', 'Not applicable'])}
                
                {getWizardNav()}
              </div>
            )}

            {/* STEP 6 */}
            {step === 6 && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-black text-brand-dark mb-4">Step 6: Skills, Heritage, and Continuity</h2>
                {renderField('heritage', 'trainingAnyone', 'Are you currently training anyone?', 'radio', ['Yes', 'No'])}
                {renderField('heritage', 'youthInterest', 'Are younger family or community members interested in learning this craft?', 'radio', ['Strong interest', 'Some interest', 'Very little interest', 'No interest', 'Unsure'])}
                {renderField('heritage', 'reluctanceReason', 'Why are younger people reluctant to enter the craft?', 'multiselect', ['Low income', 'Irregular work', 'Social status', 'Long training period', 'Better opportunities elsewhere', 'Lack of recognition', 'Lack of modern market access', 'Family discouragement', 'Poor working conditions', 'Migration', 'Other'])}
                {renderField('heritage', 'futureIntention', 'Do you expect to continue practicing this craft during the next five years?', 'radio', ['Definitely', 'Probably', 'Unsure', 'Probably not', 'Definitely not'])}
                
                {['Probably not', 'Definitely not'].includes(consultationData.heritage?.futureIntention) && (
                   renderField('heritage', 'influenceDecision', 'What would most influence your decision to continue?', 'textarea')
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7 */}
            {step === 7 && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-black text-brand-dark mb-4">Step 7: Challenges and Opportunities</h2>
                {renderField('challenges', 'allChallenges', 'Select all relevant challenges:', 'multiselect', ['Raw materials unavailable', 'Raw materials too expensive', 'Poor material quality', 'Inadequate tools', 'Low earnings', 'Irregular work', 'Delayed payments', 'Dependence on one buyer', 'Lack of buyers', 'Weak marketing', 'High transport cost', 'Counterfeit products', 'Lack of training', 'Youth leaving the craft', 'Difficulty accessing government schemes', 'Lack of credit', 'Occupational health problems'])}
                {renderField('challenges', 'topThree', 'Select the three most serious challenges:', 'multiselect', consultationData.challenges?.allChallenges || [])}
                {renderField('challenges', 'challengeExplanation', 'Please explain how your most serious challenge affects your work, income, family, or ability to continue the craft.', 'textarea')}
                
                {renderField('opportunities', 'topOpportunities', 'Which opportunities could most improve your income or strengthen your craft during the next three to five years?', 'multiselect', ['Direct-to-customer sales', 'Fairer pricing', 'Export access', 'Tourism-linked craft experiences', 'Online selling', 'Artisan-owned branding', 'Cooperative marketing', 'Design development', 'Raw-material banks', 'Common facility centres', 'Credit', 'Grants or subsidies', 'GI enforcement', 'Authenticity certification', 'Apprenticeship support', 'Other'])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8 */}
            {step === 8 && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-black text-brand-dark mb-4">Step 8: Recommendations</h2>
                {renderField('recommendations', 'govPriorities', 'What should government prioritize?', 'multiselect', ['Fair wage or minimum-rate mechanisms', 'Timely payment enforcement', 'Raw-material support', 'Credit', 'Health and social security', 'Artisan registration', 'GI enforcement', 'Counterfeit control', 'Training and apprenticeships', 'Common facility centres', 'Direct market access', 'Export support', 'Women artisan support', 'Digital commerce training', 'Better data and monitoring', 'Other'])}
                {renderField('recommendations', 'govExplanation', 'Please explain your most important recommendation to government.', 'textarea')}
                
                {renderField('recommendations', 'industryPriorities', 'What should buyers, manufacturers, exporters, or retailers prioritize?', 'multiselect', ['Timely payments', 'Fair prices', 'Written orders', 'Advance payments', 'Transparent deductions', 'Long-term purchasing commitments', 'Artisan recognition', 'Product traceability', 'No unauthorized design copying', 'Quality-support training', 'Better packaging support', 'Other'])}
                {renderField('recommendations', 'oneRealisticAction', 'What is one realistic action that could improve your craft or livelihood within the next 12 months?', 'textarea')}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9 */}
            {step === 9 && (
              <div className="animate-fade-in">
                <h2 className="text-3xl font-black text-brand-dark mb-4">Step 9: Evidence and Documentation</h2>
                <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-2xl p-6 mb-8 text-center">
                  <p className="font-bold text-brand-dark text-sm mb-3">Suggested Uploads:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Product photographs', 'Workshop photographs', 'Raw-material bills', 'Payment or wage records', 'Order records', 'Artisan registration', 'Training certificates', 'GI or authenticity documents'].map((item: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-white border border-brand-primary/20 rounded-[10px] text-xs font-bold text-brand-primary">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl mb-8 text-sm text-yellow-800">
                  <span className="font-bold block mb-1">Redaction warning:</span>
                  Before uploading, please remove or cover unnecessary personal information such as bank account numbers, government identification numbers, signatures, private phone numbers, and exact residential addresses.
                </div>

                <div 
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition cursor-pointer ${isDragging ? 'border-brand-primary bg-brand-primary/10' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files) {
                      setUploadedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
                    }
                  }}
                >
                  <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                  <FaUpload data-ui-icon  className={`text-4xl mx-auto mb-4 ${isDragging ? '' : 'text-gray-400'}`} />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Drag & Drop Files Here</h3>
                  <p className="text-sm text-gray-500 mb-6">or click to browse from your device</p>
                  <button type="button" className="px-6 py-2 bg-white border border-gray-300 rounded-[14px] text-sm font-bold text-gray-700 shadow-sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                    Browse Files
                  </button>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="font-bold text-gray-700 text-sm">Uploaded Files ({uploadedFiles.length})</h4>
                    {uploadedFiles.map((file: any, idx: number) => (
                      <div key={idx} className="flex flex-col gap-2 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-800">{file.name}</span>
                          <button type="button" onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))} className="text-red-500 hover:text-red-700 text-xs font-bold">Remove</button>
                        </div>
                        {/* Evidence Metadata */}
                        {renderField('evidenceMetadata', `${idx}_type`, 'Evidence type', 'select', ['Product photo', 'Document', 'Record', 'Certificate', 'Other'])}
                      </div>
                    ))}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 10: Review and Submit */}
            {step === 10 && (
              <div className="animate-fade-in py-4">
                <div className="text-center mb-10">
                  <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-primary/20">
                    <FaCheckCircle data-ui-icon  className="text-4xl " />
                  </div>
                  <h2 className="text-3xl font-black text-brand-dark mb-2">Step 10 of 10: Review and Submit</h2>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 flex flex-col items-center">
                  <h3 className="text-lg font-black text-gray-800 uppercase mb-2">Submission Completeness</h3>
                  <div className="text-4xl font-black text-brand-primary mb-2">{progressPercent}%</div>
                  <div className="w-full max-w-md bg-gray-200 rounded-full h-2">
                    <div className="bg-brand-primary h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>

                {/* Optional Summary Generation only if enough data */}
                {progressPercent > 50 && (
                  <div className="bg-white border-l-4 border-[var(--card-left-accent)] rounded-r-2xl p-6 mb-8 shadow-sm">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FaRobot data-ui-icon  className="" /> Draft Submission Summary
                    </h3>
                    <p className="text-sm text-gray-800 font-medium leading-relaxed">
                      This summary was generated from your answers. Please review it carefully. You may edit your responses before submission.
                      <br/><br/>
                      The participant is an artisan from {consultationData.profile?.district || 'Kashmir'} engaged in {consultationData.profile?.primaryCraft || 'craft'}.
                      {consultationData.challenges?.topThree?.length > 0 && ` Major challenges identified include ${consultationData.challenges.topThree[0]}.`}
                    </p>
                  </div>
                )}

                <div className="space-y-4 mb-10">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Review Your Answers</h3>
                  
                  {['consent', 'profile', 'production', 'livelihood', 'markets', 'heritage', 'challenges', 'recommendations'].map((secKey, idx) => {
                     const data = consultationData[secKey];
                     if (!data) return null;
                     return (
                       <div key={secKey} className="bg-white border border-gray-200 rounded-2xl p-6 relative">
                         <button onClick={() => setStep(idx+1)} className="absolute top-4 right-4 text-xs font-bold text-brand-secondary px-3 py-1 border border-gray-300 rounded hover:border-brand-secondary transition">Edit Section</button>
                         <h4 className="font-bold text-gray-800 uppercase text-sm mb-4">{secKey}</h4>
                         <div className="space-y-2">
                           {Object.keys(data).map(k => (
                             <div key={k} className="text-sm">
                               <span className="font-bold text-gray-500">{k}: </span>
                               <span className="text-gray-900">{Array.isArray(data[k]) ? data[k].join(', ') : data[k]}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                     );
                  })}
                </div>

                <div className="mt-8 space-y-3 mb-8">
                  <h3 className="font-bold text-gray-900">Final Confirmation</h3>
                  {[
                    {id: 'final_review', label: 'I have reviewed my responses.'},
                    {id: 'final_accurate', label: 'I confirm that the information is accurate to the best of my knowledge.'},
                    {id: 'final_privacy', label: 'I understand my selected privacy and publication permissions.'},
                    {id: 'final_submit', label: 'I agree to submit this contribution for research review.'}
                  ].map(c => (
                    <label key={c.id} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer">
                      <input type="checkbox" checked={!!consultationData.consent?.[c.id]} onChange={e => handleChange('consent', c.id, e.target.checked)} className="mt-1" />
                      <span className="text-sm font-bold text-gray-700">{c.label}</span>
                    </label>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row justify-center gap-4">
                  <button onClick={() => setStep(9)} className="px-8 py-4 bg-white border border-gray-300 text-gray-700 rounded-[14px] font-bold hover:bg-gray-50 transition shadow-sm">
                    Back
                  </button>
                  <button 
                    disabled={isSubmitting} 
                    onClick={async () => {
                      if (!consultationData.consent?.final_submit) {
                        setSubmitError("Please agree to all final confirmation checkboxes.");
                        return;
                      }
                      setSubmitError(null);
                      setIsSubmitting(true);
                      
                      
                      try {
                        const payload = {
                          participantType: "Artisan",
                          district: consultationData.profile?.district || "Unknown",
                          rawConsultationData: consultationData
                        };
                        const formData = new FormData();
                        formData.append("payload", JSON.stringify(payload));
                        if (uploadedFiles && uploadedFiles.length > 0) {
                          uploadedFiles.forEach((f: any) => formData.append("evidenceFiles", f.file || f));
                        }
                        await fetch("/api/backend/consultation/submit", { method: "POST", body: formData });
                      } catch (e) {
                        console.error("Submission failed", e);
                      }
                      
                      setTimeout(() => {
                        setIsSubmitting(false);
                        setStep(11);
                        if (typeof window !== 'undefined') localStorage.removeItem('hcrf_artisan_consultationData');
                        window.scrollTo(0,0);
                      }, 1500);

                    }} 
                    className={`px-8 py-4 ${isSubmitting ? 'bg-gray-400' : 'bg-brand-primary'} text-white rounded-[14px] font-black hover:bg-brand-secondary transition shadow-lg text-lg flex items-center justify-center gap-3`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Contribution'} <FaArrowRight />
                  </button>
                </div>
                {submitError && <div className="text-center text-red-500 font-bold mt-4">{submitError}</div>}
              </div>
            )}

            {/* Post Submission Confirmation */}
            {step === 11 && (
              <div className="animate-fade-in py-8 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheckCircle className="text-5xl text-green-500" />
                </div>
                <h2 className="text-4xl font-black text-brand-dark mb-3">Thank you. Your contribution has been received.</h2>
                <div className="mt-8 bg-white border border-gray-200 p-8 rounded-3xl max-w-2xl mx-auto shadow-sm">
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <div className="text-xs text-gray-500 font-bold uppercase mb-1">Consultation Reference</div>
                      <div className="text-sm font-black text-brand-primary">{consId}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-bold uppercase mb-1">Stakeholder Pathway</div>
                      <div className="text-sm font-black text-gray-800">Artisan / Weaver</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-bold uppercase mb-1">Submission Time</div>
                      <div className="text-sm font-black text-gray-800">{new Date().toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-bold uppercase mb-1">Evidence Count</div>
                      <div className="text-sm font-black text-gray-800">{uploadedFiles.length}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12 space-x-4">
                  <Link href="/state-of-kashmir-crafts/participate" className="inline-block px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition">
                    Return to Participation Portal
                  </Link>
                  <Link href="/state-of-kashmir-crafts/consultation-tracker" className="inline-block px-6 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition">
                    View Consultation Tracker
                  </Link>
                </div>
              </div>
            )}

         </div>
       </div>
    </div>
  );
}
