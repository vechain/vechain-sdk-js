#!/bin/bash

set -e  # Exit on error

EXAMPLES_DIR="./examples"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Building and testing vite examples with npm package..."

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
    if ! grep -q '"vite"' "$package_json"; then
        echo "⏭️  Skipping non-vite example: $example_name"
        continue
    fi
    
    # Check if build script exists
    if ! grep -q '"build"' "$package_json"; then
        echo "⚠️  No build script found, skipping..."
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
    rm -rf "$example_dir/dist"
    
    # Install dependencies from npm (use --immutable to respect example's yarn.lock)
    echo "📦 Installing dependencies from npm..."
    (cd "$example_dir" && corepack yarn install --immutable > /dev/null 2>&1)
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔨 BUILDING: $example_name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Build the example
    (cd "$example_dir" && corepack yarn build 2>&1) || {
        echo ""
        echo "❌ BUILD FAILED: $example_name"
        exit 1
    }
    
    # Verify build output exists
    if [ ! -d "$example_dir/dist" ]; then
        echo ""
        echo "❌ BUILD OUTPUT MISSING: $example_name (dist directory not found)"
        exit 1
    fi
    
    # Check if index.html exists in dist
    if [ ! -f "$example_dir/dist/index.html" ]; then
        echo ""
        echo "❌ BUILD OUTPUT INCOMPLETE: $example_name (index.html not found in dist)"
        exit 1
    fi
    
    # Verify HTML content contains expected elements
    echo "🔍 Verifying build output..."
    html_content=$(cat "$example_dir/dist/index.html")
    
    # Check for basic HTML structure
    if ! echo "$html_content" | grep -q "<!DOCTYPE html\|<html"; then
        echo ""
        echo "❌ INVALID HTML: $example_name (missing HTML structure)"
        exit 1
    fi
    
    # Check for app container
    if ! echo "$html_content" | grep -q "id=\"app\""; then
        echo ""
        echo "⚠️  WARNING: $example_name (app container not found, but build succeeded)"
    fi
    
    # Check for script tags (Vite bundles)
    if ! echo "$html_content" | grep -q "<script"; then
        echo ""
        echo "⚠️  WARNING: $example_name (no script tags found, but build succeeded)"
    fi
    
    # Verify example-specific content
    if [ "$example_name" = "vite-thor-client-example" ]; then
        if ! echo "$html_content" | grep -q "VeChain.*Thor.*Client"; then
            echo ""
            echo "⚠️  WARNING: $example_name (expected content not found in HTML, but build succeeded)"
        else
            echo "✓ Verified: Expected content found in HTML"
        fi
    fi
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ BUILD SUCCESS: $example_name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
done

echo ""
echo "========================================="
echo "✅ All vite examples built successfully!"
echo "========================================="

