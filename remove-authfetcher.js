const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/master-artisans/issues/MagazineIssuesClient.tsx', 'utf8');

content = content.replace(/const authFetcher = async \(url: string\) => \{[\s\S]*?\n  \};\n/, '');

fs.writeFileSync('frontend/src/app/(main)/master-artisans/issues/MagazineIssuesClient.tsx', content);
console.log('Removed authFetcher');
