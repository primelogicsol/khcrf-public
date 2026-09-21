const fs = require('fs');
let file = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx', 'utf8');

file = file.replace(/href="\/state-of-kashmir-crafts\/stakeholder-registry\?type=individual"/g, 
  'href={/state-of-kashmir-crafts/stakeholder-registry?type=individual}');

file = file.replace(/href="\/state-of-kashmir-crafts\/stakeholder-registry\?type=institution"/g, 
  'href={/state-of-kashmir-crafts/stakeholder-registry?type=institution}');

// There is one with <Link href="/state-of-kashmir-crafts/stakeholder-registry?type=individual" className="...">
file = file.replace(/href="\/state-of-kashmir-crafts\/stakeholder-registry\?type=individual" className=/g, 
  'href={/state-of-kashmir-crafts/stakeholder-registry?type=individual} className=');

fs.writeFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx', file);
console.log('ParticipateClient updated successfully');
