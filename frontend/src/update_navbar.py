import os

filepath = 'components/Navbar.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_pipe = '''                <span className="text-shadow-blue-300 text-2xl font-light">
                  |
                </span>'''
new_pipe = '''                <div className="khcrf-header-divider" />'''

content = content.replace(old_pipe, new_pipe)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Navbar")
