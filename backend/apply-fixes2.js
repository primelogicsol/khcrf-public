const fs = require('fs');

const filePath = 'frontend/src/app/(main)/about/partner-network/registry/RegistryClient.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Rename selectedArea to selectedType and update state initialization
content = content.replace(/const \[selectedArea, setSelectedArea\] = useState\("All"\);/g, 'const [selectedType, setSelectedType] = useState("All");');
content = content.replace(/selectedArea/g, 'selectedType');
content = content.replace(/setSelectedArea/g, 'setSelectedType');
content = content.replace(/derivedAreas/g, 'derivedTypes');

// 2. Fix the filtering logic to use collaborationType instead of collaborationAreas
const filterRegex = /\/\/ Check if item\.collaborationAreas[\s\S]*?item\.collaborationAreas\.includes\(selectedType\)\);/;
const filterReplacement = `const typesArray = Array.isArray(item.collaborationType) ? item.collaborationType : (Array.isArray(item.collaborationTypes) ? item.collaborationTypes : []);
    const matchesType = selectedType === "All" || typesArray.includes(selectedType);`;
content = content.replace(filterRegex, filterReplacement);
content = content.replace(/matchesArea/g, 'matchesType');

// 3. Fix derivedEcosystems and derivedTypes
content = content.replace(/if \(Array\.isArray\(item\.collaborationAreas\)\) \{\s*item\.collaborationAreas\.forEach\(\(area: string\) => derivedTypesSet\.add\(area\)\);\s*\}/, 
`const typesArray = Array.isArray(item.collaborationType) ? item.collaborationType : (Array.isArray(item.collaborationTypes) ? item.collaborationTypes : []);
    typesArray.forEach((type: string) => derivedTypesSet.add(type));`);

// Update dropdowns
content = content.replace(/<option value="All">All Collaboration Areas<\/option>/, '<option value="All">All Collaboration Types ({allPartners.length})</option>');
content = content.replace(/<option value="All">All Ecosystems<\/option>/, '<option value="All">All Ecosystems ({allPartners.length})</option>');

// Update UI rendering to group data
// Replace from `{filteredData.length === 0 ? (` down to `)}` wrapping the map
const listStartIdx = content.indexOf('{filteredData.length === 0 ? (');
const listEndIdx = content.lastIndexOf(')}', content.lastIndexOf('</section>') !== -1 ? content.lastIndexOf('</section>') : content.lastIndexOf('</div>\n    </div>'));

// Actually, let's just find the exact block to replace using substring
const prefix = content.substring(0, listStartIdx);
const suffix = `      </div>\n    </div>\n  );\n}\n`;

