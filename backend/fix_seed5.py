import re

with open('scripts/seed_test_artisans.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("relationship_type: 'Apprentice' } });", "relationship_type: 'Apprentice', lineage: { create: { lineage_name: 'Lineage 1', craft_id: kaniCraft.id } } } });")
content = content.replace("relationship_type: 'Workshop Member' } });", "relationship_type: 'Workshop Member', lineage: { create: { lineage_name: 'Lineage 2', craft_id: kaniCraft.id } } } });")

with open('scripts/seed_test_artisans.ts', 'w', encoding='utf-8') as f:
    f.write(content)

