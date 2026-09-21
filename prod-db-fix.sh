#!/bin/bash
# =========================================================================
# KHCRF Production Database Fix Script
# =========================================================================
# Run this ON the VPS as root or the Docker/sudo user.
# Usage: bash prod-db-fix.sh
#
# What this does:
#   1. Prints current DATABASE_URL from the .env the backend container uses
#   2. Checks if the backend container is running and what DB it points to
#   3. Runs prisma migrate deploy INSIDE the backend container
#   4. Counts rows in the Publication table
#   5. If count == 0, runs the seed script inside the container
#   6. Rebuilds & repulls images if needed
#   7. Restarts all services
# =========================================================================

set -e
COMPOSE_DIR="/opt/hcrf"   # <-- CHANGE THIS to the actual path on your VPS

echo ""
echo "========================================================"
echo "  KHCRF Production DB Fix — $(date)"
echo "========================================================"
echo ""

cd "$COMPOSE_DIR"

# ── STEP 1: Show .env DATABASE_URL ──────────────────────────────────────────
echo ">>> [1/8] Production .env DATABASE_URL:"
grep "DATABASE_URL" .env || echo "  WARNING: DATABASE_URL not found in .env"
echo ""

# ── STEP 2: Container status ──────────────────────────────────────────────────
echo ">>> [2/8] Container status:"
docker compose ps
echo ""

# ── STEP 3: Check DB connectivity from backend container ─────────────────────
echo ">>> [3/8] Testing DB connectivity from backend container:"
docker compose exec backend sh -c 'node -e "
const { Client } = require(\"pg\");
const url = process.env.DATABASE_URL;
console.log(\"Connecting to:\", url?.replace(/:([^@]+)@/, \":***@\"));
const client = new Client({ connectionString: url });
client.connect().then(() => {
  console.log(\"DB connection: OK\");
  return client.end();
}).catch(e => {
  console.error(\"DB connection FAILED:\", e.message);
  process.exit(1);
});
"' || echo "  ERROR: Could not connect to DB from backend container"
echo ""

# ── STEP 4: Run migrations ─────────────────────────────────────────────────
echo ">>> [4/8] Running prisma migrate deploy:"
docker compose exec backend sh -c "npx prisma migrate deploy" 2>&1 | tail -30
echo ""

# ── STEP 5: Check Publication table count ────────────────────────────────────
echo ">>> [5/8] Publication table row count:"
PUB_COUNT=$(docker compose exec backend sh -c 'node -e "
const { PrismaClient } = require(\"@prisma/client\");
const prisma = new PrismaClient();
prisma.publication.count()
  .then(n => { console.log(n); prisma.\$disconnect(); })
  .catch(e => { console.error(e.message); process.exit(1); });
"' 2>/dev/null | tail -1)
echo "  Publications in production DB: $PUB_COUNT"
echo ""

# ── STEP 6: Seed if empty ─────────────────────────────────────────────────────
if [ "$PUB_COUNT" = "0" ] || [ -z "$PUB_COUNT" ]; then
  echo ">>> [6/8] DB is EMPTY — running seed script:"
  docker compose exec backend sh -c "node -e \"
    // Run seedPublications.ts compiled output
    // The seed script is compiled into dist/seedPublications.js
    require('./dist/seedPublications.js');
  \"" 2>&1 | tail -40 || \
  docker compose exec backend sh -c "
    echo 'Trying npx tsx seed...'
    npx tsx src/seedPublications.ts
  " 2>&1 | tail -40
  echo ""
  echo "  Re-checking count after seed:"
  docker compose exec backend sh -c 'node -e "
const { PrismaClient } = require(\"@prisma/client\");
const prisma = new PrismaClient();
prisma.publication.count()
  .then(n => { console.log(\"Publications after seed:\", n); prisma.\$disconnect(); })
  .catch(e => { console.error(e.message); process.exit(1); });
"' 2>/dev/null
else
  echo ">>> [6/8] DB has $PUB_COUNT publications — seed not needed."
fi
echo ""

# ── STEP 7: Verify API response ──────────────────────────────────────────────
echo ">>> [7/8] Checking API /publications response (from inside VPS):"
curl -s --max-time 10 "http://localhost:4000/api/publications" | \
  python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if isinstance(data, list):
        print(f'  API returns {len(data)} publications')
        if len(data) > 0:
            print(f'  First: {data[0].get(\"title\", \"N/A\")}')
    else:
        print('  API response:', json.dumps(data)[:200])
except Exception as e:
    print('  Could not parse response:', e)
" 2>/dev/null || echo "  Could not reach backend on :4000 from host — checking via container:"
  docker compose exec backend sh -c 'curl -s http://localhost:4000/api/publications | head -c 500'
echo ""

# ── STEP 8: Restart services ──────────────────────────────────────────────────
echo ">>> [8/8] Restarting containers to ensure clean state:"
docker compose restart backend frontend
echo ""
echo "========================================================"
echo "  Fix complete. Check https://khcrf.org/publications"
echo "========================================================"
