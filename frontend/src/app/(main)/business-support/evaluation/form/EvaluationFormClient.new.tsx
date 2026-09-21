"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa";

type EntityType = 'ARTISAN' | 'BUSINESS' | 'INSTITUTION';

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
            setResponses(draft.answers || {});
            setCurrentStep(1);

            // Fetch Evidence
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
      showToast("Please fill all fields", "error");
      return;
    }
    try {
      const res = await api.post("/evaluation", {
        entityType,
        entityName,
        craftType
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

  const handleAnswer = (factorKey: string, value: any) => {
    const newResponses = { ...responses, [factorKey]: value };
    setResponses(newResponses);
    handleUpdateDraft({ [factorKey]: value }).catch(() => {
      // Revert if patch fails
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
      const res = await api.post(`/evaluation/${evaluationId}/submit`);
      setIsSubmitted(true);
      showToast("Evaluation submitted successfully!", "success");
    } catch (e: any) {
      showToast(e.response?.data?.message || "Failed to submit", "error");
    }
  };

  if (checkingStatus) return <div className="p-10 text-center">Loading...</div>;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-10 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            <FaCheck />
          </div>
          <h2 className="text-3xl font-playfair font-bold text-stone-900 mb-4">
            Submitted
          </h2>
          <p className="text-lg text-stone-600 mb-2">
            Your Verification ID is: <strong>{trackingId}</strong>
          </p>
          <p className="text-lg text-brand-primary font-bold mb-6">
            Verification pending
          </p>
          <p className="text-stone-500 mb-8">
            This assessment records the information and evidence you provided. KHCRF verification will be conducted separately.
          </p>
          <button
            onClick={() => router.push("/profile/evaluations")}
            className="bg-stone-900 text-white px-8 py-3 rounded uppercase tracking-wider text-sm font-bold"
          >
            Track Verification
          </button>
        </div>
      </div>
    );
  }

  // Very simple matrix for demonstration of Phase 2
  const factors = entityType === 'ARTISAN' ? ['AUTHENTICITY_PROVENANCE', 'CRAFT_QUALITY'] : 
                  entityType === 'BUSINESS' ? ['AUTHENTICITY_PROVENANCE', 'FAIR_WAGES', 'CHILD_LABOUR_SAFEGUARDS'] :
                  entityType === 'INSTITUTION' ? ['AUTHENTICITY_PROVENANCE', 'GROUND_PRESENCE'] : [];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-roboto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar */}
        <div className="bg-stone-900 text-white p-8 md:w-1/3">
          <h2 className="text-2xl font-playfair font-bold mb-6">Performance Evaluation</h2>
          <p className="text-stone-400 mb-4 text-sm">Status: {evaluationId ? 'Draft' : 'New'}</p>
          {trackingId && <p className="text-brand-primary mb-4 font-mono text-sm">{trackingId}</p>}
        </div>

        {/* Content */}
        <div className="p-8 md:w-2/3 flex flex-col justify-between">
          <div>
            {currentStep === 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-playfair font-bold text-stone-900 mb-4">Entity Information</h3>
                
                <select 
                  className="w-full p-3 border rounded"
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value as EntityType)}
                >
                  <option value="">Select Entity Type</option>
                  <option value="ARTISAN">Artisan</option>
                  <option value="BUSINESS">Business</option>
                  <option value="INSTITUTION">Institution</option>
                </select>

                <input 
                  type="text" 
                  placeholder={entityType ? `${entityType.charAt(0) + entityType.slice(1).toLowerCase()} Name` : "Entity Name"}
                  className="w-full p-3 border rounded"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                />

                <input 
                  type="text" 
                  placeholder="Primary Craft"
                  className="w-full p-3 border rounded"
                  value={craftType}
                  onChange={(e) => setCraftType(e.target.value)}
                />

                <button 
                  onClick={handleCreateDraft}
                  className="bg-brand-primary text-white px-6 py-3 rounded mt-4"
                >
                  Start Assessment
                </button>
              </div>
            )}

            {currentStep > 0 && currentStep <= factors.length && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">{factors[currentStep - 1].replace(/_/g, ' ')}</h3>
                
                <div className="flex gap-4">
                  <button 
                    className={`p-3 border rounded flex-1 ${responses[factors[currentStep - 1]] === 'YES' ? 'bg-green-50 border-green-500' : ''}`}
                    onClick={() => handleAnswer(factors[currentStep - 1], 'YES')}
                  >
                    Yes
                  </button>
                  <button 
                    className={`p-3 border rounded flex-1 ${responses[factors[currentStep - 1]] === 'NO' ? 'bg-red-50 border-red-500' : ''}`}
                    onClick={() => handleAnswer(factors[currentStep - 1], 'NO')}
                  >
                    No
                  </button>
                </div>

                {responses[factors[currentStep - 1]] === 'YES' && (
                  <div className="mt-4 p-4 border rounded bg-gray-50">
                    <h4 className="font-bold mb-2 text-sm text-stone-700">Evidence / Supporting Document</h4>
                    {(() => {
                      const existingEvidence = evidenceList.find(e => e.factorCode === factors[currentStep - 1]);
                      if (existingEvidence) {
                        return (
                          <div className="flex justify-between items-center bg-white p-3 border rounded">
                            <span className="text-sm truncate mr-4">{existingEvidence.filename || existingEvidence.originalFilename}</span>
                            <button 
                              onClick={() => handleDeleteEvidence(existingEvidence.evidenceId)}
                              className="text-red-500 text-sm font-bold shrink-0"
                            >
                              Remove
                            </button>
                          </div>
                        );
                      }
                      return (
                        <input 
                          type="file" 
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleUploadEvidence(e.target.files[0], factors[currentStep - 1]);
                            }
                          }}
                          className="w-full p-2 border rounded text-sm bg-white"
                        />
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {currentStep > factors.length && (
              <div className="space-y-6 text-center">
                <h3 className="text-2xl font-playfair font-bold text-stone-900">Declaration & Review</h3>
                <p>I confirm that the claims provided are accurate and understand they are subject to KHCRF verification.</p>
              </div>
            )}
          </div>

          {currentStep > 0 && (
            <div className="mt-10 flex justify-between pt-6 border-t border-gray-100">
              <button onClick={() => setCurrentStep(prev => prev - 1)} className="px-6 py-2 border rounded">Back</button>
              {currentStep <= factors.length ? (
                <button onClick={() => setCurrentStep(prev => prev + 1)} className="px-6 py-2 bg-stone-900 text-white rounded">Next</button>
              ) : (
                <button onClick={handleSubmit} className="px-6 py-2 bg-brand-primary text-white rounded font-bold">Submit Evaluation</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

