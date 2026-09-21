import re

with open('scripts/seed_test_artisans.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r", confidence_score: \d+", "", content)

with open('scripts/seed_test_artisans.ts', 'w', encoding='utf-8') as f:
    f.write(content)

