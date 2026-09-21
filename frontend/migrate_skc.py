import os
import glob
import re

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts"

array_regex = re.compile(r'const\s+([a-zA-Z0-9_]+)\s*=\s*\[.*?\];', re.DOTALL)

for filepath in glob.glob(base_dir + '/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    matches = array_regex.findall(content)
    if not matches:
        continue
    
    # skip complex files
    if 'AdvisorForm' in filepath or 'ConsultationTrackerClient' in filepath or 'CurrentAssessmentClient' in filepath or 'DraftFindingsClient' in filepath or 'EvidenceRepositoryClient' in filepath or 'StakeholderRegistryClient' in filepath or 'page.tsx' not in filepath:
        continue
        
    for var_name in matches:
        kind = var_name.upper()
        
        fetch_block = f"""const [{var_name}, set{var_name[0].upper() + var_name[1:]}] = useState<any[]>([]);
  const [loading{var_name}, setLoading{var_name}] = useState(true);

  useEffect(() => {{
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '') : 'http://localhost:4000';
    fetch(`${{API_BASE_URL}}/api/v1/knowledge?entityType=SKC_RECORD&take=100`)
      .then(res => res.json())
      .then(data => {{
        const items = (data.data || data).filter((d: any) => d.metadata?.kind === '{kind}').map((d: any) => ({{
          ...d.metadata,
          title: d.title,
          desc: d.summary || d.metadata.desc,
          slug: d.slug,
          id: d.id,
          icon: d.metadata.icon ? ((FaIcons as any)[d.metadata.icon] || FaIcons.FaCircle) : null
        }}));
        set{var_name[0].upper() + var_name[1:]}(items);
        setLoading{var_name}(false);
      }});
  }}, []);"""
        
        pattern = r"const\s+" + var_name + r"\s*=\s*\[.*?\];"
        content = re.sub(pattern, fetch_block, content, count=1, flags=re.DOTALL)
        
    if "useEffect" not in content:
        if "import React from" in content:
            content = content.replace("import React from", "import React, { useState, useEffect } from")
        elif "import React," in content:
            content = content.replace("import React,", "import React, { useState, useEffect },")
        else:
            content = content.replace("import {", "import React, { useState, useEffect } from 'react';\nimport {")

    if "FaIcons" not in content and "icon:" in fetch_block: # wait, fetch_block is always used if there's a match
        content = "import * as FaIcons from 'react-icons/fa';\n" + content

    if "use client" not in content:
        content = '"use client";\n' + content

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Migrated arrays in {filepath}")
