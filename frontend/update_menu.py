import os
import re

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\components\Navbar.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_submenu = '''        submenu: [
          { name: "Current Assessment 2026", href: "/state-of-kashmir-crafts/current-assessment-2026" },
          { name: "About the Initiative", href: "/state-of-kashmir-crafts/about" },
          { name: "Governance Framework", href: "/state-of-kashmir-crafts/governance-framework" },
          { name: "Methodology", href: "/state-of-kashmir-crafts/methodology" },
          { name: "Advisory Council", href: "/state-of-kashmir-crafts/advisory-council" },
          { name: "Official Messages", href: "/state-of-kashmir-crafts/official-messages" },
          { name: "Participating Institutions", href: "/state-of-kashmir-crafts/participating-institutions" },
          { name: "Stakeholder Registry", href: "/state-of-kashmir-crafts/stakeholder-registry" },
          { name: "Participate", href: "/state-of-kashmir-crafts/participate" },
          { name: "Consultation Tracker", href: "/state-of-kashmir-crafts/consultation-tracker" },
          { name: "Public Hearings", href: "/state-of-kashmir-crafts/public-hearings" },
          { name: "Evidence Repository", href: "/state-of-kashmir-crafts/evidence-repository" },
          { name: "Draft Findings", href: "/state-of-kashmir-crafts/draft-findings" },
          { name: "Validation Round", href: "/state-of-kashmir-crafts/validation-round" },
          { name: "Expert Review", href: "/state-of-kashmir-crafts/expert-review" },
          { name: "Final Report", href: "/state-of-kashmir-crafts/final-report" },
          { name: "Reports Archive", href: "/state-of-kashmir-crafts/reports-archive" },
          { name: "Media Center", href: "/state-of-kashmir-crafts/media-center" },
          { name: "Become a Fellow", href: "/state-of-kashmir-crafts/become-a-fellow" },
          { name: "FAQ", href: "/state-of-kashmir-crafts/faq" },
        ],'''

content = re.sub(r'submenu: \[\s*\{\s*name: "Current Assessment 2026".*?\],', new_submenu, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
