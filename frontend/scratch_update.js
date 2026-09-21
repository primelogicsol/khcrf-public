const fs = require('fs');
let code = fs.readFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', 'utf8');

// Replace the two occurrences of isComplete logic
code = code.replace(/const isComplete = completedRequired === requiredQuestions\.length && \(!isEvidenceRequired \|\| evCount > 0\);/g, 
`const hasOverall = !!responses[\`\${f}_overall\`];
                  const isComplete = completedRequired === requiredQuestions.length && (!isEvidenceRequired || evCount > 0) && hasOverall;`);

// Fix the styling for Entity Setup
code = code.replace(
  /<div className=\{\`flex items-center gap-3 \$\{currentStep === 0 \? "text-brand-primary" : "text-green-400"\}\`\}>/g,
  `<div className={\`flex items-center gap-3 \${isCompleteSetup ? "text-green-400" : currentStep === 0 ? "text-white" : "text-stone-600"}\`}>`
);
code = code.replace(
  /<div className=\{\`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold \$\{currentStep === 0 \? "border-brand-primary bg-brand-primary\/10" : "border-green-400 bg-green-400\/10"\}\`\}>/g,
  `<div className={\`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold \${isCompleteSetup ? "border-green-400 bg-green-400/10 text-green-400" : currentStep === 0 ? "border-brand-primary bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20" : "border-stone-700 bg-stone-800 text-stone-500"}\`}>`
);
// Make sure isCompleteSetup is defined. Actually, let's just make it always completed if currentStep > 0
code = code.replace(
  `{currentStep > 0 ? <FaCheck /> : 1}`,
  `{currentStep > 0 ? <FaCheck /> : 1}`
);

// We need to inject `const isCompleteSetup = currentStep > 0;` before using it. Let's just use `currentStep > 0` directly.
code = code.replace(/isCompleteSetup/g, 'currentStep > 0');

// Fix the styling for factors in the sidebar
code = code.replace(
  /<div key=\{f\} className=\{\`flex items-center gap-3 \$\{currentStep === stepNum \? "text-brand-primary" : isComplete \? "text-green-400" : "text-stone-600"\}\`\}>/g,
  `<div key={f} className={\`flex items-center gap-3 \${isComplete ? "text-green-400" : currentStep === stepNum ? "text-white" : "text-stone-600"}\`}>`
);

code = code.replace(
  /<div className=\{\`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold \$\{currentStep === stepNum \? "border-brand-primary bg-brand-primary\/10" : isComplete \? "border-green-400 bg-green-400\/10" : "border-stone-700 bg-stone-800"\}\`\}>/g,
  `<div className={\`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold \${isComplete ? "border-green-400 bg-green-400/10 text-green-400" : currentStep === stepNum ? "border-brand-primary bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20" : "border-stone-700 bg-stone-800 text-stone-500"}\`}>`
);

// If completed, AND it is the current step, it should remain green, but maybe have a subtle active indication.
// `\${isComplete ? (currentStep === stepNum ? "border-green-400 bg-green-400/20 ring-2 ring-green-400/30 text-green-400" : "border-green-400 bg-green-400/10 text-green-400") : currentStep === stepNum ? "border-brand-primary bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20" : "border-stone-700 bg-stone-800 text-stone-500"}`
code = code.replace(
  /isComplete \? "border-green-400 bg-green-400\/10 text-green-400"/g,
  `isComplete ? (currentStep === stepNum ? "border-green-400 bg-green-400/20 ring-2 ring-green-400/30 text-green-400" : "border-green-400 bg-green-400/10 text-green-400")`
);
// Also for the text
code = code.replace(
  /isComplete \? "text-green-400"/g,
  `isComplete ? "text-green-400"`
);

// For text, let's make sure `currentStep === stepNum ? "font-bold"` stays. But if it's completed, we still want it to be green.
// No need to change the span, it's: `<span className={\`text-sm font-medium \${currentStep === stepNum ? "font-bold" : ""}\`}>{FACTOR_LABELS[f] || f}</span>`

fs.writeFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', code);
console.log('Update complete');
