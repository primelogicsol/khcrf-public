#!/bin/sh
set -eu

echo "Waiting for PostgreSQL..."

until pg_isready \
  -h "${POSTGRES_HOST:-postgres_db}" \
  -p "${POSTGRES_PORT:-5432}" \
  -U "${POSTGRES_USER:-govtech}" \
  -d "${POSTGRES_DB:-hcrf_db}"
do
  echo "Database not ready; retrying in 2 seconds..."
  sleep 2
done

echo "PostgreSQL is ready."

echo "Running migrations..."
npx prisma migrate deploy

# Seeding should be handled via explicit tasks or compiled JS, not via dynamic 'npx tsx' downloads on startup.
# echo "Seeding canonical 2026 SKC Public Hearings..."
# node dist/prisma/seedCanonical2026.js || echo "SKC Canonical seeding completed/bypassed."

echo "Migrations completed successfully."

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "Running seed..."
  npx prisma db seed
fi

echo "Starting backend..."
exec npm start