"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  FaCheckCircle, FaFileAlt, FaUpload, FaArrowRight, FaArrowLeft, FaInfoCircle, FaTimes
} from 'react-icons/fa';

const generateConsultationId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SKC-2026-UNI-${result}`;
};

export default function UniversityPathwayClient({ onBackToCategories }: { onBackToCategories: () => void }) {
  const [step, setStep] = useState(1);
  const [lastSaved, setLastSaved] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{file: File, metadata: any}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [consId, setConsId] = useState<string>("");

  const [consultationData, setConsultationData] = useState<Record<string, any>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hcrf_uni_consultationData');
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('hcrf_uni_consultationId');
      if (!id) {
        id = generateConsultationId();
        localStorage.setItem('hcrf_uni_consultationId', id);
      }
      setConsId(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(consultationData).length > 0) {
      localStorage.setItem('hcrf_uni_consultationData', JSON.stringify(consultationData));
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

  const isConsentValid = consultationData.consent?.role && consultationData.consent?.authority;
  const isProfileValid = consultationData.profile?.institutionName && consultationData.profile?.type;
  const isCurriculumValid = consultationData.curriculum?.departments;
  const isResearchValid = consultationData.research?.areas;
  const isEngagementValid = consultationData.engagement?.collaborates;
  const isInfraValid = consultationData.infra?.facilities;
  const isChallengesValid = consultationData.challenges?.topChallenges;
  const isVisionValid = consultationData.vision?.priorities;
  const isRecommendationsValid = consultationData.recommendations?.govPriorities;
  
  const sectionsStatus = [isConsentValid, isProfileValid, isCurriculumValid, isResearchValid, isEngagementValid, isInfraValid, isChallengesValid, isVisionValid, isRecommendationsValid];
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
                   University / Academic Institution Consultation
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
                      <p>It seeks to understand how academic institutions contribute to the preservation, research, innovation, and global advancement of Kashmir's handicrafts sector. This is not a university ranking or accreditation survey.</p>
                    </div>
                  </div>
                </div>

                {renderField('consent', 'role', 'Respondent Role', 'select', [
                  'Vice Chancellor', 'Registrar', 'Dean', 'Director', 'Head of Department', 'Research Director', 'Faculty Member', 'Institutional Coordinator', 'Authorized Representative', 'Other'
                ])}
                
                {renderField('consent', 'authority', 'Submission Authority', 'radio', [
                  'Official institutional response',
                  'Departmental response',
                  'Personal academic perspective'
                ])}
                
                {renderField('consent', 'identity', 'Submission confidentiality preference', 'radio', [
                  'Institution may be publicly identified',
                  'Institution name must remain confidential, but inputs can be used',
                  'Submission may be used only in anonymized, aggregate analysis'
                ])}
                
                {renderField('consent', 'contact', 'May KHCRF contact the institution regarding future collaborations, research networks, or expert panels?', 'radio', ['Yes', 'No'])}

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
                    <span className="text-sm font-bold text-gray-700">I understand the knowledge ecosystem purpose of this consultation.</span>
                  </label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check2 || false} onChange={e => handleChange('consent', 'check2', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I confirm that participation is voluntary.</span>
                  </label>
                  <label className="flex items-start gap-3 mb-3 cursor-pointer">
                    <input type="checkbox" className="accent-brand-primary mt-1 w-4 h-4 shrink-0" checked={consultationData.consent?.check3 || false} onChange={e => handleChange('consent', 'check3', e.target.checked)} />
                    <span className="text-sm font-bold text-gray-700">I confirm the level of institutional authority under which I am submitting.</span>
                  </label>
                </div>

                {getWizardNav()}
              </div>
            )}

            {/* STEP 2: Institutional Profile */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 2: Institutional Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('profile', 'institutionName', 'Institution Name', 'text')}
                  {renderField('profile', 'yearEst', 'Year Established', 'number')}
                  {renderField('profile', 'country', 'Country', 'text', [], { defaultValue: 'India' })}
                  {renderField('profile', 'state', 'State / Province', 'text')}
                  {renderField('profile', 'district', 'District', 'text')}
                  {renderField('profile', 'city', 'City', 'text')}
                  {renderField('profile', 'website', 'Website', 'text')}
                  {renderField('profile', 'email', 'Primary Email', 'email')}
                </div>

                {renderField('profile', 'type', 'Institution Type', 'select', [
                  'Public University', 'Private University', 'Central University', 'State University', 'College', 'Polytechnic', 'ITI', 'Design Institute', 'Fine Arts School', 'Business School', 'Tourism Institute', 'Research Centre', 'Heritage Institute', 'Museum Academy', 'Think Tank', 'International University', 'Other'
                ])}
                
                <h3 className="font-bold text-gray-800 mt-6 mb-4">Academic Size (Approximate)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {renderField('profile', 'sizeStudents', 'Students', 'select', ['< 500', '500 - 2,000', '2,000 - 10,000', '10,000+'])}
                  {renderField('profile', 'sizeFaculty', 'Faculty / Researchers', 'select', ['< 50', '50 - 200', '200 - 500', '500+'])}
                </div>

                {renderField('profile', 'programs', 'Programs Offered', 'multiselect', [
                  'Undergraduate', 'Postgraduate', 'Doctoral', 'Diploma', 'Certificate', 'Continuing Education', 'Professional Development'
                ])}

                {/* Conditional Branching based on Type */}
                {consultationData.profile?.type === 'International University' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Global Collaboration</h3>
                    {renderField('profile', 'intlPartnerships', 'Describe your current or planned academic partnerships with institutions in India or specifically regarding Kashmir studies.', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 3: Academic Programs & Curriculum */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 3: Academic Programs & Curriculum</h2>

                {renderField('curriculum', 'departments', 'Relevant Departments', 'multiselect', [
                  'Fine Arts', 'Textile Design', 'Fashion Design', 'Architecture', 'History', 'Archaeology', 'Anthropology', 'Sociology', 'Economics', 'Business', 'Tourism', 'Environmental Science', 'Engineering', 'Computer Science', 'AI', 'Education', 'Public Policy', 'Other'
                ])}
                
                {renderField('curriculum', 'craftCourses', 'Does the institution offer craft-related courses?', 'radio', ['Yes', 'No', 'Planned'])}
                
                {consultationData.curriculum?.craftCourses === 'Yes' && (
                  <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-gray-800 mb-4">Craft Curriculum Details</h3>
                    {renderField('curriculum', 'courseTypes', 'Course Types', 'multiselect', [
                      'Degree', 'Elective', 'Short Course', 'Certificate', 'Workshop', 'Field Course', 'Continuing Education'
                    ])}
                  </div>
                )}

                {renderField('curriculum', 'teachingMethods', 'Primary Teaching Methods used for heritage/crafts', 'multiselect', [
                  'Lectures', 'Studios', 'Laboratories', 'Field Visits', 'Internships', 'Apprenticeships', 'Digital Learning', 'Community Learning', 'Other'
                ])}
                
                {renderField('curriculum', 'gaps', 'What are the major curriculum gaps in educating the next generation about traditional crafts and sustainable design?', 'textarea')}

                {/* Condition: Design Institute */}
                {(consultationData.profile?.type === 'Design Institute' || consultationData.profile?.type === 'Fine Arts School') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Design Curriculum</h3>
                    {renderField('curriculum', 'designIntegration', 'How are traditional Kashmiri craft techniques integrated into contemporary design coursework?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 4: Research, Innovation & Knowledge Creation */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 4: Research, Innovation & Knowledge Creation</h2>

                {renderField('research', 'areas', 'Active Research Areas', 'multiselect', [
                  'Heritage', 'Livelihoods', 'Textiles', 'Craft Design', 'Innovation', 'AI', 'Tourism', 'Exports', 'Sustainability', 'Climate', 'Business', 'Digital Preservation', 'Conservation', 'Traditional Knowledge', 'Other', 'None'
                ])}

                {/* Hide publications if no research */}
                {(!consultationData.research?.areas?.includes('None')) && (
                  <>
                    <h3 className="font-bold text-gray-800 mt-6 mb-4">Research Outputs (Approximate Annual Volume)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {renderField('research', 'outputJournals', 'Journal Articles / Books', 'select', ['0', '1-10', '11-50', '50+'])}
                      {renderField('research', 'outputReports', 'Reports / Policy Briefs', 'select', ['0', '1-10', '11-50', '50+'])}
                      {renderField('research', 'outputPatents', 'Patents / Datasets', 'select', ['0', '1-5', '6-20', '20+'])}
                    </div>
                  </>
                )}
                
                {renderField('research', 'funding', 'Primary Sources of Research Funding', 'multiselect', [
                  'Government', 'University', 'International', 'Industry', 'NGO', 'CSR', 'Other', 'None'
                ])}
                
                {renderField('research', 'innovationActivity', 'Innovation Activities & Facilities', 'multiselect', [
                  'Research Labs', 'Innovation Labs', 'Incubators', 'Startup Centers', 'Design Studios', 'Fab Labs', 'AI Labs', 'Heritage Labs', 'Other', 'None'
                ])}

                {/* Conditional logic for University vs College */}
                {(consultationData.profile?.type?.includes('University') || consultationData.profile?.programs?.includes('Doctoral')) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Doctoral & Post-Doctoral Research</h3>
                    {renderField('research', 'phdFocus', 'What specific challenges in the Kashmir crafts ecosystem are your doctoral students currently investigating?', 'textarea')}
                  </div>
                )}

                {/* Conditional logic for Research Centre */}
                {consultationData.profile?.type === 'Research Centre' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Datasets and Core Publications</h3>
                    {renderField('research', 'coreDatasets', 'Describe the primary datasets or archives your center actively manages and whether they are open-access.', 'textarea')}
                  </div>
                )}

                {/* Conditional logic for Incubation */}
                {(consultationData.research?.innovationActivity?.includes('Incubators') || consultationData.research?.innovationActivity?.includes('Startup Centers')) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Startup & Incubation</h3>
                    {renderField('research', 'incubationDetails', 'Are you incubating any startups related to craft, textiles, design, or cultural tourism? If so, what are their focuses?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 5: Industry, Artisan & Community Engagement */}
            {step === 5 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 5: Industry & Community Engagement</h2>

                {renderField('engagement', 'collaborates', 'Institution collaborates with:', 'multiselect', [
                  'Artisans', 'Manufacturers', 'Cooperatives', 'NGOs', 'Museums', 'Government', 'Industry', 'Exporters', 'Retailers', 'Online Platforms', 'International Universities', 'Other'
                ])}
                
                {renderField('engagement', 'activities', 'Types of Community / Industry Activities', 'multiselect', [
                  'Internships', 'Field Research', 'Documentation', 'Community Projects', 'Design Support', 'Entrepreneurship', 'Skill Development', 'Heritage Preservation', 'Technology Transfer', 'AI Projects', 'Exhibitions', 'Conferences', 'Other'
                ])}
                
                {renderField('engagement', 'students', 'Student Engagement in Crafts Sector', 'multiselect', [
                  'Field Visits', 'Internships', 'Live Projects', 'Volunteering', 'Research', 'Innovation Challenges', 'Hackathons', 'Other'
                ])}

                {/* Collaboration detail if selected */}
                {(consultationData.engagement?.collaborates?.length > 0) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Collaboration Impact</h3>
                    {renderField('engagement', 'collabImpact', 'Briefly describe a successful collaboration with artisans, industry, or government that benefited the crafts sector.', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 6: Infrastructure & Digital Capacity */}
            {step === 6 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 6: Infrastructure & Digital Capacity</h2>

                {renderField('infra', 'facilities', 'Institutional Facilities', 'multiselect', [
                  'Laboratories', 'Design Studios', 'Museums', 'Archives', 'Libraries', 'GIS Lab', 'AI Lab', 'Digital Heritage Lab', 'Textile Lab', 'Conservation Lab', 'Fab Lab', 'Incubation Centre', 'Innovation Centre', 'Auditorium', 'Other'
                ])}
                
                {renderField('infra', 'digital', 'Digital Infrastructure', 'multiselect', [
                  'LMS', 'Digital Repository', 'Research Database', 'Cloud Storage', 'Video Studio', 'Virtual Museum', 'Digital Collections', 'AI Tools', 'Other'
                ])}
                
                {renderField('infra', 'aiUsage', 'Current AI Usage in the Institution', 'multiselect', [
                  'Teaching', 'Research', 'Administration', 'Translation', 'Digital Archives', 'Image Analysis', 'Curriculum', 'Other', 'Not using AI'
                ])}
                
                {renderField('infra', 'challenges', 'Major Infrastructure Challenges', 'multiselect', [
                  'Funding', 'Equipment', 'Software', 'Internet', 'Faculty', 'Maintenance', 'Space', 'Digitization', 'Other'
                ])}

                {/* Conditional Branches */}
                {consultationData.profile?.type === 'Museum Academy' && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Heritage Documentation</h3>
                    {renderField('infra', 'museumDoc', 'Detail your current practices for digital cataloguing and heritage documentation.', 'textarea')}
                  </div>
                )}

                {(consultationData.profile?.type === 'Engineering College' || consultationData.profile?.type === 'Polytechnic') && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Technology & AI Implementation</h3>
                    {renderField('infra', 'techImplementation', 'How is the institution developing engineering, AI, or technological solutions specifically tailored for traditional manufacturing and artisan tools?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 7: Challenges & Institutional Opportunities */}
            {step === 7 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 7: Challenges & Opportunities</h2>

                {renderField('challenges', 'topChallenges', 'Top Five Institutional Challenges:', 'multiselect', [
                  'Funding', 'Faculty', 'Research', 'Industry Linkages', 'Student Interest', 'Curriculum', 'Technology', 'Digitization', 'Policy', 'International Collaboration', 'Infrastructure', 'Archives', 'Innovation', 'Other'
                ])}
                
                {renderField('challenges', 'opportunities', 'Greatest Institutional Opportunities for Growth:', 'multiselect', [
                  'New Programs', 'International Partnerships', 'AI', 'Digital Heritage', 'Innovation', 'Research Networks', 'Entrepreneurship', 'Incubation', 'Community Outreach', 'Other'
                ])}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 8: Future Vision & Strategic Priorities */}
            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 8: Future Vision & Priorities</h2>

                {renderField('vision', 'vision2030', 'What is the institution\'s vision for its role in the Kashmir Crafts ecosystem by 2030 and beyond?', 'textarea')}
                
                {renderField('vision', 'priorities', 'Future Strategic Priorities', 'multiselect', [
                  'New Degree Programs', 'Research Centres', 'Innovation Labs', 'Museums', 'Digital Archives', 'International Collaboration', 'AI', 'Sustainability', 'Entrepreneurship', 'Heritage Preservation', 'Other'
                ])}
                
                {renderField('vision', 'interestIn', 'The Institution is interested in participating in:', 'multiselect', [
                  'Annual Conference', 'Joint Research', 'Student Exchange', 'Faculty Exchange', 'Shared Laboratories', 'Digital Repository', 'Policy Network', 'Advisory Council', 'Expert Panels', 'Other', 'None'
                ])}
                
                {/* Condition: Partnerships framework */}
                {(!consultationData.vision?.interestIn?.includes('None') && consultationData.vision?.interestIn?.length > 0) && (
                  <div className="bg-brand-primary/5 border border-brand-primary/20 p-6 rounded-2xl mb-4 mt-4">
                    <h3 className="font-bold text-brand-dark mb-4">Partnership Framework</h3>
                    {renderField('vision', 'partnershipFramework', 'What structures or funding mechanisms are needed to make these joint collaborations successful?', 'textarea')}
                  </div>
                )}

                {getWizardNav()}
              </div>
            )}

            {/* STEP 9: Recommendations & Evidence */}
            {step === 9 && (
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-black text-brand-dark mb-8">Step 9: Recommendations & Evidence</h2>

                {renderField('recommendations', 'govPriorities', 'Top Policy Priorities for Government', 'multiselect', [
                  'Curriculum Development', 'Research Grants', 'Innovation Funding', 'Heritage Documentation', 'Digital Archives', 'AI', 'International Partnerships', 'Faculty Development', 'Student Scholarships', 'Incubation', 'Other'
                ])}
                
                {renderField('recommendations', 'industryNeeds', 'What does the Academic Sector need from Industry?', 'multiselect', [
                  'Internships', 'Research Partnerships', 'Innovation Projects', 'Technology Transfer', 'Design Collaboration', 'Other'
                ])}
                
                {renderField('recommendations', 'universitiesNeed', 'What do Universities need collectively?', 'multiselect', [
                  'Interdisciplinary Programs', 'Open Data', 'Shared Infrastructure', 'Joint Research', 'Faculty Development', 'Internationalization', 'Other'
                ])}
                
                <div className="mt-10 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Institutional Evidence</h3>
                  <p className="text-sm text-gray-600 mb-4">Upload institutional documentation to support your consultation. Examples: Curricula, Course Catalogues, Research Reports, Strategic Plans, Annual Reports, Partnership Agreements, Lab Specs, Conference Proceedings, Museum Archives.</p>
                  
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
                              <option>Curriculum / Course Catalogue</option>
                              <option>Strategic Plan / Annual Report</option>
                              <option>Research Report / Publication</option>
                              <option>Partnership Agreement / MoU</option>
                              <option>Infrastructure / Lab Info</option>
                              <option>Digital Archive Sample</option>
                              <option>Other</option>
                            </select>
                            <select className="text-xs p-2 border border-gray-300 rounded w-full" defaultValue="">
                              <option value="" disabled>Select Publication Status...</option>
                              <option>Public / Published Document</option>
                              <option>Internal / Working Document</option>
                            </select>
                            <select className="text-xs p-2 border border-gray-300 rounded w-full md:col-span-2" defaultValue="">
                              <option value="" disabled>Select Confidentiality...</option>
                              <option>Publicly available</option>
                              <option>Confidential - For KHCRF research analysis only</option>
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
                  <p className="text-gray-600 text-lg">Your institutional consultation response is ready. Please review the details before submitting.</p>
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
                      <span className={isCurriculumValid ? "text-green-600" : "text-gray-400"}>Curriculum</span>
                      <span className={isResearchValid ? "text-green-600" : "text-gray-400"}>Research</span>
                      <span className={isEngagementValid ? "text-green-600" : "text-gray-400"}>Engagement</span>
                      <span className={isInfraValid ? "text-green-600" : "text-gray-400"}>Infrastructure</span>
                      <span className={isChallengesValid ? "text-green-600" : "text-gray-400"}>Challenges</span>
                      <span className={isVisionValid ? "text-green-600" : "text-gray-400"}>Vision</span>
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
                          participantType: "University",
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
