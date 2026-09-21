import re

path = 'frontend/src/components/forms/InstitutionRegistrationForm.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix setSuccessData
content = content.replace("setSuccessData(record);", "setSuccessData({ ...record, referenceNumber: extractedReference, status: 'SUBMITTED' });")

# Fix destruct
destruct_search = """    const {
      referenceNumber,
      participationScope,
      institutionName,
      category,
      representativeName,
      designation,
      districtCity,
      email,
      website,
      participationTypes
    } = successData;"""

destruct_replace = """    const {
      referenceNumber,
      participationScope,
      institutionName,
      category,
      representativeName,
      designation,
      districtCity,
      country,
      locationType,
      email,
      website,
      participationTypes
    } = successData;"""

content = content.replace(destruct_search, destruct_replace)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed TS errors in InstitutionRegistrationForm")
