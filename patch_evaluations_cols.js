const fs = require('fs');
let c = fs.readFileSync('frontend/src/app/(dashboard)/profile/evaluations/page.tsx', 'utf8');

c = c.replace(
    /<th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase">\s*Verification ID\s*<\/th>/g,
    '<th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase">\n                      Verification ID\n                    </th>\n                    <th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase">\n                      Business / Entity\n                    </th>\n                    <th className="px-6 py-4 text-sm font-bold text-stone-500 uppercase">\n                      Craft\n                    </th>'
);

c = c.replace(
    /<td className="px-6 py-4 text-sm font-bold text-stone-900 font-mono">\s*\{evaluation\.trackingId \|\| "N\/A"\}\s*<\/td>/g,
    '<td className="px-6 py-4 text-sm font-bold text-stone-900 font-mono">\n                      {evaluation.trackingId || "N/A"}\n                    </td>\n                    <td className="px-6 py-4 text-stone-700 font-medium">\n                      {evaluation.businessName || "—"}\n                    </td>\n                    <td className="px-6 py-4 text-stone-600">\n                      {evaluation.craftType || "—"}\n                    </td>'
);

fs.writeFileSync('frontend/src/app/(dashboard)/profile/evaluations/page.tsx', c);
