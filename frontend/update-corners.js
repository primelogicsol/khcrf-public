const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const originalContent = content;

      // We will look for anything that looks like a class string
      // Let's just match any sequence of tailwind classes inside quotes/backticks
      const classListRegex = /([\"'\`])(.*?)([\"'\`])/g;
      
      content = content.replace(classListRegex, (match, openQuote, classes, closeQuote) => {
        // Only process strings that actually contain tailwind-like padding/margin or rounded
        if (!classes.includes('px-') && !classes.includes('rounded-')) return match;
        // Don't touch icons or circles
        if (classes.includes('w-') && classes.includes('h-') && classes.includes('rounded-full')) {
            // exceptions: if it also has px- and py-, it might be a pill with w-full
            if (!classes.includes('w-full') && !classes.includes('h-full')) {
                return match;
            }
        }
        
        let newClasses = classes;

        const hasPx = /\bpx-\d(\.\d)?\b/.test(newClasses);
        const hasPy = /\bpy-\d(\.\d)?\b/.test(newClasses);

        if (hasPx || hasPy || newClasses.includes('button') || newClasses.includes('btn') || newClasses.includes('border') || newClasses.includes('bg-')) {
            // Replace rounded-full, rounded-2xl, rounded-xl, rounded-lg, rounded-md
            // Determine the target radius
            let targetRadius = 'rounded-[14px]'; // default to buttons

            if (/\b(px-4\s+py-1\.5|px-3\s+py-2|text-sm)\b/.test(newClasses) && !/\bpx-(8|6|5)\b/.test(newClasses)) {
                targetRadius = 'rounded-[12px]';
            }
            if (/\b(px-3\s+py-1|px-2\s+py-1|text-xs)\b/.test(newClasses) && !/\bpx-(8|6|5|4)\b/.test(newClasses)) {
                targetRadius = 'rounded-[10px]';
            }
            
            // Apply replacement if it's a pill/button
            if ((hasPx && hasPy) || newClasses.includes('inline-block px-') || (newClasses.includes('text-sm') && newClasses.includes('px-'))) {
               newClasses = newClasses.replace(/\brounded-(full|2xl|xl|lg|md)\b/g, targetRadius);
            }
        }

        // Specific overrides for 'rounded-full' that might be standalone status badges
        if (newClasses.includes('rounded-full') && newClasses.includes('bg-') && (newClasses.includes('text-xs') || newClasses.includes('text-sm'))) {
             if (newClasses.includes('text-xs')) {
                 newClasses = newClasses.replace(/\brounded-full\b/g, 'rounded-[10px]');
             } else {
                 newClasses = newClasses.replace(/\brounded-full\b/g, 'rounded-[12px]');
             }
        }

        return openQuote + newClasses + closeQuote;
      });

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

processDir('C:/Users/Fayaz/Sufipulseupdate2026/HCRF 2026/hcr_foundation_full_govind/frontend/src/app/(main)/state-of-kashmir-crafts');
