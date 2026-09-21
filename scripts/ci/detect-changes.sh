#!/bin/bash
set -euo pipefail

# scripts/ci/detect-changes.sh
# Detects changed paths and validates requested deployment mode.

MODE="${1:-auto}"
BEFORE_SHA="${2:-}"
AFTER_SHA="${3:-}"

CHANGED_FRONTEND="false"
CHANGED_BACKEND="false"
CHANGED_PRISMA="false"
CHANGED_NGINX="false"
CHANGED_WORKFLOWS="false"
CHANGED_DOCS="false"

# Validate explicit manual modes
case "$MODE" in
  frontend) CHANGED_FRONTEND="true" ;;
  backend)  CHANGED_BACKEND="true" ;;
  both)     CHANGED_FRONTEND="true"; CHANGED_BACKEND="true" ;;
  nginx)    CHANGED_NGINX="true" ;;
  full)     CHANGED_FRONTEND="true"; CHANGED_BACKEND="true"; CHANGED_PRISMA="true"; CHANGED_NGINX="true" ;;
  dry-run)  echo "Dry-run mode selected. No deployments will occur."; exit 0 ;;
  auto)
    # Determine base for comparison
    BASE_SHA="$BEFORE_SHA"
    # Handle all-zero before SHA (e.g. branch creation or force push)
    if [[ -z "$BASE_SHA" || "$BASE_SHA" == *"0000000000000000000000000000000000000000"* ]]; then
        # Fallback to the previous commit on the same branch, or just deploy both if unknown
        BASE_SHA="${AFTER_SHA}^"
        # If there's no parent (first commit), this will fail, so we catch it
        if ! git rev-parse --verify "$BASE_SHA" >/dev/null 2>&1; then
            echo "Cannot determine comparison base (first commit or force push). Defaulting to full deploy."
            CHANGED_FRONTEND="true"
            CHANGED_BACKEND="true"
            CHANGED_PRISMA="true"
            CHANGED_NGINX="true"
        fi
    fi

    if [[ "$CHANGED_FRONTEND" == "false" ]]; then
        echo "Comparing $BASE_SHA to $AFTER_SHA"
        if ! CHANGED_FILES=$(git diff --name-only "$BASE_SHA" "$AFTER_SHA" 2>/dev/null); then
            echo "ERROR: git diff failed. Base SHA $BASE_SHA might be invalid. Defaulting to full deployment for safety."
            CHANGED_FRONTEND="true"
            CHANGED_BACKEND="true"
            CHANGED_PRISMA="true"
            CHANGED_NGINX="true"
            CHANGED_FILES=""
        fi

        for file in $CHANGED_FILES; do
            case "$file" in
                frontend/*) CHANGED_FRONTEND="true" ;;
                backend/prisma/schema.prisma|backend/prisma/migrations/*) CHANGED_PRISMA="true"; CHANGED_BACKEND="true" ;;
                backend/*) CHANGED_BACKEND="true" ;;
                nginx/*) CHANGED_NGINX="true" ;;
                .github/workflows/*|scripts/ci/*) CHANGED_WORKFLOWS="true" ;;
                docs/*|*.md) CHANGED_DOCS="true" ;;
                docker-compose.yml|docker-compose.*.yml) CHANGED_FRONTEND="true"; CHANGED_BACKEND="true"; CHANGED_NGINX="true" ;;
                shared/*|contracts/*|packages/types/*|openapi/*) CHANGED_FRONTEND="true"; CHANGED_BACKEND="true" ;;
            esac
        done
    fi
    ;;
  *)
    echo "ERROR: Invalid deployment mode: $MODE"
    exit 1
    ;;
esac

# Export for GitHub Actions
if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
    {
        echo "frontend=$CHANGED_FRONTEND"
        echo "backend=$CHANGED_BACKEND"
        echo "prisma=$CHANGED_PRISMA"
        echo "nginx=$CHANGED_NGINX"
        echo "workflows=$CHANGED_WORKFLOWS"
        echo "full=$([ "$CHANGED_FRONTEND" == "true" ] && [ "$CHANGED_BACKEND" == "true" ] && echo "true" || echo "false")"
    } >> "$GITHUB_OUTPUT"
fi

echo "Detected changes: Frontend=$CHANGED_FRONTEND, Backend=$CHANGED_BACKEND, Prisma=$CHANGED_PRISMA, Nginx=$CHANGED_NGINX, Workflows=$CHANGED_WORKFLOWS, Docs=$CHANGED_DOCS"
