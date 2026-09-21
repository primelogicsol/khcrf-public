const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Remove "Introductory Status Block"
const regexIntro = /\{\/\*\s*Introductory Status Block\s*\*\/\}\s*<div className="bg-white border-2 border-brand-primary\/20 rounded-2xl p-6 shadow-sm mb-8 text-left">[\s\S]*?\{\/\*\s*Header row with Segmented View switch\s*\*\/\}/;
c = c.replace(regexIntro, `{/* Header row with Segmented View switch */}`);

// 2. Remove "Dynamic Category Summary" AND "Programme Events" line
const regexSummary = /\{\/\*\s*Dynamic Category Summary\s*\*\/\}\s*<div className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-3">[\s\S]*?\{\/\*\s*Results Count and Filter Chips\s*\*\/\}\s*<div className="mb-6 flex flex-col gap-3">\s*<div className="flex items-center justify-between">\s*<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">\s*\{filteredHearings\.length\} programme events in current programme\s*<\/span>\s*<\/div>/;
c = c.replace(regexSummary, `{/* Results Count and Filter Chips */}\n                <div className="mb-6 flex flex-col gap-3">`);

// 3. Remove Milestones Timeline block if hearings is empty
const regexMilestones = /\{\/\*\s*Milestones Timeline\s*\*\/\}\s*<div className="bg-white border border-gray-200 rounded-\[24px\] p-8 md:p-10 shadow-sm">[\s\S]*?<\/p>\s*<div className="border-t border-gray-100 pt-8">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
c = c.replace(regexMilestones, `{/* Empty State */}\n                      <div className="bg-white border border-gray-200 rounded-[24px] p-8 md:p-10 shadow-sm">\n                        <h3 className="text-xl font-bold text-gray-800 mb-3">{loading ? 'Loading public hearings...' : (fetchError ? 'Public hearing information could not be loaded.' : 'No public hearings found.')}</h3>\n                        <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-2xl">{loading ? 'Please wait...' : 'Try adjusting your filters.'}</p>\n                      </div>`);

fs.writeFileSync(file, c);
console.log("Applied deletions!");
