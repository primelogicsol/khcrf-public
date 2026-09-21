const fs = require('fs');
const filePath = 'frontend/src/app/(main)/about/partner-network/registry/RegistryClient.tsx';
let c = fs.readFileSync(filePath, 'utf8');

c = c.replace(
  /const matchesEcosystem =[\s\S]*?nameString\.includes\(selectedEcosystem\)\);/,
  `const matchesEcosystem = selectedEcosystem === "All" || getEcosystemBrand(nameString) === selectedEcosystem;`
);

fs.writeFileSync(filePath, c);
console.log('Fixed matchesEcosystem filtering');
