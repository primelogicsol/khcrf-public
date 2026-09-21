import os
import json

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"
components_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\components\master-artisans"

routes = [
    "",
    "artisans",
    "artisans/[slug]",
    "stories",
    "stories/[slug]",
    "studio",
    "studio/[slug]",
    "collections",
    "collections/[slug]",
    "techniques",
    "lineages",
    "photo-essays",
    "interviews",
    "issues",
    "nominate"
]

for route in routes:
    path = os.path.join(base_dir, route).replace("/", "\\")
    os.makedirs(path, exist_ok=True)
    page_path = os.path.join(path, "page.tsx")
    
    # Basic scaffolding
    if not os.path.exists(page_path):
        name = route.replace("\\", "/").replace("/", " ").title()
        if not name:
            name = "Master Artisans of Kashmir"
        
        content = f"""import React from 'react';

export const metadata = {{
  title: '{name} | Hamadan Craft Revival Foundation',
  description: 'Documenting the living custodians of Kashmir’s craft traditions.',
}};

export default function Page() {{
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-[#2A2A2A]">
      <section className="pt-32 pb-16 px-4 md:px-10 container-fluid mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif text-[#3E2723] mb-6">{name}</h1>
        <p className="text-xl max-w-3xl">Welcome to the {name} page.</p>
      </section>
    </main>
  );
}}
"""
        with open(page_path, "w", encoding="utf-8") as f:
            f.write(content)

os.makedirs(components_dir, exist_ok=True)

print("Scaffolded master-artisans routes successfully.")
