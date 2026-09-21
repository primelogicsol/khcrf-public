import os
import glob
import re

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts"

for filepath in glob.glob(base_dir + '/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False
    
    if "useState" in content and "import" in content:
        # Check if useState is actually imported
        import_blocks = re.findall(r'import\s+[^;]+from\s+[\'"]react[\'"];?', content)
        has_usestate_import = False
        
        for block in import_blocks:
            if "useState" in block:
                has_usestate_import = True
                
        if not has_usestate_import:
            # We need to fix it
            if import_blocks:
                # Replace the first react import
                old_import = import_blocks[0]
                new_import = "import React, { useState, useEffect } from 'react';"
                content = content.replace(old_import, new_import, 1)
                modified = True
            else:
                # No react import at all
                if '"use client";' in content:
                    content = content.replace('"use client";', '"use client";\nimport React, { useState, useEffect } from "react";')
                elif "'use client';" in content:
                    content = content.replace("'use client';", "'use client';\nimport React, { useState, useEffect } from \"react\";")
                else:
                    content = 'import React, { useState, useEffect } from "react";\n' + content
                modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed imports properly in {filepath}")
