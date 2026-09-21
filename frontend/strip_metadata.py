import os
import glob
import re

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts"

# Match export const metadata ... = { ... };
# We can use a regex that matches until the closing brace of metadata
meta_regex = re.compile(r'export const metadata[^{]*\{[^}]*\};', re.DOTALL)

for filepath in glob.glob(base_dir + '/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if '"use client"' in content or "'use client'" in content:
        new_content = meta_regex.sub('', content)
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Stripped metadata from {filepath}")
