const fs = require('fs');
const filePath = 'frontend/src/app/(main)/about/partner-network/registry/RegistryClient.tsx';
let c = fs.readFileSync(filePath, 'utf8');

const target = `<h3 className="text-xl font-bold text-gray-900 truncate">
                            {item.orgName || item.name}
                          </h3>`;
const replacement = `<h3 className="text-xl font-bold text-gray-900 truncate">
                            {item.orgName || item.name}
                          </h3>
                          {PARENT_IDS.includes(item.id || item.referenceId || item.displayId) && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-hcrf-brown-700 text-white border-hcrf-brown-800">
                              PARENT ECOSYSTEM
                            </span>
                          )}`;

if (!c.includes('PARENT ECOSYSTEM')) {
  c = c.replace(target, replacement);
  fs.writeFileSync(filePath, c);
  console.log('Injected pill safely');
} else {
  console.log('Pill already there');
}
