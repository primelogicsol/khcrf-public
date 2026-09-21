const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/validation-round/ValidationRoundClient.tsx', 'utf8');

content = content.replace(
    /if \(cyclesRes && cyclesRes\.success\) setCycles\(cyclesRes\.data\);/g,
    ""
);

fs.writeFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/validation-round/ValidationRoundClient.tsx', content);
console.log('Fixed ReferenceError');
