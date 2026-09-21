import re

path = 'frontend/src/app/dashboard/skc/stakeholders/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Update the interface StakeholderRegistration if it exists in the file
content = content.replace("interface StakeholderRegistration {", "interface StakeholderRegistration {\n  country?: string | null;\n  locationType?: string | null;")

# If the interface is not defined here, we will just update the usage or any type definition. Let's see what the file has.
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated StakeholderRegistration type")
