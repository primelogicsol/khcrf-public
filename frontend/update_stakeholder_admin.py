import re

path = 'frontend/src/app/dashboard/skc/stakeholders/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Update the interface
content = content.replace("district: string;\n    craftSector: string;", "district: string | null;\n    country: string | null;\n    locationType: string | null;\n    craftSector: string;")

# Update the fetch loop to map fields
# Where it maps: `district: item.district,`
content = content.replace("district: item.district,", "district: item.district,\n        country: item.country,\n        locationType: item.locationType,")

# Update filters logic
# It checks `filters.district` -> We will keep the variable `filters.district` but maybe change the name to `Location`.
# Actually, the user says: "Admin registry displays the correct location format: PASS", "CSV export preserves district or international location correctly: PASS".
# I'll just change the display and CSV export.

# CSV Headers
content = content.replace("const headers = ['Reference Number', 'Type', 'Name', 'Organization', 'Category', 'District', 'Craft Sector', 'Email', 'Phone', 'Status', 'Submitted At'];", "const headers = ['Reference Number', 'Type', 'Name', 'Organization', 'Category', 'Location', 'Craft Sector', 'Email', 'Phone', 'Status', 'Submitted At'];")

# CSV Rows
content = content.replace("item.district || '',\n        item.craftSector", "(item.locationType === 'INTERNATIONAL' || item.locationType === 'DIASPORA') ? (item.country || 'International') : (item.district || ''),\n        item.craftSector")

# Render location in table
content = content.replace('<div className="text-xs text-gray-500 flex items-center gap-2 mt-1"><FaMapMarkerAlt className="text-gray-400"/> {item.district}</div>', '<div className="text-xs text-gray-500 flex items-center gap-2 mt-1"><FaMapMarkerAlt className="text-gray-400"/> {(item.locationType === "INTERNATIONAL" || item.locationType === "DIASPORA") ? (item.country || "International") : (item.district || "Unspecified")}</div>')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Stakeholder Admin Page")
