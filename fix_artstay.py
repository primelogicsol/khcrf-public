import re
with open('frontend/src/config/ecosystemPartners.ts', 'r', encoding='utf-8') as f:
  c = f.read()
c = re.sub(r'orgName:\s*"(ArtStay [A-Z]{3}) - [^"]+"', r'orgName: "\1"', c)
with open('frontend/src/config/ecosystemPartners.ts', 'w', encoding='utf-8') as f:
  f.write(c)
print('Done')
