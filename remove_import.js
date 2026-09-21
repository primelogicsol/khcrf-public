const fs = require('fs');
let code = fs.readFileSync('frontend/src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', 'utf8');
code = code.replace(/import \{ useFormAutofill \} from "@\/lib\/form-autofill\/engine";\r?\n/, '');
fs.writeFileSync('frontend/src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', code);
