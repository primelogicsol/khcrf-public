const fs = require('fs');
const file = 'next.config.mjs';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/"frame-src https:\/\/api\.razorpay\.com https:\/\/accounts\.google\.com",/, '"frame-src https://api.razorpay.com https://accounts.google.com https://www.google.com https://maps.google.com",');

fs.writeFileSync(file, content);
console.log('Fixed CSP frame-src');
