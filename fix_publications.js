const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/publications/PublicationsSection.tsx', 'utf8');

// Replace the complex useState initialization with a simple map & sort
const newState = `const [publications, setPublications] = useState<CanonicalPublicationPresentation[]>(() => {
    if (!initialPublications || initialPublications.length === 0) return [];
    
    // Normalize using the exact same function as /publications
    const mapped = initialPublications.map(toCanonicalPublicationPresentation);
    
    // Order by canonical publication/release date, newest first
    mapped.sort((a, b) => {
      const dateA = new Date(a.publicationYear || 0).getTime();
      const dateB = new Date(b.publicationYear || 0).getTime();
      if (dateA !== dateB && !isNaN(dateA) && !isNaN(dateB)) return dateB - dateA;
      const yearA = parseInt(a.publicationYear) || 0;
      const yearB = parseInt(b.publicationYear) || 0;
      if (yearA !== yearB) return yearB - yearA;
      return (a.id || "").localeCompare(b.id || "");
    });
    
    return mapped;
  });`;

content = content.replace(/const \[publications, setPublications\] = useState<CanonicalPublicationPresentation\[\]>\(\(\) => \{[\s\S]*?return finalPubs;\s*\}\);/, newState);

fs.writeFileSync('frontend/src/components/publications/PublicationsSection.tsx', content, 'utf8');
