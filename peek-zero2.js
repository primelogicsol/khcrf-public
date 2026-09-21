const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/evidence-repository/EvidenceRepositoryClient.tsx', 'utf8');

const match = content.indexOf('metrics?.publishedEvidenceRecords === 0 ?');
console.log(content.substring(match, match + 3000));
