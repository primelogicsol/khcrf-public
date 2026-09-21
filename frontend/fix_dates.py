import os
import re

# Fix public hearings dates
path_ph = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\public-hearings\page.tsx'
with open(path_ph, 'r', encoding='utf-8') as f:
    content = f.read()

date_replacements = [
    ("Nov 12, 2026", "July 20, 2026"),
    ("Nov 15, 2026", "July 27, 2026"),
    ("Nov 18, 2026", "Aug 03, 2026"),
    ("Nov 22, 2026", "Aug 10, 2026"),
    ("Nov 25, 2026", "Aug 17, 2026"),
    ("Nov 28, 2026", "Aug 24, 2026"),
    ("Dec 02, 2026", "Aug 31, 2026"),
    ("Dec 05, 2026", "Sep 07, 2026"),
    ("Dec 08, 2026", "Sep 14, 2026"),
    ("Dec 12, 2026", "Sep 21, 2026"),
    ("July 15, 2026", "Sep 28, 2026"),
    ("Dec 18, 2026", "Oct 05, 2026"),
]
for old, new in date_replacements:
    content = content.replace(old, new)

with open(path_ph, 'w', encoding='utf-8') as f:
    f.write(content)

# Fix consultation tracker dates
path_ct = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\consultation-tracker\page.tsx'
with open(path_ct, 'r', encoding='utf-8') as f:
    content = f.read()

tracker_replacements = [
    ("Oct 15, 2026", "Oct 10, 2026"),
    ("Oct 12, 2026", "Oct 08, 2026"),
    ("Oct 10, 2026", "Oct 05, 2026"),
    ("Oct 08, 2026", "Oct 01, 2026"),
    ("Oct 05, 2026", "Sep 28, 2026"),
]
for old, new in tracker_replacements:
    content = content.replace(old, new)

with open(path_ct, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
