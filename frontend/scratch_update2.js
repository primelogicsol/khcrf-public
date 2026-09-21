const fs = require('fs');
let code = fs.readFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', 'utf8');

// For the text class
code = code.replace(
  /<div key=\{f\} className=\{\`flex items-center gap-3 \$\{isComplete \? "text-green-400" : currentStep === stepNum \? "text-white" : "text-stone-600"\}\`\}>/g,
  `<div key={f} className={\`flex items-center gap-3 \${isComplete ? "text-green-400" : currentStep === stepNum ? "text-white" : stepNum < currentStep ? "text-amber-500" : "text-stone-600"}\`}>`
);

// For the circle class
code = code.replace(
  /<div className=\{\`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold \$\{isComplete \? \(currentStep === stepNum \? "border-green-400 bg-green-400\/20 ring-2 ring-green-400\/30 text-green-400" : "border-green-400 bg-green-400\/10 text-green-400"\) : currentStep === stepNum \? "border-brand-primary bg-brand-primary\/10 text-brand-primary ring-2 ring-brand-primary\/20" : "border-stone-700 bg-stone-800 text-stone-500"\}\`\}>/g,
  `<div className={\`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold \${isComplete ? (currentStep === stepNum ? "border-green-400 bg-green-400/20 ring-2 ring-green-400/30 text-green-400" : "border-green-400 bg-green-400/10 text-green-400") : currentStep === stepNum ? "border-brand-primary bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20" : stepNum < currentStep ? "border-amber-500/50 bg-amber-500/10 text-amber-500" : "border-stone-700 bg-stone-800 text-stone-500"}\`}>`
);

// For the exclamation mark
code = code.replace(
  /\{isComplete \? <FaCheck \/> : stepNum \+ 1\}/g,
  `{isComplete ? <FaCheck /> : stepNum < currentStep ? "!" : stepNum + 1}`
);

fs.writeFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', code);
console.log('Update complete');
