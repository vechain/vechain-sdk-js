#!/bin/bash

set -e  # Exit on error

EXAMPLES_DIR="./examples"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Updating examples yarn.lock files..."

# Find all subdirectories in examples (excluding node_modules and hidden dirs)
find "$EXAMPLES_DIR" -mindepth 1 -maxdepth 2 -type d -not -name "node_modules" -not -name ".*" | while read -r example_dir; do
    example_name=$(basename "$example_dir")
    echo ""
    echo "============================================="
    echo "Updating yarn.lock file for: $example_name"
    echo "============================================="
    
    package_json="$example_dir/package.json"
    
    # Check if package.json exists
    if [ ! -f "$package_json" ]; then
        echo "⚠️  No package.json found, skipping..."
        continue
    fi

    yarn_lock="$example_dir/yarn.lock"
    yarnrc="$example_dir/.yarnrc.yml"

    # Skip examples that don't have a yarn.lock (only handle lockfile-managed examples)
    if [ ! -f "$yarn_lock" ]; then
        echo "⏭️  No yarn.lock found, skipping: $example_name"
        continue
    fi
    
    # Create .yarnrc.yml for node_modules mode if it doesn't exist
    if [ ! -f "$yarnrc" ]; then
        echo "⚙️  Configuring yarn for node_modules..."
        echo "nodeLinker: node-modules" > "$yarnrc"
    fi
    
    # Disable hardened mode
    if ! grep -q "enableHardenedMode" "$yarnrc"; then
        echo "enableHardenedMode: false" >> "$yarnrc"
    fi
    
    # Clean up old installations to avoid portal conflicts
    echo "🧹 Cleaning old dependencies..."
    rm -rf "$example_dir/node_modules"
    
    # Install dependencies and allow yarn.lock updates
    echo "📦 Installing dependencies (updating yarn.lock)..."
    (cd "$example_dir" && corepack yarn install --no-immutable > /dev/null 2>&1)
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ COMPLETED: $example_name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
done

echo ""
echo "========================================="
echo "✅ All examples yarn.lock files updated!"
echo "========================================="

