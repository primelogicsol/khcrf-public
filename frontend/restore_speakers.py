import os
import re

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\public-hearings\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

replacement = '''{[1, 2, 3, 4].map(speaker => (
                  <div key={speaker} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-brand-primary transition shadow-sm text-center">
                     <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 border-4 border-white shadow-sm flex items-center justify-center text-gray-400">
                        <FaMicrophone size={24} />
                     </div>
                     <h3 className="font-black text-gray-900">Proposed Panelist {speaker}</h3>
                     <p className="text-sm text-brand-secondary font-bold mb-2">Organization TBD</p>
                     <p className="text-xs text-gray-500 mb-4">Confirmed for upcoming virtual hearing.</p>
                     <span className="text-[10px] uppercase font-black tracking-wider text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">Invited</span>
                  </div>
               ))}'''

content = content.replace('<div className="col-span-full text-center py-8 text-gray-500">No speakers registered yet. Check back July 15.</div>', replacement)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