const listReplacement = `{filteredData.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">No records found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Array.from(
              filteredData.reduce((map: any, item: any) => {
                const brand = getEcosystemBrand(item.orgName || item.name || "");
                if (!map.has(brand)) map.set(brand, []);
                map.get(brand).push(item);
                return map;
              }, new Map<string, any[]>())
            )
            .sort((a: any, b: any) => a[0].localeCompare(b[0]))
            .map(([brand, items]: any) => {
              const sortedItems = [...items].sort((a: any, b: any) => {
                const isParentA = (a.orgName || a.name || "") === brand;
                const isParentB = (b.orgName || b.name || "") === brand;
                if (isParentA && !isParentB) return -1;
                if (!isParentA && isParentB) return 1;
                return (a.orgName || a.name || "").localeCompare(b.orgName || b.name || "");
              });
              
              const parentInList = sortedItems.some(i => (i.orgName || i.name || "") === brand);

              return (
                <div key={brand} className="mb-12">
                  <div className="border-b-2 border-brand-primary pb-3 mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-2">
                    <h2 className="text-2xl font-serif text-brand-dark flex items-center gap-3">
                      {brand}
                      {!parentInList && (
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-200/50 px-2 py-1 rounded tracking-widest uppercase">
                          PARENT CONTEXT
                        </span>
                      )}
                    </h2>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{sortedItems.length} record{sortedItems.length !== 1 ? 's' : ''} in view</span>
                  </div>
                  <div className="space-y-4">
                    <AnimatePresence>
                      {sortedItems.map((item: any, index: number) => {
                        if (!item) return null;
                        const isParent = (item.orgName || item.name || "") === brand;
                        const safeKey = item.id || item.referenceId || item.displayId || \`fallback-\${brand}-\${index}\`;
                        
                        return (
                          <motion.div
                            key={safeKey}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={\`bg-white rounded-2xl overflow-hidden transition-all duration-300 border \${
                              expandedId === safeKey
                                ? "shadow-lg border-brand-primary/30"
                                : "shadow-sm border-gray-100 hover:border-brand-primary/50"
                            }\`}
                          >
                            {/* Header - Always Visible */}
                            <div
                              onClick={() => toggleExpand(safeKey)}
                              className="p-6 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                            >
                              <div className="flex items-center gap-6 flex-1 min-w-0">
                                {/* Logo Placeholder */}
                                <div className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 text-gray-300 overflow-hidden relative">
                                  {item.logoUrl ? (
                                    <Image
                                      src={item.logoUrl}
                                      alt={item.orgName}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <FaBuilding className="text-2xl" />
                                  )}
                                </div>
            
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-3 mb-1">
                                    <h3 className="text-xl font-bold text-gray-900 truncate">
                                      {item.orgName || item.name}
                                    </h3>
                                    {isParent && (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                                        PARENT ECOSYSTEM
                                      </span>
                                    )}
                                    <span
                                      className={\`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border \${getStatusColor(item.status)}\`}
                                    >
                                      {getStatusIcon(item.status)}
                                      {item.status}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="font-medium text-brand-dark">
                                      #{(item.id || item.referenceId || item.displayId || "000000").slice(-6)}
                                    </span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span>{item.country}</span>
                                  </div>
                                </div>
                              </div>
            
                              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                <div className="hidden md:block text-right">
                                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                                    Collaboration Type
                                  </p>
                                  <div className="flex flex-wrap justify-end gap-1">
                                    {(Array.isArray(item.collaborationType) ? item.collaborationType : (Array.isArray(item.collaborationTypes) ? item.collaborationTypes : [])).map((type: string) => (
                                      <span
                                        key={type}
                                        className="text-sm font-semibold text-brand-secondary bg-brand-secondary/5 px-2 py-0.5 rounded"
                                      >
                                        {type}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div
                                  className={\`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer \${expandedId === safeKey ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-500"}\`}
                                  onClick={() => toggleExpand(safeKey)}
                                >
                                  {expandedId === safeKey ? (
                                    <FaChevronUp />
                                  ) : (
                                    <FaChevronDown />
                                  )}
                                </div>
                              </div>
                            </div>
            
                            {/* Expanded Content */}
                            <AnimatePresence>
                              {expandedId === safeKey && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden bg-gray-50/50 border-t border-gray-100"
                                >
                                  <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2 space-y-4">
                                      <div>
                                        <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">
                                          Engagement Description
                                        </h4>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                                          {item.projectDescription || item.engagementDescription || "Detailed engagement parameters are currently under secure review."}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">
                                          Areas of Collaboration
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                          {(Array.isArray(item.collaborationAreas) ? item.collaborationAreas : []).map((area: string) => (
                                            <span
                                              key={area}
                                              className="inline-block px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-brand-dark shadow-sm"
                                            >
                                              {area}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">
                                          CONNECT
                                        </h4>
                                        <p className="text-gray-700 mb-4 font-medium">
                                          To connect with <strong className="text-gray-900">{item.orgName || item.name}</strong>,<br />
                                          get KHCRF membership.
                                        </p>
                                        <a
                                          href="/about/memberships"
                                          className="inline-block px-6 py-2 bg-brand-primary text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-brand-dark transition-colors"
                                        >
                                          Get Membership
                                        </a>
                                      </div>
                                    </div>
                                    
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                      <div>
                                        <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                                          Status
                                        </h4>
                                        <p className="font-semibold text-brand-primary uppercase">
                                          {item.status}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">
                                          Type
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                          {(Array.isArray(item.collaborationType) ? item.collaborationType : (Array.isArray(item.collaborationTypes) ? item.collaborationTypes : [])).map((type: string) => (
                                            <span
                                              key={type}
                                              className="text-sm font-medium text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/10 px-2 py-1 rounded-md"
                                            >
                                              {type}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                                          Reference ID
                                        </h4>
                                        <p className="font-mono text-sm text-gray-500">
                                          {item.id || item.referenceId || item.displayId || "N/A"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        )}
`;

content = prefix + listReplacement + suffix;

if (!content.includes('import { getEcosystemBrand }')) {
    content = content.replace('import { partnerApi } from "@/lib/api";', 'import { partnerApi } from "@/lib/api";\nimport { getEcosystemBrand } from "@/lib/partnerRegistryAdapter";');
}

// VERY IMPORTANT: Also import usePartnerNetworkCollections!
// In HEAD, allPartners does NOT exist, partners exists!
// Let's replace 'allPartners' with 'partners' in our script to be safe.
content = content.replace(/allPartners\.length/g, 'partners.length');

fs.writeFileSync('backend/apply-fixes2.js', content);
fs.writeFileSync(filePath, content);
console.log('Done!');
