import os
import re

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\public-hearings\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Zero out analytics
content = re.sub(r'count: "8"', 'count: "0"', content)
content = re.sub(r'count: "1,240"', 'count: "0"', content)
content = re.sub(r'count: "312"', 'count: "0"', content)
content = re.sub(r'count: "520"', 'count: "0"', content)
content = re.sub(r'count: "410"', 'count: "0"', content)
content = re.sub(r'count: "85"', 'count: "0"', content)

# Zero out emergingThemes
content = re.sub(r'count: 145', 'count: 0', content)
content = re.sub(r'count: 112', 'count: 0', content)
content = re.sub(r'count: 98', 'count: 0', content)
content = re.sub(r'count: 86', 'count: 0', content)

# Modify featuredSeries
content = re.sub(r'registered: \d+', 'registered: 0', content)
content = re.sub(r'venue: ".*?"', 'venue: "Online / Virtual"', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
