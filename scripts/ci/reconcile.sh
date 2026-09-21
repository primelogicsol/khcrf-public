#!/bin/bash
set -euo pipefail

# scripts/ci/reconcile.sh
# Implements production-state reconciliation for frontend and backend independently.

echo "Reconciling desired state with actual production state..."

# 1. Determine desired SHAs based on git log
DESIRED_FRONTEND=$(git log -n 1 --pretty=format:%H -- frontend/ docker-compose.yml 2>/dev/null || git rev-parse HEAD)
DESIRED_BACKEND=$(git log -n 1 --pretty=format:%H -- backend/ prisma/ docker-compose.yml 2>/dev/null || git rev-parse HEAD)

# If git log returns empty (e.g., shallow clone), fallback to HEAD
if [ -z "$DESIRED_FRONTEND" ]; then DESIRED_FRONTEND=$(git rev-parse HEAD); fi
if [ -z "$DESIRED_BACKEND" ]; then DESIRED_BACKEND=$(git rev-parse HEAD); fi

echo "Desired Frontend SHA: $DESIRED_FRONTEND"
echo "Desired Backend SHA: $DESIRED_BACKEND"

# 2. Inspect actual running state on VPS
if [ -z "${VPS_SSH_KEY:-}" ]; then
    echo "VPS_SSH_KEY not set. Cannot reconcile state. Defaulting to missing."
    RUNNING_FRONTEND="missing"
    RUNNING_BACKEND="missing"
    FRONTEND_HEALTH="000"
    BACKEND_HEALTH="000"
