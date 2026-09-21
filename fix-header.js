const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/layout/GlobalHeader.tsx', 'utf8');

// Always make the parent li relative
content = content.replace(
    /className={`\$\{\(link as any\)\.isMega && !\(link as any\)\.megaWidth \? '' : 'relative'\} group py-6`}/g,
    'className={`relative group py-6`}'
);
content = content.replace(
    /className={`\$\{\(link as any\)\.isMega && !\(link as any\)\.megaWidth \? '' : 'relative'\} group py-4`}/g,
    'className={`relative group py-4`}'
);

// Remove the full-width logic from the dropdown wrapper
content = content.replace(
    /\$\{\(link as any\)\.megaWidth \? \(\(link as any\)\.megaAlign === 'right' \? 'right-0' : 'left-0'\) : 'left-0 w-full'\}/g,
    `${(link as any).megaAlign === 'right' ? 'right-0' : 'left-0'}`
);

// Standardize the inline style to always use max-content, but respect megaWidth as minWidth if provided
content = content.replace(
    /style=\{\(link as any\)\.megaWidth \? \{ minWidth: \(link as any\)\.megaWidth, width: 'max-content' \} : \{\}\}/g,
    "style={{ width: 'max-content', minWidth: (link as any).megaWidth || 'auto', maxWidth: '90vw' }}"
);

// Standardize the padding container inside the dropdown
content = content.replace(
    /className={`\$\{\(link as any\)\.megaWidth \? 'py-12 px-14' : 'container-fluid mx-auto px-4 md:px-10 py-10'\}`}/g,
    'className={`py-12 px-14`}'
);
content = content.replace(
    /className={`\$\{\(link as any\)\.megaWidth \? 'py-12 px-14' : 'container-fluid mx-auto px-10 py-8'\}`}/g,
    'className={`py-12 px-14`}'
);

// Standardize the grid gap
content = content.replace(
    /className={`grid gap-y-6 \$\{\(link as any\)\.megaWidth \? 'gap-x-10' : 'gap-x-8'\} \$\{/g,
    'className={`grid gap-y-6 gap-x-10 ${'
);

fs.writeFileSync('frontend/src/components/layout/GlobalHeader.tsx', content);
console.log('GlobalHeader standardized');
