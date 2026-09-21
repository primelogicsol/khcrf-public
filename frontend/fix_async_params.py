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
    
    # 1. Add async to the function declaration
    content = re.sub(r'export default function (\w+)\(\{\s*params\s*\}\s*:\s*\{\s*params\s*:\s*([^}]+)\}\)', r'export default async function \1({ params }: { params: Promise<\2> })', content)
    
    # 2. Add 'const resolvedParams = await params;' right after the function opening bracket
    # But we need to make sure we don't add it multiple times.
    if 'await params' not in content:
        # Find the function body start
        content = re.sub(r'(export default async function \w+\([^)]+\)\s*\{)', r'\1\n  const resolvedParams = await params;', content)
        
        # 3. Replace params.slug with resolvedParams.slug
        content = content.replace("params.slug", "resolvedParams.slug")
        content = content.replace("params.articleSlug", "resolvedParams.articleSlug")
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("Fixed async params in all dynamic route components.")
