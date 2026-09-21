const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/layout/GlobalHeader.tsx', 'utf8');

// Replace the previously modified span
const searchString = '<span className="hidden md:block xl:hidden text-xs md:text-sm font-black uppercase text-white leading-tight whitespace-normal line-clamp-2">\n                Kashmir Hamadan Craft Revival Foundation\n              </span>';
const replaceString = `<span className="xl:hidden text-xs md:text-sm font-black uppercase text-white leading-tight whitespace-normal line-clamp-2">
                <span className="block md:hidden tracking-wider">Kashmir HCRF</span>
                <span className="hidden md:block">Kashmir Hamadan Craft Revival Foundation</span>
              </span>`;

if (content.includes(searchString)) {
    content = content.replace(searchString, replaceString);
    fs.writeFileSync('frontend/src/components/layout/GlobalHeader.tsx', content);
    console.log('Successfully updated the sticky header text for mobile.');
} else {
    console.log('Search string not found. Please verify the exact text in GlobalHeader.tsx.');
}
