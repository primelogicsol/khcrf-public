const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', 'utf8');

// 1. Fix the container height to be min-h so it can expand if text is large, preventing overflow issues.
content = content.replace(
  'h-[620px] md:h-[760px] lg:h-[900px] xl:h-[min(100vh,980px)]',
  'min-h-[620px] md:min-h-[760px] lg:min-h-[900px] xl:min-h-[min(100vh,980px)]'
);

// 2. Pin the image to the top so "HCRF MAGAZINE" is not cropped
content = content.replace(
  'className="object-cover"',
  'className="object-cover object-top"'
);

// 3. Make the gradient slightly transparent at the bottom so the image reads continuously
content = content.replace(
  "let gradientClass = 'from-[#050505] via-[#0a0a0a]/80 to-transparent';",
  "let gradientClass = 'from-[#050505]/90 via-[#0a0a0a]/70 to-transparent';"
);

fs.writeFileSync('frontend/src/components/master-artisans/issues/MagazineIssueComponents.tsx', content);
console.log('Fixed MagazineIssueHero visual defects');
