const fs = require('fs');
const filePath = 'frontend/src/app/(main)/about/partner-network/registry/RegistryClient.tsx';
let c = fs.readFileSync(filePath, 'utf8');

const insertion = `
  const PARENT_IDS = ["KHCRF-PTR-000000", "KHCRF-PTR-000001", "KHCRF-PTR-000009", "KHCRF-PTR-000010", "KHCRF-PTR-000011", "KHCRF-PTR-000012", "KHCRF-PTR-000032", "KHCRF-PTR-000033"];

  const sortedFilteredData = [...filteredData].sort((a: any, b: any) => {
    const brandA = (a.orgName || a.name || "");
    const brandB = (b.orgName || b.name || "");

    const ecoA = getEcosystemBrand(brandA);
    const ecoB = getEcosystemBrand(brandB);

    if (ecoA !== ecoB) return ecoA.localeCompare(ecoB);

    const isParentA = PARENT_IDS.includes(a.id || a.referenceId || a.displayId);
    const isParentB = PARENT_IDS.includes(b.id || b.referenceId || b.displayId);

    if (isParentA && !isParentB) return -1;
    if (!isParentA && isParentB) return 1;

    return brandA.localeCompare(brandB);
  });
`;

if (!c.includes('const PARENT_IDS =')) {
  c = c.replace('  const toggleExpand =', `${insertion}\n  const toggleExpand =`);
}

c = c.replace(/\{filteredData\.map\(\(item, index\)/g, '{sortedFilteredData.map((item, index)');

fs.writeFileSync(filePath, c);
console.log('Fixed for sure');
