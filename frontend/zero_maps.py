import os
import re

path_ph = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\public-hearings\page.tsx'

with open(path_ph, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the maps with empty state
content = re.sub(r'\{\[1, 2, 3, 4\].map\(speaker => \(.*?\)\)\}', '<div className="col-span-full text-center py-8 text-gray-500">No speakers registered yet. Check back July 15.</div>', content, flags=re.DOTALL)
content = re.sub(r'\{\[1, 2\].map\(archive => \(.*?\)\)\}', '<div className="col-span-full text-center py-8 text-gray-500">No hearings archived yet.</div>', content, flags=re.DOTALL)

with open(path_ph, 'w', encoding='utf-8') as f:
    f.write(content)

path_om = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\official-messages\page.tsx'

with open(path_om, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'\{\[1, 2, 3, 4\].map\(\(item\) => \(.*?\)\)\}', '<div className="col-span-full text-center py-8 text-gray-500">No official messages published yet. Platform opens July 15.</div>', content, flags=re.DOTALL)
content = re.sub(r'\{\[1, 2\].map\(item => \(.*?\)\)\}', '<div className="col-span-full text-center py-8 text-gray-500">No institutional endorsements available yet.</div>', content, flags=re.DOTALL)
content = re.sub(r'\{\[1, 2, 3, 4\].map\(item => \(.*?\)\)\}', '<div className="col-span-full text-center py-8 text-gray-500">No expert opinions published yet.</div>', content, flags=re.DOTALL)
content = re.sub(r'\{\[1, 2, 3\].map\(item => \(.*?\)\)\}', '<div className="col-span-full text-center py-8 text-gray-500">No participant statements available yet.</div>', content, flags=re.DOTALL)

with open(path_om, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
