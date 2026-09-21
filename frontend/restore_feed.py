import os
import re

path = r'C:\Users\Fayaz\Sufipulseupdate2026\HCRF 2026\hcr_foundation_full_govind\frontend\src\app\(main)\state-of-kashmir-crafts\consultation-tracker\page.tsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the placeholder logic
content = content.replace('{activityFeed.length === 0 ? <div className="text-gray-500 font-bold ml-8">No online activities logged yet. Activity feed will populate after July 15.</div> : activityFeed.map((feed, idx) => (', '{activityFeed.map((feed, idx) => (')

# Restore the array
array_code = '''const activityFeed = [
    { date: "Oct 15, 2026", activity: "Online Public Hearing", location: "Virtual (Srinagar Focus)", group: "Artisans & Weavers", status: "Proposed" },
    { date: "Oct 12, 2026", activity: "Virtual University Consultation", location: "Online (Kashmir University)", group: "Academics", status: "Proposed" },
    { date: "Oct 10, 2026", activity: "Online District Consultation", location: "Virtual (Budgam Focus)", group: "Mixed Stakeholders", status: "Proposed" },
    { date: "Oct 08, 2026", activity: "Evidence Submission Received", location: "Online Portal", group: "Export Association", status: "Proposed" },
    { date: "Oct 05, 2026", activity: "Virtual Artisan Focus Group", location: "Virtual (Pampore)", group: "Women Entrepreneurs", status: "Proposed" }
];'''

content = re.sub(r'const activityFeed: any\[\] = \[\];', array_code, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
