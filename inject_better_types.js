const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const mappingStr = `
function getBetterType(hearing: any) {
  const t = hearing.title || '';
  if (t.includes('Exports')) return 'Thematic Consultation';
  if (t.includes('Future of Pashmina')) return 'Craft-Specific Hearing';
  if (t.includes('Digital Commerce')) return 'Thematic Consultation';
  if (t.includes('Future of Carpets')) return 'Craft-Specific Hearing';
  if (t.includes('Technology & Design')) return 'Multi-Craft Thematic Hearing';
  if (t.includes('Artisan Livelihoods')) return 'Cross-Craft Thematic Hearing';
  if (t.includes('GI & Authenticity')) return 'Multi-Craft Thematic Hearing';
  if (t.includes('Women in Crafts')) return 'Cross-Craft Thematic Hearing';
  if (t.includes('Finance & Investment')) return 'Cross-Craft Thematic Hearing';
  if (t.includes('Raw Material Access')) return 'Multi-Craft Thematic Hearing';
  if (t.includes('Climate & Sustainability')) return 'Cross-Craft / Multi-Craft Thematic Hearing';
  if (t.includes('Cultural Heritage')) return 'Cross-Craft Thematic Hearing';
  if (t.includes('Education & Skills')) return 'Cross-Craft Thematic Hearing';
  if (t.includes('Global Markets')) return 'Cross-Craft Thematic Hearing';
  if (t.includes('Policy & Governance')) return 'Cross-Craft Policy Hearing';
  if (t.includes('Youth in Crafts')) return 'General Public Consultation';
  return getEventTypeLabel(hearing.eventType, hearing.category);
}
`;

c = c.replace(/function getEventTypeLabel/, mappingStr + "\nfunction getEventTypeLabel");
c = c.replace(/getEventTypeLabel\(hearing\.eventType, hearing\.category\)/g, "getBetterType(hearing)");

fs.writeFileSync(file, c);
console.log("Added better types mapping!");
