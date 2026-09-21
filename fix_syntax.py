import re

with open('frontend/src/app/(main)/master-artisans/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("href={/master-artisans/artisans?craftId=}", "href={/master-artisans/artisans?craftId=}")
content = content.replace("href={/master-artisans/artisans?district=}", "href={/master-artisans/artisans?district=}")

with open('frontend/src/app/(main)/master-artisans/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed syntax errors in page.tsx")
