import os

filepath = 'partnerRoutes.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import_old = "getPartnerById"
import_new = "getPartnerById,\n    getPartnerStats"
content = content.replace(import_old, import_new)

route_old = "router.get('/registry', getPublicPartners); // Public registry list"
route_new = "router.get('/registry', getPublicPartners); // Public registry list\nrouter.get('/stats', getPartnerStats); // Dynamic stats"
content = content.replace(route_old, route_new)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Added stats route")
