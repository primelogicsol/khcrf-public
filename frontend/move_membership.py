import sys

with open('src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the old membership block from the main navigation
old_membership_block = """            <Link
              href="/about/memberships"
              className="hidden lg:flex flex-col items-end group"
            >
              <span className="text-[10px] uppercase font-bold text-gray-400">
                Join us now
              </span>
              <span className="text-sm font-bold text-brand-dark group-hover:text-brand-primary transition">
                Become a Member
              </span>
            </Link>
"""
if old_membership_block in content:
    content = content.replace(old_membership_block, '')
else:
    print('Could not find the old membership block!')
    sys.exit(1)


# 2. Add the new 'Join HCRF' link to the top bar
top_bar_target = """                <div className="flex items-center space-x-4">
                  {user ? ("""

new_top_bar_content = """                <div className="flex items-center space-x-4">
                  <Link
                    href="/about/memberships"
                    className="hover:text-[#D4AF37] transition font-bold"
                  >
                    Join HCRF
                  </Link>
                  {user ? ("""

if top_bar_target in content:
    content = content.replace(top_bar_target, new_top_bar_content)
else:
    print('Could not find the top bar target!')
    sys.exit(1)

with open('src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
