import os
import re

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\consultation-tracker\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace hard-coded numbers that are leftover in consultation-tracker
replacements = [
    (r'>120<', '>0<'),
    (r'>4<', '>0<'),
    (r'>25<', '>0<'),
    (r'>15<', '>0<'),
    (r'>6<', '>0<'),
    (r'>5<', '>0<'),
    (r'>3<', '>0<'),
    (r'>2<', '>0<'),
    (r'>8<', '>0<'),
    (r'>12<', '>0<'),
    (r'>9<', '>0<'),
    (r'>20<', '>0<'),
    (r'>14<', '>0<'),
    (r'>10<', '>0<'),
    (r'>7<', '>0<'),
    (r'>1<', '>0<'),
    (r'width: \'\d+%\'', 'width: \'0%\''),
    (r'Active Coverage', 'Pending Launch'),
    (r'bg-green-600', 'bg-gray-400'),
    (r'bg-green-500', 'bg-gray-300'),
    (r'bg-brand-secondary', 'bg-gray-300'),
    (r'bg-brand-primary', 'bg-gray-300'),
    (r'text-green-600', 'text-gray-400')
]

for pattern, repl in replacements:
    content = re.sub(pattern, repl, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
