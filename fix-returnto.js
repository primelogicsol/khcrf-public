const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', 'utf8');

content = content.replace(/\\?redirect=/g, '?returnTo=');
fs.writeFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', content);
console.log('Fixed returnTo parameter');
