const fs = require('fs');
const targetFile = 'frontend/src/app/(main)/state-of-kashmir-crafts/current-assessment-2026/CurrentAssessmentClient.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Deduplicate formalHearings
const oldFormalHearings = `  const formalHearings = hearings.filter((h: any) => h.eventType === 'PUBLIC_HEARING');`;
const newFormalHearings = `  const formalHearingsMap = new Map();
  hearings.filter((h: any) => h.eventType === 'PUBLIC_HEARING').forEach((h: any) => {
    const d = getHearingDate(h);
    const key = d ? h.title + d.getTime() : h.id;
    if (!formalHearingsMap.has(key)) {
      formalHearingsMap.set(key, h);
    }
  });
  const formalHearings = Array.from(formalHearingsMap.values());`;
content = content.replace(oldFormalHearings, newFormalHearings);

// 2. Fix Youth in Crafts
const oldYouth = `{thematicConsultations.filter(h => h.slug === 'youth-in-crafts').map(h => {`;
const newYouth = `{thematicConsultations.filter(h => h.title.includes('Youth in Crafts')).map(h => {`;
content = content.replace(oldYouth, newYouth);

// 3. Fix TODAY vs NEXT badge
const oldBadge = `{isNext && <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ml-2 tracking-wider">NEXT</span>}`;
const newBadge = `{isNext && <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ml-2 tracking-wider">{getEventStatus(h) === 'Live / Ongoing' ? 'TODAY' : 'NEXT'}</span>}`;
content = content.replace(oldBadge, newBadge);

// 4. Fix Location Mojibake
const oldLoc = `<span className="text-gray-500 text-sm">? {h.district}</span>`;
const newLoc = `<span className="text-gray-500 text-sm">{"\\u00B7"} {h.district}</span>`;
content = content.replace(oldLoc, newLoc);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Applied Final Narrow Cleanup logic!');
