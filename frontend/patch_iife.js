const fs = require('fs');
let code = fs.readFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', 'utf8');

code = code.replace(
  /\{\/\* Centralized Evidence Upload happens in the Evidence & Documents step \*\/\}\s*<\/>\s*\)\}\s*\{currentStep === factors\.length \+ 1 && \(/,
  `{/* Centralized Evidence Upload happens in the Evidence & Documents step */}
                  <p className="text-xs text-stone-400 mt-6 text-center italic">Criteria are tailored to your selected role and primary craft.</p>
                </>
              );})()}

            {currentStep === factors.length + 1 && (`
);

fs.writeFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', code);
console.log("Fixed IIFE closure.");
