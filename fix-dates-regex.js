const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/validation-round/ValidationRoundClient.tsx', 'utf8');

const regex = /const validationLaunch = new Date\(['"`][^`]*?dateLabel = 'Closed On';\s*\}/g;

const newLogic = `// Use explicit timezone parsing for Asia/Kolkata
  const validationLaunch = new Date('2027-05-08T00:00:00+05:30');
  const validationClose = new Date('2027-05-12T23:59:59+05:30');
  
  // Calculate dynamic "today" safely inside JS using Kolkata timezone snapshot
  const now = new Date();
  const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(now);
  const p = {}; parts.forEach(part => p[part.type] = part.value);
  // Reconstruct ISO string for accurate Math operations inside Kolkata timezone
  const today = new Date(\`\${p.year}-\${p.month}-\${p.day}T\${p.hour}:\${p.minute}:\${p.second}+05:30\`);
  
  let validationPhase = 'Validation Round Scheduled';
  let validationStatus = 'Scheduled';
  // Standard integer floor distance in days to avoid fractional ceiling jumps mid-day
  let daysDifference = Math.floor((validationLaunch.getTime() - today.getTime()) / (1000 * 3600 * 24));
  let daysLabel = 'Days Until Validation Opens';
  let dateText = '8 May 2027';
  let dateLabel = 'Launch Date';

  if (today >= validationLaunch && today <= validationClose) {
    validationPhase = 'Validation Round OPEN';
    validationStatus = 'OPEN';
    daysDifference = Math.ceil((validationClose.getTime() - today.getTime()) / (1000 * 3600 * 24));
    daysLabel = 'Days Remaining';
    dateText = '12 May 2027';
    dateLabel = 'Closing Date';
  } else if (today > validationClose) {
    validationPhase = 'Validation Round CLOSED / COMPLETED';
    validationStatus = 'CLOSED';
    daysDifference = 0;
    daysLabel = 'Validation Completed';
    dateText = '12 May 2027';
    dateLabel = 'Closed On';
  }`;

content = content.replace(regex, newLogic);
fs.writeFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/validation-round/ValidationRoundClient.tsx', content);
console.log('Regex replace complete. Match found:', !!content.match(/Use explicit timezone parsing/));
