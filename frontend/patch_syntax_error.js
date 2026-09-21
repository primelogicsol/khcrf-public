const fs = require('fs');
let code = fs.readFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', 'utf8');

code = code.replace(
  /onClick=\{\(\) => setValidationErrors\(null\); setCurrentStep\(evStepNum\)\}/g,
  'onClick={() => { setValidationErrors(null); setCurrentStep(evStepNum); }}'
);
code = code.replace(
  /onClick=\{\(\) => setValidationErrors\(null\); setCurrentStep\(stepNum\)\}/g,
  'onClick={() => { setValidationErrors(null); setCurrentStep(stepNum); }}'
);
code = code.replace(
  /onClick=\{\(\) => setValidationErrors\(null\);\s*setCurrentStep\(prev => prev \+ 1\)\}/g,
  'onClick={() => { setValidationErrors(null); setCurrentStep(prev => prev + 1); }}'
);
code = code.replace(
  /onClick=\{\(\) => setValidationErrors\(null\);\s*setCurrentStep\(prev => prev - 1\)\}/g,
  'onClick={() => { setValidationErrors(null); setCurrentStep(prev => prev - 1); }}'
);

fs.writeFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', code);
console.log('Fixed syntax error.');
