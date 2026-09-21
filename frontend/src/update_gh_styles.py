import os

filepath = 'components/layout/GlobalHeader.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_name = '<span className={`text-lg whitespace-nowrap shrink-0 ${cormorant.className}`}>'
new_name = '<span className={`text-lg whitespace-nowrap shrink-0 khcrf-foundation-name ${cormorant.className}`}>'

old_tagline = '<span className="italic truncate min-w-0">'
new_tagline = '<span className="truncate min-w-0 khcrf-tagline">'

content = content.replace(old_name, new_name)
content = content.replace(old_tagline, new_tagline)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated GlobalHeader text styles")
