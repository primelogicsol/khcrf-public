const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/validation-round/ValidationRoundClient.tsx', 'utf8');

content = content.replace(
    /safeFetch\('(\/api\/public\/skc\/overview)'\)/,
    "safeFetch('$1').catch(() => ({ success: false, data: null }))"
).replace(
    /safeFetch\('(\/api\/public\/skc\/progress)'\)/,
    "safeFetch('$1').catch(() => ({ success: false, data: null }))"
).replace(
    /safeFetch\('(\/api\/public\/skc\/statistics)'\)/,
    "safeFetch('$1').catch(() => ({ success: false, data: null }))"
).replace(
    /safeFetch\('(\/api\/state-of-kashmir-crafts\/assessment-cycles)'\)/,
    "safeFetch('$1').catch(() => ({ success: false, data: null }))"
).replace(
    /safeFetch\('(\/api\/public\/skc\/draft-findings\/metrics)'\)/,
    "safeFetch('$1').catch(() => ({ success: false, data: null }))"
);

fs.writeFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/validation-round/ValidationRoundClient.tsx', content);
console.log('Added catch handlers to safeFetch');
