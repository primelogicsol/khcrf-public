import os

filepath = 'src/app/(main)/about/partner-network/registry/RegistryClient.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

filters_old = '''        <div className="relative w-full md:w-auto min-w-[250px]">
          <div className="relative">
            <FaFilter data-ui-icon  className="absolute left-4 top-1/2 transform -translate-y-1/2 " />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary cursor-pointer font-medium text-gray-700 transition-all"
            >
              <option value="All">All Collaboration Areas</option>
              {COLLABORATION_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>'''

filters_new = '''        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative min-w-[250px]">
            <FaFilter data-ui-icon className="absolute left-4 top-1/2 transform -translate-y-1/2" />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary cursor-pointer font-medium text-gray-700 transition-all"
            >
              <option value="All">All Collaboration Areas</option>
              {COLLABORATION_AREAS.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative min-w-[250px]">
            <FaFilter data-ui-icon className="absolute left-4 top-1/2 transform -translate-y-1/2" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary cursor-pointer font-medium text-gray-700 transition-all"
            >
              <option value="All">All Network Categories</option>
              {GLOBAL_REACH_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>'''

content = content.replace(filters_old, filters_new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated filters UI")
