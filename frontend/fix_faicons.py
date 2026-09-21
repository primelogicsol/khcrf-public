import os
import glob

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts"

for filepath in glob.glob(base_dir + '/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if "FaIcons" in content and "import * as FaIcons" not in content:
        if '"use client";' in content:
            content = content.replace('"use client";', '"use client";\nimport * as FaIcons from "react-icons/fa";')
        elif "'use client';" in content:
            content = content.replace("'use client';", "'use client';\nimport * as FaIcons from \"react-icons/fa\";")
        else:
            content = 'import * as FaIcons from "react-icons/fa";\n' + content
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed FaIcons in {filepath}")
