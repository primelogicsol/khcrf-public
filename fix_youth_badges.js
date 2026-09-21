const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/<div className="mt-1">\s*<span className=\{\`text-\[8px\] font-black uppercase tracking-wider px-2 py-0\.5 border rounded inline-block \$\{statusBadge\}\`\}>\s*\{statusLabel\.replace\('_', ' '\)\}\s*<\/span>\s*<\/div>/, `<div className="mt-1 flex flex-wrap gap-1">
                                                  {act.title === 'Youth in Crafts' && (
                                                     <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 border rounded inline-block bg-indigo-50 text-indigo-700 border-indigo-200">
                                                        GENERAL PUBLIC CONSULTATION
                                                     </span>
                                                  )}
                                                  <span className={\`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 border rounded inline-block \${statusBadge}\`}>
                                                     {statusLabel === 'GENERAL PUBLIC CONSULTATION' ? 'COMPLETED' : statusLabel.replace('_', ' ')}
                                                  </span>
                                               </div>`);

fs.writeFileSync(file, c);
console.log("Updated Youth in Crafts badges!");
