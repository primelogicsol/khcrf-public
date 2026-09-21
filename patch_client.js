const fs = require('fs');

let code = fs.readFileSync('frontend/src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', 'utf8');

// Add imports
code = code.replace(/import \{ useRouter, useSearchParams \} from "next\/navigation";\n/, 'import { useRouter, useSearchParams } from "next/navigation";\nimport { useEvaluationAutofill } from "./evaluationAutofill";\n');

// Inject the hook
const hookInjection = `
  const { isRunning, isComplete } = useEvaluationAutofill({
    searchParams, currentStep, factors, getFactorCriteria,
    setCurrentStep, setEvaluationId, setTrackingId, setEntityType,
    setEntityName, setCraftType, setSecondaryCrafts, setRoleInValueChain,
    setDistrict, setYearsActive, setOperatingScale, setPrincipalMarkets,
    setExistingRegistration, setResponses, isCheckingStatus: checkingStatus,
    entityType, roleInValueChain, craftType, evaluationId
  });
`;

code = code.replace(/const factors = /, hookInjection + '\n  const factors = ');

// Add UI indicator
const uiIndicator = `
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
`;

code = code.replace(/<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8 font-roboto">/, `<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8 font-roboto">\n${uiIndicator}`);

fs.writeFileSync('frontend/src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', code);
