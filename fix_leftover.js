const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const leftover = ` className="hover:text-red-500 font-bold">&times;</button>
                      </span>
                    )}`;

c = c.replace(leftover, "");
fs.writeFileSync(file, c);
console.log("Fixed the leftover fragment!");
