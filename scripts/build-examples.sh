#!/bin/bash

set -e  # Exit on error

EXAMPLES_DIR="./examples"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Building examples with npm package..."

# Find all subdirectories in examples (excluding node_modules and hidden dirs)
find "$EXAMPLES_DIR" -mindepth 1 -maxdepth 1 -type d -not -name "node_modules" -not -name ".*" | while read -r example_dir; do
    example_name=$(basename "$example_dir")
    echo ""
    echo "========================================="
    echo "Processing: $example_name"
    echo "========================================="
    
    package_json="$example_dir/package.json"
    yarnrc="$example_dir/.yarnrc.yml"
    
    # Check if package.json exists
    if [ ! -f "$package_json" ]; then
        echo "⚠️  No package.json found, skipping..."
        continue
    fi

    # Create .yarnrc.yml for node_modules mode if it doesn't exist
    if [ ! -f "$yarnrc" ]; then
        echo "⚙️  Configuring yarn for node_modules..."
        echo "nodeLinker: node-modules" > "$yarnrc"
    fi

    # Clean up old installations
    rm -rf "$example_dir/node_modules"

    
    # Install dependencies (use --immutable to respect example's yarn.lock)
    echo "📦 Installing dependencies..."
    (cd "$example_dir" && corepack yarn install --immutable)
    
    # Build (if build script exists)
    if grep -q '"build"' "$package_json"; then
        echo "🔨 Building..."
        (cd "$example_dir" && corepack yarn build)
    else
        echo "ℹ️  No build script found, skipping build..."
    fi
    
    echo "✅ Completed: $example_name"
done

echo ""
echo "========================================="
echo "✅ All examples processed!"
echo "========================================="