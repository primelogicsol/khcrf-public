const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/layout/navData.ts', 'utf8');

content = content.replace(
    /name: "Master Artisans",\s+isMega: true,\s+megaCols: 5,/g,
    'name: "Master Artisans",\n    isMega: true,\n    megaAlign: "right",\n    megaCols: 5,'
);

content = content.replace(
    /name: "Publications",\s+isMega: true,\s+megaWidth: "780px",\s+megaCols: 2,/g,
    'name: "Publications",\n    isMega: true,\n    megaAlign: "right",\n    megaWidth: "780px",\n    megaCols: 2,'
);

fs.writeFileSync('frontend/src/components/layout/navData.ts', content);
console.log('Added right alignment to central and right nav items to prevent horizontal scrollbars');
