const fs = require('fs');
const path = require('path');
const hp = path.join('frontend', 'src', 'components', 'layout', 'GlobalHeader.tsx');
let c = fs.readFileSync(hp, 'utf8');

c = c.replace(/\$\{\(link as any\)\.megaAlign === 'right' \? 'right-0' : 'left-0'\}/g,
  "${(link as any).megaAlign === 'right' ? 'right-0' : (link as any).megaAlign === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'} ${(link as any).megaExtraClass || ''}");

c = c.replace(/py-12 px-14/g, "py-12 ${(link as any).megaPadding || 'px-14'}");
c = c.replace(/gap-y-6 gap-x-10/g, "gap-y-6 ${(link as any).megaGap || 'gap-x-10'}");

fs.writeFileSync(hp, c);

const np = path.join('frontend', 'src', 'components', 'layout', 'navData.ts');
let nc = fs.readFileSync(np, 'utf8');

nc = nc.replace(/name: "Master Artisans",\s*isMega: true,\s*megaAlign: "left",/g,
  `name: "Master Artisans",\n      isMega: true,\n      megaAlign: "center",\n      megaPadding: "px-6 xl:px-10 2xl:px-14",\n      megaGap: "gap-x-4 xl:gap-x-8 2xl:gap-x-10",`);

fs.writeFileSync(np, nc);
console.log('Patched!');
