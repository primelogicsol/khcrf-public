const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/evidence-repository/EvidenceRepositoryClient.tsx', 'utf8');

const match = content.indexOf('metrics?.publishedEvidenceRecords === 0 ? (');
if (match !== -1) {
    console.log('Found the zero state block.');
} else {
    console.log('Zero state block not found.');
}
