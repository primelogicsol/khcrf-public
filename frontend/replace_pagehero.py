import os
import re

FRONTEND_DIR = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src"

import_pattern = re.compile(r'import\s+PageHero\s+from\s+[\'"]@/components/PageHero[\'"];?')
page_hero_pattern = re.compile(r'<PageHero\s+([^>]+)/>', re.DOTALL)

def extract_props(props_str):
    props = {}
    
    title_match = re.search(r'title={?["\']([^"\']+)["\']}?', props_str)
    if title_match: props['title'] = title_match.group(1)
    else: props['title'] = "Default Title"

    description_match = re.search(r'description={?["\']([^"\']+)["\']}?', props_str)
    if description_match: props['description'] = description_match.group(1)
    else: props['description'] = ""

    badge_match = re.search(r'badge={?["\']([^"\']+)["\']}?', props_str)
    if badge_match: props['category'] = badge_match.group(1)
    else: props['category'] = "Page"

    return props

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if not import_pattern.search(content):
        return

    print(f"Processing: {filepath}")
    
    # Replace import, but if UniversalEditorialHero is already imported, we might get duplicate imports.
    # We will just append the import if it's not there, and remove PageHero.
    content = import_pattern.sub('', content)
    if 'UniversalEditorialHero' not in content:
        content = 'import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";\n' + content

    def hero_replacer(match):
        props_str = match.group(1)
        props = extract_props(props_str)
        page_key = "auto-generated-pagehero-" + os.path.basename(filepath).replace(".tsx", "")

        fallback_obj = f"""{{
          id: '{page_key}-fallback',
          pageKey: '{page_key}',
          autoplayEnabled: false,
          autoplayIntervalMs: 6000,
          slides: [
            {{
              id: 'slide-1',
              internalName: 'Auto Slide',
              eyebrow: '{props['category'].upper()}',
              titleLineOne: '{props['title'].upper()}',
              titleConnector: '',
              titleLineTwo: '',
              description: '{props['description']}'
            }}
          ]
        }}"""

        return f"<UniversalEditorialHero pageKey=\"{page_key}\" fallbackConfig={{{fallback_obj}}} />"

    content = page_hero_pattern.sub(hero_replacer, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, dirs, files in os.walk(FRONTEND_DIR):
    for file in files:
        if file.endswith(('.tsx', '.jsx')):
            process_file(os.path.join(root, file))

print("Done.")
