import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Replace bg-brand-* with bg-[#6B2B08] ONLY if the same className contains w-1 or w-2 and h-full
    def bg_replacer(match):
        class_str = match.group(1)
        if re.search(r'\b(w-1|w-2|w-4)\b', class_str) and re.search(r'\bh-full\b', class_str):
            # It is a vertical accent line
            class_str = re.sub(r'\bbg-brand-(?:primary|secondary|dark)\b', 'bg-[#6B2B08]', class_str)
        return 'className="' + class_str + '"'

    content = re.sub(r'className="([^"]+)"', bg_replacer, content)

    # Replace border-brand-* with border-[#6B2B08] ONLY if the same className contains border-l-
    def border_replacer(match):
        class_str = match.group(1)
        if re.search(r'\bborder-l(?:-[248])?\b', class_str):
            # It is a vertical left border accent
            class_str = re.sub(r'\bborder-brand-(?:primary|secondary|dark)\b', 'border-l-[#6B2B08]', class_str)
        return 'className="' + class_str + '"'

    content = re.sub(r'className="([^"]+)"', border_replacer, content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

root = 'src'
changed = 0
for dirpath, _, filenames in os.walk(root):
    for f in filenames:
        if f.endswith('.tsx') or f.endswith('.ts'):
            if process_file(os.path.join(dirpath, f)):
                changed += 1

print(f"Changed {changed} files.")
