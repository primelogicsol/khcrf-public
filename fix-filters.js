const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/publications/PublicationsSection.tsx', 'utf8');

// Replace the single line scrollable div with a flex-wrap container
content = content.replace(
    /<div className="flex overflow-x-auto pb-2 -mb-2 gap-2\.5 items-center no-scrollbar w-full">/g,
    '<div className="flex flex-wrap gap-2.5 items-center w-full">'
);

// Remove shrink-0 from the Filter label and buttons to allow better wrapping and responsiveness
content = content.replace(
    /<span className="text-\[10px\] font-black text-stone-400 uppercase tracking-\[0\.2em\] mr-2 flex items-center gap-1\.5 shrink-0">/g,
    '<span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mr-2 flex items-center gap-1.5">'
);

// We need to modify the button's classes. It currently has shrink-0 which isn't strictly necessary if wrapping is enabled.
content = content.replace(
    /className={`px-5 py-2\.5 text-\[11px\] font-black uppercase tracking-wider rounded-full transition-all duration-300 shrink-0 \$\{/g,
    'className={`px-5 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-full transition-all duration-300 ${'
);

fs.writeFileSync('frontend/src/components/publications/PublicationsSection.tsx', content);
console.log('Made filter chips flex-wrap and responsive on mobile');
