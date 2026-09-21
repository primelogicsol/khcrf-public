import re

with open('frontend/src/app/(main)/master-artisans/artisans/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add activeView state
state_match = re.search(r'const \[searchQuery, setSearchQuery\] = useState\(\'\'\);', content)
if state_match:
    content = content.replace(state_match.group(0), "const [activeView, setActiveView] = useState('ALL');\n  const [searchQuery, setSearchQuery] = useState('');")

# 2. Add activeView to useEffect dependencies
dep_match = re.search(r'\}, \[filters, searchQuery\]\);', content)
if dep_match:
    content = content.replace(dep_match.group(0), '}, [filters, searchQuery, activeView]);')

# 3. Add view parameter to fetchArtisans
fetch_match = re.search(r'if \(searchQuery\)', content)
if fetch_match:
    content = content.replace(fetch_match.group(0), "if (activeView !== 'ALL') queryParams.append('view', activeView);\n      if (searchQuery)")

# 4. Insert Top Tabs between Hero and Sidebar
tabs_ui = """
      <div className="container-fluid mx-auto px-4 md:px-10 mt-8 mb-4">
        <h1 className="text-2xl md:text-3xl font-serif text-[#3E2723] mb-6">MASTER ARTISAN REGISTRY</h1>
        <div className="flex flex-wrap gap-2 md:gap-4 border-b border-[#3E2723]/10 pb-4">
          {[
            { id: 'ALL', label: 'All Records' },
            { id: 'MASTER_ARTISAN', label: 'Master Artisans' },
            { id: 'LIVING_MASTER', label: 'Living Masters' },
            { id: 'HISTORICAL_MASTER', label: 'Historical Masters' },
            { id: 'WOMEN_ARTISAN', label: 'Women Artisans' },
            { id: 'EMERGING_ARTISAN', label: 'Emerging Artisans' },
            { id: 'APPRENTICE', label: 'Apprentices' },
            { id: 'WORKSHOP_COMMUNITY', label: 'Workshop Communities' }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => { setActiveView(view.id); setCurrentPage(1); }}
              className={px-4 py-2 text-sm font-medium transition-colors }
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>
"""
hero_match = re.search(r'(<UniversalEditorialHero.*?/>)', content)
if hero_match:
    content = content.replace(hero_match.group(1), hero_match.group(1) + tabs_ui)

with open('frontend/src/app/(main)/master-artisans/artisans/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("page.tsx patched successfully")
