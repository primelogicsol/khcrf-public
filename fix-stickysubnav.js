const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/StickySubNav.tsx', 'utf8');

// Update offset for scrolling
content = content.replace(
    /const offset = isMobile \? 70 : 180;/g,
    'const offset = isMobile ? 140 : 180;'
);

// Update intersection offset
content = content.replace(
    /const currentOffset = isMobile \? 100 : 250;/g,
    'const currentOffset = isMobile ? 140 : 250;'
);

// Update top offset so it doesn't hide under the mobile global header
content = content.replace(
    /"top-0 xl:top-\[100px\]"/g,
    '"top-[64px] xl:top-[100px]"'
);

// Explicitly add shrink-0 to buttons to guarantee they don't squish instead of scroll
content = content.replace(
    /relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2/g,
    'relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 shrink-0'
);

fs.writeFileSync('frontend/src/components/StickySubNav.tsx', content);
console.log('Fixed StickySubNav offsets and scroll layout for mobile');
