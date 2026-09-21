const fs = require('fs');

// 1. Fix ParticipateClient.tsx
let pClient = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx', 'utf8');
pClient = pClient.replace(/href=\{([^'"}]*)\}/g, (match, p1) => {
    if (p1.startsWith('/state-of-kashmir-crafts/stakeholder-registry')) {
        return href={\${p1}\};
    }
    return match;
});
fs.writeFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx', pClient);

// 2. Fix page.tsx of stakeholder-registry
let pRegistry = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/stakeholder-registry/page.tsx', 'utf8');

// Remove import from inside the function
pRegistry = pRegistry.replace(/import \{ PARTICIPANT_CATEGORIES, normalizeCategory \} from '@\/lib\/skc\/participant-categories';\s*/g, '');

// Add it to the top of the file if not already there
if (!pRegistry.includes("import { PARTICIPANT_CATEGORIES, normalizeCategory } from '@/lib/skc/participant-categories';")) {
    pRegistry = pRegistry.replace(
        /import \{ FALLBACK_CATEGORIES/, 
        "import { PARTICIPANT_CATEGORIES, normalizeCategory } from '@/lib/skc/participant-categories';\nimport { FALLBACK_CATEGORIES"
    );
}

fs.writeFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/stakeholder-registry/page.tsx', pRegistry);

console.log('Fixed syntax errors');
