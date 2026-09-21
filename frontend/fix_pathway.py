import re

with open("frontend/src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx", "r", encoding="utf-8") as f:
    original_code = f.read()

# We want to replace the `category` state that opens the pathway with `activePathway` 
# because `category` is a confusing name and clashes with the profile category.
# Then we will fix the AdminPreview logic.

new_code = original_code.replace(
    'const [realCategory, setRealCategory] = useState("");',
    'const [realActivePathway, setRealActivePathway] = useState("");'
)

new_code = new_code.replace(
    'const category = isPreviewing ? (impersonatedUser ? impersonatedUser.categoryLabel : previewCategory) : realCategory;',
    'const activePathway = realActivePathway;\n  const previewProfileCategory = previewCategory;'
)

new_code = new_code.replace(
    """const setCategory = (val: string) => {
    if (isPreviewing && !impersonatedUser) {
      setPreviewCategory(val);
    } else {
      setRealCategory(val);
    }
  };""",
    'const setActivePathway = (val: string) => setRealActivePathway(val);'
)

new_code = new_code.replace('if (category === "Artisan / Weaver")', 'if (activePathway === "Artisan / Weaver")')
new_code = new_code.replace('if (category === "Manufacturer")', 'if (activePathway === "Manufacturer")')
new_code = new_code.replace('if (category === "Cooperative / Producer Group")', 'if (activePathway === "Cooperative / Producer Group")')
new_code = new_code.replace('if (category === "Exporter")', 'if (activePathway === "Exporter")')
new_code = new_code.replace('if (category === "Retailer")', 'if (activePathway === "Retailer")')
new_code = new_code.replace('if (category === "Online Seller")', 'if (activePathway === "Online Seller")')
new_code = new_code.replace('if (category === "Student")', 'if (activePathway === "Student")')
new_code = new_code.replace('if (category === "Researcher")', 'if (activePathway === "Researcher")')
new_code = new_code.replace('if (category === "University / Academic Institution")', 'if (activePathway === "University / Academic Institution")')
new_code = new_code.replace('if (category === "Government Department")', 'if (activePathway === "Government Department")')
new_code = new_code.replace('if (category === "Political Party")', 'if (activePathway === "Political Party")')
new_code = new_code.replace('if (category === "Financial Institution")', 'if (activePathway === "Financial Institution")')
new_code = new_code.replace('if (category === "Citizen")', 'if (activePathway === "Citizen")')
new_code = new_code.replace('if (category === "Youth Participant")', 'if (activePathway === "Youth Participant")')
new_code = new_code.replace('if (category === "Women Entrepreneur")', 'if (activePathway === "Women Entrepreneur")')
new_code = new_code.replace('if (category === "Civil Society Organization")', 'if (activePathway === "Civil Society Organization")')
new_code = new_code.replace('if (category === "Heritage Organization")', 'if (activePathway === "Heritage Organization")')
new_code = new_code.replace('if (category === "Media Professional")', 'if (activePathway === "Media Professional")')
new_code = new_code.replace('if (category === "Tourism Stakeholder")', 'if (activePathway === "Tourism Stakeholder")')
new_code = new_code.replace('if (category === "Diaspora Member")', 'if (activePathway === "Diaspora Member")')
new_code = new_code.replace('if (category === "International Buyer / Collector")', 'if (activePathway === "International Buyer / Collector")')
new_code = new_code.replace('if (category === "International Researcher")', 'if (activePathway === "International Researcher")')
new_code = new_code.replace('if (category === "International Organization / Development Agency")', 'if (activePathway === "International Organization / Development Agency")')
new_code = new_code.replace('if (category === "International Museum / Cultural Institution")', 'if (activePathway === "International Museum / Cultural Institution")')

new_code = new_code.replace('setCategory("")', 'setActivePathway("")')
new_code = new_code.replace('setCategory(matchedCategory)', 'setActivePathway(matchedCategory)')

with open("frontend/src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx", "w", encoding="utf-8") as f:
    f.write(new_code)
print("Updated pathway router state")
