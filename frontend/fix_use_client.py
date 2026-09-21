import os
import re

FRONTEND_DIR = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src"

for root, dirs, files in os.walk(FRONTEND_DIR):
    for f in files:
        if f.endswith(('.tsx', '.jsx')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Simple fix: if file starts with import UniversalEditorialHero but contains "use client"
            if content.startswith('import UniversalEditorialHero') and '"use client"' in content:
                # remove "use client"; and "use client" 
                content = content.replace('"use client";', '').replace('"use client"', '')
                # add to top
                content = '"use client";\n' + content.lstrip()
                
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(content)
                print(f"Fixed use client in {path}")
