import re

path = 'frontend/src/components/forms/InstitutionRegistrationForm.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix setSuccessData
content = content.replace("setSuccessData(record);", "setSuccessData({ ...record, referenceNumber: extractedReference, status: 'SUBMITTED' });")

# Fix locationType and country missing in destruct
content = content.replace("districtCity,\n        country,\n        locationType,\n        email", "districtCity,\n        country,\n        locationType,\n        email")

# wait, the typescript error was: "Cannot find name 'locationType'" at line 461.
# It's probably because it's not destructured properly from successData. Let's see the destructuring.
# It should be:
# const { category, representativeName, designation, districtCity, country, locationType, email, website, participationTypes } = successData;
