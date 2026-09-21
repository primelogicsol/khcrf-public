import os
import re

directory = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend"

# Regex for #562508 case insensitive
pattern = re.compile(r'#562508', re.IGNORECASE)

count = 0
for root, dirs, files in os.walk(directory):
    if "node_modules" in root or ".next" in root or ".git" in root:
        continue
    for file in files:
        if file.endswith(('.tsx', '.ts', '.css', '.json', '.js', '.jsx', '.scss')):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if pattern.search(content):
                    new_content = pattern.sub('#050A1E', content)
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    count += 1
                    print(f"Updated {filepath}")
            except Exception as e:
                pass

print(f"Total files updated: {count}")
