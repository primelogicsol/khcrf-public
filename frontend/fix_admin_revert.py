import os
import re

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\admin\state-of-kashmir-crafts\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('{stat.val}', '{stat.value}')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed stat.val -> stat.value")
