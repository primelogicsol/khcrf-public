import re

with open('frontend/src/app/(main)/master-artisans/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

if not content.startswith("'use client';"):
    content = "'use client';\n" + content

with open('frontend/src/app/(main)/master-artisans/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added use client")
