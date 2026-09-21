import re

path = 'frontend/src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace `category` with `activePathway` for deep links query logic
content = content.replace("?category=${encodeURIComponent(category)}", "?category=${encodeURIComponent(activePathway)}")
content = content.replace("category ? `?category=${encodeURIComponent(category)}` : ''", "activePathway ? `?category=${encodeURIComponent(activePathway)}` : ''")
content = content.replace("setCategory(", "setActivePathway(")
content = content.replace("category === ", "activePathway === ")
content = content.replace("category=", "activePathway=")

# Wait, `category=` is part of the URL! We want `?category=${encodeURIComponent(activePathway)}`
# Let's just do a manual regex replace for `category` where it's used as a variable, not a string literal.
# Since it's only a few lines, let's just do:
content = re.sub(r'encodeURIComponent\(category\)', 'encodeURIComponent(activePathway)', content)
content = re.sub(r'\bcategory \?', 'activePathway ?', content)

# Also fix the import for FaSearch, FaTimes, FaLock
if 'FaSearch' not in content[:1000]:
    content = content.replace('FaLandmark as FaMonument', 'FaLandmark as FaMonument, FaSearch, FaTimes, FaLock')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed TS errors")
