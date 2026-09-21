const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/validation-round/ValidationRoundClient.tsx', 'utf8');

content = content.replace(
    /<span className="text-xs font-bold uppercase tracking-widest text-white\/70 block mb-1">Current Phase<\/span>/g,
    '<span className="text-xs font-bold uppercase tracking-widest text-white/70 block mb-1">Validation Status</span>'
);

content = content.replace(
    /<div className="text-2xl font-black mb-1">\{daysDifference\}<\/div>/g,
    '<div suppressHydrationWarning className="text-2xl font-black mb-1">{daysDifference}</div>'
);

fs.writeFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/validation-round/ValidationRoundClient.tsx', content);
console.log("Labels and hydration warning replaced.");
