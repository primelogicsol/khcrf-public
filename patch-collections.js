const fs = require('fs');

// 1. Patch PartnerStats.tsx
const statsFile = 'frontend/src/components/common/PartnerStats.tsx';
let s = fs.readFileSync(statsFile, 'utf8');

// Replace card A title
s = s.replace(/Integrated Ecosystem\s+Organizations/, 'Integrated Ecosystem Entities');

// Replace card C header span
s = s.replace(/Collection C [^\w\s]* External Alliances/i, 'COLLECTION C · STRATEGIC & INSTITUTIONAL ALLIANCES');

// Replace card A header span
s = s.replace(/Collection A [^\w\s]* Core Ecosystem/i, 'COLLECTION A · CORE ECOSYSTEM');

// Replace card B header span
s = s.replace(/Collection B [^\w\s]* Specialized Enterprises/i, 'COLLECTION B · SPECIALIZED ENTERPRISES');

// Replace card C Title
s = s.replace(/Institutional Partners/g, 'Strategic & Institutional Partners');

// Replace card C description
s = s.replace(/Independent institutions collaborating with KHCRF across research, policy, heritage, trade, artisan welfare and development\./i, 'Independent and affiliated institutions collaborating with KHCRF across philanthropy, research, technology, sustainability, policy, artisan welfare, community development and institutional capacity.');

fs.writeFileSync(statsFile, s);
console.log('Patched PartnerStats.tsx');

// 2. Patch page.tsx
const pageFile = 'frontend/src/app/(main)/about/partner-network/page.tsx';
let p = fs.readFileSync(pageFile, 'utf8');
p = p.replace(/Collection C [^\w\s]* External Alliances/i, 'COLLECTION C · STRATEGIC & INSTITUTIONAL ALLIANCES');
fs.writeFileSync(pageFile, p);
console.log('Patched page.tsx');
