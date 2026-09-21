const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// I will just find the index of "Stakeholder: {selectedStakeholder}"
// and then the end of the selectedStakeholder block, and then delete the very next dangling chunk.
const strToFind = " className=\"hover:text-red-500 font-bold\">&times;</button>\r\n                        </span>\r\n                      )}";

c = c.replace(strToFind, "");

// Fallback if it's \n
const strToFind2 = " className=\"hover:text-red-500 font-bold\">&times;</button>\n                        </span>\n                      )}";
c = c.replace(strToFind2, "");

fs.writeFileSync(file, c);
console.log("Fixed dangling fragment!");
