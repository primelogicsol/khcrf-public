const fs = require('fs');
let code = fs.readFileSync('frontend/src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', 'utf8');

// Add imports
code = code.replace(
  'import { useRouter } from "next/navigation";',
  'import { useRouter, useSearchParams } from "next/navigation";\nimport { useFormAutofill } from "@/lib/form-autofill/engine";'
);

// Get search params
code = code.replace(
  'const router = useRouter();',
  'const router = useRouter();\n    const searchParams = useSearchParams();'
);

// Add the adapter implementation
// We need to place it after handleUpdateDraft
const adapterCode = `
  const { isRunning, currentScenario, error: autofillError } = useFormAutofill(searchParams.get('autofill'), {
    getCurrentStep: () => currentStep,
    isCheckingStatus: () => checkingStatus,
    fillAndAdvance: async (fields) => {
      if (currentStep === 0) {
        setEntityType(fields.entityType as EntityType);
        setEntityName(fields.entityName as string);
        setCraftType(fields.craftType as string);
        setSecondaryCrafts(fields.secondaryCrafts as string);
        setRoleInValueChain(fields.roleInValueChain as string);
        setDistrict(fields.district as string);
        setYearsActive(fields.yearsActive as string);
        setOperatingScale(fields.operatingScale as string);
        setPrincipalMarkets(fields.principalMarkets as string);
        setExistingRegistration(fields.existingRegistration as string);
        
        // Let state settle then call handleCreateDraft
        // wait a tiny bit to make sure state is updated if needed, but actually handleCreateDraft reads state.
        // Wait, handleCreateDraft reads from STATE. So calling it immediately will use stale state!
        // We can inline the draft creation!
        const payload = {
          entityType: fields.entityType,
          entityName: fields.entityName,
          craftType: fields.craftType,
          additionalInfo: {
            secondaryCrafts: fields.secondaryCrafts, 
            roleInValueChain: fields.roleInValueChain, 
            district: fields.district, 
            yearsActive: fields.yearsActive, 
            operatingScale: fields.operatingScale, 
            principalMarkets: fields.principalMarkets, 
            existingRegistration: fields.existingRegistration
          }
        };
        const res = await api.post("/evaluation", payload);
        setEvaluationId(res.data.id);
        setTrackingId(res.data.trackingId);
        setCurrentStep(1);
        return;
      }

      if (currentStep <= factors.length) {
        const factorCode = factors[currentStep - 1];
        const criteria = getFactorCriteria(entityType as EntityType, roleInValueChain, craftType, factorCode);
        const updates: Record<string, any> = {};
        
        criteria.questions.forEach(q => {
          if (q.required) {
             const key = \`\${factorCode}_\${q.id}\`;
             if (q.type === 'YES_NO') updates[key] = 'Yes';
             else if (q.type === 'QUALITATIVE') updates[key] = 'Meets completely';
             else if (q.type === 'SELECT') updates[key] = (q.options || [])[0] || 'Selected';
             else updates[key] = 'QA Test Value';
          }
        });
        
        setResponses(prev => ({ ...prev, ...updates }));
        await handleUpdateDraft(updates);
        setCurrentStep(prev => prev + 1);
        return;
      }
    }
  });
`;

code = code.replace(
  'const handleUpdateDraft = async (updates: Record<string, any>) => {',
  adapterCode + '\n  const handleUpdateDraft = async (updates: Record<string, any>) => {'
);

// Add the UI indicator
const uiIndicator = `
  {isRunning && currentScenario && (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white px-4 py-2 rounded-lg font-mono text-xs shadow-lg border border-brand-primary flex flex-col items-center">
      <span className="font-bold text-brand-primary">AUTOFILL QA</span>
      <span>Scenario: {currentScenario.id}</span>
      <span>Step: {currentStep} / {totalSteps}</span>
      {autofillError && <span className="text-red-400 mt-1">{autofillError}</span>}
    </div>
  )}
  {!isRunning && currentScenario && currentStep === currentScenario.stopAtStep && (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-900 text-white px-4 py-2 rounded-lg font-mono text-xs shadow-lg border border-green-500 flex flex-col items-center">
      <span className="font-bold text-green-400">AUTOFILL COMPLETE</span>
      <span>Stopped at Step {currentStep}</span>
    </div>
  )}
`;

code = code.replace(
  /<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">/,
  `<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">\n${uiIndicator}`
);

fs.writeFileSync('frontend/src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', code);
