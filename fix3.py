import re
f=open('frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx', 'r', encoding='utf-8')
content=f.read()
f.close()
# 1. distHearings
content = content.replace("filteredHearings.filter(h => h.district === dist && h.eventType === 'PUBLIC_HEARING')", "filteredHearings.filter((h: any) => h.district === dist && h.isFormalHearing)")
# 2. Formal Hearings Card
content = content.replace("filteredHearings.filter((h: any) => h.eventType === 'PUBLIC_HEARING' && h.isFormalHearing).length", "filteredHearings.filter((h: any) => h.isFormalHearing).length")
# 3. Other Milestones Card
content = content.replace("!['PUBLIC_HEARING', 'THEMATIC_CONSULTATION', 'SUBMISSION_DEADLINE'].includes(h.eventType)", "!(h.isFormalHearing || ['THEMATIC_CONSULTATION', 'SUBMISSION_DEADLINE'].includes(h.eventType))")

f=open('frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx', 'w', encoding='utf-8')
f.write(content)
f.close()
