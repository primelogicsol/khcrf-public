const fs = require('fs');
const path = require('path');

function getFiles(dir) {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });
    const files = dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    });
    return Array.prototype.concat(...files);
}

const files = getFiles('frontend/src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

let countFound = 0;
let countChanged = 0;

for (const file of files) {
    // Skip sidebars and headings where we know it shouldn't change
    if (file.includes('Sidebar.tsx') || file.includes('ProfileSidebar.tsx')) continue;

    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Pattern to find border-l-[N] followed by border-brand-(primary|secondary|dark) or vice versa
    // We want to replace the color part with border-card-left-accent
    // Actually, just replace `border-brand-primary`, `border-brand-secondary`, `border-brand-dark` 
    // with `border-card-left-accent` IF they appear in the same className string as `border-l-` 
    // AND NOT if the element is an <h1>...<h6> or a <p> that isn't a card? 
    // The prompt says "Wherever a card uses... partner cards, programme cards, feature cards...
    // Actually, replacing `border-brand-primary` next to `border-l-4` is safe in most non-sidebar components.
    
    // We can use a regex that matches the exact classes:
    const regex = /(border-l-[1-8]\s+)border-brand-(primary|secondary|dark)/g;
    content = content.replace(regex, '$1border-[var(--card-left-accent)]');
    
    const regex2 = /border-brand-(primary|secondary|dark)(\s+border-l-[1-8])/g;
    content = content.replace(regex2, 'border-[var(--card-left-accent)]$2');

    // Make sure we didn't accidentally change a heading!
    // "Do NOT change: headings"
    // E.g. <h2 className="... border-l-4 border-brand-primary"> -> if we did, revert that line
    const headingRegex = /(<h[1-6][^>]*border-\[var\(--card-left-accent\)\][^>]*>)/g;
    content = content.replace(headingRegex, (match) => {
        return match.replace(/border-\[var\(--card-left-accent\)\]/, 'border-brand-primary'); // revert
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        countChanged++;
    }
}

// Update globals.css
const globalsPath = 'frontend/src/app/globals.css';
let globals = fs.readFileSync(globalsPath, 'utf8');
if (!globals.includes('--card-left-accent')) {
    globals = globals.replace(/@theme inline \{/, '@theme inline {\n  --card-left-accent: #6b2b08;');
    fs.writeFileSync(globalsPath, globals, 'utf8');
}

console.log('Modified files:', countChanged);
