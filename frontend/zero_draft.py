import os
import re

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\draft-findings\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (r'"1,520"', '"0"'),
    (r'>1,520<', '>0<'),
    (r'"8"', '"0"'),
    (r'>8<', '>0<'),
    (r'"312"', '"0"'),
    (r'>312<', '>0<'),
    (r'over 1,500 stakeholder submissions and 8 public hearings', 'stakeholder submissions and public hearings'),
    (r'"420"', '"0"'),
    (r'"385"', '"0"'),
    (r'"290"', '"0"'),
    (r'"245"', '"0"'),
    (r'"310"', '"0"'),
    (r'"450"', '"0"'),
    (r'"180"', '"0"'),
    (r'"520"', '"0"'),
    (r'"275"', '"0"'),
    (r'"195"', '"0"'),
    (r'"150"', '"0"'),
    (r'"340"', '"0"'),
    (r'mentions: \d+', 'mentions: 0'),
    (r'"10/10"', '"0/0"'),
    (r'"9/10"', '"0/0"'),
    (r'"4/10"', '"0/0"'),
    (r'"6/10"', '"0/0"'),
    (r'"8/10"', '"0/0"'),
    (r'"7/10"', '"0/0"'),
    (r'districts: "[0-9]+/[0-9]+"', 'districts: "0/0"'),
    (r'450 Stakeholders \| 12 Evidence Records', '0 Stakeholders | 0 Evidence Records'),
    (r'stats: "[0-9]+ Stakeholders \| [0-9]+ Evidence Records"', 'stats: "0 Stakeholders | 0 Evidence Records"'),
    (r'820 Stakeholders \| 4 Public Hearings \| Urban Center', '0 Stakeholders | 0 Public Hearings | Urban Center'),
    (r'stats: "[0-9]+ Stakeholders \| [0-9]+ Public Hearings \| .*?"', 'stats: "0 Stakeholders | 0 Public Hearings | " + d.type'),
    (r'consultations: \d+', 'consultations: 0'),
    (r'submissions: \d+', 'submissions: 0'),
    (r'hearings: \d+', 'hearings: 0'),
    (r'institutional: \d+', 'institutional: 0'),
]

for pattern, repl in replacements:
    content = re.sub(pattern, repl, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
