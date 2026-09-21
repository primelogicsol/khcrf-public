import re

with open('frontend/src/config/heroFallbacks.ts', 'r', encoding='utf-8') as f:
    content = f.read()

fallback_replacement = """export const masterArtisansHeroFallback = {
  id: 'fallback-ma',
  accentColor: 'var(--khcrf-brown)',
  pageKey: 'master-artisans',
  autoplayEnabled: true,
  autoplayIntervalMs: 8000,
  animationEnabled: true,
  reducedMotionFallback: true,
  slides: [
    {
      id: 'ma-1',
      metadata: { noMedia: true },
      internalName: 'Living Archive',
      titleLineOne: 'MASTER ARTISAN',
      titleConnector: '',
      titleLineTwo: 'REGISTRY',
      description: 'Preserving the People Behind Kashmir\\'s Craft Heritage. An evidence-based registry documenting master artisans, government recognition, craft lineages, apprentices and living knowledge across Kashmir\\'s 14 GI craft traditions.',
      primaryCtaLabel: 'Explore the Registry',
      primaryCtaUrl: '/master-artisans/artisans',
      secondaryCtaLabel: 'Nominate an Artisan',
      secondaryCtaUrl: '/master-artisans/nominate',
      meta1: 'KHCRF LIVING HERITAGE ARCHIVE',
      meta2: 'Evidence-Based',
      meta3: '14 GI Crafts',
      meta4: '10 Districts',
    },
"""

content = re.sub(r"export const masterArtisansHeroFallback = \{.*?(?=\n    \{)", fallback_replacement, content, flags=re.DOTALL)

with open('frontend/src/config/heroFallbacks.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated hero fallback config.")
