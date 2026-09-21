const fs = require('fs');
let code = fs.readFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', 'utf8');

// 1. Add validationErrors state
code = code.replace(
  'const [uploadTags, setUploadTags] = useState<string[]>([]);',
  'const [uploadTags, setUploadTags] = useState<string[]>([]);\n  const [validationErrors, setValidationErrors] = useState<{ missingIds: string[], missingMsg: string } | null>(null);'
);

// 2. Clear validationErrors on step change
code = code.replace(
  'setCurrentStep(prev => prev + 1);',
  'setValidationErrors(null);\n        setCurrentStep(prev => prev + 1);'
);
// replace other instances of setCurrentStep to also clear errors
code = code.replace(
  'setCurrentStep(prev => prev - 1);',
  'setValidationErrors(null);\n        setCurrentStep(prev => prev - 1);'
);
code = code.replace(
  'setCurrentStep(stepNum)',
  'setValidationErrors(null); setCurrentStep(stepNum)'
);
code = code.replace(
  'setCurrentStep(evStepNum)',
  'setValidationErrors(null); setCurrentStep(evStepNum)'
);

// 3. Fix handleNext
const oldHandleNextBody = `        const f = factors[currentStep - 1];
        const factorCriteria = getFactorCriteria(entityType as EntityType, roleInValueChain, craftType, f);
        const requiredQuestions = factorCriteria.questions.filter(q => q.required);
        
        let completedRequired = 0;
        requiredQuestions.forEach(q => {
          const val = responses[\`\${f}_\${q.id}\`];
          if (val !== undefined && val !== null && val !== '' && (Array.isArray(val) ? val.length > 0 : true)) {
            completedRequired++;
          }
        });
        const hasOverall = !!responses[\`\${f}_overall\`];
        const missingQCount = requiredQuestions.length - completedRequired + (hasOverall ? 0 : 1);
        
        if (missingQCount > 0) {
          alert(\`This section is incomplete: \${missingQCount} required item(s) remain.\`);
          return;
        }`;

const newHandleNextBody = `        const f = factors[currentStep - 1];
        const factorCriteria = getFactorCriteria(entityType as EntityType, roleInValueChain, craftType, f);
        const requiredQuestions = factorCriteria.questions.filter(q => q.required);
        
        const missingIds: string[] = [];
        requiredQuestions.forEach(q => {
          const val = responses[\`\${f}_\${q.id}\`];
          if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
            missingIds.push(q.id);
          }
        });
        const hasOverall = !!responses[\`\${f}_overall\`];
        if (!hasOverall) missingIds.push('overall');
        
        if (missingIds.length > 0) {
          const qCount = missingIds.includes('overall') ? missingIds.length - 1 : missingIds.length;
          const msg = \`\${qCount} required response(s) missing\` + (!hasOverall ? (qCount > 0 ? ' and 1 overall claim not selected' : '1 overall claim not selected') : '');
          setValidationErrors({ missingIds, missingMsg: msg });
          setTimeout(() => {
            document.getElementById(\`question-\${missingIds[0]}\`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
          return;
        }`;

code = code.replace(oldHandleNextBody, newHandleNextBody);

// 4. Evidence validation in handleNext
const oldEvValidation = `      let missingEvidenceFactors = [];
      factors.forEach(f => {
        const factorCriteria = getFactorCriteria(entityType as EntityType, roleInValueChain, craftType, f);
        if (factorCriteria.evidenceRequirement === 'REQUIRED') {
          const supported = evidenceList.some(e => e.factorCode && e.factorCode.includes(f));
          if (!supported) {
            missingEvidenceFactors.push(FACTOR_LABELS[f] || f);
          }
        }
      });
      if (missingEvidenceFactors.length > 0) {
        alert("Missing required evidence for:\\n" + missingEvidenceFactors.join("\\n"));
        return;
      }`;

const newEvValidation = `      let missingEvidenceFactors: string[] = [];
      factors.forEach(f => {
        const factorCriteria = getFactorCriteria(entityType as EntityType, roleInValueChain, craftType, f);
        if (factorCriteria.evidenceRequirement === 'REQUIRED') {
          const supported = evidenceList.some(e => e.factorCode && e.factorCode.includes(f));
          if (!supported) {
            missingEvidenceFactors.push(FACTOR_LABELS[f] || f);
          }
        }
      });
      if (missingEvidenceFactors.length > 0) {
        setValidationErrors({ missingIds: [], missingMsg: "Missing required evidence for: " + missingEvidenceFactors.join(", ") });
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
        return;
      }`;

code = code.replace(oldEvValidation, newEvValidation);


// 5. Render validation errors inline
const inlineValidation = `                <h3 className="text-2xl font-playfair font-bold text-stone-900 mb-4 leading-tight">
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
                )}`;

code = code.replace(
  /<h3 className="text-2xl font-playfair font-bold text-stone-900 mb-4 leading-tight">\s*\{criteria\.title\}\s*<\/h3>/,
  inlineValidation
);

// Do the same for Evidence Step
const evidenceInlineValidation = `                <h3 className="text-2xl font-playfair font-bold text-stone-900 mb-4 leading-tight">
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
                )}`;

code = code.replace(
  /<h3 className="text-2xl font-playfair font-bold text-stone-900 mb-4 leading-tight">\s*Evidence & Documents\s*<\/h3>/,
  evidenceInlineValidation
);

// 6. Highlight missing questions
code = code.replace(
  /<div key=\{q\.id\} className="space-y-3">/g,
  `<div key={q.id} id={\`question-\${q.id}\`} className={\`space-y-3 p-4 -mx-4 rounded-lg transition-colors \${validationErrors?.missingIds.includes(q.id) ? 'bg-amber-50/50 border border-amber-200' : ''}\`}>`
);

// For overall it's not mapped from questions directly? Wait, overall is often `id: 'overall'`. Let's just use it dynamically since it's in the `questions` array.
// Wait! Is overall in `questions`? Yes! In `evaluationRegistry.ts`: `{ id: 'overall', label: 'Based on the criteria above...', type: 'QUALITATIVE', required: true }`.
// Wait, then the missingQCount logic from before separated them out!
// Let's verify `evaluationRegistry.ts` if `overall` is in `questions`. It IS.
// But my earlier code in handleNext removed `completedRequired++` for `hasOverall`?
// Let's add the inline error message under the field.
const qTypeQualitative = `{validationErrors?.missingIds.includes(q.id) && (
                            <div className="flex items-center gap-2 text-amber-600 text-xs font-bold mt-2">
                              <FaInfoCircle /> {q.id === 'overall' ? 'Please select your overall self-reported position.' : 'Required: Please provide this information before continuing.'}
                            </div>
                          )}
                          {q.type === 'QUALITATIVE' && (`;

code = code.replace(
  /\{q\.type === 'QUALITATIVE' && \(/g,
  qTypeQualitative
);

fs.writeFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', code);
console.log('Patch complete.');
