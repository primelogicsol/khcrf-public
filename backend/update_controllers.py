import re

# Update Stakeholder Controller
path1 = 'backend/src/controllers/skcStakeholderController.ts'
with open(path1, 'r', encoding='utf-8') as f:
    content1 = f.read()

# I need to add validation inside the register method
# Usually it starts with taking req.body

val_logic1 = """
    const locationMode = ["Diaspora Member"].includes(category) ? "DIASPORA" :
                         ["International Buyer / Collector", "International Researcher", "International Organization / Development Agency", "International Museum / Cultural Institution"].includes(category) ? "INTERNATIONAL" : 
                         "KASHMIR_DISTRICT";

    if (locationMode === "KASHMIR_DISTRICT" && !district) {
      return res.status(400).json({ success: false, message: 'District is required for this category.' });
    }

    if (["INTERNATIONAL", "DIASPORA"].includes(locationMode) && !country) {
      return res.status(400).json({ success: false, message: 'Country is required for this category.' });
    }
"""

content1 = re.sub(r'const \{.*?\} = req.body;', lambda m: m.group(0) + val_logic1, content1)

with open(path1, 'w', encoding='utf-8') as f:
    f.write(content1)

# Update Institution Controller
path2 = 'backend/src/controllers/skcInstitutionController.ts'
with open(path2, 'r', encoding='utf-8') as f:
    content2 = f.read()

val_logic2 = """
    const locationMode = ["International Organization / Development Agency", "International Museum / Cultural Institution"].includes(category) ? "INTERNATIONAL" : "KASHMIR_DISTRICT";

    if (locationMode === "INTERNATIONAL" && !country) {
      return res.status(400).json({ success: false, message: 'Country is required for this institutional category.' });
    }
    // District validation for institutions is based on districtCity
    if (locationMode === "KASHMIR_DISTRICT" && !districtCity) {
      return res.status(400).json({ success: false, message: 'District/City is required for this institutional category.' });
    }
"""

content2 = re.sub(r'const \{.*?\} = req.body;', lambda m: m.group(0) + val_logic2, content2)

with open(path2, 'w', encoding='utf-8') as f:
    f.write(content2)

print("Updated Backend Controllers")
