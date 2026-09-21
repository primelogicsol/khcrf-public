import re

path1 = 'backend/src/controllers/skcStakeholderController.ts'
with open(path1, 'r', encoding='utf-8') as f:
    content1 = f.read()

# We look for the destructuring inside register:
search1 = r'const {\s*participationScope,\s*fullName,\s*organization,\s*category,\s*designation,\s*district,\s*craftSector,\s*email,\s*phone,\s*website,\s*participationModes\s*} = req.body;'
replace1 = """const { 
            participationScope, 
            fullName, 
            organization, 
            category, 
            designation, 
            district, 
            country,
            stateProvinceRegion,
            city,
            districtOfOrigin,
            locationType,
            craftSector, 
            email, 
            phone, 
            website, 
            participationModes 
        } = req.body;

        const locationMode = ["Diaspora Member"].includes(category) ? "DIASPORA" :
                             ["International Buyer / Collector", "International Researcher", "International Organization / Development Agency", "International Museum / Cultural Institution"].includes(category) ? "INTERNATIONAL" : 
                             "KASHMIR_DISTRICT";

        if (locationMode === "KASHMIR_DISTRICT" && !district) {
            return res.status(400).json({ success: false, error: 'District is required for this category.' });
        }
        if (["INTERNATIONAL", "DIASPORA"].includes(locationMode) && !country) {
            return res.status(400).json({ success: false, error: 'Country is required for this category.' });
        }"""
content1 = re.sub(search1, replace1, content1)

# Now we must update the prisma.create payload
create_search1 = r'designation,\s*district,\s*craftSector,\s*email,\s*phone,\s*website,\s*participationModes'
create_replace1 = r'designation, district, country, stateProvinceRegion, city, districtOfOrigin, locationType, craftSector, email, phone, website, participationModes'
content1 = re.sub(create_search1, create_replace1, content1)

with open(path1, 'w', encoding='utf-8') as f:
    f.write(content1)

# --- Institution ---
path2 = 'backend/src/controllers/skcInstitutionController.ts'
with open(path2, 'r', encoding='utf-8') as f:
    content2 = f.read()

search2 = r'const \{\s*participationScope,\s*institutionName,\s*category,\s*representativeName,\s*designation,\s*districtCity,\s*email,\s*website,\s*participationTypes\s*\} = req.body;'
replace2 = """const { 
            participationScope, 
            institutionName, 
            category, 
            representativeName, 
            designation, 
            districtCity, 
            country,
            stateProvince,
            operationalCoverage,
            email, 
            website, 
            participationTypes 
        } = req.body;

        const locationMode = ["International Organization / Development Agency", "International Museum / Cultural Institution"].includes(category) ? "INTERNATIONAL" : "KASHMIR_DISTRICT";

        if (locationMode === "KASHMIR_DISTRICT" && !districtCity) {
            return res.status(400).json({ success: false, error: 'District is required for this category.' });
        }
        if (locationMode === "INTERNATIONAL" && !country) {
            return res.status(400).json({ success: false, error: 'Country is required for this category.' });
        }"""
content2 = re.sub(search2, replace2, content2)

create_search2 = r'designation,\s*districtCity,\s*email,\s*website,\s*participationTypes'
create_replace2 = r'designation, districtCity, country, stateProvince, operationalCoverage, email, website, participationTypes'
content2 = re.sub(create_search2, create_replace2, content2)

with open(path2, 'w', encoding='utf-8') as f:
    f.write(content2)

print("Safely injected backend validation")
