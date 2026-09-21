const fs = require('fs');
let c = fs.readFileSync('backend/src/routes/evaluationRoutes.ts', 'utf8');

c = c.replace(
    'import {',
    'import { transmitToCraftlore, '
);

c = c.replace(
    'router.post(\'/:id/complete-review\', authenticateToken, authorizeAdmin, completeVerificationReview);',
    'router.post(\'/:id/complete-review\', authenticateToken, authorizeAdmin, completeVerificationReview);\nrouter.post(\'/:id/transmit-craftlore\', authenticateToken, authorizeAdmin, transmitToCraftlore);'
);

fs.writeFileSync('backend/src/routes/evaluationRoutes.ts', c);
console.log('Appended transmit route');
