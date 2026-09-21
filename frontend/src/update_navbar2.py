import os

filepath = 'components/Navbar.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_code = '''                <div className="flex items-center space-x-4">
                  <Link
                    href="/about/memberships"
                    className="hover:text-[#D4AF37] transition font-bold whitespace-nowrap"
                  >
                    Join KHCRF
                  </Link>
                  {user ? ('''

new_code = '''                <div className="flex items-center gap-[14px]">
                  <Link
                    href="/about/memberships"
                    className="hover:text-[#D4AF37] transition font-bold whitespace-nowrap"
                  >
                    Join KHCRF
                  </Link>
                  <div className="khcrf-utility-divider" />
                  {user ? ('''

content = content.replace(old_code, new_code)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated Navbar utility divider")
