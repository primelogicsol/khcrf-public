const fs = require('fs');
let content = fs.readFileSync('backend/src/controllers/skcEvidenceController.ts', 'utf8');

content = content.replace(/return res\.json\(\{\s*data: finalData,\s*success: true,\s*data: finalData,/g, 'return res.json({\n            success: true,\n            data: finalData,');

fs.writeFileSync('backend/src/controllers/skcEvidenceController.ts', content);
console.log('Fixed backend JSON return');
