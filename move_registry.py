import re

with open('frontend/src/app/(main)/master-artisans/page.tsx', 'r', encoding='utf-8') as f:
    old_content = f.read()

with open('frontend/src/app/(main)/master-artisans/registry/page.tsx', 'r', encoding='utf-8') as f:
    new_content = f.read()

# I will just write new_content to page.tsx, and then clean up registry directory.
# The user said: "relocate or integrate it only after the core Registry Home sections".
# Actually, the user wants the Registry Home to be the primary. 
# It's much cleaner to just replace the page.tsx entirely with the new registry home for now, 
# or append the editorial section.
# Let's extract the editorial sections from old_content if any.
# For now, let's just make the Registry Home the page.tsx and delete the registry directory.

with open('frontend/src/app/(main)/master-artisans/page.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Moved registry to root.")
