import re

path = 'frontend/src/components/forms/StakeholderProfileForm.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the location mode order
content = content.replace('const locationMode = ["Diaspora Member"].includes(formData.category) ? "DIASPORA" :\n                       ["International Buyer / Collector", "International Researcher", "International Organization / Development Agency", "International Museum / Cultural Institution"].includes(formData.category) ? "INTERNATIONAL" : \n                       "KASHMIR_DISTRICT";', '')

# Insert it AFTER useState
usestate_search = r'const \[formData, setFormData\] = useState\(\{(.*?)\}\);'

def usestate_repl(m):
    return m.group(0) + """
  const locationMode = ["Diaspora Member"].includes(formData.category) ? "DIASPORA" :
                       ["International Buyer / Collector", "International Researcher", "International Organization / Development Agency", "International Museum / Cultural Institution"].includes(formData.category) ? "INTERNATIONAL" : 
                       "KASHMIR_DISTRICT";"""

content = re.sub(usestate_search, usestate_repl, content, count=1, flags=re.DOTALL)

# Add the fields to the useState object if they were removed
content = content.replace("participationScope: '',\n      fullName: '',", "participationScope: '',\n      fullName: '',\n      country: '',\n      stateProvinceRegion: '',\n      city: '',\n      districtOfOrigin: '',\n      locationType: '',")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed formData issue")
