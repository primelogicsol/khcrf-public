const fs = require('fs');
const filePath = 'frontend/src/app/(main)/about/partner-network/registry/RegistryClient.tsx';
let c = fs.readFileSync(filePath, 'utf8');

c = c.replace(/<h3 className="text-xl font-bold text-gray-900 truncate">\s*\{item\.orgName \|\| item\.name\}\s*<\/h3>/, 
`<h3 className="text-xl font-bold text-gray-900 truncate">
                          {item.orgName || item.name}
                        </h3>
                        {PARENT_IDS.includes(item.id || item.referenceId || item.displayId) && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-hcrf-brown-700 text-white border-hcrf-brown-800">
                            PARENT ECOSYSTEM
                          </span>
                        )}`);

fs.writeFileSync(filePath, c);
console.log('Fixed pill styling for real');
