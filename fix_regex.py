import re

with open('frontend/src/app/(main)/master-artisans/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'href=\{/master-artisans/artisans\?craftId=\}', 'href={/master-artisans/artisans?craftId=}', content)
content = re.sub(r'href=\{/master-artisans/artisans\?district=\}', 'href={/master-artisans/artisans?district=}', content)

with open('frontend/src/app/(main)/master-artisans/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Regex replace done")
