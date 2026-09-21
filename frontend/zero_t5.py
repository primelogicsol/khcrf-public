import os
import re

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\consultation-tracker\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Empty the activityFeed array
content = re.sub(r'const activityFeed = \[.*?\];', 'const activityFeed: any[] = [];', content, flags=re.DOTALL)

# Add placeholder check
map_code = r'\{activityFeed\.map\(\(feed, idx\) => \('
replacement = r'{activityFeed.length === 0 ? <div className="text-gray-500 font-bold ml-8">No online activities logged yet. Activity feed will populate after July 15.</div> : activityFeed.map((feed, idx) => ('

content = content.replace(map_code, replacement)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
