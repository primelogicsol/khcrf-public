const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /className="hover:text-red-500 font-bold">&times;<\/button>\s*<\/span>\s*\)\}/;

c = c.replace(regex, "");
fs.writeFileSync(file, c);
console.log("Actually fixed the leftover fragment!");
