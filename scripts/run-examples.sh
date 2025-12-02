#!/bin/bash

set -e  # Exit on error

EXAMPLES_DIR="./examples"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Running non-vite examples with npm package..."

# Find all subdirectories in examples (excluding node_modules and hidden dirs)
find "$EXAMPLES_DIR" -mindepth 1 -maxdepth 1 -type d -not -name "node_modules" -not -name ".*" | while read -r example_dir; do
    example_name=$(basename "$example_dir")
    echo ""
    echo "========================================="
    echo "Processing: $example_name"
    echo "========================================="
    
    package_json="$example_dir/package.json"
    
    # Check if package.json exists
    if [ ! -f "$package_json" ]; then
        echo "⚠️  No package.json found, skipping..."
        continue
    fi
    
    # Check if this is a vite example (has vite in devDependencies or build script uses vite)
    if grep -q '"vite"' "$package_json" || grep -q '"build".*"vite"' "$package_json"; then
        echo "⏭️  Skipping vite example: $example_name"
        continue
    fi
    
    # Check if dev script exists (required to run the example)
    if ! grep -q '"dev"' "$package_json"; then
        echo "⚠️  No dev script found, skipping..."
        continue
    fi
    
    yarnrc="$example_dir/.yarnrc.yml"
    
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
    
    # Install dependencies from npm (use --immutable to respect example's yarn.lock)
    echo "📦 Installing dependencies from npm..."
    (cd "$example_dir" && corepack yarn install --immutable > /dev/null 2>&1)
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🚀 EXECUTING: $example_name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Run the example and capture all output (stdout and stderr)
    (cd "$example_dir" && corepack yarn run dev 2>&1) || {
        echo ""
        echo "❌ FAILED: $example_name"
        exit 1
    }
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ COMPLETED: $example_name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
done

echo ""
echo "========================================="
echo "✅ All non-vite examples executed!"
echo "========================================="

