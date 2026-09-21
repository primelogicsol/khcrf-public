const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/evidence-repository/EvidenceRepositoryClient.tsx', 'utf8');

content = content.replace(
    /metrics\?\.publishedEvidenceRecords === 0 \? \([\s\S]*?\) : \(/,
    '('
);

fs.writeFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/evidence-repository/EvidenceRepositoryClient.tsx', content);
console.log('Removed the 0 state block');
