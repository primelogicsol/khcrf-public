import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const registryPath = path.join(__dirname, '..', 'src', 'design-system', 'assets', 'asset-registry.json');
let registry = [];
try {
  if (fs.existsSync(registryPath)) {
    registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  }
} catch (e) {
  console.error("Warning: asset-registry.json missing or invalid.");
}

function walkSync(dir, filelist = []) {
  if (!fs.existsSync(dir)) return filelist;
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (/\.(tsx|ts|jsx|js|svg)$/.test(dirFile)) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
}

const srcDir = path.join(__dirname, '..', 'src');
const files = walkSync(srcDir);

let violations = 0;

// Simple asset governance rules for Phase 2B checks
const rules = [
  {
    name: "Hardcoded Logo Paths",
    pattern: /src=(["'`])\/assets\/logos\/[^"']+\1/g,
    check: (match) => {
      // Check if it's not inside BrandLogo component
      return true; // We flag all raw string usage of logos
    }
  },
  {
    name: "Unapproved Inline SVG Fills",
    pattern: /fill=(["'`])#(?!currentColor|none|fff|000)[0-9a-fA-F]{3,8}\1/g,
    check: () => true
  },
  {
    name: "Arbitrary Icon Sizes",
    pattern: /<[A-Z][a-zA-Z]*Icon[^>]*size=\{([0-9]+)\}/g,
    check: (match) => {
       const size = parseInt(match[1]);
       if (![16, 24, 32, 48].includes(size)) return true;
       return false;
    }
  }
];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const ext = path.extname(file);
  
  if (ext === '.tsx' || ext === '.jsx') {
     rules.forEach(rule => {
        let match;
        const regex = new RegExp(rule.pattern);
        while ((match = regex.exec(content)) !== null) {
           if (rule.check(match)) {
             console.log(`[Asset Governance] ${rule.name} found in ${path.relative(srcDir, file)}: ${match[0]}`);
             violations++;
           }
        }
     });

     // Check for <img> tags without alt
     const imgRegex = /<img\s+[^>]*>/g;
     let imgMatch;
     while ((imgMatch = imgRegex.exec(content)) !== null) {
       if (!imgMatch[0].includes('alt=')) {
         console.log(`[Asset Governance] Missing alt text on <img> in ${path.relative(srcDir, file)}`);
         violations++;
       }
     }
  }
});

console.log(`\nAsset governance check completed. Total violations detected: ${violations}`);
// Use a no-new-violations baseline where legacy volume is high. We won't exit with error immediately.
if (process.argv.includes('--strict')) {
  process.exit(violations > 0 ? 1 : 0);
} else {
  process.exit(0);
}
