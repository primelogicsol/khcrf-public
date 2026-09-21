import re

with open('frontend/src/app/(main)/master-artisans/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports if they don't exist
if 'UniversalEditorialHero' not in content:
    content = content.replace("import React, { useEffect, useState } from 'react';", "import React, { useEffect, useState } from 'react';\nimport UniversalEditorialHero from '@/components/hero/UniversalEditorialHero';\nimport { masterArtisansHeroFallback } from '@/config/heroFallbacks';")

# The existing hero section starts with: <section className="bg-[#3E2723] text-white py-20 px-6">
hero_regex = r'<section className="bg-\[#3E2723\] text-white py-20 px-6">.*?</section>'
replacement = """<UniversalEditorialHero
        pageKey="master-artisans"
        fallbackConfig={masterArtisansHeroFallback}
      />"""

content = re.sub(hero_regex, replacement, content, flags=re.DOTALL)

with open('frontend/src/app/(main)/master-artisans/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Hero replacement done")
