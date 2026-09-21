import re

filepath = '../frontend/src/app/(main)/master-artisans/artisans/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import_stmt = "import { WorkshopCommunitiesView } from './WorkshopCommunitiesView';\n"
if 'WorkshopCommunitiesView' not in content:
    content = re.sub(r'(import .*?;?\n)', r'\1' + import_stmt, content, count=1)

table_start = '<div className="bg-white rounded-sm shadow-sm border border-[#3E2723]/10 overflow-hidden">'
replacement = f'''
          {{activeView === 'WORKSHOP_COMMUNITY' ? (
            <WorkshopCommunitiesView data={{allMasters}} />
          ) : (
            {table_start}
'''

pagination_start = '{/* Pagination */}'
pagination_replacement = '''
          )}
          {/* Pagination */}
'''

if 'activeView === \\\'WORKSHOP_COMMUNITY\\\'' not in content:
    content = content.replace(table_start, replacement, 1)
    content = content.replace(pagination_start, pagination_replacement, 1)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("page.tsx patched successfully.")
