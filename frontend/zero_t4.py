import os
import re

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\consultation-tracker\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace numbers inside these arrays
content = re.sub(r'invited:\s*\d+', 'invited: 0', content)
content = re.sub(r'participating:\s*\d+', 'participating: 0', content)
content = re.sub(r'count:\s*\d+', 'count: 0', content)
content = re.sub(r'Math.floor\(inst.participating \* 0.7\)', '0', content)

# For hearings tracker
content = re.sub(r'<span className="font-black">11</span>', '<span className="font-black">0</span>', content)
content = re.sub(r'<span className="font-black">850</span>', '<span className="font-black">0</span>', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
