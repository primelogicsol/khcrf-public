const fs = require('fs');
let file = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/stakeholder-registry/page.tsx', 'utf8');

// Replace DIRECTORY_CATEGORIES with the import
file = file.replace(
    /const DIRECTORY_CATEGORIES = \[[^\]]+\];/,
    "import { PARTICIPANT_CATEGORIES, normalizeCategory } from '@/lib/skc/participant-categories';\n  const DIRECTORY_CATEGORIES = PARTICIPANT_CATEGORIES;"
);
// Now we need to pass initialCategory to forms
file = file.replace(/<StakeholderProfileForm \/>/g, '<StakeholderProfileForm initialCategory={normalizeCategory(urlCategory) || ""} />');
file = file.replace(/<InstitutionRegistrationForm participationScope="BOTH" \/>/g, '<InstitutionRegistrationForm participationScope="BOTH" initialCategory={normalizeCategory(urlCategory) || ""} />');

fs.writeFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/stakeholder-registry/page.tsx', file);
console.log('page.tsx updated successfully');
