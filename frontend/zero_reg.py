import os
import re

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\stakeholder-registry\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (r'"415"', '"0"'),
    (r'"320"', '"0"'),
    (r'"156"', '"0"'),
    (r'>120<', '>0<'),
    (r'>4<', '>0<'),
    (r'>415<', '>0<'),
    (r'>320<', '>0<'),
    (r'>156<', '>0<'),
]

for pattern, repl in replacements:
    content = re.sub(pattern, repl, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
