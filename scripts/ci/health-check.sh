#!/bin/bash
set -euo pipefail

# scripts/ci/health-check.sh
# Verifies container health and application health after deployment

echo "Waiting for containers to stabilize (retry up to 60s)..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

export COMPOSE_FILE="${COMPOSE_FILE:-$REPO_ROOT/docker-compose.yml}"

# shellcheck disable=SC1090
if [ -f "$REPO_ROOT/releases/${RELEASE_SHA}/previous-images.env" ]; then
    source "$REPO_ROOT/releases/${RELEASE_SHA}/previous-images.env"
fi

VERDICT=0

if [ "${DEPLOY_BACKEND:-false}" == "true" ] || [ "${DEPLOY_PRISMA:-false}" == "true" ]; then
    echo "Checking Backend API Health..."

    # Stage 4A backend fault injection: when enabled, wait for the container to
    # report 'unhealthy' via Docker healthcheck rather than checking HTTP 200.
    # SIMULATE_BACKEND_FAILURE causes the Compose healthcheck to exit 1; the
    # application's /api/health still returns 200, so HTTP checks cannot detect it.
    if [ "${SIMULATE_BACKEND_FAILURE:-false}" == "true" ]; then
        echo "Backend fault injection mode: waiting for container to become unhealthy (up to 300s)..."
        BACKEND_CID=$(docker compose ps -q backend 2>/dev/null || echo "")
        HEALTH_STATUS="starting"
        for attempt in $(seq 1 30); do
            HEALTH_STATUS=$(docker inspect \
                --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' \
                "$BACKEND_CID" 2>/dev/null || echo "unknown")
            echo "Backend container health attempt ${attempt}/30: $HEALTH_STATUS"
            if [ "$HEALTH_STATUS" = "unhealthy" ]; then
                echo "Backend fault injection confirmed: container is unhealthy."
                VERDICT=1
                break
            fi
            sleep 10
        done
        if [ "$HEALTH_STATUS" != "unhealthy" ]; then
            echo "ERROR: Backend fault injection did not produce 'unhealthy' status after retries (got: $HEALTH_STATUS)."
            VERDICT=1
        fi
    else
        echo "Stage 1: Internal Backend health check..."
        INTERNAL_STATUS="0"
        for attempt in $(seq 1 30); do
            echo "Internal backend health attempt ${attempt}/30..."
            if docker compose exec -T backend node -e "
                fetch('http://127.0.0.1:4000/api/health')
                  .then(r => {
                    if (!r.ok) process.exit(1);
                    return r.text();
                  })
                  .then(console.log)
                  .catch(() => process.exit(1))
              " >/dev/null 2>&1; then
                INTERNAL_STATUS="1"
                break
            fi
            sleep 2
        done

        if [ "$INTERNAL_STATUS" != "1" ]; then
            echo "Backend internal health check failed (container unreachable or crashing)"
            VERDICT=1
        else
            echo "Backend internal health check passed. Container is up."
            
            echo "Reloading Nginx to clear stale upstreams..."
            docker compose exec -T nginx nginx -t && docker compose exec -T nginx nginx -s reload || echo "Nginx reload failed"
            sleep 3

            echo "Stage 2: External Backend health check..."
            HTTP_STATUS="000"
            for attempt in $(seq 1 5); do
                echo "External backend health attempt ${attempt}/5..."
                HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}" -m 10 "${APP_URL:-https://khcrf.org}"/api/health || echo "000")
                if [[ ! "$HTTP_STATUS" =~ ^[0-9]{3}$ ]]; then HTTP_STATUS="000"; fi
                if [ "$HTTP_STATUS" -eq 200 ]; then
                    break
                fi
                sleep 2
            done

            if [ "$HTTP_STATUS" -ne 200 ]; then
                echo "Backend external health check failed with status $HTTP_STATUS (NGINX ROUTING/DNS FAILURE)"
                docker compose exec -T nginx getent hosts backend || echo "Failed to resolve backend in nginx"
                VERDICT=1
            else
                echo "Backend external API health check passed."
                if [ "$VERDICT" -eq 0 ]; then
                    RESPONSE_SHA=$(curl -s -m 10 "${APP_URL:-https://khcrf.org}"/api/health | grep -o "$BACKEND_SHA" || true)
                    if [ -z "$RESPONSE_SHA" ]; then
                        echo "Backend did not return the expected release SHA ($BACKEND_SHA)."
                        VERDICT=1
                    fi
                fi
            fi
        fi
    fi

    if [ "${DEPLOY_FRONTEND:-false}" == "false" ]; then
        FRONTEND_CID_AFTER=$(docker compose ps -q frontend || echo "")
        if [ -n "${FRONTEND_CID_BEFORE:-}" ] && [ "$FRONTEND_CID_BEFORE" != "$FRONTEND_CID_AFTER" ]; then
            echo "ERROR: Frontend container was recreated during a backend-only deployment!"
            VERDICT=1
        fi
    fi
fi

if [ "${DEPLOY_FRONTEND:-false}" == "true" ]; then
    echo "Reloading Nginx to clear stale upstreams for Frontend..."
    docker compose exec -T nginx nginx -t && docker compose exec -T nginx nginx -s reload || echo "Nginx reload failed"
    sleep 3

    echo "Checking External Frontend health..."
    FRONTEND_OK=0
    for attempt in $(seq 1 30); do
        echo "External frontend homepage attempt ${attempt}/30..."
        BODY=$(curl -fsS --max-time 15 "${APP_URL:-https://khcrf.org}/" || echo "")
        if echo "$BODY" | grep -qi "Hamadan Craft Revival Foundation"; then
            FRONTEND_OK=1
            break
        fi
        sleep 2
    done
    if [ "$FRONTEND_OK" -ne 1 ]; then
        echo "Frontend external homepage failed (did not return expected content marker)"
        docker compose exec -T nginx getent hosts frontend || echo "Failed to resolve frontend in nginx"
        VERDICT=1
    else
        echo "Frontend external homepage passed."
    fi
    for route in "/state-of-kashmir-crafts/current-assessment-2026" "/publications" "/publications/premium-pricing-trends-in-luxury-handmade-products" "/publications/read/premium-pricing-trends-in-luxury-handmade-products"; do
        ROUTE_OK=0
        for attempt in $(seq 1 30); do
            echo "Frontend deep route check: ${route} (attempt ${attempt}/30)..."
            BODY=$(curl -fsS --max-time 10 "${APP_URL:-https://khcrf.org}${route}" || echo "")
            # We just need to assert that Next.js rendered the page (a basic HTML skeleton or title exists)
            # Not just a generic nginx 502 page. "Hamadan" is our stable marker.
            if echo "$BODY" | grep -qi "Hamadan Craft"; then
                ROUTE_OK=1
                break
            fi
            sleep 2
        done
        if [ "$ROUTE_OK" -ne 1 ]; then
            echo "Frontend deep route failed: ${route}"
            VERDICT=1
        else
            echo "Frontend deep route passed: ${route}"
        fi
    done

    # Stage 4A fault injection probe: when enabled, /stage4-health must return 503
    # to simulate a broken release and trigger rollback verification.
    # NOTE: /stage4-health (not /api/stage4-health) — the /api/* namespace is
    # proxied by Nginx to the backend; the frontend probe must live outside it.
    if [ "${STAGE4_FAULT_INJECTION_ENABLED:-false}" == "true" ]; then
        echo "Fault injection mode: waiting for /stage4-health to return 503 (up to 60s)..."
        PROBE_STATUS="000"
        for attempt in $(seq 1 30); do
            PROBE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -m 5 \
                "${APP_URL:-https://khcrf.org}"/stage4-health || echo "000")
            PROBE_STATUS=${PROBE_STATUS:-000}
            echo "Stage4 fault probe attempt ${attempt}/30: ${PROBE_STATUS}"
            if [ "$PROBE_STATUS" = "503" ]; then
                break
            fi
            sleep 2
        done
        echo "Stage4 fault probe final: $PROBE_STATUS"
        if [ "$PROBE_STATUS" = "503" ]; then
            echo "Fault injection confirmed active (503). Marking deployment as failed to trigger rollback."
            VERDICT=1
        else
            # Any response other than 503 means fault injection is not working.
            # Treat as a hard failure — do NOT silently pass.
            echo "ERROR: Fault injection probe returned $PROBE_STATUS (expected 503). Marking as failed."
            VERDICT=1
        fi
    fi

    if [ "${DEPLOY_BACKEND:-false}" == "false" ] && [ "${DEPLOY_PRISMA:-false}" == "false" ]; then
        BACKEND_CID_AFTER=$(docker compose ps -q backend || echo "")
        if [ -n "${BACKEND_CID_BEFORE:-}" ] && [ "$BACKEND_CID_BEFORE" != "$BACKEND_CID_AFTER" ]; then
            echo "ERROR: Backend container was recreated during a frontend-only deployment!"
            VERDICT=1
        fi
    fi
fi

if [ "$VERDICT" -ne 0 ]; then
    echo "Health checks FAILED. Dumping docker state before rollback..."
    docker compose ps || true
    echo "Dumping backend logs for debugging..."
    docker compose logs --tail=100 backend || echo "Failed to fetch backend logs."
    echo "Dumping nginx logs for debugging..."
    docker compose logs --tail=50 nginx || echo "Failed to fetch nginx logs."
    
    echo "Dumping frontend diagnostics for debugging..."
    docker logs frontend --tail=300 || true
    docker exec frontend ss -ltnp || true
    docker exec frontend sh -c "curl -I http://127.0.0.1:3000 || true" || true
    docker exec nginx sh -c "curl -I http://frontend:3000 || true" || true

    echo "Triggering rollback.sh automatically."
    if bash "$SCRIPT_DIR/rollback.sh"; then
        echo "Deployment failed due to health check. Rollback completed successfully."
        exit 1
    else
        echo "Deployment failed due to health check, AND Rollback failed."
        exit 2
    fi
fi

echo "Health checks PASSED."
exit 0
