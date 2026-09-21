import re

# 1. Fix ParticipateClient.tsx
with open('frontend/src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

def replace_href(match):
    path = match.group(1)
    if 'state-of-kashmir-crafts/stakeholder-registry' in path:
        return f'href={{`{path}${{category ? "&category=" + encodeURIComponent(category) : ""}}`}}'
    return match.group(0)

# The pattern looks for href={/some/path?type=val}
content = re.sub(r'href=\{([^"\'`{}]+)\}', replace_href, content)

with open('frontend/src/app/(main)/state-of-kashmir-crafts/participate/ParticipateClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Fix page.tsx
with open('frontend/src/app/(main)/state-of-kashmir-crafts/stakeholder-registry/page.tsx', 'r', encoding='utf-8') as f:
    page_content = f.read()

# Remove the import from inside
page_content = re.sub(r"import \{ PARTICIPANT_CATEGORIES, normalizeCategory \} from '@\/lib\/skc\/participant-categories';\n*", "", page_content)

# Prepend it to the top right after other imports
page_content = page_content.replace(
    "import { FALLBACK_CATEGORIES",
    "import { PARTICIPANT_CATEGORIES, normalizeCategory } from '@/lib/skc/participant-categories';\nimport { FALLBACK_CATEGORIES"
)

with open('frontend/src/app/(main)/state-of-kashmir-crafts/stakeholder-registry/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_content)

print("Syntax errors fixed.")
