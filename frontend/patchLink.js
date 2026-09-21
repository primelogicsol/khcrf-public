const fs = require('fs');

let c = fs.readFileSync('frontend/src/components/business/EvaluateFarmLink.tsx', 'utf8');

c = c.replace('Live Audit', 'Application Status');
c = c.replace('Preliminary Readiness Result', 'Verification In Progress');
c = c.replace('Support Kashmir Craft Policy Advocacy', 'KHCRF INDEPENDENT CRAFT VERIFICATION');
c = c.replace('Test Your Basic Business Evaluation in Real Time', 'Build Verified Trust for Your Craft Practice, Business or Institution');
c = c.replace('Evaluate your business practices and see how your operations stand against global standards for Kashmiri handicrafts. Receive an instant assessment based on key criteria.', 'Submit your claims and supporting evidence for independent KHCRF verification against applicable craft, provenance, responsible-practice and compliance standards.');
c = c.replace('Our framework is designed to help local artisan cooperatives, exporters, and manufacturers align with applicable wage, geographical indication, sustainability, traceability and responsible-trade requirements relevant to the Kashmir handicraft sector and international markets. The audit benchmarks operations against 12 core sustainability indicators, ensuring readiness for international trade audits.', 'KHCRF’s verification framework supports artisans, businesses and institutions across the Kashmir craft sector. Submitted claims are reviewed against applicable factors including authenticity and provenance, responsible practices, worker safeguards, traceability, sustainability and operational presence. Supporting evidence is independently reviewed, with ground verification conducted where required.');

c = c.replace('Provide answers based on your current business practices and operational scale.', 'Provide information about your craft practice, business or institution against the applicable verification factors.');
c = c.replace('Attach necessary proofs (e.g., certifications, reports) to support your claims.', 'Attach supporting documents, certifications, records or other evidence relevant to your claims.');
c = c.replace('Receive Preliminary Assessment', 'KHCRF Verifies Your Claims');
c = c.replace('Get immediate feedback based on your responses and documentation uploads.', 'KHCRF independently reviews submitted evidence and may conduct ground verification where required.');
c = c.replace('Apply for Formal Evaluation', 'Receive Verified Findings');
c = c.replace('Review your initial assessment and direct qualified enterprises into the formal evaluation process.', 'Once verification is complete, your verified findings are recorded and securely shared with Craftlore for its independent trust and trade-intelligence processes.');

c = c.replace('START PRELIMINARY READINESS ASSESSMENT', 'START VERIFICATION APPLICATION');
c = c.replace(/Your responses and data are collected under KHCRF's privacy and data protection agreements\./g, 'Your application and supporting evidence are handled under KHCRF’s privacy and security requirements.');
c = c.replace(/Your responses and data are collected under KHCRF.*?privacy and data protection agreements\./g, 'Your application and supporting evidence are handled under KHCRF’s privacy and security requirements.'); // backup regex if exact string mismatch due to quotes

fs.writeFileSync('frontend/src/components/business/EvaluateFarmLink.tsx', c, 'utf8');
