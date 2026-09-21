const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/if \(resData\.success && resData\.data\) {/, `const actualData = resData.data?.data ? resData.data.data : (resData.data || resData);
          if (actualData) {`);

c = c.replace(/resData\.data\.districts/g, 'actualData.districts');
c = c.replace(/resData\.data\.crafts/g, 'actualData.crafts');
c = c.replace(/resData\.data\.topics/g, 'actualData.hearingTypes');
c = c.replace(/resData\.data\.stakeholders/g, 'actualData.stakeholders');
c = c.replace(/resData\.data\.participationTypes/g, 'actualData.participationTypes');

fs.writeFileSync(file, c);
console.log("Fixed metadata parsing!");
