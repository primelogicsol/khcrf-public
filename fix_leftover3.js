const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/\s+className="hover:text-red-500 font-bold">&times;<\/button>\s*<\/span>\s*\)\}/, "");
fs.writeFileSync(file, c);
console.log("Actually actually fixed the leftover fragment!");
