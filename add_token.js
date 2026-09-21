const fs = require('fs');
const targetFile = 'frontend/src/app/globals.css';
let content = fs.readFileSync(targetFile, 'utf8');

if (!content.includes('--image-frame-color')) {
    content = content.replace(/@theme inline \{/, '@theme inline {\n  --image-frame-color: #6b2b08;');
    fs.writeFileSync(targetFile, content, 'utf8');
}
console.log('Added --image-frame-color');
