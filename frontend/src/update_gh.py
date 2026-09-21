import os

filepath = 'components/layout/GlobalHeader.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

old_code = '''            <div className="flex items-center gap-4 shrink-0 whitespace-nowrap justify-self-end">
              <Link
                href="/about/memberships"
                className="hover:text-icon-on-light transition font-bold whitespace-nowrap"
              >
                Join KHCRF
              </Link>
              {user ? ('''

new_code = '''            <div className="flex items-center gap-[14px] shrink-0 whitespace-nowrap justify-self-end">
              <Link
                href="/about/memberships"
                className="hover:text-icon-on-light transition font-bold whitespace-nowrap"
              >
                Join KHCRF
              </Link>
              <div className="khcrf-utility-divider" />
              {user ? ('''

content = content.replace(old_code, new_code)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated GlobalHeader utility divider")
