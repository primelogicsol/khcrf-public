import os
import re

directory = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # Remove decorative overlay divs that contain backgrounds (url, gradient, noise, patterns, vignette, glow)
    content = re.sub(
        r'<div\s+className="[^"]*?(?:absolute\s+inset-0|absolute\s+top-0)[^"]*?(?:bg-\[url|bg-gradient|pattern_bg|mix-blend-overlay|opacity-5|opacity-10|opacity-20|opacity-30)[^"]*?"\s*(?:/>|>\s*</div>)',
        '',
        content,
        flags=re.IGNORECASE | re.DOTALL
    )

    # Force .universal-hero onto section tags that are acting as heroes
    # Criteria: <section> with pt-24, pt-32, pt-44, or pt-48
    def hero_replacer(match):
        pre = match.group(1)
        classes = match.group(2)
        post = match.group(3)
        # remove existing bg- classes
        classes = re.sub(r'\bbg-[a-zA-Z0-9_#\-\[\]]+', '', classes)
        # remove hero-- classes
        classes = re.sub(r'\bhero--[a-zA-Z0-9_\-]+', '', classes)
        # add universal-hero if not present
        if 'universal-hero' not in classes:
            classes += ' universal-hero'
        # clean up multiple spaces
        classes = re.sub(r'\s+', ' ', classes).strip()
        return f'{pre}{classes}{post}'

    content = re.sub(r'(<(?:section|header)[^>]*className=")([^"]*\bpt-(?:24|32|44|48)\b[^"]*)(")', hero_replacer, content)

    # Some heroes might just have bg-brand-dark without pt-32 (e.g. if they are styled differently)
    # Let's ensure bg-brand-dark gets universal-hero class too.
    content = re.sub(r'(<(?:section|header)[^>]*className="[^"]*)bg-brand-dark([^"]*")', r'\1universal-hero\2', content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

changed_files = 0
for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.jsx'):
            if process_file(os.path.join(root, file)):
                changed_files += 1

print(f"Processed and updated {changed_files} files.")
