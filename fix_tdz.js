const fs = require('fs');

let code = fs.readFileSync('frontend/src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', 'utf8');

const hookCallStr = `  const { isRunning, isComplete } = useEvaluationAutofill({
    searchParams, currentStep, factors, getFactorCriteria,
    setCurrentStep, setEvaluationId, setTrackingId, setEntityType,
    setEntityName, setCraftType, setSecondaryCrafts, setRoleInValueChain,
    setDistrict, setYearsActive, setOperatingScale, setPrincipalMarkets,
    setExistingRegistration, setResponses, isCheckingStatus: checkingStatus,
    entityType, roleInValueChain, craftType, evaluationId
  });\n`;

code = code.replace(hookCallStr, '');

// Re-insert the hook call AFTER const totalSteps = ...
const searchStr = '  const totalSteps = factors.length + 2; // +1 for Setup, +1 for Evidence';
const insertIdx = code.indexOf(searchStr) + searchStr.length;

if (insertIdx > searchStr.length) {
  code = code.substring(0, insertIdx) + '\n\n' + hookCallStr + code.substring(insertIdx);
} else {
  console.error("Could not find searchStr");
}

fs.writeFileSync('frontend/src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', code);
