import re

with open('backend/src/controllers/masterArtisanController.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Update extracted variables
new_query_vars = "const { craftId, search, district, period, recognition, verification, status, reconciliationStatus, evidenceGrade, documentation, view } = req.query;"
content = re.sub(r'const \{ .*? \} = req\.query;', new_query_vars, content)

# Update craft filter
content = re.sub(r'if \(craft && craft !== \'All\'\) \{.*?\}', '', content, flags=re.DOTALL)
craft_logic = """
      if (craftId && craftId !== 'ALL') {
        where.primary_craft = { gi_application_no: String(craftId) };
      }
"""
content = content.replace("const where: any = {};", "const where: any = {};\n" + craft_logic)

# Update district filter
content = re.sub(r'if \(district && district !== \'All\'\) \{.*?\}', '', content, flags=re.DOTALL)
district_logic = """
      if (district && district !== 'ALL') {
        // District values are now uppercase codes like 'SRINAGAR'
        where.district = { equals: String(district), mode: 'insensitive' };
      }
"""
content = content.replace(craft_logic, craft_logic + district_logic)

# Update status filter
content = re.sub(r'if \(status && status !== \'All\'\) \{.*?\}', '', content, flags=re.DOTALL)
status_logic = """
      if (status && status !== 'ALL') {
        where.status = { equals: String(status), mode: 'insensitive' };
      }
"""
content = content.replace(district_logic, district_logic + status_logic)

# Re-insert verification if it was removed by the regex or just replace it
verification_regex = r'if \(verification && verification !== \'All\'\) \{.*?\}'
new_verification_logic = """
      if (verification && verification !== 'ALL') {
        if (verification === 'GOVT_AWARD') where.awards = { some: {} };
        if (verification === 'GOVT_REG') where.identifiers = { some: {} };
        if (verification === 'PEHCHAN') where.pehchan_verified = true;
        if (verification === 'GI_AU') where.gi_verified = true;
        if (verification === 'KHCRF') where.khcrf_verified = true;
      }
"""
if re.search(verification_regex, content, flags=re.DOTALL):
    content = re.sub(verification_regex, new_verification_logic.strip(), content, flags=re.DOTALL)
else:
    content = content.replace(status_logic, status_logic + "\n" + new_verification_logic)

with open('backend/src/controllers/masterArtisanController.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Backend patched")
