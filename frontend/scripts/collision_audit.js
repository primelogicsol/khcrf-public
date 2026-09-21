const fs = require('fs');
const path = require('path');

function searchDir(dir, regex, ignorePrefix, results = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            searchDir(fullPath, regex, ignorePrefix, results);
        } else if (fullPath.match(/\.(tsx|jsx|ts|js|css)$/)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');
            lines.forEach((line, i) => {
                let match;
                while ((match = regex.exec(line)) !== null) {
                    const idx = match.index;
                    // Check if preceded by ignorePrefix
                    if (idx >= ignorePrefix.length && line.substring(idx - ignorePrefix.length, idx) === ignorePrefix) {
                        continue;
                    }
                    results.push({ file: fullPath, line: i + 1, content: line.trim() });
                }
            });
        }
    }
    return results;
}

const terms = ['text-primary', 'text-secondary', 'text-muted', 'text-inverse', 'bg-page', 'bg-card', 'bg-surface', 'border-default', 'border-subtle', 'ring-focus'];
const regex = new RegExp('\\\\b(' + terms.join('|') + ')\\\\b', 'g');
const results = searchDir('frontend/src', regex, 'hcrf-');
console.log(JSON.stringify(results, null, 2));
