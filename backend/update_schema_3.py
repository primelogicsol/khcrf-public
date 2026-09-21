import re

path = 'backend/prisma/schema.prisma'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace using string find
start_idx = content.find("district           String")
end_idx = content.find("craftSector        String?", start_idx)

if start_idx != -1 and end_idx != -1:
    before = content[:start_idx]
    after = content[end_idx:]
    new_fields = """district           String?
    country            String?
    stateProvinceRegion String?
    city               String?
    districtOfOrigin   String?
    locationType       String?
    """
    content = before + new_fields + after
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Schema updated via substring!")
else:
    print("Could not find indices")

