import os
import re

FRONTEND_DIR = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src"

import_pattern = re.compile(r'import\s+BusinessHero\s+from\s+[\'"]@/components/business/BusinessHero[\'"];?')
business_hero_pattern = re.compile(r'<BusinessHero\s+([^>]+)/>', re.DOTALL)

def extract_props(props_str):
    props = {}
    
    title_match = re.search(r'title={?["\']([^"\']+)["\']}?', props_str)
    if title_match: props['title'] = title_match.group(1)
    else: props['title'] = "Default Title"

    highlight_match = re.search(r'highlight={?["\']([^"\']+)["\']}?', props_str)
    if highlight_match: props['highlight'] = highlight_match.group(1)
    else: props['highlight'] = ""

    subtitle_match = re.search(r'subtitle={?["\']([^"\']+)["\']}?', props_str)
    if subtitle_match: props['subtitle'] = subtitle_match.group(1)
    else: props['subtitle'] = ""

    category_match = re.search(r'category={?["\']([^"\']+)["\']}?', props_str)
    if category_match: props['category'] = category_match.group(1)
    else: props['category'] = "Page"

    return props

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if not import_pattern.search(content):
        return

    print(f"Processing: {filepath}")
    new_content = import_pattern.sub('import UniversalEditorialHero from "@/components/hero/UniversalEditorialHero";', content)

    def hero_replacer(match):
        props_str = match.group(1)
        props = extract_props(props_str)
        page_key = "auto-generated-" + os.path.basename(filepath).replace(".tsx", "")

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
              titleLineTwo: '{props['highlight'].upper()}',
              description: '{props['subtitle']}'
            }}
          ]
        }}"""

        return f"<UniversalEditorialHero pageKey=\"{page_key}\" fallbackConfig={{{fallback_obj}}} />"

    new_content = business_hero_pattern.sub(hero_replacer, new_content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

for root, dirs, files in os.walk(FRONTEND_DIR):
    for file in files:
        if file.endswith(('.tsx', '.jsx')):
            process_file(os.path.join(root, file))

print("Done.")
