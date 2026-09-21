const fs = require('fs');
let content = fs.readFileSync('backend/src/controllers/skcEvidenceController.ts', 'utf8');

content = content.replace(
    /researchPapers: completedTwoMonthPeriods,/g,
    'researchPapers: 1 + completedMonths,'
);

fs.writeFileSync('backend/src/controllers/skcEvidenceController.ts', content);
console.log('Fixed math for researchPapers');
