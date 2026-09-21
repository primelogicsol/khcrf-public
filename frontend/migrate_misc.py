import os
import re

base_path = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

pages = {
    "editorial": ("EDITORIAL", "allSeries"),
    "lineages": ("LINEAGE", "allLineages"),
    "natural-dyes": ("NATURAL_DYE", "allDyes"),
}

for folder, (kind, var_name) in pages.items():
    file_path = os.path.join(base_path, folder, "page.tsx")
    if not os.path.exists(file_path):
        continue

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    array_pattern = r"const\s+" + var_name + r"\s*=\s*\[.*?\];"
    
    fetch_block = f"""const [{var_name}, set{var_name[0].upper() + var_name[1:]}] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {{
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '') : 'http://localhost:4000';
    fetch(`${{API_BASE_URL}}/api/v1/knowledge?entityType=KNOWLEDGE_OBJECT&take=100`)
      .then(res => res.json())
      .then(data => {{
        const items = (data.data || data).filter((d: any) => d.metadata?.kind === '{kind}').map((d: any) => ({{
          title: d.title,
          category: d.metadata.category || d.metadata.craft || d.metadata.color,
          desc: d.summary || d.metadata.desc,
          slug: d.slug,
          img: d.metadata.img || '/assets/images/master-artisans-hero.jpg'
        }}));
        set{var_name[0].upper() + var_name[1:]}(items);
        setLoading(false);
      }});
  }}, []);"""

    content = re.sub(array_pattern, fetch_block, content, flags=re.DOTALL)
    
    if "useEffect" not in content:
        content = content.replace("import React, { useState }", "import React, { useState, useEffect }")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"Migrated {folder}")
