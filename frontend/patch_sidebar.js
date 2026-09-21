const fs = require('fs');
let code = fs.readFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', 'utf8');

// 1. Modify handleNext
const handleNextCode = `  const handleNext = () => {
    if (currentStep === 0) {
      handleCreateDraft();
    } else if (currentStep <= factors.length) {
      setCurrentStep(prev => prev + 1);
    }
  };`;

const newHandleNextCode = `  const handleNext = () => {
    if (currentStep === 0) {
      handleCreateDraft();
    } else if (currentStep <= factors.length) {
      const f = factors[currentStep - 1];
      const factorCriteria = getFactorCriteria(entityType as EntityType, roleInValueChain, craftType, f);
      const requiredQuestions = factorCriteria.questions.filter(q => q.required);
      
      let completedRequired = 0;
      requiredQuestions.forEach(q => {
        const val = responses[\`\${f}_\${q.id}\`];
        if (val !== undefined && val !== null && val !== '' && (Array.isArray(val) ? val.length > 0 : true)) {
          completedRequired++;
        }
      });
      
      const evCount = evidenceList.filter(e => e.factorCode === f).length;
      const isEvidenceRequired = factorCriteria.evidenceRequirement === 'REQUIRED';
      const hasOverall = !!responses[\`\${f}_overall\`];
      
      const missingQCount = requiredQuestions.length - completedRequired + (hasOverall ? 0 : 1);
      
      if (missingQCount > 0) {
        alert(\`This section is incomplete: \${missingQCount} required response(s) missing. Please complete them before proceeding.\`);
        return;
      } else if (isEvidenceRequired && evCount === 0) {
        alert(\`This section is incomplete: Required evidence is missing. Please upload evidence before proceeding.\`);
        return;
      }

      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };`;

if (code.includes('handleCreateDraft();\n    } else if (currentStep <= factors.length) {\n      setCurrentStep(prev => prev + 1);\n    }')) {
  code = code.replace(/const handleNext = \(\) => \{[\s\S]*?setCurrentStep\(prev => prev \+ 1\);\n    \}\n  \};/, newHandleNextCode);
} else {
  console.log("Could not find handleNext to replace!");
}


// 2. Modify sidebar loop
const sidebarOld = `                  return (
                    <div key={f} className={\`flex items-center gap-3 \${isComplete ? "text-green-400" : currentStep === stepNum ? "text-white" : stepNum < currentStep ? "text-amber-500" : "text-stone-600"}\`}>
                      <div className={\`w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-bold \${isComplete ? (currentStep === stepNum ? "border-green-400 bg-green-400/20 ring-2 ring-green-400/30 text-green-400" : "border-green-400 bg-green-400/10 text-green-400") : currentStep === stepNum ? "border-brand-primary bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20" : stepNum < currentStep ? "border-amber-500/50 bg-amber-500/10 text-amber-500" : "border-stone-700 bg-stone-800 text-stone-500"}\`}>
                        {isComplete ? <FaCheck /> : stepNum < currentStep ? "!" : stepNum + 1}
                      </div>
                      <span className={\`text-sm font-medium \${currentStep === stepNum ? "font-bold" : ""}\`}>{FACTOR_LABELS[f] || f}</span>
                    </div>
                  );`;

const sidebarNew = `                  let missingReason = "";
                  if (!isComplete && stepNum < currentStep) {
                    const missingQCount = requiredQuestions.length - completedRequired + (hasOverall ? 0 : 1);
                    if (missingQCount > 0) {
                      missingReason = \`\${missingQCount} required response\${missingQCount > 1 ? 's' : ''} missing\`;
                    } else if (isEvidenceRequired && evCount === 0) {
                      missingReason = "Required evidence missing";
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

if (code.includes('<div key={f} className={`flex items-center gap-3 ${isComplete ? "text-green-400" : currentStep === stepNum ? "text-white" : stepNum < currentStep ? "text-amber-500" : "text-stone-600"}`}>')) {
  code = code.replace(/                  return \([\s\S]*?\{FACTOR_LABELS\[f\] \|\| f\}<\/span>\n                    <\/div>\n                  \);/, sidebarNew);
} else {
  console.log("Could not find sidebar render to replace!");
}

fs.writeFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', code);
console.log('Update complete');
