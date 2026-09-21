import re

with open('scripts/seed_test_artisans.ts', 'r', encoding='utf-8') as f:
    content = f.read()

cleanup = "  await prisma.masterArtisan.deleteMany({ where: { khcrf_master_id: { startsWith: 'KHCRF-MA-10' } } });\n"
content = content.replace("console.log('Seeding 15 varied test artisans...');\n", "console.log('Seeding 15 varied test artisans...');\n" + cleanup)

with open('scripts/seed_test_artisans.ts', 'w', encoding='utf-8') as f:
    f.write(content)

