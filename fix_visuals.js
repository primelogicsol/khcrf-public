const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Fix Timeline Card style
c = c.replace(
  /<div key=\{hearing\.id\} className="bg-white border border-gray-200 rounded-\[24px\] p-6 hover:shadow-md transition flex flex-col md:flex-row justify-between gap-6">/g,
  `<div key={hearing.id} className={\`border rounded-[24px] p-6 transition flex flex-col md:flex-row justify-between gap-6 \${
    (hearing.status === 'COMPLETED' || hearing.status === 'CLOSED' || hearing.status === 'CANCELLED' || hearing.status === 'POSTPONED')
      ? 'bg-gray-50/70 border-gray-200/60 grayscale-[0.3] opacity-75' 
      : 'bg-white border-gray-200 hover:shadow-md hover:border-brand-primary/30'
  }\`}>`
);

// 2. Fix Calendar dot and cell logic
const catStyleTarget = `const getCategoryStyle = (category: string) => {`;
const catStyleReplacement = `const getCategoryStyle = (category: string, status?: string) => {
                    const s = (status || "").toUpperCase();
                    if (s === 'COMPLETED' || s === 'CLOSED' || s === 'CANCELLED' || s === 'POSTPONED') {
                      return {
                        bg: "bg-gray-100 text-gray-500 border-gray-200",
                        dot: "bg-gray-400",
                        text: "text-gray-500",
                        cardBg: "bg-gray-50/50 border-gray-200 grayscale-[0.5] opacity-80"
                      };
                    }
                    if (s === 'ONGOING' || s === 'LIVE') {
                      return {
                        bg: "bg-red-50 text-red-700 border-red-200 animate-pulse",
                        dot: "bg-red-500 animate-pulse",
                        text: "text-red-700",
                        cardBg: "bg-red-50/30 border-red-200 shadow-sm"
                      };
                    }`;
c = c.replace(catStyleTarget, catStyleReplacement);

// 3. Fix calendar dot usage
c = c.replace(
  /<span className=\{\`w-2 h-2 rounded-full \$\{getCategoryStyle\(dateHearings\[0\]\.category\)\.dot\}\`\}><\/span>/g,
  `<span className={\`w-2 h-2 rounded-full \${getCategoryStyle(dateHearings[0].category, dateHearings[0].status).dot}\`}></span>`
);

// 4. Fix calendar popover style usage
c = c.replace(
  /const catStyle = getCategoryStyle\(selectedCalendarEvent\.category\);/g,
  `const catStyle = getCategoryStyle(selectedCalendarEvent.category, selectedCalendarEvent.status);`
);

// 5. Fix calendar small event card inside cell
const calEventTarget = `<div key={evtIdx} onClick={(e) => { e.stopPropagation(); setSelectedCalendarEvent(evt); }} className="bg-white/80 border border-gray-200 rounded p-1 shadow-xs cursor-pointer hover:border-brand-primary/50 transition">`;
const calEventReplacement = `<div key={evtIdx} onClick={(e) => { e.stopPropagation(); setSelectedCalendarEvent(evt); }} className={\`border rounded p-1 shadow-xs cursor-pointer transition \${getCategoryStyle(evt.category, evt.status).cardBg || 'bg-white/90 border-gray-200 hover:border-brand-primary/50'}\`}>`;
c = c.replace(calEventTarget, calEventReplacement);

fs.writeFileSync(file, c);
console.log("Applied visual fixes for archival events!");
