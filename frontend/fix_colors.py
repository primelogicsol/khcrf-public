import os
import re

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\consultation-tracker\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# I will just revert the specific broken parts
content = content.replace("bg-gray-300 text-white rounded-xl", "bg-brand-primary text-white rounded-xl")
content = content.replace("hover:bg-gray-300 transition shadow-xl", "hover:bg-brand-secondary transition shadow-xl")

content = content.replace("bg-gray-300 h-3", "bg-brand-primary h-3")
content = content.replace("bg-gray-300 h-2", "bg-brand-primary h-2")
content = content.replace("bg-gray-300 h-1.5", "bg-green-500 h-1.5")

content = content.replace('bg-gray-300 text-white"', 'bg-brand-primary text-white"')
content = content.replace('hover:bg-gray-300 hover:text-white', 'hover:bg-brand-secondary hover:text-white')
content = content.replace('bg-gray-300 text-white font-bold rounded-xl', 'bg-brand-primary text-white font-bold rounded-xl')
content = content.replace('hover:bg-gray-300 transition-all shadow-xl', 'hover:bg-brand-secondary transition-all shadow-xl')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
