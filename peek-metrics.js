const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/evidence-repository/EvidenceRepositoryClient.tsx', 'utf8');

const match = content.indexOf(') : (');
const matchEnd = content.indexOf('</section>');
console.log(content.substring(match, match + 2000));
