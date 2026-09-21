const fs = require('fs');
const filePath = 'frontend/src/app/(main)/about/partner-network/registry/RegistryClient.tsx';
let c = fs.readFileSync(filePath, 'utf8');

if (!c.includes('const PARENT_IDS =')) {
  c = c.replace('// Sort filteredData', `const PARENT_IDS = ["KHCRF-PTR-000000", "KHCRF-PTR-000001", "KHCRF-PTR-000009", "KHCRF-PTR-000010", "KHCRF-PTR-000011", "KHCRF-PTR-000012", "KHCRF-PTR-000032", "KHCRF-PTR-000033"];\n\n    // Sort filteredData`);
}

c = c.replace(/const isParentA =\s*\(a\.orgName \|\| a\.name\)[^;]+;/, 'const isParentA = PARENT_IDS.includes(a.id || a.referenceId || a.displayId);');
c = c.replace(/const isParentB =\s*\(b\.orgName \|\| b\.name\)[^;]+;/, 'const isParentB = PARENT_IDS.includes(b.id || b.referenceId || b.displayId);');

fs.writeFileSync(filePath, c);
console.log('Fixed PARENT_IDS array');
