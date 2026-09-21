import re

# Fix public-hearings/page.tsx
path1 = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx'
with open(path1, 'r', encoding='utf-8') as f:
    content = f.read()

if 'PARTICIPANT_CATEGORIES' not in content:
    content = content.replace(
        'import React, { useState, useEffect } from "react";',
        'import React, { useState, useEffect } from "react";\nimport { PARTICIPANT_CATEGORIES } from "@/lib/skc/participant-categories";'
    )

content = re.sub(
    r'const \[stakeholders, setStakeholders\] = useState<string\[\]>\(\[.*?\]\);',
    'const [stakeholders, setStakeholders] = useState<string[]>([...PARTICIPANT_CATEGORIES]);',
    content
)

with open(path1, 'w', encoding='utf-8') as f:
    f.write(content)


# Fix HearingSubscriptionModal.tsx
path2 = 'frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/components/HearingSubscriptionModal.tsx'
with open(path2, 'r', encoding='utf-8') as f:
    content2 = f.read()

if 'PARTICIPANT_CATEGORIES' not in content2:
    content2 = content2.replace(
        'import React, { useState } from "react";',
        'import React, { useState } from "react";\nimport { PARTICIPANT_CATEGORIES } from "@/lib/skc/participant-categories";'
    )

content2 = re.sub(
    r'const STAKEHOLDERS = \[[^\]]*\];',
    'const STAKEHOLDERS = PARTICIPANT_CATEGORIES;',
    content2
)

with open(path2, 'w', encoding='utf-8') as f:
    f.write(content2)

print("Public hearings categories fixed.")
