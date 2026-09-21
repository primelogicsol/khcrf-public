const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/publications/PublicationsSection.tsx', 'utf8');

// Replace the complex useEffect fetch fallback with simple map & sort
const newEffect = `useEffect(() => {
    const loadPublications = async () => {
      if (initialPublications && initialPublications.length > 0) return; // SSR already handled it
      
      try {
        const allPubs = await publicationApi.getAll();
        const pubsArray = Array.isArray(allPubs) ? allPubs : (allPubs.data || allPubs.publications || []);
        const mappedPubs = pubsArray.map(toCanonicalPublicationPresentation);

        // Sort the entire array: publicationYear/published DESC, id ASC
        mappedPubs.sort((a, b) => {
          const dateA = new Date(a.publicationYear || 0).getTime();
          const dateB = new Date(b.publicationYear || 0).getTime();
          if (dateA !== dateB && !isNaN(dateA) && !isNaN(dateB)) return dateB - dateA;
          const yearA = parseInt(a.publicationYear) || 0;
          const yearB = parseInt(b.publicationYear) || 0;
          if (yearA !== yearB) return yearB - yearA;
          return (a.id || "").localeCompare(b.id || "");
        });
        
        setPublications(mappedPubs);
      } catch (error) {
        console.error("Error loading publications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPublications();
  }, [initialPublications]);`;

content = content.replace(/useEffect\(\(\) => \{[\s\S]*?loadPublications\(\);\s*\}, \[initialPublications\]\);/, newEffect);

fs.writeFileSync('frontend/src/components/publications/PublicationsSection.tsx', content, 'utf8');
