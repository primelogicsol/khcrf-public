#!/bin/bash
set -euo pipefail

# scripts/ci/rollback.sh
# Rolls back to the previously recorded container images

echo "Health check failed. Initiating Rollback..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

export COMPOSE_FILE="${COMPOSE_FILE:-$REPO_ROOT/docker-compose.yml}"

if [ ! -f "$REPO_ROOT/releases/${RELEASE_SHA}/previous-images.env" ]; then
    echo "ERROR: previous-images.env not found. Cannot automatically rollback."
    exit 1
fi

# shellcheck disable=SC1090
source "$REPO_ROOT/releases/${RELEASE_SHA}/previous-images.env"

# docker-compose.stage4.yml resolves images via FRONTEND_SHA and BACKEND_SHA,
# NOT via FRONTEND_IMAGE or BACKEND_IMAGE.
# Extract the tag portion (everything after the last colon) from the previous
# image references so Compose recreates containers from the correct prior image.
export SIMULATE_FRONTEND_FAILURE=false
export SIMULATE_BACKEND_FAILURE=false
export STAGE4_FAULT_INJECTION_ENABLED=false

if [ "${DEPLOY_FRONTEND:-false}" == "true" ]; then
    if [ -n "${PREVIOUS_FRONTEND_IMAGE:-}" ]; then
        PREVIOUS_FRONTEND_TAG="${PREVIOUS_FRONTEND_IMAGE##*:}"
        export FRONTEND_SHA="$PREVIOUS_FRONTEND_TAG"
        echo "Rolling back Frontend: FRONTEND_SHA=$FRONTEND_SHA (from $PREVIOUS_FRONTEND_IMAGE)"
        # Verify compose will use the correct image before bringing it up
        echo "Effective compose frontend image: $(docker compose config | grep -A1 'frontend:' | grep 'image:' || echo 'unknown')"
        docker compose up -d --no-deps frontend
        echo "Frontend rollback complete. Running container image:"
        docker compose ps --format '{{.Image}}' frontend 2>/dev/null || docker compose ps frontend
    else
        echo "No previous Frontend image recorded. Stopping Frontend container."
        docker compose rm -sf frontend
    fi
fi

if [ "${DEPLOY_BACKEND:-false}" == "true" ] || [ "${DEPLOY_PRISMA:-false}" == "true" ]; then
    if [ -n "${PREVIOUS_BACKEND_IMAGE:-}" ]; then
        PREVIOUS_BACKEND_TAG="${PREVIOUS_BACKEND_IMAGE##*:}"
        export BACKEND_SHA="$PREVIOUS_BACKEND_TAG"
        echo "Rolling back Backend: BACKEND_SHA=$BACKEND_SHA (from $PREVIOUS_BACKEND_IMAGE)"
        docker compose up -d --no-deps backend
        
        echo "Waiting for backend internal health..."
        for _ in $(seq 1 10); do
            if docker compose exec -T backend node -e "
                fetch('http://127.0.0.1:4000/api/health').then(r => { if (!r.ok) process.exit(1); process.exit(0); }).catch(() => process.exit(1))
            " >/dev/null 2>&1; then
                break
            fi
            sleep 2
        done
        
        echo "Backend rollback complete. Running container image:"
        docker compose ps --format '{{.Image}}' backend 2>/dev/null || docker compose ps backend
    else
        echo "No previous Backend image recorded. Stopping Backend container."
        docker compose rm -sf backend
    fi
fi

echo "Reloading Nginx after rollback..."
if docker compose exec -T nginx nginx -t; then docker compose exec -T nginx nginx -s reload || true; fi
sleep 2

echo "Verifying public health..."
curl -s -o /dev/null -w "%{http_code}" -m 10 "${APP_URL:-https://khcrf.org}"/api/health || true
curl -s -o /dev/null -w "%{http_code}" -m 10 "${APP_URL:-https://khcrf.org}"/ || true

echo "Rollback completed. Awaiting manual intervention."
exit 0
