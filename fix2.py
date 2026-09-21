import re
f=open('frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx', 'r', encoding='utf-8')
content=f.read()
f.close()
content=content.replace("<strong>12 Formal Hearings:</strong> 10 In-Person Hearings • 2 Online Hearings • 5 Districts Hosting In-Person Hearings", "<strong>{filteredHearings.filter((h: any) => h.isFormalHearing).length} Formal Consultations:</strong> {filteredHearings.filter((h: any) => h.isFormalHearing && h.mode !== 'Online').length} In-Person • {filteredHearings.filter((h: any) => h.isFormalHearing && h.mode === 'Online').length} Online • {new Set(filteredHearings.filter((h: any) => h.isFormalHearing && h.mode !== 'Online').map((h: any) => h.district)).size} Districts Hosting In-Person Consultations")
f=open('frontend/src/app/(main)/state-of-kashmir-crafts/public-hearings/page.tsx', 'w', encoding='utf-8')
f.write(content)
f.close()
