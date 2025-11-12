#!/bin/bash

set -e  # Exit on error

EXAMPLES_DIR="./examples"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Building examples with local SDK..."

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
    
    # Backup package.json
    cp "$package_json" "$package_json.backup"
    
    # Replace the dependency
    if grep -q '"@vechain/sdk-temp": "latest"' "$package_json"; then
        echo "📝 Updating dependency to local portal..."
        sed -i.tmp 's/"@vechain\/sdk-temp": "latest"/"@vechain\/sdk-temp": "portal:..\/..\/packages\/sdk"/g' "$package_json"
        rm -f "$package_json.tmp"
    else
        echo "⚠️  '@vechain/sdk-temp': 'latest' not found in package.json"
    fi
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    (cd "$example_dir" && corepack yarn install)
    
    # Build (if build script exists)
    if grep -q '"build"' "$package_json"; then
        echo "🔨 Building..."
        (cd "$example_dir" && corepack yarn build)
    else
        echo "ℹ️  No build script found, skipping build..."
    fi
    
    # Restore original package.json
    echo "♻️  Restoring package.json..."
    mv "$package_json.backup" "$package_json"
    
    echo "✅ Completed: $example_name"
done

echo ""
echo "========================================="
echo "✅ All examples processed!"
echo "========================================="