import os

filepath = 'src/app/(main)/about/partner-network/registry/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_text = "Browse through our detailed records of organizational engagements. Use the filters below to narrow down by collaboration area or search for specific partners."
new_text = "Browse KHCRF's public record of organizational relationships and collaborations. Use the filters to explore partners by collaboration area or network category and view the nature and status of each publicly disclosed engagement."

content = content.replace(old_text, new_text)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated intro text")
