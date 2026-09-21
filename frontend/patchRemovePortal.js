const fs = require('fs');
const file = 'src/app/(main)/business-support/evaluation/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/import SubmissionPortalSection from "@\/components\/SubmissionPortalSection";\r?\n/, '');
c = c.replace(/<SubmissionPortalSection \/>\r?\n/, '');
c = c.replace(/<SubmissionPortalSection \/>/, '');

fs.writeFileSync(file, c, 'utf8');
