"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { FaCheckCircle, FaUpload, FaSpinner } from 'react-icons/fa';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { becomeContributorHeroFallback } from '@/config/heroFallbacks';
import { uploadFile } from '@/lib/cloudinary';

export default function ContributorWorkflow() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    stateRegion: '',
    districtCity: '',
    pinCode: '',
    currentAddress: '',
    preferredContactMethod: '',

    contributorCategory: '',
    currentProfession: '',
    organization: '',
    highestQualification: '',
    shortBio: '',

    linkedinProfile: '',
    personalWebsite: '',
    portfolioUrl: '',
    orcidProfile: '',
    existingHcrfMemberId: '',

    areasOfContribution: [] as string[],
    primaryCraftSpecialisation: '',
    additionalCraftSpecialisations: '',
    natureOfKnowledge: '',
    yearsOfExperience: '',
    geographicAvailability: '',
    accessibleDistricts: '',
    preferredEngagementType: '',
    availability: '',
    timeCommitment: '',

    equipmentAndSoftware: '',
    relevantCertifications: '',
    relevantTraining: '',
    referenceName: '',
    referenceOrganization: '',
    referenceRelationship: '',
    referenceEmail: '',
    referencePhone: '',

    motivation: '',
    proposedContribution: '',
    relevantCommunityAccess: '',
    conflictOfInterest: '',

    declarationAccuracy: false,
    declarationRights: false,
    declarationEthical: false,
    declarationConfidentiality: false,
    declarationRepresentation: false,
    declarationSelection: false,
    declarationPrivacy: false
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

  const handleCheckboxArray = (skill: string) => {
    setFormData(prev => {
      const exists = prev.areasOfContribution.includes(skill);
      return {
        ...prev,
        areasOfContribution: exists 
          ? prev.areasOfContribution.filter(s => s !== skill) 
          : [...prev.areasOfContribution, skill]
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
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
          const errMessage = uploadErr instanceof Error ? uploadErr.message : 'Upload failed. Please try again.';
          setErrorMsg(errMessage);
          setIsSubmitting(false);
          setUploadProgress(false);
          return;
        }
        setUploadProgress(false);
      }

      const payload = {
        ...formData,
        areasOfContribution: formData.areasOfContribution.join(', '),
        ...(mediaAssets ? { mediaAssets } : {})
      };

      const res = await fetch(`/api/backend/participation/contributor`, {
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
        if (err.errors && Array.isArray(err.errors)) {
          const errorsObj: Record<string, string> = {};
          err.errors.forEach((e: any) => {
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
            <h3 className="text-3xl font-black text-brand-dark mb-4">Application Received</h3>
            <p className="text-xl text-gray-700 mb-8 font-medium">Thank you for volunteering your expertise.</p>
            <div className="max-w-md mx-auto text-left mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-600">
              <p className="leading-relaxed">Our archival curation team will review your professional profile and resume documents, then get in touch to discuss potential preservation initiatives.</p>
            </div>
            <Link href="/master-artisans" className="inline-block px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-xl transition shadow-md">
              Return Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const skillsList = ['Field Researcher', 'Translator (Kashmiri/English)', 'Photographer', 'Videographer', 'Oral Historian', 'Academic Researcher', 'Technical Writer', 'Other'];

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-gray-800 font-sans pb-24 selection:bg-[#D4AF37] selection:text-[#3E2723]">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <UniversalEditorialHero pageKey="become-contributor" fallbackConfig={becomeContributorHeroFallback as any} />
      
      <section className="container mx-auto px-4 max-w-4xl mt-[-40px] relative z-10 mb-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h2 className="text-3xl font-black text-brand-dark mb-6">Become a Master Artisans Contributor</h2>
          <div className="prose prose-lg text-gray-600 mb-8 max-w-none">
            <p>Collaborate with our research and conservation teams to document, preserve, and transcribe living craft techniques across Kashmir.</p>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 my-6">
              <h4 className="text-amber-800 font-bold mb-2 flex items-center">Important Notice</h4>
              <p className="text-amber-900 text-sm m-0">Contributor opportunities may be voluntary, commissioned, grant-funded, fellowship-based, internship-based, or project-specific. The applicable terms, deliverables, expenses, attribution, intellectual-property rights, and compensation will be defined in writing before any assignment begins.</p>
            </div>
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
                Applicant Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('fullName')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('email')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('phone')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Country *</label>
                  <input type="text" name="country" value={formData.country} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('country')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">State / Region *</label>
                  <input type="text" name="stateRegion" value={formData.stateRegion} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('stateRegion')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">District / City *</label>
                  <input type="text" name="districtCity" value={formData.districtCity} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('districtCity')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">PIN Code</label>
                  <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('pinCode')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Contact Method</label>
                  <input type="text" name="preferredContactMethod" value={formData.preferredContactMethod} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('preferredContactMethod')}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Current Address</label>
                  <input type="text" name="currentAddress" value={formData.currentAddress} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('currentAddress')}
                </div>
              </div>
            </div>

            {/* Section 2 & 3 */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                Contribution Profile
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Contributor Category *</label>
                    <select name="contributorCategory" value={formData.contributorCategory} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                      <option value="">Select Category</option>
                      <option value="Independent Contributor">Independent Contributor</option>
                      <option value="Institution/Organisation">Institution/Organisation</option>
                      <option value="Student/Fellow">Student/Fellow</option>
                      <option value="Other">Other</option>
                    </select>
                    {getFieldError('contributorCategory')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Current Profession *</label>
                    <input type="text" name="currentProfession" value={formData.currentProfession} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('currentProfession')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Organization</label>
                    <input type="text" name="organization" value={formData.organization} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('organization')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Highest Qualification</label>
                    <input type="text" name="highestQualification" value={formData.highestQualification} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('highestQualification')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Portfolio / Website URL</label>
                    <input type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="https://" />
                    {getFieldError('portfolioUrl')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">LinkedIn Profile</label>
                    <input type="url" name="linkedinProfile" value={formData.linkedinProfile} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="https://linkedin.com/in/..." />
                    {getFieldError('linkedinProfile')}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Areas of Contribution *</label>
                  <div className={`grid grid-cols-2 gap-4 mt-2 p-2 ${fieldErrors.areasOfContribution ? 'border border-red-500 bg-red-50 rounded-xl' : ''}`}>
                    {skillsList.map(skill => (
                      <label key={skill} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-brand-primary cursor-pointer transition">
                        <input 
                          type="checkbox" 
                          checked={formData.areasOfContribution.includes(skill)} 
                          onChange={() => handleCheckboxArray(skill)} 
                          className="w-5 h-5 accent-brand-primary shrink-0" 
                        />
                        <span className="text-sm font-semibold text-gray-700">{skill}</span>
                      </label>
                    ))}
                  </div>
                  {fieldErrors.areasOfContribution && <p className="mt-1 text-xs font-bold text-red-500">{fieldErrors.areasOfContribution}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Short Bio * (10 words min)</label>
                  <textarea name="shortBio" value={formData.shortBio} onChange={handleChange} required rows={4} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition"></textarea>
                  {getFieldError('shortBio')}
                </div>
              </div>
            </div>

            {/* Section 4 & 5 */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                Engagement Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Years of Experience *</label>
                  <input type="text" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('yearsOfExperience')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Geographic Availability *</label>
                  <input type="text" name="geographicAvailability" value={formData.geographicAvailability} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('geographicAvailability')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Engagement Type *</label>
                  <select name="preferredEngagementType" value={formData.preferredEngagementType} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                    <option value="">Select Type</option>
                    <option value="Voluntary">Voluntary</option>
                    <option value="Paid Commission">Paid Commission</option>
                    <option value="Fellowship">Fellowship</option>
                    <option value="Internship">Internship</option>
                    <option value="Project-Specific">Project-Specific</option>
                  </select>
                  {getFieldError('preferredEngagementType')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Availability *</label>
                  <input type="text" name="availability" value={formData.availability} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="e.g. Weekends, Full-time..." />
                  {getFieldError('availability')}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Time Commitment *</label>
                  <input type="text" name="timeCommitment" value={formData.timeCommitment} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('timeCommitment')}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Why do you want to contribute to the archive? * (150-500 words)</label>
                  <textarea name="motivation" value={formData.motivation} onChange={handleChange} required rows={5} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition"></textarea>
                  {getFieldError('motivation')}
                </div>
              </div>
            </div>

            {/* Section: Uploads */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">4</span>
                Work Samples & CV
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
                    <FaUpload className="text-gray-400" /> Upload CV or Work Sample
                  </label>
                  <p className="text-xs text-gray-400 mb-3">PDF, DOC, DOCX only • Maximum 10 MB</p>
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
                  {getFieldError('mediaAssets')}
                </div>
              </div>
            </div>

            {/* Section: Declarations */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">5</span>
                Declarations
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'declarationAccuracy', label: 'I declare that the information provided is accurate and true.' },
                  { name: 'declarationRights', label: 'I agree to the intellectual property and rights terms for contributors.' },
                  { name: 'declarationEthical', label: 'I agree to adhere to the Kashmir Heritage Craft Archive’s safeguarding and ethics policy during any field research.' },
                  { name: 'declarationConfidentiality', label: 'I understand and agree to maintain confidentiality regarding sensitive community knowledge.' },
                  { name: 'declarationRepresentation', label: 'I confirm that I do not misrepresent myself as a government official or KHCRF employee without authorisation.' },
                  { name: 'declarationSelection', label: 'I understand that being an approved contributor does not automatically grant publication rights or a commission.' },
                  { name: 'declarationPrivacy', label: 'I accept the privacy policy regarding the storage and processing of my data.' }
                ].map(decl => (
                  <label key={decl.name} className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl cursor-pointer">
                    <input type="checkbox" name={decl.name} checked={(formData as any)[decl.name]} onChange={handleChange} required className="w-5 h-5 mt-0.5 accent-brand-primary shrink-0" />
                    <span className="text-sm font-bold text-gray-700">{decl.label} *</span>
                  </label>
                ))}
              </div>
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-brand-primary text-white font-black text-lg rounded-xl hover:bg-brand-secondary transition shadow-xl mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? (
                <><FaSpinner className="animate-spin inline mr-2" /> {uploadProgress ? "Uploading Document..." : "Submitting Details..."}</>
              ) : (
                "Submit Application"
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
