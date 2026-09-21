import re

path = 'frontend/src/app/dashboard/skc/stakeholders/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("type StakeholderRegistration = {", "type StakeholderRegistration = {\n  country?: string | null;\n  locationType?: string | null;")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated StakeholderRegistration type")
