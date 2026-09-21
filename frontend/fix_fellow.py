import os
import re

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\become-a-fellow\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('icon: FaComments', 'icon: FaGlobe')
content = content.replace('icon: FaPenNib', 'icon: FaFileAlt')
content = content.replace('const FaComments = FaGlobe; \n  const FaPenNib = FaFileAlt;', '')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed become-a-fellow icons")
