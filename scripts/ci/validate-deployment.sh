#!/bin/bash
set -euo pipefail

# scripts/ci/validate-deployment.sh
# Validates basic script syntax and Docker compose file before deployment

echo "Validating deployment scripts..."
# Bash syntax check for all CI scripts
for script in scripts/ci/*.sh; do
    bash -n "$script"
done

echo "Validating docker-compose.yml..."
# Just a basic existence and syntax check if docker compose is available locally
if command -v docker >/dev/null; then
    docker compose config -q || exit 1
fi

echo "Validation successful."
exit 0
