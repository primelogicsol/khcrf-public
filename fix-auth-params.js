const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', 'utf8');

// Fix login and register redirect parameters and remove double question marks
content = content.replace(
    /\/register\?\?returnTo=/g,
    '/register?redirect='
);

content = content.replace(
    /\/login\?\?returnTo=/g,
    '/login?redirect='
);

fs.writeFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', content);
console.log('Fixed auth redirect params in MagazineIssueComponents.tsx');
