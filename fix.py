import re
f=open('frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx', 'r', encoding='utf-8')
content=f.read()
f.close()
content=re.sub(r"!\[\'PUBLIC_HEARING\',\s*\'THEMATIC_CONSULTATION\',\s*\'SUBMISSION_DEADLINE\'\]\.includes\(h\.eventType\)", "!(h.isFormalHearing || ['THEMATIC_CONSULTATION', 'SUBMISSION_DEADLINE'].includes(h.eventType))", content)
f=open('frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx', 'w', encoding='utf-8')
f.write(content)
f.close()
