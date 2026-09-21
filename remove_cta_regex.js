const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/<div>\s*<a\s*href=\{\`\/state-of-kashmir-crafts\/consultations\/\$\{feed\.slug\}\`\}\s*className="inline-block text-center px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-secondary transition"\s*>\s*\{actionLabel\}\s*<\/a>\s*<\/div>/, `{(!feed.startAt?.includes('2027')) && (
                               <div>
                                 <a 
                                   href={\`/state-of-kashmir-crafts/consultations/\${feed.slug}\`}
                                   className="inline-block text-center px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-secondary transition"
                                 >
                                   {actionLabel}
                                 </a>
                               </div>
                             )}`);

fs.writeFileSync(file, c);
console.log("Replaced with regex!");
