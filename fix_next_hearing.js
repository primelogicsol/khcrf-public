const fs = require('fs');
const targetFile = 'frontend/src/app/(main)/state-of-kashmir-crafts/current-assessment-2026/CurrentAssessmentClient.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Next Hearing label in Status Strip
const oldNext = `<span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Next Hearing</span>`;
const newNext = `<span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">{nextScheduledHearing && getEventStatus(nextScheduledHearing) === 'Live / Ongoing' ? "Today's Hearing" : "Next Hearing"}</span>`;
content = content.replace(oldNext, newNext);

// 2. Separators in Next Hearing text
const oldNextText = `${getHearingDate(nextScheduledHearing)?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })} ? ${nextScheduledHearing.title} ? ${nextScheduledHearing.district}`;
const newNextText = `${getHearingDate(nextScheduledHearing)?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })} {"\\u00B7"} ${nextScheduledHearing.title} {"\\u00B7"} ${nextScheduledHearing.district || nextScheduledHearing.venue}`;
// Wait, the original was inside a template literal. I can't use {"\u00B7"} inside template literal easily if it's already in JSX {} interpolation, actually it was:
// {nextScheduledHearing ? `...` : 'None Scheduled'}
// Let's replace the whole block carefully.
