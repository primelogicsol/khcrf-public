
import os
import glob

files = glob.glob('src/**/*.tsx', recursive=True) + glob.glob('src/**/*.ts', recursive=True)

for file in files:
    try:
        with open(file, 'r', encoding='utf8') as f:
            content = f.read()
        if '/master-artisans/issues' in content:
            new_content = content.replace('/master-artisans/issues', '/master-artisans/publications')
            with open(file, 'w', encoding='utf8') as f:
                f.write(new_content)
            print(f'Patched {file}')
    except Exception as e:
        pass

