const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx';
let c = fs.readFileSync(file, 'utf8');

const t = `                             <div>
                               <a 
                                 href={\`/state-of-kashmir-crafts/consultations/\${feed.slug}\`}
                                 className="inline-block text-center px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-secondary transition"
                               >
                                 {actionLabel}
                               </a>
                             </div>`;

const rep = `                             {(!feed.startAt?.includes('2027')) && (
                               <div>
                                 <a 
                                   href={\`/state-of-kashmir-crafts/consultations/\${feed.slug}\`}
                                   className="inline-block text-center px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-secondary transition"
                                 >
                                   {actionLabel}
                                 </a>
                               </div>
                             )}`;

if (c.includes(t)) {
  c = c.replace(t, rep);
  fs.writeFileSync(file, c);
  console.log("Removed CTA for 2027 activities!");
} else {
  // Try line endings
  const t2 = t.replace(/\r\n/g, '\n');
  if (c.includes(t2)) {
    c = c.replace(t2, rep.replace(/\r\n/g, '\n'));
    fs.writeFileSync(file, c);
    console.log("Removed CTA for 2027 activities! (with \n)");
  } else {
    console.log("Could not find the target string.");
  }
}
