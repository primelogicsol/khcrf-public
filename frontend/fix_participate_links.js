const fs = require('fs');
let file = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx', 'utf8');

file = file.replace(/href=\{[^}]+\}/g, (match) => {
  if (match.includes('/state-of-kashmir-crafts/stakeholder-registry?type=individual')) {
    return 'href={/state-of-kashmir-crafts/stakeholder-registry?type=individual}';
  }
  if (match.includes('/state-of-kashmir-crafts/stakeholder-registry?type=institution')) {
    return 'href={/state-of-kashmir-crafts/stakeholder-registry?type=institution}';
  }
  return match;
});

fs.writeFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx', file);
console.log('Fixed syntax error in ParticipateClient');
