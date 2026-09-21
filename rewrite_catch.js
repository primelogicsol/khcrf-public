const fs = require('fs');
let c = fs.readFileSync('backend/src/controllers/fellowshipController.ts', 'utf8');
c = c.replace(
  'cleanupFiles();\n        console.error("FELLOWSHIP ERROR:", error);',
  `cleanupFiles();
        if (error?.code === 'P2002') {
            return res.status(409).json({ status: 'already_submitted', data: { referenceNumber: 'ALREADY_RECEIVED' } });
        }
        console.error("FELLOWSHIP ERROR:", error);`
);
fs.writeFileSync('backend/src/controllers/fellowshipController.ts', c);
