import re

path = 'frontend/src/components/forms/InstitutionRegistrationForm.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the typescript error lines 154, 155:
# It's probably in the save to `sessionStorage` or where `successData` is instantiated?
# Wait! In `InstitutionRegistrationForm.tsx`, `country` and `locationType` might be referenced without being destructured or defined. Let's search for "locationType," and "country," in the file.
# I'll just remove the lines that I injected that cause problems, or provide the correct values.

content = content.replace("districtCity,\n        country,\n        locationType,\n        email", "districtCity,\n        email")

# wait, I'll just replace the successData typing block explicitly.
success_type_search = r'const \[successData, setSuccessData\] = useState<\{[\s\S]*?\} \| null>\(null\);'
success_type_replace = """const [successData, setSuccessData] = useState<{
      referenceNumber: string;
      status: string;
      participationScope: string;
      institutionName: string;
      category: string;
      representativeName: string;
      designation: string;
      districtCity: string;
      country?: string;
      locationType?: string;
      email: string;
      website: string;
      participationTypes: string;
    } | null>(null);"""
content = re.sub(success_type_search, success_type_replace, content)

# I should use `successData?.country` and `successData?.locationType` in the JSX if I need to.
# Let's see the JSX replacement.
conf_replace2 = """<span className="text-xs font-bold text-gray-400 uppercase block">{locationType === 'KASHMIR_DISTRICT' ? 'District' : 'Location'}</span>
                <span className="font-bold text-gray-800">{locationType === 'KASHMIR_DISTRICT' ? districtCity : (country || 'International')}</span>"""

conf_replace3 = """<span className="text-xs font-bold text-gray-400 uppercase block">{successData?.locationType === 'KASHMIR_DISTRICT' ? 'District' : 'Location'}</span>
                <span className="font-bold text-gray-800">{successData?.locationType === 'KASHMIR_DISTRICT' ? successData?.districtCity : (successData?.country || 'International')}</span>"""
content = content.replace(conf_replace2, conf_replace3)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed TS errors in InstitutionRegistrationForm")
