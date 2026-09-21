import os

filepath = 'src/app/(main)/about/partner-network/registry/RegistryClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace COLLABORATION_AREAS array
content = content.replace('''const COLLABORATION_AREAS = [
  "Sustainability and Ethical Trade",
  "Innovation and Technology",
  "Academic Research",
  "Artisan Welfare",
  "Cultural Preservation",
  "Policy and Advocacy",
];''', '''const COLLABORATION_AREAS = [
  "Knowledge & Research",
  "Technology & Traceability",
  "Tourism & Cultural Experience",
  "Trade & Market Access",
  "Artisan & Enterprise Development",
  "Institutional & Development",
];

const GLOBAL_REACH_CATEGORIES = [
  "Government Agencies",
  "International NGOs",
  "Corporate Partners",
  "Trade Organizations",
  "Cultural Institutions",
  "Technology Leaders",
  "Ethical Trade Orgs",
  "Academic Institutions",
  "Policy Think Tanks"
];''')

# Add selectedCategory state
content = content.replace('const [selectedArea, setSelectedArea] = useState("All");', 'const [selectedArea, setSelectedArea] = useState("All");\n  const [selectedCategory, setSelectedCategory] = useState("All");')

# Update filteredData logic to include selectedCategory
content = content.replace('''    // Check if item.collaborationAreas is an array and includes the selected area
    const matchesArea =
      selectedArea === "All" ||
      (Array.isArray(item.collaborationAreas) &&
        item.collaborationAreas.includes(selectedArea));

    return matchesSearch && matchesArea;''', '''    const matchesArea =
      selectedArea === "All" ||
      item.primaryCollaborationArea === selectedArea ||
      (Array.isArray(item.collaborationAreas) && item.collaborationAreas.includes(selectedArea));

    const matchesCategory =
      selectedCategory === "All" ||
      item.globalReachCategory === selectedCategory;

    return matchesSearch && matchesArea && matchesCategory;''')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated basic arrays and state")
