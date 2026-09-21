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
let count = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    const regex = /className="absolute top-0 left-0 w-([0-9]+) h-full bg-brand-(primary|secondary|dark)(?:\/20)?([^"]*)"/g;
    content = content.replace(regex, (match, w, color, rest) => {
        return `className="absolute top-0 left-0 w-${w} h-full bg-[var(--card-left-accent)]${rest}"`;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
    }
}
console.log('Fixed absolute borders in files:', count);
