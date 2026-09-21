import sys

filepath = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\master-artisans\nominate\page.tsx'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('  return (\n    <main')
if idx == -1:
    print("Return block not found.")
    sys.exit(1)

new_return = """  return (
    <main className="w-full bg-[#FAF9F6] min-h-screen text-gray-800 font-sans pb-32 selection:bg-[#F6F2EC] selection:text-[#3E2723]">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <UniversalEditorialHero pageKey="nominate-artisan" fallbackConfig={nominateArtisanHeroFallback as any} />

      <section className="container mx-auto px-4 max-w-4xl mt-[-40px] relative z-10 mb-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <h2 className="text-3xl font-black text-brand-dark mb-6">Nominate a Master Artisan</h2>
          <div className="prose prose-lg text-gray-600 mb-8 max-w-none">
            <p>
              Help identify, document, and preserve the lives, skills, and legacies of Kashmir’s master artisans.
              You may nominate an artisan who has practised a traditional craft for 20 years or more and is recognised for exceptional skill, distinctive workmanship, generational knowledge, innovation within tradition, or service to a craft community.
            </p>
            <p>
              Each nomination supports the creation of a verified public record within the Kashmir Heritage Craft Archive. Submitted information will be reviewed before publication, and additional evidence or consent may be requested during the verification process.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-6 rounded-2xl mb-8 font-medium border border-red-100 flex items-start">
              <span className="text-xl mr-3">⚠️</span>
              <div>
                <div className="font-bold mb-1">{errorMsg}</div>
                {Object.keys(fieldErrors).length > 0 && (
                  <ul className="mt-3 space-y-2 text-sm">
                    {Object.entries(fieldErrors).map(([field, msg]) => (
                      <li key={field} className="flex items-start gap-2">
                        <span>
                          <strong className="capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</strong>: {msg}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">

            {/* Section 1: Artisan Details */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                Artisan Details
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Artisan Name *</label>
                  <input type="text" name="nomineeName" value={formData.nomineeName} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="e.g. Master Ali Mohammad" />
                  {getFieldError('nomineeName')}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Primary Craft Category *</label>
                    <select name="primaryCraft" value={formData.primaryCraft} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                      <option value="">Select Primary Craft</option>
                      {Object.entries(craftsByCategory).map(([category, crafts]) => (
                        <optgroup key={category} label={category}>
                          {crafts.map(craft => (
                            <option key={craft.craftId} value={craft.englishName}>{craft.englishName}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    {getFieldError('primaryCraft')}
                  </div>

                  <div className="relative" ref={secondaryDropdownRef}>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Secondary Craft Categories (Optional)</label>
                    <div 
                      className="w-full px-5 py-3 min-h-[50px] border border-gray-200 rounded-xl bg-white flex flex-wrap gap-2 items-center cursor-pointer transition focus:ring-2 focus:ring-brand-primary outline-none"
                      onClick={() => setSecondaryDropdownOpen(!secondaryDropdownOpen)}
                    >
                      <div className="flex flex-wrap gap-2 flex-1">
                        {formData.secondaryCrafts.length === 0 ? (
                          <span className="text-gray-400 text-sm">Select secondary crafts...</span>
                        ) : (
                          formData.secondaryCrafts.map(craft => (
                            <span key={craft} className="bg-brand-primary/10 text-brand-dark px-3 py-1 rounded-full text-xs font-bold flex items-center">
                              {craft}
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFormData(prev => ({
                                    ...prev,
                                    secondaryCrafts: prev.secondaryCrafts.filter(c => c !== craft)
                                  }));
                                }}
                                className="ml-2 text-brand-primary hover:text-red-500"
                              >
                                &times;
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                      <div className="text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${secondaryDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </div>
                    </div>

                    {secondaryDropdownOpen && (
                      <div className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-xl max-h-80 overflow-y-auto custom-scrollbar">
                        {Object.entries(craftsByCategory).map(([category, crafts]) => (
                          <div key={category} className="border-b border-gray-50 last:border-0">
                            <div className="px-4 py-2 bg-gray-50/90 text-[11px] font-bold text-gray-400 uppercase tracking-wider sticky top-0 z-10 backdrop-blur-sm">
                              {category}
                            </div>
                            {crafts.map(craft => {
                              const isSelected = formData.secondaryCrafts.includes(craft.englishName);
                              return (
                                <div 
                                  key={craft.craftId}
                                  className={`px-4 py-3 flex items-center cursor-pointer transition-colors hover:bg-brand-primary/5 ${isSelected ? 'bg-brand-primary/5' : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFormData(prev => {
                                      const alreadySelected = prev.secondaryCrafts.includes(craft.englishName);
                                      const newCrafts = alreadySelected 
                                        ? prev.secondaryCrafts.filter(c => c !== craft.englishName)
                                        : [...prev.secondaryCrafts, craft.englishName];
                                      return { ...prev, secondaryCrafts: newCrafts };
                                    });
                                  }}
                                >
                                  <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'border-gray-300 bg-white'}`}>
                                    {isSelected && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                  </div>
                                  <span className={`text-sm ${isSelected ? 'font-semibold text-brand-dark' : 'text-gray-700'}`}>
                                    {craft.englishName}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    )}
                    {getFieldError('secondaryCrafts')}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Years of Practice *</label>
                  <input type="number" name="yearsOfPractice" value={formData.yearsOfPractice} onChange={handleChange} min="20" required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="Min. 20" />
                  {getFieldError('yearsOfPractice')}
                </div>
              </div>
            </div>

            {/* Section 2: Location Details */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                Location Details
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Union Territory / Region</label>
                    <input type="text" name="unionTerritory" value={formData.unionTerritory} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="e.g. Jammu & Kashmir" />
                    {getFieldError('unionTerritory')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">District *</label>
                    <input type="text" name="district" value={formData.district} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="e.g. Srinagar" />
                    {getFieldError('district')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tehsil / Sub-district *</label>
                    <input type="text" name="tehsil" value={formData.tehsil} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="e.g. Khanyar" />
                    {getFieldError('tehsil')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Village / Town / Mohalla *</label>
                    <input type="text" name="village" value={formData.village} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="e.g. Safa Kadal" />
                    {getFieldError('village')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">PIN Code *</label>
                    <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} required maxLength={6} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="190002" />
                    {getFieldError('pinCode')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Address</label>
                    <input type="text" name="fullAddress" value={formData.fullAddress} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="Street address..." />
                    {getFieldError('fullAddress')}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Landmark</label>
                    <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="Near..." />
                    {getFieldError('landmark')}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Artisan Identification */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                Artisan Identification
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Does the artisan have a government-issued artisan registration or identity number? *</label>
                  <select name="hasGovtArtisanId" value={formData.hasGovtArtisanId} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                    <option value="">Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Applied, awaiting approval">Applied, awaiting approval</option>
                    <option value="Not known">Not known</option>
                  </select>
                  {getFieldError('hasGovtArtisanId')}
                </div>

                {formData.hasGovtArtisanId === 'Yes' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Government Artisan ID / Registration Number *</label>
                      <input type="text" name="govtArtisanId" value={formData.govtArtisanId} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                      {getFieldError('govtArtisanId')}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Registration Type *</label>
                      <select name="artisanRegistrationType" value={formData.artisanRegistrationType} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                        <option value="">Select Type</option>
                        <option value="J&K Handicrafts Artisan Registration">J&K Handicrafts Artisan Registration</option>
                        <option value="J&K Handloom Weaver Registration">J&K Handloom Weaver Registration</option>
                        <option value="Weaver Identity Card">Weaver Identity Card</option>
                        <option value="Artisan Credit Card">Artisan Credit Card</option>
                        <option value="National Artisan Card">National Artisan Card</option>
                        <option value="Cooperative Membership ID">Cooperative Membership ID</option>
                        <option value="GI Authorised User Registration">GI Authorised User Registration</option>
                        <option value="Government Award Record">Government Award Record</option>
                        <option value="Other recognised registration">Other recognised registration</option>
                      </select>
                      {getFieldError('artisanRegistrationType')}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Issuing Authority *</label>
                      <input type="text" name="artisanIssuingAuthority" value={formData.artisanIssuingAuthority} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                      {getFieldError('artisanIssuingAuthority')}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Year of Registration</label>
                      <input type="text" name="artisanYearOfRegistration" value={formData.artisanYearOfRegistration} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                      {getFieldError('artisanYearOfRegistration')}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Supporting Document (Optional)</label>
                      <input type="file" onChange={handleArtisanDocChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition text-sm" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Existing HCRF Artisan ID (Optional)</label>
                  <p className="text-xs text-gray-500 mb-2">Only for artisans already recorded in the HCRF system. Example: HCRF-MA-2026-000127</p>
                  <input type="text" name="existingHcrfArtisanId" value={formData.existingHcrfArtisanId} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="HCRF-MA-..." />
                  {getFieldError('existingHcrfArtisanId')}
                </div>
              </div>
            </div>

            {/* Section 4: Workshop Identification */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">4</span>
                Workshop Identification
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Does the artisan work from a recognised or registered workshop? *</label>
                  <select name="hasWorkshop" value={formData.hasWorkshop} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                    <option value="">Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="Not known">Not known</option>
                    <option value="No fixed workshop">No fixed workshop</option>
                  </select>
                  {getFieldError('hasWorkshop')}
                </div>

                {formData.hasWorkshop === 'Yes' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Workshop Name *</label>
                      <input type="text" name="workshopName" value={formData.workshopName} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                      {getFieldError('workshopName')}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Workshop Type *</label>
                      <select name="workshopType" value={formData.workshopType} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                        <option value="">Select Type</option>
                        <option value="Home-based workshop">Home-based workshop</option>
                        <option value="Independent artisan workshop">Independent artisan workshop</option>
                        <option value="Family workshop">Family workshop</option>
                        <option value="Cooperative workshop">Cooperative workshop</option>
                        <option value="Community workshop">Community workshop</option>
                        <option value="Master-apprentice workshop">Master-apprentice workshop</option>
                        <option value="Government-supported centre">Government-supported centre</option>
                        <option value="NGO-supported centre">NGO-supported centre</option>
                        <option value="Commercial production unit">Commercial production unit</option>
                        <option value="Other">Other</option>
                      </select>
                      {getFieldError('workshopType')}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Is the workshop formally registered? *</label>
                      <select name="isWorkshopRegistered" value={formData.isWorkshopRegistered} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                        <option value="">Select option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="Not known">Not known</option>
                      </select>
                      {getFieldError('isWorkshopRegistered')}
                    </div>

                    {formData.isWorkshopRegistered === 'Yes' && (
                      <>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Workshop ID / Registration Number *</label>
                          <input type="text" name="workshopId" value={formData.workshopId} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                          {getFieldError('workshopId')}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Registration Type *</label>
                          <select name="workshopRegistrationType" value={formData.workshopRegistrationType} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                            <option value="">Select Type</option>
                            <option value="Government Workshop Registration">Government Workshop Registration</option>
                            <option value="Udyam / MSME Registration">Udyam / MSME Registration</option>
                            <option value="Cooperative Registration">Cooperative Registration</option>
                            <option value="Firm Registration">Firm Registration</option>
                            <option value="Society Registration">Society Registration</option>
                            <option value="GST Registration">GST Registration</option>
                            <option value="GI-authorised production unit">GI-authorised production unit</option>
                            <option value="Export Registration">Export Registration</option>
                            <option value="Other recognised registration">Other recognised registration</option>
                          </select>
                          {getFieldError('workshopRegistrationType')}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Issuing Authority *</label>
                          <input type="text" name="workshopIssuingAuthority" value={formData.workshopIssuingAuthority} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                          {getFieldError('workshopIssuingAuthority')}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Year of Registration</label>
                          <input type="text" name="workshopYearOfRegistration" value={formData.workshopYearOfRegistration} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                          {getFieldError('workshopYearOfRegistration')}
                        </div>
                      </>
                    )}

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Workshop Address</label>
                      <input type="text" name="workshopAddress" value={formData.workshopAddress} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                      {getFieldError('workshopAddress')}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Workshop PIN Code</label>
                      <input type="text" name="workshopPinCode" value={formData.workshopPinCode} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" />
                      {getFieldError('workshopPinCode')}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Supporting Document (Optional)</label>
                      <input type="file" onChange={handleWorkshopDocChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition text-sm" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Existing HCRF Workshop ID (Optional)</label>
                  <p className="text-xs text-gray-500 mb-2">Only when the workshop already exists in the HCRF registry. Example: HCRF-WS-2026-000084</p>
                  <input type="text" name="existingHcrfWorkshopId" value={formData.existingHcrfWorkshopId} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="HCRF-WS-..." />
                  {getFieldError('existingHcrfWorkshopId')}
                </div>
              </div>
            </div>

            {/* Section 5: Nomination Details & Your Information */}
            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center border-b pb-4">
                <span className="bg-brand-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">5</span>
                Nomination Details
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Why are you nominating them? *</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} required className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition resize-y" placeholder="Describe their unique skill, masterwork contributions, or heritage lineage..."></textarea>
                  {getFieldError('notes')}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Workshop Photo (Optional)</label>
                  <p className="text-xs text-gray-400 mb-3">JPEG, PNG, WEBP only • Maximum 10 MB</p>
                  {selectedFile ? (
                    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-sm text-gray-700 truncate">{selectedFile.name}</span>
                        <span className="text-xs text-gray-400">({formatBytes(selectedFile.size)})</span>
                      </div>
                      <button type="button" onClick={clearFile} className="text-xs font-bold text-red-500 hover:text-red-700">Remove</button>
                    </div>
                  ) : (
                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition cursor-pointer text-sm" />
                  )}
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Your Information (Nominator)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                      <input type="text" name="nominatorInfo" value={formData.nominatorInfo} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="Your Name" />
                      {getFieldError('nominatorInfo')}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                      <input type="email" value={nominatorEmail} onChange={e => setNominatorEmail(e.target.value)} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="you@example.com" />
                      {getFieldError('nominatorEmail')}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                      <input type="tel" value={nominatorPhone} onChange={e => setNominatorPhone(e.target.value)} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition" placeholder="+91 00000 00000" />
                      {getFieldError('nominatorPhone')}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Relationship to Artisan *</label>
                      <select name="relationship" value={formData.relationship} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-brand-primary outline-none transition">
                        <option value="">Select Relationship</option>
                        <option value="Self">Self</option>
                        <option value="Family Member">Family Member</option>
                        <option value="Apprentice">Apprentice</option>
                        <option value="Fellow Artisan">Fellow Artisan</option>
                        <option value="Cooperative Representative">Cooperative Representative</option>
                        <option value="Community Member">Community Member</option>
                        <option value="Researcher">Researcher</option>
                        <option value="Government Official">Government Official</option>
                        <option value="Institution">Institution</option>
                        <option value="Buyer or Collector">Buyer or Collector</option>
                        <option value="Other">Other</option>
                      </select>
                      {getFieldError('relationship')}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <label className="flex items-start space-x-3 cursor-pointer bg-white p-4 rounded-xl border border-gray-200">
                    <input type="checkbox" name="consentGiven" checked={formData.consentGiven} onChange={handleChange} required id="consentGiven" className="w-5 h-5 mt-0.5 text-brand-primary rounded border-gray-300 focus:ring-brand-primary" />
                    <span className="text-sm font-bold text-gray-700">
                      I verify that I have permission from the master artisan (or their immediate family) to submit their name, craft history, and workshop details to the Kashmir Heritage Craft Archive for public verification.
                    </span>
                  </label>
                  {getFieldError('consentGiven')}
                </div>

              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full py-4 bg-brand-primary text-white font-black text-lg rounded-xl hover:bg-brand-secondary transition shadow-xl mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (
                <><FaSpinner className="animate-spin inline mr-2" /> {uploadProgress ? "Uploading Photo..." : "Submitting Nomination..."}</>
              ) : (
                "Submit Artisan Nomination"
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
"""

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content[:idx] + new_return)
