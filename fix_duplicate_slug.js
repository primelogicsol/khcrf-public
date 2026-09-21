const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultations/[slug]/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/const \{ slug \} = resolvedParams;\n  const \{ slug \} = params;/g, "const { slug } = resolvedParams;");

fs.writeFileSync(file, c);
console.log("Removed duplicate slug declaration!");
