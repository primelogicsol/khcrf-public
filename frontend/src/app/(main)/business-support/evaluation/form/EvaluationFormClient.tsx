"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEvaluationAutofill } from "./evaluationAutofill";
import { useToast } from "@/context/ToastContext";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaUpload,
  FaTrash,
  FaInfoCircle
} from "react-icons/fa";

import { getFactorsForEntity, getFactorCriteria, EntityType, QUALITATIVE_OPTIONS, FACTOR_LABELS } from "@/data/evaluationRegistry";

export default function EvaluationFormClient() {
  const router = useRouter();
    const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { user, isLoading } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [evaluationId, setEvaluationId] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Form State
  const [entityType, setEntityType] = useState<EntityType | ''>('');
  const [entityName, setEntityName] = useState('');
  const [craftType, setCraftType] = useState('');
  
  // New fields
  const [secondaryCrafts, setSecondaryCrafts] = useState('');
  const [roleInValueChain, setRoleInValueChain] = useState('');
  const [district, setDistrict] = useState('');
  const [yearsActive, setYearsActive] = useState('');
  const [operatingScale, setOperatingScale] = useState('');
  const [principalMarkets, setPrincipalMarkets] = useState('');
  const [existingRegistration, setExistingRegistration] = useState('');

  const [responses, setResponses] = useState<Record<string, any>>({});
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [uploadTags, setUploadTags] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<{ missingIds: string[], missingMsg: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      const currentPath = encodeURIComponent(window.location.pathname);
      router.push(`/login?redirect=${currentPath}`);
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await api.get("/evaluation/my-evaluation");
        const submissions = Array.isArray(res.data?.data) ? res.data.data : [];
        const assessments = submissions.filter((sub: any) => sub.evaluationType === "KHCRF_16_STEP");
        
        const draft = assessments.find((sub: any) => sub.caseStatus === "DRAFT");
        const submitted = assessments.find((sub: any) => sub.caseStatus !== "DRAFT" && sub.caseStatus != null);
        if (true) {
          
          if (submitted) {
            setIsSubmitted(true);
            setTrackingId(submitted.trackingId);
          } else if (draft) {
            setEvaluationId(draft.id);
            setTrackingId(draft.trackingId);
            setEntityType(draft.entityType as EntityType);
            setEntityName(draft.businessName || '');
            setCraftType(draft.craftType || '');
            
            // Map new fields if they exist in draft
            if(draft.additionalInfo) {
               setSecondaryCrafts(draft.additionalInfo.secondaryCrafts || '');
               setRoleInValueChain(draft.additionalInfo.roleInValueChain || '');
               setDistrict(draft.additionalInfo.district || '');
               setYearsActive(draft.additionalInfo.yearsActive || '');
               setOperatingScale(draft.additionalInfo.operatingScale || '');
               setPrincipalMarkets(draft.additionalInfo.principalMarkets || '');
               setExistingRegistration(draft.additionalInfo.existingRegistration || '');
            }

            setResponses(draft.answers || {});
            setCurrentStep(1);

            try {
              const evRes = await api.get(`/evaluation/${draft.id}/evidence`);
              if (evRes.data?.success) {
                setEvidenceList((evRes.data.evidence || []).map(e => ({ ...e, evidenceId: e.id })));
              }
            } catch (err) {
              console.error("Failed to load evidence", err);
            }
          }
        }
      } catch (error) {
        console.error("Failed to check evaluation status", error);
      } finally {
        setCheckingStatus(false);
      }
    };
    checkStatus();
  }, []);

  const handleCreateDraft = async () => {
    if (!entityType || !entityName || !craftType) {
      showToast("Please fill the required fields to continue", "error");
      return;
    }
    try {
      const res = await api.post("/evaluation", {
        entityType,
        entityName,
        craftType,
        additionalInfo: {
          secondaryCrafts, roleInValueChain, district, yearsActive, operatingScale, principalMarkets, existingRegistration
        }
      });
      setEvaluationId(res.data.id);
      setTrackingId(res.data.trackingId);
      setCurrentStep(1);
    } catch (e: any) {
      showToast(e.response?.data?.message || "Failed to start draft", "error");
    }
  };

  
  
        
        const handleUpdateDraft = async (updates: Record<string, any>) => {
    if (!evaluationId) return;
    try {
      await api.patch(`/evaluation/${evaluationId}`, { answers: updates });
    } catch (e: any) {
      showToast(e.response?.data?.message || "Failed to update draft", "error");
      throw e;
    }
  };

  const handleAnswer = (factorKey: string, questionId: string, value: any) => {
    const key = `${factorKey}_${questionId}`;
    const newResponses = { ...responses, [key]: value };
    setResponses(newResponses);
    handleUpdateDraft({ [key]: value }).catch(() => {
      setResponses(responses); 
    });
  };

    const handleUploadEvidence = async (file: File, factorCodes: string[], replaceId?: string) => {
    if (!evaluationId) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast("File exceeds 10MB limit", "error");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(p => p >= 90 ? 90 : p + 10);
    }, 200);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("factorCodes", JSON.stringify(factorCodes));
    
    try {
      const res = await api.post(`/evaluation/${evaluationId}/evidence`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (res.data?.success) {
        // If it's a replacement, delete the old one
        if (replaceId) {
          try {
            await api.delete(`/evaluation/${evaluationId}/evidence/${replaceId}`);
            setEvidenceList(prev => prev.filter(e => e.evidenceId !== replaceId));
          } catch (delError) {
            console.error("Failed to delete old evidence during replacement", delError);
          }
          setReplacingId(null);
        }
        
        // Ensure safe metadata is what's used
        const newEvidence = {
          ...res.data.evidence,
          originalFilename: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          status: 'Uploaded',
        };
        
        setEvidenceList(prev => [...prev, newEvidence]);
        setTimeout(() => setIsUploading(false), 500);
      } else {
        throw new Error("Upload failed");
      }
    } catch (e: any) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);
      showToast(e.response?.data?.message || "Failed to upload evidence", "error");
    }
  };

  const handleDeleteEvidence = async (evidenceId: string) => {
    if (!evaluationId) return;
    try {
      await api.delete(`/evaluation/${evaluationId}/evidence/${evidenceId}`);
      setEvidenceList(prev => prev.filter(e => e.evidenceId !== evidenceId));
      showToast("Evidence removed", "success");
    } catch (e: any) {
      showToast(e.response?.data?.message || "Failed to remove evidence", "error");
    }
  };

  const handleSubmit = async () => {
    if (!evaluationId) return;
    try {
      await api.post(`/evaluation/${evaluationId}/submit`);
      setIsSubmitted(true);
      showToast("Evaluation submitted successfully!", "success");
    } catch (e: any) {
      showToast(e.response?.data?.message || "Failed to submit", "error");
    }
  };

  

  const factors = entityType ? getFactorsForEntity(entityType) : [];
  const totalSteps = factors.length + 2; // +1 for Setup, +1 for Evidence

  const { isRunning, isComplete } = useEvaluationAutofill({
    searchParams, currentStep, factors, getFactorCriteria,
    setCurrentStep, setEvaluationId, setTrackingId, setEntityType,
    setEntityName, setCraftType, setSecondaryCrafts, setRoleInValueChain,
    setDistrict, setYearsActive, setOperatingScale, setPrincipalMarkets,
    setExistingRegistration, setResponses, isCheckingStatus: checkingStatus,
    entityType, roleInValueChain, craftType, evaluationId
  });


  const handleNext = () => {
    if (currentStep === 0) {
      handleCreateDraft();
    } else if (currentStep <= factors.length) {
      const f = factors[currentStep - 1];
      const factorCriteria = getFactorCriteria(entityType as EntityType, roleInValueChain, craftType, f);
      const requiredQuestions = factorCriteria.questions.filter(q => q.required);
      
      const missingIds: string[] = [];
        requiredQuestions.forEach(q => {
          const val = responses[`${f}_${q.id}`];
          if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
            missingIds.push(q.id);
          }
        });
        const hasOverall = !!responses[`${f}_overall`];
        if (!hasOverall) missingIds.push('overall');
        
        if (missingIds.length > 0) {
          const qCount = missingIds.includes('overall') ? missingIds.length - 1 : missingIds.length;
          const msg = `${qCount} required response(s) missing` + (!hasOverall ? (qCount > 0 ? ' and 1 overall claim not selected' : '1 overall claim not selected') : '');
          setValidationErrors({ missingIds, missingMsg: msg });
          setTimeout(() => {
            document.getElementById(`question-${missingIds[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
          return;
        }
      setValidationErrors(null);
        setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === factors.length + 1) {
      // Validate Evidence Step
      let missingEvidenceFactors: string[] = [];
      factors.forEach(f => {
        const factorCriteria = getFactorCriteria(entityType as EntityType, roleInValueChain, craftType, f);
        if (factorCriteria.evidenceRequirement === 'REQUIRED') {
          const supported = evidenceList.some(e => e.factors && e.factors.includes(f));
          if (!supported) {
            missingEvidenceFactors.push(FACTOR_LABELS[f] || f);
          }
        }
      });
      if (missingEvidenceFactors.length > 0) {
        setValidationErrors({ missingIds: [], missingMsg: "Missing required evidence for: " + missingEvidenceFactors.join(", ") });
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
        return;
      }
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setValidationErrors(null);
        setCurrentStep(prev => prev - 1);
    } else {
      router.back();
    }
  };

  if (checkingStatus || isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden p-8 md:p-12 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-brand-primary/10">
            <FaCheck className="text-3xl text-brand-primary" />
          </div>

          <h2 className="text-3xl font-playfair font-bold text-brand-primary mb-2">
            Verification Pending
          </h2>
          <p className="text-xl font-bold text-stone-900 mb-6">
            Verification ID: {trackingId}
          </p>

          <div className="bg-brand-primary/5 border-l-4 border-[var(--card-left-accent)] text-left p-6 rounded-r-lg mb-8">
            <p className="font-bold text-lg text-stone-900 mb-2">
              Status: Submitted
            </p>
            <p className="text-stone-700">
              This assessment records the information and evidence you provided. KHCRF independent verification will be conducted separately.
            </p>
          </div>

          <button
            onClick={() => router.push("/profile/evaluations")}
            className="bg-brand-primary text-white font-bold py-4 px-10 rounded hover:bg-brand-dark transition-all uppercase tracking-widest text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Track Verification
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8 font-roboto">

  {isRunning && (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white px-4 py-2 rounded-lg font-mono text-xs shadow-lg">
      AUTOFILL RUNNING — STEP {currentStep}
    </div>
  )}
  {isComplete && currentStep === factors.length + 1 && (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-900 text-white px-4 py-2 rounded-lg font-mono text-xs shadow-lg">
      AUTOFILL COMPLETE — STOPPED AT STEP {currentStep}
    </div>
  )}

      <div className="w-full max-w-4xl mb-8 text-center mt-12 md:mt-4">
        <div className="flex flex-col items-center justify-center mb-6">
          <span className="text-[10px] md:text-xs tracking-[0.15em] uppercase font-bold text-stone-500 mb-1">
            CRAFTLORE CKTRE TRADE REGISTRY
          </span>
          <span className="text-xs md:text-sm tracking-widest uppercase font-bold text-brand-primary">
            KASHMIR CRAFT GLOBAL TRADE RANKINGS
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-stone-900 mb-3">
          Entity Evaluation &amp; Verification
        </h1>
        <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto font-medium">
          KHCRF 16-Step Assessment Application
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar / Progress */}
        <div className="bg-stone-900 text-white p-8 md:w-1/3 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-playfair font-bold mb-6">
              Application Progress
            </h2>
            <div className="space-y-4">
              <div className={`flex items-center gap-3 ${currentStep > 0 ? "text-green-400" : currentStep === 0 ? "text-white" : "text-stone-600"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold ${currentStep > 0 ? "border-green-400 bg-green-400/10 text-green-400" : currentStep === 0 ? "border-brand-primary bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20" : "border-stone-700 bg-stone-800 text-stone-500"}`}>
                  {currentStep > 0 ? <FaCheck /> : 1}
                </div>
                <span className={`text-sm font-medium ${currentStep === 0 ? "font-bold" : ""}`}>Entity Setup</span>
              </div>

              {factors.map((f, idx) => {
                const stepNum = idx + 1;
                const factorCriteria = getFactorCriteria(entityType as EntityType, roleInValueChain, craftType, f);
                const requiredQuestions = factorCriteria.questions.filter(q => q.required);
                
                let completedRequired = 0;
                requiredQuestions.forEach(q => {
                  const val = responses[`${f}_${q.id}`];
                  if (val !== undefined && val !== null && val !== '' && (Array.isArray(val) ? val.length > 0 : true)) {
                    completedRequired++;
                  }
                });
                
                const isEvidenceRequired = factorCriteria.evidenceRequirement === 'REQUIRED';
                const hasOverall = !!responses[`${f}_overall`];
                  const isComplete = completedRequired === requiredQuestions.length && hasOverall;

                return (
                  <div key={f} className={`flex items-center gap-3 ${isComplete ? "text-green-400" : currentStep === stepNum ? "text-white" : stepNum < currentStep ? "text-amber-500" : "text-stone-600"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold ${isComplete ? (currentStep === stepNum ? "border-green-400 bg-green-400/20 ring-2 ring-green-400/30 text-green-400" : "border-green-400 bg-green-400/10 text-green-400") : currentStep === stepNum ? "border-brand-primary bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20" : stepNum < currentStep ? "border-amber-500/50 bg-amber-500/10 text-amber-500" : "border-stone-700 bg-stone-800 text-stone-500"}`}>
                      {isComplete ? <FaCheck /> : stepNum < currentStep ? "!" : stepNum + 1}
                    </div>
                    <span className={`text-sm font-medium ${currentStep === stepNum ? "font-bold" : ""}`}>{FACTOR_LABELS[f] || f}</span>
                  </div>
                );
              })}
                {(() => {
                  const evStepNum = factors.length + 1;
                  return (
                    <div key="evidence-step" className="flex flex-col gap-1 cursor-pointer group" onClick={() => { setValidationErrors(null); setCurrentStep(evStepNum); }}>
                      <div className={`flex items-center gap-3 ${currentStep === evStepNum ? "text-white" : evStepNum < currentStep ? "text-green-400" : "text-stone-600"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold ${currentStep === evStepNum ? "border-brand-primary bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20" : evStepNum < currentStep ? "border-green-400 bg-green-400/10 text-green-400" : "border-stone-700 bg-stone-800 text-stone-500"}`}>
                          {evStepNum < currentStep ? <FaCheck /> : evStepNum + 1}
                        </div>
                        <span className={`text-sm font-medium group-hover:underline ${currentStep === evStepNum ? "font-bold" : ""}`}>Evidence & Documents</span>
                      </div>
                    </div>
                  );
                })()}

            </div>
          </div>
          <div className="relative z-10 mt-8">
            <p className="text-stone-400 text-sm">
              Step {currentStep + 1} of {totalSteps + 1}
            </p>
            <div className="w-full bg-stone-800 h-2 rounded-full mt-2">
              <div
                className="bg-brand-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / (totalSteps + 1)) * 100}%` }}
              ></div>
            </div>
            {trackingId && <p className="text-stone-500 text-xs mt-4 font-mono tracking-widest">{trackingId}</p>}
          </div>
        </div>

        {/* Form Area */}
        <div className="p-8 md:p-12 md:w-2/3 flex flex-col max-h-screen overflow-y-auto">
          <div className="grow">
            {currentStep === 0 && (
              <>
                <span data-editorial-accent-text className="font-bold tracking-widest uppercase text-xs mb-2 block">
                  Step 1
                </span>
                <h3 className="text-2xl font-playfair font-bold text-stone-900 mb-8 leading-tight">
                  Entity Details
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Applicant / Entity Name *</label>
                    <input 
                      type="text" 
                      className="w-full p-4 border-2 border-gray-100 rounded-lg focus:border-brand-primary focus:ring-0 transition-colors"
                      value={entityName}
                      onChange={(e) => setEntityName(e.target.value)}
                      placeholder="e.g. Kashmiri Weavers Cooperative"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Entity Type *</label>
                    <select 
                      className="w-full p-4 border-2 border-gray-100 rounded-lg focus:border-brand-primary bg-white transition-colors"
                      value={entityType}
                      onChange={(e) => setEntityType(e.target.value as EntityType)}
                    >
                      <option value="">Select Entity Type</option>
                      <option value="ARTISAN">Individual Artisan</option>
                      <option value="BUSINESS">Craft Business / Enterprise</option>
                      <option value="INSTITUTION">Educational / Cultural Institution</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Primary Craft Type *</label>
                    <input 
                      type="text" 
                      className="w-full p-4 border-2 border-gray-100 rounded-lg focus:border-brand-primary focus:ring-0 transition-colors"
                      value={craftType}
                      onChange={(e) => setCraftType(e.target.value)}
                      placeholder="e.g. Pashmina, Papier Mache, Walnut Wood"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Secondary Crafts</label>
                    <input 
                      type="text" 
                      className="w-full p-4 border-2 border-gray-100 rounded-lg focus:border-brand-primary focus:ring-0 transition-colors"
                      value={secondaryCrafts}
                      onChange={(e) => setSecondaryCrafts(e.target.value)}
                      placeholder="e.g. Embroidery, Kani"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Role in Value Chain</label>
                    <select 
                      className="w-full p-4 border-2 border-gray-100 rounded-lg focus:border-brand-primary bg-white transition-colors"
                      value={roleInValueChain}
                      onChange={(e) => setRoleInValueChain(e.target.value)}
                    >
                      <option value="">Select Role</option>
                      <option value="SPINNER">Spinner</option>
                      <option value="WEAVER">Weaver</option>
                      <option value="KANI_WEAVER">Kani Weaver</option>
                      <option value="SOZNI_EMBROIDERER">Sozni Embroiderer</option>
                      <option value="FINISHER">Finisher</option>
                      <option value="DYER">Dyer</option>
                      <option value="OTHER_ARTISAN">Other Artisan</option>
                      <option value="MAKER">Maker / General Artisan</option>
                      <option value="PROCESSOR">Processor</option>
                      <option value="MANUFACTURER">Manufacturer</option>
                      <option value="TRADER">Trader</option>
                      <option value="EXPORTER">Exporter</option>
                      <option value="RETAILER">Retailer</option>
                      <option value="COOPERATIVE">Cooperative</option>
                      <option value="TRAINING_INSTITUTION">Training Institution</option>
                      <option value="NGO">NGO / Association</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">District / Location</label>
                      <input 
                        type="text" 
                        className="w-full p-4 border-2 border-gray-100 rounded-lg focus:border-brand-primary focus:ring-0 transition-colors"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="e.g. Srinagar"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-2">Years Active</label>
                      <input 
                        type="number" 
                        className="w-full p-4 border-2 border-gray-100 rounded-lg focus:border-brand-primary focus:ring-0 transition-colors"
                        value={yearsActive}
                        onChange={(e) => setYearsActive(e.target.value)}
                        placeholder="e.g. 5"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Existing KHCRF Registration (if applicable)</label>
                    <input 
                      type="text" 
                      className="w-full p-4 border-2 border-gray-100 rounded-lg focus:border-brand-primary focus:ring-0 transition-colors"
                      value={existingRegistration}
                      onChange={(e) => setExistingRegistration(e.target.value)}
                      placeholder="e.g. KHCRF-1234"
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep > 0 && currentStep <= factors.length && (() => {
              const factorCode = factors[currentStep - 1];
              const criteria = getFactorCriteria(entityType as EntityType, roleInValueChain, craftType, factorCode);
              
              return (
              <>
                <span data-editorial-accent-text className="font-bold tracking-widest uppercase text-xs mb-2 block">
                  Self-Reported Claim
                </span>
                                <h3 className="text-2xl font-playfair font-bold text-stone-900 mb-4 leading-tight">
                  {criteria.title}
                </h3>
                
                {validationErrors && (
                  <div className="mb-6 p-4 rounded-lg border border-amber-500/30 bg-amber-50/50 flex items-start gap-3 text-amber-900">
                    <FaInfoCircle className="text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm mb-1">This section needs attention</h4>
                      <p className="text-xs">{validationErrors.missingMsg}</p>
                      {validationErrors.missingIds.length > 0 && (
                        <ul className="mt-2 list-disc pl-4 text-xs space-y-1">
                          {validationErrors.missingIds.map(id => {
                            const q = criteria.questions.find(q => q.id === id);
                            return <li key={id}>{q ? q.label : 'Overall self-reported position'}</li>;
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="bg-brand-primary/5 p-4 rounded-lg mb-6 border border-brand-primary/10">
                  <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-brand-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm mb-1">What this means for {entityType}{roleInValueChain ? ` · ${roleInValueChain}` : ''} · {craftType || 'Your Craft'}</h4>
                      <p className="text-sm text-stone-700">{criteria.explanation}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-bold text-stone-900 text-sm mb-2">What KHCRF will examine:</h4>
                  <ul className="list-disc pl-5 text-sm text-stone-700 space-y-1">
                    {criteria.examineCriteria.map((crit, idx) => (
                      <li key={idx}>{crit}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-8">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-widest border-b pb-2">Your Claims</p>
                  
                  {criteria.questions.map((q) => {
                    const ansKey = `${factorCode}_${q.id}`;
                    const val = responses[ansKey];

                    return (
                      <div key={q.id} id={`question-${q.id}`} className={`space-y-3 p-4 -mx-4 rounded-lg transition-colors ${validationErrors?.missingIds.includes(q.id) ? 'bg-amber-50/50 border border-amber-200' : ''}`}>
                        <label className="block font-medium text-stone-900">{q.label}</label>
                        
                        {validationErrors?.missingIds.includes(q.id) && (
                            <div className="flex items-center gap-2 text-amber-600 text-xs font-bold mt-2">
                              <FaInfoCircle /> {q.id === 'overall' ? 'Please select your overall self-reported position.' : 'Required: Please provide this information before continuing.'}
                            </div>
                          )}
                          {q.type === 'QUALITATIVE' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {QUALITATIVE_OPTIONS.map(opt => (
                              <label key={opt} className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors ${val === opt ? "border-brand-primary bg-brand-primary/5" : "border-gray-200 hover:bg-gray-50"}`}>
                                <input type="radio" className="hidden" checked={val === opt} onChange={() => handleAnswer(factorCode, q.id, opt)} />
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${val === opt ? "border-brand-primary" : "border-gray-300"}`}>
                                  {val === opt && <div className="w-2 h-2 rounded-full bg-brand-primary"></div>}
                                </div>
                                <span className="text-sm">{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {q.type === 'YES_NO' && (
                          <div className="flex gap-4">
                            {['YES', 'NO'].map(opt => (
                              <label key={opt} className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-colors flex-1 ${val === opt ? "border-brand-primary bg-brand-primary/5" : "border-gray-200 hover:bg-gray-50"}`}>
                                <input type="radio" className="hidden" checked={val === opt} onChange={() => handleAnswer(factorCode, q.id, opt)} />
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${val === opt ? "border-brand-primary" : "border-gray-300"}`}>
                                  {val === opt && <div className="w-2 h-2 rounded-full bg-brand-primary"></div>}
                                </div>
                                <span className="text-sm">{opt === 'YES' ? 'Yes' : 'No'}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {(q.type === 'NUMBER' || q.type === 'PERCENTAGE') && (
                          <input type="number" className="w-full p-3 border rounded focus:border-brand-primary focus:ring-0" value={val || ''} onChange={(e) => handleAnswer(factorCode, q.id, e.target.value)} />
                        )}

                        {q.type === 'SHORT_EXPLANATION' && (
                          <textarea className="w-full p-3 border rounded focus:border-brand-primary focus:ring-0" rows={3} value={val || ''} onChange={(e) => handleAnswer(factorCode, q.id, e.target.value)}></textarea>
                        )}

                        {q.type === 'SELECT' && q.options && (
                          <select className="w-full p-3 border rounded focus:border-brand-primary focus:ring-0" value={val || ''} onChange={(e) => handleAnswer(factorCode, q.id, e.target.value)}>
                            <option value="">Select an option</option>
                            {q.options.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        )}

                        {q.type === 'MULTI_SELECT' && q.options && (
                          <div className="space-y-2">
                            {q.options.map(opt => {
                              const isChecked = Array.isArray(val) && val.includes(opt);
                              return (
                                <label key={opt} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" 
                                    checked={isChecked} 
                                    onChange={(e) => {
                                      const currentArr = Array.isArray(val) ? val : [];
                                      const newArr = e.target.checked 
                                        ? [...currentArr, opt] 
                                        : currentArr.filter((item: string) => item !== opt);
                                      handleAnswer(factorCode, q.id, newArr);
                                    }} 
                                  />
                                  <span className="text-sm">{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {q.type === 'STRUCTURED_TEXT' && (
                          <textarea 
                            className="w-full p-3 border rounded focus:border-brand-primary focus:ring-0" 
                            rows={4} 
                            value={val || ''} 
                            onChange={(e) => handleAnswer(factorCode, q.id, e.target.value)}
                            placeholder="Please provide a detailed explanation..."
                          ></textarea>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Centralized Evidence Upload happens in the Evidence & Documents step */}
                  <p className="text-xs text-stone-400 mt-6 text-center italic">Criteria are tailored to your selected role and primary craft.</p>
                </>
              );})()}

            {currentStep === factors.length + 1 && (
              <>
                <span data-editorial-accent-text className="font-bold tracking-widest uppercase text-xs mb-2 block">
                  Step {currentStep + 1}
                </span>
                <h3 className="text-2xl font-playfair font-bold text-stone-900 mb-4 leading-tight">
                  Evidence & Documents
                </h3>
                {validationErrors && (
                  <div className="mb-6 p-4 rounded-lg border border-red-500/30 bg-red-50/50 flex items-start gap-3 text-red-900">
                    <FaInfoCircle className="text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-sm mb-1">Supporting evidence required</h4>
                      <p className="text-xs">{validationErrors.missingMsg}</p>
                    </div>
                  </div>
                )}
                
                <div className="bg-brand-primary/5 p-4 rounded-lg mb-6 border border-brand-primary/10">
                  <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-brand-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-brand-primary text-sm mb-1">Consolidated Evidence Package</h4>
                      <p className="text-xs text-stone-700">Upload documents supporting your claims here. You can tag each file to one or multiple factors.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-white p-4 border rounded-lg">
                    <h5 className="font-bold text-sm mb-2">Identity / Registration</h5>
                    <p className="text-xs text-stone-600">Artisan card, business registration, cooperative/institution record.</p>
                  </div>
                  <div className="bg-white p-4 border rounded-lg">
                    <h5 className="font-bold text-sm mb-2">Craft / Provenance Evidence</h5>
                    <p className="text-xs text-stone-600">GI documentation, material invoices, artisan/workshop records.</p>
                  </div>
                  <div className="bg-white p-4 border rounded-lg">
                    <h5 className="font-bold text-sm mb-2">Workshop / Operational Evidence</h5>
                    <p className="text-xs text-stone-600">Workshop photos, location/production records, relevant operating documents.</p>
                  </div>
                  <div className="bg-white p-4 border rounded-lg">
                    <h5 className="font-bold text-sm mb-2">Worker / Safeguard Evidence</h5>
                    <p className="text-xs text-stone-600">Sample payment records, wage records, safeguarding policy, supplier declarations.</p>
                  </div>
                  <div className="bg-white p-4 border rounded-lg">
                    <h5 className="font-bold text-sm mb-2">Trade / Buyer Evidence</h5>
                    <p className="text-xs text-stone-600">Invoices, order records, dispatch records, return/complaint policy, buyer references.</p>
                  </div>
                  <div className="bg-white p-4 border rounded-lg">
                    <h5 className="font-bold text-sm mb-2">Traceability / Sustainability</h5>
                    <p className="text-xs text-stone-600">Digital Passport/QR records, sourcing records, sustainability or process documentation.</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-bold text-stone-900 mb-4">Upload New Evidence</h4>
                  <div className="bg-white p-6 border border-gray-200 rounded-lg">
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-stone-700 mb-2">Select Factors Supported by this Document:</label>
                      <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded bg-gray-50">
                        {factors.map(f => (
                          <label key={f} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={uploadTags.includes(f)}
                              onChange={(e) => {
                                if (e.target.checked) setUploadTags([...uploadTags, f]);
                                else setUploadTags(uploadTags.filter(t => t !== f));
                              }}
                              className="text-brand-primary rounded focus:ring-brand-primary"
                            />
                            <span className="text-sm text-stone-700">{FACTOR_LABELS[f] || f}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {isUploading ? (
                      <div className="border-2 border-gray-200 rounded-lg p-6 text-center bg-gray-50">
                        <div className="font-medium text-stone-700 mb-2">Uploading...</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <div className="bg-brand-primary h-2.5 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                        <div className="text-xs text-stone-500">{uploadProgress}% Complete</div>
                      </div>
                    ) : (
                      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                        <input 
                          type="file" 
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              if (uploadTags.length === 0) {
                                showToast("Please select at least one factor to tag this evidence", "error");
                                e.target.value = '';
                                return;
                              }
                              handleUploadEvidence(e.target.files[0], uploadTags.join(','));
                              setUploadTags([]);
                              e.target.value = '';
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-2 pointer-events-none">
                          <FaUpload className="text-xl text-stone-400" />
                          <span className="font-medium text-stone-700 text-sm">Click to upload or drag and drop</span>
                          <span className="text-xs text-stone-500">Tag factors above, then select a file to upload. PDF, JPG, PNG up to 10MB</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 mb-4">Uploaded Evidence & Factor Support</h4>
                  
                  <div className="space-y-4 mb-8">
                    {evidenceList.length === 0 ? (
                      <p className="text-sm text-stone-500 italic bg-gray-50 p-4 rounded border">No evidence uploaded yet.</p>
                    ) : (
                      evidenceList.map(e => (
                        <div key={e.evidenceId} className="flex flex-col p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 text-green-800">
                              <FaCheck className="mt-1 flex-shrink-0" />
                              <div>
                                <p className="font-bold text-sm text-stone-900 break-all">{e.originalFilename || e.filename}</p>
                                <p className="text-xs text-stone-500 mt-1 uppercase tracking-wide">
                                  {e.mimeType?.split('/')[1] || 'FILE'} &middot; {(e.sizeBytes ? (e.sizeBytes / 1024 / 1024).toFixed(2) : '0.00')} MB
                                </p>
                                <div className="mt-2 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded inline-block">
                                  Uploaded
                                </div>
                                <div className="mt-3">
                                  <span className="text-xs text-stone-600 font-bold block mb-1">Supports:</span>
                                  <ul className="text-xs text-stone-700 space-y-1">
                                    {e.factors?.map((code: string) => (
                                      <li key={code} className="flex items-center gap-1"><FaCheck className="text-[10px] text-green-500"/> {FACTOR_LABELS[code] || code}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-green-200 flex items-center justify-end gap-3 text-xs font-bold">
                            {replacingId === e.evidenceId ? (
                              <div className="relative overflow-hidden cursor-pointer text-brand-primary hover:underline">
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.jpg,.jpeg,.png" onChange={(evt) => {
                                  if (evt.target.files?.[0]) {
                                    handleUploadEvidence(evt.target.files[0], e.factors || [], e.evidenceId);
                                  }
                                }} />
                                Select New File...
                              </div>
                            ) : (
                              <button onClick={() => setReplacingId(e.evidenceId)} className="text-stone-600 hover:text-stone-900 transition-colors">
                                [Replace]
                              </button>
                            )}

                            {confirmRemoveId === e.evidenceId ? (
                              <div className="flex items-center gap-2 bg-red-50 text-red-700 px-2 py-1 rounded">
                                <span>Are you sure?</span>
                                <button onClick={() => handleDeleteEvidence(e.evidenceId)} className="hover:underline">Yes</button>
                                <span>/</span>
                                <button onClick={() => setConfirmRemoveId(null)} className="hover:underline">No</button>
                              </div>
                            ) : (
                              <button onClick={() => setConfirmRemoveId(e.evidenceId)} className="text-red-500 hover:text-red-700 transition-colors">
                                [Remove]
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {(() => {
                    const supportedFactors = factors.filter(f => evidenceList.some(e => e.factors && e.factors.includes(f)));
                    const unsupportedFactors = factors.filter(f => !supportedFactors.includes(f));
                    
                    return (
                      <div className="bg-stone-50 p-6 border rounded-lg">
                        <div className="mb-4">
                          <h4 className="font-playfair font-bold text-xl text-stone-900 mb-1">Evidence Package</h4>
                          <p className="text-sm font-medium text-stone-700">{evidenceList.length} file{evidenceList.length !== 1 ? 's' : ''} uploaded</p>
                          <p className="text-sm text-stone-500">Supporting {supportedFactors.length} of {factors.length} verification factors</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-200">
                          <div>
                            <h5 className="text-sm font-bold text-green-700 mb-2">Strongly supported</h5>
                            {supportedFactors.length === 0 ? <p className="text-xs text-stone-500">None</p> : (
                              <ul className="text-xs text-stone-700 space-y-2">
                                {supportedFactors.map(f => <li key={f} className="flex items-start gap-2"><FaCheck className="text-green-500 mt-0.5" />{FACTOR_LABELS[f] || f}</li>)}
                              </ul>
                            )}
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-amber-600 mb-2">Additional evidence recommended</h5>
                            {unsupportedFactors.length === 0 ? <p className="text-xs text-stone-500">None</p> : (
                              <ul className="text-xs text-stone-700 space-y-2">
                                {unsupportedFactors.map(f => {
                                  const req = getFactorCriteria(entityType as EntityType, roleInValueChain, craftType, f).evidenceRequirement === 'REQUIRED';
                                  return <li key={f} className={`flex items-start gap-2 ${req ? 'text-red-600 font-bold' : ''}`}><span className="text-stone-400 mt-0.5">○</span>{FACTOR_LABELS[f] || f}{req ? " (Required)" : ""}</li>
                                })}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </>
            )}

            {currentStep > factors.length + 1 && (
              <>
                <span data-editorial-accent-text className="font-bold tracking-widest uppercase text-xs mb-2 block">
                  Final Step
                </span>
                <h3 className="text-2xl font-playfair font-bold text-stone-900 mb-8 leading-tight">
                  Review & Submit
                </h3>
                
                <div className="space-y-6 mb-8">
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-bold text-stone-900 mb-4 border-b pb-2">Application Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-stone-500">Entity Name:</span> <br/><span className="font-medium">{entityName}</span></div>
                      <div><span className="text-stone-500">Entity Type:</span> <br/><span className="font-medium">{entityType}</span></div>
                      <div><span className="text-stone-500">Primary Craft:</span> <br/><span className="font-medium">{craftType}</span></div>
                      <div><span className="text-stone-500">Role:</span> <br/><span className="font-medium">{roleInValueChain || 'N/A'}</span></div>
                    </div>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-bold text-stone-900 mb-4 border-b pb-2">Factor Completion</h4>
                    <div className="space-y-3">
                      {factors.map((f, idx) => {
                        const factorCriteria = getFactorCriteria(entityType as EntityType, roleInValueChain, craftType, f);
                        const expectedQuestions = factorCriteria.questions;
                        const requiredQuestions = expectedQuestions.filter(q => q.required);
                        
                        let completedRequired = 0;
                        requiredQuestions.forEach(q => {
                          const val = responses[`${f}_${q.id}`];
                          if (val !== undefined && val !== null && val !== '' && (Array.isArray(val) ? val.length > 0 : true)) {
                            completedRequired++;
                          }
                        });
                        
                        const isEvidenceRequired = factorCriteria.evidenceRequirement === 'REQUIRED';
                        
                        const hasOverall = !!responses[`${f}_overall`];
                  const isComplete = completedRequired === requiredQuestions.length && hasOverall;
                        
                        const overallPos = responses[`${f}_overall`] || "None";

                        return (
                          <div key={f} className="flex flex-col text-sm border-b border-gray-50 pb-3 pt-2">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-stone-700">{FACTOR_LABELS[f] || f}</span>
                              <div className="flex items-center gap-3">
                                {isComplete ? (
                                  <span className="text-green-600 flex items-center gap-1 font-medium"><FaCheck className="text-xs"/> Complete</span>
                                ) : (
                                  <button onClick={() => setCurrentStep(idx + 1)} className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1 underline text-xs">Needs Attention</button>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-stone-500 text-xs">
                              <span>Position: <span className="font-medium text-stone-700">{overallPos}</span></span>
                              <span>Responses: {completedRequired}/{requiredQuestions.length}</span>
                              <span className={`${evCount > 0 ? "text-green-600 font-medium" : isEvidenceRequired ? "text-red-500 font-bold" : ""}`}>
                                {evCount} doc(s) {isEvidenceRequired && evCount === 0 ? '(Required)' : ''}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
                  <p className="text-stone-700 mb-4 text-sm">
                    I confirm that the claims and evidence provided are accurate to the best of my knowledge.
                    I understand that this information will be subjected to independent review and ground validation by KHCRF evaluators.
                  </p>
                  <p className="text-stone-700 font-bold text-sm">
                    Tracking ID: {trackingId}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="mt-10 flex justify-between items-center pt-6 border-t border-gray-100 flex-shrink-0">
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-medium transition-colors"
            >
              <FaChevronLeft /> {currentStep === 0 ? "Back" : "Previous"}
            </button>

            {currentStep <= factors.length + 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-brand-primary text-white font-bold py-3 px-8 rounded hover:bg-brand-dark transition-all duration-300 transform hover:-translate-y-1"
              >
                {currentStep === 0 ? "Start Application" : "Next Step"} <FaChevronRight />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-stone-900 text-white font-bold py-3 px-8 rounded hover:bg-black transition-all duration-300 transform hover:-translate-y-1"
              >
                Submit for Verification <FaCheck className="ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
