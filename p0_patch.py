import os
import re

def process_file(filepath, replacements):
    if not os.path.exists(filepath):
        print(f"Skipping {filepath} (does not exist)")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)
        
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes in {filepath}")

# 1. AssessmentTimelineClient.tsx
at_replacements = [
    (r"10 of 10", "Planned District Coverage: 10 of 10"),
    (r"\{overview\?\.contributorsCount \|\| '1,423'\}", "{overview?.contributorsCount || 'Not yet published'}"),
    (r"\{overview\?\.submissionsCount \|\| '638'\}", "{overview?.submissionsCount || 'Not yet published'}"),
    (r"\{overview\?\.recommendationsCount \|\| '217'\}", "{overview?.recommendationsCount || 'Not yet published'}"),
]

process_file("frontend/src/app/(main)/state-of-kashmir-crafts/assessment-timeline/AssessmentTimelineClient.tsx", at_replacements)

# 2. ConsultationTrackerClient.tsx
ct_replacements = [
    (r"\{overview\?\.approvedParticipantsCount \|\| 65\}", "{overview?.approvedParticipantsCount || 'Not yet published'}"),
    (r'"Registration Open"', '"Scheduled"'),
    (r"'Registration Open'", "'Scheduled'"),
]

process_file("frontend/src/app/(main)/state-of-kashmir-crafts/consultation-tracker/ConsultationTrackerClient.tsx", ct_replacements)

# 3. PublicHearingsPage (page.tsx)
ph_replacements = [
    (r"const \[currentPhase, setCurrentPhase\] = useState<string>\('Public Inquiry & Evidence Collection'\);", 
     "import { SKC_PUBLIC_STATE } from '@/config/skc_prelaunch';\n  const [currentPhase, setCurrentPhase] = useState<string>(SKC_PUBLIC_STATE.currentPhase);"),
    (r"<span className=\"text-gray-400\">Registration Open:</span>", "<span className=\"text-gray-400\">Registration Open:</span>"),
    (r"<span className=\"text-brand-secondary\">10 of 10</span>", "<span className=\"text-brand-secondary\">Planned 10 of 10</span>"),
    (r"Written Testimonies \(638\)", "Written Testimonies (Not yet published)"),
    (r"'Registration Open'", "'Scheduled'"),
    (r'"Registration Open"', '"Scheduled"'),
]

process_file("frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx", ph_replacements)

# 4. ValidationRoundClient.tsx
vr_replacements = [
    (r"<h2 className=\"text-2xl font-black text-brand-dark mb-6\">Live Validation Feed</h2>", 
     "<h2 className=\"text-2xl font-black text-brand-dark mb-6\">Live Validation Feed</h2>\n                 <p className=\"text-gray-500 mb-6\">Validation has not opened. Official validation activity will appear after draft findings are published and the formal validation round begins.</p>"),
]

process_file("frontend/src/app/(main)/state-of-kashmir-crafts/validation-round/ValidationRoundClient.tsx", vr_replacements)

# Fix CurrentAssessmentClient.tsx Phase manually
ca_replacements = [
    (r"const \[currentPhase, setCurrentPhase\] = useState\('Public Inquiry & Evidence Collection'\);", 
     "import { SKC_PUBLIC_STATE } from '@/config/skc_prelaunch';\n  const [currentPhase, setCurrentPhase] = useState(SKC_PUBLIC_STATE.currentPhase);"),
]
process_file("frontend/src/app/(main)/state-of-kashmir-crafts/current-assessment-2026/CurrentAssessmentClient.tsx", ca_replacements)

print("Done")
