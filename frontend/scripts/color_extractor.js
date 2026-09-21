const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');
const outDir = path.join(__dirname, '..', '..', 'audit'); // Actually, write artifacts directly to artifact directory if needed, but we'll use `audit` directory first then I'll create the artifacts via API.
const artifactDir = "C:\\Users\\Fayaz\\.gemini\\antigravity-cli\\brain\\4dce663f-a74c-4ef9-be09-47883a2ffd85";

// Regex patterns to find colors
const patterns = [
    { type: 'hex', regex: /#([0-9a-fA-F]{3,8})\b/g },
    { type: 'rgb', regex: /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\)/g },
    { type: 'hsl', regex: /hsla?\(\s*\d+\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?(?:\s*,\s*[\d.]+)?\s*\)/g },
    { type: 'tailwind-arbitrary', regex: /(bg|text|border|ring|shadow|fill|stroke|from|via|to)-\[([^\]]+)\]/g },
    { type: 'tailwind-semantic', regex: /\b(bg|text|border|ring|shadow|fill|stroke)-(brand-primary|brand-secondary|brand-dark|brand-light|primary|secondary|accent|gray-\d+|white|black|red-\d+|green-\d+|blue-\d+|yellow-\d+)\b/g }
];

const results = [];
let fileCount = 0;

function walk(dir) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            walk(filePath);
        } else if (/\.(tsx|ts|css|js|jsx)$/.test(file)) {
            fileCount++;
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            
            let currentComponent = path.basename(file, path.extname(file));
            
            lines.forEach((line, lineIdx) => {
                patterns.forEach(p => {
                    let match;
                    const regex = new RegExp(p.regex);
                    while ((match = regex.exec(line)) !== null) {
                        let value = match[0];
                        if (p.type === 'tailwind-arbitrary') {
                            value = match[2]; // the arbitrary value
                        } else if (p.type === 'tailwind-semantic') {
                            value = match[2]; // the semantic token name
                        }
                        
                        // Normalize hex
                        if (value.startsWith('#')) {
                            value = value.toLowerCase();
                            if (value.length === 4) {
                                value = '#' + value[1]+value[1]+value[2]+value[2]+value[3]+value[3];
                            }
                        }
                        
                        results.push({
                            file: filePath.replace(path.join(__dirname, '..'), ''),
                            line: lineIdx + 1,
                            component: currentComponent,
                            type: p.type,
                            value: value,
                            originalMatch: match[0],
                            context: line.trim().substring(0, 100)
                        });
                    }
                });
            });
        }
    }
}

walk(srcDir);

// Now aggregate and normalize
const inventory = {}; // unique colors and their counts
results.forEach(r => {
    if (!inventory[r.value]) {
        inventory[r.value] = { count: 0, files: new Set(), types: new Set() };
    }
    inventory[r.value].count++;
    inventory[r.value].files.add(r.file);
    inventory[r.value].types.add(r.type);
});

// Write CSVs
let occurrencesCsv = "File,Line,Component,Type,Value,OriginalMatch\n";
results.forEach(r => {
    occurrencesCsv += `"${r.file}",${r.line},"${r.component}","${r.type}","${r.value}","${r.originalMatch.replace(/"/g, '""')}"\n`;
});
fs.writeFileSync(path.join(artifactDir, 'hcrf_color_occurrences.csv'), occurrencesCsv);

let inventoryCsv = "Value,Type,Occurrences,UniqueFiles\n";
Object.entries(inventory).sort((a,b) => b[1].count - a[1].count).forEach(([val, data]) => {
    inventoryCsv += `"${val}","${Array.from(data.types).join(', ')}",${data.count},${data.files.size}\n`;
});
fs.writeFileSync(path.join(artifactDir, 'hcrf_color_inventory.csv'), inventoryCsv);

fs.writeFileSync(path.join(artifactDir, 'hcrf_color_palette.json'), JSON.stringify(inventory, (key, value) => value instanceof Set ? Array.from(value) : value, 2));

console.log(`Analyzed ${fileCount} files. Found ${results.length} total color usages across ${Object.keys(inventory).length} unique color values.`);
