import re

with open('frontend/src/app/(main)/master-artisans/artisans/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update the state keys and initial values
new_filters_state = """
  const [filters, setFilters] = useState({
    craftId: 'ALL',
    district: 'ALL',
    period: 'ALL',
    recognition: 'ALL',
    verification: 'ALL',
    status: 'ALL',
    reconciliationStatus: 'ALL',
    evidenceGrade: 'ALL',
    documentation: 'ALL'
  });
"""
content = re.sub(r'const \[filters, setFilters\] = useState\(\{.*?\}\);', new_filters_state.strip(), content, flags=re.DOTALL)

# Update fetchArtisans URL param building
new_fetch_params = """
      if (searchQuery) queryParams.append('search', searchQuery);
      if (filters.craftId !== 'ALL') queryParams.append('craftId', filters.craftId);
      if (filters.district !== 'ALL') queryParams.append('district', filters.district);
      if (filters.period !== 'ALL') queryParams.append('period', filters.period);
      if (filters.recognition !== 'ALL') queryParams.append('recognition', filters.recognition);
      if (filters.verification !== 'ALL') queryParams.append('verification', filters.verification);
      if (filters.status !== 'ALL') queryParams.append('status', filters.status);
      if (filters.reconciliationStatus !== 'ALL') queryParams.append('reconciliationStatus', filters.reconciliationStatus);
      if (filters.evidenceGrade !== 'ALL') queryParams.append('evidenceGrade', filters.evidenceGrade);
      if (filters.documentation !== 'ALL') queryParams.append('documentation', filters.documentation);
"""
content = re.sub(r'if \(searchQuery\).*?if \(filters.status !== \'All\'\) queryParams.append\(\'status\', filters.status\);', new_fetch_params.strip(), content, flags=re.DOTALL)

# Update filterCategories
new_categories = """
  const filterCategories = {
    craftId: { label: 'GI Craft', options: [
      {value: 'ALL', label: 'All'},
      {value: 'GI-CS', label: 'Kashmir Chain Stitch Embroidery'},
      {value: 'GI-CE', label: 'Kashmir Crewel Embroidery'},
      {value: 'GI-GA', label: 'Kashmir Gabba'},
      {value: 'GI-NA', label: 'Kashmir Namda'},
      {value: 'GI-TW', label: 'Kashmir Tweed'},
      {value: 'GI-WA', label: 'Kashmir Wagoo'},
      {value: 'GI-WB', label: 'Kashmir Willow Bat'},
      {value: 'GI-HKC', label: 'Kashmir Hand-Knotted Carpet'},
      {value: 'GI-KH', label: 'Kashmir Khatamband'},
      {value: 'GI-PM', label: 'Kashmir Paper Machie'},
      {value: 'GI-WWC', label: 'Kashmir Walnut Wood Carving'},
      {value: 'GI-51', label: 'Kashmir Kani Shawl'},
      {value: 'GI-PA', label: 'Kashmir Pashmina'},
      {value: 'GI-SE', label: 'Kashmir Sozani Embroidery'}
    ] },
    district: { label: 'District', options: [
      {value: 'ALL', label: 'All'},
      {value: 'SRINAGAR', label: 'Srinagar'},
      {value: 'BUDGAM', label: 'Budgam'},
      {value: 'GANDERBAL', label: 'Ganderbal'},
      {value: 'ANANTNAG', label: 'Anantnag'},
      {value: 'KULGAM', label: 'Kulgam'},
      {value: 'PULWAMA', label: 'Pulwama'},
      {value: 'SHOPIAN', label: 'Shopian'},
      {value: 'BARAMULLA', label: 'Baramulla'},
      {value: 'BANDIPORA', label: 'Bandipora'},
      {value: 'KUPWARA', label: 'Kupwara'}
    ] },
    period: { label: 'Period', options: [
      {value: 'ALL', label: 'All'},
      {value: '1965_1999', label: '1965–1999'},
      {value: '2000_2008', label: '2000–2008'},
      {value: '2009_2019', label: '2009–2019'},
      {value: '2020_2026', label: '2020–2026'}
    ] },
    recognition: { label: 'Recognition', options: [
      {value: 'ALL', label: 'All'},
      {value: 'PADMA', label: 'Padma Award'},
      {value: 'SHILP_GURU', label: 'Shilp Guru'},
      {value: 'SANT_KABIR', label: 'Sant Kabir Award'},
      {value: 'NATIONAL_AWARD', label: 'National Award'},
      {value: 'NATIONAL_MERIT', label: 'National Merit Certificate'},
      {value: 'STATE_AWARD', label: 'State Award'},
      {value: 'OTHER_GOVT', label: 'Other Government Recognition'},
      {value: 'NO_AWARD', label: 'No Government Award Recorded'}
    ] },
    verification: { label: 'Verification', options: [
      {value: 'ALL', label: 'All'},
      {value: 'GOVT_AWARD', label: 'Government Award Verified'},
      {value: 'GOVT_REG', label: 'Government Artisan Registration'},
      {value: 'PEHCHAN', label: 'Pehchan Verified'},
      {value: 'GI_AU', label: 'GI Authorized User'},
      {value: 'KHCRF', label: 'KHCRF Verified'},
      {value: 'MULTIPLE_GOVT', label: 'Multiple Government Sources'},
      {value: 'UNVERIFIED_HISTORICAL', label: 'Unverified / Historical Only'}
    ] },
    status: { label: 'Status', options: [
      {value: 'ALL', label: 'All'},
      {value: 'LIVING', label: 'Living'},
      {value: 'DECEASED', label: 'Deceased'},
      {value: 'UNKNOWN', label: 'Unknown'},
      {value: 'ACTIVE', label: 'Active'},
      {value: 'RETIRED', label: 'Retired'},
      {value: 'HISTORICAL_ONLY', label: 'Historical Only'}
    ] },
    reconciliationStatus: { label: 'Reconciliation Status', options: [
      {value: 'ALL', label: 'All'},
      {value: 'VERIFIED', label: 'Verified'},
      {value: 'PROBABLE', label: 'Probable'},
      {value: 'CONFLICTED', label: 'Conflicted'},
      {value: 'UNRESOLVED', label: 'Unresolved'}
    ] },
    evidenceGrade: { label: 'Evidence Grade', options: [
      {value: 'ALL', label: 'All'},
      {value: 'A_PLUS', label: 'A+'},
      {value: 'A', label: 'A'},
      {value: 'B', label: 'B'},
      {value: 'C', label: 'C'},
      {value: 'D', label: 'D'}
    ] },
    documentation: { label: 'Documentation', options: [
      {value: 'ALL', label: 'All'},
      {value: 'ORAL_HISTORY', label: 'Oral History'},
      {value: 'STUDIO_INTERVIEW', label: 'Studio Interview'},
      {value: 'LINEAGE', label: 'Lineage Documented'},
      {value: 'COLLECTION', label: 'Collection Linked'},
      {value: 'GOVT_ONLY', label: 'Government Source Only'},
      {value: 'NO_DOC', label: 'No Documentation Yet'}
    ] },
  };
"""
content = re.sub(r'const filterCategories = \{.*?\};', new_categories.strip(), content, flags=re.DOTALL)

# Update sidebar rendering loop
old_sidebar_loop = """
            {Object.entries(filterCategories).map(([key, category]) => (
              <div key={key} className="mb-6">
                <label className="block text-sm font-semibold text-[#3E2723] mb-2 uppercase tracking-wider">{category.label}</label>
                <div className="relative">
                  <select
                    value={(filters as any)[key]}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-[#3E2723]/20 rounded appearance-none focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-sm text-[#3E2723] shadow-sm hover:border-[#3E2723]/40 transition-colors"
                  >
                    {category.options.map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#3E2723]/50">
                    <FaChevronDown className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
"""
new_sidebar_loop = """
            {Object.entries(filterCategories).map(([key, category]) => (
              <div key={key} className="mb-6">
                <label className="block text-sm font-semibold text-[#3E2723] mb-2 uppercase tracking-wider">{category.label}</label>
                <div className="relative">
                  <select
                    value={(filters as any)[key]}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-[#3E2723]/20 rounded appearance-none focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-sm text-[#3E2723] shadow-sm hover:border-[#3E2723]/40 transition-colors"
                  >
                    {category.options.map((opt: {value: string, label: string}) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#3E2723]/50">
                    <FaChevronDown className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
"""
# Make sure to replace just the rendering map logic without relying on exact large block since the map might differ
content = re.sub(r'\{category\.options\.map\(\(opt: string\) => \(\s*<option key=\{opt\} value=\{opt\}>\{opt\}</option>\s*\)\)\}', '{category.options.map((opt: {value: string, label: string}) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}', content)

with open('frontend/src/app/(main)/master-artisans/artisans/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Frontend patched")
