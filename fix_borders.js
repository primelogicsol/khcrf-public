const fs = require('fs');

const targets = [
  'frontend/src/app/(main)/about/donations/page.tsx',
  'frontend/src/app/(main)/business-support/evaluation/page.tsx',
  'frontend/src/app/(main)/business-support/grants/page.tsx',
  'frontend/src/app/(main)/business-support/certifications/page.tsx',
  'frontend/src/app/(main)/business-support/accreditation/page.tsx',
  'frontend/src/app/(main)/business-support/entrepreneur-kits/page.tsx'
];

let modifiedFiles = 0;

for (const file of targets) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Pattern 1: relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl
  const regex1 = /className="relative h-\[400px\] md:h-\[500px\] rounded-2xl overflow-hidden shadow-2xl"/g;
  content = content.replace(regex1, 'className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-[12px] border-[var(--image-frame-color)]"');

  // Pattern 2: relative h-[600px] rounded-2xl overflow-hidden shadow-2xl elevation-high group
  const regex2 = /className="relative h-\[600px\] rounded-2xl overflow-hidden shadow-2xl elevation-high group"/g;
  content = content.replace(regex2, 'className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl elevation-high group border-[12px] border-[var(--image-frame-color)]"');

  // Pattern 3: relative h-80 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-all duration-500
  const regex3 = /className="relative h-80 md:h-\[500px\] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-\[1.01\] transition-all duration-500"/g;
  content = content.replace(regex3, 'className="relative h-80 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-all duration-500 border-[12px] border-[var(--image-frame-color)]"');

  // Also in certifications: relative -> rounded-2xl overflow-hidden shadow-2xl h-[400px]
  const regex4 = /className="rounded-2xl overflow-hidden shadow-2xl h-\[400px\]"/g;
  content = content.replace(regex4, 'className="rounded-2xl overflow-hidden shadow-2xl h-[400px] border-[12px] border-[var(--image-frame-color)]"');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    modifiedFiles++;
    console.log('Modified', file);
  }
}
console.log('Total files modified:', modifiedFiles);
