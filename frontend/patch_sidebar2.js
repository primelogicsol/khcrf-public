const fs = require('fs');
let code = fs.readFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', 'utf8');

const oldSidebar = `                  return (
                    <div key={f} className={\`flex items-center gap-3 \${isComplete ? "text-green-400" : currentStep === stepNum ? "text-white" : stepNum < currentStep ? "text-amber-500" : "text-stone-600"}\`}>
                      <div className={\`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold \${isComplete ? (currentStep === stepNum ? "border-green-400 bg-green-400/20 ring-2 ring-green-400/30 text-green-400" : "border-green-400 bg-green-400/10 text-green-400") : currentStep === stepNum ? "border-brand-primary bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20" : stepNum < currentStep ? "border-amber-500/50 bg-amber-500/10 text-amber-500" : "border-stone-700 bg-stone-800 text-stone-500"}\`}>
                        {isComplete ? <FaCheck /> : stepNum < currentStep ? "!" : stepNum + 1}
                      </div>
                      <span className={\`text-sm font-medium \${currentStep === stepNum ? "font-bold" : ""}\`}>{FACTOR_LABELS[f] || f}</span>
                    </div>
                  );`;

const newSidebar = `                  let missingReason = "";
                  if (!isComplete && stepNum < currentStep) {
                    const missingQCount = requiredQuestions.length - completedRequired + (hasOverall ? 0 : 1);
                    if (missingQCount > 0) {
                      missingReason = \`\${missingQCount} required response\${missingQCount > 1 ? 's' : ''} missing\`;
                    }
                  }

                  return (
                    <div key={f} className="flex flex-col gap-1 cursor-pointer group" onClick={() => setCurrentStep(stepNum)}>
                      <div className={\`flex items-center gap-3 \${isComplete ? "text-green-400" : currentStep === stepNum ? "text-white" : stepNum < currentStep ? "text-amber-500" : "text-stone-600"}\`}>
                        <div className={\`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold \${isComplete ? (currentStep === stepNum ? "border-green-400 bg-green-400/20 ring-2 ring-green-400/30 text-green-400" : "border-green-400 bg-green-400/10 text-green-400") : currentStep === stepNum ? "border-brand-primary bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20" : stepNum < currentStep ? "border-amber-500/50 bg-amber-500/10 text-amber-500" : "border-stone-700 bg-stone-800 text-stone-500"}\`}>
                          {isComplete ? <FaCheck /> : stepNum < currentStep ? "!" : stepNum + 1}
                        </div>
                        <span className={\`text-sm font-medium group-hover:underline \${currentStep === stepNum ? "font-bold" : ""}\`}>{FACTOR_LABELS[f] || f}</span>
                      </div>
                      {missingReason && (
                        <div className="text-[10px] text-amber-500 ml-11 font-bold bg-amber-500/10 px-2 py-0.5 rounded inline-block self-start">
                          {missingReason}
                        </div>
                      )}
                    </div>
                  );`;

code = code.replace(oldSidebar, newSidebar);
// Fix the text styling in Entity Setup
code = code.replace(
  /<div className=\{\`flex items-center gap-3 \$\{currentStep > 0 \? "text-green-400" : currentStep === 0 \? "text-white" : "text-stone-600"\}\`\}>/g,
  `<div className={\`flex items-center gap-3 \${currentStep > 0 ? "text-green-400" : currentStep === 0 ? "text-white" : "text-stone-600"}\`}>`
);

fs.writeFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', code);
console.log('Sidebar patch complete.');
