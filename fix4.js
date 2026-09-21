const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/publications/PublicationsSection.tsx', 'utf8');

// Fix TS errors in useState
content = content.replace(
  'const selected = [];',
  'const selected: CanonicalPublicationPresentation[] = [];'
);

content = content.replace(
  'const matches = mapped.filter((p) => {',
  'const matches = mapped.filter((p: CanonicalPublicationPresentation) => {'
);

// Improve date sorting
content = content.replace(
  /finalPubs\.sort\(\(a, b\) => \{[^}]+\}\);/g,
  `finalPubs.sort((a, b) => {
      const dateA = new Date(a.publicationYear || 0).getTime();
      const dateB = new Date(b.publicationYear || 0).getTime();
      if (dateA !== dateB && !isNaN(dateA) && !isNaN(dateB)) return dateB - dateA;
      const yearA = parseInt(a.publicationYear) || 0;
      const yearB = parseInt(b.publicationYear) || 0;
      if (yearA !== yearB) return yearB - yearA;
      return a.id.localeCompare(b.id);
    });`
);

fs.writeFileSync('frontend/src/components/publications/PublicationsSection.tsx', content, 'utf8');
