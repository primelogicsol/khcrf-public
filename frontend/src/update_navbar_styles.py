import os

filepath = 'components/Navbar.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_name = '''                <span className="text-lg">
                  Kashmir Hamadan Craft Revival Foundation
                </span>'''
new_name = '''                <span className="text-lg khcrf-foundation-name">
                  Kashmir Hamadan Craft Revival Foundation
                </span>'''

old_tagline = '''                <span className="italic">
                  A Kashmir Craft Policy Think Tank - Shaping the Future of
                  Artisans
                </span>'''
new_tagline = '''                <span className="khcrf-tagline">
                  A Kashmir Craft Policy Think Tank - Shaping the Future of
                  Artisans
                </span>'''

content = content.replace(old_name, new_name)
content = content.replace(old_tagline, new_tagline)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Navbar text styles")
