const fs = require('fs');

const code = `
'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaCheckCircle, FaUpload, FaSpinner } from 'react-icons/fa';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { submitStoryHeroFallback } from '@/config/heroFallbacks';
import { uploadFile } from '@/lib/cloudinary';
import { getCraftsByCategory } from '@/config/craftRegistry';

export default function SubmitStoryWorkflow() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [secondaryDropdownOpen, setSecondaryDropdownOpen] = useState(false);
  const secondaryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (secondaryDropdownRef.current && !secondaryDropdownRef.current.contains(event.target as Node)) {
        setSecondaryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const craftsByCategory = getCraftsByCategory();

  const [formData, setFormData] = useState({
    submissionType: '',
    submissionStage: '',
    primaryEditorialTheme: '',
    primaryCraft: '',
    secondaryCrafts: [] as string[],
    geographicScope: '',

    authorName: '',
    authorEmail: '',
    authorPhone: '',
    contributorCategory: '',
    country: '',
    stateRegion: '',
    cityDistrict: '',
    institutionalAffiliation: '',
    professionalRole: '',
    shortBio: '',
    portfolioUrl: '',

    title: '',
    synopsis: '',
    subjectFeatured: '',
    subjectLocation: '',
    researchDetails: '',
    previousPublicationStatus: '',
    conflictOfInterest: '',

    interviewsIncluded: false,
    fieldResearchIncluded: false,
    archiveConsulted: false,
    bibliographyIncluded: false,
    supportingEvidenceAvailable: false,
    existingRecordIds: '',

    originalityDeclaration: false,
    copyrightDeclaration: false,
    interviewConsent: false,
    accuracyDeclaration: false,
    priorPublicationDeclaration: false,
    sensitiveKnowledgeDeclaration: false,
    editorialReviewAcknowledgement: false,

    notes: '',
    accessRestrictions: '',
    translationSupportRequired: '',
    preferredTimeframe: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 250 * 1024 * 1024) {
        setErrorMsg('File size exceeds the 250MB limit.');
        return;
      }
      setSelectedFile(file);
      setErrorMsg('');
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setFieldErrors({});

    try {
      let mediaAssets = undefined;
      if (selectedFile) {
        setUploadProgress(true);
        try {
          const fileUrl = await uploadFile(selectedFile);
          
          let mediaType = 'DOCUMENT';
          if (selectedFile.type.startsWith('image/')) mediaType = 'IMAGE';
          else if (selectedFile.type.startsWith('audio/')) mediaType = 'AUDIO';
          else if (selectedFile.type.startsWith('video/')) mediaType = 'VIDEO';

          mediaAssets = {
            create: [
              {
                mediaType,
                storageProvider: 'cloudinary',
                publicUrl: fileUrl,
                fileName: selectedFile.name,
                sizeBytes: selectedFile.size,
                mimeType: selectedFile.type,
              }
            ]
          };
        } catch (uploadErr) {
          const errMessage = uploadErr instanceof Error ? uploadErr.message : 'File upload failed. Please try again.';
          setErrorMsg(errMessage);
          setIsSubmitting(false);
          setUploadProgress(false);
          return;
        }
        setUploadProgress(false);
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\\/api$/, '') : 'http://localhost:4000';
      const payload = {
        ...formData,
        secondaryCrafts: formData.secondaryCrafts.join(', '),
        ...(mediaAssets ? { mediaAssets } : {})
      };

      const res = await fetch(\`\${API_BASE_URL}/api/participation/story\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const contentType = res.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        throw new Error('Server returned an unexpected non-JSON response.');
      }

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const err = await res.json();
        const apiErrors = err.errors || err.data?.errors;
        if (apiErrors && Array.isArray(apiErrors)) {
          const errorsObj: Record<string, string> = {};
          apiErrors.forEach((e: any) => {
            errorsObj[e.field] = e.message;
          });
          setFieldErrors(errorsObj);
          setErrorMsg('Please correct the highlighted fields before submitting.');
        } else {
          setErrorMsg(err.error || err.data?.error || err.message || err.data?.message || 'Failed to submit.');
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred. Please try again.');
    }
    setIsSubmitting(false);
  };

  const getFieldError = (fieldName: string) => {
    return fieldErrors[fieldName] ? (
      <p className="mt-1.5 text-sm text-red-600 font-medium animate-fadeIn flex items-center">
        <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
        {fieldErrors[fieldName]}
      </p>
    ) : null;
  };

  if (isSuccess) {
    return (
      <main className="w-full bg-[#FAF9F6] min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto px-6 animate-fadeIn">
          <div className="bg-brand-primary/5 p-8 md:p-12 rounded-3xl border border-brand-primary/20 text-center shadow-sm">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
            <h3 className="text-3xl font-black text-brand-dark mb-4">Manuscript Received</h3>
            <p className="text-xl text-gray-700 mb-8 font-medium">Thank you for submitting your research to the Editorial board.</p>
            <div className="max-w-md mx-auto text-left mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-600">
              <p className="leading-relaxed">Our editors will review your piece and reach out to you within 14 days regarding suitability and formatting guidelines.</p>
            </div>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-xl transition shadow-md">
              Submit Another Document
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-gray-800 font-sans pb-32 selection:bg-[#D4AF37] selection:text-[#3E2723]">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <UniversalEditorialHero pageKey="submit-story" fallbackConfig={submitStoryHeroFallback as any} />
      
      <section className="container mx-auto px-4 max-w-4xl mt-[-40px] relative z-10 mb-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h2 className="text-3xl font-black text-brand-dark mb-6">Submit a Craft Story, Oral History, or Research Manuscript</h2>
          <div className="prose prose-lg text-gray-600 mb-8 max-w-none">
            <p>Share your research, oral history records, or detailed craft documentation articles with the Kashmir Archive Editorial Board.</p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-6 rounded-2xl mb-8 font-medium border border-red-100 flex items-start">
              <span className="text-xl mr-3">⚠️</span>
              <div>
                <div className="font-bold mb-1">{errorMsg}</div>
                {Object.keys(fieldErrors).length > 0 && (
                  <ul className="mt-3 space-y-2 text-sm">
                    {Object.entries(fieldErrors).map(([field, msg]) => (
                      <li key={field} className="flex items-start gap-2">
                        <span>
                          <strong className="capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</strong>: {msg}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">

            {/* Section 1 */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                Submission Type
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Submission Type *</label>
                    <select name="submissionType" value={formData.submissionType} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                      <option value="">Select Type</option>
                      <option value="Feature Story">Feature Story</option>
                      <option value="Oral History Transcript">Oral History Transcript</option>
                      <option value="Research Article">Research Article</option>
                      <option value="Photographic Essay">Photographic Essay</option>
                      <option value="Archival Transcription">Archival Transcription</option>
                      <option value="Translation">Translation</option>
                      <option value="Other">Other</option>
                    </select>
                    {getFieldError('submissionType')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Submission Stage *</label>
                    <select name="submissionStage" value={formData.submissionStage} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                      <option value="">Select Stage</option>
                      <option value="Pitch">Pitch</option>
                      <option value="Draft">Draft</option>
                      <option value="Final Manuscript">Final Manuscript</option>
                    </select>
                    {getFieldError('submissionStage')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Primary Editorial Theme *</label>
                    <input type="text" name="primaryEditorialTheme" value={formData.primaryEditorialTheme} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('primaryEditorialTheme')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Geographic Scope *</label>
                    <input type="text" name="geographicScope" value={formData.geographicScope} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('geographicScope')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Primary Craft *</label>
                    <select name="primaryCraft" value={formData.primaryCraft} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                      <option value="">Select Craft</option>
                      {Object.entries(craftsByCategory).map(([category, crafts]) => (
                        <optgroup key={category} label={category}>
                          {crafts.map(craft => (
                            <option key={craft.craftId} value={craft.englishName}>{craft.englishName}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    {getFieldError('primaryCraft')}
                  </div>
                  
                  <div className="relative" ref={secondaryDropdownRef}>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Secondary Crafts (Optional)</label>
                    <div 
                      className="w-full px-5 py-3 min-h-[50px] border border-gray-200 rounded-xl bg-white flex flex-wrap gap-2 items-center cursor-pointer transition focus:ring-2 focus:ring-brand-primary outline-none"
                      onClick={() => setSecondaryDropdownOpen(!secondaryDropdownOpen)}
                    >
                      <div className="flex flex-wrap gap-2 flex-1">
                        {formData.secondaryCrafts.length === 0 ? (
                          <span className="text-gray-400 text-sm">Select secondary crafts...</span>
                        ) : (
                          formData.secondaryCrafts.map(craft => (
                            <span key={craft} className="bg-brand-primary/10 text-brand-dark px-3 py-1 rounded-full text-xs font-bold flex items-center">
                              {craft}
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFormData(prev => ({
                                    ...prev,
                                    secondaryCrafts: prev.secondaryCrafts.filter(c => c !== craft)
                                  }));
                                }}
                                className="ml-2 text-brand-primary hover:text-red-500"
                              >
                                &times;
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                    {secondaryDropdownOpen && (
                      <div className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-xl max-h-80 overflow-y-auto custom-scrollbar">
                        {Object.entries(craftsByCategory).map(([category, crafts]) => (
                          <div key={category} className="border-b border-gray-50 last:border-0">
                            <div className="px-4 py-2 bg-gray-50/90 text-[11px] font-bold text-gray-400 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-sm">
                              {category}
                            </div>
                            {crafts.map(craft => {
                              const isSelected = formData.secondaryCrafts.includes(craft.englishName);
                              return (
                                <div 
                                  key={craft.craftId}
                                  className={\`px-4 py-3 flex items-center cursor-pointer transition-colors hover:bg-brand-primary/5 \${isSelected ? 'bg-brand-primary/5' : ''}\`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFormData(prev => {
                                      const alreadySelected = prev.secondaryCrafts.includes(craft.englishName);
                                      const newCrafts = alreadySelected 
                                        ? prev.secondaryCrafts.filter(c => c !== craft.englishName)
                                        : [...prev.secondaryCrafts, craft.englishName];
                                      return { ...prev, secondaryCrafts: newCrafts };
                                    });
                                  }}
                                >
                                  <div className={\`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors \${isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'border-gray-300 bg-white'}\`}>
                                    {isSelected && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                  </div>
                                  <span className={\`text-sm \${isSelected ? 'font-semibold text-brand-dark' : 'text-gray-700'}\`}>
                                    {craft.englishName}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    )}
                    {getFieldError('secondaryCrafts')}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                Author Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Author Name *</label>
                  <input type="text" name="authorName" value={formData.authorName} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('authorName')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Author Email *</label>
                  <input type="email" name="authorEmail" value={formData.authorEmail} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('authorEmail')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Author Phone *</label>
                  <input type="tel" name="authorPhone" value={formData.authorPhone} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('authorPhone')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Contributor Category *</label>
                  <select name="contributorCategory" value={formData.contributorCategory} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                    <option value="">Select Category</option>
                    <option value="Independent Researcher">Independent Researcher</option>
                    <option value="Academic">Academic</option>
                    <option value="Journalist">Journalist</option>
                    <option value="Student">Student</option>
                    <option value="Artisan">Artisan</option>
                    <option value="Other">Other</option>
                  </select>
                  {getFieldError('contributorCategory')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Country *</label>
                  <input type="text" name="country" value={formData.country} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('country')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">State/Region</label>
                  <input type="text" name="stateRegion" value={formData.stateRegion} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('stateRegion')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">City/District</label>
                  <input type="text" name="cityDistrict" value={formData.cityDistrict} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('cityDistrict')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Institutional Affiliation</label>
                  <input type="text" name="institutionalAffiliation" value={formData.institutionalAffiliation} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('institutionalAffiliation')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Professional Role</label>
                  <input type="text" name="professionalRole" value={formData.professionalRole} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('professionalRole')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Portfolio URL</label>
                  <input type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('portfolioUrl')}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Short Bio *</label>
                  <textarea name="shortBio" value={formData.shortBio} onChange={handleChange} required rows={4} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition"></textarea>
                  {getFieldError('shortBio')}
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                Story Details
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Title of Submission *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('title')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Pitch or Synopsis (100 - 300 words) *</label>
                  <textarea name="synopsis" value={formData.synopsis} onChange={handleChange} required rows={6} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition"></textarea>
                  {getFieldError('synopsis')}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Subject Featured</label>
                    <input type="text" name="subjectFeatured" value={formData.subjectFeatured} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('subjectFeatured')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Subject Location</label>
                    <input type="text" name="subjectLocation" value={formData.subjectLocation} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('subjectLocation')}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Research Details</label>
                    <textarea name="researchDetails" value={formData.researchDetails} onChange={handleChange} rows={3} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition"></textarea>
                    {getFieldError('researchDetails')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Previous Publication Status *</label>
                    <select name="previousPublicationStatus" value={formData.previousPublicationStatus} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                      <option value="">Select Status</option>
                      <option value="Unpublished">Unpublished</option>
                      <option value="Previously Published">Previously Published</option>
                      <option value="Under Review Elsewhere">Under Review Elsewhere</option>
                    </select>
                    {getFieldError('previousPublicationStatus')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Conflict of Interest</label>
                    <input type="text" name="conflictOfInterest" value={formData.conflictOfInterest} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('conflictOfInterest')}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">4</span>
                Supporting Elements
              </h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer">
                  <input type="checkbox" name="interviewsIncluded" checked={formData.interviewsIncluded} onChange={handleChange} className="w-5 h-5 accent-brand-primary" />
                  <span className="text-sm font-bold text-gray-700">Interviews Included</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer">
                  <input type="checkbox" name="fieldResearchIncluded" checked={formData.fieldResearchIncluded} onChange={handleChange} className="w-5 h-5 accent-brand-primary" />
                  <span className="text-sm font-bold text-gray-700">Field Research Included</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer">
                  <input type="checkbox" name="archiveConsulted" checked={formData.archiveConsulted} onChange={handleChange} className="w-5 h-5 accent-brand-primary" />
                  <span className="text-sm font-bold text-gray-700">Archive Consulted</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer">
                  <input type="checkbox" name="bibliographyIncluded" checked={formData.bibliographyIncluded} onChange={handleChange} className="w-5 h-5 accent-brand-primary" />
                  <span className="text-sm font-bold text-gray-700">Bibliography Included</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer">
                  <input type="checkbox" name="supportingEvidenceAvailable" checked={formData.supportingEvidenceAvailable} onChange={handleChange} className="w-5 h-5 accent-brand-primary" />
                  <span className="text-sm font-bold text-gray-700">Supporting Evidence Available</span>
                </label>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 mt-4">Existing Record IDs (Optional)</label>
                  <input type="text" name="existingRecordIds" value={formData.existingRecordIds} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('existingRecordIds')}
                </div>
              </div>
            </div>

            {/* Section 5: Declarations */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">5</span>
                Declarations
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'originalityDeclaration', label: 'I declare that this work is original and authored by me.' },
                  { name: 'copyrightDeclaration', label: 'I declare that I hold the necessary copyright for this submission.' },
                  { name: 'interviewConsent', label: 'I confirm that I have obtained consent from all interviewees.' },
                  { name: 'accuracyDeclaration', label: 'I confirm the accuracy of the information provided to the best of my knowledge.' },
                  { name: 'priorPublicationDeclaration', label: 'I declare the prior publication status accurately represents the work.' },
                  { name: 'sensitiveKnowledgeDeclaration', label: 'I confirm that no sensitive or restricted knowledge is improperly disclosed.' },
                  { name: 'editorialReviewAcknowledgement', label: 'I acknowledge and agree to the editorial review process.' }
                ].map(decl => (
                  <label key={decl.name} className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl cursor-pointer">
                    <input type="checkbox" name={decl.name} checked={(formData as any)[decl.name]} onChange={handleChange} required className="w-5 h-5 mt-0.5 accent-brand-primary shrink-0" />
                    <span className="text-sm font-bold text-gray-700">{decl.label} *</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section 6 */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">6</span>
                Uploads & Additional Information
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                    <FaUpload className="text-gray-400" /> Upload Manuscript or Portfolio Document (Optional)
                  </label>
                  <p className="text-xs text-gray-400 mb-3">PDF, DOCX, DOC, JPEG, PNG only • Maximum 250 MB</p>
                  {selectedFile ? (
                    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-2 truncate">
                        <FaCheckCircle className="text-green-500 shrink-0" />
                        <span className="text-sm text-gray-700 truncate">{selectedFile.name}</span>
                        <span className="text-xs text-gray-400">({formatBytes(selectedFile.size)})</span>
                      </div>
                      <button type="button" onClick={clearFile} className="text-xs font-bold text-red-500 hover:text-red-700">Remove</button>
                    </div>
                  ) : (
                    <input type="file" onChange={handleFileChange} className="w-full p-3 bg-white border border-gray-200 rounded-xl cursor-pointer text-sm" />
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Access Restrictions</label>
                    <input type="text" name="accessRestrictions" value={formData.accessRestrictions} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('accessRestrictions')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Translation Support Required</label>
                    <input type="text" name="translationSupportRequired" value={formData.translationSupportRequired} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('translationSupportRequired')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Timeframe</label>
                    <input type="text" name="preferredTimeframe" value={formData.preferredTimeframe} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('preferredTimeframe')}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Additional Notes</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition"></textarea>
                    {getFieldError('notes')}
                  </div>
                </div>
              </div>
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-brand-primary text-white font-black text-lg rounded-xl hover:bg-brand-secondary transition shadow-xl mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <><FaSpinner className="animate-spin inline mr-2" /> {uploadProgress ? "Uploading Document..." : "Submitting Details..."}</>
              ) : (
                "Submit Story Proposal"
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
`;

fs.writeFileSync('C:/Users/Fayaz/Sufipulseupdate2026/HCRF 2026/hcr_foundation_full_govind/frontend/src/app/(main)/master-artisans/submit-story/page.tsx', code, 'utf-8');
console.log('done');
