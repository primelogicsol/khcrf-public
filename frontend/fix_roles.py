import re

path = 'frontend/src/app/(main)/state-of-kashmir-crafts/stakeholder-registry/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix individual roles
content = content.replace(
    '["Artisan", "Researcher", "Citizen", "Buyer", "Exporter", "Media Professional", "Policy Expert", "Student", "Designer", "Craft Professional"]',
    'INDIVIDUAL_CATEGORIES'
)

# Fix institutional roles
content = content.replace(
    '["Government Department", "University", "Research Institution", "NGO", "Cooperative", "Museum", "Business", "Development Agency", "Trade Association", "Civil Society Organization"]',
    'INSTITUTIONAL_CATEGORIES'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Roles updated")
