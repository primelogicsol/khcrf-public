const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/>Public Hearings and Assessment Programme<\//g, '>Public Hearings</');
c = c.replace(/Timeline\s*<\/button>/g, 'List</button>');

fs.writeFileSync(file, c);
console.log("Replaced Title and Timeline tab label");
