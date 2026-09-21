const fs = require('fs');

let code = fs.readFileSync('frontend/src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', 'utf8');

// Find the start of the broken block (it's between handleCreateDraft and handleUpdateDraft)
const startMarker = '    };\n  \n    \n    \n          \n        setResponses(prev => ({ ...prev, ...updates }));';
const startIdx = code.indexOf('setResponses(prev => ({ ...prev, ...updates }));');

if (startIdx !== -1) {
  const handleUpdateDraftIdx = code.indexOf('const handleUpdateDraft = async');
  code = code.substring(0, startIdx) + code.substring(handleUpdateDraftIdx);
}

fs.writeFileSync('frontend/src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', code);
