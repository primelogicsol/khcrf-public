const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /<span className="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">\s*<FaMapMarkerAlt \/> \{hearing\.district \|\| 'All Districts'\}\s*<\/span>/;

const replacement = `<span className="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                                  <FaMapMarkerAlt /> {hearing.district || 'All Districts'}
                                </span>
                                {hearing.craftFocus && Array.isArray(hearing.craftFocus) && hearing.craftFocus.map((craft: string, i: number) => (
                                  <span key={i} className="text-[9px] px-2 py-0.5 bg-stone-100 text-stone-600 border border-stone-200 font-bold rounded-full uppercase tracking-wide">
                                    {craft === 'ALL_CRAFTS' ? 'Cross-Craft' : craft}
                                  </span>
                                ))}`;

c = c.replace(regex, replacement);
fs.writeFileSync(file, c);
console.log("Injected craft tags into hearing cards!");
