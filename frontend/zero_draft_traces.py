import os
import re

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\draft-findings\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("Consultations: 42", "Consultations: 0")
content = content.replace("Submissions: 85", "Submissions: 0")
content = content.replace("Hearings: 4", "Hearings: 0")
content = content.replace("Consultations: 12", "Consultations: 0")
content = content.replace("Submissions: 34", "Submissions: 0")
content = content.replace("Institutional Data: 3", "Institutional Data: 0")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
