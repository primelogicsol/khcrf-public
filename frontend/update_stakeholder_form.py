import re

path = 'frontend/src/components/forms/StakeholderProfileForm.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add location mode logic
location_logic = """
  const locationMode = ["Diaspora Member"].includes(formData.category) ? "DIASPORA" :
                       ["International Buyer / Collector", "International Researcher", "International Organization / Development Agency", "International Museum / Cultural Institution"].includes(formData.category) ? "INTERNATIONAL" : 
                       "KASHMIR_DISTRICT";
"""
content = content.replace("const [formData, setFormData] = useState({", location_logic + "\n    const [formData, setFormData] = useState({")

# Add to initial state
state_replace = """      district: '',
      country: '',
      stateProvinceRegion: '',
      city: '',
      districtOfOrigin: '',
      locationType: '',"""
content = content.replace("      district: '',", state_replace)

state_type = """      district: string;
      country: string;
      stateProvinceRegion: string;
      city: string;
      districtOfOrigin: string;
      locationType: string;"""
content = content.replace("      district: string;", state_type)

dirty_check = """        formData.district !== '' ||
        formData.country !== '' ||"""
content = content.replace("        formData.district !== '' ||", dirty_check)

# In useEffect sharedData restore
restore_data = """              district: parsed.district || prev.district,
              country: parsed.country || prev.country,
              stateProvinceRegion: parsed.stateProvinceRegion || prev.stateProvinceRegion,
              city: parsed.city || prev.city,
              districtOfOrigin: parsed.districtOfOrigin || prev.districtOfOrigin,"""
content = content.replace("              district: parsed.district || prev.district,", restore_data)

# In sharedData save
save_data = """          district: formData.district,
          country: formData.country,
          stateProvinceRegion: formData.stateProvinceRegion,
          city: formData.city,
          districtOfOrigin: formData.districtOfOrigin,"""
content = content.replace("          district: formData.district,", save_data)

# In handleSubmit validation
val_search = "if (!formData.participationScope || !formData.fullName || !formData.category || !formData.district || !formData.email || !formData.consent) {"
val_replace = """
      if (locationMode === "KASHMIR_DISTRICT" && !formData.district) {
          setStatus('error');
          setMessage('Please select a district.');
          return;
      }
      if (["INTERNATIONAL", "DIASPORA"].includes(locationMode) && !formData.country) {
          setStatus('error');
          setMessage('Please select a country.');
          return;
      }
      if (!formData.participationScope || !formData.fullName || !formData.category || !formData.email || !formData.consent) {
"""
content = content.replace(val_search, val_replace)

# In fetch body
fetch_body = """          district: formData.district,
          country: formData.country,
          stateProvinceRegion: formData.stateProvinceRegion,
          city: formData.city,
          districtOfOrigin: formData.districtOfOrigin,
          locationType: locationMode,"""
content = content.replace("          district: formData.district,", fetch_body)

# In sessionStorage setItem
session_body = """            district: formData.district || '',
            country: formData.country || '',
            stateProvinceRegion: formData.stateProvinceRegion || '',
            city: formData.city || '',
            districtOfOrigin: formData.districtOfOrigin || '',
            locationType: locationMode,"""
content = content.replace("            district: formData.district || '',", session_body)

# Reset form
reset_body = """         district: '', country: '', stateProvinceRegion: '', city: '', districtOfOrigin: '', locationType: 'KASHMIR_DISTRICT', craftSector: '', email: '', phone: '', website: '', consent: false"""
content = content.replace("         district: '', craftSector: '', email: '', phone: '', website: '', consent: false", reset_body)

# Success message formatting
content = content.replace("const districtPart = successData.district ? ` ${successData.district} district` : '';", "const districtPart = successData.district ? ` ${successData.district} district` : (successData.country ? ` ${successData.country}` : '');")

