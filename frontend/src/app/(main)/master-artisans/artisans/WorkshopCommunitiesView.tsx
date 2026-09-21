import React, { useState } from 'react';

export function WorkshopCommunitiesView({ data }: { data: any[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = data.find(c => c.id === selectedId);

  return (
    <div className="flex w-full gap-4 relative">
      {/* Main Table Area */}
      <div className={`transition-all duration-300 ${selectedId ? 'w-2/3 hidden md:block' : 'w-full'}`}>
        <div className="bg-white rounded-sm shadow-sm border border-[#3E2723]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-[#FAF9F6] border-b border-[#3E2723]/10 text-xs uppercase tracking-wider text-[#3E2723] font-semibold">
                  <th className="p-3 border-r border-[#3E2723]/5">KHCRF Community ID</th>
                  <th className="p-3 border-r border-[#3E2723]/5">Workshop Community</th>
                  <th className="p-3 border-r border-[#3E2723]/5">Primary Craft</th>
                  <th className="p-3 border-r border-[#3E2723]/5">District</th>
                  <th className="p-3 border-r border-[#3E2723]/5">Locality / Village</th>
                  <th className="p-3 border-r border-[#3E2723]/5">Community Type</th>
                  <th className="p-3 border-r border-[#3E2723]/5 text-center">Artisans</th>
                  <th className="p-3 border-r border-[#3E2723]/5 text-center">Workshops</th>
                  <th className="p-3 border-r border-[#3E2723]/5 text-center">Households</th>
                  <th className="p-3 border-r border-[#3E2723]/5 text-center">GI Status</th>
                  <th className="p-3 border-r border-[#3E2723]/5 text-center">Grade</th>
                  <th className="p-3 border-r border-[#3E2723]/5 text-center">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {data.map((comm) => (
                  <tr 
                    key={comm.id} 
                    className={`border-b border-gray-100 hover:bg-[#FAF9F6] cursor-pointer ${selectedId === comm.id ? 'bg-[#FAF9F6] border-l-4 border-l-[#D4AF37]' : ''}`}
                    onClick={() => setSelectedId(comm.id)}
                  >
                    <td className="p-3 border-r border-[#3E2723]/5 font-mono text-xs">{comm.khcrf_community_id}</td>
                    <td className="p-3 border-r border-[#3E2723]/5 font-medium text-[#3E2723]">{comm.community_name}</td>
                    <td className="p-3 border-r border-[#3E2723]/5">{comm.primary_craft?.canonical_name || comm.primary_craft_id}</td>
                    <td className="p-3 border-r border-[#3E2723]/5">{comm.district}</td>
                    <td className="p-3 border-r border-[#3E2723]/5">{comm.village_locality}</td>
                    <td className="p-3 border-r border-[#3E2723]/5 text-xs text-gray-600">{comm.community_type}</td>
                    <td className="p-3 border-r border-[#3E2723]/5 text-center">{comm.documented_artisans || '-'}</td>
                    <td className="p-3 border-r border-[#3E2723]/5 text-center">{comm.registered_workshops || '-'}</td>
                    <td className="p-3 border-r border-[#3E2723]/5 text-center">{comm.craft_households || '-'}</td>
                    <td className="p-3 border-r border-[#3E2723]/5 text-center">
                      {comm.gi_status && <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">{comm.gi_status}</span>}
                    </td>
                    <td className="p-3 border-r border-[#3E2723]/5 text-center">{comm.evidence_grade || '-'}</td>
                    <td className="p-3 border-r border-[#3E2723]/5 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${comm.current_status === 'Active' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {comm.current_status || 'Unknown'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button className="text-[#D4AF37] hover:underline text-xs font-medium">View</button>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={13} className="p-8 text-center text-gray-500">No workshop communities found matching the criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Side Panel */}
      {selected && (
        <div className="w-full md:w-1/3 bg-white border border-[#3E2723]/10 shadow-lg rounded-sm overflow-hidden flex flex-col max-h-[85vh] sticky top-24">
          <div className="p-4 border-b border-[#3E2723]/10 flex justify-between items-center bg-[#FAF9F6]">
            <div>
              <div className="text-xs font-mono text-gray-500">{selected.khcrf_community_id}</div>
              <h2 className="text-lg font-serif font-bold text-[#3E2723]">{selected.community_name}</h2>
            </div>
            <button onClick={() => setSelectedId(null)} className="text-gray-400 hover:text-gray-700">
              ✕
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto flex-1 text-sm space-y-6">
            
            {/* 1. Community Identity */}
            <section>
              <h3 className="font-bold text-[#3E2723] uppercase tracking-wider text-xs border-b pb-1 mb-2">1. Community Identity</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Record Type</div>
                <div>{selected.record_type}</div>
                <div className="text-gray-500">Community Type</div>
                <div>{selected.community_type}</div>
                <div className="text-gray-500">Alternative Names</div>
                <div>{selected.alternative_names || '-'}</div>
              </div>
            </section>

            {/* 2. Craft Profile */}
            <section>
              <h3 className="font-bold text-[#3E2723] uppercase tracking-wider text-xs border-b pb-1 mb-2">2. Craft Profile</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Primary Craft</div>
                <div className="font-medium">{selected.primary_craft?.canonical_name}</div>
                <div className="text-gray-500">Associated Crafts</div>
                <div>{selected.associated_crafts || '-'}</div>
                <div className="text-gray-500">Specialization</div>
                <div>{selected.specialization || '-'}</div>
                <div className="text-gray-500">Materials</div>
                <div>{selected.materials || '-'}</div>
                <div className="text-gray-500">Production Processes</div>
                <div>{selected.production_processes || '-'}</div>
              </div>
            </section>

            {/* 3. Location */}
            <section>
              <h3 className="font-bold text-[#3E2723] uppercase tracking-wider text-xs border-b pb-1 mb-2">3. Location</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">District</div>
                <div>{selected.district}</div>
                <div className="text-gray-500">Locality/Village</div>
                <div>{selected.village_locality}</div>
                <div className="text-gray-500">Tehsil</div>
                <div>{selected.tehsil || '-'}</div>
                <div className="text-gray-500">Block</div>
                <div>{selected.block || '-'}</div>
                <div className="text-gray-500">Postal Address</div>
                <div>{selected.postal_address || '-'}</div>
                <div className="text-gray-500">Historical Name</div>
                <div>{selected.historical_location_name || '-'}</div>
              </div>
            </section>

            {/* 4. Community Scale */}
            <section>
              <h3 className="font-bold text-[#3E2723] uppercase tracking-wider text-xs border-b pb-1 mb-2">4. Community Scale</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm bg-gray-50 p-3 rounded border border-gray-100">
                <div className="flex justify-between"><span className="text-gray-500">Doc. Artisans:</span> <span className="font-bold">{selected.documented_artisans || '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Workshops:</span> <span className="font-bold">{selected.registered_workshops || '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Households:</span> <span className="font-bold">{selected.craft_households || '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Master Artisans:</span> <span className="font-bold">{selected.master_artisans || '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Women Artisans:</span> <span className="font-bold">{selected.women_artisans || '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">SHGs:</span> <span className="font-bold">{selected.shgs || '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Cooperatives:</span> <span className="font-bold">{selected.cooperatives || '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Est. Artisans:</span> <span className="font-bold">{selected.estimated_artisans || '-'}</span></div>
              </div>
            </section>

            {/* 5. Workshops / Karkhanas */}
            <section>
              <h3 className="font-bold text-[#3E2723] uppercase tracking-wider text-xs border-b pb-1 mb-2">5. Workshops / Karkhanas</h3>
              {selected.workshops?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600">
                        <th className="p-2 border">Workshop ID</th>
                        <th className="p-2 border">Karkhana</th>
                        <th className="p-2 border">Karkhandar</th>
                        <th className="p-2 border">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.workshops.map((w: any) => (
                        <tr key={w.id} className="border-b">
                          <td className="p-2 border font-mono">{w.khcrf_workshop_id || '-'}</td>
                          <td className="p-2 border">{w.workshop_name}</td>
                          <td className="p-2 border">{w.karkhandar_name || '-'}</td>
                          <td className="p-2 border">{w.status || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-gray-500 italic text-xs">No registered workshops documented.</div>
              )}
            </section>

            {/* 6. Organizations */}
            <section>
              <h3 className="font-bold text-[#3E2723] uppercase tracking-wider text-xs border-b pb-1 mb-2">6. Organizations</h3>
              {selected.organizations?.length > 0 ? (
                <ul className="list-disc pl-4 space-y-1">
                  {selected.organizations.map((org: any) => (
                    <li key={org.id}>
                      <span className="font-medium">{org.org_name}</span> <span className="text-gray-500">({org.org_type})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 italic text-xs">No organizations documented.</div>
              )}
            </section>

            {/* 7. GI & Government Linkage */}
            <section>
              <h3 className="font-bold text-[#3E2723] uppercase tracking-wider text-xs border-b pb-1 mb-2">7. GI & Government Linkage</h3>
              <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded border border-gray-100">
                <div className="flex justify-between"><span className="text-gray-500">GI Auth. Users:</span> <span>{selected.gi_authorized_users_in_community || '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Karkhandar Units:</span> <span>{selected.karkhandar_scheme_units || '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Gov. Reg. Artisans:</span> <span>{selected.registered_artisans || '-'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Pehchan Linked:</span> <span>{selected.pehchan_linked_artisans || '-'}</span></div>
              </div>
            </section>

          </div>
        </div>
      )}
    </div>
  );
}
