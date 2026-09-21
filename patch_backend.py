import re

with open('backend/src/controllers/masterArtisanController.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Add logic for 'view' in getAll
logic = """
      const { craft, search, district, period, recognition, verification, status, view } = req.query;
      
      const where: any = {};
      
      if (view && view !== 'ALL') {
        if (view === 'LIVING_MASTER') {
          where.status = 'Living';
        } else if (view === 'HISTORICAL_MASTER') {
          where.status = { in: ['Deceased', 'Historical', 'Unknown'] };
        } else if (view === 'WOMEN_ARTISAN') {
          where.gender = { in: ['Female', 'FEMALE', 'female'] };
        } else if (view === 'EMERGING_ARTISAN') {
          where.practice_status = { in: ['Emerging', 'EMERGING'] };
        } else if (view === 'APPRENTICE') {
          where.lineagesAsMember = { some: { relationship_type: { in: ['Apprentice', 'APPRENTICE'] } } };
        } else if (view === 'WORKSHOP_COMMUNITY') {
          where.lineagesAsMember = { some: { relationship_type: { in: ['Workshop Member', 'WORKSHOP_MEMBER'] } } };
        }
      }
"""

old_logic = "const { craft, search, district, period, recognition, verification, status } = req.query;\n      \n      const where: any = {};"
if old_logic in content:
    content = content.replace(old_logic, logic)

with open('backend/src/controllers/masterArtisanController.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("backend controller patched successfully")
