import os

filepath = 'next.config.mjs'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import re
content = re.sub(r'^\s*eslint:\s*{\s*ignoreDuringBuilds:\s*true,\s*},?\n?', '', content, flags=re.MULTILINE)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Removed eslint config")
