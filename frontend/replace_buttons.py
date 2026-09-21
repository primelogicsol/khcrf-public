import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    def replacer(match):
        class_str = match.group(1)
        # Check if it's a solid brand-dark button
        if 'bg-brand-dark' in class_str and 'text-white' in class_str and ('hover:bg-brand-primary' in class_str or 'hover:bg-brand-secondary' in class_str or 'hover:bg-gray-800' in class_str):
            # Strip out the old interaction classes
            class_str = re.sub(r'\bbg-brand-dark\b', 'khcrf-btn--navy', class_str)
            class_str = re.sub(r'\btext-white\b', '', class_str)
            class_str = re.sub(r'\bhover:bg-(brand-primary|brand-secondary|gray-800)\b', '', class_str)
            class_str = re.sub(r'\bhover:-translate-y-1\b', '', class_str)
            class_str = re.sub(r'\bactive:translate-y-0\b', '', class_str)
            class_str = re.sub(r'\btransition(-all|-colors)?\b', '', class_str)
            # Clean up extra spaces
            class_str = re.sub(r'\s+', ' ', class_str).strip()
        return 'className="' + class_str + '"'

    content = re.sub(r'className="([^"]+)"', replacer, content)

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
