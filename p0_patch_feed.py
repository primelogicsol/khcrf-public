import os
import re

def process_file(filepath, replacements):
    if not os.path.exists(filepath):
        print(f"Skipping {filepath} (does not exist)")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)
        
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes in {filepath}")

# ValidationRoundClient.tsx - remove mock feed items completely
vr_replacements2 = [
    (r"<div className=\"space-y-4\">\s*<div className=\"flex gap-4 items-center[\s\S]*?</div>\s*</div>\s*</div>\s*</div>\s*</div>",
     "</div>\n              </div>\n           </div>"),
]

process_file("frontend/src/app/(main)/state-of-kashmir-crafts/validation-round/ValidationRoundClient.tsx", vr_replacements2)

print("Done")
