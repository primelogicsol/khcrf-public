import os
import glob

# The shared import statement
import_statement = "import { KASHMIR_DISTRICT_NAMES } from '@/lib/kashmir-districts';\n"

# Paths to update
base_path = r"C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts"

files_to_update = [
    "consultation-tracker/page.tsx",
    "public-hearings/page.tsx",
    "draft-findings/page.tsx",
    "validation-round/page.tsx",
    "final-report/page.tsx",
    "reports-archive/page.tsx",
    "stakeholder-registry/page.tsx",
]

for rel_path in files_to_update:
    file_path = os.path.join(base_path, rel_path)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        updated = False
        
        # Insert import after the last import statement
        if "import { KASHMIR_DISTRICT_NAMES" not in content:
            # Find last import
            lines = content.split('\n')
            last_import_idx = -1
            for i, line in enumerate(lines):
                if line.startswith('import '):
                    last_import_idx = i
            
            if last_import_idx != -1:
                lines.insert(last_import_idx + 1, "import { KASHMIR_DISTRICT_NAMES } from '@/lib/kashmir-districts';")
                content = '\n'.join(lines)
                updated = True

        # Replace static district arrays
        # Many files have: const districts = ["Srinagar", "Budgam", "Ganderbal", "Baramulla", "Bandipora", "Kupwara", "Pulwama", "Shopian", "Kulgam", "Anantnag"];
        # or variations. We can just replace the definition of `const districts = [...]` with `const districts = KASHMIR_DISTRICT_NAMES;`
        
        import re
        new_content, count = re.subn(r'const\s+districts\s*=\s*\[[^\]]+\];', 'const districts = KASHMIR_DISTRICT_NAMES;', content)
        if count > 0:
            content = new_content
            updated = True
            
        if updated:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Updated {rel_path}")
    else:
        print(f"Not found: {rel_path}")
