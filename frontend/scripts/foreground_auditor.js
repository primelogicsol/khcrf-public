const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const publicDir = path.join(__dirname, '..', 'public');

const stats = {
  text: { global: 0, localTailwind: 0, arbitrary: 0, inline: 0 },
  border: { global: 0, localTailwind: 0, arbitrary: 0 },
  shadow: { global: 0, localTailwind: 0, arbitrary: 0 },
  gradient: { safe: 0, unsafeWhite: 0 },
  svg: { currentColor: 0, hardcoded: 0 }
};

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const list = fs.readdirSync(dir, {withFileTypes: true});
  for (const dirent of list) {
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) walk(fullPath);
    else if (fullPath.match(/\.(tsx|ts|css|svg)$/)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Text
      stats.text.global += (content.match(/\btext-brand-(primary|secondary|dark)\b/g) || []).length;
      stats.text.global += (content.match(/\btext-hcrf-text-(primary|secondary)\b/g) || []).length;
      stats.text.localTailwind += (content.match(/\btext-(gray|white|black|red|blue|yellow|green|stone)-\d{2,3}\b/g) || []).length;
      stats.text.localTailwind += (content.match(/\btext-(white|black)\b/g) || []).length;
      stats.text.arbitrary += (content.match(/\btext-\[#(?:[0-9a-fA-F]{3,8})\]/g) || []).length;
      stats.text.inline += (content.match(/style=\{\{.*?color:/g) || []).length;

      // Border
      stats.border.global += (content.match(/\bborder-brand-(primary|secondary|dark)\b/g) || []).length;
      stats.border.global += (content.match(/\bborder-hcrf-border\b/g) || []).length;
      stats.border.localTailwind += (content.match(/\bborder-(gray|white|black|stone|red|blue)-\d{2,3}\b/g) || []).length;
      stats.border.localTailwind += (content.match(/\bborder-(white|black)\b/g) || []).length;
      stats.border.arbitrary += (content.match(/\bborder-\[#(?:[0-9a-fA-F]{3,8})\]/g) || []).length;

      // Shadows
      stats.shadow.global += (content.match(/\bshadow-hcrf\b/g) || []).length; // guessing if it exists
      stats.shadow.localTailwind += (content.match(/\bshadow-(sm|md|lg|xl|2xl|inner|none)\b/g) || []).length;
      stats.shadow.arbitrary += (content.match(/\bshadow-\[[^\]]+\]/g) || []).length;

      // Gradients (unsafe = fades to white)
      stats.gradient.unsafeWhite += (content.match(/\b(from-white|to-white|via-white|from-\[#fff\]|to-\[#fafafa\])\b/g) || []).length;
      stats.gradient.safe += (content.match(/\b(from-brand|to-brand|from-black\/|to-transparent)\b/g) || []).length;

      // SVGs
      if (fullPath.endsWith('.svg') || fullPath.endsWith('.tsx')) {
        const fills = content.match(/fill=(["'])([^"']+)\1/g) || [];
        const strokes = content.match(/stroke=(["'])([^"']+)\1/g) || [];
        const combined = [...fills, ...strokes];
        
        for (const attr of combined) {
          if (attr.includes('currentColor') || attr.includes('none')) {
            stats.svg.currentColor++;
          } else {
            stats.svg.hardcoded++;
          }
        }
      }
    }
  }
}

walk(srcDir);
walk(publicDir);

console.log(JSON.stringify(stats, null, 2));
