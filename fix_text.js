const fs = require('fs');
const target = 'frontend/src/app/(main)/business-support/certifications/page.tsx';
let content = fs.readFileSync(target, 'utf8');

content = content.replace(
  'test your basic business readiness in Real Time',
  'Test your basic business readiness in Real Time'
);

fs.writeFileSync(target, content, 'utf8');
