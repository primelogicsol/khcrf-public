import re

with open('artstay_raw.txt', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

blocks = re.split(r'\n(?=\d+\) )', '\n' + text)[1:]

entries = []

for block in blocks:
    name = re.search(r'NAME\n(.*?)\n', block).group(1).strip()
    status = re.search(r'STATUS\n(.*?)\n', block).group(1).strip()
    country = re.search(r'COUNTRY\n(.*?)\n', block).group(1).strip()
    
    collab_type_match = re.search(r'COLLABORATION TYPE\n(.*?)\nENGAGEMENT DESCRIPTION', block, re.DOTALL)
    collab_type = [line.strip() for line in collab_type_match.group(1).strip().split('\n') if line.strip()]
    
    engagement = re.search(r'ENGAGEMENT DESCRIPTION\n(.*?)\nAREAS OF COLLABORATION', block, re.DOTALL).group(1).replace('\n', ' ').strip()
    
    areas_match = re.search(r'AREAS OF COLLABORATION\n(.*?)\nCONNECT', block, re.DOTALL)
    areas = [line.strip() for line in areas_match.group(1).strip().split('\n') if line.strip()]
    
    ref_id = re.search(r'REFERENCE ID\n(.*?)$', block, re.DOTALL).group(1).strip()
    
    entry = f'''  {{
    id: "{ref_id}",
    orgName: "{name}",
    status: "{status}",
    country: "{country}",
    collaborationType: {collab_type},
    collaborationAreas: {areas},
    projectDescription: "{engagement}"
  }}'''
    entries.append(entry)

entries_str = ',\n'.join(entries)

file_path = 'frontend/src/config/ecosystemPartners.ts'
with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Find the end of the ECOSYSTEM_PARTNERS array
# Assuming it ends with ]; at the end of the file or similar
if '];' in content:
    parts = content.rsplit('];', 1)
    # Ensure there's a comma if the array isn't empty before appending
    if not parts[0].strip().endswith(','):
        new_content = parts[0] + ',\n' + entries_str + '\n];' + parts[1]
    else:
        new_content = parts[0] + '\n' + entries_str + '\n];' + parts[1]
        
    with open(file_path, 'w', encoding='utf-8', errors='ignore') as f:
        f.write(new_content)
    print("Successfully appended ArtStay records.")
else:
    print("Could not find array end '];'")
