import os

filepath = 'src/app/(main)/about/partner-network/registry/RegistryClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

expanded_old = '''                        <div className="md:col-span-2 space-y-4">
                          <div>
                            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">
                              Engagement Description
                            </h4>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {item.projectDescription ||
                                "No description available."}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">
                              Areas of Collaboration
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {item.collaborationAreas?.map((area: string) => (
                                <span
                                  key={area}
                                  className="inline-block px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-brand-dark shadow-sm"
                                >
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>
                          {item.website && (
                            <div>
                              <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">
                                Website
                              </h4>
                              <a
                                href={item.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-primary hover:underline"
                              >
                                {item.website}
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                          <div>
                            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                              Status
                            </h4>
                            <p className="font-semibold text-gray-900">
                              {item.status}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                              Type
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {item.collaborationType?.map((type: string) => (
                                <span
                                  key={type}
                                  className="text-sm font-medium text-gray-700"
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
                              {item.id}
                            </p>
                          </div>
                        </div>'''

expanded_new = '''                        <div className="md:col-span-2 space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Organization Type</h4>
                              <p className="text-gray-900 font-medium">{item.organizationType || "Not Specified"}</p>
                            </div>
                            <div>
                              <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Global Reach Category</h4>
                              <p className="text-gray-900 font-medium">{item.globalReachCategory || "Not Categorized"}</p>
                            </div>
                            <div>
                              <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Primary Collaboration Area</h4>
                              <p className="text-gray-900 font-medium">{item.primaryCollaborationArea || "Not Specified"}</p>
                            </div>
                            <div>
                              <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Ecosystem Relationship</h4>
                              <p className="text-gray-900 font-medium">{item.ecosystemRelationship || "KHCRF Partner Network"}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Secondary Areas</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.collaborationAreas?.length ? item.collaborationAreas.map((area: string) => (
                                <span key={area} className="inline-block px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-brand-dark shadow-sm">
                                  {area}
                                </span>
                              )) : <span className="text-gray-500 italic text-sm">None</span>}
                            </div>
                          </div>

                          {item.website && (
                            <div>
                              <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">Website</h4>
                              <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline font-medium">
                                {item.website}
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
                          <div>
                            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Status</h4>
                            <p className="font-semibold text-gray-900">{item.status || "Pending"}</p>
                          </div>
                          <div>
                            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Relationship</h4>
                            <p className="font-semibold text-gray-900">{item.relationshipStatus || "Active"}</p>
                          </div>
                          <div>
                            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Visibility</h4>
                            <p className="font-semibold text-gray-900">{item.publicVisibility ? "Public" : "Private"}</p>
                          </div>
                          <div>
                            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Global Reach</h4>
                            <p className="font-semibold text-gray-900">{item.countInGlobalReach ? "Counted" : "Excluded"}</p>
                          </div>
                          <div>
                            <h4 className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Reference ID</h4>
                            <p className="font-mono text-sm text-gray-500 break-all">{item.id}</p>
                          </div>
                        </div>'''

content = content.replace(expanded_old, expanded_new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated expanded UI")
