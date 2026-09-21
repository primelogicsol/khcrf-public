import re

with open('backend/src/routes/masterArtisanRoutes.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("router.get('/', MasterArtisanController.getAll);", "router.get('/stats', MasterArtisanController.getStats);\nrouter.get('/', MasterArtisanController.getAll);")

with open('backend/src/routes/masterArtisanRoutes.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added /stats to routes")
