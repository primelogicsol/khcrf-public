const fs = require('fs');

let code = fs.readFileSync('frontend/src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', 'utf8');

// Remove the import of useFormAutofill
code = code.replace(/import \{ useFormAutofill \} from "@\/lib\/form-autofill\/engine";\n/, '');

// Remove the useFormAutofill block
const adapterStart = code.indexOf('const { isRunning, currentScenario, error: autofillError } = useFormAutofill');
if (adapterStart !== -1) {
  const adapterEnd = code.indexOf('});', adapterStart) + 3;
  code = code.substring(0, adapterStart) + code.substring(adapterEnd);
}

// Remove the UI indicator
code = code.replace(/\{isRunning && currentScenario && \([\s\S]*?\}\)/g, '');
code = code.replace(/\{\!isRunning && currentScenario && currentStep === currentScenario\.stopAtStep && \([\s\S]*?\}\)/g, '');

// Also remove `const searchParams = useSearchParams();` if it's there
// Wait, I will need it for the new logic.

fs.writeFileSync('frontend/src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', code);
