import os
import re

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\consultation-tracker\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Change the static green badge to handle Proposed
map_code = r'<span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">\{feed.status\}</span>'
replacement = r'<span className={	ext-xs font-bold px-3 py-1 rounded-full }>{feed.status}</span>'

content = content.replace(map_code, replacement)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
