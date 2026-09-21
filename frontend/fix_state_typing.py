import re

path = 'frontend/src/components/forms/StakeholderProfileForm.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find the useState definition
state_def = r'const \[formData, setFormData\] = useState\(\{(.*?)\}\);'
interface_def = """interface FormData {
  participationScope: string;
  fullName: string;
  organization: string;
  category: string;
  designation: string;
  district: string;
  country: string;
  stateProvinceRegion: string;
  city: string;
  districtOfOrigin: string;
  locationType: string;
  craftSector: string;
  email: string;
  phone: string;
  website: string;
  consent: boolean;
}

  const [formData, setFormData] = useState<FormData>({
    participationScope: '',
    fullName: '',
    organization: '',
    category: initialCategory,
    designation: '',
    district: '',
    country: '',
    stateProvinceRegion: '',
    city: '',
    districtOfOrigin: '',
    locationType: '',
    craftSector: '',
    email: '',
    phone: '',
    website: '',
    consent: false
  });"""

content = re.sub(r'const \[formData, setFormData\] = useState\(\{[\s\S]*?\}\);', interface_def, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated useState typing")
