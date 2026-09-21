import re

with open("frontend/src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. State
content = content.replace(
    "  const [evidenceList, setEvidenceList] = useState<any[]>([]);",
    "  const [evidenceList, setEvidenceList] = useState<any[]>([]);\n  const [uploadTags, setUploadTags] = useState<string[]>([]);"
)

# 2. totalSteps
content = content.replace(
    "  const totalSteps = factors.length + 1; // +1 for Setup",
    "  const totalSteps = factors.length + 2; // +1 for Setup, +1 for Evidence"
)

# 3. handleNext
old_handleNext = """  const handleNext = () => {
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
  };"""

new_handleNext = """  const handleNext = () => {
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
      
      const hasOverall = !!responses[`${f}_overall`];
      
      const missingQCount = requiredQuestions.length - completedRequired + (hasOverall ? 0 : 1);
      
      if (missingQCount > 0) {
        alert(`This section is incomplete: ${missingQCount} required item(s) remain.`);
        return;
      }

      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === factors.length + 1) {
      const missingRequiredFactors: string[] = [];
      factors.forEach(f => {
        const factorCriteria = getFactorCriteria(entityType as EntityType, roleInValueChain, craftType, f);
        const isEvidenceRequired = factorCriteria.evidenceRequirement === 'REQUIRED';
        if (isEvidenceRequired) {
          const hasEvidence = evidenceList.some(e => e.factorCode && e.factorCode.includes(f));
          if (!hasEvidence) {
            missingRequiredFactors.push(FACTOR_LABELS[f] || f);
          }
        }
      });
      
      if (missingRequiredFactors.length > 0) {
        alert(`Missing required evidence for: ${missingRequiredFactors.join(', ')}`);
        return;
      }

      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };"""
content = content.replace(old_handleNext, new_handleNext)

# 4. Sidebar factors map logic
old_sidebar_factor = """                const evCount = evidenceList.filter(e => e.factorCode === f).length;
                const isEvidenceRequired = factorCriteria.evidenceRequirement === 'REQUIRED';
                const hasOverall = !!responses[`${f}_overall`];
                  const isComplete = completedRequired === requiredQuestions.length && (!isEvidenceRequired || evCount > 0) && hasOverall;"""
new_sidebar_factor = """                const hasOverall = !!responses[`${f}_overall`];
                const isComplete = completedRequired === requiredQuestions.length && hasOverall;"""
content = content.replace(old_sidebar_factor, new_sidebar_factor)

# 5. Sidebar insert new step
old_sidebar_insert = """                );
              })}
            </div>
          </div>
          <div className="relative z-10 mt-8">"""
new_sidebar_insert = """                );
              })}
              
              {(() => {
                const evidenceStepNum = factors.length + 1;
                return (
                  <div key="evidence-step" className={`flex items-center gap-3 ${currentStep > evidenceStepNum ? "text-green-400" : currentStep === evidenceStepNum ? "text-white" : "text-stone-600"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold ${currentStep > evidenceStepNum ? "border-green-400 bg-green-400/10 text-green-400" : currentStep === evidenceStepNum ? "border-brand-primary bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20" : "border-stone-700 bg-stone-800 text-stone-500"}`}>
                      {currentStep > evidenceStepNum ? <FaCheck /> : evidenceStepNum + 1}
                    </div>
                    <span className={`text-sm font-medium ${currentStep === evidenceStepNum ? "font-bold" : ""}`}>Evidence & Documents</span>
                  </div>
                );
              })()}
            </div>
          </div>
          <div className="relative z-10 mt-8">"""
content = content.replace(old_sidebar_insert, new_sidebar_insert)

# 6. Remove old evidence upload section from inside the individual factors
import re
pattern = re.compile(r'<div className="mt-8 border-t border-gray-100 pt-8 animate-in slide-in-from-top-4 duration-300">.*?</div>(?=\s*<p className="text-xs text-stone-400 mt-6 text-center italic">Criteria are tailored to your selected role and primary craft.</p>)', re.DOTALL)
content = pattern.sub('', content)

# 7. Final Step / Evidence Step Injection
old_final_step = """                        const evCount = evidenceList.filter(e => e.factorCode === f).length;
                        const isEvidenceRequired = factorCriteria.evidenceRequirement === 'REQUIRED';
                        
                        const hasOverall = !!responses[`${f}_overall`];
                  const isComplete = completedRequired === requiredQuestions.length && (!isEvidenceRequired || evCount > 0) && hasOverall;"""
new_final_step = """                        const evCount = evidenceList.filter(e => e.factorCode && e.factorCode.includes(f)).length;
                        const isEvidenceRequired = factorCriteria.evidenceRequirement === 'REQUIRED';
                        
                        const hasOverall = !!responses[`${f}_overall`];
                        const isComplete = completedRequired === requiredQuestions.length && hasOverall;"""
content = content.replace(old_final_step, new_final_step)

# Add the new step before Final Step
old_final_step_condition = "{currentStep > factors.length && ("
new_final_step_condition = """            {currentStep === factors.length + 1 && (
              <>
                <span data-editorial-accent-text className="font-bold tracking-widest uppercase text-xs mb-2 block">
                  Step {factors.length + 2}
                </span>
                <h3 className="text-2xl font-playfair font-bold text-stone-900 mb-8 leading-tight">
                  Evidence & Documents
                </h3>
                
                <div className="bg-brand-primary/5 p-4 rounded-lg mb-6 border border-brand-primary/10">
                  <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-brand-primary mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm mb-1">Evidence Package</h4>
                      <p className="text-sm text-stone-700">Please provide documents supporting your claims. You can tag each document to one or more factors.</p>
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
                    <p className="text-xs text-stone-600">GI documentation, material invoices, artisan/workshop records, product or process evidence.</p>
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
                    
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                      <input 
                        type="file" 
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
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 mb-4">Uploaded Evidence & Factor Support</h4>
                  
                  <div className="space-y-3 mb-6">
                    {evidenceList.length === 0 ? (
                      <p className="text-sm text-stone-500 italic">No evidence uploaded yet.</p>
                    ) : (
                      evidenceList.map(e => (
                        <div key={e.evidenceId} className="flex items-start justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-start gap-3 text-green-800">
                            <FaCheck className="mt-1 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-sm break-all">{e.filename || e.originalFilename}</p>
                              <p className="text-xs text-green-700 mt-1">Tags: {e.factorCode?.split(',').map((code: string) => FACTOR_LABELS[code] || code).join(', ') || 'None'}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteEvidence(e.evidenceId)}
                            className="text-red-500 hover:text-red-700 p-2 transition-colors flex-shrink-0"
                            title="Remove Evidence"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {(() => {
                    const supportedFactors = factors.filter(f => evidenceList.some(e => e.factorCode && e.factorCode.includes(f)));
                    const unsupportedFactors = factors.filter(f => !supportedFactors.includes(f));
                    
                    return (
                      <div className="bg-stone-50 p-4 border rounded-lg">
                        <p className="font-bold text-stone-900 mb-4">Your evidence package currently supports {supportedFactors.length} of {factors.length} factors.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-bold text-green-700 mb-2">Well supported:</h5>
                            {supportedFactors.length === 0 ? <p className="text-xs text-stone-500">None</p> : (
                              <ul className="list-disc pl-4 text-xs text-stone-700 space-y-1">
                                {supportedFactors.map(f => <li key={f}>{FACTOR_LABELS[f] || f}</li>)}
                              </ul>
                            )}
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-amber-600 mb-2">Additional evidence recommended:</h5>
                            {unsupportedFactors.length === 0 ? <p className="text-xs text-stone-500">None</p> : (
                              <ul className="list-disc pl-4 text-xs text-stone-700 space-y-1">
                                {unsupportedFactors.map(f => <li key={f}>{FACTOR_LABELS[f] || f}</li>)}
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

            {currentStep > factors.length + 1 && ("""
content = content.replace(old_final_step_condition, new_final_step_condition)

# Next button logic
old_next_btn = "{currentStep <= factors.length ? ("
new_next_btn = "{currentStep <= factors.length + 1 ? ("
content = content.replace(old_next_btn, new_next_btn)

with open("frontend/src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Done patching.")