# In the render JSX
render_replace = """
            {locationMode === 'KASHMIR_DISTRICT' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">District *</label>
                <select 
                  required
                  value={formData.district}
                  onChange={e => setFormData({...formData, district: e.target.value})}
                  className={`w-full p-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 ${fieldErrors.district ? "border-red-500" : "border-gray-200"}`}
                >
                  <option value="">Select</option>
                  {KASHMIR_DISTRICT_NAMES.map((d: string) => <option key={d}>{d}</option>)}
                </select>
                {fieldErrors.district && (
                  <p className="text-red-600 text-xs font-bold mt-1">{fieldErrors.district[0]}</p>
                )}
              </div>
            )}
            
            {['INTERNATIONAL', 'DIASPORA'].includes(locationMode) && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {locationMode === 'DIASPORA' ? 'Current Country of Residence *' : 'Country *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value})}
                    placeholder="Enter country"
                    className="w-full p-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">State / Province / Region</label>
                  <input
                    type="text"
                    value={formData.stateProvinceRegion}
                    onChange={e => setFormData({...formData, stateProvinceRegion: e.target.value})}
                    placeholder="Optional"
                    className="w-full p-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    placeholder="Optional"
                    className="w-full p-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 border-gray-200"
                  />
                </div>
              </>
            )}

            {locationMode === 'DIASPORA' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kashmir District of Origin</label>
                <select 
                  value={formData.districtOfOrigin}
                  onChange={e => setFormData({...formData, districtOfOrigin: e.target.value})}
                  className="w-full p-4 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-gray-600 border-gray-200"
                >
                  <option value="">Select (Optional)</option>
                  {KASHMIR_DISTRICT_NAMES.map((d: string) => <option key={d}>{d}</option>)}
                </select>
              </div>
            )}
"""

pattern = re.compile(r'<div>\s*<label className="block text-sm font-bold text-gray-700 mb-2">District \*</label>\s*<select\s*required\s*value=\{formData\.district\}.*?</select>\s*(?:\{fieldErrors\.district && \(\s*<p className="text-red-600 text-xs font-bold mt-1">\{fieldErrors\.district\[0\]\}</p>\s*\)\})?\s*</div>', re.DOTALL)
content = re.sub(pattern, render_replace, content)

# Fix Confirmation overlay rendering
pattern_conf = re.compile(r'<span className="text-xs font-bold text-gray-400 uppercase block">District</span>\s*<span className="font-bold text-gray-800">\{district\}</span>', re.DOTALL)
conf_replace = """<span className="text-xs font-bold text-gray-400 uppercase block">{formData.locationType === 'KASHMIR_DISTRICT' ? 'District' : 'Location'}</span>
                <span className="font-bold text-gray-800">{formData.locationType === 'KASHMIR_DISTRICT' ? formData.district : (formData.country || 'International')}</span>"""
content = re.sub(pattern_conf, conf_replace, content)

# I need to add country, locationType to the confirmation overlay props
# Actually, the confirmation overlay takes individual props:
# `function ConfirmationOverlay({ onConfirm, onCancel, isSubmitting, ... props })`
# I'll just change the caller:
confirm_caller = """        district,
        country: formData.country,
        locationType: locationMode,"""
content = content.replace("        district,", confirm_caller)

confirm_props = """  district: string;
  country?: string;
  locationType?: string;"""
content = content.replace("  district: string;", confirm_props)

confirm_destruct = """  designation,
  district,
  country,
  locationType,
  craftSector,"""
content = content.replace("  designation,\n  district,\n  craftSector,", confirm_destruct)

conf_replace2 = """<span className="text-xs font-bold text-gray-400 uppercase block">{locationType === 'KASHMIR_DISTRICT' ? 'District' : 'Location'}</span>
                <span className="font-bold text-gray-800">{locationType === 'KASHMIR_DISTRICT' ? district : (country || 'International')}</span>"""
content = re.sub(r'<span className="text-xs font-bold text-gray-400 uppercase block">District</span>\s*<span className="font-bold text-gray-800">\{district\}</span>', conf_replace2, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated StakeholderProfileForm!")
