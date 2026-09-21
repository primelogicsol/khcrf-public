import re

path1 = 'frontend/src/components/forms/StakeholderProfileForm.tsx'
with open(path1, 'r', encoding='utf-8') as f:
    content1 = f.read()

content1 = content1.replace(
    "import { PARTICIPANT_CATEGORIES } from '@/lib/skc/participant-categories';",
    "import { INDIVIDUAL_CATEGORIES } from '@/lib/skc/participant-categories';"
)
content1 = content1.replace(
    "{PARTICIPANT_CATEGORIES.map(cat => (",
    "{INDIVIDUAL_CATEGORIES.map(cat => ("
)
with open(path1, 'w', encoding='utf-8') as f:
    f.write(content1)

path2 = 'frontend/src/components/forms/InstitutionRegistrationForm.tsx'
with open(path2, 'r', encoding='utf-8') as f:
    content2 = f.read()

content2 = content2.replace(
    "import { PARTICIPANT_CATEGORIES } from '@/lib/skc/participant-categories';",
    "import { INSTITUTIONAL_CATEGORIES } from '@/lib/skc/participant-categories';"
)
content2 = content2.replace(
    "{PARTICIPANT_CATEGORIES.map(cat => (",
    "{INSTITUTIONAL_CATEGORIES.map(cat => ("
)
with open(path2, 'w', encoding='utf-8') as f:
    f.write(content2)

print("Forms updated")
