import re

filepath = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\business-support\evaluation\form\EvaluationFormClient.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Replace rendering to add MULTI_SELECT and STRUCTURED_TEXT
# Find the end of SELECT block
select_block = """                        {q.type === 'SELECT' && q.options && (
                          <select className="w-full p-3 border rounded focus:border-brand-primary focus:ring-0" value={val || ''} onChange={(e) => handleAnswer(factorCode, q.id, e.target.value)}>
                            <option value="">Select an option</option>
                            {q.options.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        )}"""

replacement = select_block + """

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
                        )}"""

content = content.replace(select_block, replacement)

# Replace Review & Submit Factor Completion section
review_block = """                      {factors.map(f => {
                        const hasResponses = Object.keys(responses).some(k => k.startsWith(f));
                        const evCount = evidenceList.filter(e => e.factorCode === f).length;
                        return (
                          <div key={f} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                            <span className="font-medium text-stone-700">{FACTOR_LABELS[f] || f}</span>
                            <div className="flex items-center gap-4">
                              {hasResponses ? <span className="text-green-600 flex items-center gap-1"><FaCheck className="text-xs"/> Answered</span> : <span className="text-amber-500">Incomplete</span>}
                              <span className={`${evCount > 0 ? "text-green-600" : "text-stone-400"}`}>{evCount} doc(s)</span>
                            </div>
                          </div>
                        );
                      })}"""

new_review_block = """                      {factors.map((f, idx) => {
                        const factorCriteria = getFactorCriteria(entityType as EntityType, craftType, f);
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
                        
                        const isComplete = completedRequired === requiredQuestions.length && (!isEvidenceRequired || evCount > 0);
                        
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
                      })}"""

content = content.replace(review_block, new_review_block)

# Fix progress sidebar logic for completion
sidebar_block = """              {factors.map((f, idx) => {
                const stepNum = idx + 1;
                return (
                  <div key={f} className={`flex items-center gap-3 ${currentStep === stepNum ? "text-brand-primary" : currentStep > stepNum ? "text-green-400" : "text-stone-600"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold ${currentStep === stepNum ? "border-brand-primary bg-brand-primary/10" : currentStep > stepNum ? "border-green-400 bg-green-400/10" : "border-stone-700 bg-stone-800"}`}>
                      {currentStep > stepNum ? <FaCheck /> : stepNum + 1}
                    </div>
                    <span className={`text-sm font-medium ${currentStep === stepNum ? "font-bold" : ""}`}>{FACTOR_LABELS[f] || f}</span>
                  </div>
                );
              })}"""

new_sidebar_block = """              {factors.map((f, idx) => {
                const stepNum = idx + 1;
                const factorCriteria = getFactorCriteria(entityType as EntityType, craftType, f);
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
                const isComplete = completedRequired === requiredQuestions.length && (!isEvidenceRequired || evCount > 0);

                return (
                  <div key={f} className={`flex items-center gap-3 ${currentStep === stepNum ? "text-brand-primary" : isComplete ? "text-green-400" : "text-stone-600"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold ${currentStep === stepNum ? "border-brand-primary bg-brand-primary/10" : isComplete ? "border-green-400 bg-green-400/10" : "border-stone-700 bg-stone-800"}`}>
                      {isComplete ? <FaCheck /> : stepNum + 1}
                    </div>
                    <span className={`text-sm font-medium ${currentStep === stepNum ? "font-bold" : ""}`}>{FACTOR_LABELS[f] || f}</span>
                  </div>
                );
              })}"""
content = content.replace(sidebar_block, new_sidebar_block)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
