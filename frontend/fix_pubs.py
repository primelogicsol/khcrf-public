import re

filepath = 'src/components/publications/PublicationsSection.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the entire block from targetTypes down to setPublications(selected)
pattern = r"const targetTypes = \[.*?setPublications\(selected\);"
replacement = "setPublications(mappedPubs);"
content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated PublicationsSection")
