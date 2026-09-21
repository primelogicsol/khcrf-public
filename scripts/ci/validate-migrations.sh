#!/bin/bash
set -euo pipefail

MIGRATION_DIR="backend/prisma/migrations"
FAILED=0

echo "Validating migrations in $MIGRATION_DIR..."

for MIGRATION_FILE in $(find "$MIGRATION_DIR" -type f -name "migration.sql" | sort); do
  # Check if empty
  if [ ! -s "$MIGRATION_FILE" ]; then
    echo "ERROR: $MIGRATION_FILE is empty."
    FAILED=1
    continue
  fi

  # Check for null bytes
  if grep -qP "\x00" "$MIGRATION_FILE"; then
    echo "ERROR: $MIGRATION_FILE contains null bytes (likely UTF-16 encoded)."
    FAILED=1
  fi

  # Check for valid UTF-8
  if ! iconv -f UTF-8 -t UTF-8 "$MIGRATION_FILE" >/dev/null 2>&1; then
    echo "ERROR: $MIGRATION_FILE is not valid UTF-8."
    FAILED=1
  fi
  
  # Check for UTF-8 BOM
  if head -c 3 "$MIGRATION_FILE" | grep -q $'\xEF\xBB\xBF'; then
    echo "ERROR: $MIGRATION_FILE contains a UTF-8 BOM."
    FAILED=1
  fi
  
  # Check for merge conflict markers
  if grep -q "^<<<<<<< " "$MIGRATION_FILE"; then
    echo "ERROR: $MIGRATION_FILE contains merge conflict markers."
    FAILED=1
  fi
done

if [ $FAILED -ne 0 ]; then
  echo "Migration validation failed!"
  exit 1
fi

echo "All migration files are non-empty UTF-8 without BOM or null bytes."
exit 0
