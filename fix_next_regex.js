const fs = require('fs');
const targetFile = 'frontend/src/app/(main)/state-of-kashmir-crafts/current-assessment-2026/CurrentAssessmentClient.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

const regex = /<span className="text-\[10px\] font-bold uppercase tracking-wider text-gray-500 block mb-1">Next Hearing<\/span>\s*<span className="text-sm font-bold text-brand-dark">\s*\{nextScheduledHearing \? `\$\{getHearingDate\(nextScheduledHearing\)\?\.toLocaleDateString\('en-GB', \{ day: 'numeric', month: 'short', timeZone: 'Asia\/Kolkata' \}\)\} \? \$\{nextScheduledHearing\.title\} \? \$\{nextScheduledHearing\.district\}` : 'None Scheduled'\}\s*<\/span>/m;

const newStr = `<span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">{nextScheduledHearing && getEventStatus(nextScheduledHearing) === 'Live / Ongoing' ? "Today's Hearing" : "Next Hearing"}</span>
                <span className="text-sm font-bold text-brand-dark">
                  {nextScheduledHearing ? (
                    <>
                      {getHearingDate(nextScheduledHearing)?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })} {"\\u00B7"} {nextScheduledHearing.title} {"\\u00B7"} {nextScheduledHearing.district || nextScheduledHearing.venue}
                    </>
                  ) : 'None Scheduled'}
                </span>`;

content = content.replace(regex, newStr);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Fixed using regex!');
