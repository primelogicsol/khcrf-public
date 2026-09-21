const fs = require('fs');

const files = [
    'frontend/src/app/(main)/state-of-kashmir-crafts/stakeholder-registry/page.tsx',
    'frontend/src/app/(main)/state-of-kashmir-crafts/activity-log/page.tsx',
    'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx',
    'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\/state-of-kashmir-crafts\/assessment-timeline/g, '/state-of-kashmir-crafts/public-hearings');
    fs.writeFileSync(file, content);
    console.log("Updated", file);
});
