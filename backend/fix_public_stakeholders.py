import re

path = 'backend/src/controllers/skcStakeholderController.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("district: true,", "district: true,\n                country: true,\n                locationType: true,")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated public stakeholder select")
