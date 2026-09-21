import os
import re

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\evidence-repository\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Zero out repoStats counts
content = re.sub(r'count: "540"', 'count: "0"', content)
content = re.sub(r'count: "315"', 'count: "0"', content)
content = re.sub(r'count: "85"', 'count: "0"', content)
content = re.sub(r'count: "56"', 'count: "0"', content)
content = re.sub(r'count: "78"', 'count: "0"', content)
content = re.sub(r'count: "110"', 'count: "0"', content)
content = re.sub(r'count: "25"', 'count: "0"', content)
content = re.sub(r'count: "38"', 'count: "0"', content)

# Empty evidenceRecords
content = re.sub(r'const evidenceRecords = \[.*?\];', 'const evidenceRecords: any[] = [];', content, flags=re.DOTALL)

# Add placeholder check
map_code = r'{evidenceRecords.map((rec, idx) => ('
replacement = r'{evidenceRecords.length === 0 ? <div className="col-span-full text-center py-8 text-gray-500 font-bold bg-white rounded-2xl border border-gray-100">No evidence uploaded yet. Submission portal opens July 15.</div> : evidenceRecords.map((rec, idx) => ('

content = content.replace(map_code, replacement)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
