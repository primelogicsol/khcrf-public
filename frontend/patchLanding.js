const fs = require('fs');

let c = fs.readFileSync('frontend/src/app/(main)/business-support/evaluation/page.tsx', 'utf8');

c = c.replace('Business Evaluation, Listing, and Ranking', 'Independent Verification & Compliance Validation');
c = c.replace('evaluation and ranking system', 'Evidence Review and Ground Verification system');
c = c.replace('Evaluation, Listing, and Ranking', 'Independent Verification');
c = c.replace('Benefits of Ranking', 'Benefits of Verification');
c = c.replace('KHCRF Evaluation Process', 'Evidence Review Process');
c = c.replace('Ranking System', 'Ground Verification');
c = c.replace('Receive ranking and business listing', 'Receive Authenticity / Compliance Validation');
c = c.replace('Businesses ranked into three tiers', 'On-site verification by field officers');
c = c.replace('Gold Tier represents complete excellence', 'Physical inspection of workshops and facilities');
c = c.replace('Silver Tier shows strong potential growth', 'In-person authentication of submitted evidence');
c = c.replace('Bronze Tier needs further development', 'Direct interviews with artisans and staff');
c = c.replace('Rankings help businesses improve visibility', 'Validation of safe working conditions');
c = c.replace('Top tiers receive priority listings', 'Final clearance by KHCRF Verification Board');
c = c.replace('Tiers are based on evaluations', 'Status updates throughout the validation cycle');
c = c.replace('<EvaluationRegistry />', '{/* <EvaluationRegistry /> */}'); // Comment out instead of deleting layout

fs.writeFileSync('frontend/src/app/(main)/business-support/evaluation/page.tsx', c, 'utf8');
