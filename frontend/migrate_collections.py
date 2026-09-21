import os
import re

base_path = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans\collections"

pages = {
    "contemporary-excellence": ("Contemporary", "allItems"),
    "museum-archive": ("Museum Archive", "allArtifacts"),
    "rare-objects": ("Rare Object", "allObjects"),
    "signature-masterpieces": ("Signature Masterpiece", "allMasterpieces"),
}

for folder, (cat, var_name) in pages.items():
    file_path = os.path.join(base_path, folder, "page.tsx")
    if not os.path.exists(file_path):
        continue

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the array declaration
    array_pattern = r"const\s+" + var_name + r"\s*=\s*\[.*?\];"
    
    # Replacement fetch block
    fetch_block = f"""const [{var_name}, set{var_name[0].upper() + var_name[1:]}] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {{
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '') : 'http://localhost:4000';
    fetch(`${{API_BASE_URL}}/api/v1/knowledge?entityType=HERITAGE_OBJECT&take=100`)
      .then(res => res.json())
      .then(data => {{
        const items = (data.data || data).filter((d: any) => d.metadata?.category === '{cat}').map((d: any) => ({{
          title: d.title,
          craft: d.metadata.craft,
          artisan: d.metadata.artisan,
          year: d.metadata.year,
          img: d.metadata.img || '/assets/images/heritage-object.jpg',
          slug: d.slug
        }}));
        set{var_name[0].upper() + var_name[1:]}(items);
        setLoading(false);
      }});
  }}, []);"""

    content = re.sub(array_pattern, fetch_block, content, flags=re.DOTALL)
    
    # add useEffect to import if not there
    if "useEffect" not in content:
        content = content.replace("import React, { useState }", "import React, { useState, useEffect }")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"Migrated {folder}")
