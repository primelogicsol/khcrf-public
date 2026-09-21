import re

path = 'backend/prisma/schema.prisma'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# We can just replace the specific fields:
#     district           String
#     craftSector        String?
# We want to replace this with the new fields.

search = r'    district           String\s*    craftSector        String\?'
replace = """    district           String?
    country            String?
    stateProvinceRegion String?
    city               String?
    districtOfOrigin   String?
    locationType       String?
    craftSector        String?"""

content = re.sub(search, replace, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Prisma Schema!")
