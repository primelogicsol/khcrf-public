const c = require('fs').readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/become-a-fellow/page.tsx', 'utf8');
const idx = c.indexOf("formStatus === 'success'");
console.log(c.substring(idx, idx + 800));
