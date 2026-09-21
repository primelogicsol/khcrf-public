import re

filepath = 'src/components/publications/PublicationsSection.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add "All Publications" to categories array
content = re.sub(r'(const categories = \[)', r'\1\n    "All Publications",', content)

# 2. Change default state from "Market Intelligence" to "All Publications"
content = re.sub(r'(const \[selectedCategory, setSelectedCategory\] = useState\(")(.*?)("\);)', r'\1All Publications\3', content)

# 3. Fix the filteredPublications logic to include All Publications
content = re.sub(
    r'(const filteredPublications = publications\.filter\(item => {)',
    r'\1\n    if (selectedCategory === "All Publications") return true;',
    content
)

# 4. Remove the targetTypes filtering that drops valid publications silently
# We want to just setPublications(mappedPubs) instead of doing the targetTypes loop
content = re.sub(
    r'const targetTypes = \[\s*\{ type:.*?\}\s*\];\s*const selected: CanonicalPublicationPresentation\[\] = \[\];\s*targetTypes\.forEach\(target => \{.*?\s*setPublications\(selected\);',
    r'setPublications(mappedPubs);',
    content,
    flags=re.DOTALL
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated PublicationsSection")
