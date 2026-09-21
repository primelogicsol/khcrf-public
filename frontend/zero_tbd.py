import os
import re

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\consultation-tracker\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("TBD</div>", "Oct 13</div>")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
