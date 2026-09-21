const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', 'utf8');

content = content.replace(
  "if (overlayStrength === 'STRONG') gradientClass = 'from-[#050505] via-[#050505]/95 to-[#050505]/60';",
  "if (overlayStrength === 'STRONG') gradientClass = 'from-[#050505]/95 via-[#050505]/90 to-[#050505]/60';"
);

fs.writeFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', content);
console.log('Fixed STRONG gradient opacity');
