'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { nominateArtisanHeroFallback } from '@/config/heroFallbacks';
import { uploadFile } from '@/lib/cloudinary';
import { getCraftsByCategory } from '@/config/craftRegistry';

export default function NominatePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submissionRef, setSubmissionRef] = useState('');
  const [uploadProgress, setUploadProgress] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    nomineeName: '',
    nominationType: 'MASTER_ARTISAN', // MASTER_ARTISAN, LIVING_LEGEND, WOMEN_ARTISAN, EMERGING_ARTISAN, APPRENTICE, WORKSHOP
    primaryCraft: '',
    secondaryCrafts: [] as string[],
    yearsOfPractice: '',
    unionTerritory: '',
    district: '',
    tehsil: '',
    village: '',
    pinCode: '',
    fullAddress: '',
    landmark: '',
    notes: '', // Why nominating
    nominatorInfo: '', // Name
    relationship: '',
    consentGiven: false,

    // Artisan Identification
    hasGovtArtisanId: '',
    govtArtisanId: '',
    artisanRegistrationType: '',
    artisanIssuingAuthority: '',
    artisanYearOfRegistration: '',
    existingHcrfArtisanId: '',

    // Workshop Identification
    hasWorkshop: '',
    workshopName: '',
    workshopType: '',
    isWorkshopRegistered: '',
    workshopId: '',
    workshopRegistrationType: '',
    workshopIssuingAuthority: '',
    workshopYearOfRegistration: '',
    workshopAddress: '',
    workshopPinCode: '',
    existingHcrfWorkshopId: ''
  });

  const [artisanDocFile, setArtisanDocFile] = useState<File | null>(null);
  const [workshopDocFile, setWorkshopDocFile] = useState<File | null>(null);

  const [nominatorEmail, setNominatorEmail] = useState('');
  const [nominatorPhone, setNominatorPhone] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && name === 'consentGiven') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Basic mime type check (doesn't read magic bytes, but better than nothing for client side)
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrorMsg('Invalid file format. Only JPEG, PNG, and WEBP are allowed.');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('File size exceeds the 10MB limit.');
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

  const handleArtisanDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setArtisanDocFile(e.target.files[0]);
  };

  const handleWorkshopDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setWorkshopDocFile(e.target.files[0]);
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
    setLoading(true);
    setErrorMsg('');
    setFieldErrors({});

    // Rule: LIVING_LEGEND requires established senior classification (20+ years of practice)
    const yrs = parseInt(formData.yearsOfPractice as string, 10) || 0;
    if (formData.nominationType === 'LIVING_LEGEND' && yrs < 20) {
      setFieldErrors({
        yearsOfPractice: 'Living Legend nominations require at least 20 years of documented senior master practice.'
      });
      setErrorMsg('Warning: A Living Legend nomination must be backed by established senior master classification (min 20 years practice).');
      setLoading(false);
      return;
    }

    try {
      let mediaAssets = undefined;
      const assetsToCreate: Record<string, unknown>[] = [];
      setUploadProgress(true);
      try {
        if (selectedFile) {
          const fileUrl = await uploadFile(selectedFile);
          assetsToCreate.push({
            mediaType: 'IMAGE',
            storageProvider: 'cloudinary',
            publicUrl: fileUrl,
            fileName: selectedFile.name,
            sizeBytes: selectedFile.size,
            mimeType: selectedFile.type,
          });
        }
        if (artisanDocFile) {
          const fileUrl = await uploadFile(artisanDocFile);
          assetsToCreate.push({
            mediaType: 'DOCUMENT',
            storageProvider: 'cloudinary',
            publicUrl: fileUrl,
            fileName: artisanDocFile.name,
            sizeBytes: artisanDocFile.size,
            mimeType: artisanDocFile.type,
          });
        }
        if (workshopDocFile) {
          const fileUrl = await uploadFile(workshopDocFile);
          assetsToCreate.push({
            mediaType: 'DOCUMENT',
            storageProvider: 'cloudinary',
            publicUrl: fileUrl,
            fileName: workshopDocFile.name,
            sizeBytes: workshopDocFile.size,
            mimeType: workshopDocFile.type,
          });
        }
        
        if (assetsToCreate.length > 0) {
          mediaAssets = { create: assetsToCreate };
        }
      } catch (uploadErr) {
        const errMessage = uploadErr instanceof Error ? uploadErr.message : 'File upload failed. Please try again.';
        setErrorMsg(errMessage);
        setLoading(false);
        setUploadProgress(false);
        return;
      }
      setUploadProgress(false);

      const payload = {
        ...formData,
        secondaryCrafts: formData.secondaryCrafts.join(', '),
        nominatorEmail,
        nominatorPhone,
        yearsOfPractice: parseInt(formData.yearsOfPractice as string, 10) || 0,
        ...(mediaAssets ? { mediaAssets } : {})
      };
      

      const res = await fetch(`/api/backend/participation/nominate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an unexpected non-JSON response. Please try again.');
      }

      const responseData = await res.json();

      if (!res.ok) {
        const apiErrors = responseData.errors || responseData.data?.errors;
        if (apiErrors && Array.isArray(apiErrors)) {
          const errorsObj: Record<string, string> = {};
          apiErrors.forEach((e: { field: string; message: string }) => {
            errorsObj[e.field] = e.message;
          });
          setFieldErrors(errorsObj);
          setErrorMsg('Please correct the highlighted fields before submitting.');
        } else {
          setErrorMsg(
            responseData.error ||
            responseData.data?.error ||
            responseData.message ||
            responseData.data?.message ||
            'Failed to submit nomination. Please try again.'
          );
        }
        setLoading(false);
        return;
      }

      // Verify the backend actually persisted the record by checking for a returned ID
      const persistedId =
        responseData?.data?.data?.submissionNumber ||
        responseData?.data?.data?.id ||
        responseData?.data?.submissionNumber ||
        responseData?.data?.id ||
        responseData?.submissionNumber ||
        responseData?.id;

      if (!persistedId) {
        throw new Error(
          'The server did not confirm that your nomination was saved. Please try again or contact support.'
        );
      }

      setSubmissionRef(persistedId);
      setSuccess(true);
    } catch (err: unknown) {
      console.error('[NominationForm] Unexpected error during submission:', err);
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    }
    setLoading(false);
  };

  const getFieldError = (fieldName: string) => {
    return fieldErrors[fieldName] ? (
      <p className="mt-1.5 text-sm text-red-600 font-medium animate-fadeIn flex items-center">
        <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
        {fieldErrors[fieldName]}
      </p>
    ) : null;
  };

  if (success) {
    return (
      <main className="w-full bg-[#FAF9F6] min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto px-6 animate-fadeIn">
          <div className="bg-brand-primary/5 p-8 md:p-12 rounded-3xl border border-brand-primary/20 text-center shadow-sm">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
            <h3 className="text-3xl font-black text-brand-dark mb-4">Nomination Confirmed</h3>
            <p className="text-xl text-gray-700 mb-8 font-medium">Thank you for helping preserve Kashmir&apos;s living legacy.</p>
            {submissionRef && (
              <div className="max-w-md mx-auto mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Your Submission Reference</p>
                <p className="font-mono text-brand-primary font-bold text-lg">{submissionRef}</p>
                <p className="text-xs text-gray-400 mt-1">Please keep this number for your records.</p>
              </div>
            )}
            <div className="max-w-md mx-auto text-left mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-600">
              <p className="leading-relaxed">Our documentation committee will review the submission details and verify the master artisan&apos;s lineage shortly. You will be contacted if additional information is required.</p>
            </div>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-xl transition shadow-md">
              Submit Another Nomination
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-gray-800 font-sans pb-32 selection:bg-[#D4AF37] selection:text-[#3E2723]">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <UniversalEditorialHero pageKey="nominate-artisan" fallbackConfig={nominateArtisanHeroFallback as any} />

      <section className="container mx-auto px-4 max-w-4xl mt-[-40px] relative z-10 mb-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h2 className="text-3xl font-black text-brand-dark mb-6">Nominate to the Kashmir Heritage Craft Archive</h2>
          <div className="prose prose-lg text-gray-600 mb-8 max-w-none">
            <p>
              Help identify, document, and preserve the lives, skills, and legacies of Kashmir’s craftspeople and heritage workshops.
              Select what you would like to nominate below to begin the unified nomination workflow for <strong>Master Artisans</strong>, <strong>Living Legends</strong>, <strong>Women Artisans</strong>, <strong>Emerging Artisans</strong>, <strong>Apprentices</strong>, or <strong>Workshop Communities</strong>.
            </p>
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

            {/* Step 0: What would you like to nominate? */}
            <div className="bg-brand-primary/5 p-8 rounded-3xl border border-brand-primary/20">
              <h3 className="text-xl font-bold text-brand-dark mb-2 flex items-center border-b border-brand-primary/10 pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">0</span>
                What would you like to nominate?
              </h3>
              <p className="text-xs text-gray-500 mb-6 font-medium">Select a category below. The unified nomination system dynamically adjusts relevant fields for your entry.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: 'MASTER_ARTISAN', label: 'Master Artisan', desc: '20+ yrs practice & masterwork' },
                  { id: 'LIVING_LEGEND', label: 'Living Legend', desc: 'National awardee / senior master' },
                  { id: 'WOMEN_ARTISAN', label: 'Women Artisan', desc: 'Female craftsperson & weaver' },
                  { id: 'EMERGING_ARTISAN', label: 'Emerging Artisan', desc: '1–20 yrs active practice' },
                  { id: 'APPRENTICE', label: 'Apprentice', desc: 'Trainee under master / workshop' },
                  { id: 'WORKSHOP', label: 'Workshop Community', desc: 'Karkhana / cluster / family unit' },
                ].map(type => {
                  const isSelected = formData.nominationType === type.id;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setFormData(prev => ({ ...prev, nominationType: type.id }))}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 text-left ${
                        isSelected 
                          ? 'bg-white border-brand-primary shadow-md ring-2 ring-brand-primary/20' 
                          : 'bg-white/80 border-gray-200 hover:border-gray-300 hover:bg-white'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-brand-primary bg-editorial-accent' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? 'text-brand-dark' : 'text-gray-800'}`}>
                          {type.label}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {type.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 1: Nominee / Workshop Details */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                {formData.nominationType === 'WORKSHOP' ? "Workshop Community Details" : "Nominee Details"}
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      {formData.nominationType === 'WORKSHOP' ? "Workshop / Karkhana Name *" : "Artisan / Nominee Name *"}
                    </label>
                    <input 
                      type="text" 
                      name="nomineeName" 
                      value={formData.nomineeName} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" 
                      placeholder={formData.nominationType === 'WORKSHOP' ? "e.g. Hassan Karkhana & Weavers" : "e.g. Master Ali Mohammad"} 
                    />
                    {getFieldError('nomineeName')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Primary Craft Category *</label>
                    <select name="primaryCraft" value={formData.primaryCraft} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                      <option value="">Select Primary Craft</option>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative" ref={secondaryDropdownRef}>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Secondary Craft Categories (Optional)</label>
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
                      <div className="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${secondaryDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
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
                                  className={`px-4 py-3 flex items-center cursor-pointer transition-colors hover:bg-brand-primary/5 ${isSelected ? 'bg-brand-primary/5' : ''}`}
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
                                  <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'border-gray-300 bg-white'}`}>
                                    {isSelected && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                  </div>
                                  <span className={`text-sm ${isSelected ? 'font-semibold text-brand-dark' : 'text-gray-700'}`}>
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
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Years of Practice *
                    </label>
                    <input 
                      type="number" 
                      name="yearsOfPractice" 
                      value={formData.yearsOfPractice} 
                      onChange={handleChange} 
                      min={
                        formData.nominationType === 'APPRENTICE' || formData.nominationType === 'EMERGING_ARTISAN' 
                          ? "1" 
                          : formData.nominationType === 'WOMEN_ARTISAN' || formData.nominationType === 'WORKSHOP' 
                            ? "3" 
                            : "20"
                      } 
                      required 
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" 
                      placeholder={
                        formData.nominationType === 'APPRENTICE' 
                          ? "e.g. 2 (Min. 1 year for apprentices)" 
                          : formData.nominationType === 'EMERGING_ARTISAN'
                            ? "e.g. 5 (Min. 1 year for emerging artisans)"
                            : "Min. 20 for Master Artisans & Living Legends"
                      } 
                    />
                    <p className="text-xs text-gray-400 mt-1.5 font-medium">
                      {formData.nominationType === 'APPRENTICE' && "Apprentices require at least 1 year of active training under a recognized master or workshop."}
                      {formData.nominationType === 'EMERGING_ARTISAN' && "Emerging artisans require at least 1–5 years of independent craft practice."}
                      {formData.nominationType === 'WOMEN_ARTISAN' && "Women artisans require at least 3 years of verified craft contribution."}
                      {formData.nominationType === 'WORKSHOP' && "Workshop communities require at least 3 years of continuous operation."}
                      {(formData.nominationType === 'MASTER_ARTISAN' || formData.nominationType === 'LIVING_LEGEND') && "Master Artisans & Living Legends require 20+ years of documented practice."}
                    </p>
                    {getFieldError('yearsOfPractice')}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Location Details */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                Location Details
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Union Territory / Region</label>
                    <input type="text" name="unionTerritory" value={formData.unionTerritory} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="e.g. Jammu & Kashmir" />
                    {getFieldError('unionTerritory')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">District *</label>
                    <input type="text" name="district" value={formData.district} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="e.g. Srinagar" />
                    {getFieldError('district')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tehsil / Sub-district *</label>
                    <input type="text" name="tehsil" value={formData.tehsil} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="e.g. Khanyar" />
                    {getFieldError('tehsil')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Village / Town / Mohalla *</label>
                    <input type="text" name="village" value={formData.village} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="e.g. Safa Kadal" />
                    {getFieldError('village')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">PIN Code *</label>
                    <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} required maxLength={6} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="190002" />
                    {getFieldError('pinCode')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Address</label>
                    <input type="text" name="fullAddress" value={formData.fullAddress} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="Street address..." />
                    {getFieldError('fullAddress')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Landmark</label>
                    <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="Near..." />
                    {getFieldError('landmark')}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Artisan Identification */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                Identification & Registration
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {formData.nominationType === 'APPRENTICE'
                      ? "Does the apprentice have a government or institutional registration or trainee ID? *"
                      : formData.nominationType === 'WORKSHOP'
                        ? "Does the workshop have a government or MSME registration? *"
                        : "Does the artisan have a government-issued artisan registration or identity number? *"
                    }
                  </label>
                  <select name="hasGovtArtisanId" value={formData.hasGovtArtisanId} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                    <option value="">Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Applied, awaiting approval">Applied, awaiting approval</option>
                    <option value="Not known">Not known</option>
                  </select>
                  {getFieldError('hasGovtArtisanId')}
                </div>

                {formData.hasGovtArtisanId === 'Yes' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Government Artisan ID / Registration Number *</label>
                      <input type="text" name="govtArtisanId" value={formData.govtArtisanId} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                      {getFieldError('govtArtisanId')}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Registration Type *</label>
                      <select name="artisanRegistrationType" value={formData.artisanRegistrationType} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                        <option value="">Select Type</option>
                        <option value="J&K Handicrafts Artisan Registration">J&K Handicrafts Artisan Registration</option>
                        <option value="J&K Handloom Weaver Registration">J&K Handloom Weaver Registration</option>
                        <option value="Weaver Identity Card">Weaver Identity Card</option>
                        <option value="Artisan Credit Card">Artisan Credit Card</option>
                        <option value="National Artisan Card">National Artisan Card</option>
                        <option value="Cooperative Membership ID">Cooperative Membership ID</option>
                        <option value="GI Authorised User Registration">GI Authorised User Registration</option>
                        <option value="Government Award Record">Government Award Record</option>
                        <option value="Other recognised registration">Other recognised registration</option>
                      </select>
                      {getFieldError('artisanRegistrationType')}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Issuing Authority *</label>
                      <input type="text" name="artisanIssuingAuthority" value={formData.artisanIssuingAuthority} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                      {getFieldError('artisanIssuingAuthority')}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Year of Registration</label>
                      <input type="text" name="artisanYearOfRegistration" value={formData.artisanYearOfRegistration} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                      {getFieldError('artisanYearOfRegistration')}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Supporting Document (Optional)</label>
                      <input type="file" onChange={handleArtisanDocChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition text-sm" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Existing KHCRF Artisan ID (Optional)</label>
                  <p className="text-xs text-gray-500 mb-2">Only for artisans already recorded in the KHCRF system. Example: KHCRF-MA-2026-000127</p>
                  <input type="text" name="existingHcrfArtisanId" value={formData.existingHcrfArtisanId} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="KHCRF-MA-..." />
                  {getFieldError('existingHcrfArtisanId')}
                </div>
              </div>
            </div>

            {/* Section 4: Workshop Identification */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">4</span>
                Workshop Identification
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Does the artisan work from a recognised or registered workshop? *</label>
                  <select name="hasWorkshop" value={formData.hasWorkshop} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                    <option value="">Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Not known">Not known</option>
                    <option value="No fixed workshop">No fixed workshop</option>
                  </select>
                  {getFieldError('hasWorkshop')}
                </div>

                {formData.hasWorkshop === 'Yes' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Workshop Name *</label>
                      <input type="text" name="workshopName" value={formData.workshopName} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                      {getFieldError('workshopName')}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Workshop Type *</label>
                      <select name="workshopType" value={formData.workshopType} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                        <option value="">Select Type</option>
                        <option value="Home-based workshop">Home-based workshop</option>
                        <option value="Independent artisan workshop">Independent artisan workshop</option>
                        <option value="Family workshop">Family workshop</option>
                        <option value="Cooperative workshop">Cooperative workshop</option>
                        <option value="Community workshop">Community workshop</option>
                        <option value="Master-apprentice workshop">Master-apprentice workshop</option>
                        <option value="Government-supported centre">Government-supported centre</option>
                        <option value="NGO-supported centre">NGO-supported centre</option>
                        <option value="Commercial production unit">Commercial production unit</option>
                        <option value="Other">Other</option>
                      </select>
                      {getFieldError('workshopType')}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Is the workshop formally registered? *</label>
                      <select name="isWorkshopRegistered" value={formData.isWorkshopRegistered} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                        <option value="">Select option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Not known">Not known</option>
                      </select>
                      {getFieldError('isWorkshopRegistered')}
                    </div>

                    {formData.isWorkshopRegistered === 'Yes' && (
                      <>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Workshop ID / Registration Number *</label>
                          <input type="text" name="workshopId" value={formData.workshopId} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                          {getFieldError('workshopId')}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Registration Type *</label>
                          <select name="workshopRegistrationType" value={formData.workshopRegistrationType} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                            <option value="">Select Type</option>
                            <option value="Government Workshop Registration">Government Workshop Registration</option>
                            <option value="Udyam / MSME Registration">Udyam / MSME Registration</option>
                            <option value="Cooperative Registration">Cooperative Registration</option>
                            <option value="Firm Registration">Firm Registration</option>
                            <option value="Society Registration">Society Registration</option>
                            <option value="GST Registration">GST Registration</option>
                            <option value="GI-authorised production unit">GI-authorised production unit</option>
                            <option value="Export Registration">Export Registration</option>
                            <option value="Other recognised registration">Other recognised registration</option>
                          </select>
                          {getFieldError('workshopRegistrationType')}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Issuing Authority *</label>
                          <input type="text" name="workshopIssuingAuthority" value={formData.workshopIssuingAuthority} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                          {getFieldError('workshopIssuingAuthority')}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Year of Registration</label>
                          <input type="text" name="workshopYearOfRegistration" value={formData.workshopYearOfRegistration} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                          {getFieldError('workshopYearOfRegistration')}
                        </div>
                      </>
                    )}

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Workshop Address</label>
                      <input type="text" name="workshopAddress" value={formData.workshopAddress} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                      {getFieldError('workshopAddress')}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Workshop PIN Code</label>
                      <input type="text" name="workshopPinCode" value={formData.workshopPinCode} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                      {getFieldError('workshopPinCode')}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Supporting Document (Optional)</label>
                      <input type="file" onChange={handleWorkshopDocChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition text-sm" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Existing KHCRF Workshop ID (Optional)</label>
                  <p className="text-xs text-gray-500 mb-2">Only when the workshop already exists in the KHCRF registry. Example: KHCRF-WS-2026-000084</p>
                  <input type="text" name="existingHcrfWorkshopId" value={formData.existingHcrfWorkshopId} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="KHCRF-WS-..." />
                  {getFieldError('existingHcrfWorkshopId')}
                </div>
              </div>
            </div>

            {/* Section 5: Nomination Details & Your Information */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">5</span>
                Nomination Details
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Why are you nominating them? *</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} required className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition resize-y" placeholder="Describe their unique skill, masterwork contributions, or heritage lineage..."></textarea>
                  {getFieldError('notes')}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Workshop Photo (Optional)</label>
                  <p className="text-xs text-gray-400 mb-3">JPEG, PNG, WEBP only • Maximum 10 MB</p>
                  {selectedFile ? (
                    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-sm text-gray-700 truncate">{selectedFile.name}</span>
                        <span className="text-xs text-gray-400">({formatBytes(selectedFile.size)})</span>
                      </div>
                      <button type="button" onClick={clearFile} className="text-xs font-bold text-red-500 hover:text-red-700">Remove</button>
                    </div>
                  ) : (
                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition cursor-pointer text-sm" />
                  )}
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Your Information (Nominator)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                      <input type="text" name="nominatorInfo" value={formData.nominatorInfo} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="Your Name" />
                      {getFieldError('nominatorInfo')}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                      <input type="email" value={nominatorEmail} onChange={e => setNominatorEmail(e.target.value)} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="you@example.com" />
                      {getFieldError('nominatorEmail')}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                      <input type="tel" value={nominatorPhone} onChange={e => setNominatorPhone(e.target.value)} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="+91 00000 00000" />
                      {getFieldError('nominatorPhone')}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Relationship to Artisan *</label>
                      <select name="relationship" value={formData.relationship} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                        <option value="">Select Relationship</option>
                        <option value="Self">Self</option>
                        <option value="Family Member">Family Member</option>
                        <option value="Apprentice">Apprentice</option>
                        <option value="Fellow Artisan">Fellow Artisan</option>
                        <option value="Cooperative Representative">Cooperative Representative</option>
                        <option value="Community Member">Community Member</option>
                        <option value="Researcher">Researcher</option>
                        <option value="Government Official">Government Official</option>
                        <option value="Institution">Institution</option>
                        <option value="Buyer or Collector">Buyer or Collector</option>
                        <option value="Other">Other</option>
                      </select>
                      {getFieldError('relationship')}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <label className="flex items-start space-x-3 cursor-pointer bg-white p-4 rounded-xl border border-gray-200">
                    <input type="checkbox" name="consentGiven" checked={formData.consentGiven} onChange={handleChange} required id="consentGiven" className="w-5 h-5 mt-0.5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                    <span className="text-sm font-bold text-gray-700">
                      {formData.nominationType === 'WORKSHOP' 
                        ? "I verify that I have permission from the workshop representatives to submit their details, craft history, and location to the Kashmir Heritage Craft Archive for public verification."
                        : "I verify that I have permission from the nominee (or their immediate family) to submit their name, craft history, and details to the Kashmir Heritage Craft Archive for public verification."
                      }
                    </span>
                  </label>
                  {getFieldError('consentGiven')}
                </div>

              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full py-4 bg-brand-primary text-white font-black text-lg rounded-xl hover:bg-brand-secondary transition shadow-xl mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (
                <><FaSpinner className="animate-spin inline mr-2" /> {uploadProgress ? "Uploading Photo..." : "Submitting Nomination..."}</>
              ) : (
                formData.nominationType === 'WORKSHOP' 
                  ? "Submit Workshop Community Nomination" 
                  : formData.nominationType === 'APPRENTICE'
                    ? "Submit Apprentice Nomination"
                    : formData.nominationType === 'LIVING_LEGEND'
                      ? "Submit Living Legend Nomination"
                      : formData.nominationType === 'WOMEN_ARTISAN'
                        ? "Submit Women Artisan Nomination"
                        : formData.nominationType === 'EMERGING_ARTISAN'
                          ? "Submit Emerging Artisan Nomination"
                          : "Submit Master Artisan Nomination"
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
