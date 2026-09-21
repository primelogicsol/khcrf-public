const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /actualEvents = actualEvents\.filter\(evt => evt\.isFormalHearing \|\| evt\.eventType === 'PUBLIC_HEARING' \|\| evt\.category === 'PUBLIC_HEARING'\)\.map\(evt => \{/;

const replacement = `actualEvents = actualEvents.filter(evt => evt.isFormalHearing || evt.eventType === 'PUBLIC_HEARING' || evt.category === 'PUBLIC_HEARING').map(evt => {
            const craftFocusMap: Record<string, string[]> = {
              'Youth in Crafts': ['ALL_CRAFTS'],
              'Exports': ['ALL_CRAFTS'],
              'Future of Pashmina': ['Pashmina'],
              'Digital Commerce': ['ALL_CRAFTS'],
              'Future of Carpets': ['Carpet'],
              'Technology & Design': ['Pashmina', 'Carpet', 'Papier-Mâché', 'Walnut Wood', 'Sozni', 'Kani'],
              'Artisan Livelihoods': ['ALL_CRAFTS'],
              'GI & Authenticity': ['Pashmina', 'Kani', 'Carpet', 'Papier-Mâché', 'Walnut Wood'],
              'Women in Crafts': ['ALL_CRAFTS'],
              'Finance & Investment': ['ALL_CRAFTS'],
              'Raw Material Access': ['Pashmina', 'Carpet', 'Silk'],
              'Climate & Sustainability': ['Pashmina', 'Carpet', 'ALL_CRAFTS'],
              'Cultural Heritage': ['ALL_CRAFTS'],
              'Education & Skills': ['ALL_CRAFTS'],
              'Global Markets': ['ALL_CRAFTS'],
              'Policy & Governance': ['ALL_CRAFTS']
            };
            
            if (craftFocusMap[evt.title]) {
              evt.craftFocus = craftFocusMap[evt.title];
            }`;

c = c.replace(regex, replacement);
fs.writeFileSync(file, c);
console.log("Applied virtual craft tagging!");
