const fs = require('fs');
let code = fs.readFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', 'utf8');

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
        alert(\`This section is incomplete: \${missingQCount} required item(s) remain.\`);
        return;
      } else if (isEvidenceRequired && evCount === 0) {
        alert(\`This section is incomplete: Required evidence is missing.\`);
        return;
      }

      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };`;

const oldHandleNext = `  const handleNext = () => {
    if (currentStep === 0) {
      handleCreateDraft();
    } else if (currentStep <= factors.length) {
      setCurrentStep(prev => prev + 1);
    }
  };`;

code = code.replace(oldHandleNext, newHandleNextCode);

// Sometimes CRLF vs LF
code = code.replace(/  const handleNext = \(\) => \{\r?\n    if \(currentStep === 0\) \{\r?\n      handleCreateDraft\(\);\r?\n    \} else if \(currentStep <= factors\.length\) \{\r?\n      setCurrentStep\(prev => prev \+ 1\);\r?\n    \}\r?\n  \};/, newHandleNextCode);

fs.writeFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', code);
console.log('Update complete');
