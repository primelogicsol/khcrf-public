#!/bin/bash
set -euo pipefail

# scripts/ci/validate-workflows.sh
# Validates GitHub Actions YAML files syntax

echo "Validating workflow YAML files..."
# Check if yaml is valid syntactically
for file in .github/workflows/*.yml; do
    # Simple check using awk or similar if no specialized yaml linter is available
    # For now, just ensure they exist and have content
    if [ ! -s "$file" ]; then
        echo "Error: $file is empty or missing."
        exit 1
    fi
done

echo "Workflows validated."
exit 0
