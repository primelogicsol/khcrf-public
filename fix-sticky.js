const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/layout/GlobalHeader.tsx', 'utf8');

// Update the sticky header text to be hidden on mobile (displays only on md and up, hidden again on xl)
content = content.replace(
    /<span className="xl:hidden text-xs md:text-sm font-black uppercase text-white leading-tight whitespace-normal line-clamp-2">/g,
    '<span className="hidden md:block xl:hidden text-xs md:text-sm font-black uppercase text-white leading-tight whitespace-normal line-clamp-2">'
);

fs.writeFileSync('frontend/src/components/layout/GlobalHeader.tsx', content);
console.log('Sticky header responsiveness fixed by hiding long text on mobile');
