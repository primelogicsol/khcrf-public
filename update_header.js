const fs = require('fs');
const file = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/<h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Public Hearings and Assessment Programme<\/h2>/, `<h2 className="text-2xl font-black text-brand-dark uppercase tracking-tight">Public Hearings</h2>
                <div className="mt-4 bg-blue-50/50 border border-blue-100 p-4 rounded-xl text-blue-900">
                  <h3 className="font-bold text-sm mb-1 uppercase tracking-wider text-blue-800">Public Hearings Programme: 5 Sep–28 Nov 2026</h3>
                  <p className="text-xs font-medium leading-relaxed">Scheduled hearing sessions run through 14 November. Written testimony, supporting evidence, and permitted post-hearing submissions remain open through 28 November.</p>
                </div>`);

// Replace Timeline button text with List
c = c.replace(/Timeline\s*<\/button>/, "List\n                </button>");

fs.writeFileSync(file, c);
console.log("Updated header and switcher!");
