const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/validation-round/ValidationRoundClient.tsx', 'utf8');

// Replace the date logic block
const oldLogic = `  const validationLaunch = new Date('2027-05-07T00:00:00Z');
  const validationClose = new Date('2027-05-11T23:59:59Z');
  const today = new Date('2026-09-15T00:00:00Z');
  
  let validationPhase = 'Validation Round Scheduled';
  let validationStatus = 'Scheduled';
  let daysDifference = Math.ceil((validationLaunch.getTime() - today.getTime()) / (1000 * 3600 * 24));
  let daysLabel = 'Days Until Validation Opens';
  let dateText = '7 May 2027';
  let dateLabel = 'Launch Date';

  if (today >= validationLaunch && today <= validationClose) {
    validationPhase = 'Validation Round OPEN';
    validationStatus = 'OPEN';
    daysDifference = Math.ceil((validationClose.getTime() - today.getTime()) / (1000 * 3600 * 24));
    daysLabel = 'Days Remaining';
    dateText = '11 May 2027';
    dateLabel = 'Closing Date';
  } else if (today > validationClose) {
    validationPhase = 'Validation Round CLOSED / COMPLETED';
    validationStatus = 'CLOSED';
    daysDifference = 0;
    daysLabel = 'Validation Completed';
    dateText = '11 May 2027';
    dateLabel = 'Closed On';
  }`;

const newLogic = `  // Use explicit timezone parsing for Asia/Kolkata
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

if (content.includes("validationLaunch = new Date('2027-05-07T00:00:00Z')")) {
    content = content.replace(oldLogic, newLogic);
} else {
    // maybe it has different formatting? Let's do a more robust regex if needed.
    const re = /const validationLaunch = new Date\([^;]+;[\s\S]*?dateLabel = 'Closed On';\s*\}/m;
    content = content.replace(re, newLogic);
}

// Replace "Current Phase" with "Validation Status"
content = content.replace(
    /<span className="text-xs font-bold uppercase tracking-widest text-white\/70 block mb-1">Current Phase<\/span>/,
    '<span className="text-xs font-bold uppercase tracking-widest text-white/70 block mb-1">Validation Status</span>'
);

// We should also suppress hydration warnings on the dynamic block since the server and client might technically resolve 'today' on opposite sides of midnight locally, though very unlikely unless it's exactly midnight.
// We'll wrap the 230 number with suppressHydrationWarning
content = content.replace(
    /<div className="text-2xl font-black mb-1">\{daysDifference\}<\/div>/,
    '<div suppressHydrationWarning className="text-2xl font-black mb-1">{daysDifference}</div>'
);

fs.writeFileSync('frontend/src/app/(main)/state-of-kashmir-crafts/validation-round/ValidationRoundClient.tsx', content);
console.log('Fixed dates and labels');
