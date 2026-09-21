import os
import re

base_path = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans\studio"

pages = {
    "audio-stories": ("Audio Story", "allPodcasts"),
    "craft-demonstrations": ("Demonstration", "allDemos"),
    "documentary-films": ("Documentary", "allFilms"),
    "oral-histories": ("Oral History", "allHistories"),
    "video-interviews": ("Video Interview", "allInterviews"),
    "workshop-diaries": ("Workshop Diary", "allDiaries"),
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
    fetch(`${{API_BASE_URL}}/api/v1/knowledge?entityType=KNOWLEDGE_OBJECT&take=100`)
      .then(res => res.json())
      .then(data => {{
        const items = (data.data || data).filter((d: any) => d.metadata?.kind === 'STUDIO_MEDIA' && d.metadata?.type === '{cat}').map((d: any) => ({{
          title: d.title,
          dur: d.metadata.dur,
          tag: d.metadata.tag,
          img: d.metadata.img || '/assets/images/studio/films/film_1.jpg',
          desc: d.summary || d.metadata.desc,
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
