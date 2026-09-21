import os
import glob
import re

base_dir = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts"

# Match .map((var) => ...) or .map((var, idx) => ...) and add types
# We only want to target variables that don't have types (no colon)
# Regex for map with 1 argument: \.map\(\s*\(\s*([a-zA-Z0-9_]+)\s*\)\s*=>
# Regex for map with 2 arguments: \.map\(\s*\(\s*([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s*\)\s*=>
# Also match .map(var => ...)

map1 = re.compile(r'\.map\(\s*\(\s*([a-zA-Z0-9_]+)\s*\)\s*=>')
map2 = re.compile(r'\.map\(\s*\(\s*([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s*\)\s*=>')
map3 = re.compile(r'\.map\(\s*([a-zA-Z0-9_]+)\s*=>')

for filepath in glob.glob(base_dir + '/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = map1.sub(r'.map((\1: any) =>', content)
    new_content = map2.sub(r'.map((\1: any, \2: number) =>', new_content)
    new_content = map3.sub(r'.map((\1: any) =>', new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed maps in {filepath}")
