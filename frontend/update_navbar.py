import sys

with open('src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<div className="container-fluid mx-auto px-4 md:px-10 flex justify-between items-center">',
    '<div className="container-fluid mx-auto">\n          <div className="flex justify-end">\n            <div className="w-full lg:w-[85%] px-4 md:px-10 flex justify-between items-center">'
)

nav_close_idx = content.find('</nav>')
if nav_close_idx != -1:
    content = content[:nav_close_idx] + '          </div>\n        </div>\n      ' + content[nav_close_idx:]

content = content.replace(
    'Donate<span className="hidden sm:inline"> Now</span>',
    'DONATE'
)

content = content.replace(
    '<FaHeart className="text-xs" /> Donate',
    '<FaHeart className="text-xs" /> DONATE'
)

with open('src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed')
