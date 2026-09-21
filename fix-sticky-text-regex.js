const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/layout/GlobalHeader.tsx', 'utf8');

const regex = /<span className="hidden md:block xl:hidden text-xs md:text-sm font-black uppercase text-white leading-tight whitespace-normal line-clamp-2">[\s\S]*?Kashmir Hamadan Craft Revival Foundation[\s\S]*?<\/span>/;

const replaceString = `<span className="xl:hidden text-[11px] sm:text-xs md:text-sm font-black uppercase text-white leading-tight whitespace-normal line-clamp-2">
                <span className="block md:hidden tracking-wider">Kashmir HCRF</span>
                <span className="hidden md:block">Kashmir Hamadan Craft Revival Foundation</span>
              </span>`;

if (regex.test(content)) {
    content = content.replace(regex, replaceString);
    fs.writeFileSync('frontend/src/components/layout/GlobalHeader.tsx', content);
    console.log('Successfully updated the sticky header text for mobile.');
} else {
    console.log('Regex did not match.');
}
