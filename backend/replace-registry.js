const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/src/app/(main)/about/partner-network/registry/RegistryClient.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

const targetStart = '{filteredData.length === 0 ? (';
const targetEnd = '          )}';
const targetEndRegex = /          \)}[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/section>/;

// We will find where the registry list rendering begins.
const startIndex = content.indexOf(targetStart);
if (startIndex === -1) throw new Error("Could not find start");

const endIndex = content.indexOf('          )}', startIndex);
if (endIndex === -1) throw new Error("Could not find end");

const replacement = `{filteredData.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500 font-medium">No records found matching your criteria.</p>
            </div>
          ) : (
            Array.from(
              filteredData.reduce((map, item) => {
                const brand = getEcosystemBrand(item.orgName || item.name || "");
                if (!map.has(brand)) map.set(brand, []);
                map.get(brand).push(item);
                return map;
              }, new Map<string, any[]>())
            )
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([brand, items]) => {
              const sortedItems = [...items].sort((a, b) => {
                const isParentA = (a.orgName || a.name || "") === brand;
                const isParentB = (b.orgName || b.name || "") === brand;
                if (isParentA && !isParentB) return -1;
                if (!isParentA && isParentB) return 1;
                return (a.orgName || a.name || "").localeCompare(b.orgName || b.name || "");
              });

              // Check if parent is in this specific collection/filter
              const parentInList = sortedItems.some(i => (i.orgName || i.name || "") === brand);

              return (
                <div key={brand} className="mb-12">
                  {/* Ecosystem Context Header */}
                  <div className="border-b-2 border-brand-primary pb-3 mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-2">
                    <h2 className="text-2xl font-serif text-brand-dark flex items-center gap-3">
                      {brand}
                      {!parentInList && (
                        <span className="text-xs font-bold text-gray-500 bg-gray-200/50 px-2.5 py-1 rounded-md tracking-widest uppercase">
                          PARENT CONTEXT
                        </span>
                      )}
                    </h2>
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{sortedItems.length} record{sortedItems.length !== 1 ? 's' : ''} in view</span>
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence>
                      {sortedItems.map((item, index) => {
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
                                <div className="text-right">
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
                                        <p className="text-gray-700 leading-relaxed font-medium">
                                          {item.projectDescription || item.description || "Detailed engagement parameters are currently under secure review."}
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
                                    </div>
                                    
                                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
                                      <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">
                                        Connect
                                      </h4>
                                      <p className="text-sm text-gray-600 mb-6 font-medium">
                                        To connect with <strong className="text-gray-900">{item.orgName || item.name}</strong>, get KHCRF membership.
                                      </p>
                                      <Link
                                        href="/profile/membership"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-dark transition-colors"
                                      >
                                        Get Membership
                                      </Link>
                                    </div>
                                  </div>
                                  
                                  {/* Footer Metadata */}
                                  <div className="bg-white border-t border-gray-100 p-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                      <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                                        Status
                                      </h4>
                                      <p className="font-semibold text-brand-primary uppercase">
                                        {item.status}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
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
            })
          )}`;

const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex + 12); // length of '          )}' is 12

fs.writeFileSync(filePath, newContent);
console.log('done');
