import os
import re

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans"

files_to_fix = [
    r"issues\[slug]\[articleSlug]\page.tsx",
    r"stories\[slug]\page.tsx",
    r"knowledge\[slug]\page.tsx",
    r"collections\[slug]\page.tsx",
    r"artisans\[slug]\page.tsx",
    r"artisans\[slug]\gallery\page.tsx"
]

for rel_path in files_to_fix:
    path = os.path.join(base_dir, rel_path)
    if not os.path.exists(path):
        continue
        
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if we already successfully added resolvedParams
    if "const resolvedParams = await params;" not in content:
        
        # 1. Ensure the function is async
        content = content.replace("export default function", "export default async function")
        
        # 2. Fix the signature for params to use Promise
        # We know it looks something like: { params }: { params: { slug: string } }
        # Let's just do a robust string replace for the common ones we generated:
        content = content.replace("{ params }: { params: { slug: string } }", "{ params }: { params: Promise<{ slug: string }> }")
        content = content.replace("{ params }: { params: { slug: string, articleSlug: string } }", "{ params }: { params: Promise<{ slug: string, articleSlug: string }> }")
        
        # 3. Insert 'const resolvedParams = await params;' at the top of the function
        # It's always after 'export default async function ComponentName(...) {'
        
        # Find the index of the first { after export default async function
        match = re.search(r'export default async function \w+\([^)]+\)\s*\{', content)
        if match:
            insert_pos = match.end()
            content = content[:insert_pos] + "\n  const resolvedParams = await params;" + content[insert_pos:]
            
            # 4. If params.slug is still there, replace it
            content = content.replace("params.slug", "resolvedParams.slug")
            content = content.replace("params.articleSlug", "resolvedParams.articleSlug")
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("Properly fixed async params!")
