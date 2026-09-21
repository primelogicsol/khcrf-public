#!/bin/bash
set -euo pipefail

# scripts/ci/deploy.sh
# Executes the deployment strategy on the VPS.
# Uses BACKEND_SHA / FRONTEND_SHA env vars (decoupled from RELEASE_SHA) so that
# a frontend-only or backend-only deploy never causes the unchanged service to be
# recreated by Docker Compose detecting a stale image reference.

echo "Starting incremental deployment process..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

export COMPOSE_FILE="${COMPOSE_FILE:-$REPO_ROOT/docker-compose.yml}"

# Helper: get the image tag currently running for a compose service (project-aware)
running_image_tag() {
    local service="$1"
    local cid
    cid=$(docker compose ps -q "$service" 2>/dev/null || echo "")
    if [ -z "$cid" ]; then echo ""; return; fi
    docker inspect --format='{{.Config.Image}}' "$cid" 2>/dev/null \
        | awk -F: '{print $NF}' || echo ""
}

# ── 1. Resolve per-service SHAs ───────────────────────────────────────────────
# RELEASE_SHA is the tag of the new image being deployed this run.
# For incremental deploys only one service changes; pin the other to its
# currently-running tag so Compose sees zero diff and leaves it untouched.

export BACKEND_SHA="${BACKEND_SHA:-$RELEASE_SHA}"
export FRONTEND_SHA="${FRONTEND_SHA:-$RELEASE_SHA}"

if [ "${DEPLOY_BACKEND:-false}" != "true" ] && [ "${DEPLOY_PRISMA:-false}" != "true" ]; then
    # Frontend-only deploy: pin backend SHA to whatever is running now
    RUNNING_BACKEND_TAG=$(running_image_tag backend)
    if [ -n "$RUNNING_BACKEND_TAG" ]; then
        echo "Frontend-only deploy: pinning BACKEND_SHA=$RUNNING_BACKEND_TAG (running)"
        export BACKEND_SHA="$RUNNING_BACKEND_TAG"
    fi
fi

if [ "${DEPLOY_FRONTEND:-false}" != "true" ]; then
    # Backend-only deploy: pin frontend SHA to whatever is running now
    RUNNING_FRONTEND_TAG=$(running_image_tag frontend)
    if [ -n "$RUNNING_FRONTEND_TAG" ]; then
        echo "Backend-only deploy: pinning FRONTEND_SHA=$RUNNING_FRONTEND_TAG (running)"
        export FRONTEND_SHA="$RUNNING_FRONTEND_TAG"
    fi
fi

echo "Resolved image tags: BACKEND_SHA=$BACKEND_SHA  FRONTEND_SHA=$FRONTEND_SHA"

# ── 2. Capture current images for rollback ────────────────────────────────────
BACKEND_CID=$(docker compose ps -q backend 2>/dev/null || echo "")
FRONTEND_CID=$(docker compose ps -q frontend 2>/dev/null || echo "")

PREV_BACKEND_IMAGE=""
PREV_FRONTEND_IMAGE=""
if [ -n "$BACKEND_CID" ]; then
    PREV_BACKEND_IMAGE=$(docker inspect --format='{{.Config.Image}}' "$BACKEND_CID" 2>/dev/null || echo "")
fi
if [ -n "$FRONTEND_CID" ]; then
    PREV_FRONTEND_IMAGE=$(docker inspect --format='{{.Config.Image}}' "$FRONTEND_CID" 2>/dev/null || echo "")
fi

export PREV_BACKEND_IMAGE PREV_FRONTEND_IMAGE

# Container IDs before this deploy (used by health-check.sh to detect unwanted recreation)
export BACKEND_CID_BEFORE="$BACKEND_CID"
export FRONTEND_CID_BEFORE="$FRONTEND_CID"

mkdir -p "$REPO_ROOT/releases/${RELEASE_SHA}"
cat <<EOF > "$REPO_ROOT/releases/${RELEASE_SHA}/previous-images.env"
PREVIOUS_FRONTEND_IMAGE=$PREV_FRONTEND_IMAGE
PREVIOUS_BACKEND_IMAGE=$PREV_BACKEND_IMAGE
TARGET_FRONTEND_IMAGE=${DOCKER_USERNAME:-faiz443}/hcrf-frontend:${FRONTEND_SHA}
TARGET_BACKEND_IMAGE=${DOCKER_USERNAME:-faiz443}/hcrf-backend:${BACKEND_SHA}
FRONTEND_CID_BEFORE=$FRONTEND_CID_BEFORE
BACKEND_CID_BEFORE=$BACKEND_CID_BEFORE
EOF

echo "Rollback manifest written to releases/${RELEASE_SHA}/previous-images.env"

# ── 3. Prisma migrations ──────────────────────────────────
if [ "${DEPLOY_BACKEND:-false}" == "true" ] || [ "${DEPLOY_PRISMA:-false}" == "true" ]; then
    echo "Running Prisma Migrations..."
    docker compose run --rm backend npx prisma migrate deploy || exit 1
    echo "Seeding Canonical 2026 Hearings Data..."
    docker compose run --rm backend npx tsx prisma/seedCanonical2026.ts || exit 1
fi

# ── 4. Deploy Services ───────────────────────────────────────────
SERVICES=()

if [ "${DEPLOY_FRONTEND:-false}" == "true" ]; then
    SERVICES+=(frontend)
fi

if [ "${DEPLOY_BACKEND:-false}" == "true" ] || [ "${DEPLOY_PRISMA:-false}" == "true" ]; then
    SERVICES+=(backend)
fi

if [ ${#SERVICES[@]} -eq 0 ]; then
    echo "No services require deployment"
    exit 0
fi

echo "Cleaning up old docker images to prevent ENOSPC..."
	docker image prune -a -f --filter "until=24h" || true
	docker builder prune -a -f || true
	echo "Deploying services: ${SERVICES[*]}"
docker compose pull "${SERVICES[@]}"
docker compose up -d --no-deps --force-recreate "${SERVICES[@]}"

# ── 6. Reload Nginx (if changed) ──────────────────────────────────────────────
if [ "${CHANGED_NGINX:-false}" == "true" ]; then
    echo "Reloading Nginx..."
    docker compose up -d --no-deps nginx
    docker compose exec -T nginx nginx -s reload || echo "Nginx reload failed, it may have restarted cleanly."
fi

# Cleanup dangling images (not running containers)
docker image prune -f

echo "Deployment steps finished. Proceeding to health checks..."
