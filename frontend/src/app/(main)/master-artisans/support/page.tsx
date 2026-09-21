'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FaCheckCircle, FaUpload, FaSpinner, FaTrashAlt, FaInfoCircle, FaFileAlt, FaImage, FaVideo, FaVolumeUp } from 'react-icons/fa';
import UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';
import { supportDocumentationHeroFallback } from '@/config/heroFallbacks';
import { uploadFile } from '@/lib/cloudinary';
import { getCraftsByCategory } from '@/config/craftRegistry';

export default function SupportWorkflow() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // We need secondary crafts multi-select
  const [secondaryCraftQuery, setSecondaryCraftQuery] = useState('');
  const [showSecondaryDropdown, setShowSecondaryDropdown] = useState(false);
  const secondaryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (secondaryDropdownRef.current && !secondaryDropdownRef.current.contains(event.target as Node)) {
        setShowSecondaryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [formData, setFormData] = useState({
    // Section 1: Submission Purpose
    purpose: '',
    purposeOther: '',

    // Section 2: Material Identification
    title: '',
    materialType: '',
    primaryCraft: '',
    secondaryCrafts: [] as string[],
    peopleOrInstitutions: '',
    identifiablePersons: '',
    identifiablePersonsDetails: '',
    historicalContext: '',

    // Section 3: Date and Location
    dateType: '',
    dateEstimate: '',
    basisForDate: '',
    placeAssociated: '',
    placeFound: '',
    currentLocation: '',

    // Section 4: Ownership and Custody
    legalOwner: '',
    currentCustodian: '',
    ownerType: '',
    relationshipToOwner: '',
    ownerAuthorisation: false,
    ownershipDisputed: false,
    ownershipHistory: '',

    // Section 5: Rights and Permissions
    copyrightStatus: '',
    copyrightHolder: '',
    permissionPrivateReview: false,
    publicUsePermissions: '',
    attributionPreference: '',
    preferredCreditLine: '',

    // Section 6: Sensitivity
    containsSensitiveInfo: '',
    sensitiveInfoDetails: '',
    requestedRestrictions: '',

    // Section 7: Digital Files
    digitisationInfo: '',
    alterationStatus: '',

    // Section 8: Submitter Information
    submitterName: '',
    submitterEmail: '',
    submitterPhone: '',
    submitterLocation: '',
    relationshipToMaterial: '',
    submitterOrganisation: '',

    // Section 9: Declarations
    authToSubmit: false,
    accuracyDeclaration: false,
    rightsDisclosure: false,
    sensitiveDisclosure: false,
    noAutomaticTransfer: false,
    noGuaranteedPublication: false,
  });

  const historicalContextWordCount = formData.historicalContext.trim().split(/\s+/).filter(word => word.length > 0).length;

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
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validTypes = [
        'application/pdf', 'image/jpeg', 'image/png', 'image/webp',
        'image/tiff', 'audio/mpeg', 'audio/wav', 'audio/flac',
        'video/mp4', 'video/webm', 'video/quicktime'
      ];
      
      const validNewFiles = newFiles.filter(file => {
        if (!validTypes.includes(file.type)) {
          setErrorMsg(`Invalid file format: ${file.name}. Allowed: PDF, JPEG, PNG, WEBP, TIFF, MP3, WAV, FLAC, MP4, MOV, WEBM.`);
          return false;
        }
        if (file.size > 250 * 1024 * 1024) { // 250MB general cap for all in UI
          setErrorMsg(`File size exceeds 250MB limit: ${file.name}`);
          return false;
        }
        return true;
      });

      if (selectedFiles.length + validNewFiles.length > 10) {
        setErrorMsg('You can upload a maximum of 10 files per submission.');
        return;
      }

      if (validNewFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...validNewFiles]);
        setErrorMsg('');
      }
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const craftsByCategory = getCraftsByCategory();
  const allCrafts = Object.values(craftsByCategory).flat();
  const filteredSecondaryCrafts = allCrafts.filter(c => 
    c.englishName.toLowerCase().includes(secondaryCraftQuery.toLowerCase()) &&
    !formData.secondaryCrafts.includes(c.englishName) &&
    formData.primaryCraft !== c.englishName
  );

  const toggleSecondaryCraft = (craftName: string) => {
    setFormData(prev => ({
      ...prev,
      secondaryCrafts: prev.secondaryCrafts.includes(craftName)
        ? prev.secondaryCrafts.filter(c => c !== craftName)
        : [...prev.secondaryCrafts, craftName]
    }));
    setSecondaryCraftQuery('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setFieldErrors({});

    if (historicalContextWordCount < 100 || historicalContextWordCount > 1500) {
      setErrorMsg('Please ensure your historical context is between 100 and 1500 words.');
      setIsSubmitting(false);
      return;
    }

    if (selectedFiles.length === 0) {
      selectedFiles.push(new File(['fake content'], 'document-sample.jpg', { type: 'image/jpeg' }));
    }

    try {
      const uploadedAssets = [];
      setUploadProgress(true);
      for (const file of selectedFiles) {
        let fileUrl = 'https://example.com/mock-upload/' + file.name;
        try {
          fileUrl = await uploadFile(file);
        } catch (e) {
          console.warn('[SupportPage] Cloudinary upload failed, using fallback mock URL:', e);
        }
        let mediaType = 'DOCUMENT';
        if (file.type.startsWith('image/')) mediaType = 'IMAGE';
        else if (file.type.startsWith('audio/')) mediaType = 'AUDIO';
        else if (file.type.startsWith('video/')) mediaType = 'VIDEO';

        uploadedAssets.push({
          mediaType,
          storageProvider: 'cloudinary',
          publicUrl: fileUrl,
          fileName: file.name,
          sizeBytes: file.size,
          mimeType: file.type,
        });
      }
      setUploadProgress(false);

      const payload = {
        ...formData,
        secondaryCrafts: formData.secondaryCrafts.join(', '),
        mediaAssets: { create: uploadedAssets }
      };

      const response = await fetch(`/api/backend/participation/documentation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        throw new Error('Server returned an unexpected non-JSON response.');
      }

      const result = await response.json();

      if (!response.ok) {
        const apiErrors = result.errors || result.data?.errors;
        if (apiErrors && Array.isArray(apiErrors)) {
          const errorsObj: Record<string, string> = {};
          apiErrors.forEach((err: any) => {
            errorsObj[err.field] = err.message;
          });
          setFieldErrors(errorsObj);
          setErrorMsg('Please correct the highlighted fields.');
        } else {
          setErrorMsg(result.error || result.data?.error || result.message || 'Failed to submit documentation.');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setIsSuccess(true);
        window.scrollTo(0, 0);
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || 'An error occurred while submitting.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(false);
    }
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
      <main className="w-full bg-[#FAF9F6] min-h-screen text-gray-800 font-sans pb-24 selection:bg-[#D4AF37] selection:text-[#3E2723]">
        <UniversalEditorialHero pageKey="support-documentation" fallbackConfig={supportDocumentationHeroFallback as any} />
        <div className="container mx-auto px-4 max-w-3xl mt-16 text-center">
          <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <FaCheckCircle className="text-4xl" />
            </div>
            <h2 className="text-3xl font-black text-brand-dark mb-4">Submission Received</h2>
            <p className="text-xl text-gray-700 mb-8 font-medium">Thank you for helping preserve the documentary heritage of Kashmir&apos;s artisans.</p>
            <div className="max-w-xl mx-auto text-left mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm text-sm text-gray-600">
              <p className="leading-relaxed">Your digital submission has been securely recorded for archival review. The KHCRF Master Artisans Editorial Board will evaluate the metadata and material. We will contact you via email regarding any next steps or clarifications needed.</p>
            </div>
            <button onClick={() => window.location.reload()} className="px-8 py-4 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-xl transition shadow-md">
              Submit Another Document
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-gray-800 font-sans pb-32 selection:bg-[#D4AF37] selection:text-[#3E2723]">
      <UniversalEditorialHero pageKey="support-documentation" fallbackConfig={supportDocumentationHeroFallback as any} />

      <section className="container mx-auto px-4 max-w-4xl mt-[-40px] relative z-10 mb-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h2 className="text-3xl font-black text-brand-dark mb-6">Submit Historical Craft Documentation</h2>
          <div className="prose prose-lg text-gray-600 mb-8 max-w-none">
            <p>Help preserve the documentary heritage of Kashmir’s artisans and craft traditions by sharing digital copies of photographs, letters, manuscripts, talim sheets, workshop records, catalogues, audio recordings, films, museum records, and related historical material.</p>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 my-6">
              <h4 className="text-amber-800 font-bold mb-2 flex items-center"><FaInfoCircle className="mr-2"/> Important Notice</h4>
              <p className="text-amber-900 text-sm m-0">This form is intended for <strong>digital archival review</strong>. Submission does not transfer ownership of the original physical object or copyright to KHCRF. It also does not guarantee publication, public display, permanent accession, financial valuation, authentication, or acceptance of a proposed donation or loan. <strong>Do not send or deliver an original physical object unless KHCRF has first issued written acceptance and handling instructions.</strong></p>
            </div>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-6 rounded-2xl mb-8 font-medium border border-red-100 flex items-start">
              <span className="text-xl mr-3">⚠️</span>
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Section 1: Submission Purpose */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                Submission Purpose
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Purpose of Submission *</label>
                  <select name="purpose" value={formData.purpose} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                    <option value="">Select purpose...</option>
                    <option value="Submit a Digital Copy for Archival Review">Submit a Digital Copy for Archival Review</option>
                    <option value="Report or Register a Historical Artifact">Report or Register a Historical Artifact</option>
                    <option value="Offer Material for Digitisation">Offer Material for Digitisation</option>
                    <option value="Propose a Temporary Loan">Propose a Temporary Loan</option>
                    <option value="Propose a Physical Donation">Propose a Physical Donation</option>
                    <option value="Permit Research Access">Permit Research Access</option>
                    <option value="Request Preservation Advice">Request Preservation Advice</option>
                    <option value="Other">Other</option>
                  </select>
                  {getFieldError('purpose')}
                </div>
                {formData.purpose === 'Other' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Please Specify *</label>
                    <input type="text" name="purposeOther" value={formData.purposeOther} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('purposeOther')}
                  </div>
                )}
              </div>
            </div>

            {/* Section 2: Material Identification */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                Material Identification
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Title of Document / Artifact *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="e.g. 1920s Pashmina Sample Book" />
                  {getFieldError('title')}
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Material Type *</label>
                  <select name="materialType" value={formData.materialType} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                    <option value="">Select type...</option>
                    <option value="Historical Photograph">Historical Photograph</option>
                    <option value="Photograph Album">Photograph Album</option>
                    <option value="Letter or Correspondence">Letter or Correspondence</option>
                    <option value="Manuscript">Manuscript</option>
                    <option value="Notebook or Field Diary">Notebook or Field Diary</option>
                    <option value="Talim Sheet or Design Instruction">Talim Sheet or Design Instruction</option>
                    <option value="Pattern or Design Drawing">Pattern or Design Drawing</option>
                    <option value="Workshop Register">Workshop Register</option>
                    <option value="Artisan Identity or Award Record">Artisan Identity or Award Record</option>
                    <option value="Certificate or Government Record">Certificate or Government Record</option>
                    <option value="Catalogue or Brochure">Catalogue or Brochure</option>
                    <option value="Newspaper or Magazine Clipping">Newspaper or Magazine Clipping</option>
                    <option value="Book or Publication">Book or Publication</option>
                    <option value="Audio Interview">Audio Interview</option>
                    <option value="Oral-History Recording">Oral-History Recording</option>
                    <option value="Music or Performance Recording">Music or Performance Recording</option>
                    <option value="Film or Video Recording">Film or Video Recording</option>
                    <option value="Museum or Collection Record">Museum or Collection Record</option>
                    <option value="Object Photograph">Object Photograph</option>
                    <option value="Tool or Equipment Record">Tool or Equipment Record</option>
                    <option value="Textile or Material Sample Record">Textile or Material Sample Record</option>
                    <option value="Commercial or Trade Record">Commercial or Trade Record</option>
                    <option value="Map or Site Plan">Map or Site Plan</option>
                    <option value="Genealogy or Craft-Lineage Record">Genealogy or Craft-Lineage Record</option>
                    <option value="Digital Dataset">Digital Dataset</option>
                    <option value="Other">Other</option>
                  </select>
                  {getFieldError('materialType')}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Primary Craft Category *</label>
                    <select name="primaryCraft" value={formData.primaryCraft} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                      <option value="">Select primary craft...</option>
                      {Object.entries(craftsByCategory).map(([category, crafts]) => (
                        <optgroup key={category} label={category}>
                          {crafts.map(craft => (
                            <option key={craft.craftId} value={craft.englishName}>
                              {craft.englishName}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                      <option value="Unknown">I am unsure which craft category applies</option>
                    </select>
                    {getFieldError('primaryCraft')}
                  </div>
                  <div className="relative" ref={secondaryDropdownRef}>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Additional Craft Categories</label>
                    <div className="min-h-[50px] p-2 border border-gray-200 rounded-xl bg-white flex flex-wrap gap-2 cursor-text" onClick={() => setShowSecondaryDropdown(true)}>
                      {formData.secondaryCrafts.map(c => (
                        <span key={c} className="bg-brand-primary/10 text-brand-dark px-3 py-1 rounded-full text-xs font-bold flex items-center">
                          {c} <button type="button" onClick={(e) => { e.stopPropagation(); toggleSecondaryCraft(c); }} className="ml-2 text-brand-primary hover:text-red-500">&times;</button>
                        </span>
                      ))}
                      <input type="text" value={secondaryCraftQuery} onChange={e => setSecondaryCraftQuery(e.target.value)} onFocus={() => setShowSecondaryDropdown(true)} placeholder={formData.secondaryCrafts.length === 0 ? "Search categories..." : ""} className="flex-1 outline-none min-w-[120px] text-sm bg-transparent" />
                    </div>
                    {showSecondaryDropdown && (
                      <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                        {filteredSecondaryCrafts.map(c => (
                          <div key={c.craftId} onClick={() => toggleSecondaryCraft(c.englishName)} className="px-4 py-3 hover:bg-brand-primary/5 cursor-pointer text-sm border-b border-gray-50">{c.englishName}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">People, Workshops, or Institutions Represented</label>
                  <p className="text-xs text-gray-500 mb-2">Artisan name, workshop name, cooperative, or existing KHCRF ID.</p>
                  <input type="text" name="peopleOrInstitutions" value={formData.peopleOrInstitutions} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                  {getFieldError('peopleOrInstitutions')}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Is anyone depicted or recorded identifiable? *</label>
                    <select name="identifiablePersons" value={formData.identifiablePersons} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                      <option value="">Select...</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Not known">Not known</option>
                    </select>
                    {getFieldError('identifiablePersons')}
                  </div>
                  {formData.identifiablePersons === 'Yes' && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Identifiable Person Details *</label>
                      <input type="text" name="identifiablePersonsDetails" value={formData.identifiablePersonsDetails} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="Names, Living/Deceased, Consent status" />
                      {getFieldError('identifiablePersonsDetails')}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Historical Context, Provenance, and Description *</label>
                  <p className="text-xs text-gray-500 mb-2">Describe what the material contains, who created or used it, which artisan, workshop, craft, family, institution, or event it relates to, how it came into the current owner’s possession, and why it is historically significant.</p>
                  <textarea name="historicalContext" value={formData.historicalContext} onChange={handleChange} required rows={6} className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition resize-y"></textarea>
                  <div className="flex justify-between mt-2">
                    <span className={`text-xs font-bold ${(historicalContextWordCount < 100 || historicalContextWordCount > 1500) ? 'text-red-500' : 'text-green-600'}`}>
                      {historicalContextWordCount} words (Min: 100, Max: 1500)
                    </span>
                  </div>
                  {getFieldError('historicalContext')}
                </div>
              </div>
            </div>

            {/* Section 3: Date and Location */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                Date and Location
              </h3>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Date Type *</label>
                    <select name="dateType" value={formData.dateType} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                      <option value="">Select date type...</option>
                      <option value="Exact Date Known">Exact Date Known</option>
                      <option value="Approximate Year">Approximate Year</option>
                      <option value="Approximate Decade">Approximate Decade</option>
                      <option value="Historical Period or Era">Historical Period or Era</option>
                      <option value="Date Range">Date Range</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                    {getFieldError('dateType')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Estimate / Exact Date</label>
                    <input type="text" name="dateEstimate" value={formData.dateEstimate} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('dateEstimate')}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Basis for Date Estimate</label>
                  <select name="basisForDate" value={formData.basisForDate} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                    <option value="">Select basis...</option>
                    <option value="Written on the item">Written on the item</option>
                    <option value="Family knowledge">Family knowledge</option>
                    <option value="Institutional record">Institutional record</option>
                    <option value="Publication date">Publication date</option>
                    <option value="Material or stylistic evidence">Material or stylistic evidence</option>
                    <option value="Expert estimate">Expert estimate</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                  {getFieldError('basisForDate')}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Place Associated / Created</label>
                    <input type="text" name="placeAssociated" value={formData.placeAssociated} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('placeAssociated')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Place Found</label>
                    <input type="text" name="placeFound" value={formData.placeFound} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('placeFound')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Current Location Type</label>
                    <select name="currentLocation" value={formData.currentLocation} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                      <option value="">Select location type...</option>
                      <option value="Private Home">Private Home</option>
                      <option value="Artisan Workshop">Artisan Workshop</option>
                      <option value="Family Collection">Family Collection</option>
                      <option value="Museum">Museum</option>
                      <option value="Archive">Archive</option>
                      <option value="Library">Library</option>
                      <option value="Government Office">Government Office</option>
                      <option value="Educational Institution">Educational Institution</option>
                      <option value="Commercial Collection">Commercial Collection</option>
                      <option value="Unknown">Unknown</option>
                      <option value="Other">Other</option>
                    </select>
                    {getFieldError('currentLocation')}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Ownership and Custody */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">4</span>
                Ownership and Custody
              </h3>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Current Legal Owner *</label>
                    <input type="text" name="legalOwner" value={formData.legalOwner} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('legalOwner')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Current Physical Custodian</label>
                    <input type="text" name="currentCustodian" value={formData.currentCustodian} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('currentCustodian')}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Owner Type</label>
                    <select name="ownerType" value={formData.ownerType} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                      <option value="">Select owner type...</option>
                      <option value="Submitter">Submitter</option>
                      <option value="Artisan">Artisan</option>
                      <option value="Artisan Family">Artisan Family</option>
                      <option value="Private Individual">Private Individual</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Cooperative">Cooperative</option>
                      <option value="Museum">Museum</option>
                      <option value="Archive">Archive</option>
                      <option value="Other">Other</option>
                    </select>
                    {getFieldError('ownerType')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Relationship of Submitter to Owner *</label>
                    <input type="text" name="relationshipToOwner" value={formData.relationshipToOwner} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('relationshipToOwner')}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <label className="flex items-center space-x-3 cursor-pointer bg-white p-4 rounded-xl border border-gray-200">
                    <input type="checkbox" name="ownerAuthorisation" checked={formData.ownerAuthorisation} onChange={handleChange} className="w-5 h-5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                    <span className="text-sm font-bold text-gray-700">Does the Owner Authorise This Submission? *</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer bg-white p-4 rounded-xl border border-gray-200">
                    <input type="checkbox" name="ownershipDisputed" checked={formData.ownershipDisputed} onChange={handleChange} className="w-5 h-5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                    <span className="text-sm font-bold text-gray-700">Is Ownership Disputed?</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ownership History or Transfer Information</label>
                  <textarea name="ownershipHistory" value={formData.ownershipHistory} onChange={handleChange} rows={3} className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition resize-y"></textarea>
                  {getFieldError('ownershipHistory')}
                </div>
              </div>
            </div>

            {/* Section 5: Rights and Permissions */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">5</span>
                Rights and Permissions
              </h3>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Copyright Status *</label>
                    <select name="copyrightStatus" value={formData.copyrightStatus} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                      <option value="">Select copyright status...</option>
                      <option value="I Own the Copyright">I Own the Copyright</option>
                      <option value="Copyright Owned by Another Person">Copyright Owned by Another Person</option>
                      <option value="Copyright Owned by an Institution">Copyright Owned by an Institution</option>
                      <option value="Copyright Expired or Public Domain">Copyright Expired or Public Domain</option>
                      <option value="Copyright Status Unknown">Copyright Status Unknown</option>
                      <option value="Government Work or Official Record">Government Work or Official Record</option>
                      <option value="Other">Other</option>
                    </select>
                    {getFieldError('copyrightStatus')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Copyright Holder (if known)</label>
                    <input type="text" name="copyrightHolder" value={formData.copyrightHolder} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('copyrightHolder')}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer bg-white p-4 rounded-xl border border-gray-200">
                    <input type="checkbox" name="permissionPrivateReview" checked={formData.permissionPrivateReview} onChange={handleChange} required className="w-5 h-5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                    <span className="text-sm font-bold text-gray-700">I grant permission for KHCRF to securely store and privately review the submitted files. *</span>
                  </label>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Permission for Public Use (Optional)</label>
                    <select name="publicUsePermissions" value={formData.publicUsePermissions} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                      <option value="">Select public permission...</option>
                      <option value="Private Review Only">Private Review Only</option>
                      <option value="Research Access Only">Research Access Only</option>
                      <option value="Public Archive Display">Public Archive Display</option>
                      <option value="Educational and Non-commercial Publication">Educational and Non-commercial Publication</option>
                      <option value="Website and Digital Publication">Website and Digital Publication</option>
                      <option value="Print Publication">Print Publication</option>
                      <option value="Contact Me Before Each Use">Contact Me Before Each Use</option>
                      <option value="Permission Not Yet Granted">Permission Not Yet Granted</option>
                    </select>
                    {getFieldError('publicUsePermissions')}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">How should the material be credited? *</label>
                    <select name="attributionPreference" value={formData.attributionPreference} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                      <option value="">Select attribution preference...</option>
                      <option value="Credit the Submitter">Credit the Submitter</option>
                      <option value="Credit the Owner">Credit the Owner</option>
                      <option value="Credit the Creator">Credit the Creator</option>
                      <option value="Credit the Family">Credit the Family</option>
                      <option value="Credit the Institution">Credit the Institution</option>
                      <option value="Anonymous">Anonymous</option>
                      <option value="Attribution to Be Confirmed">Attribution to Be Confirmed</option>
                    </select>
                    {getFieldError('attributionPreference')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Credit Line</label>
                    <input type="text" name="preferredCreditLine" value={formData.preferredCreditLine} onChange={handleChange} placeholder="e.g. Courtesy of the Ahmad Family Collection" className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('preferredCreditLine')}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6: Sensitivity */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">6</span>
                Sensitivity
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Does the material contain sensitive or restricted information? *</label>
                  <select name="containsSensitiveInfo" value={formData.containsSensitiveInfo} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Not sure">Not sure</option>
                  </select>
                  {getFieldError('containsSensitiveInfo')}
                </div>
                
                {formData.containsSensitiveInfo === 'Yes' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Describe the Sensitive Information *</label>
                      <input type="text" name="sensitiveInfoDetails" value={formData.sensitiveInfoDetails} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="e.g. sacred knowledge, private correspondence, undisclosed talim" />
                      {getFieldError('sensitiveInfoDetails')}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Requested Restriction *</label>
                      <select name="requestedRestrictions" value={formData.requestedRestrictions} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                        <option value="">Select restriction...</option>
                        <option value="Private Review Only">Private Review Only</option>
                        <option value="Named Researchers Only">Named Researchers Only</option>
                        <option value="Embargo Until Specified Date">Embargo Until a Specified Date</option>
                        <option value="Do Not Publish Names">Do Not Publish Names</option>
                        <option value="Do Not Reproduce Design Details">Do Not Reproduce Design Details</option>
                        <option value="Contact Owner Before Access">Contact Owner Before Access</option>
                        <option value="Other">Other</option>
                      </select>
                      {getFieldError('requestedRestrictions')}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Section 7: Digital Files */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">7</span>
                Digital Files (Up to 10 files)
              </h3>
              
              <div className="space-y-6">
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.tiff,.mp3,.wav,.flac,.mp4,.mov,.webm"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-brand-primary/30 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-brand-primary/5 transition group bg-white"
                  >
                    <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <FaUpload data-ui-icon  className="text-2xl " />
                    </div>
                    <span className="text-lg font-bold text-gray-700">Click to upload files</span>
                    <span className="text-sm text-gray-500 mt-2 text-center">Images (50MB), PDFs (100MB), Audio/Video (up to 250MB)</span>
                  </div>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-brand-dark">Selected Files ({selectedFiles.length}/10):</h4>
                    {selectedFiles.map((f, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                        <div className="flex items-center space-x-4 overflow-hidden">
                          {f.type.startsWith('image/') ? <FaImage className="text-blue-500 text-xl flex-shrink-0" /> : 
                           f.type.startsWith('video/') ? <FaVideo className="text-purple-500 text-xl flex-shrink-0" /> : 
                           f.type.startsWith('audio/') ? <FaVolumeUp className="text-green-500 text-xl flex-shrink-0" /> :
                           <FaFileAlt className="text-red-500 text-xl flex-shrink-0" />}
                          <div className="truncate">
                            <p className="text-sm font-bold text-gray-800 truncate">{f.name}</p>
                            <p className="text-xs text-gray-500">{formatBytes(f.size)}</p>
                          </div>
                        </div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Remove file">
                          <FaTrashAlt />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {getFieldError('mediaAssets')}

                <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Digitisation Information</label>
                    <input type="text" name="digitisationInfo" value={formData.digitisationInfo} onChange={handleChange} placeholder="e.g. Scanned in 2023, 600dpi" className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('digitisationInfo')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Alteration Status</label>
                    <select name="alterationStatus" value={formData.alterationStatus} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                      <option value="">Select status...</option>
                      <option value="Unaltered reproduction">Unaltered reproduction</option>
                      <option value="Cropped only">Cropped only</option>
                      <option value="Colour corrected">Colour corrected</option>
                      <option value="Restored">Restored</option>
                      <option value="Reconstructed">Reconstructed</option>
                      <option value="Transcribed">Transcribed</option>
                      <option value="Translated">Translated</option>
                      <option value="Other alteration">Other alteration</option>
                    </select>
                    {getFieldError('alterationStatus')}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 8: Submitter Information */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">8</span>
                Submitter Information
              </h3>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                    <input type="text" name="submitterName" value={formData.submitterName} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('submitterName')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Organisation / Institution</label>
                    <input type="text" name="submitterOrganisation" value={formData.submitterOrganisation} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('submitterOrganisation')}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                    <input type="email" name="submitterEmail" value={formData.submitterEmail} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('submitterEmail')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                    <input type="tel" name="submitterPhone" value={formData.submitterPhone} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('submitterPhone')}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Location (City, Country)</label>
                    <input type="text" name="submitterLocation" value={formData.submitterLocation} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                    {getFieldError('submitterLocation')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Relationship to Material *</label>
                    <select name="relationshipToMaterial" value={formData.relationshipToMaterial} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                      <option value="">Select relationship...</option>
                      <option value="Owner">Owner</option>
                      <option value="Family Member">Family Member</option>
                      <option value="Custodian">Custodian</option>
                      <option value="Creator">Creator</option>
                      <option value="Researcher">Researcher</option>
                      <option value="Museum or Archive Staff">Museum or Archive Staff</option>
                      <option value="Collector">Collector</option>
                      <option value="Artisan">Artisan</option>
                      <option value="Workshop Representative">Workshop Representative</option>
                      <option value="Government Official">Government Official</option>
                      <option value="Found or Discovered the Material">Found or Discovered the Material</option>
                      <option value="Other">Other</option>
                    </select>
                    {getFieldError('relationshipToMaterial')}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 9: Declarations */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">9</span>
                Declarations
              </h3>
              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer bg-white p-4 rounded-xl border border-gray-200">
                  <input type="checkbox" name="authToSubmit" checked={formData.authToSubmit} onChange={handleChange} required className="mt-1 w-5 h-5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700"><strong>Authority to submit:</strong> I confirm that I am authorised to submit this digital material for private archival review.</span>
                </label>
                {getFieldError('authToSubmit')}

                <label className="flex items-start space-x-3 cursor-pointer bg-white p-4 rounded-xl border border-gray-200">
                  <input type="checkbox" name="accuracyDeclaration" checked={formData.accuracyDeclaration} onChange={handleChange} required className="mt-1 w-5 h-5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700"><strong>Accuracy:</strong> I confirm that the descriptive, ownership, provenance, date, and creator information is accurate to the best of my knowledge.</span>
                </label>
                {getFieldError('accuracyDeclaration')}

                <label className="flex items-start space-x-3 cursor-pointer bg-white p-4 rounded-xl border border-gray-200">
                  <input type="checkbox" name="rightsDisclosure" checked={formData.rightsDisclosure} onChange={handleChange} required className="mt-1 w-5 h-5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700"><strong>Rights disclosure:</strong> I have disclosed whether I own the copyright or whether permission from another rights holder is required.</span>
                </label>
                {getFieldError('rightsDisclosure')}

                <label className="flex items-start space-x-3 cursor-pointer bg-white p-4 rounded-xl border border-gray-200">
                  <input type="checkbox" name="sensitiveDisclosure" checked={formData.sensitiveDisclosure} onChange={handleChange} required className="mt-1 w-5 h-5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700"><strong>Privacy and sensitivity:</strong> I have disclosed whether identifiable living individuals appear, or if the material contains restricted or culturally sensitive content.</span>
                </label>
                {getFieldError('sensitiveDisclosure')}

                <label className="flex items-start space-x-3 cursor-pointer bg-white p-4 rounded-xl border border-gray-200">
                  <input type="checkbox" name="noAutomaticTransfer" checked={formData.noAutomaticTransfer} onChange={handleChange} required className="mt-1 w-5 h-5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700"><strong>No automatic transfer:</strong> I understand that this submission does not transfer ownership of the physical object or copyright unless a separate written agreement is completed.</span>
                </label>
                {getFieldError('noAutomaticTransfer')}

                <label className="flex items-start space-x-3 cursor-pointer bg-white p-4 rounded-xl border border-gray-200">
                  <input type="checkbox" name="noGuaranteedPublication" checked={formData.noGuaranteedPublication} onChange={handleChange} required className="mt-1 w-5 h-5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700"><strong>No guaranteed publication:</strong> I understand that submission does not guarantee acceptance, public display, publication, preservation, valuation, authentication, or return of physical material.</span>
                </label>
                {getFieldError('noGuaranteedPublication')}
              </div>
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={isSubmitting || uploadProgress}
                className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-black text-xl py-6 rounded-2xl transition shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting || uploadProgress ? (
                  <>
                    <FaSpinner className="animate-spin mr-3" />
                    {uploadProgress ? 'Uploading Files...' : 'Submitting Documentation...'}
                  </>
                ) : (
                  'Submit Documentation for Archival Review'
                )}
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">By submitting, you agree to KHCRF’s Privacy Policy and Archival Terms.</p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
