import re

path = 'frontend/src/components/forms/InstitutionRegistrationForm.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update useState typing and state
state_search = r'const \[formData, setFormData\] = useState\(\{(.*?)\}\);'
interface_def = """interface FormData {
  participationScope: string;
  institutionName: string;
  category: string;
  representativeName: string;
  designation: string;
  districtCity: string;
  country: string;
  stateProvince: string;
  operationalCoverage: string;
  email: string;
  website: string;
  participationTypes: string;
  phone: string;
  authConsent: boolean;
  privacyConsent: boolean;
  publicDirectoryConsent: boolean;
  communicationsConsent: boolean;
}

  const [formData, setFormData] = useState<FormData>({
    participationScope: defaultScope as string,
    institutionName: '',
    category: initialCategory,
    representativeName: '',
    designation: '',
    districtCity: '',
    country: 'India',
    stateProvince: '',
    operationalCoverage: '',
    email: '',
    website: '',
    participationTypes: '',
    phone: '',
    authConsent: true,
    privacyConsent: true,
    publicDirectoryConsent: true,
    communicationsConsent: true
  });

  const locationMode = ["International Organization / Development Agency", "International Museum / Cultural Institution"].includes(formData.category) ? "INTERNATIONAL" : "KASHMIR_DISTRICT";
"""
content = re.sub(state_search, interface_def, content, flags=re.DOTALL)

# 2. Update isDirty check
content = content.replace("formData.districtCity !== '' ||", "formData.districtCity !== '' ||\n        formData.stateProvince !== '' ||\n        formData.operationalCoverage !== '' ||")

# 3. Validation block update
val_search = r"if \(!formData\.participationScope \|\| !formData\.institutionName \|\| !formData\.category \|\| !formData\.representativeName \|\| !formData\.designation \|\| !formData\.email \|\| !formData\.authConsent\) \{"
val_replace = """
      if (locationMode === "KASHMIR_DISTRICT" && !formData.districtCity) {
          setStatus('error');
          setMessage('Please select a district.');
          return;
      }
      if (locationMode === "INTERNATIONAL" && !formData.country) {
          setStatus('error');
          setMessage('Please enter a country.');
          return;
      }
      if (!formData.participationScope || !formData.institutionName || !formData.category || !formData.representativeName || !formData.designation || !formData.email || !formData.authConsent) {"""
content = re.sub(val_search, val_replace, content)

# 4. Fetch body
fetch_body = """        const record = {
          participationScope: formData.participationScope,
          institutionName: formData.institutionName,
          category: catVal,
          representativeName: formData.representativeName,
          designation: formData.designation,
          districtCity: formData.districtCity,
          country: locationMode === "INTERNATIONAL" ? formData.country : "India",
          stateProvince: formData.stateProvince,
          operationalCoverage: formData.operationalCoverage,
          locationType: locationMode,
          email: formData.email,
          website: formData.website,
          participationTypes: formData.participationTypes
        };"""
content = re.sub(r'const record = \{[\s\S]*?participationTypes: formData\.participationTypes\s*\};', fetch_body, content)

# 5. Form Reset
reset_body = """        setFormData({
          participationScope: '',
          institutionName: '', category: '', representativeName: '', designation: '', 
          districtCity: '', country: 'India', stateProvince: '', operationalCoverage: '', email: '', website: '', participationTypes: '', 
          phone: '',
          authConsent: true, privacyConsent: true, publicDirectoryConsent: true, communicationsConsent: true
        });"""
content = re.sub(r'setFormData\(\{[\s\S]*?communicationsConsent: true\s*\}\);', reset_body, content)

# 6. Render JSX replacement
render_search = r'<div>\s*<label className="block text-sm font-bold text-gray-700 mb-2">District \*</label>\s*<select\s*required\s*value=\{formData\.districtCity\}.*?</select>\s*(?:\{fieldErrors\.districtCity && \(\s*<p className="text-red-600 text-xs font-bold mt-1">\{fieldErrors\.districtCity\[0\]\}</p>\s*\)\})?\s*</div>'

render_replace = """
            {locationMode === 'KASHMIR_DISTRICT' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">District *</label>
                <select 
                  required
                  value={formData.districtCity}
                  onChange={e => setFormData({...formData, districtCity: e.target.value})}
                  className={`w-full p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 ${fieldErrors.districtCity ? "border-red-500" : "border-gray-200"}`}
                >
                  <option value="">Select</option>
                  {KASHMIR_DISTRICT_NAMES.map((d: string) => <option key={d} value={d}>{d}</option>)}
                </select>
                {fieldErrors.districtCity && (
                  <p className="text-red-600 text-xs font-bold mt-1">{fieldErrors.districtCity[0]}</p>
                )}
              </div>
            )}
            
            {locationMode === 'INTERNATIONAL' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Country *</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                    placeholder="Enter country"
                    className="w-full p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Headquarters City</label>
                  <input
                    type="text"
                    value={formData.districtCity}
                    onChange={e => setFormData({...formData, districtCity: e.target.value})}
                    placeholder="City"
                    className="w-full p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 border-gray-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Operational Region</label>
                  <input
                    type="text"
                    value={formData.operationalCoverage}
                    onChange={e => setFormData({...formData, operationalCoverage: e.target.value})}
                    placeholder="E.g., South Asia, Europe, Global"
                    className="w-full p-4 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 border-gray-200"
                  />
                </div>
              </>
            )}
"""

content = re.sub(render_search, render_replace, content, flags=re.DOTALL)

# Also update Confirmation dialog successData destruct
content = content.replace("districtCity,\n        email", "districtCity,\n        country,\n        locationType,\n        email")

# Update successData typing
content = content.replace("districtCity: string;\n      email: string;", "districtCity: string;\n      country?: string;\n      locationType?: string;\n      email: string;")

# Update Confirmation dialog display
conf_replace2 = """<span className="text-xs font-bold text-gray-400 uppercase block">{locationType === 'KASHMIR_DISTRICT' ? 'District' : 'Location'}</span>
                <span className="font-bold text-gray-800">{locationType === 'KASHMIR_DISTRICT' ? districtCity : (country || 'International')}</span>"""
content = re.sub(r'<span className="text-xs font-bold text-gray-400 uppercase block">District</span>\s*<span className="font-bold text-gray-800">\{districtCity\}</span>', conf_replace2, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated InstitutionRegistrationForm!")
