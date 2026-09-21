import re

with open('scripts/seed_test_artisans.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("asserted_value:", "assertion_value:")

with open('scripts/seed_test_artisans.ts', 'w', encoding='utf-8') as f:
    f.write(content)

