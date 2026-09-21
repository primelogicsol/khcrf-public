#!/bin/bash
set -e

echo "========================================================"
echo "  KHCRF Admin Credential Change — $(date)"
echo "========================================================"

if ! docker compose ps backend &> /dev/null; then
  echo "ERROR: Backend container not running. Run: docker compose up -d"
  exit 1
fi

docker compose exec backend sh -c 'cat > /app/change-admin.js << "EOF"
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const NEW_EMAIL = "fk.envcal@gmail.com";
const NEW_PASSWORD = "Khcrf12345678987654321%";
const OLD_EMAILS = ["ankumishra773@gmail.com", "hcrfadmin@email.com"];

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  let admin = null;
  for (const email of OLD_EMAILS) {
    admin = await prisma.user.findUnique({ where: { email } });
    if (admin) { console.log("Found admin by email:", email); break; }
  }
  if (!admin) {
    admin = await prisma.user.findFirst({ where: { isAdmin: true } });
    if (admin) console.log("Found admin by isAdmin flag:", admin.email);
  }

  const hashed = await bcrypt.hash(NEW_PASSWORD, 10);

  if (admin) {
    await prisma.user.update({
      where: { id: admin.id },
      data: { email: NEW_EMAIL, password: hashed, isAdmin: true, isVerified: true }
    });
    console.log("Admin UPDATED successfully!");
  } else {
    await prisma.user.create({
      data: { name: "Admin", email: NEW_EMAIL, password: hashed, isAdmin: true, isVerified: true }
    });
    console.log("Admin CREATED successfully!");
  }
  console.log("  Email: " + NEW_EMAIL);

  await prisma.$disconnect();
  await pool.end();
}

main().catch(e => { console.error("ERROR:", e.message); process.exit(1); });
EOF'

echo ">>> Running..."
docker compose exec backend sh -c "cd /app && node change-admin.js"

echo ""
echo "========================================================"
echo "  DONE — Admin credentials changed!"
echo "========================================================"
echo "  Email:    fk.envcal@gmail.com"
echo "  Password: Khcrf12345678987654321%"
echo "========================================================"
