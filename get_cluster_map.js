const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const startTag = '{thematicClusters.map((cluster) => {';
const tStart = c.indexOf(startTag) + startTag.length;

// Find the corresponding closing bracket.
let brackets = 1;
let tEnd = tStart;
while (tEnd < c.length && brackets > 0) {
  if (c[tEnd] === '{') brackets++;
  else if (c[tEnd] === '}') brackets--;
  tEnd++;
}

console.log(`Length of body: ${tEnd - tStart}`);
