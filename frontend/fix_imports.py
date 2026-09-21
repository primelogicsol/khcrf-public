import os
import glob

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts"

for filepath in glob.glob(base_dir + '/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # if the file uses useState but doesn't import it
    if "useState" in content and "import React" not in content and "useState" not in content.split("import")[0]:
        # we need to add the import
        if "import React, { useState, useEffect } from 'react';" not in content:
            # just inject it after "use client"; if it exists, or at top
            if '"use client";' in content:
                content = content.replace('"use client";', '"use client";\nimport React, { useState, useEffect } from "react";')
            elif "'use client';" in content:
                content = content.replace("'use client';", "'use client';\nimport React, { useState, useEffect } from \"react\";")
            else:
                content = 'import React, { useState, useEffect } from "react";\n' + content
                
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed imports in {filepath}")
