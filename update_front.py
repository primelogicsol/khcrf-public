import re

with open('frontend/src/app/(main)/master-artisans/artisans/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the craft options
craft_replacement = """craftId: { label: 'GI Craft', options: [
      {value: 'ALL', label: 'All'},
      {value: '1046', label: 'Kashmir Chain Stitch Embroidery'},
      {value: '1047', label: 'Kashmir Crewel Embroidery'},
      {value: '902', label: 'Kashmir Gabba'},
      {value: '868', label: 'Kashmir Namda'},
      {value: '1048', label: 'Kashmir Tweed'},
      {value: '869', label: 'Kashmir Wagoo'},
      {value: '903', label: 'Kashmir Willow Bat'},
      {value: '527', label: 'Kashmir Hand-Knotted Carpet'},
      {value: '204', label: 'Kashmir Khatamband'},
      {value: '181', label: 'Kashmir Paper Machie'},
      {value: '182', label: 'Kashmir Walnut Wood Carving'},
      {value: '51', label: 'Kashmir Kani Shawl'},
      {value: '46', label: 'Kashmir Pashmina'},
      {value: '48', label: 'Kashmir Sozani Embroidery'}
    ] },"""

content = re.sub(r'craftId: \{ label: \'GI Craft\', options: \[.*?\] \},', craft_replacement, content, flags=re.DOTALL)

with open('frontend/src/app/(main)/master-artisans/artisans/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Frontend crafts updated")
