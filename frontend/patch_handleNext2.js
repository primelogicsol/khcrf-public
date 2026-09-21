const fs = require('fs');
let code = fs.readFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', 'utf8');

const regex = /let completedRequired = 0;[\s\S]*?alert\(\`This section is incomplete: \$\{missingQCount\} required item\(s\) remain\.\`\);\s*return;\s*\}/;

const replacement = `const missingIds: string[] = [];
        requiredQuestions.forEach(q => {
          const val = responses[\`\${f}_\${q.id}\`];
          if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
            missingIds.push(q.id);
          }
        });
        const hasOverall = !!responses[\`\${f}_overall\`];
        if (!hasOverall) missingIds.push('overall');
        
        if (missingIds.length > 0) {
          const qCount = missingIds.includes('overall') ? missingIds.length - 1 : missingIds.length;
          const msg = \`\${qCount} required response(s) missing\` + (!hasOverall ? (qCount > 0 ? ' and 1 overall claim not selected' : '1 overall claim not selected') : '');
          setValidationErrors({ missingIds, missingMsg: msg });
          setTimeout(() => {
            document.getElementById(\`question-\${missingIds[0]}\`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
          return;
        }`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/app/(main)/business-support/evaluation/form/EvaluationFormClient.tsx', code);
console.log("HandleNext patched.");
