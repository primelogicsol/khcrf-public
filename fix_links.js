const fs = require('fs');
const glob = require('glob');

const files = glob.sync('C:/Users/Fayaz/Sufipulseupdate2026/HCRF 2026/hcr_foundation_full_govind/frontend/src/**/*.tsx');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('/state-of-kashmir-crafts/assessment-timeline')) {
        content = content.replace(/\/state-of-kashmir-crafts\/assessment-timeline/g, '/state-of-kashmir-crafts/public-hearings');
        fs.writeFileSync(file, content);
        console.log("Updated", file);
    }
});
