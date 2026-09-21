const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /if \(selectedCraft !== 'ALL'\) \{\s*result = result\.filter\(h => \{\s*if \(\!h\.craftFocus\) return false;\s*if \(Array\.isArray\(h\.craftFocus\)\) return h\.craftFocus\.includes\(selectedCraft\);\s*return h\.craftFocus\.includes\(selectedCraft\);\s*\}\);\s*\}/m;

const replacement = `if (selectedCraft !== 'ALL') {
        result = result.filter(h => {
          if (!h.craftFocus) return false;
          let crafts = Array.isArray(h.craftFocus) ? h.craftFocus : [h.craftFocus];
          // Core rule: Match specific craft OR if the hearing is cross-craft
          return crafts.includes(selectedCraft) || crafts.includes('ALL_CRAFTS') || crafts.includes('Cross-craft') || crafts.includes('All Crafts');
        });
      }`;

c = c.replace(regex, replacement);
fs.writeFileSync(file, c);
console.log("Updated craft filter logic!");
