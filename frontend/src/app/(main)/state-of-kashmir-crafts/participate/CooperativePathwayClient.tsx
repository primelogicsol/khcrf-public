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
  return `SKC-2026-CPG-${result}`;
};

export default function CooperativePathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_coop_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_coop_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_coop_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_coop_consultationData', JSON.stringify(consultationData));
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
  const isProfileValid = consultationData.profile?.groupName && consultationData.profile?.district && consultationData.profile?.legalStructure;
  const isMembershipValid = consultationData.membership?.totalMembers;
  const isGovernanceValid = consultationData.governance?.leadershipSelection;
  const isProductionValid = consultationData.production?.model;
  const isServicesValid = consultationData.services?.memberServices;
  const isMarketsValid = consultationData.markets?.channels;
  const isAuthValid = consultationData.auth?.giCovered;
  const isRecommendationsValid = consultationData.recommendations?.govPriorities;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isMembershipValid, isGovernanceValid, isProductionValid, isServicesValid, isMarketsValid, isAuthValid, isRecommendationsValid];
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
                   Cooperative / Producer Group Consultation Instrument
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
                      <p className="mb-2">This consultation forms part of the State of Kashmir Crafts Assessment 2026–2027 initiative led by the Hamadan Craft Revival Foundation. It seeks evidence on the structure, governance, membership, production systems, market access, financial practices, member benefits, and institutional needs of cooperatives and producer groups within Kashmir's handicrafts sector.</p>
                      <p>Participation is voluntary. This is not a registration, inspection, grant, taxation, or certification process.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'capacity', 'In what capacity are you submitting this response?', 'select', [
                  'Chairperson', 'President', 'Vice-president', 'Secretary', 'Treasurer', 'Board member', 'General manager', 'Group coordinator', 'Cooperative manager', 'Member representative', 'Government-nominated official', 'Federation representative', 'Authorized staff member', 'External consultant authorized by the group', 'Ordinary member providing personal observations', 'Other'
                ])}
                
                {renderField('consent', 'authority', 'Are you authorized to submit information on behalf of this cooperative or producer group?', 'radio', ['Yes, officially authorized', 'Partially authorized', 'No, this is my personal professional or member perspective'])}
                
                {consultationData.consent?.authority === 'Partially authorized' && (
                  renderField('consent', 'partialAuthSections', 'Which sections are you formally answering?', 'textarea')
                )}

                {renderField('consent', 'identity', 'Submission identity preference', 'radio', [
                  'Group may be publicly identified',
                  'Group name may remain confidential',
                  'Submission may be used only in anonymized analysis',
                  'Respondent name confidential, group name public',
                  'Respondent and group both confidential'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact the group for clarification?', 'radio', ['Yes', 'No'])}

                {consultationData.consent?.contact === 'Yes' && (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderField('consent', 'contactName', 'Contact Name', 'text')}
                    {renderField('consent', 'contactDesig', 'Designation', 'text')}
                    {renderField('consent', 'contactEmail', 'Email', 'email')}
                    {renderField('consent', 'contactPhone', 'Phone / WhatsApp', 'tel')}
                    {renderField('consent', 'contactPref', 'Preferred contact method', 'select', ['Phone', 'Email', 'WhatsApp'])}
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

            {/* STEP 2: Group Identity */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Group Identity & Legal Status</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderField('profile', 'groupName', 'Name of cooperative or producer group', 'text')}
                  {renderField('profile', 'tradingName', 'Trading or public name, if different', 'text')}
                  {renderField('profile', 'yearEst', 'Year formed', 'number')}
                  {renderField('profile', 'yearReg', 'Year registered, if applicable', 'number')}
                  {renderField('profile', 'district', 'District', 'select', KASHMIR_DISTRICT_NAMES)}
                  {renderField('profile', 'tehsil', 'Tehsil or town', 'text')}
                  {renderField('profile', 'locality', 'Village, locality, or craft cluster', 'text')}
                  {renderField('profile', 'mainOffice', 'Main office location', 'text')}
                  {renderField('profile', 'mainProduction', 'Main production location', 'text')}
                </div>

                {renderField('profile', 'legalStructure', 'Which structure best describes the group?', 'select', [
                  'Registered cooperative', 'Producer company', 'Self-help group', 'Artisan producer group', 'Informal collective', 'Cluster association', 'Society', 'Trust', 'Federation', 'Apex cooperative body', 'Government-supported cooperative', 'Women’s collective', 'Youth collective', 'Community-owned enterprise', 'Other'
                ])}
                
                {renderField('profile', 'registrations', 'Which registrations apply?', 'multiselect', [
                  'Cooperative registration', 'Producer company registration', 'Society registration', 'Trust registration', 'Udyam or MSME', 'GST', 'Import Export Code', 'Handicrafts registration', 'GI authorization', 'Bank registration', 'Government department recognition', 'Export council membership', 'Chamber or association membership', 'None', 'Unsure', 'Other'
                ])}
                
                {renderField('profile', 'status', 'What is the group’s current operating status?', 'select', [
                  'Fully active', 'Active but limited', 'Seasonal', 'Temporarily inactive', 'Dormant', 'Under revival', 'Newly formed', 'In liquidation or closure', 'Unsure'
                ])}

                {(consultationData.profile?.status === 'Temporarily inactive' || consultationData.profile?.status === 'Dormant') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4">
                    <h3 className="font-bold text-brand-dark mb-4">Dormancy Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {renderField('profile', 'inactiveSince', 'Since when?', 'text')}
                      {renderField('profile', 'inactiveReasons', 'Main reasons', 'textarea')}
                      {renderField('profile', 'inactiveRevive', 'Do members wish to revive the group?', 'radio', ['Yes', 'No', 'Unsure'])}
                      {renderField('profile', 'inactiveSupport', 'What support would be required?', 'textarea')}
                    </div>
                  </div>
                )}
                
                {renderField('profile', 'primaryCraft', 'Main Craft Categories', 'multiselect', ['Carpet', 'Pashmina', 'Kani', 'Sozni', 'Crewel', 'Chain stitch', 'Papier-mâché', 'Walnut wood carving', 'Namdah', 'Gabba', 'Willow work', 'Copperware', 'Silverware', 'Woodwork', 'Textiles', 'Shawls', 'Furnishings', 'Accessories', 'Mixed handicrafts', 'Other'])}

                {renderField('profile', 'geographicCoverage', 'Geographic coverage of membership', 'radio', ['Village-based', 'Cluster-based', 'Tehsil-level', 'District-level', 'Multi-district', 'Kashmir-wide', 'Cross-regional', 'Other'])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Membership and Representation */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Membership & Representation</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('membership', 'totalMembers', 'Total registered members', 'text')}
                  {renderField('membership', 'activeMembers', 'Active members', 'text')}
                  {renderField('membership', 'inactiveMembers', 'Inactive members', 'text')}
                  {renderField('membership', 'votingMembers', 'Voting members', 'text')}
                  {renderField('membership', 'producerMembers', 'Producer members', 'text')}
                  {renderField('membership', 'artisanMembers', 'Artisan members', 'text')}
                  {renderField('membership', 'associateMembers', 'Associate members', 'text')}
                  {renderField('membership', 'receivingWork', 'Members receiving work/services', 'text')}
                </div>

                {renderField('membership', 'activeDefinition', 'How does the group define an active member?', 'multiselect', [
                  'Participates in production', 'Attends meetings', 'Pays membership fee', 'Receives orders', 'Uses common facilities', 'Sells through the group', 'Participates in governance', 'No formal definition', 'Other'
                ])}
                
                <h3 className="font-bold text-gray-800 mt-6 mb-4">Gender & Youth Representation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('membership', 'womenMembers', 'Women members', 'text')}
                  {renderField('membership', 'menMembers', 'Men members', 'text')}
                  {renderField('membership', 'youthUnder30', 'Members under 30', 'text')}
                  {renderField('membership', 'youthApprentices', 'Youth apprentices', 'text')}
                </div>

                {renderField('membership', 'vulnerableGroups', 'Representation of vulnerable groups', 'multiselect', [
                  'Persons with disabilities', 'Home-based workers', 'Widows or single women', 'Economically vulnerable households', 'Remote-area members', 'Minority craft communities', 'Migrant or displaced artisans', 'Prefer not to answer', 'Other'
                ])}
                
                {renderField('membership', 'entryRules', 'Membership entry rules', 'multiselect', [
                  'Membership is open', 'Admission fee required', 'Share contribution required', 'Approval required', 'Waiting periods exist', 'Craft-skill criteria apply', 'Workers can become voting members', 'Women can join independently'
                ])}
                
                {renderField('membership', 'exitRules', 'Membership exit rules', 'multiselect', [
                  'Members can resign freely', 'Shares are refundable', 'Outstanding payments settled', 'Penalties applied', 'Membership can be suspended', 'Appeal process exists', 'Former members still owed money'
                ])}
                
                {renderField('membership', 'participationLevels', 'Member participation levels', 'multiselect', [
                  'Regularly attend general meetings', 'Regularly participate in elections', 'Regularly participate in production planning', 'Regularly participate in price decisions', 'Regularly participate in buyer selection', 'Regularly review financials', 'Regularly attend training', 'Regularly participate in policy consultation', 'Regularly use grievance processes'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Governance */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Governance & Decision-Making</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('governance', 'electedBoard', 'Is there an elected board/committee?', 'select', ['Yes', 'No', 'Informal'])}
                  {renderField('governance', 'boardCount', 'Number of board members', 'number')}
                  {renderField('governance', 'termLength', 'Board term length', 'text')}
                  {renderField('governance', 'lastElection', 'Date of last election', 'text')}
                </div>
                
                {renderField('governance', 'leadershipSelection', 'How are leaders selected?', 'select', [
                  'Direct election by members', 'Election by delegates', 'Appointment by government', 'Appointment by founder', 'Appointment by sponsor organization', 'Informal consensus', 'Family control', 'No formal process', 'Other'
                ])}
                
                {renderField('governance', 'decisionMakers', 'Who primarily makes major decisions (production, pricing, surplus, etc.)?', 'select', [
                  'General membership', 'Board', 'Chairperson or president', 'Manager', 'Government nominee', 'Buyer or sponsor', 'Mixed', 'Unknown'
                ])}

                {renderField('governance', 'transparency', 'Which documents can members access?', 'multiselect', [
                  'Annual accounts', 'Audit reports', 'Meeting minutes', 'Buyer contracts', 'Price calculations', 'Member-payment records', 'Loan records', 'Asset records', 'Government-grant records', 'Surplus-distribution records'
                ])}
                
                {renderField('governance', 'audit', 'Is an annual audit conducted?', 'select', ['Yes, externally', 'Yes, internally', 'No', 'Not applicable'])}
                
                {renderField('governance', 'conflictRules', 'Conflict of interest rules exist for:', 'multiselect', [
                  'Related-party purchases', 'Leadership-owned suppliers', 'Leadership-owned buyers', 'Family appointments', 'Board remuneration', 'Procurement', 'Asset disposal', 'Member favoritism', 'Conflict declarations'
                ])}
                
                {renderField('governance', 'grievance', 'Grievance and dispute resolution', 'multiselect', [
                  'Written grievance process', 'Confidential complaints allowed', 'Appeals allowed', 'Complaints recorded', 'Members can challenge deductions', 'Leadership decisions can be reviewed'
                ])}
                
                {renderField('governance', 'externalControl', 'Major decisions are influenced by:', 'multiselect', [
                  'Government department', 'Sponsor organization', 'NGO', 'Exporter', 'Manufacturer', 'Political actor', 'Family group', 'Donor', 'Bank or lender', 'None', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Production & Engagement */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Production & Member Engagement</h2>

                {renderField('production', 'model', 'Which production models apply?', 'multiselect', [
                  'Members produce independently', 'Group distributes orders', 'Group supplies raw materials', 'Group owns a workshop', 'Group operates common facilities', 'Group collects finished products', 'Group performs finishing', 'Group performs quality control', 'Group markets collectively', 'Group exports', 'Group acts only as an association', 'Group currently has no production activity', 'Other'
                ])}
                
                {renderField('production', 'orderDistribution', 'How are work orders distributed among members?', 'select', [
                  'Equal rotation', 'Based on skill', 'Based on capacity', 'Based on previous performance', 'Based on location', 'Decided by leadership', 'Decided by buyer', 'First-come basis', 'Informally', 'No regular system', 'Other'
                ])}
                
                {renderField('production', 'workArrangements', 'Member work arrangements', 'multiselect', [
                  'At home', 'In group workshop', 'In shared facility', 'At buyer premises', 'Through contractors', 'Seasonally', 'Full-time', 'Part-time'
                ])}
                
                {renderField('production', 'paymentModel', 'Payment models used', 'multiselect', [
                  'Piece rate', 'Daily wage', 'Monthly wage', 'Per order', 'Profit share', 'Dividend', 'Commission', 'Member account settlement', 'Mixed', 'No regular payment system'
                ])}
                
                {renderField('production', 'rateSetting', 'Who sets the rate/wage?', 'radio', ['Members approve', 'Board/Leadership', 'Buyer sets rate', 'Market-based', 'Government fixed', 'Unsure'])}
                
                {renderField('production', 'paymentCycle', 'Typical payment cycle', 'select', [
                  'Advance', 'On delivery', 'Within 7 days', '8–30 days', '31–60 days', 'More than 60 days', 'Only after buyer payment', 'Irregular'
                ])}
                
                {renderField('production', 'rejection', 'Rejection and deductions', 'multiselect', [
                  'Quality standards provided in advance', 'Members can correct rejected work', 'Materials deducted', 'Transport costs deducted', 'Administrative charges deducted', 'Deductions are itemized', 'Appeal possible', 'Rejected goods returned to members'
                ])}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('production', 'annualOutput', 'Approximate annual output', 'text')}
                  {renderField('production', 'capacityUtil', 'Current capacity utilization', 'text')}
                  {renderField('production', 'regularOrders', 'Members receiving regular orders', 'number')}
                  {renderField('production', 'withoutWork', 'Percentage without work', 'text')}
                </div>
                
                {renderField('production', 'constraints', 'Production constraints', 'multiselect', [
                  'Lack of orders', 'Raw-material shortage', 'Finance', 'Skilled labour shortage', 'Inadequate common facilities', 'Poor equipment', 'Electricity', 'Storage', 'Quality problems', 'Transport', 'Leadership problems', 'Member conflict', 'Buyer dependence', 'Seasonal demand', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Services & Facilities */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Services, Facilities & Capacity Building</h2>

                {renderField('services', 'memberServices', 'Which services does the group provide?', 'multiselect', [
                  'Raw-material procurement', 'Tools and equipment', 'Common workspace', 'Design support', 'Quality control', 'Packaging', 'Storage', 'Transport', 'Marketing', 'E-commerce', 'Export support', 'Credit facilitation', 'Insurance facilitation', 'Registration support', 'GI support', 'Training', 'Legal support', 'Welfare support', 'None', 'Other'
                ])}
                
                {renderField('services', 'rawMaterialSupport', 'Raw-material support practices', 'multiselect', [
                  'Group buys collectively', 'Materials sold to members at cost', 'Credit provided', 'Quality checks performed', 'Supplier selection is transparent', 'Material prices are disclosed', 'Shortages are rationed', 'Leaders or related parties are suppliers'
                ])}
                
                {renderField('services', 'commonFacilities', 'Common facilities owned or accessed', 'multiselect', [
                  'Workshop', 'Looms', 'Dyeing facility', 'Washing facility', 'Finishing facility', 'Testing laboratory', 'Packaging unit', 'Storage', 'Design studio', 'Training centre', 'Digital resource centre', 'Transport vehicle', 'Retail outlet', 'Exhibition space', 'None'
                ])}
                
                {renderField('services', 'assetControl', 'Asset ownership and control', 'multiselect', [
                  'Group legally owns assets', 'Written usage rules exist', 'Usage fees charged', 'Fees are disclosed', 'Maintenance records kept', 'Assets insured', 'Available equally to all members'
                ])}
                
                {renderField('services', 'trainingTopics', 'Training topics offered', 'multiselect', [
                  'Technical craft skills', 'Design', 'Quality control', 'Business management', 'Digital commerce', 'Financial literacy', 'Export procedures', 'GI and authenticity', 'Occupational safety', 'Environmental practices', 'Leadership and governance'
                ])}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('services', 'apprenticesCount', 'Number of apprentices', 'number')}
                  {renderField('services', 'staffing', 'Institutional staffing', 'multiselect', ['Manager', 'Accountant', 'Production coordinator', 'Marketing staff', 'Quality-control staff', 'Digital staff', 'Field coordinator', 'Legal/compliance support', 'No paid staff'])}
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Markets & Finance */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Markets, Finance & Benefit Distribution</h2>

                {renderField('markets', 'channels', 'Market channels used', 'multiselect', [
                  'Local consumers', 'Tourists', 'Local retailers', 'Retailers outside Kashmir', 'Wholesalers', 'Manufacturers', 'Exporters', 'Direct export', 'Government emporia', 'Institutional buyers', 'Exhibitions', 'Own shop', 'Own website', 'Online marketplace', 'Social media', 'Corporate gifting', 'Hospitality and interior design', 'Other'
                ])}
                
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
                
                {renderField('markets', 'collectiveMarketing', 'Collective marketing practices', 'multiselect', [
                  'Sell under one brand', 'Members can sell independently', 'Branding owned by group', 'Packaging standardized', 'Member identity shown', 'Sales records accessible', 'Buyer contracts written'
                ])}
                
                {renderField('markets', 'buyerConcentration', 'Share of annual sales from largest buyer', 'select', ['Less than 10%', '10–24%', '25–49%', '50–74%', '75% or more', 'Unable to estimate'])}
                
                {renderField('markets', 'pricing', 'Who sets sale prices?', 'select', ['Members', 'Board', 'Manager', 'Buyer', 'Exporter', 'Government', 'Market-based', 'Negotiated', 'No formal pricing method'])}
                
                {renderField('markets', 'turnover', 'Annual group revenue', 'select', ['No commercial turnover', 'Below ₹5 lakh', '₹5–25 lakh', '₹25–50 lakh', '₹50 lakh–₹1 crore', '₹1–5 crore', '₹5–10 crore', 'Above ₹10 crore', 'Prefer not to answer'])}
                
                {renderField('markets', 'revenueDist', 'How is sales revenue distributed?', 'multiselect', ['Direct payment to producing member', 'Deduction of group service fee', 'Wage or piece-rate payment', 'Member account credit', 'Periodic settlement', 'Dividend', 'Surplus distribution', 'Group retains all income', 'Mixed', 'Other'])}
                
                {renderField('markets', 'surplus', 'Surplus and profit management', 'multiselect', ['Generates surplus', 'Surplus distributed', 'Reserves maintained', 'Members consulted', 'Dividends linked to shares/production/equality', 'Written policy exists'])}
                
                {renderField('markets', 'memberBenefits', 'Which benefits do members receive?', 'multiselect', ['Better prices', 'Regular work', 'Raw-material access', 'Credit', 'Training', 'Market access', 'Social protection', 'Equipment access', 'Collective bargaining', 'Dividends', 'Welfare support', 'No clear benefit', 'Other'])}
                
                {renderField('markets', 'financeSources', 'Sources of finance', 'multiselect', ['Member shares', 'Membership fees', 'Sales revenue', 'Government grant', 'Government loan', 'Bank loan', 'Cooperative bank', 'Donor or NGO funding', 'Buyer advance', 'Export finance', 'CSR support', 'Informal borrowing', 'Other'])}
                
                {renderField('markets', 'financeChallenges', 'Financial challenges', 'multiselect', ['Insufficient working capital', 'Delayed buyer payments', 'Member-payment obligations', 'Loan repayment', 'Lack of collateral', 'Weak bookkeeping', 'Audit cost', 'Limited bank finance', 'Dependence on grants', 'High interest', 'Fraud or mismanagement risk', 'Dormant bank account', 'Other'])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Authenticity & Risks */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Authenticity, Sustainability & Risks</h2>

                {renderField('auth', 'giCovered', 'GI and authenticity practices', 'multiselect', ['Produces GI-covered crafts', 'Group is GI-authorized', 'Individual members authorized', 'Labels are used', 'Linked to products', 'Material origin documented', 'Certificates provided', 'Products traceable to members', 'Faces counterfeit competition'])}
                
                {renderField('auth', 'qualitySystems', 'Quality systems', 'multiselect', ['Written quality standards', 'Member training', 'Quality inspection', 'Product grading', 'Rejection process', 'Corrective action', 'Buyer inspection', 'Third-party certification', 'No formal system'])}
                
                {renderField('auth', 'environmental', 'Environmental practices', 'multiselect', ['Legal raw-material sourcing', 'Wood sourcing', 'Water use', 'Dye discharge', 'Chemical use', 'Waste management', 'Recycling', 'Packaging', 'Energy use', 'Worker exposure', 'Environmental training', 'None'])}
                
                {renderField('auth', 'socialResp', 'Social responsibility policies', 'multiselect', ['Equal access to work', 'Non-discrimination', 'Women’s participation', 'Youth participation', 'Disability inclusion', 'Child-labour prevention', 'Occupational safety', 'Fair payment', 'Member grievance', 'Protection from harassment'])}
                
                {renderField('auth', 'risks', 'Select up to five significant institutional risks', 'multiselect', ['Dormant membership', 'Weak participation', 'Leadership concentration', 'Political interference', 'Government dependency', 'Buyer dependency', 'Lack of finance', 'Weak bookkeeping', 'Audit irregularities', 'Member conflict', 'Delayed payments', 'Asset misuse', 'Lack of skilled staff', 'Weak market access', 'Raw-material inflation', 'Youth disengagement', 'Counterfeit products', 'Loss of traditional skills', 'Other'])}
                
                {renderField('auth', 'revival', 'Does the group expect to remain active during the next five years?', 'select', ['Definitely', 'Probably', 'Unsure', 'Probably not', 'Definitely not'])}
                
                {(consultationData.auth?.revival === 'Probably not' || consultationData.auth?.revival === 'Definitely not' || consultationData.auth?.revival === 'Unsure') && (
                  <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl mb-4">
                     {renderField('auth', 'revivalConditions', 'What conditions are required for survival or revival?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'govPriorities', 'Select priority areas for government intervention (up to 5)', 'multiselect', ['Cooperative revival', 'Governance reform', 'Professional management', 'Working capital', 'Raw-material support', 'Common facilities', 'Marketing', 'Export support', 'GI enforcement', 'Audit support', 'Digital systems', 'Member welfare', 'Training', 'Apprenticeship', 'Women and youth participation', 'Simplified registration', 'Federation-building', 'Conflict-resolution support', 'Other'])}
                
                {renderField('recommendations', 'mostImportantAction', 'What is the single most important government action?', 'text')}
                
                {renderField('recommendations', 'memberPriorities', 'What should members prioritize?', 'multiselect', ['Meeting participation', 'Transparent elections', 'Timely fee or share payments', 'Quality standards', 'Collective marketing', 'Record maintenance', 'Training', 'Youth recruitment', 'Women’s leadership', 'Grievance use', 'Other'])}
                
                {renderField('recommendations', 'leadershipPriorities', 'What should leadership prioritize?', 'multiselect', ['Financial transparency', 'Fair order distribution', 'Fair payment', 'Buyer diversification', 'Member communication', 'Conflict-of-interest rules', 'Market development', 'Asset maintenance', 'Professional staffing', 'Audit compliance', 'Other'])}
                
                {renderField('recommendations', 'action12m', 'What one action could most improve member livelihoods or group performance within the next 12 months?', 'textarea')}
                
                {renderField('recommendations', 'action3y', 'What structural reform is most important for cooperatives and producer groups during the next 3 to 5 years?', 'textarea')}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evidence & Documentation</h3>
                  <p className="text-sm text-gray-600 mb-4">You may upload documents, photographs, records, or other evidence that supports your response (e.g. Bylaws, Meeting minutes, Audit reports, Sales records).</p>
                  
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-4">
                    <p className="text-xs font-bold text-orange-800 uppercase">Important Security Warning</p>
                    <p className="text-sm text-orange-700 mt-1">Remove or redact bank account numbers, government identity numbers, member phone numbers, signatures, private addresses, personal financial information, and unrelated buyer information before uploading.</p>
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
                            <option>Registration certificate</option>
                            <option>Bylaws</option>
                            <option>Audit reports</option>
                            <option>Meeting minutes</option>
                            <option>Work-order distribution</option>
                            <option>Other</option>
                          </select>
                          <select className="text-xs p-2 border border-gray-300 rounded mt-2 w-full" defaultValue="">
                            <option value="" disabled>Select Confidentiality...</option>
                            <option>Public and attributable</option>
                            <option>Public but member data redacted</option>
                            <option>Public but group anonymized</option>
                            <option>Research team only</option>
                            <option>Aggregate analysis only</option>
                            <option>Contact group before any publication</option>
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
                      <span className={isConsentValid ? "text-green-600" : "text-gray-400"}>Consent and authority</span>
                      <span className={isProfileValid ? "text-green-600" : "text-gray-400"}>Group identity</span>
                      <span className={isMembershipValid ? "text-green-600" : "text-gray-400"}>Membership</span>
                      <span className={isGovernanceValid ? "text-green-600" : "text-gray-400"}>Governance</span>
                      <span className={isProductionValid ? "text-green-600" : "text-gray-400"}>Production</span>
                      <span className={isServicesValid ? "text-green-600" : "text-gray-400"}>Member services</span>
                      <span className={isMarketsValid ? "text-green-600" : "text-gray-400"}>Markets and finance</span>
                      <span className={isAuthValid ? "text-green-600" : "text-gray-400"}>Authenticity and risks</span>
                      <span className={isRecommendationsValid ? "text-green-600" : "text-gray-400"}>Recommendations</span>
                      <span className={uploadedFiles.length > 0 ? "text-green-600" : "text-gray-400"}>Evidence (Optional)</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200 flex-wrap gap-4">
                  <button onClick={() => setStep(9)} className="flex items-center gap-2 px-6 py-3 rounded-[14px] font-bold transition bg-gray-100 text-gray-700 hover:bg-gray-200">
                    <FaArrowLeft /> Back to Editing
                  </button>
                  <button onClick={async () => {
                      try {
                        const payload = {
                          participantType: "Cooperative",
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