else
    echo "Connecting to VPS to check state..."
    printf "%s\n" "$VPS_SSH_KEY" > /tmp/id_rsa
    chmod 600 /tmp/id_rsa
    mkdir -p ~/.ssh
    ssh-keyscan -H "$VPS_HOST" >> ~/.ssh/known_hosts 2>/dev/null

    ssh -T -i /tmp/id_rsa -o StrictHostKeyChecking=no "deploy@${VPS_HOST}" 'bash -s' << 'EOF' > /tmp/vps_state.json
        set -euo pipefail
        
        # Redirect all subsequent diagnostic/error output to stderr
        exec 3>&1
        exec 1>&2

        RUNNING_FRONTEND=$(docker inspect --format='{{.Config.Image}}' $(docker compose -f ~/app/docker-compose.yml ps -q frontend 2>/dev/null || true) 2>/dev/null | awk -F: '{print $NF}' || echo "")
        if [ -z "$RUNNING_FRONTEND" ]; then RUNNING_FRONTEND="missing"; fi
        
        RUNNING_BACKEND=$(docker inspect --format='{{.Config.Image}}' $(docker compose -f ~/app/docker-compose.yml ps -q backend 2>/dev/null || true) 2>/dev/null | awk -F: '{print $NF}' || echo "")
        if [ -z "$RUNNING_BACKEND" ]; then RUNNING_BACKEND="missing"; fi
        
        # Check health locally on the VPS
        FRONTEND_HEALTH=$(curl -s -m 5 -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
        BACKEND_HEALTH=$(curl -s -m 5 -o /dev/null -w "%{http_code}" http://localhost:4000/api/health || echo "000")
        
        # Print JSON strictly to stdout (fd 3)
        printf '{\n' >&3
        printf '  "running_frontend": "%s",\n' "$RUNNING_FRONTEND" >&3
        printf '  "running_backend": "%s",\n' "$RUNNING_BACKEND" >&3
        printf '  "frontend_health": "%s",\n' "$FRONTEND_HEALTH" >&3
        printf '  "backend_health": "%s"\n' "$BACKEND_HEALTH" >&3
        printf '}\n' >&3
EOF

    # Validate JSON before parsing
    if ! jq empty /tmp/vps_state.json >/dev/null 2>&1; then
        echo "ERROR: Invalid JSON returned from VPS. Raw output:"
        nl -ba /tmp/vps_state.json
        exit 1
    fi

    RUNNING_FRONTEND=$(jq -r '.running_frontend // "missing"' /tmp/vps_state.json)
    RUNNING_BACKEND=$(jq -r '.running_backend // "missing"' /tmp/vps_state.json)
    FRONTEND_HEALTH=$(jq -r '.frontend_health // "000"' /tmp/vps_state.json)
    BACKEND_HEALTH=$(jq -r '.backend_health // "000"' /tmp/vps_state.json)

    rm -f /tmp/id_rsa /tmp/vps_state.json
fi

echo "Running Frontend SHA: $RUNNING_FRONTEND (Health: $FRONTEND_HEALTH)"
echo "Running Backend SHA: $RUNNING_BACKEND (Health: $BACKEND_HEALTH)"

# 3. Calculate deployment needs
FRONTEND_DEPLOY_REQUIRED="false"
if [ "$RUNNING_FRONTEND" != "$DESIRED_FRONTEND" ] || [ "$RUNNING_FRONTEND" == "missing" ] || [ "$FRONTEND_HEALTH" != "200" ]; then
    FRONTEND_DEPLOY_REQUIRED="true"
fi

BACKEND_DEPLOY_REQUIRED="false"
if [ "$RUNNING_BACKEND" != "$DESIRED_BACKEND" ] || [ "$RUNNING_BACKEND" == "missing" ] || [ "$BACKEND_HEALTH" != "200" ]; then
    BACKEND_DEPLOY_REQUIRED="true"
fi

# 4. Check registry existence
FRONTEND_IMAGE_EXISTS="false"
if curl -s -f "https://hub.docker.com/v2/repositories/${DOCKER_USERNAME:-faiz443}/hcrf-frontend/tags/${DESIRED_FRONTEND}" >/dev/null; then
    FRONTEND_IMAGE_EXISTS="true"
fi

BACKEND_IMAGE_EXISTS="false"
if curl -s -f "https://hub.docker.com/v2/repositories/${DOCKER_USERNAME:-faiz443}/hcrf-backend/tags/${DESIRED_BACKEND}" >/dev/null; then
    BACKEND_IMAGE_EXISTS="true"
fi

# 5. Calculate build needs
FRONTEND_BUILD_REQUIRED="false"
if [ "$FRONTEND_DEPLOY_REQUIRED" == "true" ] && [ "$FRONTEND_IMAGE_EXISTS" == "false" ]; then
    FRONTEND_BUILD_REQUIRED="true"
fi

BACKEND_BUILD_REQUIRED="false"
if [ "$BACKEND_DEPLOY_REQUIRED" == "true" ] && [ "$BACKEND_IMAGE_EXISTS" == "false" ]; then
    BACKEND_BUILD_REQUIRED="true"
fi

echo "Frontend:"
echo "- desired SHA: $DESIRED_FRONTEND"
echo "- running SHA: $RUNNING_FRONTEND"
echo "- image exists: $FRONTEND_IMAGE_EXISTS"
echo "- build required: $FRONTEND_BUILD_REQUIRED"
echo "- deploy required: $FRONTEND_DEPLOY_REQUIRED"
echo ""
echo "Backend:"
echo "- desired SHA: $DESIRED_BACKEND"
echo "- running SHA: $RUNNING_BACKEND"
echo "- image exists: $BACKEND_IMAGE_EXISTS"
echo "- build required: $BACKEND_BUILD_REQUIRED"
echo "- deploy required: $BACKEND_DEPLOY_REQUIRED"
echo ""

# 6. Output to GitHub Actions
if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
    {
        echo "frontend_build_required=$FRONTEND_BUILD_REQUIRED"
        echo "backend_build_required=$BACKEND_BUILD_REQUIRED"
        echo "frontend_deploy_required=$FRONTEND_DEPLOY_REQUIRED"
        echo "backend_deploy_required=$BACKEND_DEPLOY_REQUIRED"
        
        # Legacy mappings for backward compatibility during transition
        echo "frontend=$FRONTEND_BUILD_REQUIRED"
        echo "backend=$BACKEND_BUILD_REQUIRED"
        
        echo "desired_frontend=$DESIRED_FRONTEND"
        echo "desired_backend=$DESIRED_BACKEND"
        echo "running_frontend=$RUNNING_FRONTEND"
        echo "running_backend=$RUNNING_BACKEND"
        echo "frontend_health=$FRONTEND_HEALTH"
        echo "backend_health=$BACKEND_HEALTH"
    } >> "$GITHUB_OUTPUT"
fi

# 5. Check if Nginx or Prisma Migrations changed
NGINX_CHANGED="false"
if ! git diff --quiet HEAD~1 HEAD -- nginx/ 2>/dev/null; then
    NGINX_CHANGED="true"
fi

PRISMA_CHANGED="false"
if ! git diff --quiet HEAD~1 HEAD -- backend/prisma/migrations/ 2>/dev/null; then
    PRISMA_CHANGED="true"
fi

if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
    echo "nginx=$NGINX_CHANGED" >> "$GITHUB_OUTPUT"
    echo "prisma=$PRISMA_CHANGED" >> "$GITHUB_OUTPUT"
fi
