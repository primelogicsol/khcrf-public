const fs = require('fs');
const path = require('path');

const dirPath = 'C:\\Users\\Fayaz\\Sufipulseupdate2026\\HCRF 2026\\hcr_foundation_full_govind\\frontend\\src\\app\\(main)\\publications';
const categories = [
  'market-intelligence',
  'policy-briefs',
  'research-papers',
  'best-practices',
  'case-studies',
  'knowledge-books'
];

categories.forEach(cat => {
  const filePath = path.join(dirPath, cat, 'page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/"\$\{API_BASE\}\/publications"/g, '`${API_BASE}/publications`');
    content = content.replace(/"\$\{API_BASE\}\/publications\/categories"/g, '`${API_BASE}/publications/categories`');
    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('Fixed fetch URLs in category pages');
