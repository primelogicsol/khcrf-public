const fs = require('fs');
const filePath = 'backend/src/controllers/masterArtisanController.ts';
let c = fs.readFileSync(filePath, 'utf8');

c = c.replace(
  /const workshops = await prisma\.masterArtisan\.count\(\{ where: \{ lineagesAsMember: \{ some: \{ relationship_type: \{ in: \['Workshop Member', 'WORKSHOP_MEMBER'\] \} \} \} \} \}\);/,
  "const workshops = await prisma.workshopCommunity.count();"
);

fs.writeFileSync(filePath, c);
console.log('Fixed workshop count logic');
