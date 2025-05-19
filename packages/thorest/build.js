#!/usr/bin/env node

/**
 * Custom build script for the thorest package
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Clean the dist directory
if (fs.existsSync('./dist')) {
  fs.rmSync('./dist', { recursive: true, force: true });
}
fs.mkdirSync('./dist', { recursive: true });

// Run tsup without dts flag
console.log('Building with tsup...');
execSync('tsup-node src/index.ts --format cjs,esm --sourcemap', { stdio: 'inherit' });

console.log('Build completed successfully!'); 