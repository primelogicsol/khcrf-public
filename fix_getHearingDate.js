const fs = require('fs');
const targetFile = 'frontend/src/app/(main)/state-of-kashmir-crafts/current-assessment-2026/CurrentAssessmentClient.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

const oldFunc = `  const getHearingDate = (hearing: any): Date | null => {
    const raw = hearing.date ?? hearing.scheduledDate ?? hearing.startAt;
    if (!raw) return null;
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
  };`;

const newFunc = `  const getHearingDate = (hearing: any): Date | null => {
    // Some backend fields might return empty objects {} instead of null
    const getValidDateStr = (val: any) => (val && typeof val === 'string' && val.trim().length > 0) ? val : null;
    const raw = getValidDateStr(hearing.date) ?? getValidDateStr(hearing.scheduledDate) ?? getValidDateStr(hearing.startAt) ?? getValidDateStr(hearing.rawScheduledDate);
    if (!raw) return null;
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
  };`;

content = content.replace(oldFunc, newFunc);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Fixed getHearingDate!');
