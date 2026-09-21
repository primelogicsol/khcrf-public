"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
        if (res.data && res.data.length > 0) {
          const draft = res.data.find((sub: any) => sub.caseStatus === "DRAFT");
          const submitted = res.data.find((sub: any) => sub.caseStatus === "SUBMITTED");
          
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
                setEvidenceList(evRes.data.evidence || []);
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

  const handleUploadEvidence = async (file: File, factorCode: string) => {
    if (!evaluationId) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("factorCode", factorCode);
    
    try {
      const res = await api.post(`/evaluation/${evaluationId}/evidence`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        setEvidenceList(prev => [...prev, res.data.evidence]);
        showToast("Evidence uploaded successfully", "success");
      }
    } catch (e: any) {
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
  const totalSteps = factors.length + 1; // +1 for Setup

  const handleNext = () => {
    if (currentStep === 0) {
      handleCreateDraft();
    } else if (currentStep <= factors.length) {
      const f = factors[currentStep - 1];
      const factorCriteria = getFactorCriteria(entityType as EntityType, roleInValueChain, craftType, f);
      const requiredQuestions = factorCriteria.questions.filter(q => q.required);
      
      let completedRequired = 0;
      requiredQuestions.forEach(q => {
        const val = responses[`${f}_${q.id}`];
        if (val !== undefined && val !== null && val !== '' && (Array.isArray(val) ? val.length > 0 : true)) {
          completedRequired++;
        }
      });
      
      const evCount = evidenceList.filter(e => e.factorCode === f).length;
      const isEvidenceRequired = factorCriteria.evidenceRequirement === 'REQUIRED';
      const hasOverall = !!responses[`${f}_overall`];
      
      const missingQCount = requiredQuestions.length - completedRequired + (hasOverall ? 0 : 1);
      
      if (missingQCount > 0) {
        alert(`This section is incomplete: ${missingQCount} required item(s) remain.`);
        return;
      } else if (isEvidenceRequired && evCount === 0) {
        alert(`This section is incomplete: Required evidence is missing.`);
        return;
      }

      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-roboto">
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
                
                const evCount = evidenceList.filter(e => e.factorCode === f).length;
                const isEvidenceRequired = factorCriteria.evidenceRequirement === 'REQUIRED';
                const hasOverall = !!responses[`${f}_overall`];
                  const isComplete = completedRequired === requiredQuestions.length && (!isEvidenceRequired || evCount > 0) && hasOverall;

                return (
                  <div key={f} className={`flex items-center gap-3 ${isComplete ? "text-green-400" : currentStep === stepNum ? "text-white" : stepNum < currentStep ? "text-amber-500" : "text-stone-600"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold ${isComplete ? (currentStep === stepNum ? "border-green-400 bg-green-400/20 ring-2 ring-green-400/30 text-green-400" : "border-green-400 bg-green-400/10 text-green-400") : currentStep === stepNum ? "border-brand-primary bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20" : stepNum < currentStep ? "border-amber-500/50 bg-amber-500/10 text-amber-500" : "border-stone-700 bg-stone-800 text-stone-500"}`}>
                      {isComplete ? <FaCheck /> : stepNum < currentStep ? "!" : stepNum + 1}
                    </div>
                    <span className={`text-sm font-medium ${currentStep === stepNum ? "font-bold" : ""}`}>{FACTOR_LABELS[f] || f}</span>
                  </div>
                );
              })}
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
                      <div key={q.id} className="space-y-3">
                        <label className="block font-medium text-stone-900">{q.label}</label>
                        
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

                <div className="mt-8 border-t border-gray-100 pt-8 animate-in slide-in-from-top-4 duration-300">
                  <h4 className="font-bold text-stone-900 mb-2">Evidence Upload</h4>
                  <p className="text-sm text-stone-500 mb-2">Suggested Supporting Evidence: {criteria.suggestedEvidence.join(', ')}</p>
                  
                  {(() => {
                    const existingEvidences = evidenceList.filter(e => e.factorCode === factorCode);
                    
                    return (
                      <div className="space-y-4">
                        {existingEvidences.map(existingEvidence => (
                          <div key={existingEvidence.evidenceId} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-3 text-green-800">
                              <FaCheck />
                              <span className="font-medium text-sm truncate max-w-[200px] md:max-w-xs">{existingEvidence.filename || existingEvidence.originalFilename}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteEvidence(existingEvidence.evidenceId)}
                              className="text-red-500 hover:text-red-700 p-2 transition-colors"
                              title="Remove Evidence"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}

                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                          <input 
                            type="file" 
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleUploadEvidence(e.target.files[0], factorCode);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="flex flex-col items-center gap-2 pointer-events-none">
                            <FaUpload className="text-xl text-stone-400" />
                            <span className="font-medium text-stone-700 text-sm">Click to upload or drag and drop additional evidence</span>
                            <span className="text-xs text-stone-500">PDF, JPG, PNG up to 10MB</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                
                <p className="text-xs text-stone-400 mt-6 text-center italic">Criteria are tailored to your selected role and primary craft.</p>
              </>
            );})()}

            {currentStep > factors.length && (
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
                        
                        const evCount = evidenceList.filter(e => e.factorCode === f).length;
                        const isEvidenceRequired = factorCriteria.evidenceRequirement === 'REQUIRED';
                        
                        const hasOverall = !!responses[`${f}_overall`];
                  const isComplete = completedRequired === requiredQuestions.length && (!isEvidenceRequired || evCount > 0) && hasOverall;
                        
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

            {currentStep <= factors.length ? (
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
