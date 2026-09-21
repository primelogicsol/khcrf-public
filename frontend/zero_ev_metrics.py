import os
import re

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\evidence-repository\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('>34<', '>0<')
content = content.replace('>12<', '>0<')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
